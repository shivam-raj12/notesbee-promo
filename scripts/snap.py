#!/usr/bin/env python3
"""Snapshot tool: render individual frames to PNG for visual QA.
  python3 scripts/snap.py --day 1 --times 1.5,6,12,20 --scale 0.5 --out /tmp/snaps
"""
import argparse
import functools
import http.server
import json
import socketserver
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent


def start_server():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
    httpd = socketserver.TCPServer(("127.0.0.1", 0), handler)
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, port


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--day", type=int, default=1)
    ap.add_argument("--times", type=str, required=True)
    ap.add_argument("--scale", type=float, default=0.5)
    ap.add_argument("--out", type=str, default="/tmp/snaps")
    args = ap.parse_args()
    outdir = Path(args.out)
    outdir.mkdir(parents=True, exist_ok=True)
    W, H = int(1080 * args.scale), int(1920 * args.scale)
    httpd, port = start_server()
    url = f"http://127.0.0.1:{port}/render/index.html?day={args.day}&w={W}&h={H}"
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox", "--disable-dev-shm-usage"])
        page = browser.new_page(viewport={"width": W, "height": H})
        msgs = []
        page.on("console", lambda m: msgs.append(f"{m.type}: {m.text[:200]}"))
        page.on("pageerror", lambda e: msgs.append(f"PAGEERROR: {str(e)[:300]}"))
        page.goto(url)
        try:
            page.wait_for_function("window.__readyFlag === true", timeout=30000)
        except Exception:
            print("LOAD FAILED:", page.evaluate("window.__loadError || 'unknown'"))
            print("\n".join(msgs[-30:]))
            browser.close(); httpd.shutdown(); return
        for tstr in args.times.split(","):
            t = float(tstr)
            page.evaluate(f"window.__seek({t})")
            page.screenshot(path=str(outdir / f"t{t:06.2f}.png"))
            print("snap", t)
        errs = [m for m in msgs if "error" in m.lower()]
        if errs:
            print("CONSOLE ERRORS:")
            print("\n".join(errs[-20:]))
        browser.close()
    httpd.shutdown()


if __name__ == "__main__":
    main()
