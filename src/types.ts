export type SceneId =
    | "hook"
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
    bgCardGlass: "rgba(255, 255, 255, 0.94)",

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
        "0 24px 60px rgba(15, 23, 42, 0.10), 0 6px 16px rgba(15, 23, 42, 0.05)",
};

export const getDefaultTimeline = (day = 1): TimelineData => {
    const fps = 30;
    const rawScenes: Array<{ id: SceneId; durationInFrames: number }> = [
        { id: "hook", durationInFrames: 255 },              // 8.5s (Suspense + 4 Curiosity Questions)
        { id: "challenge", durationInFrames: 115 },         // 3.8s
        { id: "whatsapp_solution", durationInFrames: 225 }, // 7.5s
        { id: "decoy_privacy", durationInFrames: 195 },     // 6.5s (Clear Setup -> Snooper vs You)
        { id: "ai_enhancer", durationInFrames: 135 },       // 4.5s
        { id: "backgrounds_1000", durationInFrames: 150 },  // 5.0s
        { id: "cta", durationInFrames: 135 },               // 4.5s
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
        totalFrames: currentFrame,
        totalSeconds: Number((currentFrame / fps).toFixed(2)),
        scenes,
    };
};
