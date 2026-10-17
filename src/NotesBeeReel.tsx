import React, { useState } from "react";
import {
    AbsoluteFill,
    Audio,
    Img,
    interpolate,
    Sequence,
    spring,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import {
    AnimatedSvgPath,
    CameraStage,
    GridBackground,
    KineticText,
} from "./components/MotionPrimitives";
import { BRAND, getDefaultTimeline, NotesBeeProps } from "./types";

// ============================================================================
// SOUND EFFECT HELPER COMPONENT (Plays public/sfx/*.wav at exact frame)
// ============================================================================
const SfxCue: React.FC<{
    file:
        | "pop.wav"
        | "whoosh.wav"
        | "error_slash.wav"
        | "radar_ping.wav"
        | "key_tick.wav"
        | "magic_scan.wav"
        | "success_chime.wav";
    from: number;
    volume?: number;
}> = ({ file, from, volume = 0.34 }) => {
    return (
        <Sequence from={Math.max(0, Math.floor(from))} durationInFrames={40}>
            <Audio src={staticFile(`sfx/${file}`)} volume={volume} />
        </Sequence>
    );
};

// ============================================================================
// SCENE 1: HOOK — SUSPENSE + CURIOSITY
// Part A (0 - 30%): Boring .txt file gets slashed
// Part B (30% - 100%): Camera pans down to "Who Replies Late? Who Puts Effort? 👀"
// ============================================================================
const HookScene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const slashFrame = Math.floor(duration * 0.18);
    const panFrame = Math.floor(duration * 0.30);

    const panDown = spring({
        frame: frame - panFrame,
        fps,
        config: { damping: 14, stiffness: 150 },
    });

    const camY = interpolate(panDown, [0, 1], [80, -760]);
    const camScale = interpolate(frame, [0, duration], [1.03, 0.97]);

    const card1Pop = spring({
        frame,
        fps,
        config: { damping: 12, stiffness: 180 },
    });
    const strikeProgress = spring({
        frame: frame - slashFrame,
        fps,
        config: { damping: 12, stiffness: 200 },
    });

    const curiosityCards = [
        {
            icon: "⏳",
            title: "Kaun Late Reply Karta Hai?",
            stat: "Ananya: 84% Late Replies",
            badge: "EXPOSED",
            bg: BRAND.pastelPink,
            accent: BRAND.rose,
            delayOffset: 0.34,
        },
        {
            icon: "⏱️",
            title: "Kitni Der Lagata Hai?",
            stat: "You: 2 min ⚡ vs Them: 48 min 🐢",
            badge: "REPLY SPEED",
            bg: BRAND.pastelAmber,
            accent: BRAND.amber,
            delayOffset: 0.46,
        },
        {
            icon: "📝",
            title: "Kaun Kitne Words Likhta Hai?",
            stat: "You: 34,200 vs Them: 9,150 words",
            badge: "WORD COUNT",
            bg: BRAND.pastelBlue,
            accent: BRAND.indigo,
            delayOffset: 0.58,
        },
    ];

    const effortStartFrame = Math.floor(duration * 0.72);
    const effortPop = spring({
        frame: frame - effortStartFrame,
        fps,
        config: { damping: 11, stiffness: 170 },
    });

    return (
        <AbsoluteFill>
            <SfxCue file="pop.wav" from={1} volume={0.36} />
            <SfxCue file="error_slash.wav" from={slashFrame} volume={0.4} />
            <SfxCue file="whoosh.wav" from={panFrame - 2} volume={0.38} />
            <SfxCue file="pop.wav" from={Math.floor(duration * 0.35)} volume={0.34} />
            <SfxCue file="pop.wav" from={Math.floor(duration * 0.47)} volume={0.34} />
            <SfxCue file="pop.wav" from={Math.floor(duration * 0.59)} volume={0.34} />
            <SfxCue file="radar_ping.wav" from={effortStartFrame} volume={0.38} />

            <GridBackground cameraY={camY} />
            <CameraStage y={camY} scale={camScale}>
                {/* ---------------- TOP STAGE: BORING .TXT FILE ---------------- */}
                <div style={{ position: "absolute", top: 175, left: 65, right: 65 }}>
                    <KineticText
                        text="Exported WhatsApp Chat?"
                        fontSize={66}
                        highlightWords={["WhatsApp", "Chat"]}
                        highlightColor={BRAND.amber}
                    />
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 340,
                        left: 90,
                        width: 900,
                        backgroundColor: BRAND.bgCard,
                        border: `4px solid ${BRAND.borderWhite}`,
                        borderRadius: 42,
                        padding: 38,
                        transform: `scale(${card1Pop})`,
                        boxShadow: BRAND.cardShadow,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 18,
                            borderBottom: `2px solid ${BRAND.borderSubtle}`,
                            paddingBottom: 14,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <span style={{ fontSize: 38 }}>📄</span>
                            <span
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: 36,
                                    fontWeight: 900,
                                    color: BRAND.navyText,
                                }}
                            >
                _chat_export.txt
              </span>
                        </div>
                        <span
                            style={{
                                backgroundColor: BRAND.pastelDanger,
                                color: BRAND.danger,
                                padding: "8px 22px",
                                borderRadius: 999,
                                fontFamily: "Inter, sans-serif",
                                fontSize: 24,
                                fontWeight: 900,
                            }}
                        >
              ❌ BORING TEXT FILE
            </span>
                    </div>

                    {[
                        "[12/04/26, 9:41 PM] Ananya: k",
                        "[12/04/26, 9:42 PM] You: <Media omitted> line 4092...",
                        "[12/04/26, 11:58 PM] Ananya: sry was busy",
                    ].map((line, idx) => (
                        <div
                            key={idx}
                            style={{
                                fontFamily: "monospace",
                                fontSize: 25,
                                color: BRAND.slateMuted,
                                backgroundColor: "#F8FAFC",
                                padding: "10px 16px",
                                borderRadius: 12,
                                marginBottom: 10,
                            }}
                        >
                            {line}
                        </div>
                    ))}

                    <svg
                        width="900"
                        height="310"
                        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                    >
                        <line
                            x1="65"
                            y1="40"
                            x2={interpolate(strikeProgress, [0, 1], [65, 835])}
                            y2={interpolate(strikeProgress, [0, 1], [40, 280])}
                            stroke={BRAND.danger}
                            strokeWidth="16"
                            strokeLinecap="round"
                            opacity={strikeProgress > 0.05 ? 0.9 : 0}
                        />
                    </svg>
                </div>

                {/* ---------------- BOTTOM STAGE: CURIOSITY SECRETS REVEALED ---------------- */}
                <div
                    style={{
                        position: "absolute",
                        top: 930,
                        left: 60,
                        right: 60,
                        textAlign: "center",
                    }}
                >
                    <KineticText
                        text="What If This Chat Revealed... 👀"
                        startFrame={panFrame}
                        fontSize={62}
                        highlightWords={["Revealed"]}
                        highlightColor={BRAND.indigo}
                    />
                </div>

                {/* 3 Curiosity Question Cards */}
                <div
                    style={{
                        position: "absolute",
                        top: 1090,
                        left: 85,
                        width: 910,
                        display: "flex",
                        flexDirection: "column",
                        gap: 22,
                    }}
                >
                    {curiosityCards.map((item, idx) => {
                        const cardPop = spring({
                            frame: frame - Math.floor(duration * item.delayOffset),
                            fps,
                            config: { damping: 12, stiffness: 170 },
                        });
                        return (
                            <div
                                key={idx}
                                style={{
                                    backgroundColor: item.bg,
                                    border: `4px solid ${BRAND.borderWhite}`,
                                    borderRadius: 34,
                                    padding: "24px 32px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    transform: `scale(${cardPop})`,
                                    opacity: cardPop,
                                    boxShadow: BRAND.cardShadow,
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                                    <div
                                        style={{
                                            width: 78,
                                            height: 78,
                                            borderRadius: 24,
                                            backgroundColor: "#FFFFFF",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 44,
                                        }}
                                    >
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div
                                            style={{
                                                fontFamily: "Inter, sans-serif",
                                                fontSize: 33,
                                                fontWeight: 900,
                                                color: BRAND.navyText,
                                                marginBottom: 4,
                                            }}
                                        >
                                            {item.title}
                                        </div>
                                        <div
                                            style={{
                                                fontFamily: "Inter, sans-serif",
                                                fontSize: 27,
                                                fontWeight: 800,
                                                color: item.accent,
                                            }}
                                        >
                                            {item.stat}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        backgroundColor: "#FFFFFF",
                                        color: item.accent,
                                        padding: "10px 22px",
                                        borderRadius: 999,
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: 22,
                                        fontWeight: 900,
                                    }}
                                >
                                    {item.badge}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Giant Effort Meter Card ("Effort Kaun Daal Raha Hai, Kaun Nahi! 👀") */}
                <div
                    style={{
                        position: "absolute",
                        top: 1640,
                        left: 85,
                        width: 910,
                        backgroundColor: BRAND.bgCard,
                        border: `5px solid ${BRAND.amberBright}`,
                        borderRadius: 40,
                        padding: "32px 38px",
                        transform: `scale(${effortPop})`,
                        opacity: effortPop,
                        boxShadow: "0 25px 60px rgba(245, 158, 11, 0.22)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 18,
                        }}
                    >
            <span
                style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 38,
                    fontWeight: 900,
                    color: BRAND.navyText,
                }}
            >
              🔥 Real Effort Meter 👀
            </span>
                        <span
                            style={{
                                backgroundColor: BRAND.pastelDanger,
                                color: BRAND.danger,
                                padding: "8px 22px",
                                borderRadius: 999,
                                fontFamily: "Inter, sans-serif",
                                fontSize: 24,
                                fontWeight: 900,
                            }}
                        >
              ONE-SIDED CHAT?
            </span>
                    </div>

                    {/* Tug-of-War Effort Progress Bar */}
                    <div
                        style={{
                            width: "100%",
                            height: 44,
                            backgroundColor: "#FEE2E2",
                            borderRadius: 999,
                            overflow: "hidden",
                            display: "flex",
                            marginBottom: 14,
                        }}
                    >
                        <div
                            style={{
                                width: `${78 * effortPop}%`,
                                height: "100%",
                                background: "linear-gradient(90deg, #10B981, #059669)",
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: 24,
                                color: "#FFFFFF",
                                fontFamily: "Inter, sans-serif",
                                fontSize: 25,
                                fontWeight: 900,
                            }}
                        >
                            YOU: 78% 💪
                        </div>
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                paddingRight: 20,
                                color: BRAND.danger,
                                fontFamily: "Inter, sans-serif",
                                fontSize: 24,
                                fontWeight: 900,
                            }}
                        >
                            22% 😴
                        </div>
                    </div>
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// SCENE 2: THE CHALLENGE ("Day {day}/100 Zero Ad-Budget Challenge")
// ============================================================================
// ============================================================================
// SCENE 2: THE CHALLENGE (No Circular Ring — Animates Text from 1 to Day N)
// ============================================================================
const ChallengeScene: React.FC<{ day: number; duration: number }> = ({
                                                                         day,
                                                                         duration,
                                                                     }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const cardPop = spring({
        frame,
        fps,
        config: { damping: 11, stiffness: 190 },
    });

    // Smoothly count from 1 up to `day` during the first half of the scene
    const countUpEndFrame = Math.max(12, Math.floor(duration * 0.52));
    const animatedDay = Math.round(
        interpolate(frame, [2, countUpEndFrame], [1, day], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        })
    );

    // Extra pop when the counter lands on `day`
    const landPop = spring({
        frame: frame - countUpEndFrame,
        fps,
        config: { damping: 10, stiffness: 220 },
    });
    const numberScale = 1 + interpolate(landPop, [0, 0.5, 1], [0, 0.14, 0]);

    return (
        <AbsoluteFill>
            <SfxCue file="whoosh.wav" from={0} volume={0.35} />
            <SfxCue file="pop.wav" from={4} volume={0.32} />
            <SfxCue file="success_chime.wav" from={countUpEndFrame} volume={0.4} />

            <GridBackground cameraY={-frame * 3.0} />
            <CameraStage scale={interpolate(frame, [0, duration], [0.97, 1.05])}>
                <div style={{ position: "absolute", top: 200, left: 60, right: 60 }}>
                    <KineticText
                        text="Zero Ad-Budget Challenge"
                        fontSize={64}
                        highlightWords={["Zero", "Ad-Budget"]}
                        highlightColor={BRAND.amber}
                    />
                </div>

                {/* Center Clean Pastel Card with 1 -> N Animated Counter (No Circle Bar) */}
                <div
                    style={{
                        position: "absolute",
                        top: 420,
                        left: 90,
                        width: 900,
                        backgroundColor: BRAND.bgCard,
                        border: `5px solid ${BRAND.borderWhite}`,
                        borderRadius: 48,
                        padding: "64px 48px",
                        textAlign: "center",
                        transform: `scale(${cardPop})`,
                        boxShadow: BRAND.cardShadow,
                    }}
                >
                    <div
                        style={{
                            display: "inline-block",
                            backgroundColor: BRAND.pastelMint,
                            color: BRAND.whatsapp,
                            padding: "12px 32px",
                            borderRadius: 999,
                            fontFamily: "Inter, sans-serif",
                            fontSize: 32,
                            fontWeight: 900,
                            letterSpacing: 1.5,
                            marginBottom: 28,
                        }}
                    >
                        💸 ₹0 AD SPEND • ORGANIC GROWTH
                    </div>

                    {/* Giant Animated "DAY 1 -> N" Text */}
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 168,
                            fontWeight: 900,
                            color: BRAND.navyText,
                            lineHeight: 1,
                            letterSpacing: -4,
                            transform: `scale(${numberScale})`,
                            marginBottom: 18,
                        }}
                    >
                        DAY{" "}
                        <span
                            style={{
                                color: BRAND.amber,
                                textShadow: "0 12px 30px rgba(245, 158, 11, 0.28)",
                            }}
                        >
              {animatedDay}
            </span>
                    </div>

                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 46,
                            fontWeight: 900,
                            color: BRAND.slateMuted,
                            letterSpacing: 4,
                        }}
                    >
                        OUT OF 100
                    </div>
                </div>

                {/* Bottom NotesBee Mission Pill */}
                <div
                    style={{
                        position: "absolute",
                        top: 1090,
                        left: 90,
                        right: 90,
                        backgroundColor: BRAND.pastelAmber,
                        border: `4px solid ${BRAND.amberBright}`,
                        borderRadius: 40,
                        padding: "36px 40px",
                        textAlign: "center",
                        boxShadow: BRAND.cardShadow,
                    }}
                >
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 40,
                            fontWeight: 900,
                            color: BRAND.navyText,
                            lineHeight: 1.35,
                        }}
                    >
                        Growing{" "}
                        <span style={{ color: BRAND.amber }}>NotesBee 🐝</span> from Day 1
                        to Day 100!
                    </div>
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// SCENE 3: WHATSAPP FEATURES (Proper WhatsApp Chat UI + Full Analytics Report)
// ============================================================================
const WhatsAppSolutionScene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const panFrame = Math.floor(duration * 0.42);
    const panRight = spring({
        frame: frame - panFrame,
        fps,
        config: { damping: 13, stiffness: 150 },
    });

    const camX = interpolate(panRight, [0, 1], [0, -1080]);

    const chatMessages = [
        { sender: "Ananya", text: "Wait... you imported our .txt into NotesBee?", me: false },
        { sender: "You", text: "Yes! Proper WhatsApp chat UI + Full Report 🐝✨", me: true },
        { sender: "Ananya", text: "Show me our reply speed & effort report! 📊👉", me: false },
    ];

    const reportMetrics = [
        { icon: "💬", label: "Total Messages", val: "18,420", sub: "You: 64% • Ananya: 36%", bg: BRAND.pastelMint },
        { icon: "⚡", label: "Avg Reply Speed", val: "2m 14s", sub: "You reply 12x faster!", bg: BRAND.pastelAmber },
        { icon: "📝", label: "Total Words & Media", val: "48.9K", sub: "1,420 Photos & Voice Notes", bg: BRAND.pastelBlue },
        { icon: "🔥", label: "Conversation Effort", val: "94/100", sub: "Every tiny detail in 1 place", bg: BRAND.pastelPurple },
    ];

    return (
        <AbsoluteFill>
            <SfxCue file="pop.wav" from={3} volume={0.34} />
            <SfxCue file="pop.wav" from={10} volume={0.34} />
            <SfxCue file="pop.wav" from={17} volume={0.34} />
            <SfxCue file="whoosh.wav" from={panFrame - 2} volume={0.4} />
            <SfxCue file="pop.wav" from={panFrame + 6} volume={0.3} />
            <SfxCue file="pop.wav" from={panFrame + 14} volume={0.3} />

            <GridBackground cameraX={camX} />
            <CameraStage x={camX}>
                {/* LEFT CANVAS: PROPER WHATSAPP CHAT UI */}
                <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 1920 }}>
                    <div style={{ position: "absolute", top: 185, left: 65, right: 65 }}>
                        <KineticText
                            text="Proper WhatsApp Chat UI"
                            fontSize={64}
                            highlightWords={["WhatsApp", "Chat"]}
                            highlightColor={BRAND.whatsapp}
                        />
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 380,
                            left: 80,
                            width: 920,
                            backgroundColor: BRAND.bgCard,
                            border: `4px solid ${BRAND.borderWhite}`,
                            borderRadius: 44,
                            padding: 44,
                            boxShadow: BRAND.cardShadow,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingBottom: 24,
                                marginBottom: 26,
                                borderBottom: `2px solid ${BRAND.borderSubtle}`,
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                                <div
                                    style={{
                                        width: 70,
                                        height: 70,
                                        borderRadius: "50%",
                                        backgroundColor: "#FCE7F3",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 36,
                                        fontWeight: 900,
                                        color: "#DB2777",
                                    }}
                                >
                                    A
                                </div>
                                <div>
                                    <div
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: 38,
                                            fontWeight: 900,
                                            color: BRAND.navyText,
                                        }}
                                    >
                                        Ananya
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: 24,
                                            color: BRAND.whatsapp,
                                            fontWeight: 800,
                                        }}
                                    >
                                        ✓ _chat.txt Transformed
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    backgroundColor: BRAND.pastelMint,
                                    border: `2px solid ${BRAND.whatsapp}`,
                                    color: BRAND.whatsapp,
                                    padding: "10px 24px",
                                    borderRadius: 999,
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 25,
                                    fontWeight: 800,
                                }}
                            >
                                💬 WhatsApp
                            </div>
                        </div>

                        {chatMessages.map((msg, i) => {
                            const bubblePop = spring({
                                frame: frame - (3 + i * 7),
                                fps,
                                config: { damping: 11, stiffness: 180 },
                            });
                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        justifyContent: msg.me ? "flex-end" : "flex-start",
                                        marginBottom: 22,
                                        transform: `scale(${bubblePop})`,
                                        transformOrigin: msg.me ? "right center" : "left center",
                                        opacity: bubblePop,
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: "82%",
                                            backgroundColor: msg.me ? "#DBEAFE" : "#F1F5F9",
                                            padding: "24px 30px",
                                            borderRadius: 30,
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: 32,
                                            fontWeight: 700,
                                            color: BRAND.navyText,
                                            lineHeight: 1.35,
                                        }}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT CANVAS: FULL CONVERSATION REPORT */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 1080,
                        width: 1080,
                        height: 1920,
                    }}
                >
                    <div style={{ position: "absolute", top: 180, left: 60, right: 60 }}>
                        <KineticText
                            text="Full Conversation Report 📊"
                            startFrame={panFrame}
                            fontSize={62}
                            highlightWords={["Full", "Report"]}
                            highlightColor={BRAND.amber}
                        />
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 370,
                            left: 80,
                            width: 920,
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 26,
                        }}
                    >
                        {reportMetrics.map((m, idx) => {
                            const cardPop = spring({
                                frame: frame - panFrame - idx * 5,
                                fps,
                                config: { damping: 12, stiffness: 160 },
                            });
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        backgroundColor: m.bg,
                                        border: `4px solid ${BRAND.borderWhite}`,
                                        borderRadius: 38,
                                        padding: "34px 28px",
                                        transform: `scale(${cardPop})`,
                                        opacity: cardPop,
                                        boxShadow: BRAND.cardShadow,
                                    }}
                                >
                                    <div style={{ fontSize: 48, marginBottom: 12 }}>{m.icon}</div>
                                    <div
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: 26,
                                            fontWeight: 800,
                                            color: BRAND.slateMuted,
                                            marginBottom: 6,
                                        }}
                                    >
                                        {m.label}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: 56,
                                            fontWeight: 900,
                                            color: BRAND.navyText,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {m.val}
                                    </div>
                                    <div
                                        style={{
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: 23,
                                            fontWeight: 800,
                                            color: BRAND.indigo,
                                        }}
                                    >
                                        {m.sub}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// SCENE 4 (REDESIGNED & CRYSTAL CLEAR): SECRET NOTES + PASSWORD + FAKE COVER
// Step 1 (0 - 50%): Setup Screen showing Real Secret -> Password + Fake Cover inputs
// Step 2 (50% - 100%): Side-by-Side Split: "What Others See" vs "What You See"
// ============================================================================
const DecoyPrivacyScene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const splitFrame = Math.floor(duration * 0.50);

    const pinCount = Math.min(
        4,
        Math.max(
            0,
            Math.floor(
                interpolate(frame, [6, Math.floor(duration * 0.25)], [0, 4], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                })
            )
        )
    );

    const fakeFieldsPop = spring({
        frame: frame - Math.floor(duration * 0.16),
        fps,
        config: { damping: 12, stiffness: 170 },
    });

    const panToComparison = spring({
        frame: frame - splitFrame,
        fps,
        config: { damping: 13, stiffness: 150 },
    });

    const camX = interpolate(panToComparison, [0, 1], [0, -1080]);

    return (
        <AbsoluteFill>
            <SfxCue file="pop.wav" from={2} volume={0.32} />
            {[0, 1, 2, 3].map((idx) => (
                <SfxCue key={idx} file="key_tick.wav" from={6 + idx * 5} volume={0.36} />
            ))}
            <SfxCue file="pop.wav" from={Math.floor(duration * 0.18)} volume={0.34} />
            <SfxCue file="whoosh.wav" from={splitFrame - 2} volume={0.4} />
            <SfxCue file="success_chime.wav" from={splitFrame + 6} volume={0.38} />

            <GridBackground cameraX={camX} />
            <CameraStage x={camX}>
                {/* ---------------- STEP 1 (LEFT CANVAS): HOW YOU SET IT UP ---------------- */}
                <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 1920 }}>
                    <div style={{ position: "absolute", top: 175, left: 60, right: 60 }}>
                        <KineticText
                            text="Step 1: Set Password & Fake Cover"
                            fontSize={58}
                            highlightWords={["Password", "Fake", "Cover"]}
                            highlightColor={BRAND.purple}
                        />
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 350,
                            left: 80,
                            width: 920,
                            backgroundColor: BRAND.bgCard,
                            border: `4px solid ${BRAND.borderWhite}`,
                            borderRadius: 44,
                            padding: 40,
                            boxShadow: BRAND.cardShadow,
                        }}
                    >
                        {/* Box A: The Real Secret Note */}
                        <div
                            style={{
                                backgroundColor: "#FCE7F3",
                                border: "3px solid #F472B6",
                                borderRadius: 28,
                                padding: "22px 28px",
                                marginBottom: 22,
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 22,
                                    fontWeight: 900,
                                    color: "#9D174D",
                                    marginBottom: 6,
                                }}
                            >
                                🔒 YOUR REAL SECRET NOTE (HIDDEN)
                            </div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 36,
                                    fontWeight: 900,
                                    color: "#831843",
                                }}
                            >
                                💎 My Startup Ideas & Bank PINs
                            </div>
                        </div>

                        {/* Box B: Password Input */}
                        <div
                            style={{
                                backgroundColor: BRAND.pastelPurple,
                                borderRadius: 26,
                                padding: "20px 28px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 22,
                            }}
                        >
              <span
                  style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 28,
                      fontWeight: 900,
                      color: BRAND.navyText,
                  }}
              >
                🔑 Set Password:
              </span>
                            <div style={{ display: "flex", gap: 14 }}>
                                {[0, 1, 2, 3].map((d) => (
                                    <div
                                        key={d}
                                        style={{
                                            width: 26,
                                            height: 26,
                                            borderRadius: "50%",
                                            backgroundColor: d < pinCount ? BRAND.purple : "#CBD5E1",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Box C: Fake Title & Fake Description Setup */}
                        <div
                            style={{
                                backgroundColor: BRAND.pastelAmber,
                                border: `3px dashed ${BRAND.amberBright}`,
                                borderRadius: 28,
                                padding: "24px 28px",
                                transform: `scale(${fakeFieldsPop})`,
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 23,
                                    fontWeight: 900,
                                    color: BRAND.amber,
                                    marginBottom: 12,
                                }}
                            >
                                🎭 SET FAKE COVER FOR OTHERS:
                            </div>
                            <div
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    padding: "14px 20px",
                                    borderRadius: 18,
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 28,
                                    fontWeight: 800,
                                    color: BRAND.navyText,
                                    marginBottom: 12,
                                }}
                            >
                                <span style={{ color: BRAND.slateMuted }}>Fake Title: </span>
                                🛒 Simple Grocery List
                            </div>
                            <div
                                style={{
                                    backgroundColor: "#FFFFFF",
                                    padding: "14px 20px",
                                    borderRadius: 18,
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 27,
                                    fontWeight: 700,
                                    color: BRAND.slateMuted,
                                }}
                            >
                                <span style={{ fontWeight: 800 }}>Fake Description: </span>
                                Buy 2L milk, brown bread & eggs
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------------- STEP 2 (RIGHT CANVAS): SNOOPER VIEW VS YOUR VIEW ---------------- */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 1080,
                        width: 1080,
                        height: 1920,
                    }}
                >
                    <div style={{ position: "absolute", top: 175, left: 60, right: 60 }}>
                        <KineticText
                            text="What Others See vs What You See"
                            startFrame={splitFrame}
                            fontSize={58}
                            highlightWords={["Others", "You"]}
                            highlightColor={BRAND.whatsapp}
                        />
                    </div>

                    {/* Card 1: What Friends / Snoopers See */}
                    <div
                        style={{
                            position: "absolute",
                            top: 350,
                            left: 80,
                            width: 920,
                            backgroundColor: BRAND.bgCard,
                            border: `4px solid ${BRAND.borderWhite}`,
                            borderRadius: 40,
                            padding: 38,
                            boxShadow: BRAND.cardShadow,
                        }}
                    >
                        <div
                            style={{
                                display: "inline-block",
                                backgroundColor: BRAND.pastelAmber,
                                color: BRAND.amber,
                                padding: "8px 22px",
                                borderRadius: 999,
                                fontFamily: "Inter, sans-serif",
                                fontSize: 24,
                                fontWeight: 900,
                                marginBottom: 14,
                            }}
                        >
                            👀 WHAT OTHERS SEE (WITHOUT PASSWORD)
                        </div>
                        <div
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: 46,
                                fontWeight: 900,
                                color: BRAND.navyText,
                                marginBottom: 10,
                            }}
                        >
                            🛒 Simple Grocery List
                        </div>
                        <div
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: 31,
                                fontWeight: 600,
                                color: BRAND.slateMuted,
                            }}
                        >
                            • Buy 2L milk, brown bread & eggs (Looks 100% boring!)
                        </div>
                    </div>

                    {/* Card 2: What YOU See After Entering Password */}
                    <div
                        style={{
                            position: "absolute",
                            top: 760,
                            left: 80,
                            width: 920,
                            backgroundColor: "#ECFDF5",
                            border: `5px solid ${BRAND.whatsapp}`,
                            borderRadius: 40,
                            padding: 38,
                            boxShadow: "0 24px 60px rgba(16, 185, 129, 0.18)",
                        }}
                    >
                        <div
                            style={{
                                display: "inline-block",
                                backgroundColor: "#D1FAE5",
                                color: "#065F46",
                                padding: "8px 22px",
                                borderRadius: 999,
                                fontFamily: "Inter, sans-serif",
                                fontSize: 24,
                                fontWeight: 900,
                                marginBottom: 14,
                            }}
                        >
                            🔓 WHAT YOU SEE (WITH PASSWORD)
                        </div>
                        <div
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: 46,
                                fontWeight: 900,
                                color: "#064E3B",
                                marginBottom: 10,
                            }}
                        >
                            💎 My Startup Ideas & Bank PINs
                        </div>
                        <div
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: 31,
                                fontWeight: 700,
                                color: "#047857",
                            }}
                        >
                            • Secret App Launch Plan 🚀 & Private Notes!
                        </div>
                    </div>
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// SCENE 5: AI ENHANCER ("Grammar ho ya writing tone... bas ek tap mein!")
// ============================================================================
const AiEnhancerScene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scanStartFrame = Math.floor(duration * 0.14);
    const scanEndFrame = Math.floor(duration * 0.56);

    const scanProgress = interpolate(
        frame,
        [scanStartFrame, scanEndFrame],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const isEnhanced = scanProgress > 0.48;
    const beamY = interpolate(scanProgress, [0, 1], [0, 520]);

    return (
        <AbsoluteFill>
            <SfxCue file="pop.wav" from={1} volume={0.32} />
            <SfxCue file="magic_scan.wav" from={scanStartFrame} volume={0.4} />
            <SfxCue
                file="success_chime.wav"
                from={Math.floor((scanStartFrame + scanEndFrame) / 2)}
                volume={0.34}
            />

            <GridBackground cameraX={-frame * 2.4} />
            <CameraStage scale={interpolate(frame, [0, duration], [0.97, 1.05])}>
                <div style={{ position: "absolute", top: 185, left: 60, right: 60 }}>
                    <KineticText
                        text="1-Tap AI Note Enhancer"
                        fontSize={64}
                        highlightWords={["1-Tap", "AI", "Enhancer"]}
                        highlightColor={BRAND.amber}
                    />
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 380,
                        left: 85,
                        width: 910,
                        height: 520,
                        backgroundColor: BRAND.bgCard,
                        border: `5px solid ${isEnhanced ? BRAND.amberBright : BRAND.borderWhite}`,
                        borderRadius: 44,
                        padding: 46,
                        overflow: "hidden",
                        boxShadow: BRAND.cardShadow,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 24,
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: isEnhanced ? BRAND.pastelAmber : BRAND.pastelDanger,
                                color: isEnhanced ? BRAND.amber : BRAND.danger,
                                padding: "10px 26px",
                                borderRadius: 999,
                                fontFamily: "Inter, sans-serif",
                                fontSize: 26,
                                fontWeight: 900,
                            }}
                        >
                            {isEnhanced
                                ? "✨ PERFECT GRAMMAR & TONE"
                                : "❌ ROUGH DRAFT (GRAMMAR ERRORS)"}
                        </div>
                        <div style={{ fontSize: 48 }}>{isEnhanced ? "🤖✨" : "📝"}</div>
                    </div>

                    {!isEnhanced ? (
                        <div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 46,
                                    fontWeight: 800,
                                    color: BRAND.slateMuted,
                                    marginBottom: 18,
                                    textDecoration: "underline wavy #EF4444",
                                }}
                            >
                                meting with clint tommorow
                            </div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 34,
                                    fontWeight: 600,
                                    color: "#64748B",
                                    lineHeight: 1.5,
                                }}
                            >
                                discus app roadmp and send files fastly. dont forget ask abut
                                budgetting...
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 46,
                                    fontWeight: 900,
                                    color: BRAND.navyText,
                                    marginBottom: 18,
                                }}
                            >
                                📅 Client Strategy Meeting Tomorrow
                            </div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 33,
                                    fontWeight: 700,
                                    color: BRAND.navyText,
                                    lineHeight: 1.5,
                                    backgroundColor: BRAND.pastelAmber,
                                    padding: 26,
                                    borderRadius: 26,
                                }}
                            >
                                ✅ Present Q4 App Roadmap & deliverables
                                <br />
                                💡 Finalize project budget & timeline
                            </div>
                        </div>
                    )}

                    {scanProgress > 0.02 && scanProgress < 0.98 && (
                        <div
                            style={{
                                position: "absolute",
                                top: beamY,
                                left: 0,
                                right: 0,
                                height: 16,
                                background:
                                    "linear-gradient(90deg, transparent, #F59E0B, #FEF08A, #F59E0B, transparent)",
                                boxShadow: "0 0 45px 14px rgba(245, 158, 11, 0.7)",
                            }}
                        />
                    )}
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 960,
                        left: 85,
                        width: 910,
                        display: "flex",
                        gap: 24,
                    }}
                >
                    {[
                        { icon: "✅", title: "Fix Grammar", bg: BRAND.pastelMint },
                        { icon: "🎯", title: "Better Writing Tone", bg: BRAND.pastelBlue },
                    ].map((item, i) => {
                        const pop = spring({
                            frame: frame - 6 - i * 5,
                            fps,
                            config: { damping: 11, stiffness: 180 },
                        });
                        return (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    backgroundColor: item.bg,
                                    border: `4px solid ${BRAND.borderWhite}`,
                                    borderRadius: 32,
                                    padding: "28px 30px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 16,
                                    transform: `scale(${pop})`,
                                    boxShadow: BRAND.cardShadow,
                                }}
                            >
                                <span style={{ fontSize: 44 }}>{item.icon}</span>
                                <span
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: 31,
                                        fontWeight: 900,
                                        color: BRAND.navyText,
                                    }}
                                >
                  {item.title}
                </span>
                            </div>
                        );
                    })}
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// SCENE 6: 1,000+ BACKGROUNDS + COLLAB & CLOUD SYNC
// ============================================================================
const Backgrounds1000Scene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const themes = [
        {
            name: "🌅 Cozy Autumn",
            gradient: "linear-gradient(135deg, #78350F 0%, #D97706 55%, #FDE68A 100%)",
        },
        {
            name: "🌊 Ocean Breeze",
            gradient: "linear-gradient(135deg, #0F172A 0%, #0284C7 55%, #7DD3FC 100%)",
        },
        {
            name: "🌸 Sakura Pink",
            gradient: "linear-gradient(135deg, #831843 0%, #DB2777 55%, #FBCFE8 100%)",
        },
        {
            name: "✨ Royal Midnight",
            gradient: "linear-gradient(135deg, #1E1B4B 0%, #6D28D9 55%, #F59E0B 100%)",
        },
    ];

    const themeIndex =
        Math.floor(
            interpolate(frame, [0, duration - 8], [0, themes.length - 0.01], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            })
        ) % themes.length;

    const activeTheme = themes[themeIndex];

    const countVal = Math.round(
        interpolate(frame, [2, Math.floor(duration * 0.45)], [200, 1000], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        })
    );

    const stepFrames = Math.floor((duration - 8) / themes.length);

    return (
        <AbsoluteFill>
            {[0, 1, 2, 3].map((idx) => (
                <SfxCue
                    key={idx}
                    file="pop.wav"
                    from={idx * stepFrames + 1}
                    volume={0.32}
                />
            ))}
            <SfxCue
                file="success_chime.wav"
                from={Math.floor(duration * 0.45)}
                volume={0.35}
            />

            <GridBackground cameraY={-frame * 2.2} />
            <CameraStage scale={interpolate(frame, [0, duration], [0.97, 1.05])}>
                <div
                    style={{
                        position: "absolute",
                        top: 170,
                        left: 60,
                        right: 60,
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 102,
                            fontWeight: 900,
                            color: BRAND.amber,
                            lineHeight: 1,
                            marginBottom: 6,
                        }}
                    >
                        {countVal}+
                    </div>
                    <KineticText
                        text="Beautiful Note Backgrounds"
                        fontSize={58}
                        highlightWords={["Beautiful", "Backgrounds"]}
                        highlightColor={BRAND.indigo}
                    />
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 430,
                        left: 85,
                        width: 910,
                        height: 500,
                        background: activeTheme.gradient,
                        border: "6px solid #FFFFFF",
                        borderRadius: 46,
                        padding: 46,
                        boxShadow: "0 30px 70px rgba(15, 23, 42, 0.22)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span
                style={{
                    backgroundColor: "rgba(255,255,255,0.25)",
                    color: "#FFFFFF",
                    padding: "10px 26px",
                    borderRadius: 999,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 26,
                    fontWeight: 900,
                }}
            >
              🎨 {activeTheme.name}
            </span>
                        <span
                            style={{
                                backgroundColor: "#FFFFFF",
                                color: BRAND.navyText,
                                padding: "10px 24px",
                                borderRadius: 999,
                                fontFamily: "Inter, sans-serif",
                                fontSize: 24,
                                fontWeight: 900,
                            }}
                        >
              ✨ Custom Mood
            </span>
                    </div>

                    <div>
                        <div
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: 54,
                                fontWeight: 900,
                                color: "#FFFFFF",
                                marginBottom: 14,
                            }}
                        >
                            Bucket List Trips ✈️
                        </div>
                        <div
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: 33,
                                fontWeight: 700,
                                color: "rgba(255,255,255,0.92)",
                                lineHeight: 1.45,
                            }}
                        >
                            • Kyoto in Autumn 🍁 & Ladakh Roadtrip 🏔️
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
                        {themes.map((_, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: idx === themeIndex ? 54 : 18,
                                    height: 18,
                                    borderRadius: 999,
                                    backgroundColor:
                                        idx === themeIndex ? "#FFFFFF" : "rgba(255,255,255,0.45)",
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 990,
                        left: 85,
                        width: 910,
                        display: "flex",
                        gap: 26,
                    }}
                >
                    {[
                        { icon: "👥", title: "Real-Time Collab", bg: BRAND.pastelPink },
                        { icon: "☁️", title: "Instant Cloud Sync", bg: BRAND.pastelBlue },
                    ].map((card, i) => {
                        const pop = spring({
                            frame: frame - 6 - i * 6,
                            fps,
                            config: { damping: 11, stiffness: 180 },
                        });
                        return (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    backgroundColor: card.bg,
                                    border: `4px solid ${BRAND.borderWhite}`,
                                    borderRadius: 34,
                                    padding: "30px 26px",
                                    textAlign: "center",
                                    transform: `scale(${pop})`,
                                    boxShadow: BRAND.cardShadow,
                                }}
                            >
                                <div style={{ fontSize: 48, marginBottom: 8 }}>{card.icon}</div>
                                <div
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: 31,
                                        fontWeight: 900,
                                        color: BRAND.navyText,
                                    }}
                                >
                                    {card.title}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// SCENE 7: CALL TO ACTION
// ============================================================================
const CtaScene: React.FC<{ day: number; duration: number }> = ({ day }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const [iconError, setIconError] = useState(false);
    const [playStoreError, setPlayStoreError] = useState(false);

    const heroPop = spring({
        frame,
        fps,
        config: { damping: 11, stiffness: 170 },
    });
    const pulse = 1 + Math.sin(frame * 0.32) * 0.045;

    return (
        <AbsoluteFill>
            <SfxCue file="whoosh.wav" from={0} volume={0.36} />
            <SfxCue file="success_chime.wav" from={4} volume={0.4} />
            <SfxCue file="pop.wav" from={12} volume={0.34} />

            <GridBackground cameraY={-frame * 2.0} />
            <CameraStage scale={heroPop}>
                <div
                    style={{
                        position: "absolute",
                        top: 180,
                        left: 60,
                        right: 60,
                        textAlign: "center",
                    }}
                >
                    <KineticText
                        text="Notes App, Like Never Before"
                        fontSize={64}
                        highlightWords={["Notes"]}
                        highlightColor={BRAND.amber}
                    />
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 370,
                        left: 105,
                        right: 105,
                        backgroundColor: BRAND.bgCard,
                        border: `4px solid ${BRAND.borderWhite}`,
                        borderRadius: 46,
                        padding: "46px 38px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxShadow: BRAND.cardShadow,
                    }}
                >
                    {!iconError ? (
                        <Img
                            src={staticFile("icon.png")}
                            onError={() => setIconError(true)}
                            style={{
                                width: 185,
                                height: 185,
                                borderRadius: 44,
                                objectFit: "cover",
                                boxShadow: "0 18px 40px rgba(245, 158, 11, 0.28)",
                                marginBottom: 22,
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: 185,
                                height: 185,
                                borderRadius: 44,
                                background: `linear-gradient(135deg, #FBBF24, ${BRAND.amber})`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 98,
                                marginBottom: 22,
                            }}
                        >
                            🐝
                        </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
                style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 78,
                    fontWeight: 900,
                    color: BRAND.navyText,
                    letterSpacing: -1.5,
                }}
            >
              Notes<span style={{ color: BRAND.amber }}>Bee</span>
            </span>
                        <span
                            style={{
                                backgroundColor: BRAND.pastelPurple,
                                color: BRAND.purple,
                                fontFamily: "Inter, sans-serif",
                                fontSize: 25,
                                fontWeight: 900,
                                padding: "6px 16px",
                                borderRadius: 12,
                            }}
                        >
              ✨ PRO
            </span>
                    </div>

                    <div
                        style={{
                            marginTop: 28,
                            transform: `scale(${pulse})`,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        {!playStoreError ? (
                            <Img
                                src={staticFile("playstore.png")}
                                onError={() => setPlayStoreError(true)}
                                style={{
                                    height: 120,
                                    objectFit: "contain",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    backgroundColor: BRAND.navyText,
                                    color: "#FFFFFF",
                                    padding: "24px 50px",
                                    borderRadius: 24,
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 42,
                                    fontWeight: 900,
                                }}
                            >
                                ▶ Get it on Google Play
                            </div>
                        )}
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 1090,
                        left: 105,
                        right: 105,
                        backgroundColor: BRAND.pastelAmber,
                        border: `4px solid ${BRAND.amberBright}`,
                        borderRadius: 40,
                        padding: "34px 38px",
                        textAlign: "center",
                        boxShadow: "0 20px 45px rgba(245, 158, 11, 0.18)",
                    }}
                >
                    <div
                        style={{
                            display: "inline-block",
                            backgroundColor: BRAND.amber,
                            color: "#FFFFFF",
                            fontFamily: "Inter, sans-serif",
                            fontSize: 46,
                            fontWeight: 900,
                            padding: "14px 42px",
                            borderRadius: 999,
                            letterSpacing: 1.5,
                            marginBottom: 14,
                            transform: `scale(${pulse})`,
                        }}
                    >
                        🔗 LINK IN BIO
                    </div>
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 32,
                            fontWeight: 800,
                            color: BRAND.navyText,
                        }}
                    >
                        Follow the 100-Day Journey (Day {day}/100)!
                    </div>
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// MASTER REEL COMPOSITION
// ============================================================================
export const NotesBeeReel: React.FC<NotesBeeProps> = ({ day = 1, timeline }) => {
    const activeTimeline = timeline ?? getDefaultTimeline(day);
    const currentDay = activeTimeline.day ?? day;

    const renderSceneContent = (id: string, durationInFrames: number) => {
        switch (id) {
            case "hook":
                return <HookScene duration={durationInFrames} />;
            case "challenge":
                return <ChallengeScene day={currentDay} duration={durationInFrames} />;
            case "whatsapp_solution":
                return <WhatsAppSolutionScene duration={durationInFrames} />;
            case "decoy_privacy":
                return <DecoyPrivacyScene duration={durationInFrames} />;
            case "ai_enhancer":
                return <AiEnhancerScene duration={durationInFrames} />;
            case "backgrounds_1000":
                return <Backgrounds1000Scene duration={durationInFrames} />;
            case "cta":
            default:
                return <CtaScene day={currentDay} duration={durationInFrames} />;
        }
    };

    return (
        <AbsoluteFill style={{ backgroundColor: BRAND.bgBase }}>
            {activeTimeline.scenes.map((scene) => (
                <Sequence
                    key={scene.id}
                    from={scene.startFrame}
                    durationInFrames={scene.durationInFrames}
                >
                    {renderSceneContent(scene.id, scene.durationInFrames)}

                    {/* Persistent Top Challenge Pill */}
                    <div
                        style={{
                            position: "absolute",
                            top: 62,
                            left: 0,
                            right: 0,
                            display: "flex",
                            justifyContent: "center",
                            pointerEvents: "none",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.94)",
                                border: "3px solid #FFFFFF",
                                borderRadius: 999,
                                padding: "14px 36px",
                                fontFamily: "Inter, sans-serif",
                                fontSize: 28,
                                fontWeight: 900,
                                color: BRAND.navyText,
                                letterSpacing: 0.8,
                                boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                            }}
                        >
                            🐝 Notes<span style={{ color: BRAND.amber }}>Bee</span> •{" "}
                            <span style={{ color: BRAND.indigo }}>
                DAY {currentDay} / 100
              </span>{" "}
                            • ₹0 ADS
                        </div>
                    </div>

                    {scene.audioFile ? (
                        <Audio src={staticFile(scene.audioFile)} />
                    ) : null}
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
