import asyncio
import json
import math
import os
import sys
import edge_tts
from mutagen.mp3 import MP3

FPS = 30
VOICE = "hi-IN-SwaraNeural"  # Crisp, natural Indian Female voice
RATE = "+18%"  # Fast, punchy Instagram Reel speed


def get_scenes(day: int):
    return [
        {
            "id": "hook",
            "tts_text": (
                "क्या आपने कभी अपनी WhatsApp chat को सेव करने के लिए export किया है? "
                "बदले में मिलती है एक बोरिंग और अजीब सी text file, जिसे पढ़ना भी मुश्किल है! "
                "और फोन का डिफ़ॉल्ट Notes app? बिल्कुल बेसिक और जीरो प्राइवेसी।"
            ),
        },
        {
            "id": "problem",
            "tts_text": (
                "आपकी सबसे खास यादें उन अजीब text files में खो जाती हैं, "
                "और कोई भी आपका फोन लेकर आपके पर्सनल नोट्स आसानी से पढ़ सकता है।"
            ),
        },
        {
            "id": "challenge",
            "tts_text": (
                f"तो स्वागत है मेरे 100 Days Challenge के Day {day} में! "
                "जहाँ मैं बिना एक भी रुपया ads पर खर्च किए, अपने ऐप NotesBee को जीरो से ग्रो कर रहा हूँ।"
            ),
        },
        {
            "id": "whatsapp_solution",
            "tts_text": (
                "NotesBee आपकी exported WhatsApp text file को एक बिल्कुल असली और खूबसूरत chat interface में बदल देता है। "
                "साथ ही इसका Smart Chat Analytics दिखाता है कि किसने ज़्यादा मैसेज भेजे, "
                "किसने ज़्यादा वर्ड्स लिखे, और किसने सबसे ज़्यादा मीडिया शेयर किया!"
            ),
        },
        {
            "id": "decoy_privacy",
            "tts_text": (
                "आपके सीक्रेट नोट्स के लिए इसमें है कमाल की प्राइवेसी! "
                "आप पासवर्ड के साथ Fake Title और Fake Description लगा सकते हैं, "
                "ताकि किसी को भी आपका सीक्रेट नोट सिर्फ एक नॉर्मल ग्रोसरी लिस्ट लगे!"
            ),
        },
        {
            "id": "ai_enhancer",
            "tts_text": (
                "लिखते वक्त गलती हो जाए? तो NotesBee का AI Enhancer एक क्लिक में आपकी ग्रामर, "
                "स्पेलिंग और राइटिंग टोन को एकदम परफेक्ट बना देता है!"
            ),
        },
        {
            "id": "backgrounds_1000",
            "tts_text": (
                "और बोरिंग सफेद स्क्रीन को बोलो बाय! "
                "यहाँ एक हज़ार से ज़्यादा खूबसूरत backgrounds हैं जो आपके हर नोट को अलग मूड देते हैं, "
                "साथ में real-time collaboration और cloud sync भी!"
            ),
        },
        {
            "id": "cta",
            "tts_text": (
                "तो अब बेसिक नोट्स ऐप छोड़ो! अभी Google Play Store से NotesBee डाउनलोड करो, "
                "लिंक बायो में है! और पेज को फॉलो कर लो ये देखने के लिए कि Day 100 तक क्या होता है!"
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
    padding_frames = 6  # Snappy 0.2s transition padding for fast Reel pacing

    print(f"🐝 Generating Fast Hindi Voiceover ({VOICE} @ {RATE}) for DAY {day}/100...")

    for index, scene in enumerate(scenes):
        filename = f"scene_{index}_{scene['id']}.mp3"
        filepath = os.path.join(audio_dir, filename)

        communicate = edge_tts.Communicate(scene["tts_text"], VOICE, rate=RATE)
        await communicate.save(filepath)

        audio_info = MP3(filepath)
        duration_sec = audio_info.info.length
        duration_frames = math.ceil(duration_sec * FPS) + padding_frames

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
            f"  ✅ [{scene['id']}] -> {duration_sec:.2f}s ({duration_frames} frames)"
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
    print(f"📄 Saved timeline metadata to: public/timeline.json")


if __name__ == "__main__":
    day_arg = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    asyncio.run(generate_audio(day_arg))