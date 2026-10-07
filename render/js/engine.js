/* NotesBee promo — deterministic animation engine.
 * Upgraded with physics spring easing, kinetic tilt typography,
 * trauma camera shake, and cinematic bokeh particles.
 */
"use strict";

// ---------- math / easing ----------
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const clamp01 = v => clamp(v, 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;

const E = {
    linear: t => t,
    inCubic: t => t * t * t,
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inOutCubic: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    outQuart: t => 1 - Math.pow(1 - t, 4),
    inQuart: t => t * t * t * t,
    outQuint: t => 1 - Math.pow(1 - t, 5),
    inOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2,
    outExpo: t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t),
    inExpo: t => t <= 0 ? 0 : Math.pow(2, 10 * t - 10),
    outBack: t => { const c = 1.9, c3 = c + 1; return 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
    outBackBig: t => { const c = 2.8, c3 = c + 1; return 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
    outElastic: t => {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
    },
    // Critically damped spring towards 1
    spring: (t, freq = 7.5, damp = 0.68) => {
        if (t <= 0) return 0;
        if (t >= 1) return 1;
        return 1 - Math.exp(-freq * damp * t * 4) * Math.cos(freq * Math.sqrt(Math.max(0, 1 - damp * damp)) * t * 4);
    }
};

/** progress of t inside [a,b] */
const P = (t, a, b) => clamp01((t - a) / (b - a));
/** eased progress */
const tw = (t, a, b, e = E.outCubic) => e(P(t, a, b));
/** 1 inside [a,b], eased in/out with edge f */
const pulse = (t, a, b, f = 0.25, e = E.outCubic) => {
    const d = b - a, fe = Math.min(f * d, d / 2);
    return tw(t, a, a + fe, e) * (1 - tw(t, b - fe, b, e));
};

// ---------- seeded PRNG ----------
function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
/** stable per-index random in [0,1) */
const rnd = (seed, i) => {
    let h = (seed * 2654435761) ^ ((i + 1) * 40503);
    h = Math.imul(h ^ (h >>> 13), 0x5bd1e995);
    h ^= h >>> 15;
    return (h >>> 0) / 4294967296;
};

// ---------- DOM helpers ----------
const WORLD = () => document.getElementById("world");

function div(parent, style = {}, cls = "") {
    const d = document.createElement("div");
    if (cls) d.className = cls;
    Object.assign(d.style, { position: "absolute" }, style);
    parent.appendChild(d);
    return d;
}

function setT(el, x, y, opts = {}) {
    const s = opts.s ?? 1, r = opts.r ?? 0, sx = opts.sx ?? s, sy = opts.sy ?? s;
    el.style.transform =
        `translate3d(${x}px,${y}px,0) rotate(${r}deg) scale(${sx},${sy})` +
        (opts.extra ? " " + opts.extra : "");
}

/** set opacity only when changed (avoid style churn) */
function setO(el, o) {
    o = clamp01(o);
    if (el.__o !== o) { el.__o = o; el.style.opacity = o; }
}

/** velocity-based motion blur (px) for a value function v(t) */
function blurFor(fn, t, scale = 0.05, max = 14) {
    const dt = 1 / 60;
    const v = Math.abs(fn(t + dt) - fn(t - dt)) / (2 * dt);
    return Math.min(max, v * scale);
}

// ---------- kinetic typography ----------
function ktext(parent, text, style = {}, cls = "black") {
    const wrap = div(parent, Object.assign({
        display: "flex", justifyContent: "center", whiteSpace: "pre",
    }, style), cls);
    const chars = [];
    for (let idx = 0; idx < text.length; idx++) {
        const ch = text[idx];
        const s = document.createElement("span");
        s.textContent = ch;
        s.style.display = "inline-block";
        s.style.transformOrigin = "50% 70%";
        s.style.willChange = "transform, opacity, filter";
        wrap.appendChild(s);
        chars.push(s);
    }
    return { el: wrap, chars };
}

function kIn(chars, t, t0, stag = 0.028, dur = 0.45, mode = "rise") {
    for (let i = 0; i < chars.length; i++) {
        const c = chars[i], p = P(t, t0 + i * stag, t0 + i * stag + dur);
        if (p <= 0) { setO(c, 0); continue; }
        let e, ty = 0, s = 1, blur = 0, r = 0;
        if (mode === "rise") {
            e = E.outBack(p);
            ty = (1 - e) * 85;
            s = 0.65 + 0.35 * E.outCubic(p);
            r = (rnd(88, i) - 0.5) * 12 * (1 - p);
        } else if (mode === "drop") {
            e = E.outBack(p);
            ty = -(1 - e) * 100;
            r = (rnd(89, i) - 0.5) * 10 * (1 - p);
        } else if (mode === "pop") {
            e = E.outBackBig(p);
            s = 0.2 + 0.8 * e;
            blur = (1 - p) * 10;
            r = (rnd(90, i) - 0.5) * 14 * (1 - p);
        } else if (mode === "slam") {
            e = E.outQuint(p);
            s = 3.4 - 2.4 * e;
            blur = (1 - p) * 20;
        }
        setO(c, clamp01(p * 3.5));
        c.style.transform = `translate3d(0,${ty}px,0) rotate(${r}deg) scale(${s})`;
        c.style.filter = blur > 0.4 ? `blur(${blur}px)` : "none";
    }
}

function kOut(chars, t, t0, stag = 0.016, dur = 0.28) {
    for (let i = 0; i < chars.length; i++) {
        const c = chars[i], p = P(t, t0 + i * stag, t0 + i * stag + dur);
        if (p <= 0) continue;
        setO(c, 1 - p);
        c.style.transform = `translate3d(0,${-55 * E.inCubic(p)}px,0) scale(${1 - 0.25 * p})`;
        c.style.filter = p > 0.05 ? `blur(${p * 8}px)` : "none";
    }
}

// ---------- particles & atmospheric effects ----------
function burst(ctx, t, x, y, t0, n, opt = {}) {
    const dur = opt.dur ?? 0.9, seed = opt.seed ?? 7;
    const p = P(t, t0, t0 + dur);
    if (p <= 0 || p >= 1) return;
    const e = E.outCubic(p);
    for (let i = 0; i < n; i++) {
        const a = rnd(seed, i) * Math.PI * 2;
        const sp = lerp(opt.spMin ?? 140, opt.spMax ?? 650, rnd(seed + 1, i));
        const sz = lerp(opt.szMin ?? 3.5, opt.szMax ?? 11, rnd(seed + 2, i)) * (1 - 0.55 * p);
        const wob = Math.sin(t * 7 + i) * 10 * p;
        const px = x + Math.cos(a) * sp * e + wob;
        const py = y + Math.sin(a) * sp * e * (opt.flat ?? 1) - (opt.rise ?? 0) * e;
        ctx.globalAlpha = (1 - p) * (opt.alpha ?? 0.95);
        ctx.fillStyle = Array.isArray(opt.color) ? opt.color[i % opt.color.length] : (opt.color ?? "#FFB72B");
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.4, sz), 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function ambientDust(ctx, t, n = 30, seed = 99, alpha = 0.45) {
    for (let i = 0; i < n; i++) {
        const bx = rnd(seed, i) * 1080, by = rnd(seed + 1, i) * 1920;
        const ph = rnd(seed + 2, i) * Math.PI * 2;
        const x = bx + Math.sin(t * 0.28 + ph) * 40;
        const y = (by + Math.cos(t * 0.2 + ph * 1.3) * 50 - (t * 12) % 1920 + 1920) % 1920;
        const s = 1.5 + rnd(seed + 3, i) * 3.5;
        ctx.globalAlpha = alpha * (0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * 1.2 + ph)));
        ctx.fillStyle = rnd(seed + 4, i) > 0.6 ? "#FFB72B" : (rnd(seed + 5, i) > 0.5 ? "#00F5A0" : "#8F72FF");
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

// ---------- camera with trauma shake ----------
class Camera {
    constructor() {
        this.kf = [{ t: 0, x: 540, y: 960, s: 1, r: 0 }];
        this.shakes = [];
    }
    at(t, x, y, s = 1, r = 0) {
        this.kf.push({ t, x, y, s, r });
        this.kf.sort((a, b) => a.t - b.t);
        return this;
    }
    // Add impact shake event (t0: time, trauma: magnitude 0-1, dur: seconds)
    shake(t0, trauma = 0.5, dur = 0.4) {
        this.shakes.push({ t0, trauma, dur });
        return this;
    }
    sample(t) {
        const k = this.kf;
        let i = 0;
        while (i < k.length - 1 && k[i + 1].t <= t) i++;
        const a = k[i], b = k[Math.min(i + 1, k.length - 1)];
        let u = b.t > a.t ? E.inOutCubic(P(t, a.t, b.t)) : 0;
        const breath = 1 + 0.005 * Math.sin(t * 0.9);

        // Calculate cumulative trauma shake
        let shakeX = 0, shakeY = 0, shakeR = 0;
        for (const sh of this.shakes) {
            if (t >= sh.t0 && t <= sh.t0 + sh.dur) {
                const p = 1 - (t - sh.t0) / sh.dur;
                const mag = p * p * sh.trauma;
                shakeX += (rnd(101, Math.floor(t * 60)) - 0.5) * 45 * mag;
                shakeY += (rnd(102, Math.floor(t * 60)) - 0.5) * 45 * mag;
                shakeR += (rnd(103, Math.floor(t * 60)) - 0.5) * 5 * mag;
            }
        }

        return {
            x: lerp(a.x, b.x, u) + shakeX,
            y: lerp(a.y, b.y, u) + shakeY,
            s: lerp(a.s, b.s, u) * breath,
            r: lerp(a.r, b.r, u) + shakeR,
        };
    }
    apply(t, world) {
        const c = this.sample(t);
        world.style.transform =
            `translate3d(${540 - c.x * c.s}px,${960 - c.y * c.s}px,0) scale(${c.s}) rotate(${c.r}deg)`;
        return c;
    }
}

// ---------- scene base ----------
class Scene {
    constructor(id, start, end) {
        this.id = id; this.start = start; this.end = end;
        this.root = null; this.built = false;
    }
    build(world) {
        this.root = div(world, {}, "scene");
        this.root.style.display = "none";
        this.buildContent(this.root);
        this.built = true;
    }
    update(t) {
        const on = t >= this.start && t <= this.end;
        if (!on) {
            if (this.root.style.display !== "none") this.root.style.display = "none";
            return;
        }
        if (this.root.style.display !== "block") this.root.style.display = "block";
        this.render(t);
    }
    buildContent(root) {}
    render(t) {}
}

window.NB = {
    E, P, tw, pulse, clamp, clamp01, lerp, rnd, mulberry32, div, setT, setO,
    blurFor, ktext, kIn, kOut, burst, ambientDust, Camera, Scene
};