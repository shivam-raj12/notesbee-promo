#!/usr/bin/env python3
"""Audio assembly: narration + procedural SFX + procedural music with
sidechain-style ducking. Outputs build/audio_day{N}.wav (48kHz stereo).

  python3 scripts/mix.py --day 1
"""
import argparse
import json
from pathlib import Path
import subprocess

import music as M
import numpy as np
import sfx as S

ROOT = Path(__file__).resolve().parent.parent
SR = S.SR


def read_wav(path):
  out = subprocess.run(
      [
          "ffmpeg",
          "-v",
          "error",
          "-i",
          str(path),
          "-f",
          "f32le",
          "-ac",
          "1",
          "-ar",
          str(SR),
          "-",
      ],
      capture_output=True,
      check=True,
  )
  return np.frombuffer(out.stdout, dtype=np.float32)


def place(bus, sig, at, gain=1.0):
  s0 = int(at * SR)
  if s0 >= bus.shape[1]:
    return
  m = min(len(sig), bus.shape[1] - s0)
  if m <= 0:
    return
  bus[0, s0 : s0 + m] += sig[:m] * gain
  bus[1, s0 : s0 + m] += sig[:m] * gain


def sfx_schedule(A):
  """SFX events [(time, name, gain, kwargs)]
  Synchronized to the clean Play Store redesign scenes.
  """
  ev = []
  add = lambda t, name, g=1.0, **kw: ev.append((t, name, g, kw))

  # --- S1: DAY HOOK ---
  # Badge intro whoosh and Day card impact (synced with verify.py at l1.s + 0.62)
  add(A["l1"]["s"] + 0.1, "whoosh", 0.6, dur=0.3)
  add(A["l1"]["s"] + 0.62, "impact", 0.85)

  # --- S2: SOLO DEVELOPER ---
  # App icon entry (A.l2.s) and floating badges pop (l2.s + 0.35, l2.s + 0.6)
  add(A["l2"]["s"], "whoosh", 0.5, dur=0.25)
  add(A["l2"]["s"] + 0.35, "pop", 0.65)
  add(A["l2"]["s"] + 0.6, "pop", 0.65)

  # --- S3: 100-DAY CHALLENGE ---
  # Progress board entrance
  add(A["l3"]["s"], "whoosh", 0.45, dur=0.25)
  # Badge 1 "No Paid Ads" (A.l4.s)
  add(A["l4"]["s"], "click", 0.75, freq=1800)
  # Badge 2 "Just Consistency" (A.l6.s)
  add(A["l6"]["s"], "confirm_ding", 0.75)

  # --- S4: MANAGE IMPORTANT CHATS ---
  # Phone slides in (A.l7.s)
  add(A["l7"]["s"] + 0.1, "whoosh", 0.5, dur=0.3)
  # Badge 1 "No Clutter" (A.l8.s)
  add(A["l8"]["s"], "pop", 0.65)
  # Badge 2 "Secure on Device" (A.l9.s)
  add(A["l9"]["s"], "lock_clunk", 0.8)

  # --- S5: INSTANTLY ANALYZE CHATS ---
  # Analytics board entry
  add(A["l10"]["s"] + 0.1, "whoosh", 0.5, dur=0.3)
  # Tick mark on data reveal
  add(A["l11"]["s"] + 0.2, "tick", 0.8)
  # Badge 1 "Vocabulary & Split" (A.l13.s)
  add(A["l13"]["s"], "pop", 0.65)
  # Badge 2 "Detailed Gaps" (A.l14.s)
  add(A["l14"]["s"], "pop", 0.65)

  # --- S6: LEFT ON READ ---
  # Silence gap card entry
  add(A["l15"]["s"] + 0.1, "whoosh", 0.5, dur=0.3)
  # "Let the data decide" impact (A.l16.s / A.l17.s)
  add(A["l16"]["s"], "tick", 0.9)
  add(A["l17"]["s"], "cine_impact", 0.8)

  # --- S7: AI NOTE ENHANCER ---
  # AI phone + auto-enhance chime & shimmer
  add(A["l18"]["s"], "whoosh", 0.45, dur=0.25)
  add(A["l19a"]["s"], "shimmer", 0.75)
  add(A["l19a"]["s"] + 0.25, "pop", 0.6)

  # --- S8: SECURE NOTES (PRIVACY) ---
  # Triple badge locks (l19b.s + 0.1, + 0.3, + 0.5)
  add(A["l19b"]["s"] + 0.1, "lock_clunk", 0.75)
  add(A["l19b"]["s"] + 0.3, "click", 0.65)
  add(A["l19b"]["s"] + 0.5, "lock_clunk", 0.8)

  # --- S9 & S10: 1000+ BACKGROUNDS ---
  # Background badges
  add(A["l19c"]["s"] + 0.1, "pop", 0.6)
  add(A["l19c"]["s"] + 0.3, "pop", 0.6)
  add(A["l19c"]["s"] + 0.5, "chime", 0.6, base=1400.0)

  # --- S11 & S12: COLLABORATION & CLEAN UI ---
  add(A["l19d"]["s"] + 0.1, "connect_blip", 0.7)
  add(A["l19d"]["s"] + 0.3, "connect_blip", 0.7)
  add(A["l19d"]["s"] + 0.5, "click", 0.65)

  # --- S13: PRODUCT REVEAL ---
  # Logo & title swell
  add(A["l20"]["s"], "resolve_swell", 0.8)

  # --- S14: PLAY STORE CTA ---
  # App icon & Google Play badge entry
  add(A["l21"]["s"] + 0.2, "whoosh", 0.5, dur=0.3)
  # Link in bio button
  add(A["l22"]["s"] + 0.4, "confirm_ding", 0.8)

  return ev


def smooth(x, win):
  win = max(1, int(win))
  return np.convolve(x, np.ones(win) / win, mode="same")


def mix(day: int, cfg: dict):
  timing = json.loads((ROOT / "build" / f"timing_day{day}.json").read_text())
  A = {l["id"]: {"s": l["start"], "e": l["end"]} for l in timing["lines"]}
  dur = timing["duration"] + 0.3
  n = int(dur * SR)

  # 1. Narration Track
  narration = np.zeros((2, n), dtype=np.float32)
  for l in timing["lines"]:
    sig = read_wav(ROOT / l["file"])
    place(narration, sig, l["start"], 1.0)

  # 2. SFX Bus
  sfx_bus = np.zeros((2, n), dtype=np.float32)
  events = sfx_schedule(A)
  sfx_gain = 10 ** (cfg["sfx"].get("volumeDb", -6) / 20) * 1.5
  if cfg["sfx"].get("enabled", True):
    for t0, name, g, kw in events:
      fn = S.REGISTRY[name]
      sig = fn(**kw)
      place(sfx_bus, sig, t0, g * sfx_gain)

  # 3. Music Bus with ducking
  music_bus = np.zeros((2, n), dtype=np.float32)
  if cfg["music"].get("enabled", True):
    music_bus = M.compose(timing["duration"], A)[:, :n]
    if music_bus.shape[1] < n:
      music_bus = np.pad(music_bus, ((0, 0), (0, n - music_bus.shape[1])))
    music_gain = 10 ** (cfg["music"].get("volumeDb", -16) / 20) * 1.5
    music_bus *= music_gain

    # Envelope ducking
    env = np.zeros(n, dtype=np.float32)
    for l in timing["lines"]:
      s0 = max(0, int((l["start"] - 0.12) * SR))
      e0 = min(n, int((l["end"] + 0.25) * SR))
      env[s0:e0] = 1.0
    env = smooth(env, 0.09 * SR)
    env = np.clip(env, 0, 1)
    duck = 1 - (1 - 10 ** (cfg["music"].get("duckDb", -12) / 20)) * env
    music_bus *= duck

  # 4. Master Bus Sum
  out = narration + sfx_bus + music_bus

  # 5. Two-stage Soft Limiter & True Normalization
  out = np.tanh(out * 0.85)

  # Hard target at -1.5 dBFS ensures AAC muxing stays strictly below -0.3 dBFS
  target_linear = 10 ** (-1.5 / 20)
  max_peak = np.max(np.abs(out))
  if max_peak > 0:
    out = out * (target_linear / max_peak)

  out_path = ROOT / "build" / f"audio_day{day}.wav"
  pcm = (np.clip(out, -1.0, 1.0).T * 32767).astype(np.int16)

  subprocess.run(
      [
          "ffmpeg",
          "-y",
          "-v",
          "error",
          "-f",
          "s16le",
          "-ar",
          str(SR),
          "-ac",
          "2",
          "-i",
          "-",
          "-c:a",
          "pcm_s16le",
          str(out_path),
      ],
      input=pcm.tobytes(),
      check=True,
  )

  sched = {
      "events": [{"t": round(t0, 3), "name": nm} for t0, nm, g, kw in events],
      "musicEnabled": cfg["music"].get("enabled", True),
  }
  (ROOT / "build" / f"sfx_schedule_day{day}.json").write_text(
      json.dumps(sched, indent=1)
  )
  print(
      f"[mix] {len(events)} sfx events, duration={dur:.2f}s ->"
      f" {out_path.relative_to(ROOT)}"
  )
  return out_path


if __name__ == "__main__":
  ap = argparse.ArgumentParser()
  ap.add_argument("--day", type=int, required=True)
  args = ap.parse_args()
  cfg = json.loads((ROOT / "config/campaign.json").read_text())
  mix(args.day, cfg)