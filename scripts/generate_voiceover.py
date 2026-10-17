import asyncio
import json
import math
import os
import sys
import edge_tts
from mutagen.mp3 import MP3

FPS = 30
VOICE = "hi-IN-SwaraNeural"
RATE = "+35%"  # Fast, high-retention Reel pace


def get_scenes(day: int):
    return [
        {
            "id": "hook",
            "tts_text": (
                "WhatsApp chat export की है कभी? मिलती है ऐसी boring text file! "
                "पर सोचो अगर इसी से पता चले कि कौन late reply करता है, "
                "कौन कितने words लिखता है और effort कौन डाल रहा है!"
            ),
        },
        {
            "id": "challenge",
            "tts_text": (
                f"ये है Day {day} out of 100, मेरे Zero Ad-Budget Challenge का, "
                "अपने app NotesBee को grow करने के लिए!"
            ),
        },
        {
            "id": "whatsapp_solution",
            "tts_text": (
                "NotesBee उस text file को असली WhatsApp chat में बदल देता है! "
                "और Smart Analytics में मिलती है हर message और reply की पूरी report!"
            ),
        },
        {
            "id": "decoy_privacy",
            "tts_text": (
                "Secret notes पर password के साथ Fake Title और Description लगाओ, "
                "ताकि दूसरों को दिखे सिर्फ एक simple grocery list!"
            ),
        },
        {
            "id": "ai_enhancer",
            "tts_text": (
                "Grammar हो या writing tone, AI Enhancer से अपनी writing बेहतर बनाओ बस एक tap में!"
            ),
        },
        {
            "id": "backgrounds_1000",
            "tts_text": (
                "साथ में 1,000 से ज़्यादा beautiful backgrounds, "
                "real-time collaboration और instant cloud sync भी!"
            ),
        },
        {
            "id": "cta",
            "tts_text": (
                "NotesBee अभी Google Play Store से download करो, link bio में है! "
                "और 100-day journey के लिए follow ज़रूर करना!"
            ),
        },
    ]


async def generate_audio(day: int):
    public_dir = os.path.join(os.getcwd(), "public")
    audio_dir = os.path.join(public_dir, "audio")
    os.makedirs(audio_dir, exist_ok=True)

    scenes = get_scenes(day)
    timeline_scenes = []
    current_frame = 0

    print(f"🐝 Generating Fast Hindi Voiceover ({VOICE} @ {RATE}) for DAY {day}/100...")

    for index, scene in enumerate(scenes):
        filename = f"scene_{index}_{scene['id']}.mp3"
        filepath = os.path.join(audio_dir, filename)

        communicate = edge_tts.Communicate(scene["tts_text"], VOICE, rate=RATE)
        await communicate.save(filepath)

        audio_info = MP3(filepath)
        # Trim 0.35s of trailing dead silence that edge-tts adds at the end of MP3s
        trimmed_sec = max(1.5, audio_info.info.length - 0.35)
        duration_frames = math.ceil(trimmed_sec * FPS)

        timeline_scenes.append(
            {
                "id": scene["id"],
                "text": "",
                "audioFile": f"audio/{filename}",
                "durationInFrames": duration_frames,
                "startFrame": current_frame,
            }
        )

        print(
            f"  ✅ [{scene['id']}] -> {trimmed_sec:.2f}s ({duration_frames} frames)"
        )
        current_frame += duration_frames

    timeline_data = {
        "day": day,
        "fps": FPS,
        "totalFrames": current_frame,
        "totalSeconds": round(current_frame / FPS, 2),
        "scenes": timeline_scenes,
    }

    timeline_path = os.path.join(public_dir, "timeline.json")
    with open(timeline_path, "w", encoding="utf-8") as f:
        json.dump(timeline_data, f, indent=2)

    print(
        f"\n🎬 Done! Total Video Length: {timeline_data['totalSeconds']}s ({current_frame} frames)"
    )


if __name__ == "__main__":
    day_arg = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    asyncio.run(generate_audio(day_arg))
