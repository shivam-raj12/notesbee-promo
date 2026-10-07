/* Procedural UI components — Enhanced Modern Aesthetic
 * Sleek glassmorphism, gradient rims, premium mobile framing.
 */
"use strict";
(function () {
    const { div } = NB;
    const FONT = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
    const MONO = "'JetBrains Mono', monospace";

    // ---------- Modern Glass Card ----------
    function glassCard(parent, x, y, w, h, opt = {}) {
        const el = div(parent, {
            left: x + "px", top: y + "px", width: w + "px", height: h + "px",
            borderRadius: (opt.r ?? 36) + "px",
            background: opt.bg ?? "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%), rgba(13, 19, 39, 0.85)",
            border: `1px solid ${opt.border ?? "rgba(255, 255, 255, 0.14)"}`,
            boxShadow: opt.shadow ?? "0 30px 60px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(20px)",
            overflow: opt.overflow ?? "hidden"
        });
        return el;
    }

    // ---------- Realistic 3D Phone Chassis / Frame ----------
    function phoneFrame(parent, x, y, w = 680, h = 1380) {
        const chassis = div(parent, {
            left: x + "px", top: y + "px", width: w + "px", height: h + "px",
            borderRadius: "64px",
            background: "#080B14",
            padding: "16px",
            border: "4px solid #2B344D",
            boxShadow: "0 40px 100px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1), inset 0 0 0 2px rgba(0,0,0,0.8)",
            display: "flex", flexDirection: "column",
        });

        // Screen area
        const screen = div(chassis, {
            width: "100%", height: "100%", borderRadius: "48px",
            background: "radial-gradient(circle at 50% 10%, #151C36, #090C19 80%)",
            position: "relative", overflow: "hidden",
        });

        // Dynamic Island / Camera Punch-hole
        const island = div(screen, {
            left: "50%", top: "18px", width: "160px", height: "34px",
            background: "#000", borderRadius: "20px", transform: "translateX(-50%)",
            zIndex: "100", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.5)"
        });
        div(island, { width: "12px", height: "12px", borderRadius: "50%", background: "#0a1330", marginRight: "-40px" });

        return { chassis, screen };
    }

    // ---------- Sleek Chat Bubble ----------
    function chatBubble(parent, opt) {
        const mine = opt.side === "me";
        const b = div(parent, {
            maxWidth: "580px", padding: "18px 24px",
            borderRadius: "26px",
            borderBottomRightRadius: mine ? "6px" : "26px",
            borderBottomLeftRadius: mine ? "26px" : "6px",
            background: mine
                ? "linear-gradient(135deg, #10B981, #059669)"
                : "linear-gradient(135deg, rgba(30, 41, 74, 0.9), rgba(18, 25, 48, 0.95))",
            border: mine ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: mine ? "0 10px 25px rgba(16, 185, 129, 0.28)" : "0 12px 30px rgba(0, 0, 0, 0.4)",
            fontFamily: FONT, fontSize: "28px", lineHeight: "1.4", fontWeight: "500",
            color: "#FFFFFF",
            position: "relative"
        });

        if (opt.media) {
            const m = div(b, {
                width: "320px", height: "180px", borderRadius: "18px", marginBottom: "12px",
                background: opt.media, position: "relative", overflow: "hidden",
                boxShadow: "0 6px 16px rgba(0,0,0,0.3)"
            });
            div(m, {
                left: "50%", top: "50%", width: "54px", height: "54px", borderRadius: "50%",
                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
                transform: "translate(-50%, -50%)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }).innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>`;
        }

        if (opt.text) b.appendChild(Object.assign(document.createElement("div"), { textContent: opt.text }));

        const meta = div(b, {
            position: "relative", fontSize: "19px", color: mine ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.45)",
            textAlign: "right", marginTop: "6px", fontWeight: "500",
        });
        meta.textContent = opt.time ?? "";
        if (mine && opt.read !== undefined) {
            const ticks = document.createElement("span");
            ticks.innerHTML = opt.read
                ? `<span style="color:#A7F3D0;font-weight:700;margin-left:4px"> ✓✓</span>`
                : `<span style="color:rgba(255,255,255,0.6);margin-left:4px"> ✓✓</span>`;
            meta.appendChild(ticks);
        }
        return b;
    }

    // ---------- Counter with Glow ----------
    function counter(parent, x, y, opt = {}) {
        const el = div(parent, {
            left: x + "px", top: y + "px", fontFamily: FONT,
            fontSize: (opt.size ?? 96) + "px", fontWeight: "800",
            color: opt.color ?? "#FFFFFF", letterSpacing: "-3px",
            transform: "translate(-50%,-50%)", textAlign: "center",
            textShadow: `0 0 40px ${opt.glow ?? "rgba(255, 255, 255, 0.3)"}`
        });
        el.__fmt = opt.fmt ?? (v => Math.round(v).toLocaleString("en-US"));
        return el;
    }
    function setCounter(el, v) { el.textContent = el.__fmt(v); }

    // ---------- Progress Bar with Inner Glow ----------
    function bar(parent, x, y, w, h, color, opt = {}) {
        const wrap = div(parent, {
            left: x + "px", top: y + "px", width: w + "px", height: h + "px",
            borderRadius: h / 2 + "px", background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden",
        });
        const fill = div(wrap, {
            left: "0", top: "0", height: "100%", width: "0%",
            borderRadius: h / 2 + "px",
            background: color,
            boxShadow: `0 0 ${h * 1.5}px ${opt.glow ?? "rgba(255,183,43,0.5)"}`,
        });
        return { wrap, fill, set(p) { fill.style.width = (NB.clamp01(p) * 100).toFixed(2) + "%"; } };
    }

    // ---------- Donut Chart with Gradient Shadows ----------
    function donut(parent, cx, cy, r, thickness, segs, opt = {}) {
        const NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(NS, "svg");
        svg.setAttribute("width", r * 2 + thickness * 2);
        svg.setAttribute("height", r * 2 + thickness * 2);
        svg.style.position = "absolute";
        svg.style.left = (cx - r - thickness) + "px";
        svg.style.top = (cy - r - thickness) + "px";
        svg.style.overflow = "visible";
        parent.appendChild(svg);
        const circ = 2 * Math.PI * r;
        const arcs = segs.map(s => {
            const el = document.createElementNS(NS, "circle");
            el.setAttribute("cx", r + thickness); el.setAttribute("cy", r + thickness);
            el.setAttribute("r", r); el.setAttribute("fill", "none");
            el.setAttribute("stroke", s.color); el.setAttribute("stroke-width", thickness);
            el.setAttribute("stroke-linecap", "round");
            el.style.filter = `drop-shadow(0 4px 16px ${s.color}88)`;
            svg.appendChild(el);
            return el;
        });
        return {
            svg, arcs,
            set(p) {
                let acc = -0.25;
                segs.forEach((s, i) => {
                    const frac = NB.clamp01(s.frac * p);
                    const gap = segs.length > 1 ? 0.035 : 0;
                    arcs[i].setAttribute("stroke-dasharray", `${Math.max(0.001, (frac - gap) * circ)} ${circ}`);
                    arcs[i].setAttribute("stroke-dashoffset", -acc * circ);
                    acc += s.frac * p;
                });
                svg.style.opacity = p <= 0 ? 0 : 1;
            }
        };
    }

    // ---------- Premium Minimalist Clock ----------
    function clock(parent, cx, cy, r) {
        const face = div(parent, {
            left: (cx - r) + "px", top: (cy - r) + "px", width: r * 2 + "px", height: r * 2 + "px",
            borderRadius: "50%", background: "radial-gradient(circle at 40% 30%, #1A2447, #0B0E1E 85%)",
            border: `${Math.max(4, r * 0.035)}px solid rgba(255, 255, 255, 0.15)`,
            boxShadow: "0 30px 80px rgba(0,0,0,0.7), inset 0 1px 2px rgba(255,255,255,0.3)",
        });
        const NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(NS, "svg");
        svg.setAttribute("width", r * 2); svg.setAttribute("height", r * 2);
        face.appendChild(svg);
        for (let i = 0; i < 12; i++) {
            const a = i / 12 * Math.PI * 2, big = i % 3 === 0;
            const line = document.createElementNS(NS, "line");
            const r1 = r * (big ? 0.8 : 0.86), r2 = r * 0.92;
            line.setAttribute("x1", r + Math.sin(a) * r1); line.setAttribute("y1", r - Math.cos(a) * r1);
            line.setAttribute("x2", r + Math.sin(a) * r2); line.setAttribute("y2", r - Math.cos(a) * r2);
            line.setAttribute("stroke", big ? "#FFFFFF" : "rgba(255,255,255,0.25)");
            line.setAttribute("stroke-width", big ? r * 0.03 : r * 0.015);
            line.setAttribute("stroke-linecap", "round");
            svg.appendChild(line);
        }
        const mkHand = (len, w, color) => {
            const g = document.createElementNS(NS, "g");
            const l = document.createElementNS(NS, "line");
            l.setAttribute("x1", r); l.setAttribute("y1", r + r * 0.1);
            l.setAttribute("x2", r); l.setAttribute("y2", r - len);
            l.setAttribute("stroke", color); l.setAttribute("stroke-width", w);
            l.setAttribute("stroke-linecap", "round");
            g.appendChild(l); svg.appendChild(g);
            g.setAttribute("transform-origin", `${r} ${r}`);
            return g;
        };
        const hour = mkHand(r * 0.52, r * 0.045, "#FFFFFF");
        const min = mkHand(r * 0.74, r * 0.03, "#CBD5E1");
        const sec = mkHand(r * 0.84, r * 0.015, "#FFB72B");
        const cap = document.createElementNS(NS, "circle");
        cap.setAttribute("cx", r); cap.setAttribute("cy", r); cap.setAttribute("r", r * 0.045);
        cap.setAttribute("fill", "#FFB72B"); svg.appendChild(cap);
        return {
            face,
            set(h, m, s) {
                hour.setAttribute("transform", `rotate(${(h % 12) * 30 + m * 0.5} ${r} ${r})`);
                min.setAttribute("transform", `rotate(${m * 6 + s * 0.1} ${r} ${r})`);
                sec.setAttribute("transform", `rotate(${s * 6} ${r} ${r})`);
            }
        };
    }

    // ---------- Metallic Padlock ----------
    function padlock(parent, cx, cy, s, color = "#FFB72B") {
        const NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(NS, "svg");
        svg.setAttribute("width", s * 1.4); svg.setAttribute("height", s * 1.7);
        svg.style.position = "absolute";
        svg.style.left = (cx - s * 0.7) + "px"; svg.style.top = (cy - s * 0.85) + "px";
        svg.style.overflow = "visible";
        parent.appendChild(svg);
        const shackle = document.createElementNS(NS, "path");
        const w = s * 0.6, sw = s * 0.15;
        shackle.setAttribute("fill", "none");
        shackle.setAttribute("stroke", "#CBD5E1");
        shackle.setAttribute("stroke-width", sw);
        shackle.setAttribute("stroke-linecap", "round");
        svg.appendChild(shackle);

        const body = document.createElementNS(NS, "rect");
        body.setAttribute("x", s * 0.7 - w * 0.82); body.setAttribute("y", s * 0.72);
        body.setAttribute("width", w * 1.64); body.setAttribute("height", s * 0.94);
        body.setAttribute("rx", s * 0.22);
        body.setAttribute("fill", color);
        body.style.filter = `drop-shadow(0 15px 35px ${color}66)`;
        svg.appendChild(body);

        const key = document.createElementNS(NS, "circle");
        key.setAttribute("cx", s * 0.7); key.setAttribute("cy", s * 1.1);
        key.setAttribute("r", s * 0.09); key.setAttribute("fill", "#070B18");
        svg.appendChild(key);
        const slot = document.createElementNS(NS, "rect");
        slot.setAttribute("x", s * 0.7 - s * 0.035); slot.setAttribute("y", s * 1.14);
        slot.setAttribute("width", s * 0.07); slot.setAttribute("height", s * 0.25);
        slot.setAttribute("rx", s * 0.03); slot.setAttribute("fill", "#070B18");
        svg.appendChild(slot);
        return {
            svg,
            set(p) {
                const open = (1 - NB.clamp01(p)) * s * 0.42;
                const d = `M ${s * 0.7 - w} ${s * 0.78} V ${s * 0.42 - open}
                   A ${w} ${w} 0 0 1 ${s * 0.7 + w} ${s * 0.42 - open} V ${s * 0.78 - open * 0.4}`;
                shackle.setAttribute("d", d);
            }
        };
    }

    // ---------- Note Card with Clean Accent Top ----------
    function noteCard(parent, x, y, w, h, opt = {}) {
        const card = glassCard(parent, x, y, w, h, {
            r: 32,
            bg: opt.bg ?? "linear-gradient(145deg, rgba(28, 38, 70, 0.9), rgba(15, 20, 42, 0.95))"
        });
        // Accent edge indicator
        div(card, {
            left: "0", top: "0", width: "100%", height: "6px",
            background: opt.titleColor ?? "#FFB72B"
        });
        if (opt.title) {
            div(card, {
                left: "34px", top: "32px", fontFamily: FONT, fontSize: "38px",
                fontWeight: "800", color: opt.titleColor ?? "#FFB72B",
            }).textContent = opt.title;
        }
        return card;
    }

    // ---------- Vibrant Background Themes ----------
    const TILE_THEMES = [
        ["#FF9E3D", "#832400"], ["#00F5A0", "#064E3B"], ["#8B5CF6", "#31106A"],
        ["#F43F5E", "#68051E"], ["#0EA5E9", "#083363"], ["#FBBF24", "#713F12"],
        ["#10B981", "#064E3B"], ["#FB923C", "#7C2D12"], ["#6366F1", "#1E1B4B"],
        ["#EC4899", "#500724"], ["#84CC16", "#274807"], ["#06B6D4", "#083344"],
    ];
    function bgTile(parent, x, y, w, h, themeIdx, seed = 1) {
        const th = TILE_THEMES[themeIdx % TILE_THEMES.length];
        const t = div(parent, {
            left: x + "px", top: y + "px", width: w + "px", height: h + "px",
            borderRadius: "26px", overflow: "hidden",
            background: `linear-gradient(${135 + themeIdx * 30}deg, ${th[0]}, ${th[1]})`,
            boxShadow: "0 16px 36px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.15)"
        });
        div(t, {
            left: "0", top: "0", width: "100%", height: "100%",
            background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2), transparent 70%)"
        });
        return t;
    }

    // ---------- Glow Sparkle SVG ----------
    function sparkleSVG(parent, cx, cy, s, color = "#FFB72B") {
        const NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(NS, "svg");
        svg.setAttribute("width", s); svg.setAttribute("height", s);
        svg.style.position = "absolute";
        svg.style.left = (cx - s / 2) + "px"; svg.style.top = (cy - s / 2) + "px";
        svg.style.overflow = "visible";
        const p = document.createElementNS(NS, "path");
        const c = s / 2, a = s * 0.5, b = s * 0.12;
        p.setAttribute("d", `M ${c} ${c - a} Q ${c + b} ${c - b} ${c + a} ${c} Q ${c + b} ${c + b} ${c} ${c + a} Q ${c - b} ${c + b} ${c - a} ${c} Q ${c - b} ${c - b} ${c} ${c - a} Z`);
        p.setAttribute("fill", color);
        p.style.filter = `drop-shadow(0 0 ${s * 0.4}px ${color})`;
        svg.appendChild(p);
        parent.appendChild(svg);
        return svg;
    }

    // ---------- Glowing Morph Ring ----------
    function morphRing(parent, cx, cy, size, opt = {}) {
        return div(parent, {
            left: "0", top: "0",
            width: size + "px", height: size + "px",
            borderRadius: "50%",
            border: `${opt.w ?? 8}px solid ${opt.color ?? "#FFB72B"}`,
            boxShadow: `0 0 ${opt.glow ?? 50}px ${opt.glowColor ?? "rgba(255,183,43,0.5)"}`,
        });
    }

    // ---------- Clean Avatar ----------
    function avatar(parent, cx, cy, r, color, label) {
        const a = div(parent, {
            left: (cx - r) + "px", top: (cy - r) + "px", width: r * 2 + "px", height: r * 2 + "px",
            borderRadius: "50%", background: `linear-gradient(135deg, ${color}, #0F172A)`,
            border: "2px solid rgba(255,255,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: FONT, fontWeight: "800", fontSize: r * 0.8 + "px", color: "#FFFFFF",
            boxShadow: `0 14px 30px ${color}55`,
        });
        a.textContent = label;
        return a;
    }

    // ---------- Sleek Pointer Cursor ----------
    function cursorArrow(parent, color = "#FFFFFF") {
        const c = div(parent, { width: "0", height: "0" });
        c.innerHTML = `<svg width="56" height="56" viewBox="0 0 24 24" style="overflow:visible;filter:drop-shadow(0 8px 18px rgba(0,0,0,0.6))">
      <path d="M4 2 L20 12 L12.5 13.5 L9.5 21 Z" fill="${color}" stroke="#060914" stroke-width="1.5"/></svg>`;
        return c;
    }

    NB.ui = {
        glassCard, phoneFrame, chatBubble, counter, setCounter,
        bar, donut, clock, padlock, noteCard, bgTile,
        sparkleSVG, morphRing, avatar, cursorArrow, TILE_THEMES, FONT, MONO
    };
})();