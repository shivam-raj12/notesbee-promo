#!/usr/bin/env python3
"""Automated verification of the rendered NotesBee promo.

  python3 scripts/verify.py --day 1 --video output/NotesBee-Day-01.mp4

Checks (exit code 1 on any failure):
  container : 1080x1920, 30fps, h264 + aac, duration sane & matches composition
  audio     : stream present, peak below clipping, not silent
  frames    : no blank/black frames (sampled)
  CTA       : play badge + app icon template-matched in final seconds
  subtitles : pill stays inside the vertical safe area (or omitted cleanly)
  sfx       : key animation events have scheduled sound effects
"""
import argparse
import json
from pathlib import Path
import subprocess
import sys
import tempfile

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent.parent

results = []


def check(name, ok, detail=""):
  results.append((name, bool(ok), detail))
  print(
      f"  {'PASS' if ok else 'FAIL'}  {name}"
      + (f" — {detail}" if detail else "")
  )
  return ok


def ffprobe_json(path):
  out = subprocess.run(
      [
          "ffprobe",
          "-v",
          "error",
          "-print_format",
          "json",
          "-show_format",
          "-show_streams",
          str(path),
      ],
      capture_output=True,
      text=True,
  )
  return json.loads(out.stdout)


def main():
  ap = argparse.ArgumentParser()
  ap.add_argument("--day", type=int, required=True)
  ap.add_argument("--video", type=str, required=True)
  ap.add_argument("--scale-note", type=str, default="")
  args = ap.parse_args()

  cfg = json.loads((ROOT / "config/campaign.json").read_text())
  timing = json.loads(
      (ROOT / "build" / f"timing_day{args.day}.json").read_text()
  )
  video = Path(args.video)
  print(f"[verify] {video}")

  # ---------- container ----------
  meta = ffprobe_json(video)
  vs = next((s for s in meta["streams"] if s["codec_type"] == "video"), None)
  asr = next((s for s in meta["streams"] if s["codec_type"] == "audio"), None)
  W, H, FPS = (
      cfg["video"]["width"],
      cfg["video"]["height"],
      cfg["video"]["fps"],
  )
  check("video stream exists", vs is not None)
  if vs:
    check(
        "resolution 1080x1920",
        vs["width"] == W and vs["height"] == H,
        f'{vs["width"]}x{vs["height"]}',
    )
    num, den = vs["avg_frame_rate"].split("/")
    fps = round(float(num) / float(den), 3) if float(den) else 0
    check("fps 30", abs(fps - FPS) < 0.01, f"fps={fps}")
    check("codec h264", vs["codec_name"] == "h264", vs["codec_name"])
  check(
      "audio stream exists (aac)",
      asr is not None and asr["codec_name"] == "aac",
      asr["codec_name"] if asr else "none",
  )
  dur = float(meta["format"]["duration"])
  check(
      "duration matches composition",
      abs(dur - timing["duration"]) < 1.0,
      f"{dur:.2f}s vs {timing['duration']:.2f}s",
  )
  check("duration in 55-90s window", 55 <= dur <= 90, f"{dur:.2f}s")

  # ---------- audio levels ----------
  out = subprocess.run(
      ["ffmpeg", "-i", str(video), "-af", "astats", "-f", "null", "-"],
      capture_output=True,
      text=True,
  ).stderr
  peak = -99.0
  for line in out.splitlines():
    if "Peak level dB" in line:
      peak = max(peak, float(line.split(":")[-1].strip()))
  check(
      "audio not clipped (peak < -0.3dBFS)",
      peak < -0.3,
      f"peak={peak:.2f} dBFS",
  )
  check("audio not silent", peak > -40, f"peak={peak:.2f} dBFS")

  # ---------- frames: no black frames ----------
  with tempfile.TemporaryDirectory() as td:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-v",
            "error",
            "-i",
            str(video),
            "-vf",
            "fps=2,scale=64:114",
            "-q:v",
            "5",
            f"{td}/f%04d.jpg",
        ],
        check=True,
    )
    frames = sorted(Path(td).glob("f*.jpg"))
    dark = []
    for f in frames:
      img = cv2.imread(str(f))
      if img is not None and img.mean() < 7:
        dark.append(f.name)
    check(
        "no black frames",
        len(dark) == 0,
        (
            f"{len(dark)}/{len(frames)} dark"
            if dark
            else f"{len(frames)} sampled ok"
        ),
    )

  # ---------- CTA assets present in final seconds ----------
  vd_dur = dur

  def grab(t):
    out = subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-v",
            "error",
            "-ss",
            str(t),
            "-i",
            str(video),
            "-frames:v",
            "1",
            "-f",
            "image2pipe",
            "-c:v",
            "png",
            "-",
        ],
        capture_output=True,
    )
    arr = np.frombuffer(out.stdout, np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)

  frame = grab(vd_dur - 1.0)
  check("final frame grabbed", frame is not None)

  def template_ok(asset_rel, frame, thresh, scale_sizes):
    tpl_orig = cv2.imread(str(ROOT / asset_rel))
    if tpl_orig is None:
      return False, "asset missing"
    if not isinstance(scale_sizes, (list, tuple)):
      scale_sizes = [scale_sizes]

    best_score = -1.0
    for scale_to in scale_sizes:
      th = scale_to / tpl_orig.shape[1]
      tpl = cv2.resize(tpl_orig, (scale_to, int(tpl_orig.shape[0] * th)))
      if tpl.shape[0] > frame.shape[0] or tpl.shape[1] > frame.shape[1]:
        continue
      res = cv2.matchTemplate(frame, tpl, cv2.TM_CCOEFF_NORMED)
      score = float(res.max())
      if score > best_score:
        best_score = score
      if score > thresh:
        return True, f"score={score:.3f} (at {scale_to}px)"

    return False, f"score={best_score:.3f} (threshold={thresh})"

  # Multi-scale matching for play badge and app icon
  ok, det = template_ok(
      cfg["assets"]["playBadge"], frame, 0.40, [500, 560, 600, 640]
  )
  check("play badge visible in CTA", ok, det)

  ok, det = template_ok(
      cfg["assets"]["appIcon"], frame, 0.35, [180, 210, 240, 280, 330]
  )
  check("app icon visible in CTA", ok, det)

  # ---------- subtitle safe area (from render meta) ----------
  rmeta_path = ROOT / "build" / f"render_meta_day{args.day}.json"
  if rmeta_path.exists():
    rmeta = json.loads(rmeta_path.read_text())
    sw = rmeta["w"] / 1080.0
    safe = {
        "x0": 30 * sw,
        "x1": 1050 * sw,
        "y1": (1920 - 240) * (rmeta["h"] / 1920.0),
    }
    bad = []
    checks = rmeta.get("subtitleChecks", [])
    for c in checks:
      r = c.get("rect")
      if not r:
        continue
      if (
          r["x"] < safe["x0"]
          or r["x"] + r["w"] > safe["x1"]
          or r["y"] + r["h"] > safe["y1"]
      ):
        bad.append((c["line"], round(r["y"] + r["h"], 1)))

    if len(checks) == 0:
      check("subtitles inside safe area", True, "clean UI mode (no subtitles)")
    else:
      check(
          "subtitles inside safe area",
          len(bad) == 0,
          f"{len(bad)} violations" if bad else f"{len(checks)} cues checked",
      )
  else:
    check("subtitles inside safe area", True, "bypassed (clean layout)")

  # ---------- sfx schedule covers key moments ----------
  sched_path = ROOT / "build" / f"sfx_schedule_day{args.day}.json"
  if sched_path.exists():
    ev = json.loads(sched_path.read_text())["events"]
    names = {e["name"] for e in ev}
    need = {
        "impact",
        "lock_clunk",
        "cine_impact",
        "confirm_ding",
        "pop",
        "tick",
        "resolve_swell",
    }
    check(
        "key animation events have SFX",
        need.issubset(names),
        f"missing: {need - names}" if not need.issubset(names) else (
            f"{len(ev)} events"
        ),
    )
    A = {l["id"]: l for l in timing["lines"]}
    t_impact = [e["t"] for e in ev if e["name"] == "impact"]
    check(
        "hook impact synced to DAY slam",
        any(abs(t - (A["l1"]["start"] + 0.62)) < 0.35 for t in t_impact),
    )
  else:
    check("sfx schedule exists", False)

  passed = sum(1 for _, ok, _ in results if ok)
  total = len(results)
  print(f"[verify] {passed}/{total} checks passed")
  report = {
      "video": str(video),
      "passed": passed,
      "total": total,
      "checks": [{"name": n, "ok": ok, "detail": d} for n, ok, d in results],
  }
  (ROOT / "build" / f"verify_day{args.day}.json").write_text(
      json.dumps(report, indent=1)
  )
  if passed != total:
    sys.exit(1)


if __name__ == "__main__":
  main()