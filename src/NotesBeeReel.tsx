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
    CameraStage,
    GridBackground,
    KineticText,
} from "./components/MotionPrimitives";
import { BRAND, getDefaultTimeline, NotesBeeProps } from "./types";

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
// SCENE 1: RELATIONSHIP SEEN HOOK
// ============================================================================
const HookScene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const shockPop = spring({
        frame,
        fps,
        config: { damping: 9, stiffness: 220 },
    });

    return (
        <AbsoluteFill>
            <SfxCue file="error_slash.wav" from={1} volume={0.42} />
            <SfxCue file="pop.wav" from={15} volume={0.35} />

            <GridBackground cameraY={-frame * 1.5} />
            <CameraStage>
                <div
                    style={{
                        position: "absolute",
                        top: 250,
                        left: 80,
                        width: 920,
                        backgroundColor: BRAND.pastelDanger,
                        border: `5px solid ${BRAND.danger}`,
                        borderRadius: 44,
                        padding: "46px 40px",
                        textAlign: "center",
                        transform: `scale(${shockPop})`,
                        boxShadow: "0 30px 70px rgba(239, 68, 68, 0.22)",
                    }}
                >
                    <div style={{ fontSize: 68, marginBottom: 12 }}>💔👀</div>
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 48,
                            fontWeight: 900,
                            color: BRAND.danger,
                            lineHeight: 1.25,
                            marginBottom: 16,
                        }}
                    >
                        LEFT ON SEEN AGAIN?
                    </div>
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 30,
                            fontWeight: 800,
                            color: BRAND.navyText,
                        }}
                    >
                        Are they actually busy... or ignoring you?
                    </div>
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 980,
                        left: 80,
                        width: 920,
                        backgroundColor: BRAND.bgCard,
                        border: `4px solid ${BRAND.borderWhite}`,
                        borderRadius: 44,
                        padding: 42,
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
                        <div style={{ fontSize: 42 }}>🔍</div>
                        <div
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: 36,
                                fontWeight: 900,
                                color: BRAND.navyText,
                            }}
                        >
                            Who Is Putting In Real Effort?
                        </div>
                    </div>
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 28,
                            fontWeight: 700,
                            color: BRAND.slateMuted,
                            lineHeight: 1.4,
                        }}
                    >
                        Find out the exact truth behind your chats with smart analytics!
                    </div>
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// SCENE 2: THE CHALLENGE
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

    const countUpEndFrame = Math.max(10, Math.floor(duration * 0.5));
    const animatedDay = Math.round(
        interpolate(frame, [2, countUpEndFrame], [1, day], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        })
    );

    return (
        <AbsoluteFill>
            <SfxCue file="whoosh.wav" from={0} volume={0.35} />
            <SfxCue file="success_chime.wav" from={countUpEndFrame} volume={0.4} />

            <GridBackground cameraY={-frame * 3.0} />
            <CameraStage scale={interpolate(frame, [0, duration], [0.97, 1.05])}>
                <div style={{ position: "absolute", top: 220, left: 60, right: 60 }}>
                    <KineticText
                        text="Zero Ad-Budget Challenge"
                        fontSize={64}
                        highlightWords={["Zero", "Ad-Budget"]}
                        highlightColor={BRAND.amber}
                    />
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 440,
                        left: 90,
                        width: 900,
                        backgroundColor: BRAND.bgCard,
                        border: `5px solid ${BRAND.borderWhite}`,
                        borderRadius: 48,
                        padding: "60px 48px",
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
                            marginBottom: 26,
                        }}
                    >
                        💸 ₹0 AD SPEND
                    </div>

                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 160,
                            fontWeight: 900,
                            color: BRAND.navyText,
                            lineHeight: 1,
                            marginBottom: 16,
                        }}
                    >
                        DAY <span style={{ color: BRAND.amber }}>{animatedDay}</span>
                    </div>
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 42,
                            fontWeight: 900,
                            color: BRAND.slateMuted,
                            letterSpacing: 3,
                        }}
                    >
                        OUT OF 100
                    </div>
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// SCENE 3: REALISTIC WHATSAPP CHAT EXPORT & DETAILED METRICS ANALYTICS
// ============================================================================
const AnalyticsScene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const panFrame = Math.floor(duration * 0.46);
    const panRight = spring({
        frame: frame - panFrame,
        fps,
        config: { damping: 13, stiffness: 150 },
    });

    const camX = interpolate(panRight, [0, 1], [0, -1080]);

    const chatLines = [
        { name: "Ananya", time: "10:14 PM", text: "Hey! are you free tonight?", me: false },
        { name: "You", time: "10:15 PM", text: "Yes! Where should we go? 😃", me: true },
        { name: "Ananya", time: "11:42 PM", text: "umm actually busy now...", me: false },
        { name: "You", time: "11:43 PM", text: "Again left on seen for an hour? 🙄", me: true },
    ];

    const analyticsMetrics = [
        { icon: "💬", title: "Total Messages", val: "1,482", sub: "You: 68% • Them: 32%", bg: BRAND.pastelMint, color: BRAND.whatsapp },
        { icon: "📝", title: "Most Words", val: "14.2K", sub: "You wrote 3x more words", bg: BRAND.pastelBlue, color: BRAND.indigo },
        { icon: "⏱️", title: "Reply Gaps", val: "42 mins", sub: "Average delay in replies", bg: BRAND.pastelAmber, color: BRAND.amber },
        { icon: "🖼️", title: "Media & Photos", val: "310+", sub: "Photos, Audio & Stickers", bg: BRAND.pastelPink, color: BRAND.danger },
    ];

    return (
        <AbsoluteFill>
            <SfxCue file="pop.wav" from={2} volume={0.34} />
            <SfxCue file="whoosh.wav" from={panFrame - 2} volume={0.4} />
            <SfxCue file="success_chime.wav" from={panFrame + 5} volume={0.38} />

            <GridBackground cameraX={camX} />
            <CameraStage x={camX}>
                {/* LEFT: REALISTIC WHATSAPP CHAT EXPORT UI */}
                <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 1920 }}>
                    <div style={{ position: "absolute", top: 165, left: 65, right: 65 }}>
                        <KineticText
                            text="Exported WhatsApp Chat"
                            fontSize={64}
                            highlightWords={["WhatsApp", "Chat"]}
                            highlightColor={BRAND.whatsapp}
                        />
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 340,
                            left: 70,
                            width: 940,
                            backgroundColor: BRAND.bgCard,
                            border: `4px solid ${BRAND.borderWhite}`,
                            borderRadius: 44,
                            padding: 36,
                            boxShadow: BRAND.cardShadow,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 20,
                                borderBottom: `2px solid ${BRAND.borderSubtle}`,
                                paddingBottom: 14,
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div
                                    style={{
                                        width: 54,
                                        height: 54,
                                        borderRadius: "50%",
                                        backgroundColor: "#FCE7F3",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 28,
                                        fontWeight: 900,
                                        color: "#DB2777",
                                    }}
                                >
                                    A
                                </div>
                                <div>
                                    <div style={{ fontFamily: "Inter", fontSize: 32, fontWeight: 900, color: BRAND.navyText }}>
                                        Ananya (WhatsApp Export)
                                    </div>
                                    <div style={{ fontFamily: "Inter", fontSize: 22, color: BRAND.whatsapp, fontWeight: 800 }}>
                                        ✓ Loaded _chat.txt securely
                                    </div>
                                </div>
                            </div>
                            <span style={{ backgroundColor: BRAND.whatsappSoft, color: BRAND.whatsapp, padding: "8px 18px", borderRadius: 999, fontSize: 22, fontWeight: 900 }}>
                LIVE
              </span>
                        </div>

                        {chatLines.map((line, idx) => {
                            const bubblePop = spring({
                                frame: frame - (4 + idx * 8),
                                fps,
                                config: { damping: 11, stiffness: 180 },
                            });
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        justifyContent: line.me ? "flex-end" : "flex-start",
                                        marginBottom: 16,
                                        transform: `scale(${bubblePop})`,
                                        transformOrigin: line.me ? "right center" : "left center",
                                        opacity: bubblePop,
                                    }}
                                >
                                    <div
                                        style={{
                                            maxWidth: "85%",
                                            backgroundColor: line.me ? "#DBEAFE" : "#F1F5F9",
                                            padding: "20px 24px",
                                            borderRadius: 26,
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: 27,
                                            fontWeight: 700,
                                            color: BRAND.navyText,
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 4, fontSize: 20, color: BRAND.slateMuted, fontWeight: 800 }}>
                                            <span>{line.name}</span>
                                            <span>{line.time}</span>
                                        </div>
                                        {line.text}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT: SMART ANALYTICS METRICS DASHBOARD */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 1080,
                        width: 1080,
                        height: 1920,
                    }}
                >
                    <div style={{ position: "absolute", top: 165, left: 60, right: 60 }}>
                        <KineticText
                            text="Smart Chat Analytics 📊"
                            startFrame={panFrame}
                            fontSize={62}
                            highlightWords={["Smart", "Analytics"]}
                            highlightColor={BRAND.amber}
                        />
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: 340,
                            left: 70,
                            width: 940,
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 22,
                        }}
                    >
                        {analyticsMetrics.map((m, idx) => {
                            const cardPop = spring({
                                frame: frame - panFrame - idx * 4,
                                fps,
                                config: { damping: 12, stiffness: 160 },
                            });
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        backgroundColor: m.bg,
                                        border: `4px solid ${BRAND.borderWhite}`,
                                        borderRadius: 36,
                                        padding: "30px 24px",
                                        transform: `scale(${cardPop})`,
                                        opacity: cardPop,
                                        boxShadow: BRAND.cardShadow,
                                    }}
                                >
                                    <div style={{ fontSize: 42, marginBottom: 8 }}>{m.icon}</div>
                                    <div style={{ fontFamily: "Inter", fontSize: 24, fontWeight: 800, color: BRAND.slateMuted, marginBottom: 4 }}>
                                        {m.title}
                                    </div>
                                    <div style={{ fontFamily: "Inter", fontSize: 46, fontWeight: 900, color: m.color, marginBottom: 6 }}>
                                        {m.val}
                                    </div>
                                    <div style={{ fontFamily: "Inter", fontSize: 21, fontWeight: 800, color: BRAND.navyText }}>
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
// SCENE 4: 100% LOCAL PRIVACY (ZERO CLOUD)
// ============================================================================
const PrivacyScene: React.FC<{ duration: number }> = ({ duration }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const shieldPop = spring({
        frame,
        fps,
        config: { damping: 11, stiffness: 180 },
    });

    return (
        <AbsoluteFill>
            <SfxCue file="pop.wav" from={2} volume={0.34} />
            <SfxCue file="success_chime.wav" from={10} volume={0.4} />

            <GridBackground cameraY={frame * 2.0} />
            <CameraStage scale={interpolate(frame, [0, duration], [0.97, 1.05])}>
                <div style={{ position: "absolute", top: 185, left: 60, right: 60 }}>
                    <KineticText
                        text="100% On-Phone Privacy"
                        fontSize={64}
                        highlightWords={["100%", "Privacy"]}
                        highlightColor={BRAND.whatsapp}
                    />
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: 380,
                        left: 90,
                        width: 900,
                        backgroundColor: BRAND.pastelMint,
                        border: `5px solid ${BRAND.whatsapp}`,
                        borderRadius: 48,
                        padding: "54px 44px",
                        textAlign: "center",
                        transform: `scale(${shieldPop})`,
                        boxShadow: "0 25px 60px rgba(16, 185, 129, 0.18)",
                    }}
                >
                    <div style={{ fontSize: 80, marginBottom: 16 }}>🛡️🔒</div>
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 48,
                            fontWeight: 900,
                            color: "#064E3B",
                            marginBottom: 16,
                        }}
                    >
                        Zero Cloud Uploads
                    </div>
                    <div
                        style={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: 32,
                            fontWeight: 800,
                            color: "#047857",
                            lineHeight: 1.4,
                        }}
                    >
                        Your chats & notes stay 100% secure inside your phone storage only!
                    </div>
                </div>
            </CameraStage>
        </AbsoluteFill>
    );
};

// ============================================================================
// SCENE 5: CALL TO ACTION
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
                        Follow Day {day} / 100 Journey & Download Now!
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
            case "analytics":
                return <AnalyticsScene duration={durationInFrames} />;
            case "privacy":
                return <PrivacyScene duration={durationInFrames} />;
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
