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
  """SFX events [(time, name, gain, kwargs)] — mirrors scene choreography."""
  ev = []
  add = lambda t, name, g=1.0, **kw: ev.append((t, name, g, kw))

  # S1 hook
  add(A["l1"]["s"], "whoosh", 0.75, dur=0.35)
  add(A["l1"]["s"] + 0.58, "impact", 0.85)

  # S2 typing + icon reveal
  add(A["l2"]["s"] + 0.3, "type_clicks", 0.6, count=6, gap=0.3, dur_total=2.0)
  add(A["l2"]["e"] - 1.15, "chime", 0.75)
  add(A["l2"]["e"] - 1.15, "pop", 0.65)

  # S3
  add(A["l3"]["s"] + 0.2, "whoosh", 0.5, dur=0.3)
  add(A["l4"]["s"] + 0.5, "whoosh", 0.6, dur=0.22)
  add(A["l4"]["s"] + 0.55, "click", 0.8)
  add(A["l5"]["s"] + 0.5, "whoosh", 0.6, dur=0.22)
  add(A["l5"]["s"] + 0.55, "click", 0.8)

  # S4 chat pops
  base = A["l7"]["s"] + 0.32
  for i in range(6):
    add(base + i * 0.48 + 0.28, "pop", 0.65, seed=i + 2)
  add(A["l8"]["s"] + 0.15, "whoosh", 0.55, dur=0.5, up=False)
  add(A["l9"]["s"] + 1.2, "whoosh", 0.75, dur=0.45)
  add(A["l9"]["e"] - 0.12, "lock_clunk", 0.8)

  # S5 analytics
  for lid in ("l12", "l13", "l14"):
    add(
        A[lid]["s"] - 0.15,
        "type_clicks",
        0.5,
        count=7,
        gap=0.11,
        dur_total=1.1,
    )
  add(A["l10"]["s"] + 0.15, "whoosh", 0.45, dur=0.35)
  add(A["l13"]["s"] - 0.3, "whoosh", 0.4, dur=0.25)
  add(A["l14"]["s"] - 0.3, "whoosh", 0.4, dur=0.25)

  # S6 clock + freeze
  add(A["l15"]["s"] + 0.4, "pop", 0.65)
  T0 = A["l15"]["s"] + 0.6
  for dt in (0.0, 0.8, 1.5, 2.1):
    add(T0 + dt, "tick", 0.85)

  spin_start, freeze = T0 + 2.6, A["l16"]["s"] - 0.12
  tt = spin_start
  gap = 0.16
  while tt < freeze - 0.05:
    add(tt, "tick", 0.85, bright=1.2)
    tt += gap
    gap = max(0.05, gap * 0.88)
  add(spin_start, "riser", 0.7, dur=max(0.4, freeze - spin_start))
  add(A["l16"]["s"], "cine_impact", 0.85)
  add(A["l17"]["s"] + 0.06, "cine_impact", 0.85)

  # S7 AI
  add(A["l19a"]["s"] + 0.12, "shimmer", 0.8)
  add(A["l19a"]["s"] + 1.35, "chime", 0.65, base=1568.0)

  # S8 privacy
  add(A["l19b"]["s"] + 0.62, "lock_clunk", 0.85)
  add(A["l19b"]["s"] + 1.25, "lock_clunk", 0.8)

  # S9 backgrounds
  add(A["l19c"]["s"] - 0.1, "whoosh", 0.55, dur=0.4)
  add(A["l19c"]["s"] + 0.75, "impact", 0.65)

  # S10 AI suggested
  l19cMid = A["l19c"]["s"] + (A["l19c"]["e"] - A["l19c"]["s"]) * 0.55
  add(l19cMid + 0.9, "chime", 0.7, base=1174.7)

  # S11 collab
  add(A["l19d"]["s"] + 0.1, "connect_blip", 0.7)
  l19dMid = A["l19d"]["s"] + (A["l19d"]["e"] - A["l19d"]["s"]) * 0.52
  add(l19dMid - 0.45, "connect_blip", 0.7)

  # S12 cards
  for i in range(5):
    add(
        l19dMid + 0.1 + i * 0.12 + 0.28, "click", 0.5, freq=1700 + i * 160
    )

  # S13 reveal
  add(A["l20"]["s"] + 0.75, "resolve_swell", 0.85)

  # S14 CTA
  add(A["l22"]["s"] + 0.5, "confirm_ding", 0.8)
  add(A["l23"]["s"] + 0.2, "chime", 0.5, base=1046.5)
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
  # Soft saturation curve (eliminates harsh square wave clipping)
  out = np.tanh(out * 0.85)

  # Target -1.5 dBFS to prevent lossy AAC inter-sample overshoot (> -0.3 dBFS)
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