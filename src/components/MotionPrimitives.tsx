import React from "react";
import {
    AbsoluteFill,
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from "remotion";
import { BRAND } from "../types";

export const GridBackground: React.FC<{ cameraX?: number; cameraY?: number }> = ({
                                                                                     cameraX = 0,
                                                                                     cameraY = 0,
                                                                                 }) => {
    const frame = useCurrentFrame();
    const shiftX = (frame * 0.4 + cameraX * 0.2) % 90;
    const shiftY = (frame * 0.4 + cameraY * 0.2) % 90;

    // Gentle floating animation for sparkles
    const sparkleFloat = Math.sin(frame * 0.06) * 12;

    return (
        <AbsoluteFill
            style={{
                background:
                    "linear-gradient(135deg, #EEF2FF 0%, #FFFDF9 48%, #FEF3C7 100%)",
                overflow: "hidden",
            }}
        >
            {/* Soft Pastel Mesh Gradient Blobs (Matching Play Store Screenshot) */}
            <div
                style={{
                    position: "absolute",
                    width: 900,
                    height: 900,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(199, 210, 254, 0.65) 0%, transparent 70%)",
                    top: -220 - cameraY * 0.12,
                    left: -220 - cameraX * 0.12,
                    filter: "blur(50px)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: 950,
                    height: 950,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(253, 230, 138, 0.55) 0%, transparent 70%)",
                    top: 350 - cameraY * 0.08,
                    right: -280 + cameraX * 0.12,
                    filter: "blur(60px)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    width: 850,
                    height: 850,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(245, 208, 254, 0.5) 0%, transparent 70%)",
                    bottom: -220 + cameraY * 0.12,
                    left: 80 - cameraX * 0.1,
                    filter: "blur(55px)",
                }}
            />

            {/* Subtle Light Vector Dot/Grid Pattern */}
            <svg width="100%" height="100%" style={{ opacity: 0.35 }}>
                <defs>
                    <pattern
                        id="light-grid"
                        width="90"
                        height="90"
                        patternUnits="userSpaceOnUse"
                        patternTransform={`translate(${shiftX}, ${shiftY})`}
                    >
                        <circle cx="45" cy="45" r="2.5" fill="#CBD5E1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#light-grid)" />
            </svg>

            {/* Play Store Style Decorative 4-Point Sparkles & Burst Lines */}
            <svg
                width="1080"
                height="1920"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                    transform: `translateY(${sparkleFloat}px)`,
                }}
            >
                {/* Golden 4-Point Star Left */}
                <path
                    d="M 110 340 Q 110 370 80 370 Q 110 370 110 400 Q 110 370 140 370 Q 110 370 110 340 Z"
                    fill="#FBBF24"
                    opacity="0.85"
                />
                {/* Lavender 4-Point Star Right */}
                <path
                    d="M 960 520 Q 960 545 935 545 Q 960 545 960 570 Q 960 545 985 545 Q 960 545 960 520 Z"
                    fill="#A78BFA"
                    opacity="0.75"
                />
                {/* Golden 4-Point Star Bottom Left */}
                <path
                    d="M 140 1480 Q 140 1502 118 1502 Q 140 1502 140 1524 Q 140 1502 162 1502 Q 140 1502 140 1480 Z"
                    fill="#F59E0B"
                    opacity="0.7"
                />
                {/* Decorative Accent Burst Ticks (Top Right & Bottom Left) */}
                <g stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" opacity="0.7">
                    <line x1="940" y1="240" x2="965" y2="215" />
                    <line x1="960" y1="260" x2="992" y2="245" />
                    <line x1="965" y1="285" x2="995" y2="282" />
                </g>
                <g stroke="#818CF8" strokeWidth="4" strokeLinecap="round" opacity="0.7">
                    <line x1="95" y1="920" x2="68" y2="900" />
                    <line x1="85" y1="945" x2="52" y2="942" />
                    <line x1="95" y1="970" x2="68" y2="985" />
                </g>
            </svg>
        </AbsoluteFill>
    );
};

export const CameraStage: React.FC<{
    x?: number;
    y?: number;
    scale?: number;
    rotate?: number;
    children: React.ReactNode;
}> = ({ x = 0, y = 0, scale = 1, rotate = 0, children }) => {
    return (
        <AbsoluteFill
            style={{
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`,
                transformOrigin: "center center",
            }}
        >
            {children}
        </AbsoluteFill>
    );
};

export const AnimatedSvgPath: React.FC<{
    d: string;
    stroke?: string;
    strokeWidth?: number;
    startFrame?: number;
    durationInFrames?: number;
    pathLength?: number;
    dashed?: boolean;
}> = ({
          d,
          stroke = BRAND.amber,
          strokeWidth = 6,
          startFrame = 0,
          durationInFrames = 35,
          pathLength = 1600,
          dashed = false,
      }) => {
    const frame = useCurrentFrame();
    const progress = interpolate(
        frame,
        [startFrame, startFrame + durationInFrames],
        [0, 1],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        }
    );

    const dashOffset = pathLength * (1 - progress);

    return (
        <path
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={dashed ? "14 14" : pathLength}
            strokeDashoffset={dashed ? -frame * 1.6 : dashOffset}
            style={{
                opacity: progress > 0.01 ? 1 : 0,
                filter: `drop-shadow(0 6px 12px ${stroke}33)`,
            }}
        />
    );
};

export const KineticText: React.FC<{
    text: string;
    startFrame?: number;
    fontSize?: number;
    color?: string;
    highlightWords?: string[];
    highlightColor?: string;
    align?: "center" | "left";
}> = ({
          text,
          startFrame = 0,
          fontSize = 60,
          color = BRAND.navyText,
          highlightWords = [],
          highlightColor = BRAND.amber,
          align = "center",
      }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const words = text.split(" ");

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: align === "center" ? "center" : "flex-start",
                gap: `${fontSize * 0.24}px`,
                fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: -0.8,
            }}
        >
            {words.map((word, i) => {
                const cleanWord = word.replace(/[^a-zA-Z0-9$%+]/g, "").toLowerCase();
                const isHighlighted = highlightWords.some(
                    (hw) => hw.toLowerCase() === cleanWord
                );

                const pop = spring({
                    frame: frame - (startFrame + i * 3),
                    fps,
                    config: { damping: 12, stiffness: 160 },
                });

                const translateY = interpolate(pop, [0, 1], [32, 0]);
                const scale = interpolate(pop, [0, 1], [0.78, 1]);

                return (
                    <span
                        key={`${word}-${i}`}
                        style={{
                            display: "inline-block",
                            fontSize,
                            color: isHighlighted ? highlightColor : color,
                            transform: `translateY(${translateY}px) scale(${scale})`,
                            opacity: pop,
                            textShadow: isHighlighted
                                ? `0 8px 20px ${highlightColor}33`
                                : "0 4px 12px rgba(15, 23, 42, 0.06)",
                        }}
                    >
            {word}
          </span>
                );
            })}
        </div>
    );
};

export const SubtitleBar: React.FC<{
    text: string;
    durationInFrames: number;
}> = ({ text, durationInFrames }) => {
    const frame = useCurrentFrame();
    const words = text.split(" ");
    const activeWordIndex = Math.floor(
        interpolate(
            frame,
            [0, Math.max(1, durationInFrames - 12)],
            [0, words.length - 1],
            {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
            }
        )
    );

    const chunkSize = 7;
    const chunkIndex = Math.floor(activeWordIndex / chunkSize);
    const visibleWords = words.slice(
        chunkIndex * chunkSize,
        chunkIndex * chunkSize + chunkSize
    );

    return (
        <div
            style={{
                position: "absolute",
                bottom: 115,
                left: 55,
                right: 55,
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
            }}
        >
            <div
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.94)",
                    border: "3px solid #FFFFFF",
                    borderRadius: 32,
                    padding: "20px 34px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: 12,
                    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
                }}
            >
                {visibleWords.map((w, idx) => {
                    const globalIdx = chunkIndex * chunkSize + idx;
                    const isCurrent = globalIdx === activeWordIndex;
                    return (
                        <span
                            key={globalIdx}
                            style={{
                                fontFamily: "Inter, system-ui, sans-serif",
                                fontSize: 34,
                                fontWeight: 800,
                                color: isCurrent ? BRAND.amber : BRAND.navyText,
                                backgroundColor: isCurrent ? BRAND.pastelAmber : "transparent",
                                padding: isCurrent ? "2px 10px" : "2px 0px",
                                borderRadius: 10,
                                transform: isCurrent ? "scale(1.08)" : "scale(1)",
                                transition: "transform 0.08s ease",
                            }}
                        >
              {w}
            </span>
                    );
                })}
            </div>
        </div>
    );
};