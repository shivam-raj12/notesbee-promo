/* Bootstrap: loads timing.json, builds scenes + camera, exposes deterministic API:
 *   window.__seek(t)     render exact frame at time t (seconds)
 *   window.__duration    total seconds
 *   window.__fps
 *   window.__ready       promise -> true when fonts/images/scenes are ready
 *   window.__meta()      info for the verifier
 *   window.__subtitleRect()  current subtitle pill bbox (viewport px) or null
 */
"use strict";
(function () {
  const { div, setO, tw, E, clamp01, clamp } = NB;

  const params = new URLSearchParams(location.search);
  const DAY = parseInt(params.get("day") || "1", 10);
  // preview scaling: render the 1080x1920 stage into a smaller viewport
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

  const KEYWORDS = {
    amber: ["NOTESBEE", "100-DAY", "1000+", "DOWNLOAD", "DATA", "DECIDE", "DAY"],
    mint: ["WHATSAPP", "CHATS", "CHAT", "SECURELY"],
    violet: ["AI", "AI-POWERED", "AI-SUGGESTED"],
    red: [],
  };
  const KEY_STYLE = {
    amber: "color:#FFC24B;font-weight:900",
    mint: "color:#35D0A0;font-weight:900",
    violet: "color:#B7ADFF;font-weight:900",
  };
  function keyClass(word) {
    const w = word.toUpperCase().replace(/[^A-Z0-9+\-]/g, "");
    for (const [cls, list] of Object.entries(KEYWORDS))
      if (list.includes(w)) return cls;
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

    // ---------- camera choreography ----------
    camera = new NB.Camera();
    camera.at(0, 540, 880, 1.08)
      .at(A.l1.s + 0.6, 540, 880, 1.17)
      .at(A.l1.e + 0.2, 540, 900, 1.02)
      .at(A.l2.s + 0.4, 540, 900, 1.04)
      .at(A.l2.e - 0.3, 540, 900, 1.1)
      .at(A.l3.s + 0.3, 540, 1000, 1.05)
      .at(A.l6.e + 0.2, 540, 960, 1.0)
      .at(A.l7.s + 0.5, 540, 930, 1.06)
      .at(A.l9.s + 0.6, 540, 920, 1.1)
      .at(A.l10.s + 0.4, 540, 950, 1.04)
      .at(A.l14.e + 0.2, 540, 1000, 1.0)
      .at(A.l15.s + 0.4, 540, 1050, 1.03)
      .at(A.l16.s - 0.1, 540, 960, 1.08)
      .at(A.l17.s + 0.5, 540, 950, 1.12)
      .at(A.l18.s + 0.3, 540, 890, 1.05)
      .at(A.l19b.s + 0.3, 540, 890, 0.98)
      .at(A.l19c.s + 0.3, 540, 960, 1.0)
      .at(A.l19d.s + 0.2, 540, 940, 1.02)
      .at(A.l19d.e, 540, 1000, 0.97)
      .at(A.l20.s + 0.4, 540, 930, 1.07)
      .at(A.l21.s + 0.3, 540, 1000, 1.0)
      .at(TIMING.duration, 540, 1000, 1.01);
    // tension shakes: chat clutter + clock acceleration + freeze impact
    camera.shakeFn = (t) => {
      let amp = 0;
      const clutter = tw(t, A.l8.s, A.l8.s + 1.0) * (1 - tw(t, A.l9.s + 0.3, A.l9.s + 1.2));
      amp += 5 * clutter;
      const T0 = A.l15.s + 0.6, spinStart = T0 + 2.6, freeze = A.l16.s - 0.12;
      if (t > spinStart && t < freeze) amp += 9 * clamp01((t - spinStart) / (freeze - spinStart));
      if (t >= freeze && t < freeze + 0.5) amp += 14 * (1 - (t - freeze) / 0.5);
      if (amp < 0.01) return { x: 0, y: 0, r: 0 };
      const s1 = Math.sin(t * 47.3), s2 = Math.sin(t * 38.7 + 1.3), s3 = Math.sin(t * 52.9 + 2.1);
      return { x: s1 * amp, y: s2 * amp, r: s3 * amp * 0.12 };
    };

    // ---------- fx canvas + grain ----------
    fxCtx = document.getElementById("fx").getContext("2d");
    const grainCv = document.getElementById("grain");
    const gctx = grainCv.getContext("2d");
    const gRnd = NB.mulberry32(1234);
    for (let i = 0; i < 8; i++) {
      const d = gctx.createImageData(270, 480);
      for (let p = 0; p < d.data.length; p += 4) {
        const v = 110 + gRnd() * 90;
        d.data[p] = d.data[p + 1] = d.data[p + 2] = v;
        d.data[p + 3] = 46;
      }
      grainTiles.push(d);
    }
    window.__grainDraw = (frame) => gctx.putImageData(grainTiles[frame % 8], 0, 0);

    // wait for fonts + images
    await document.fonts.ready;
    const imgs = Array.from(document.images);
    await Promise.all(imgs.map(im => im.complete ? null : im.decode().catch(() => null)));
    return true;
  }

  // ---------- subtitles ----------
  function renderSubtitle(t) {
    const layer = document.getElementById("subtitles");
    const line = TIMING.lines.find(l => t >= l.start - 0.06 && t <= l.end + 0.25);
    if (!line) {
      if (subCache.lineId !== null) { layer.innerHTML = ""; subCache = { lineId: null, pill: null, words: [] }; }
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
    // word states
    for (const w of subCache.words) {
      const spoken = t >= w.s - 0.02;
      if (!w.base) {
        w.el.style.opacity = spoken ? 1 : 0.42;
        w.el.style.color = spoken ? "#FFFFFF" : "#E9EDFB";
      } else {
        w.el.style.opacity = spoken ? 1 : 0.55;
      }
      const cur = t >= w.s && t <= w.e + 0.05;
      w.el.style.transform = cur ? "translateY(-4px)" : "translateY(0)";
    }
    // subtle entrance
    const ent = tw(t, line.start - 0.06, line.start + 0.25, E.outCubic);
    subCache.pill.style.opacity = ent;
    subCache.pill.style.transform = `translateY(${(1 - ent) * 22}px)`;
  }

  window.__subtitleRect = function () {
    if (!subCache.pill) return null;
    const r = subCache.pill.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  };

  window.__seek = function (t) {
    const world = document.getElementById("world");
    const c = camera.apply(t, world);
    const sh = camera.shakeFn ? camera.shakeFn(t) : { x: 0, y: 0, r: 0 };
    if (sh.x || sh.y || sh.r)
      world.style.transform += ` translate(${sh.x}px,${sh.y}px) rotate(${sh.r}deg)`;
    for (const sc of scenes) sc.update(t);
    // fx layer
    fxCtx.clearRect(0, 0, 1080, 1920);
    for (const sc of scenes)
      if (sc.fx && t >= sc.start && t <= sc.end && sc.root.style.display !== "none") sc.fx(fxCtx, t);
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
  }).catch(err => { window.__loadError = String(err && err.stack || err); throw err; });
})();
