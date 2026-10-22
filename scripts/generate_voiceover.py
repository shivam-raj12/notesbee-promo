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
                "क्या आपकी भी गर्लफ्रेंड, बॉयफ्रेंड या क्रश आपको इग्नोर करके "
                "बस सीन पर छोड़ रहा है? और समझ नहीं आ रहा कि वो सच में "
                "बिजी हैं... या एफर्ट ही खत्म हो गया है?"
            ),
        },
        {
            "id": "challenge",
            "tts_text": (
                f"ये है Day {day} मेरे ज़ीरो ऐड-बजट चैलेंज का!"
            ),
        },
        {
            "id": "analytics",
            "tts_text": (
                "NotesBee आपकी WhatsApp चैट एक्सपोर्ट को एक रियल चैट में बदल देता है! "
                "और इसके स्मार्ट एनालिटिक्स में साफ दिखता है — किसने सबसे ज्यादा मैसेज भेजे, "
                "किसके सबसे ज्यादा वर्ड्स हैं, रिप्लाई के बीच का गैप, मीडिया शेयर, और भी बहुत कुछ!"
            ),
        },
        {
            "id": "privacy",
            "tts_text": (
                "सबसे बड़ी बात? आपका डेटा कहीं क्लाउड पर अपलोड नहीं होता। "
                "सौ परसेंट डेटा आपके फोन के अंदर सिक्योर रहता है!"
            ),
        },
        {
            "id": "cta",
            "tts_text": (
                "NotesBee अभी Google Play Store से डाउनलोड करो — लिंक बायो में है! "
                "और जर्नी के लिए फॉलो करना मत भूलना!"
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

    print(f"🐝 Generating Hindi Voiceover ({VOICE} @ {RATE}) for DAY {day}/100...")

    for index, scene in enumerate(scenes):
        filename = f"scene_{index}_{scene['id']}.mp3"
        filepath = os.path.join(audio_dir, filename)

        communicate = edge_tts.Communicate(scene["tts_text"], VOICE, rate=RATE)
        await communicate.save(filepath)

        audio_info = MP3(filepath)
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
