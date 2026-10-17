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
}> = ({ file, from, volume = 0.32 }) => {
    return (
        <Sequence from={Math.max(0, Math.floor(from))} durationInFrames={45}>
            <Audio src={staticFile(`sfx/${file}`)} volume={volume} />
        </Sequence>
    );
};

// ============================================================================
// SCENE 1: THE HOOK (Raw .txt file + Boring Notes App)
// ============================================================================
const HookScene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const slashFrame = Math.floor(duration * 0.32);
    const panFrame = Math.floor(duration * 0.46);

    const panToSecondCard = spring({
        frame: frame - panFrame,
        fps,
        config: { damping: 14, stiffness: 120 },
    });

    const camY = interpolate(panToSecondCard, [0, 1], [150, -310]);
    const camScale = interpolate(frame, [0, duration], [1.04, 0.96]);
    const camRotate = interpolate(panToSecondCard, [0, 1], [-1.2, 1.2]);

    const card1Pop = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
    const strikeProgress = spring({
        frame: frame - slashFrame,
        fps,
        config: { damping: 14 },
    });

    return (
        <AbsoluteFill>
            {/* Scene 1 SFX Cues */}
            <SfxCue file="pop.wav" from={2} volume={0.35} />
            <SfxCue file="error_slash.wav" from={slashFrame} volume={0.38} />
            <SfxCue file="whoosh.wav" from={panFrame - 2} volume={0.35} />
            <SfxCue file="pop.wav" from={panFrame + 6} volume={0.32} />

            <GridBackground cameraY={camY} />
            <CameraStage y={camY} scale={camScale} rotate={camRotate}>
                <div style={{ position: "absolute", top: 185, left: 70, right: 70 }}>
                    <KineticText
                        text="Exporting WhatsApp Chats?"
                        fontSize={68}
                        highlightWords={["WhatsApp", "Chats"]}
                        highlightColor={BRAND.amber}
                    />
                    <div
                        style={{
                            textAlign: "center",
                            fontFamily: "Inter, sans-serif",
                            fontSize: 34,
                            fontWeight: 700,
                            color: BRAND.slateMuted,
                            marginTop: 14,
                        }}
                    >
                        Why does saving memories give you a messy file?
                    </div>
                </div>

                {/* Ugly Raw .TXT File Card */}
                <div
                    style={{
                        position: "absolute",
                        top: 430,
                        left: 95,
                        width: 890,
                        backgroundColor: BRAND.bgCard,
                        border: `4px solid ${BRAND.borderWhite}`,
                        borderRadius: 40,
                        padding: 44,
                        transform: `scale(${card1Pop})`,
                        boxShadow: BRAND.cardShadow,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 24,
                            borderBottom: `2px solid ${BRAND.borderSubtle}`,
                            paddingBottom: 18,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 18,
                                    backgroundColor: BRAND.pastelDanger,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                📄
                            </div>
                            <span
                                style={{
                                    fontFamily: "monospace",
                                    fontSize: 36,
                                    fontWeight: 800,
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
                                padding: "10px 22px",
                                borderRadius: 999,
                                fontFamily: "Inter, sans-serif",
                                fontSize: 24,
                                fontWeight: 800,
                            }}
                        >
              UNREADABLE
            </span>
                    </div>

                    {[
                        "[12/04/26, 9:41 PM] Ananya: Are you awake? Did you save it?",
                        "[12/04/26, 9:42 PM] You: <Media omitted> line 4092...",
                        "[12/04/26, 9:43 PM] Ananya: Ugh I cannot read this raw text file!",
                        "[12/04/26, 9:44 PM] You: Everything looks completely broken.",
                    ].map((line, idx) => (
                        <div
                            key={idx}
                            style={{
                                fontFamily: "monospace",
                                fontSize: 26,
                                color: BRAND.slateMuted,
                                backgroundColor: "#F8FAFC",
                                padding: "12px 16px",
                                borderRadius: 12,
                                marginBottom: 12,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                opacity: interpolate(frame, [6 + idx * 6, 16 + idx * 6], [0, 1], {
                                    extrapolateLeft: "clamp",
                                    extrapolateRight: "clamp",
                                }),
                            }}
                        >
                            {line}
                        </div>
                    ))}

                    {/* Red Animated SVG Cross Slash */}
                    <svg
                        width="890"
                        height="400"
                        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                    >
                        <line
                            x1="70"
                            y1="55"
                            x2={interpolate(strikeProgress, [0, 1], [70, 820])}
                            y2={interpolate(strikeProgress, [0, 1], [55, 345])}
                            stroke={BRAND.danger}
                            strokeWidth="14"
                            strokeLinecap="round"
                            opacity={strikeProgress > 0.05 ? 0.88 : 0}
                        />
                    </svg>
                </div>

                {/* Dashed Connector Arrow */}
                <svg
                    width="1080"
                    height="2200"
                    style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                >
                    <AnimatedSvgPath
                        d="M 540 860 C 440 970, 640 1010, 540 1130"
                        stroke={BRAND.indigo}
                        strokeWidth={8}
                        startFrame={Math.floor(duration * 0.38)}
                        durationInFrames={20}
                        dashed
                    />
                </svg>

                {/* Default Boring Notes App Card */}
                <div
                    style={{
                        position: "absolute",
                        top: 1150,
                        left: 95,
                        width: 890,
                        backgroundColor: BRAND.pastelPurple,
                        border: `4px solid ${BRAND.borderWhite}`,
                        borderRadius: 40,
                        padding: 46,
                        transform: `scale(${panToSecondCard})`,
                        opacity: panToSecondCard,
                        boxShadow: BRAND.cardShadow,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 20,
                            marginBottom: 16,
                        }}
                    >
                        <div
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: 22,
                                backgroundColor: "#DDD6FE",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 40,
                            }}
                        >
                            🔓
                        </div>
                        <div
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: 44,
                                fontWeight: 900,
                                color: BRAND.navyText,
                            }}
                        >
                            Default Notes = Zero Privacy
                        </div>
                    </div>
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 32,
                            fontWeight: 600,
                            color: BRAND.slateMuted,
                            lineHeight: 1.45,
                        }}
                    >
                        Plain white screens, no chat imports, and zero protection from people
                        peeking at your phone.
                    </div>
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// SCENE 2: THE PROBLEM (Uses 👁️ Eye Emoji + Radar Ping SFX)
// ============================================================================
const ProblemScene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const zoom = interpolate(frame, [0, duration], [0.96, 1.07]);
    const pop = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });

    return (
        <AbsoluteFill>
            {/* Scene 2 SFX Cues */}
            <SfxCue file="whoosh.wav" from={0} volume={0.3} />
            <SfxCue file="radar_ping.wav" from={6} volume={0.32} />
            <SfxCue file="pop.wav" from={14} volume={0.3} />
            <SfxCue file="pop.wav" from={22} volume={0.3} />
            <SfxCue file="radar_ping.wav" from={Math.floor(duration * 0.52)} volume={0.26} />

            <GridBackground cameraX={frame * 1.8} />
            <CameraStage scale={zoom}>
                <div style={{ position: "absolute", top: 200, left: 70, right: 70 }}>
                    <KineticText
                        text="Memories Lost. Privacy Exposed."
                        fontSize={68}
                        highlightWords={["Lost", "Exposed"]}
                        highlightColor={BRAND.danger}
                    />
                </div>

                {/* Radar Rings + Curved Dashed Paths */}
                <svg
                    width="1080"
                    height="1100"
                    style={{ position: "absolute", top: 430, left: 0 }}
                >
                    {[140, 240, 340].map((radius, idx) => {
                        const pulse = (frame * 2.2 + idx * 30) % 100;
                        const r = radius + pulse * 0.9;
                        const op = interpolate(pulse, [0, 100], [0.5, 0]);
                        return (
                            <circle
                                key={idx}
                                cx="540"
                                cy="450"
                                r={r}
                                fill="none"
                                stroke={BRAND.danger}
                                strokeWidth="4"
                                opacity={op}
                            />
                        );
                    })}

                    <AnimatedSvgPath
                        d="M 160 220 Q 540 70, 920 240"
                        stroke={BRAND.indigo}
                        strokeWidth={7}
                        startFrame={4}
                        durationInFrames={30}
                        dashed
                    />
                    <AnimatedSvgPath
                        d="M 160 690 Q 540 850, 920 670"
                        stroke={BRAND.amberBright}
                        strokeWidth={7}
                        startFrame={10}
                        durationInFrames={35}
                        dashed
                    />
                </svg>

                {/* Center Eye Emoji Badge (👁️) */}
                <div
                    style={{
                        position: "absolute",
                        top: 880 - 130,
                        left: 540 - 130,
                        width: 260,
                        height: 260,
                        borderRadius: "50%",
                        backgroundColor: BRAND.bgCard,
                        border: `8px solid ${BRAND.danger}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 135,
                        transform: `scale(${pop})`,
                        boxShadow: "0 25px 60px rgba(239, 68, 68, 0.25)",
                    }}
                >
                    👁️
                </div>

                {/* Bottom Floating Problem Cards */}
                <div
                    style={{
                        position: "absolute",
                        top: 1270,
                        left: 80,
                        right: 80,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 28,
                    }}
                >
                    {[
                        {
                            icon: "🗂️",
                            bg: BRAND.pastelAmber,
                            iconBg: "#FDE68A",
                            label: "Chats Buried in .TXT",
                            sub: "Impossible to search or read",
                        },
                        {
                            icon: "🔓",
                            bg: BRAND.pastelPink,
                            iconBg: "#FBCFE8",
                            label: "Zero Snooper Shield",
                            sub: "Anyone can read your notes",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            style={{
                                flex: 1,
                                backgroundColor: item.bg,
                                border: `4px solid ${BRAND.borderWhite}`,
                                borderRadius: 36,
                                padding: "36px 26px",
                                textAlign: "center",
                                boxShadow: BRAND.cardShadow,
                                transform: `scale(${spring({
                                    frame: frame - 10 - i * 8,
                                    fps,
                                })})`,
                            }}
                        >
                            <div
                                style={{
                                    width: 82,
                                    height: 82,
                                    borderRadius: 24,
                                    backgroundColor: item.iconBg,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 44,
                                    margin: "0 auto 16px",
                                }}
                            >
                                {item.icon}
                            </div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 33,
                                    fontWeight: 900,
                                    color: BRAND.navyText,
                                    marginBottom: 8,
                                }}
                            >
                                {item.label}
                            </div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 25,
                                    fontWeight: 600,
                                    color: BRAND.slateMuted,
                                }}
                            >
                                {item.sub}
                            </div>
                        </div>
                    ))}
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// SCENE 3: THE 100-DAY CHALLENGE STAMP
// ============================================================================
const ChallengeScene: React.FC<{ day: number; duration: number }> = ({
                                                                         day,
                                                                         duration,
                                                                     }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const badgePop = spring({
        frame,
        fps,
        config: { damping: 11, stiffness: 150 },
    });

    const ringProgress = interpolate(frame, [8, duration - 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const radius = 255;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - ringProgress);

    return (
        <AbsoluteFill>
            {/* Scene 3 SFX Cues */}
            <SfxCue file="whoosh.wav" from={0} volume={0.32} />
            <SfxCue file="success_chime.wav" from={6} volume={0.36} />
            <SfxCue file="pop.wav" from={18} volume={0.3} />

            <GridBackground cameraY={-frame * 2.2} />
            <CameraStage scale={interpolate(frame, [0, duration], [0.96, 1.05])}>
                <div style={{ position: "absolute", top: 195, left: 70, right: 70 }}>
                    <KineticText
                        text="100-Day Solo Dev Challenge"
                        fontSize={64}
                        highlightWords={["100-Day", "Challenge"]}
                        highlightColor={BRAND.amber}
                    />
                </div>

                {/* Circular Animated Progress Gauge */}
                <div
                    style={{
                        position: "absolute",
                        top: 420,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        transform: `scale(${badgePop})`,
                    }}
                >
                    <svg
                        width="660"
                        height="660"
                        style={{
                            filter: "drop-shadow(0 25px 50px rgba(15, 23, 42, 0.10))",
                        }}
                    >
                        <circle
                            cx="330"
                            cy="330"
                            r={radius}
                            fill={BRAND.bgCard}
                            stroke="#E2E8F0"
                            strokeWidth="28"
                        />
                        <circle
                            cx="330"
                            cy="330"
                            r={radius}
                            fill="none"
                            stroke={BRAND.amberBright}
                            strokeWidth="28"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 330 330)"
                        />
                    </svg>

                    <div
                        style={{
                            position: "absolute",
                            textAlign: "center",
                            fontFamily: "Inter, sans-serif",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 32,
                                fontWeight: 800,
                                color: BRAND.indigo,
                                letterSpacing: 3,
                                backgroundColor: BRAND.pastelBlue,
                                padding: "8px 24px",
                                borderRadius: 999,
                                display: "inline-block",
                                marginBottom: 10,
                            }}
                        >
                            ORGANIC GROWTH
                        </div>
                        <div
                            style={{
                                fontSize: 122,
                                fontWeight: 900,
                                color: BRAND.navyText,
                                lineHeight: 1.05,
                            }}
                        >
                            DAY <span style={{ color: BRAND.amber }}>{day}</span>
                        </div>
                        <div
                            style={{
                                fontSize: 42,
                                fontWeight: 800,
                                color: BRAND.slateMuted,
                            }}
                        >
                            OF 100
                        </div>
                    </div>
                </div>

                {/* $0 Ad Spend Pastel Pill Card */}
                <div
                    style={{
                        position: "absolute",
                        top: 1170,
                        left: 90,
                        right: 90,
                        backgroundColor: BRAND.bgCard,
                        border: `4px solid ${BRAND.borderWhite}`,
                        borderRadius: 40,
                        padding: "42px 44px",
                        textAlign: "center",
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
                            fontSize: 42,
                            fontWeight: 900,
                            marginBottom: 16,
                        }}
                    >
                        💸 ₹0 Marketing Budget
                    </div>
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 35,
                            fontWeight: 700,
                            color: BRAND.navyText,
                            lineHeight: 1.4,
                        }}
                    >
                        Growing{" "}
                        <span style={{ color: BRAND.amber, fontWeight: 900 }}>NotesBee</span>{" "}
                        from scratch with 100% organic reach & zero paid ads!
                    </div>
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// SCENE 4: WHATSAPP CHAT UI + SMART CHAT ANALYTICS
// ============================================================================
const WhatsAppSolutionScene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const panFrame = Math.floor(duration * 0.45);
    const panRight = spring({
        frame: frame - panFrame,
        fps,
        config: { damping: 14, stiffness: 100 },
    });

    const camX = interpolate(panRight, [0, 1], [0, -1080]);

    const chatMessages = [
        { sender: "Ananya", text: "Are you awake? Did you save our old chat?", me: false },
        { sender: "You", text: "Yes! Imported the .txt right into NotesBee 🐝✨", me: true },
        { sender: "Ananya", text: "Wait... it looks like a real chat app now?! 😍", me: false },
        { sender: "You", text: "Swipe right to see our Smart Chat Analytics! 📊👉", me: true },
    ];

    const statsBars = [
        { label: "Messages Sent (You: 64%)", value: 0.88, color: BRAND.whatsapp, bg: BRAND.pastelMint },
        { label: "Total Words Written (48,920)", value: 0.76, color: BRAND.amberBright, bg: BRAND.pastelAmber },
        { label: "Media & Voice Notes (1,420)", value: 0.68, color: BRAND.indigo, bg: BRAND.pastelBlue },
        { label: "Late Night Chats (11 PM+)", value: 0.92, color: BRAND.purple, bg: BRAND.pastelPurple },
    ];

    return (
        <AbsoluteFill>
            {/* Scene 4 SFX Cues: Chat Bubble Pops + Camera Whoosh + Bar Pops */}
            <SfxCue file="pop.wav" from={8} volume={0.32} />
            <SfxCue file="pop.wav" from={19} volume={0.32} />
            <SfxCue file="pop.wav" from={30} volume={0.32} />
            <SfxCue file="pop.wav" from={41} volume={0.32} />
            <SfxCue file="whoosh.wav" from={panFrame - 2} volume={0.38} />
            <SfxCue file="pop.wav" from={panFrame + 10} volume={0.28} />
            <SfxCue file="pop.wav" from={panFrame + 18} volume={0.28} />
            <SfxCue file="pop.wav" from={panFrame + 26} volume={0.28} />

            <GridBackground cameraX={camX} />
            <CameraStage x={camX}>
                <svg
                    width="2400"
                    height="1920"
                    style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
                >
                    <AnimatedSvgPath
                        d="M 890 980 C 1020 900, 1100 1060, 1210 980"
                        stroke={BRAND.amberBright}
                        strokeWidth={9}
                        startFrame={Math.floor(duration * 0.36)}
                        durationInFrames={20}
                        dashed
                    />
                </svg>

                {/* LEFT CANVAS: CLEAN WHATSAPP CHAT UI */}
                <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 1920 }}>
                    <div style={{ position: "absolute", top: 185, left: 65, right: 65 }}>
                        <KineticText
                            text="Clean Chat Experience"
                            fontSize={64}
                            highlightWords={["Clean", "Chat"]}
                            highlightColor={BRAND.amber}
                        />
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 390,
                            left: 80,
                            width: 920,
                            backgroundColor: BRAND.bgCard,
                            border: `4px solid ${BRAND.borderWhite}`,
                            borderRadius: 44,
                            padding: 46,
                            boxShadow: BRAND.cardShadow,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                paddingBottom: 26,
                                marginBottom: 30,
                                borderBottom: `2px solid ${BRAND.borderSubtle}`,
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                                <div
                                    style={{
                                        width: 72,
                                        height: 72,
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
                                            fontWeight: 700,
                                        }}
                                    >
                                        ✓ Converted from _chat.txt
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
                                frame: frame - (8 + i * 11),
                                fps,
                                config: { damping: 12, stiffness: 140 },
                            });
                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        justifyContent: msg.me ? "flex-end" : "flex-start",
                                        marginBottom: 24,
                                        transform: `scale(${bubblePop})`,
                                        transformOrigin: msg.me ? "right center" : "left center",
                                        opacity: bubblePop,
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: "80%",
                                            backgroundColor: msg.me ? "#DBEAFE" : "#F1F5F9",
                                            padding: "24px 30px",
                                            borderRadius: 30,
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: 31,
                                            fontWeight: 700,
                                            color: BRAND.navyText,
                                            lineHeight: 1.38,
                                        }}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT CANVAS: SMART CHAT ANALYSIS */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 1080,
                        width: 1080,
                        height: 1920,
                    }}
                >
                    <div style={{ position: "absolute", top: 185, left: 65, right: 65 }}>
                        <KineticText
                            text="Smart Chat Analysis"
                            startFrame={panFrame}
                            fontSize={64}
                            highlightWords={["Smart", "Analysis"]}
                            highlightColor={BRAND.amber}
                        />
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 390,
                            left: 80,
                            width: 920,
                            backgroundColor: BRAND.bgCard,
                            border: `4px solid ${BRAND.borderWhite}`,
                            borderRadius: 44,
                            padding: 46,
                            boxShadow: BRAND.cardShadow,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 18,
                                marginBottom: 34,
                            }}
                        >
                            <div
                                style={{
                                    width: 72,
                                    height: 72,
                                    borderRadius: 22,
                                    backgroundColor: "#FEF3C7",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 38,
                                }}
                            >
                                📊
                            </div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 40,
                                    fontWeight: 900,
                                    color: BRAND.navyText,
                                }}
                            >
                                Conversation Insights
                            </div>
                        </div>

                        {statsBars.map((bar, idx) => {
                            const barGrow = spring({
                                frame: frame - Math.floor(duration * 0.48) - idx * 8,
                                fps,
                                config: { damping: 13, stiffness: 110 },
                            });
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        marginBottom: 28,
                                        backgroundColor: bar.bg,
                                        padding: "22px 26px",
                                        borderRadius: 26,
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: 29,
                                            fontWeight: 800,
                                            color: BRAND.navyText,
                                            marginBottom: 12,
                                        }}
                                    >
                                        <span>{bar.label}</span>
                                        <span style={{ color: bar.color }}>
                      {Math.round(bar.value * 100 * barGrow)}%
                    </span>
                                    </div>
                                    <div
                                        style={{
                                            width: "100%",
                                            height: 24,
                                            backgroundColor: "#FFFFFF",
                                            borderRadius: 12,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${bar.value * 100 * barGrow}%`,
                                                height: "100%",
                                                backgroundColor: bar.color,
                                                borderRadius: 12,
                                            }}
                                        />
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
// SCENE 5 (INDEPENDENT): FAKE TITLE & FAKE DESCRIPTION DECOY PRIVACY
// ============================================================================
const DecoyPrivacyScene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const pinStartFrame = Math.floor(duration * 0.22);
    const pinEndFrame = Math.floor(duration * 0.44);
    const flipFrame = Math.floor(duration * 0.46);

    const typedDots = Math.min(
        6,
        Math.max(
            0,
            Math.floor(
                interpolate(frame, [pinStartFrame, pinEndFrame], [0, 6], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                })
            )
        )
    );

    const flipProgress = spring({
        frame: frame - flipFrame,
        fps,
        config: { damping: 12, stiffness: 120 },
    });

    const isUnlocked = flipProgress > 0.5;
    const flipScaleX = Math.abs(interpolate(flipProgress, [0, 0.5, 1], [1, 0, 1]));

    return (
        <AbsoluteFill>
            {/* Scene 5 SFX Cues: PIN Key Ticks + 3D Card Flip Whoosh + Unlock Chime */}
            <SfxCue file="pop.wav" from={3} volume={0.32} />
            {[0, 1, 2, 3, 4, 5].map((idx) => (
                <SfxCue
                    key={idx}
                    file="key_tick.wav"
                    from={
                        pinStartFrame +
                        Math.floor(((pinEndFrame - pinStartFrame) / 6) * idx)
                    }
                    volume={0.34}
                />
            ))}
            <SfxCue file="whoosh.wav" from={flipFrame} volume={0.38} />
            <SfxCue file="success_chime.wav" from={flipFrame + 8} volume={0.35} />

            <GridBackground cameraY={frame * 1.5} />
            <CameraStage scale={interpolate(frame, [0, duration], [0.98, 1.05])}>
                <div style={{ position: "absolute", top: 180, left: 60, right: 60 }}>
                    <KineticText
                        text="Fake Title & Decoy Privacy"
                        fontSize={64}
                        highlightWords={["Fake", "Decoy", "Privacy"]}
                        highlightColor={BRAND.purple}
                    />
                    <div
                        style={{
                            textAlign: "center",
                            fontFamily: "Inter, sans-serif",
                            fontSize: 33,
                            fontWeight: 700,
                            color: BRAND.slateMuted,
                            marginTop: 12,
                        }}
                    >
                        Hide your real notes behind a harmless cover!
                    </div>
                </div>

                {/* Password Input Pill with Self-Typing Dots */}
                <div
                    style={{
                        position: "absolute",
                        top: 410,
                        left: 190,
                        width: 700,
                        backgroundColor: BRAND.bgCard,
                        border: `4px solid ${isUnlocked ? BRAND.whatsapp : BRAND.purple}`,
                        borderRadius: 999,
                        padding: "20px 36px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: BRAND.cardShadow,
                    }}
                >
          <span
              style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  color: BRAND.slateMuted,
              }}
          >
            {isUnlocked ? "🔓 Decoy Unlocked!" : "🔐 Enter Secret PIN:"}
          </span>
                    <div style={{ display: "flex", gap: 12 }}>
                        {[0, 1, 2, 3, 4, 5].map((dotIdx) => (
                            <div
                                key={dotIdx}
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: "50%",
                                    backgroundColor:
                                        dotIdx < typedDots
                                            ? isUnlocked
                                                ? BRAND.whatsapp
                                                : BRAND.purple
                                            : "#E2E8F0",
                                    transform: dotIdx < typedDots ? "scale(1.15)" : "scale(1)",
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Giant 3D Flipping Decoy Card */}
                <div
                    style={{
                        position: "absolute",
                        top: 560,
                        left: 85,
                        width: 910,
                        backgroundColor: isUnlocked ? "#FCE7F3" : BRAND.bgCard,
                        border: `5px solid ${isUnlocked ? "#F472B6" : BRAND.borderWhite}`,
                        borderRadius: 44,
                        padding: 50,
                        transform: `scaleX(${flipScaleX})`,
                        boxShadow: BRAND.cardShadow,
                    }}
                >
                    {!isUnlocked ? (
                        <>
                            <div
                                style={{
                                    display: "inline-block",
                                    backgroundColor: BRAND.pastelAmber,
                                    color: BRAND.amber,
                                    padding: "12px 26px",
                                    borderRadius: 999,
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 26,
                                    fontWeight: 900,
                                    marginBottom: 24,
                                }}
                            >
                                👀 FAKE TITLE & DESCRIPTION (SNOOPER VIEW)
                            </div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 54,
                                    fontWeight: 900,
                                    color: BRAND.navyText,
                                    marginBottom: 20,
                                }}
                            >
                                🛒 Sunday Grocery List
                            </div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 34,
                                    fontWeight: 600,
                                    color: BRAND.slateMuted,
                                    lineHeight: 1.5,
                                    backgroundColor: "#F8FAFC",
                                    padding: 30,
                                    borderRadius: 28,
                                }}
                            >
                                • 2 Liters Milk & Brown Bread
                                <br />
                                • Fresh Tomatoes & Green Chilli
                                <br />• Dish Soap & Kitchen Towels
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                style={{
                                    display: "inline-block",
                                    backgroundColor: "#FBCFE8",
                                    color: "#9D174D",
                                    padding: "12px 26px",
                                    borderRadius: 999,
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 26,
                                    fontWeight: 900,
                                    marginBottom: 24,
                                }}
                            >
                                🔒 REAL PRIVATE NOTE (PASSWORD PROTECTED)
                            </div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 54,
                                    fontWeight: 900,
                                    color: "#831843",
                                    marginBottom: 20,
                                }}
                            >
                                💎 Private Thoughts & Goals
                            </div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 34,
                                    fontWeight: 700,
                                    color: "#9D174D",
                                    lineHeight: 1.5,
                                    backgroundColor: "rgba(255, 255, 255, 0.75)",
                                    padding: 30,
                                    borderRadius: 28,
                                }}
                            >
                                • My Secret App Launch Roadmap 🚀
                                <br />
                                • Personal Banking & Recovery Keys
                                <br />• Things I never want anyone peeking at!
                            </div>
                        </>
                    )}
                </div>

                {/* Bottom Feature Badges */}
                <div
                    style={{
                        position: "absolute",
                        top: 1220,
                        left: 85,
                        width: 910,
                        display: "flex",
                        gap: 24,
                    }}
                >
                    {[
                        { icon: "🎭", text: "Custom Fake Title" },
                        { icon: "📝", text: "Custom Fake Description" },
                        { icon: "🛡️", text: "Encrypted on Device" },
                    ].map((pill, idx) => (
                        <div
                            key={idx}
                            style={{
                                flex: 1,
                                backgroundColor: BRAND.pastelPurple,
                                border: `3px solid ${BRAND.borderWhite}`,
                                borderRadius: 28,
                                padding: "24px 18px",
                                textAlign: "center",
                                boxShadow: BRAND.cardShadow,
                            }}
                        >
                            <div style={{ fontSize: 44, marginBottom: 8 }}>{pill.icon}</div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 25,
                                    fontWeight: 900,
                                    color: BRAND.navyText,
                                }}
                            >
                                {pill.text}
                            </div>
                        </div>
                    ))}
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// SCENE 6 (INDEPENDENT): AI-POWERED NOTE ENHANCER (Laser Scan Transformation)
// ============================================================================
const AiEnhancerScene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scanStartFrame = Math.floor(duration * 0.18);
    const scanEndFrame = Math.floor(duration * 0.58);

    const scanProgress = interpolate(
        frame,
        [scanStartFrame, scanEndFrame],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    const isEnhanced = scanProgress > 0.5;
    const beamY = interpolate(scanProgress, [0, 1], [0, 560]);

    return (
        <AbsoluteFill>
            {/* Scene 6 SFX Cues: Magic AI Shimmer Scan + Pop Cues */}
            <SfxCue file="pop.wav" from={2} volume={0.3} />
            <SfxCue file="magic_scan.wav" from={scanStartFrame} volume={0.38} />
            <SfxCue
                file="success_chime.wav"
                from={Math.floor((scanStartFrame + scanEndFrame) / 2)}
                volume={0.32}
            />

            <GridBackground cameraX={-frame * 1.6} />
            <CameraStage scale={interpolate(frame, [0, duration], [0.97, 1.05])}>
                <div style={{ position: "absolute", top: 180, left: 60, right: 60 }}>
                    <KineticText
                        text="AI-Powered Note Enhancer"
                        fontSize={64}
                        highlightWords={["AI-Powered", "Enhancer"]}
                        highlightColor={BRAND.amber}
                    />
                    <div
                        style={{
                            textAlign: "center",
                            fontFamily: "Inter, sans-serif",
                            fontSize: 33,
                            fontWeight: 700,
                            color: BRAND.slateMuted,
                            marginTop: 12,
                        }}
                    >
                        Fix grammar, spelling, wording & emojis in one tap!
                    </div>
                </div>

                {/* Main Note Card Being Scanned by AI */}
                <div
                    style={{
                        position: "absolute",
                        top: 410,
                        left: 85,
                        width: 910,
                        height: 580,
                        backgroundColor: BRAND.bgCard,
                        border: `4px solid ${isEnhanced ? BRAND.amberBright : BRAND.borderWhite}`,
                        borderRadius: 44,
                        padding: 48,
                        overflow: "hidden",
                        boxShadow: BRAND.cardShadow,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 28,
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
                                ? "✨ ENHANCED WITH NOTESBEE AI"
                                : "❌ ROUGH DRAFT (GRAMMAR ERRORS)"}
                        </div>
                        <div style={{ fontSize: 48 }}>{isEnhanced ? "🤖✨" : "📝"}</div>
                    </div>

                    {!isEnhanced ? (
                        <div>
                            <div
                                style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: 44,
                                    fontWeight: 800,
                                    color: BRAND.slateMuted,
                                    marginBottom: 20,
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
                                    lineHeight: 1.55,
                                }}
                            >
                                discus app roadmp and send files fastly. dont forget ask abut
                                budgetting and timline issues...
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
                                    marginBottom: 20,
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
                                    lineHeight: 1.55,
                                    backgroundColor: BRAND.pastelAmber,
                                    padding: 28,
                                    borderRadius: 28,
                                }}
                            >
                                ✅ Present the Q4 App Roadmap & deliverables
                                <br />
                                💡 Finalize project budget & milestone timeline
                            </div>
                        </div>
                    )}

                    {/* Glowing Golden AI Laser Scan Bar */}
                    {scanProgress > 0.02 && scanProgress < 0.98 && (
                        <div
                            style={{
                                position: "absolute",
                                top: beamY,
                                left: 0,
                                right: 0,
                                height: 14,
                                background:
                                    "linear-gradient(90deg, transparent, #F59E0B, #FEF08A, #F59E0B, transparent)",
                                boxShadow: "0 0 40px 12px rgba(245, 158, 11, 0.65)",
                            }}
                        />
                    )}
                </div>

                {/* AI Capability Badges Popping In */}
                <div
                    style={{
                        position: "absolute",
                        top: 1050,
                        left: 85,
                        width: 910,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 24,
                    }}
                >
                    {[
                        { icon: "✅", title: "Grammar & Spelling", bg: BRAND.pastelMint },
                        { icon: "🎯", title: "Smart Wording & Tone", bg: BRAND.pastelBlue },
                        { icon: "😀", title: "Auto Emoji & Formatting", bg: BRAND.pastelAmber },
                        { icon: "🌐", title: "Localized Languages", bg: BRAND.pastelPurple },
                    ].map((item, i) => {
                        const pop = spring({
                            frame: frame - 15 - i * 8,
                            fps,
                            config: { damping: 12 },
                        });
                        return (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: item.bg,
                                    border: `4px solid ${BRAND.borderWhite}`,
                                    borderRadius: 30,
                                    padding: "26px 28px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 18,
                                    transform: `scale(${pop})`,
                                    boxShadow: BRAND.cardShadow,
                                }}
                            >
                                <span style={{ fontSize: 42 }}>{item.icon}</span>
                                <span
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: 28,
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
// SCENE 7 (INDEPENDENT): 1000+ BEAUTIFUL BACKGROUNDS + COLLAB & SYNC
// ============================================================================
const Backgrounds1000Scene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const themes = [
        {
            name: "🌅 Cozy Autumn Road",
            gradient: "linear-gradient(135deg, #78350F 0%, #D97706 55%, #FDE68A 100%)",
            textColor: "#FFFFFF",
            tag: "Nostalgic Mood",
        },
        {
            name: "🌊 Calm Ocean Breeze",
            gradient: "linear-gradient(135deg, #0F172A 0%, #0284C7 55%, #7DD3FC 100%)",
            textColor: "#FFFFFF",
            tag: "Focused Mood",
        },
        {
            name: "🌸 Sakura Blossom",
            gradient: "linear-gradient(135deg, #831843 0%, #DB2777 55%, #FBCFE8 100%)",
            textColor: "#FFFFFF",
            tag: "Creative Mood",
        },
        {
            name: "🌲 Emerald Forest",
            gradient: "linear-gradient(135deg, #064E3B 0%, #10B981 55%, #A7F3D0 100%)",
            textColor: "#FFFFFF",
            tag: "Calm Mood",
        },
        {
            name: "✨ Royal Midnight Gold",
            gradient: "linear-gradient(135deg, #1E1B4B 0%, #6D28D9 55%, #F59E0B 100%)",
            textColor: "#FFFFFF",
            tag: "Night Mood",
        },
    ];

    const themeIndex =
        Math.floor(
            interpolate(frame, [0, duration - 15], [0, themes.length - 0.01], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            })
        ) % themes.length;

    const activeTheme = themes[themeIndex];

    const countVal = Math.round(
        interpolate(frame, [5, Math.floor(duration * 0.55)], [100, 1000], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        })
    );

    const stepFrames = Math.floor((duration - 15) / themes.length);

    return (
        <AbsoluteFill>
            {/* Scene 7 SFX Cues: Pop on every theme change + Chime at 1000+ */}
            {[0, 1, 2, 3, 4].map((idx) => (
                <SfxCue
                    key={idx}
                    file="pop.wav"
                    from={idx * stepFrames + 2}
                    volume={0.3}
                />
            ))}
            <SfxCue
                file="success_chime.wav"
                from={Math.floor(duration * 0.52)}
                volume={0.34}
            />

            <GridBackground cameraY={-frame * 1.5} />
            <CameraStage scale={interpolate(frame, [0, duration], [0.97, 1.04])}>
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
                            fontSize: 104,
                            fontWeight: 900,
                            color: BRAND.amber,
                            lineHeight: 1,
                            marginBottom: 8,
                        }}
                    >
                        {countVal}+
                    </div>
                    <KineticText
                        text="Custom Note Backgrounds"
                        fontSize={58}
                        highlightWords={["Backgrounds"]}
                        highlightColor={BRAND.indigo}
                    />
                </div>

                {/* Live Morphing Note Card Showcasing the Backgrounds */}
                <div
                    style={{
                        position: "absolute",
                        top: 450,
                        left: 85,
                        width: 910,
                        height: 550,
                        background: activeTheme.gradient,
                        border: "6px solid #FFFFFF",
                        borderRadius: 46,
                        padding: 48,
                        boxShadow: "0 30px 70px rgba(15, 23, 42, 0.22)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
            <span
                style={{
                    backgroundColor: "rgba(255,255,255,0.24)",
                    backdropFilter: "blur(10px)",
                    color: "#FFFFFF",
                    padding: "10px 26px",
                    borderRadius: 999,
                    fontFamily: "Inter, sans-serif",
                    fontSize: 26,
                    fontWeight: 800,
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
              🤖 AI Matched: {activeTheme.tag}
            </span>
                    </div>

                    <div>
                        <div
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: 54,
                                fontWeight: 900,
                                color: activeTheme.textColor,
                                marginBottom: 18,
                                textShadow: "0 4px 16px rgba(0,0,0,0.3)",
                            }}
                        >
                            Places I Want To Visit ✈️
                        </div>
                        <div
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: 32,
                                fontWeight: 700,
                                color: "rgba(255,255,255,0.92)",
                                lineHeight: 1.5,
                            }}
                        >
                            • Kyoto during autumn foliage 🍁
                            <br />
                            • Road trip across Ladakh mountains 🏔️
                            <br />• Every note gets its own personality!
                        </div>
                    </div>

                    {/* Theme Swatch Dots at Bottom of Card */}
                    <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                        {themes.map((_, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: idx === themeIndex ? 56 : 20,
                                    height: 20,
                                    borderRadius: 999,
                                    backgroundColor:
                                        idx === themeIndex ? "#FFFFFF" : "rgba(255,255,255,0.45)",
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Real-Time Collaboration & Multi-Device Sync Pills */}
                <div
                    style={{
                        position: "absolute",
                        top: 1060,
                        left: 85,
                        width: 910,
                        display: "flex",
                        gap: 28,
                    }}
                >
                    {[
                        {
                            icon: "👥",
                            title: "Real-Time Collaboration",
                            sub: "Share notes with Read/Write control",
                            bg: BRAND.pastelPink,
                        },
                        {
                            icon: "☁️",
                            title: "Instant Cloud Sync",
                            sub: "Access notes across all devices",
                            bg: BRAND.pastelBlue,
                        },
                    ].map((card, i) => {
                        const pop = spring({
                            frame: frame - 12 - i * 10,
                            fps,
                            config: { damping: 12 },
                        });
                        return (
                            <div
                                key={i}
                                style={{
                                    flex: 1,
                                    backgroundColor: card.bg,
                                    border: `4px solid ${BRAND.borderWhite}`,
                                    borderRadius: 36,
                                    padding: "32px 28px",
                                    textAlign: "center",
                                    transform: `scale(${pop})`,
                                    boxShadow: BRAND.cardShadow,
                                }}
                            >
                                <div style={{ fontSize: 50, marginBottom: 12 }}>{card.icon}</div>
                                <div
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: 31,
                                        fontWeight: 900,
                                        color: BRAND.navyText,
                                        marginBottom: 6,
                                    }}
                                >
                                    {card.title}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "Inter, sans-serif",
                                        fontSize: 24,
                                        fontWeight: 600,
                                        color: BRAND.slateMuted,
                                    }}
                                >
                                    {card.sub}
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
// SCENE 8: CALL TO ACTION (Uses public/icon.png + public/playstore.png + LINK IN BIO)
// ============================================================================
const CtaScene: React.FC<{ day: number; duration: number }> = ({ day }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const [iconError, setIconError] = useState(false);
    const [playStoreError, setPlayStoreError] = useState(false);

    const heroPop = spring({ frame, fps, config: { damping: 12, stiffness: 130 } });
    const pulse = 1 + Math.sin(frame * 0.25) * 0.038;

    return (
        <AbsoluteFill>
            {/* Scene 8 SFX Cues */}
            <SfxCue file="whoosh.wav" from={0} volume={0.34} />
            <SfxCue file="success_chime.wav" from={6} volume={0.38} />
            <SfxCue file="pop.wav" from={18} volume={0.32} />

            <GridBackground cameraY={-frame * 1.5} />
            <CameraStage scale={heroPop}>
                <div
                    style={{
                        position: "absolute",
                        top: 175,
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
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 34,
                            fontWeight: 700,
                            color: BRAND.slateMuted,
                            marginTop: 12,
                        }}
                    >
                        Save your thoughts and chats securely.
                    </div>
                </div>

                {/* App Icon + Play Store Badge Card */}
                <div
                    style={{
                        position: "absolute",
                        top: 410,
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
                                marginBottom: 24,
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
                                boxShadow: "0 18px 40px rgba(245, 158, 11, 0.28)",
                                marginBottom: 24,
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
                            marginTop: 30,
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

                {/* Pulsing LINK IN BIO Banner */}
                <div
                    style={{
                        position: "absolute",
                        top: 1140,
                        left: 105,
                        right: 105,
                        backgroundColor: BRAND.pastelAmber,
                        border: `4px solid ${BRAND.amberBright}`,
                        borderRadius: 40,
                        padding: "36px 38px",
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
                            marginBottom: 16,
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
                        Follow Day {day} / 100 & Download NotesBee Today!
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
            case "problem":
                return <ProblemScene duration={durationInFrames} />;
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

                    {/* Scene Voiceover Audio */}
                    {scene.audioFile ? (
                        <Audio src={staticFile(scene.audioFile)} />
                    ) : null}
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};