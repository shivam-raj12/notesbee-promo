#!/usr/bin/env python3
"""Deterministic frame renderer: drives the HTML animation frame-by-frame via
Playwright and pipes PNG/JPEG frames into FFmpeg.

  python3 scripts/render_frames.py --day 1 [--preview] [--out build/video_day1.mp4]
"""
import argparse
import functools
import http.server
import json
import socketserver
import subprocess
import sys
import threading
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent


def start_server():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    httpd.RequestHandlerClass.log_message = lambda *a, **k: None
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, port


def render(day: int, preview: bool, out_path: Path, cfg: dict, fps_override: int = 0):
    timing = json.loads((ROOT / "build" / f"timing_day{day}.json").read_text())
    fps = fps_override or cfg["video"]["fps"]
    W = cfg["video"]["previewWidth"] if preview else cfg["video"]["width"]
    H = cfg["video"]["previewHeight"] if preview else cfg["video"]["height"]
    dur = timing["duration"]
    nframes = int(round(dur * fps))
    out_path.parent.mkdir(parents=True, exist_ok=True)

    httpd, port = start_server()
    url = f"http://127.0.0.1:{port}/render/index.html?day={day}&w={W}&h={H}"

    fmt_args = (["-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "medium", "-crf", "16"]
                if not preview else
                ["-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "veryfast", "-crf", "23"])
    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-v", "error",
         "-f", "image2pipe", "-framerate", str(fps), "-i", "-",
         "-an", *fmt_args, "-r", str(fps), "-video_size", f"{W}x{H}",
         "-movflags", "+faststart", str(out_path)],
        stdin=subprocess.PIPE)

    meta = {"day": day, "fps": fps, "w": W, "h": H, "duration": dur,
            "frames": nframes, "subtitleChecks": [], "heroChecks": []}

    t_start = time.time()
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage",
                                          "--force-color-profile=srgb", "--hide-scrollbars"])
        page = browser.new_page(viewport={"width": W, "height": H},
                                device_scale_factor=1)
        page.goto(url)
        try:
            page.wait_for_function("window.__readyFlag === true", timeout=30000)
        except Exception:
            err = page.evaluate("window.__loadError || 'unknown load failure'")
            browser.close()
            httpd.shutdown()
            raise SystemExit(f"[render] page failed to initialize: {err}")
        page.wait_for_function("document.fonts.status === 'loaded'", timeout=15000)
        page.wait_for_timeout(300)

        # sanity: meta
        info = page.evaluate("window.__meta()")
        meta["engine"] = info
        print(f"[render] {W}x{H}@{fps}  duration={dur:.2f}s  frames={nframes}")

        # JPEG pipe: ~6x faster than PNG; q95 is visually transparent after x264
        sshot_kw = {"type": "jpeg", "quality": 90 if preview else 95,
                    "animations": "disabled", "caret": "initial"}

        # subtitle sample times (midpoint of each line)
        line_mids = {round((l["start"] + l["end"]) / 2 * fps): l["id"] for l in timing["lines"]}

        for f in range(nframes):
            t = f / fps
            page.evaluate(f"window.__seek({t:.5f})")
            shot = page.screenshot(**sshot_kw)
            try:
                ff.stdin.write(shot)
            except BrokenPipeError:
                print("[render] ffmpeg pipe broke", file=sys.stderr)
                raise
            if f in line_mids:
                rect = page.evaluate("window.__subtitleRect()")
                meta["subtitleChecks"].append({"frame": f, "t": round(t, 3),
                                               "line": line_mids[f], "rect": rect})
            if f % 150 == 0 or f == nframes - 1:
                el = time.time() - t_start
                rate = (f + 1) / max(el, 0.01)
                print(f"[render] frame {f+1}/{nframes}  ({rate:.1f} fps, eta {(nframes-f-1)/max(rate,0.01):.0f}s)",
                      flush=True)
        browser.close()
    ff.stdin.close()
    rc = ff.wait()
    httpd.shutdown()
    if rc != 0:
        raise SystemExit(f"[render] ffmpeg failed with code {rc}")
    meta["renderSeconds"] = round(time.time() - t_start, 1)
    (ROOT / "build" / f"render_meta_day{day}{'_preview' if preview else ''}.json").write_text(json.dumps(meta, indent=1))
    print(f"[render] wrote {out_path.relative_to(ROOT)} in {meta['renderSeconds']}s")
    return out_path


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--day", type=int, required=True)
    ap.add_argument("--preview", action="store_true")
    ap.add_argument("--fps", type=int, default=0)
    ap.add_argument("--out", type=str, default=None)
    args = ap.parse_args()
    cfg = json.loads((ROOT / "config/campaign.json").read_text())
    out = Path(args.out) if args.out else ROOT / "build" / f"video_day{args.day}{'_preview' if args.preview else ''}.mp4"
    if not out.is_absolute():
        out = ROOT / out
    render(args.day, args.preview, out, cfg, args.fps)
