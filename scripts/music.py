#!/usr/bin/env python3
"""Procedural background music — a modern, premium, energetic-but-clean track.
Composed deterministically with numpy; no external assets, royalty-free.

Structure (anchored to narration):
  intro (hook)      -> pads + sparkle
  groove (S2-S5)    -> full: pad, bass, soft kick, hats, pluck arp
  tension (S6)      -> kick/hats drop, pad darkens, heartbeat
  groove lite (S7+) -> pad + arp + light kick
  CTA calm (S14)    -> pad + sparse pluck, gentle fade
"""
import numpy as np

SR = 48000
BPM = 102
BEAT = 60.0 / BPM
BAR = BEAT * 4

# Dm7 — Bbmaj7 — Fmaj7 — Cmaj7
CHORDS = [
    [146.83, 174.61, 220.00, 261.63],
    [116.54, 146.83, 174.61, 220.00],
    [174.61, 220.00, 261.63, 329.63],
    [130.81, 164.81, 196.00, 246.94],
]
ROOTS = [73.42, 58.27, 87.31, 65.41]  # D2 Bb1 F2 C2


def _env(n, a, r):
    e = np.ones(n, dtype=np.float32)
    a = max(1, min(int(a * SR), n // 2))
    r = max(1, min(int(r * SR), n // 2))
    e[:a] = np.linspace(0, 1, a) ** 1.5
    e[-r:] = np.linspace(1, 0, r) ** 1.5
    return e


def _saw(ph):
    return 2 * (ph / (2 * np.pi) % 1) - 1


def _lp(x, k):
    k = int(max(1, min(k, 2000)))
    return np.convolve(x, np.ones(k) / k, mode="same")


def pad(chord, dur, bright=0.55):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n, dtype=np.float64)
    for f in chord:
        for det, amp in ((0.0, 0.5), (1.003, 0.3), (0.997, 0.3)):
            ph = 2 * np.pi * f * det * t
            out += (0.6 * np.sin(ph) + 0.25 * _saw(ph)) * amp
    out = _lp(out.astype(np.float32), 1 / (30 + 90 * bright))
    return out * _env(n, dur * 0.25, dur * 0.35) * 0.16


def bass(root, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = 0.7 * np.sin(2 * np.pi * root * t) + 0.2 * np.sign(np.sin(2 * np.pi * root * t))
    x = _lp(x.astype(np.float32), 1 / 24)
    # per-beat pump
    e = np.ones(n, dtype=np.float32)
    b = int(BEAT * SR)
    for s0 in range(0, n, b):
        m = min(b, n - s0)
        e[s0:s0 + m] *= np.exp(-np.arange(m) / (0.24 * SR)) * 0.75 + 0.25
    return x * e * 0.34


def kick():
    dur = 0.16
    n = int(dur * SR)
    f = np.linspace(120, 44, n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-np.arange(n) / (0.05 * SR))
    return x.astype(np.float32) * 0.85


def hat():
    n = int(0.045 * SR)
    rng = np.random.default_rng(4)
    x = rng.standard_normal(n).astype(np.float32)
    x = x - _lp(x, 1 / 60)
    return x * np.exp(-np.arange(n) / (0.007 * SR)) * 0.16


def pluck(freq, dur=0.22):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = 0.6 * np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * freq * 2 * t) \
        + 0.12 * _saw(2 * np.pi * freq * t)
    return (x * np.exp(-np.arange(n) / (0.07 * SR))).astype(np.float32) * 0.30


def heartbeat():
    n = int(BEAT * SR * 2)
    out = np.zeros(n, dtype=np.float32)
    k = kick() * 0.5
    out[:len(k)] += k
    s2 = int(BEAT * 0.5 * SR)
    out[s2:s2 + len(k)] += k[:max(0, min(len(k), n - s2))] * 0.6
    return out


def compose(duration, anchors):
    """Return stereo float32 array (2, N)."""
    n = int((duration + 0.5) * SR)
    L = np.zeros(n, dtype=np.float32)
    R = np.zeros(n, dtype=np.float32)

    def add(buf, sig, at, gain=1.0, pan=0.0):
        s0 = int(at * SR)
        if s0 >= n:
            return
        m = min(len(sig), n - s0)
        gl = gain * (1 - max(0, pan))
        gr = gain * (1 + min(0, pan))
        bufL = sig[:m] * gl
        bufR = sig[:m] * gr
        L[s0:s0 + m] += bufL
        R[s0:s0 + m] += bufR

    groove_start = anchors["l2"]["s"]
    tension = (anchors["l15"]["s"] - 0.3, anchors["l17"]["e"] + 0.4)
    calm_start = anchors["l21"]["s"] - 0.2

    bar = 0
    t = 0.0
    K, H = kick(), hat()
    while t < duration + 0.5:
        chord = CHORDS[bar % 4]
        root = ROOTS[bar % 4]
        in_tension = tension[0] <= t <= tension[1]
        in_calm = t >= calm_start
        in_intro = t < groove_start

        bright = 0.35 if in_tension else (0.45 if in_calm or in_intro else 0.65)
        pd = pad(chord, BAR, bright)
        add(L, pd, t, pan=-0.06)
        add(R, pd, t, pan=0.06)  # slight width via pan dup (detuned inside pad)

        if in_tension:
            hb = heartbeat()
            add(L, hb, t, 0.8); add(R, hb, t, 0.8)
        elif in_calm:
            # sparse pluck: 2 notes per bar
            for j, six in enumerate([0, 8]):
                f = chord[(bar + j) % 4] * 2
                add(L, pluck(f), t + six * BEAT / 4, 0.7, pan=0.15)
        else:
            add(L, bass(root, BAR), t); add(R, bass(root, BAR), t)
            kg = 0.55 if in_intro else 0.9
            for b in range(4):
                add(L, K, t + b * BEAT, kg); add(R, K, t + b * BEAT, kg)
                add(L, H, t + b * BEAT + BEAT / 2, 0.8); add(R, H, t + b * BEAT + BEAT / 2, 0.8)
            # arp on 16ths, chord tones cycling + octave on bar 3
            pat = [0, 1, 2, 3, 2, 1]
            for s16 in range(16):
                f = chord[pat[(s16 + bar) % len(pat)] % 4] * (4 if (bar % 4 == 2 and s16 % 2) else 2)
                g = 0.5 if in_intro else 0.85
                add(L, pluck(f), t + s16 * BEAT / 4, g, pan=-0.12)
        bar += 1
        t += BAR

    # global fade-out in the last 1.2s
    fade = int(1.2 * SR)
    L[-fade:] *= np.linspace(1, 0, fade) ** 1.5
    R[-fade:] *= np.linspace(1, 0, fade) ** 1.5
    # gentle fade-in
    fi = int(0.25 * SR)
    L[:fi] *= np.linspace(0, 1, fi)
    R[:fi] *= np.linspace(0, 1, fi)
    return np.stack([L, R])
