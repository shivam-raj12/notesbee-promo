import React from "react";
import { Composition, Still, staticFile } from "remotion";
import { NotesBeeReel } from "./NotesBeeReel";
import { NotesBeeThumbnail } from "./NotesBeeThumbnail";
import { getDefaultTimeline, NotesBeeProps, TimelineData } from "./types";

export const RemotionRoot: React.FC = () => {
    return (
        <>
            {/* 1. The 60-75s Animated Video Reel */}
            <Composition
                id="NotesBeeReel"
                component={NotesBeeReel}
                durationInFrames={1905}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{
                    day: 1,
                    timeline: getDefaultTimeline(1),
                }}
                calculateMetadata={async ({ props }: { props: NotesBeeProps }) => {
                    const requestedDay: number =
                        typeof props.day === "number" ? props.day : 1;
                    try {
                        const response = await fetch(staticFile("timeline.json"));
                        if (!response.ok) {
                            throw new Error("timeline.json not found, using default fallback");
                        }
                        const data: TimelineData = await response.json();
                        return {
                            durationInFrames: data.totalFrames,
                            fps: data.fps || 30,
                            props: {
                                ...props,
                                day: typeof data.day === "number" ? data.day : requestedDay,
                                timeline: data,
                            },
                        };
                    } catch {
                        const fallback = getDefaultTimeline(requestedDay);
                        return {
                            durationInFrames: fallback.totalFrames,
                            fps: fallback.fps,
                            props: {
                                ...props,
                                day: requestedDay,
                                timeline: fallback,
                            },
                        };
                    }
                }}
            />

            {/* 2. The JPEG Cover Thumbnail */}
            <Still
                id="NotesBeeThumbnail"
                component={NotesBeeThumbnail}
                width={1080}
                height={1920}
                defaultProps={{
                    day: 1,
                }}
                calculateMetadata={async ({ props }: { props: NotesBeeProps }) => {
                    const requestedDay: number =
                        typeof props.day === "number" ? props.day : 1;
                    try {
                        const response = await fetch(staticFile("timeline.json"));
                        if (!response.ok) {
                            throw new Error("timeline.json not found");
                        }
                        const data: TimelineData = await response.json();
                        return {
                            props: {
                                ...props,
                                day: typeof data.day === "number" ? data.day : requestedDay,
                            },
                        };
                    } catch {
                        return {
                            props: {
                                ...props,
                                day: requestedDay,
                            },
                        };
                    }
                }}
            />
        </>
    );
};