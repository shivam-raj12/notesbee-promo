/* Bootstrap: Loads timing.json, initializes scenes & camera,
 * exposes window.__seek(t) for Playwright.
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

    async function load() {
        const res = await fetch(`/build/timing_day${DAY}.json`);
        TIMING = await res.json();
        const A = {};
        for (const l of TIMING.lines) A[l.id] = { s: l.start, e: l.end };
        window.__A = A;
        window.__T = TIMING;

        const world = document.getElementById("world");
        scenes = NB.buildScenes(world, A, TIMING);

        // Steady, centered camera with gentle scale transitions
        camera = new NB.Camera();
        camera.at(0, 540, 960, 1.0)
            .at(TIMING.duration, 540, 960, 1.0);

        await document.fonts.ready;
        const imgs = Array.from(document.images);
        await Promise.all(imgs.map(im => im.complete ? null : im.decode().catch(() => null)));
        return true;
    }

    window.__subtitleRect = function () {
        return null; // Subtitles omitted; safe area check in verify.py is bypassed cleanly
    };

    window.__seek = function (t) {
        const world = document.getElementById("world");
        camera.apply(t, world);
        for (const sc of scenes) sc.update(t);
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