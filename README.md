# NotesBee Promo Generator

Automated, deterministic promo-video generator for the NotesBee 100-day
social-media challenge. One command per day:

```bash
python3 daily.py --day 1     # -> output/NotesBee-Day-01.mp4
python3 daily.py --day 2     # -> output/NotesBee-Day-02.mp4   (same video, DAY 2)
python3 daily.py --day 27 --preview   # fast 540x960 preview for checks
```

The video content, story, scenes, sound design and timing are identical every
day — only the day number changes (intro slam, challenge timeline, narration,
subtitles).

## What it produces

- 1080×1920 · 30fps · MP4 (H.264 + AAC) · ~73s vertical video
- Full feature story: notes + important WhatsApp chats, secure storage,
  chat analytics (messages / words / media), "left on read" clock moment,
  AI note enhancement, double-layer privacy, 1000+ backgrounds,
  AI-suggested backgrounds, collaboration, clean interface, product reveal,
  Google Play CTA
- Natural AI narration (edge-tts neural voice), word-synced animated
  subtitles with keyword highlighting, procedurally synthesized sound
  effects (50 events) and a procedurally composed background track with
  sidechain ducking under the voice
- All app UI (chat, dashboard, clock, locks, notes, gallery) is drawn
  procedurally with HTML/SVG/Canvas — no screenshots needed

## Setup

```bash
pip install -r requirements.txt
playwright install chromium        # one-time
ffmpeg -version                    # ffmpeg must be installed
```

Drop your two assets into `assets/`:

```
assets/notesbee-icon.png   (your app icon, >= 512x512)
assets/play-badge.png      (the official "Get it on Google Play" badge)
```

If they're missing, clearly-marked placeholders are generated so the
pipeline always runs (you'll see a warning).

## Daily workflow

```bash
python3 daily.py --day 42
```

1. validates assets
2. synthesizes narration for `DAY 42` (everything else is cached)
3. builds the audio mix (narration + SFX + music with ducking)
4. renders the animation deterministically, frame by frame
5. muxes + verifies (resolution, fps, audio levels, black frames,
   CTA badge/icon presence, subtitle safe area, SFX coverage)
6. writes `output/NotesBee-Day-42.mp4`

## Configuration

`config/campaign.json` — voice, music/SFX levels, resolution, asset paths.
The day number is normally passed via `--day` (it also updates the config).

## How it works

- `render/` — the animation engine. Pure functions of time: frame N is
  always identical (seeded PRNG, no wall-clock). 14 scenes built as one
  continuous visual journey with element hand-offs between sections
  (ring → terminal → timeline → chat input bar → bubbles → data → clock →
  lock → gallery → orbit → icon → CTA).
- `scripts/narration.py` — TTS with retries + caching; falls back to
  piper / your own wavs in `narration/custom/l1.wav…` / timed silence.
- `scripts/sfx.py`, `scripts/music.py` — procedural, royalty-free audio.
- `scripts/render_frames.py` — Playwright drives `window.__seek(t)` per
  frame and pipes frames into FFmpeg.
- `scripts/verify.py` — automated QA on the final MP4.
- `scripts/snap.py` — render single frames for visual QA.

## Legal notes

- No code or assets were copied from other projects; the engine is
  original. Audio is synthesized locally (no licensing risk).
- edge-tts uses Microsoft's neural voices via an unofficial API. If you
  prefer guaranteed commercial-safe voice, record the 26 short lines
  yourself and drop them in `narration/custom/` (l1.wav … l23.wav) —
  the pipeline picks them up automatically. Line texts are in
  `scripts/narration.py` (`SCRIPT`).
- The chat UI is a generic original design; it does not copy WhatsApp's
  branding or trade dress.
