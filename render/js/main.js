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

    function updateSubtitles(t) {
        // Find active narration line
        const activeLine = TIMING.lines.find(l => t >= l.start && t <= l.end + 0.15);

        // Hide subtitles during Scene 1 (Day Hook) and Scene 14 (CTA) to avoid visual clashes
        const isExcluded = activeLine && (activeLine.id === "l1" || activeLine.id === "l22" || activeLine.id === "l23");

        if (!activeLine || isExcluded) {
            if (subContainer.style.display !== "none") {
                subContainer.style.display = "none";
                subContainer.innerHTML = "";
                currentLineId = null;
                subPill = null;
            }
            return;
        }

        if (subContainer.style.display !== "flex") {
            subContainer.style.display = "flex";
        }

        // Build word elements when transitioning to a new line
        if (currentLineId !== activeLine.id) {
            currentLineId = activeLine.id;
            subContainer.innerHTML = "";
            subPill = document.createElement("div");
            subPill.className = "subpill";

            activeLine.words.forEach((w, idx) => {
                const span = document.createElement("span");
                span.className = "sub-word";
                span.textContent = w.w;
                span.dataset.idx = idx;
                subPill.appendChild(span);
            });
            subContainer.appendChild(subPill);
        }

        // Highlight active word in amber and mark spoken words white
        const spans = subPill.children;
        for (let i = 0; i < activeLine.words.length; i++) {
            const w = activeLine.words[i];
            const span = spans[i];
            if (!span) continue;

            const isCurrent = t >= w.s && t <= w.e;
            const hasPassed = t > w.e;

            if (isCurrent) {
                span.className = "sub-word active";
            } else if (hasPassed) {
                span.className = "sub-word spoken";
            } else {
                span.className = "sub-word";
            }
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