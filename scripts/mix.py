#!/usr/bin/env python3
"""Audio assembly: narration + procedural SFX + procedural music with
sidechain-style ducking. Outputs build/audio_day{N}.wav (48kHz stereo).

  python3 scripts/mix.py --day 1
"""
import argparse
import json
import subprocess
from pathlib import Path

import numpy as np

import sfx as S
import music as M

ROOT = Path(__file__).resolve().parent.parent
SR = S.SR


def read_wav(path):
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
        capture_output=True, check=True)
    return np.frombuffer(out.stdout, dtype=np.float32)


def place(bus, sig, at, gain=1.0):
    s0 = int(at * SR)
    if s0 >= bus.shape[1]:
        return
    m = min(len(sig), bus.shape[1] - s0)
    if m <= 0:
        return
    bus[0, s0:s0 + m] += sig[:m] * gain
    bus[1, s0:s0 + m] += sig[:m] * gain


def sfx_schedule(A):
    """SFX events [(time, name, gain, kwargs)] — mirrors scene choreography."""
    ev = []
    add = lambda t, name, g=1.0, **kw: ev.append((t, name, g, kw))

    # S1 hook
    add(A["l1"]["s"], "whoosh", 0.8, dur=0.35)
    add(A["l1"]["s"] + 0.62, "impact", 1.0)
    # S2 typing + icon reveal
    add(A["l2"]["s"] + 0.3, "type_clicks", 0.7, count=6, gap=0.3, dur_total=2.0)
    add(A["l2"]["e"] - 1.15, "chime", 0.9)
    add(A["l2"]["e"] - 1.15, "pop", 0.7)
    # S3
    add(A["l3"]["s"] + 0.2, "whoosh", 0.5, dur=0.3)
    add(A["l4"]["s"] + 0.5, "whoosh", 0.65, dur=0.22)
    add(A["l4"]["s"] + 0.55, "click", 0.9)
    add(A["l5"]["s"] + 0.5, "whoosh", 0.65, dur=0.22)
    add(A["l5"]["s"] + 0.55, "click", 0.9)
    # S4 chat pops (mirror scenes2 S4 base/stagger)
    base = A["l7"]["s"] + 0.35
    for i in range(6):
        add(base + i * 0.5 + 0.28, "pop", 0.75, seed=i + 2)
    add(A["l8"]["s"] + 0.15, "whoosh", 0.6, dur=0.5, up=False)
    add(A["l9"]["s"] + 1.3, "whoosh", 0.85, dur=0.45)
    add(A["l9"]["e"] - 0.12, "lock_clunk", 0.9)
    # S5 analytics
    for lid in ("l12", "l13", "l14"):
        add(A[lid]["s"] - 0.15, "type_clicks", 0.55, count=7, gap=0.11, dur_total=1.1)
    add(A["l10"]["s"] + 0.15, "whoosh", 0.5, dur=0.35)
    add(A["l13"]["s"] - 0.3, "whoosh", 0.4, dur=0.25)
    add(A["l14"]["s"] - 0.3, "whoosh", 0.4, dur=0.25)
    # S6 clock + freeze (mirror scenes2 S6 constants: T0 = l15.s + 0.6)
    add(A["l15"]["s"] + 0.4, "pop", 0.7)
    T0 = A["l15"]["s"] + 0.6
    for dt in (0.0, 0.8, 1.5, 2.1):
        add(T0 + dt, "tick", 1.0)
    spin_start, freeze = T0 + 2.6, A["l16"]["s"] - 0.12
    tt = spin_start
    gap = 0.16
    while tt < freeze - 0.05:
        add(tt, "tick", 1.0, bright=1.2)
        tt += gap
        gap = max(0.05, gap * 0.88)
    add(spin_start, "riser", 0.8, dur=max(0.4, freeze - spin_start))
    add(A["l16"]["s"], "cine_impact", 1.0)
    add(A["l17"]["s"] + 0.06, "cine_impact", 1.0)
    # S7 AI
    add(A["l19a"]["s"] + 0.12, "shimmer", 0.9)
    add(A["l19a"]["s"] + 1.35, "chime", 0.7, base=1568.0)
    # S8 privacy
    add(A["l19b"]["s"] + 0.62, "lock_clunk", 1.0)
    add(A["l19b"]["s"] + 1.25, "lock_clunk", 0.9)
    # S9 backgrounds
    add(A["l19c"]["s"] - 0.1, "whoosh", 0.6, dur=0.4)
    add(A["l19c"]["s"] + 0.75, "impact", 0.7)
    # S10 AI suggested
    l19cMid = A["l19c"]["s"] + (A["l19c"]["e"] - A["l19c"]["s"]) * 0.55
    add(l19cMid + 0.9, "chime", 0.75, base=1174.7)
    # S11 collab
    add(A["l19d"]["s"] + 0.1, "connect_blip", 0.8)
    l19dMid = A["l19d"]["s"] + (A["l19d"]["e"] - A["l19d"]["s"]) * 0.52
    add(l19dMid - 0.45, "connect_blip", 0.8)
    # S12 cards
    for i in range(5):
        add(l19dMid + 0.1 + i * 0.12 + 0.28, "click", 0.55, freq=1700 + i * 160)
    # S13 reveal
    add(A["l20"]["s"] + 0.75, "resolve_swell", 1.0)
    # S14 CTA
    add(A["l22"]["s"] + 0.5, "confirm_ding", 0.9)
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

    narration = np.zeros((2, n), dtype=np.float32)
    for l in timing["lines"]:
        sig = read_wav(ROOT / l["file"])
        place(narration, sig, l["start"], 1.0)

    sfx_bus = np.zeros((2, n), dtype=np.float32)
    events = sfx_schedule(A)
    sfx_gain = 10 ** (cfg["sfx"].get("volumeDb", -6) / 20) * 2.2
    if cfg["sfx"].get("enabled", True):
        for t0, name, g, kw in events:
            fn = S.REGISTRY[name]
            sig = fn(**kw)
            place(sfx_bus, sig, t0, g * sfx_gain)

    music_bus = np.zeros((2, n), dtype=np.float32)
    if cfg["music"].get("enabled", True):
        music_bus = M.compose(timing["duration"], A)[:, :n]
        if music_bus.shape[1] < n:
            music_bus = np.pad(music_bus, ((0, 0), (0, n - music_bus.shape[1])))
        music_gain = 10 ** (cfg["music"].get("volumeDb", -16) / 20) * 2.0
        music_bus *= music_gain
        # duck under narration: envelope from line windows
        env = np.zeros(n, dtype=np.float32)
        for l in timing["lines"]:
            s0 = max(0, int((l["start"] - 0.12) * SR))
            e0 = min(n, int((l["end"] + 0.25) * SR))
            env[s0:e0] = 1.0
        env = smooth(env, 0.09 * SR)
        env = np.clip(env, 0, 1)
        duck = 1 - (1 - 10 ** (cfg["music"].get("duckDb", -11) / 20)) * env
        music_bus *= duck

    out = narration + sfx_bus + music_bus
    # soft limiter + normalize to -1.2 dBFS peak
    out = np.tanh(out * 0.9)
    peak = np.max(np.abs(out)) or 1.0
    target = 10 ** (-1.2 / 20)
    if peak > target:
        out *= target / peak

    out_path = ROOT / "build" / f"audio_day{day}.wav"
    pcm = (np.clip(out, -1, 1).T * 32767).astype(np.int16)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "2",
                    "-i", "-", "-c:a", "pcm_s16le", str(out_path)],
                   input=pcm.tobytes(), check=True)

    sched = {"events": [{"t": round(t0, 3), "name": nm} for t0, nm, g, kw in events],
             "musicEnabled": cfg["music"].get("enabled", True)}
    (ROOT / "build" / f"sfx_schedule_day{day}.json").write_text(json.dumps(sched, indent=1))
    print(f"[mix] {len(events)} sfx events, duration={dur:.2f}s -> {out_path.relative_to(ROOT)}")
    return out_path


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--day", type=int, required=True)
    args = ap.parse_args()
    cfg = json.loads((ROOT / "config/campaign.json").read_text())
    mix(args.day, cfg)
