export type SceneId =
    | "hook"
    | "challenge"
    | "analytics"
    | "privacy"
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
    navyText: "#0F172A",
    slateMuted: "#475569",
    amber: "#D97706",
    amberBright: "#F59E0B",
    whatsapp: "#10B981",
    whatsappSoft: "#D1FAE5",
    indigo: "#6366F1",
    purple: "#8B5CF6",
    danger: "#EF4444",
    pastelMint: "#ECFDF5",
    pastelAmber: "#FFFBEB",
    pastelBlue: "#EEF2FF",
    pastelPink: "#FDF2F8",
    pastelDanger: "#FEF2F2",
    borderWhite: "#FFFFFF",
    borderSubtle: "#E2E8F0",
    cardShadow:
        "0 24px 60px rgba(15, 23, 42, 0.10), 0 6px 16px rgba(15, 23, 42, 0.05)",
};

export const getDefaultTimeline = (day = 1): TimelineData => {
    const fps = 30;
    const rawScenes: Array<{ id: SceneId; durationInFrames: number }> = [
        { id: "hook", durationInFrames: 210 },      // 7.0s (Relationship question hook)
        { id: "challenge", durationInFrames: 90 },     // 3.0s (Day N counter)
        { id: "analytics", durationInFrames: 225 },    // 7.5s (WhatsApp UI + Reply speed/effort)
        { id: "privacy", durationInFrames: 165 },      // 5.5s (100% on phone, zero cloud)
        { id: "cta", durationInFrames: 120 },          // 4.0s (Play Store & Bio)
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
        totalFrames: currentFrame, // ~27 seconds total for high retention!
        totalSeconds: Number((currentFrame / fps).toFixed(2)),
        scenes,
    };
};
