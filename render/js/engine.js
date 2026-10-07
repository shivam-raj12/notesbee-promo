/* NotesBee Clean Engine — Deterministic, bounded, rock-solid layout. */
"use strict";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const clamp01 = v => clamp(v, 0, 1);
const lerp = (a, b, t) => a + (b - a) * t;

const E = {
    linear: t => t,
    inCubic: t => t * t * t,
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    outBack: t => {
        const c = 1.35;
        return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
    }
};

const P = (t, a, b) => clamp01((t - a) / (b - a));
const tw = (t, a, b, e = E.outCubic) => e(P(t, a, b));

function div(parent, style = {}, cls = "") {
    const d = document.createElement("div");
    if (cls) d.className = cls;
    Object.assign(d.style, style);
    parent.appendChild(d);
    return d;
}

/** Animate offset/scale smoothly without overriding layout coordinates */
function setT(el, dx = 0, dy = 0, s = 1) {
    el.style.transform = `translate3d(${dx}px,${dy}px,0) scale(${s})`;
}

function setO(el, o) {
    o = clamp01(o);
    if (el.__o !== o) {
        el.__o = o;
        el.style.opacity = o;
    }
}

class Camera {
    constructor() {}
    apply(t, world) {
        world.style.transform = "none";
        return { x: 540, y: 960, s: 1 };
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
        this.root = div(world, {
            position: "absolute",
            left: "0px",
            top: "0px",
            width: "1080px",
            height: "1920px",
            boxSizing: "border-box",
            overflow: "hidden",
            display: "none"
        }, "scene");
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