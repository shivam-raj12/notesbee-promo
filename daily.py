#!/usr/bin/env python3
"""NotesBee 100-day promo generator — daily entry point.

  python3 daily.py --day 1            # full 1080x1920 render -> output/NotesBee-Day-01.mp4
  python3 daily.py --day 27 --preview # fast 540x960 preview render

Pipeline: validate assets -> narration (TTS + timing) -> audio mix ->
frame render -> mux -> verify -> deliver.
"""
import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SCRIPTS = ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))

import assets as assets_mod  # noqa: E402
import narration as narration_mod  # noqa: E40
import mix as mix_mod  # noqa: E402
import render_frames as render_mod  # noqa: E402


def run(cmd, **kw):
    print(f"[daily] $ {' '.join(str(c) for c in cmd)}")
    subprocess.run(cmd, check=True, **kw)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--day", type=int, required=True)
    ap.add_argument("--preview", action="store_true", help="fast 540x960 preview")
    ap.add_argument("--fps", type=int, default=0, help="override fps (preview/testing)")
    ap.add_argument("--skip-verify", action="store_true")
    ap.add_argument("--force", action="store_true", help="re-render even if output exists")
    args = ap.parse_args()

    if not (1 <= args.day <= 100):
        raise SystemExit("--day must be in 1..100")

    cfg = json.loads((ROOT / "config/campaign.json").read_text())
    cfg["day"] = args.day
    (ROOT / "config/campaign.json").write_text(json.dumps(cfg, indent=2))

    out_name = f"NotesBee-Day-{args.day:02d}" + ("_preview" if args.preview else "") + ".mp4"
    out_path = ROOT / "output" / out_name
    if out_path.exists() and not args.force:
        print(f"[daily] {out_path.relative_to(ROOT)} already exists (use --force to re-render)")
        return

    t0 = time.time()

    print(f"[daily] === DAY {args.day} ===")
    st = assets_mod.ensure_assets(cfg)
    if st["placeholders"]:
        print("[daily] WARNING: using PLACEHOLDER assets:", ", ".join(st["placeholders"]))
        print("[daily]          drop your real files into assets/ for the final look.")

    print("[daily] step 1/4: narration + timing")
    narration_mod.build_timing(args.day, cfg)

    print("[daily] step 2/4: audio mix (narration + sfx + music)")
    audio = mix_mod.mix(args.day, cfg)

    print("[daily] step 3/4: frame render")
    silent = ROOT / "build" / f"video_day{args.day}{'_preview' if args.preview else ''}.mp4"
    render_mod.render(args.day, args.preview, silent, cfg, args.fps)

    print("[daily] step 4/4: mux + finalize")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    run(["ffmpeg", "-y", "-v", "error", "-i", str(silent), "-i", str(audio),
         "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
         "-shortest", "-movflags", "+faststart", str(out_path)])

    if not args.skip_verify and not args.preview:
        print("[daily] verifying…")
        rc = subprocess.run([sys.executable, str(SCRIPTS / "verify.py"),
                             "--day", str(args.day), "--video", str(out_path)]).returncode
        if rc != 0:
            raise SystemExit("[daily] verification FAILED — see build/verify_day{}.json".format(args.day))
    print(f"[daily] DONE in {time.time() - t0:.0f}s -> {out_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
