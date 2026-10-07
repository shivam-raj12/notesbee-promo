/* NotesBee Clean Engine — Pure functions of time t.
 * Smooth spring easing and clean 2D layout math.
 */
"use strict";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const clamp01 = v => clamp(v, 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;

const E = {
    linear: t => t,
    inCubic: t => t * t * t,
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    outQuart: t => 1 - Math.pow(1 - t, 4),
    outQuint: t => 1 - Math.pow(1 - t, 5),
    outBack: t => {
        const c = 1.6;
        return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
    },
    outElastic: t => {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1;
    }
};

const P = (t, a, b) => clamp01((t - a) / (b - a));
const tw = (t, a, b, e = E.outCubic) => e(P(t, a, b));

function div(parent, style = {}, cls = "") {
    const d = document.createElement("div");
    if (cls) d.className = cls;
    Object.assign(d.style, { position: "absolute" }, style);
    parent.appendChild(d);
    return d;
}

function setT(el, x, y, opts = {}) {
    const s = opts.s ?? 1, r = opts.r ?? 0;
    el.style.transform = `translate3d(${x}px,${y}px,0) scale(${s}) rotate(${r}deg)`;
}

function setO(el, o) {
    o = clamp01(o);
    if (el.__o !== o) {
        el.__o = o;
        el.style.opacity = o;
    }
}

class Camera {
    constructor() {
        this.kf = [{ t: 0, x: 540, y: 960, s: 1 }];
    }
    at(t, x, y, s = 1) {
        this.kf.push({ t, x, y, s });
        this.kf.sort((a, b) => a.t - b.t);
        return this;
    }
    sample(t) {
        const k = this.kf;
        let i = 0;
        while (i < k.length - 1 && k[i + 1].t <= t) i++;
        const a = k[i], b = k[Math.min(i + 1, k.length - 1)];
        const u = b.t > a.t ? E.inOutCubic(P(t, a.t, b.t)) : 0;
        return {
            x: lerp(a.x, b.x, u),
            y: lerp(a.y, b.y, u),
            s: lerp(a.s, b.s, u)
        };
    }
    apply(t, world) {
        const c = this.sample(t);
        world.style.transform = `translate3d(${540 - c.x * c.s}px,${960 - c.y * c.s}px,0) scale(${c.s})`;
        return c;
    }
}

class Scene {
    constructor(id, start, end) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.root = null;
        this.built = false;
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

window.NB = { E, P, tw, clamp, clamp01, lerp, div, setT, setO, Camera, Scene };