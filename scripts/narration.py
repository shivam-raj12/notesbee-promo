#!/usr/bin/env python3
"""Narration generation + timing for the NotesBee promo.

Produces:
  narration/lines/{hash}.wav      one wav per narration line (cached by text)
  build/timing_day{N}.json        line/word timings + anchors for scenes & SFX

TTS backends (in priority order, configurable):
  edge    - edge-tts (pip install edge-tts), natural neural voices, needs network
  piper   - piper-tts local (pip install piper-tts + a voice model)
  local   - user-provided wavs in narration/custom/l1.wav, l2.wav, ...
  silence - timed silence fallback (keeps pipeline alive if no TTS available)
"""
import argparse
import asyncio
import hashlib
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SR = 48000

# (id, text, pause_after_seconds)
SCRIPT = [
    ("l1",  "DAY {day} of promoting my app without running a single paid ad.", 0.50),
    ("l2",  "Hey guys! I'm the solo developer behind NotesBee — a note app like never before.", 0.45),
    ("l3",  "And today, I'm starting a 100-day challenge to grow my app using nothing but social media.", 0.40),
    ("l4",  "No paid ads.", 0.28),
    ("l5",  "No huge budget.", 0.34),
    ("l6",  "Just consistency, content, and this journey.", 0.55),
    ("l7",  "Now hold on before you scroll…", 0.50),
    ("l8",  "Because NotesBee isn't just another note-taking app.", 0.40),
    ("l9",  "It lets you save your notes AND your important WhatsApp chats, securely, in one place.", 0.55),
    ("l10", "And here's the cool part…", 0.42),
    ("l11", "You can actually analyze your WhatsApp chats.", 0.42),
    ("l12", "Who sends the most messages?", 0.26),
    ("l13", "Who types the most words?", 0.26),
    ("l14", "Who sends the most media?", 0.50),
    ("l15", "And maybe… who always leaves you on read?", 0.65),
    ("l16", "No more guessing.", 0.42),
    ("l17", "Let the data decide.", 0.75),
    ("l18", "And NotesBee isn't stopping there.", 0.40),
    ("l19a", "You get AI-powered note enhancement,", 0.30),
    ("l19b", "double-layer privacy,", 0.28),
    ("l19c", "1000+ backgrounds, with AI-suggested themes,", 0.30),
    ("l19d", "collaboration, and a clean, simple interface.", 0.55),
    ("l20", "All in one app.", 0.55),
    ("l21", "And if NotesBee sounds useful,", 0.30),
    ("l22", "download now, from the Google Play Store.", 0.35),
    ("l23", "Link in the bio.", 0.0),
]

CTA_HOLD = 2.2   # seconds the final CTA stays after last word
LEAD_IN = 0.35   # silence before first line
PAUSE_SCALE = 0.8  # global tightening of inter-line pauses


def sha(s: str) -> str:
    return hashlib.sha1(s.encode()).hexdigest()[:12]


def ffprobe_duration(p: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)],
        capture_output=True, text=True)
    return float(out.stdout.strip())


def to_wav(src: Path, dst: Path):
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(src),
                    "-ar", str(SR), "-ac", "1", "-c:a", "pcm_s16le", str(dst)], check=True)


# ---------------- TTS backends ----------------

async def _edge_synth(text, voice, rate, mp3_path):
    import edge_tts
    words = []
    comm = edge_tts.Communicate(text, voice=voice, rate=rate)
    with open(mp3_path, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "w": chunk["text"],
                    "s": chunk["offset"] / 1e7,
                    "e": (chunk["offset"] + chunk["duration"]) / 1e7,
                })
    return words


def synth_edge(text, voice, rate, wav_path):
    mp3 = wav_path.with_suffix(".mp3")
    words = asyncio.run(_edge_synth(text, voice, rate, mp3))
    to_wav(mp3, wav_path)
    mp3.unlink(missing_ok=True)
    return words


def synth_piper(text, model, wav_path):
    from piper import PiperVoice  # noqa
    import wave
    voice = PiperVoice.load(model)
    with wave.open(str(wav_path), "wb") as w:
        voice.synthesize(text, w)
    return None


def synth_silence(text, wav_path):
    words = text.split()
    dur = max(0.9, 0.34 * len(words) + 0.25)
    n = int(dur * SR)
    import numpy as np
    np.zeros(n, dtype=np.int16).tofile(wav_path)
    # raw pcm -> wrap into wav
    tmp = wav_path.with_suffix(".raw")
    wav_path.rename(tmp)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "1",
                    "-i", str(tmp), str(wav_path)], check=True)
    tmp.unlink()
    return None


def _valid_wav(p: Path) -> bool:
    try:
        return p.exists() and p.stat().st_size > 1000 and ffprobe_duration(p) > 0.2
    except Exception:
        return False


def get_line_audio(line_id, text, cfg, lines_dir):
    """Return (wav_path, word_boundaries_or_None). Robust to flaky TTS."""
    key = sha(text + "|" + cfg["voice"].get("edgeVoice", "") + "|" + cfg["voice"].get("edgeRate", ""))
    wav_path = lines_dir / f"{line_id}_{key}.wav"
    meta_path = lines_dir / f"{line_id}_{key}.json"
    if _valid_wav(wav_path):
        words = json.loads(meta_path.read_text()) if meta_path.exists() else None
        return wav_path, words
    wav_path.unlink(missing_ok=True)

    local = ROOT / "narration/custom" / f"{line_id}.wav"
    if local.exists():
        to_wav(local, wav_path)
        words = None
    else:
        backend = cfg["voice"].get("backend", "edge")
        words = None
        for attempt in range(3):
            try:
                if backend == "edge":
                    words = synth_edge(text, cfg["voice"]["edgeVoice"], cfg["voice"].get("edgeRate", "+0%"), wav_path)
                elif backend == "piper":
                    words = synth_piper(text, cfg["voice"]["piperModel"], wav_path)
                else:
                    raise RuntimeError(f"unknown backend {backend}")
                if _valid_wav(wav_path):
                    break
                raise RuntimeError("synthesized file failed validation")
            except Exception as e:
                print(f"[narration] TTS attempt {attempt+1}/3 failed for {line_id}: {str(e)[:120]}")
                wav_path.unlink(missing_ok=True)
                words = None
        if not _valid_wav(wav_path):
            print(f"[narration] WARNING: TTS unavailable for {line_id}; using timed silence.")
            synth_silence(text, wav_path)
    if words:
        meta_path.write_text(json.dumps(words))
    return wav_path, words


def proportional_words(text, dur):
    words = text.split()
    total = sum(max(1, len(w)) for w in words)
    out, t = [], 0.0
    for w in words:
        wd = dur * max(1, len(w)) / total
        out.append({"w": w, "s": t, "e": t + wd})
        t += wd
    return out


def build_timing(day: int, cfg: dict) -> dict:
    lines_dir = ROOT / "narration/lines"
    lines_dir.mkdir(parents=True, exist_ok=True)
    entries = []
    t = LEAD_IN
    for line_id, tpl, pause in SCRIPT:
        text = tpl.format(day=day)
        wav_path, wb = get_line_audio(line_id, text, cfg, lines_dir)
        dur = ffprobe_duration(wav_path)
        if wb and len(wb) >= max(1, int(0.6 * len(text.split()))):
            words = wb
        else:
            words = proportional_words(text, dur)
        entries.append({
            "id": line_id, "text": text, "file": str(wav_path.relative_to(ROOT)),
            "start": round(t, 3), "end": round(t + dur, 3), "pauseAfter": pause,
            "words": [{"w": w["w"], "s": round(t + w["s"], 3), "e": round(t + w["e"], 3)} for w in words],
        })
        t += dur + pause * PAUSE_SCALE
    total = t - SCRIPT[-1][2] * PAUSE_SCALE + CTA_HOLD
    timing = {
        "day": day, "fps": cfg["video"]["fps"],
        "width": cfg["video"]["width"], "height": cfg["video"]["height"],
        "duration": round(total, 3),
        "appName": cfg["app"]["name"], "tagline": cfg["app"]["tagline"],
        "totalDays": cfg.get("totalDays", 100),
        "assets": cfg["assets"],
        "lines": entries,
    }
    out = ROOT / "build" / f"timing_day{day}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(timing, indent=1))
    print(f"[narration] day={day} lines={len(entries)} total={total:.2f}s -> {out.relative_to(ROOT)}")
    return timing


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--day", type=int, required=True)
    args = ap.parse_args()
    cfg = json.loads((ROOT / "config/campaign.json").read_text())
    build_timing(args.day, cfg)
