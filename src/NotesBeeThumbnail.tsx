import React, { useState } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { NotesBeeProps } from "./types";

export const NotesBeeThumbnail: React.FC<NotesBeeProps> = ({ day = 1 }) => {
    const [iconError, setIconError] = useState(false);
    const [playStoreError, setPlayStoreError] = useState(false);

    return (
        <AbsoluteFill
            style={{
                background:
                    "linear-gradient(145deg, #E8F0FE 0%, #F5F7FF 45%, #FFF8EE 78%, #FDEBD0 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Soft Cool Blue Glow (Top-Left) */}
            <div
                style={{
                    position: "absolute",
                    top: -150,
                    left: -150,
                    width: 900,
                    height: 900,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(219, 234, 254, 0.75) 0%, transparent 70%)",
                    filter: "blur(50px)",
                }}
            />

            {/* Warm Amber Glow Behind "DAY X" and Top-Right of Icon Card */}
            <div
                style={{
                    position: "absolute",
                    top: 520,
                    left: 480,
                    width: 420,
                    height: 420,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(245, 158, 11, 0.26) 0%, transparent 70%)",
                    filter: "blur(35px)",
                }}
            />

            {/* Warm Peach Glow (Bottom-Right) */}
            <div
                style={{
                    position: "absolute",
                    bottom: -180,
                    right: -180,
                    width: 950,
                    height: 950,
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(254, 215, 170, 0.65) 0%, transparent 70%)",
                    filter: "blur(60px)",
                }}
            />

            {/* Main Centered Stack (Fits both 9:16 Reel Cover & 1:1 Profile Grid Crop) */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    zIndex: 2,
                }}
            >
                {/* 1. DAY X Header */}
                <div
                    style={{
                        fontSize: 118,
                        fontWeight: 900,
                        letterSpacing: -2,
                        lineHeight: 1,
                        marginBottom: 46,
                        display: "flex",
                        alignItems: "center",
                        gap: 22,
                    }}
                >
                    <span style={{ color: "#111827" }}>DAY</span>
                    <span style={{ color: "#D97706" }}>{day}</span>
                </div>

                {/* 2. White Squircle App Icon Card */}
                <div
                    style={{
                        width: 340,
                        height: 340,
                        borderRadius: 76,
                        backgroundColor: "#FFFFFF",
                        boxShadow:
                            "0 28px 60px rgba(15, 23, 42, 0.08), 0 6px 18px rgba(15, 23, 42, 0.04)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 42,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Subtle Warm Corner Tint inside Icon Card (matching reference) */}
                    <div
                        style={{
                            position: "absolute",
                            top: -40,
                            right: -40,
                            width: 180,
                            height: 180,
                            borderRadius: "50%",
                            background:
                                "radial-gradient(circle, rgba(253, 230, 138, 0.45) 0%, transparent 70%)",
                        }}
                    />

                    {!iconError ? (
                        <Img
                            src={staticFile("icon.png")}
                            onError={() => setIconError(true)}
                            style={{
                                width: 240,
                                height: 240,
                                objectFit: "contain",
                                zIndex: 1,
                            }}
                        />
                    ) : (
                        <div style={{ fontSize: 150, zIndex: 1 }}>🐝</div>
                    )}
                </div>

                {/* 3. NotesBee Brand Title */}
                <div
                    style={{
                        fontSize: 78,
                        fontWeight: 800,
                        color: "#0F172A",
                        letterSpacing: -1.5,
                        marginBottom: 44,
                    }}
                >
                    NotesBee
                </div>

                {/* 4. GET IT ON Google Play Button */}
                <div
                    style={{
                        marginBottom: 42,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    {!playStoreError ? (
                        <Img
                            src={staticFile("playstore.png")}
                            onError={() => setPlayStoreError(true)}
                            style={{
                                width: 680,
                                height: 200,
                                objectFit: "contain",
                                filter: "drop-shadow(0 16px 32px rgba(15, 23, 42, 0.14))",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: 680,
                                height: 190,
                                backgroundColor: "#000000",
                                borderRadius: 28,
                                border: "3px solid #CBD5E1",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 28,
                                boxShadow: "0 18px 36px rgba(15, 23, 42, 0.16)",
                            }}
                        >
                            <div style={{ fontSize: 82 }}>▶️</div>
                            <div style={{ textAlign: "left", color: "#FFFFFF" }}>
                                <div
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 600,
                                        letterSpacing: 1.5,
                                        opacity: 0.9,
                                    }}
                                >
                                    GET IT ON
                                </div>
                                <div
                                    style={{
                                        fontSize: 68,
                                        fontWeight: 800,
                                        letterSpacing: -0.5,
                                        lineHeight: 1.05,
                                    }}
                                >
                                    Google Play
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. LINK IN BIO Dark Navy Pill */}
                <div
                    style={{
                        width: 580,
                        height: 108,
                        backgroundColor: "#0B132B",
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 18px 36px rgba(11, 19, 43, 0.22)",
                    }}
                >
          <span
              style={{
                  color: "#FFFFFF",
                  fontSize: 36,
                  fontWeight: 800,
                  letterSpacing: 5,
              }}
          >
            LINK IN BIO
          </span>
                </div>
            </div>
        </AbsoluteFill>
    );
};