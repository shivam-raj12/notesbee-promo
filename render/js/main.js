/* Bootstrap: loads timing.json, builds scenes + camera, exposes deterministic API:
 *   window.__seek(t)         render exact frame at time t (seconds)
 *   window.__duration        total seconds
 *   window.__fps
 *   window.__ready           promise -> true when fonts/images/scenes are ready
 *   window.__meta()          info for the verifier
 *   window.__subtitleRect()  current subtitle pill bbox (viewport px) or null
 */
"use strict";
(function () {
    const { div, tw, E, clamp01, lerp } = NB;

    const params = new URLSearchParams(location.search);
    const DAY = parseInt(params.get("day") || "1", 10);

    // Preview scaling: render the 1080x1920 stage into a smaller preview viewport
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

    // Expanded High-Impact Keywords for Subtitle Pop
    const KEYWORDS = {
        amber: ["NOTESBEE", "100-DAY", "CHALLENGE", "1,000+", "1000+", "DOWNLOAD", "DATA", "DECIDE", "DAY", "BUDGET", "CONSISTENCY"],
        mint: ["WHATSAPP", "CHATS", "CHAT", "SECURELY", "MESSAGES", "FREE", "ENCRYPTED", "VAULT", "BEAUTIFUL"],
        violet: ["AI", "AI-POWERED", "AI-SUGGESTED", "SOLO", "DEVELOPER", "ORGANIZED", "PRIVACY"],
    };

    const KEY_STYLE = {
        amber: "color:#FFB72B;font-weight:900;text-shadow:0 0 24px rgba(255,183,43,0.7);",
        mint: "color:#00F5A0;font-weight:900;text-shadow:0 0 24px rgba(0,245,160,0.7);",
        violet: "color:#C4B5FD;font-weight:900;text-shadow:0 0 24px rgba(196,181,253,0.7);",
    };

    function keyClass(word) {
        const w = word.toUpperCase().replace(/[^A-Z0-9+\-,]/g, "");
        for (const [cls, list] of Object.entries(KEYWORDS)) {
            if (list.includes(w)) return cls;
        }
        return null;
    }

    let TIMING = null, scenes = [], camera = null, fxCtx = null, grainTiles = [];
    let subCache = { lineId: null, pill: null, words: [] };

    async function load() {
        const res = await fetch(`/build/timing_day${DAY}.json`);
        TIMING = await res.json();
        const A = {};
        for (const l of TIMING.lines) A[l.id] = { s: l.start, e: l.end };
        window.__A = A;
        window.__T = TIMING;

        const world = document.getElementById("world");
        scenes = NB.buildScenes(world, A, TIMING);

        // ---------- Camera Choreography ----------
        camera = new NB.Camera();
        camera.at(0, 540, 880, 1.08)
            .at(A.l1.s + 0.6, 540, 880, 1.18)
            .at(A.l1.e + 0.2, 540, 900, 1.02)
            .at(A.l2.s + 0.4, 540, 900, 1.04)
            .at(A.l2.e - 0.3, 540, 900, 1.1)
            .at(A.l3.s + 0.3, 540, 990, 1.05)
            .at(A.l6.e + 0.2, 540, 960, 1.0)
            .at(A.l7.s + 0.5, 540, 930, 1.06)
            .at(A.l9.s + 0.6, 540, 920, 1.1)
            .at(A.l10.s + 0.4, 540, 950, 1.04)
            .at(A.l14.e + 0.2, 540, 1000, 1.0)
            .at(A.l15.s + 0.4, 540, 1050, 1.03)
            .at(A.l16.s - 0.1, 540, 960, 1.09)
            .at(A.l17.s + 0.5, 540, 950, 1.14)
            .at(A.l18.s + 0.3, 540, 890, 1.05)
            .at(A.l19b.s + 0.3, 540, 890, 0.98)
            .at(A.l19c.s + 0.3, 540, 960, 1.0)
            .at(A.l19d.s + 0.2, 540, 940, 1.02)
            .at(A.l19d.e, 540, 1000, 0.97)
            .at(A.l20.s + 0.4, 540, 930, 1.08)
            .at(A.l21.s + 0.3, 540, 1000, 1.0)
            .at(TIMING.duration, 540, 1000, 1.01);

        // Register trauma shakes at key moments
        camera.shake(A.l1.s + 0.52, 0.65, 0.45);   // Day slam impact
        camera.shake(A.l16.s - 0.12, 0.85, 0.55);  // Clock freeze impact
        camera.shake(A.l20.s + 1.25, 0.5, 0.4);    // Icon reveal shockwave

        // Procedural Clutter/Spin Tension
        camera.shakeFn = (t) => {
            let amp = 0;
            const clutter = tw(t, A.l8.s, A.l8.s + 1.0) * (1 - tw(t, A.l9.s + 0.3, A.l9.s + 1.2));
            amp += 6 * clutter;
            const T0 = A.l15.s + 0.6, spinStart = T0 + 2.6, freeze = A.l16.s - 0.12;
            if (t > spinStart && t < freeze) amp += 12 * clamp01((t - spinStart) / (freeze - spinStart));
            if (amp < 0.01) return { x: 0, y: 0, r: 0 };
            const s1 = Math.sin(t * 54.3), s2 = Math.sin(t * 43.7 + 1.3), s3 = Math.sin(t * 61.9 + 2.1);
            return { x: s1 * amp, y: s2 * amp, r: s3 * amp * 0.12 };
        };

        // ---------- FX Canvas + Subtle Film Grain ----------
        fxCtx = document.getElementById("fx").getContext("2d");
        const grainCv = document.getElementById("grain");
        const gctx = grainCv.getContext("2d");
        const gRnd = NB.mulberry32(1234);
        for (let i = 0; i < 8; i++) {
            const d = gctx.createImageData(270, 480);
            for (let p = 0; p < d.data.length; p += 4) {
                const v = 120 + gRnd() * 80;
                d.data[p] = d.data[p + 1] = d.data[p + 2] = v;
                d.data[p + 3] = 32; // refined grain transparency
            }
            grainTiles.push(d);
        }
        window.__grainDraw = (frame) => gctx.putImageData(grainTiles[frame % 8], 0, 0);

        // Wait for fonts and imagery
        await document.fonts.ready;
        const imgs = Array.from(document.images);
        await Promise.all(imgs.map(im => im.complete ? null : im.decode().catch(() => null)));
        return true;
    }

    // ---------- Kinetic Subtitle Engine ----------
    function renderSubtitle(t) {
        const layer = document.getElementById("subtitles");
        const line = TIMING.lines.find(l => t >= l.start - 0.08 && t <= l.end + 0.25);
        if (!line) {
            if (subCache.lineId !== null) {
                layer.innerHTML = "";
                subCache = { lineId: null, pill: null, words: [] };
            }
            return;
        }

        if (subCache.lineId !== line.id) {
            layer.innerHTML = "";
            const pill = document.createElement("div");
            pill.className = "subpill";
            const words = [];
            for (const w of line.words) {
                const s = document.createElement("span");
                s.className = "subw";
                s.textContent = w.w;
                const kc = keyClass(w.w);
                if (kc) s.style.cssText = KEY_STYLE[kc];
                pill.appendChild(s);
                words.push({ el: s, s: line.start + (w.s - line.start), e: w.e, base: kc });
            }
            layer.appendChild(pill);
            subCache = { lineId: line.id, pill, words };
        }

        // Word highlighting and active spring scale
        for (const w of subCache.words) {
            const spoken = t >= w.s - 0.02;
            const cur = t >= w.s && t <= w.e + 0.06;

            if (!w.base) {
                w.el.style.opacity = spoken ? 1 : 0.4;
                w.el.style.color = spoken ? "#FFFFFF" : "rgba(226, 232, 240, 0.7)";
            } else {
                w.el.style.opacity = spoken ? 1 : 0.6;
            }

            if (cur) {
                w.el.style.transform = "translate3d(0, -6px, 0) scale(1.1)";
                w.el.style.textShadow = w.base ? "" : "0 0 20px rgba(255,255,255,0.8)";
            } else {
                w.el.style.transform = "translate3d(0, 0, 0) scale(1.0)";
                if (!w.base) w.el.style.textShadow = "none";
            }
        }

        // Smooth entry float
        const ent = tw(t, line.start - 0.08, line.start + 0.22, E.outCubic);
        subCache.pill.style.opacity = ent;
        subCache.pill.style.transform = `translate3d(0, ${(1 - ent) * 20}px, 0)`;
    }

    window.__subtitleRect = function () {
        if (!subCache.pill) return null;
        const r = subCache.pill.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
    };

    window.__seek = function (t) {
        const world = document.getElementById("world");
        camera.apply(t, world);

        const sh = camera.shakeFn ? camera.shakeFn(t) : { x: 0, y: 0, r: 0 };
        if (sh.x || sh.y || sh.r) {
            world.style.transform += ` translate3d(${sh.x}px,${sh.y}px,0) rotate(${sh.r}deg)`;
        }

        for (const sc of scenes) sc.update(t);

        // Clear and draw particles & fx
        fxCtx.clearRect(0, 0, 1080, 1920);
        for (const sc of scenes) {
            if (sc.fx && t >= sc.start && t <= sc.end && sc.root.style.display !== "none") {
                sc.fx(fxCtx, t);
            }
        }

        renderSubtitle(t);
        window.__grainDraw(Math.round(t * TIMING.fps));
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