export type SceneId =
    | "hook"
    | "problem"
    | "challenge"
    | "whatsapp_solution"
    | "decoy_privacy"
    | "ai_enhancer"
    | "backgrounds_1000"
    | "cta";

export interface SceneTiming {
    id: SceneId;
    text: string;
    audioFile?: string;
    durationInFrames: number;
    startFrame: number;
}

export interface TimelineData {
    day: number;
    fps: number;
    totalFrames: number;
    totalSeconds: number;
    scenes: SceneTiming[];
}

export type NotesBeeProps = {
    day?: number;
    timeline?: TimelineData;
};

export const BRAND = {
    bgBase: "#F8FAFF",
    bgCard: "#FFFFFF",
    bgCardGlass: "rgba(255, 255, 255, 0.92)",

    pastelBlue: "#EEF2FF",
    pastelPurple: "#F3E8FF",
    pastelMint: "#ECFDF5",
    pastelAmber: "#FFFBEB",
    pastelPink: "#FDF2F8",
    pastelDanger: "#FEF2F2",

    navyText: "#0F172A",
    slateMuted: "#475569",
    amber: "#D97706",
    amberBright: "#F59E0B",
    whatsapp: "#10B981",
    whatsappSoft: "#D1FAE5",
    indigo: "#6366F1",
    purple: "#8B5CF6",
    rose: "#EC4899",
    danger: "#EF4444",

    borderWhite: "#FFFFFF",
    borderSubtle: "#E2E8F0",
    cardShadow:
        "0 20px 50px rgba(15, 23, 42, 0.08), 0 4px 12px rgba(15, 23, 42, 0.04)",
};

export const getDefaultTimeline = (day = 1): TimelineData => {
    const fps = 30;
    const rawScenes: Array<{ id: SceneId; durationInFrames: number }> = [
        { id: "hook", durationInFrames: 240 },             // 8.0s
        { id: "problem", durationInFrames: 180 },          // 6.0s
        { id: "challenge", durationInFrames: 195 },        // 6.5s
        { id: "whatsapp_solution", durationInFrames: 330 },// 11.0s
        { id: "decoy_privacy", durationInFrames: 255 },    // 8.5s
        { id: "ai_enhancer", durationInFrames: 225 },      // 7.5s
        { id: "backgrounds_1000", durationInFrames: 255 }, // 8.5s
        { id: "cta", durationInFrames: 225 },              // 7.5s
    ];

    let currentFrame = 0;
    const scenes: SceneTiming[] = rawScenes.map((s) => {
        const item: SceneTiming = {
            id: s.id,
            text: "",
            durationInFrames: s.durationInFrames,
            startFrame: currentFrame,
        };
        currentFrame += s.durationInFrames;
        return item;
    });

    return {
        day,
        fps,
        totalFrames: currentFrame, // 1905 frames = 63.5s
        totalSeconds: Number((currentFrame / fps).toFixed(2)),
        scenes,
    };
};