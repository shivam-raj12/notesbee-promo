#!/usr/bin/env python3
"""Generates a high-quality 1080x1920 JPEG thumbnail with profile-safe framing.

  python3 scripts/thumbnail.py --day 1
"""
import argparse
import http.server
from pathlib import Path
import socketserver
import threading
import time

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent


def find_free_port():
  with socketserver.TCPServer(("127.0.0.1", 0), None) as s:
    return s.server_address[1]


def start_server(port):
  class Handler(http.server.SimpleHTTPRequestHandler):

    def __init__(self, *args, **kwargs):
      super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *args):
      pass  # quiet output

  httpd = socketserver.TCPServer(("127.0.0.1", port), Handler)
  thread = threading.Thread(target=httpd.serve_forever, daemon=True)
  thread.start()
  return httpd


def main():
  ap = argparse.ArgumentParser()
  ap.add_argument("--day", type=int, default=1)
  args = ap.parse_args()

  port = find_free_port()
  httpd = start_server(port)

  out_dir = ROOT / "output"
  out_dir.mkdir(parents=True, exist_ok=True)
  out_file = out_dir / f"NotesBee-Day-{args.day:02d}-thumb.jpg"

  print(f"[thumbnail] Generating thumbnail for Day {args.day}...")

  with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(
        viewport={"width": 1080, "height": 1920}, device_scale_factor=1
    )
    url = f"http://127.0.0.1:{port}/render/thumbnail.html?day={args.day}"
    page.goto(url)
    page.wait_for_function("window.__ready")
    time.sleep(0.3)  # ensure font smoothing and drop-shadows settle

    page.screenshot(path=str(out_file), type="jpeg", quality=95)
    browser.close()

  httpd.shutdown()
  print(f"[thumbnail] Saved -> {out_file.relative_to(ROOT)}")


if __name__ == "__main__":
  main()