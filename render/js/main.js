/* Bootstrap: Loads timing.json, initializes scenes & camera,
 * animates kinetic captions, exposes window.__seek(t) for Playwright.
 */
"use strict";
(function () {
    const params = new URLSearchParams(location.search);
    const DAY = parseInt(params.get("day") || "1", 10);
    const RW = parseInt(params.get("w") || "1080", 10);
    const RH = parseInt(params.get("h") || "1920", 10);

    if (RW !== 1080 || RH !== 1920) {
        const s = RW / 1080;
        const st = document.getElementById("stage");
        st.style.transform = `scale(${s})`;
        st.style.transformOrigin = "0 0";
        document.documentElement.style.width = RW + "px";
        document.documentElement.style.height = RH + "px";
        document.body.style.width = RW + "px";
        document.body.style.height = RH + "px";
    }

    let TIMING = null, scenes = [], camera = null;
    const subContainer = document.getElementById("subtitles");
    let subPill = null;
    let currentLineId = null;

    async function load() {
        const res = await fetch(`/build/timing_day${DAY}.json`);
        TIMING = await res.json();
        const A = {};
        for (const l of TIMING.lines) A[l.id] = { s: l.start, e: l.end };
        window.__A = A;
        window.__T = TIMING;

        const world = document.getElementById("world");
        scenes = NB.buildScenes(world, A, TIMING);

        // Steady, centered camera
        camera = new NB.Camera();
        camera.at(0, 540, 960, 1.0)
            .at(TIMING.duration, 540, 960, 1.0);

        await document.fonts.ready;
        const imgs = Array.from(document.images);
        await Promise.all(imgs.map(im => im.complete ? null : im.decode().catch(() => null)));
        return true;
    }

    // Reports exact bounding rectangle for verify.py safe-area checks
    window.__subtitleRect = function () {
        if (!subPill || subContainer.style.display === "none") return null;
        const r = subPill.getBoundingClientRect();
        return { x: r.left, y: r.top, w: r.width, h: r.height };
    };

    let currentChunkKey = null;

    function updateSubtitles(t) {
        const activeLine = TIMING.lines.find(l => t >= l.start && t <= l.end + 0.1);
        const isExcluded = activeLine && (activeLine.id === "l1" || activeLine.id === "l22" || activeLine.id === "l23");

        if (!activeLine || isExcluded) {
            if (subContainer.style.display !== "none") {
                subContainer.style.display = "none";
                subContainer.innerHTML = "";
                currentLineId = null;
                currentChunkKey = null;
                subPill = null;
            }
            return;
        }

        if (subContainer.style.display !== "flex") {
            subContainer.style.display = "flex";
        }

        // Break line into clean chunks of up to 4 words
        const words = activeLine.words;
        const CHUNK_SIZE = 4;
        let activeWordIdx = words.findIndex(w => t >= w.s && t <= w.e);
        if (activeWordIdx === -1) {
            // Find closest upcoming or recent word within line
            activeWordIdx = words.findIndex(w => t < w.s);
            if (activeWordIdx === -1) activeWordIdx = words.length - 1;
            else activeWordIdx = Math.max(0, activeWordIdx - 1);
        }

        const chunkIndex = Math.floor(activeWordIdx / CHUNK_SIZE);
        const chunkStart = chunkIndex * CHUNK_SIZE;
        const chunkWords = words.slice(chunkStart, chunkStart + CHUNK_SIZE);
        const chunkKey = `${activeLine.id}_${chunkIndex}`;

        if (currentChunkKey !== chunkKey) {
            currentChunkKey = chunkKey;
            subContainer.innerHTML = "";
            subPill = document.createElement("div");
            subPill.className = "subpill";

            chunkWords.forEach((w) => {
                const span = document.createElement("span");
                span.className = "sub-word";
                span.textContent = w.w;
                subPill.appendChild(span);
            });
            subContainer.appendChild(subPill);
        }

        // Highlight active word in chunk
        if (subPill) {
            const spans = subPill.children;
            chunkWords.forEach((w, i) => {
                const span = spans[i];
                if (!span) return;
                const isCurrent = t >= w.s && t <= w.e;
                const hasPassed = t > w.e;

                if (isCurrent) {
                    span.className = "sub-word active";
                } else if (hasPassed) {
                    span.className = "sub-word spoken";
                } else {
                    span.className = "sub-word";
                }
            });
        }
    }

    window.__seek = function (t) {
        const world = document.getElementById("world");
        camera.apply(t, world);
        for (const sc of scenes) sc.update(t);
        updateSubtitles(t);
        return true;
    };

    window.__meta = function () {
        return {
            day: TIMING.day, duration: TIMING.duration, fps: TIMING.fps,
            width: TIMING.width, height: TIMING.height,
            scenes: scenes.length,
        };
    };

    window.__readyFlag = false;
    window.__ready = load().then(() => {
        Object.defineProperty(window, "__duration", { value: TIMING.duration });
        Object.defineProperty(window, "__fps", { value: TIMING.fps });
        window.__readyFlag = true;
        return true;
    }).catch(err => {
        window.__loadError = String(err && err.stack || err);
        throw err;
    });
})();