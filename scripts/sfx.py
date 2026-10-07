#!/usr/bin/env python3
"""Procedural sound-effects synthesis (numpy only, deterministic, royalty-free
by construction). Each function returns a mono float32 array at SR."""
import numpy as np

SR = 48000


def _n(dur):
    return max(1, int(dur * SR))


def env_ar(n, attack=0.005, release=0.1):
    e = np.ones(n, dtype=np.float32)
    a = max(1, int(attack * SR))
    r = max(1, int(release * SR))
    e[:a] = np.linspace(0, 1, a)
    e[-r:] = np.linspace(1, 0, r)
    return e


def exp_decay(n, tau):
    return np.exp(-np.arange(n) / (tau * SR)).astype(np.float32)


def lowpass(x, alpha):
    """one-pole lowpass, alpha in (0,1] — smaller = darker"""
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += alpha * (x[i] - acc)
        y[i] = acc
    return y


def lowpass_fast(x, alpha):
    # vectorized approximation via cumulative filter (good enough for SFX)
    from numpy import convolve
    k = int(1 / max(alpha, 1e-4))
    k = min(k, 4000)
    ker = np.ones(k) / k
    return convolve(x, ker, mode="same")


def tone(freq, dur, kind="sine", slide_to=None, attack=0.004, release=0.08):
    n = _n(dur)
    t = np.arange(n) / SR
    f = np.linspace(freq, slide_to or freq, n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    if kind == "sine":
        x = np.sin(ph)
    elif kind == "square":
        x = np.sign(np.sin(ph))
    elif kind == "saw":
        x = 2 * (ph / (2 * np.pi) % 1) - 1
    else:
        x = np.sin(ph)
    return (x * env_ar(n, attack, release)).astype(np.float32)


def noise(dur, seed=0):
    rng = np.random.default_rng(seed)
    return rng.standard_normal(_n(dur)).astype(np.float32)


def whoosh(dur=0.4, seed=3, up=True):
    x = noise(dur, seed)
    n = len(x)
    # sweep a "brightness" envelope by mixing raw and lowpassed noise
    dark = lowpass_fast(x, 0.12)
    mix = np.linspace(0.15, 1.0, n) if up else np.linspace(1.0, 0.15, n)
    out = dark * (1 - mix) + x * mix
    e = np.sin(np.linspace(0, np.pi, n)) ** 1.6
    return (out * e * 0.5).astype(np.float32)


def impact(dur=0.7, sub=40.0):
    n = _n(dur)
    t = np.arange(n) / SR
    f = np.linspace(120, sub, n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    boom = np.sin(ph) * exp_decay(n, 0.28)
    thump = lowpass_fast(noise(dur, 5), 0.05) * exp_decay(n, 0.06)
    return ((boom * 0.9 + thump * 2.2) * env_ar(n, 0.002, 0.2) * 0.9).astype(np.float32)


def cine_impact(dur=1.4):
    n = _n(dur)
    base = impact(dur, sub=32.0)
    t = np.arange(n) / SR
    sub2 = np.sin(2 * np.pi * 30 * t) * exp_decay(n, 0.55) * 0.7
    crash = lowpass_fast(noise(dur, 9)[::-1].copy(), 0.3) * exp_decay(n, 0.22) * 0.35
    out = base + sub2 + crash
    return (out * env_ar(n, 0.002, 0.5)).astype(np.float32)


def click(dur=0.05, freq=2100):
    x = tone(freq, dur, "square", release=0.03)
    return (lowpass_fast(x, 0.4) * 0.35).astype(np.float32)


def pop(dur=0.12, seed=1):
    n = _n(dur)
    t = np.arange(n) / SR
    f = np.linspace(480, 980, n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * exp_decay(n, 0.045)
    return (x * 0.55).astype(np.float32)


def tick(dur=0.035, bright=1.0):
    x = noise(dur, 17)
    hp = x - lowpass_fast(x, 0.25)
    return (hp * exp_decay(len(x), 0.006) * 0.5 * bright).astype(np.float32)


def riser(dur=1.2, seed=8):
    n = _n(dur)
    t = np.arange(n) / SR
    f = np.linspace(220, 2400, n)
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = 2 * (ph / (2 * np.pi) % 1) - 1
    x = lowpass_fast(saw.astype(np.float32), 0.2)
    nz = noise(dur, seed) * 0.25
    e = np.linspace(0.05, 1, n) ** 1.6
    return ((x * 0.4 + nz) * e).astype(np.float32)


def lock_clunk(dur=0.3):
    n = _n(dur)
    parts = sum(tone(f, dur, "square", release=dur * 0.8) * a
                for f, a in [(172, 0.5), (261, 0.35), (521, 0.2)])
    snap = noise(0.03, 21) * exp_decay(_n(0.03), 0.004) * 1.2
    out = lowpass_fast(parts.astype(np.float32), 0.3) * exp_decay(n, 0.09)
    out[:len(snap)] += snap
    return (out * 0.8).astype(np.float32)


def chime(dur=0.9, base=1320.0):
    n = _n(dur)
    out = np.zeros(n, dtype=np.float32)
    for i, (mult, amp) in enumerate([(1, 0.5), (1.5, 0.3), (2.0, 0.28), (3.01, 0.12)]):
        out += tone(base * mult, dur, "sine", release=dur * 0.7) * exp_decay(n, 0.3 + 0.1 * i) * amp
    return out


def shimmer(dur=0.9, seed=31):
    rng = np.random.default_rng(seed)
    scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]
    n = _n(dur)
    out = np.zeros(n, dtype=np.float32)
    step = dur / 11
    for i in range(11):
        f = scale[rng.integers(0, len(scale))]
        blip = tone(f, 0.09, "sine", release=0.07) * 0.3
        s0 = int(i * step * SR)
        out[s0:s0 + len(blip)] += blip[:max(0, min(len(blip), n - s0))]
    return out


def connect_blip(dur=0.25):
    a = tone(700, dur * 0.5, "sine", release=0.05)
    b = tone(1050, dur * 0.6, "sine", release=0.08)
    out = np.zeros(_n(dur), dtype=np.float32)
    out[:len(a)] += a * 0.5
    off = int(dur * 0.4 * SR)
    out[off:off + len(b)] += b[:max(0, min(len(b), _n(dur) - off))] * 0.5
    return out


def resolve_swell(dur=1.6):
    """cinematic resolve: rising pad swell into a warm major chord"""
    n = _n(dur)
    t = np.arange(n) / SR
    chord = [293.66, 369.99, 440.0, 587.33]  # D major add
    out = np.zeros(n, dtype=np.float32)
    for f in chord:
        vib = 1 + 0.004 * np.sin(2 * np.pi * 5 * t)
        out += np.sin(2 * np.pi * f * np.cumsum(vib) / SR).astype(np.float32)
    out = lowpass_fast(out, 0.25)
    e = np.minimum(1, np.linspace(0, 3.2, n)) * exp_decay(n, 0.75)
    hit = impact(0.5) * 0.5
    out = out * e * 0.24
    out[:len(hit)] += hit
    return out.astype(np.float32)


def confirm_ding(dur=0.7):
    n = _n(dur)
    a = tone(880, dur, "sine", release=0.5) * exp_decay(n, 0.25) * 0.5
    b = tone(1318.5, dur, "sine", release=0.5) * exp_decay(n, 0.18) * 0.3
    return (a + b).astype(np.float32)


def type_clicks(count=5, gap=0.09, dur_total=1.0):
    n = _n(dur_total)
    out = np.zeros(n, dtype=np.float32)
    for i in range(count):
        c = click(0.03, freq=1800 + (i % 3) * 300) * 0.5
        s0 = int(i * gap * SR)
        out[s0:s0 + len(c)] += c[:max(0, min(len(c), n - s0))]
    return out


REGISTRY = {
    "whoosh": whoosh, "impact": impact, "cine_impact": cine_impact,
    "click": click, "pop": pop, "tick": tick, "riser": riser,
    "lock_clunk": lock_clunk, "chime": chime, "shimmer": shimmer,
    "connect_blip": connect_blip, "resolve_swell": resolve_swell,
    "confirm_ding": confirm_ding, "type_clicks": type_clicks,
}
