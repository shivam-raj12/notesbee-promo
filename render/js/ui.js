/* Procedural UI components — chat bubbles, charts, clock, lock, notes, tiles.
 * All built from DOM/SVG. No screenshots, no external images.
 */
"use strict";
(function () {
  const { div } = NB;

  const FONT = "'Noto Sans','Inter',sans-serif";

  // ---------- generic panel / glass card ----------
  function glassCard(parent, x, y, w, h, opt = {}) {
    return div(parent, {
      left: x + "px", top: y + "px", width: w + "px", height: h + "px",
      borderRadius: (opt.r ?? 36) + "px",
      background: opt.bg ?? "linear-gradient(160deg, rgba(24,33,64,.92), rgba(12,18,38,.94))",
      border: `1.5px solid ${opt.border ?? "rgba(120,140,200,.22)"}`,
      boxShadow: opt.shadow ?? "0 30px 80px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06)",
      backdropFilter: "blur(8px)",
    });
  }

  // ---------- chat bubble ----------
  function chatBubble(parent, opt) {
    const mine = opt.side === "me";
    const b = div(parent, {
      maxWidth: "560px", padding: "20px 26px",
      borderRadius: "28px",
      borderBottomRightRadius: mine ? "8px" : "28px",
      borderBottomLeftRadius: mine ? "28px" : "8px",
      background: mine
        ? "linear-gradient(150deg,#0E7C66,#0A5F50)"
        : "linear-gradient(150deg,#1B2444,#141B33)",
      border: mine ? "1px solid rgba(90,220,180,.25)" : "1px solid rgba(120,140,200,.18)",
      boxShadow: "0 10px 28px rgba(0,0,0,.35)",
      fontFamily: FONT, fontSize: "30px", lineHeight: "1.35", fontWeight: "500",
      color: "#F1F5FF",
    });
    if (opt.media) {
      const m = div(b, {
        width: "300px", height: "170px", borderRadius: "16px", marginBottom: "10px",
        background: opt.media, position: "relative", overflow: "hidden",
      });
      div(m, {
        left: "120px", top: "55px", width: "60px", height: "60px", borderRadius: "50%",
        background: "rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center",
      }).innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>`;
    }
    if (opt.text) b.appendChild(Object.assign(document.createElement("div"), { textContent: opt.text }));
    const meta = div(b, {
      position: "relative", fontSize: "20px", color: "rgba(230,238,255,.55)",
      textAlign: "right", marginTop: "6px", fontWeight: "400",
    });
    meta.textContent = opt.time ?? "";
    if (mine && opt.read !== undefined) {
      const ticks = document.createElement("span");
      ticks.innerHTML = opt.read
        ? `<span style="color:#5FE0B0;font-weight:700"> ✓✓</span>`
        : `<span style="color:rgba(230,238,255,.5)"> ✓✓</span>`;
      meta.appendChild(ticks);
    }
    return b;
  }

  // ---------- animated counter ----------
  function counter(parent, x, y, opt = {}) {
    const el = div(parent, {
      left: x + "px", top: y + "px", fontFamily: FONT,
      fontSize: (opt.size ?? 92) + "px", fontWeight: "900",
      color: opt.color ?? "#fff", letterSpacing: "-2px",
      transform: "translate(-50%,-50%)", textAlign: "center",
    });
    el.__fmt = opt.fmt ?? (v => Math.round(v).toLocaleString("en-US"));
    return el;
  }
  function setCounter(el, v) { el.textContent = el.__fmt(v); }

  // ---------- bar (grows) ----------
  function bar(parent, x, y, w, h, color, opt = {}) {
    const wrap = div(parent, {
      left: x + "px", top: y + "px", width: w + "px", height: h + "px",
      borderRadius: h / 2 + "px", background: "rgba(255,255,255,.07)", overflow: "hidden",
    });
    const fill = div(wrap, {
      left: "0", top: "0", height: "100%", width: "0%",
      borderRadius: h / 2 + "px",
      background: color,
      boxShadow: `0 0 ${h}px ${opt.glow ?? "rgba(255,194,75,.35)"}`,
    });
    return { wrap, fill, set(p) { fill.style.width = (clamp01(p) * 100).toFixed(2) + "%"; } };
  }

  // ---------- donut (SVG) ----------
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
      el.style.filter = `drop-shadow(0 0 12px ${s.color}66)`;
      svg.appendChild(el);
      return el;
    });
    return {
      svg, arcs,
      set(p) {
        let acc = -0.25; // start at top
        segs.forEach((s, i) => {
          const frac = clamp01(s.frac * p);
          const gap = segs.length > 1 ? 0.03 : 0;
          arcs[i].setAttribute("stroke-dasharray", `${Math.max(0.001, (frac - gap) * circ)} ${circ}`);
          arcs[i].setAttribute("stroke-dashoffset", -acc * circ);
          acc += s.frac * p;
        });
        svg.style.opacity = p <= 0 ? 0 : 1;
      }
    };
  }

  // ---------- clock ----------
  function clock(parent, cx, cy, r) {
    const face = div(parent, {
      left: (cx - r) + "px", top: (cy - r) + "px", width: r * 2 + "px", height: r * 2 + "px",
      borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #18224A, #0A0F22 70%)",
      border: `${Math.max(6, r * 0.045)}px solid rgba(160,180,230,.35)`,
      boxShadow: "0 30px 90px rgba(0,0,0,.6), inset 0 0 60px rgba(0,0,0,.5)",
    });
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width", r * 2); svg.setAttribute("height", r * 2);
    face.appendChild(svg);
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2, big = i % 3 === 0;
      const line = document.createElementNS(NS, "line");
      const r1 = r * (big ? 0.78 : 0.85), r2 = r * 0.92;
      line.setAttribute("x1", r + Math.sin(a) * r1); line.setAttribute("y1", r - Math.cos(a) * r1);
      line.setAttribute("x2", r + Math.sin(a) * r2); line.setAttribute("y2", r - Math.cos(a) * r2);
      line.setAttribute("stroke", big ? "#C9D4F5" : "#5A6690");
      line.setAttribute("stroke-width", big ? r * 0.035 : r * 0.02);
      line.setAttribute("stroke-linecap", "round");
      svg.appendChild(line);
    }
    const mkHand = (len, w, color) => {
      const g = document.createElementNS(NS, "g");
      const l = document.createElementNS(NS, "line");
      l.setAttribute("x1", r); l.setAttribute("y1", r + r * 0.12);
      l.setAttribute("x2", r); l.setAttribute("y2", r - len);
      l.setAttribute("stroke", color); l.setAttribute("stroke-width", w);
      l.setAttribute("stroke-linecap", "round");
      g.appendChild(l); svg.appendChild(g);
      g.setAttribute("transform-origin", `${r} ${r}`);
      return g;
    };
    const hour = mkHand(r * 0.5, r * 0.055, "#E9EDFB");
    const min = mkHand(r * 0.74, r * 0.035, "#E9EDFB");
    const sec = mkHand(r * 0.82, r * 0.015, "#FFC24B");
    const cap = document.createElementNS(NS, "circle");
    cap.setAttribute("cx", r); cap.setAttribute("cy", r); cap.setAttribute("r", r * 0.05);
    cap.setAttribute("fill", "#FFC24B"); svg.appendChild(cap);
    return {
      face,
      set(h, m, s) {
        hour.setAttribute("transform", `rotate(${(h % 12) * 30 + m * 0.5} ${r} ${r})`);
        min.setAttribute("transform", `rotate(${m * 6 + s * 0.1} ${r} ${r})`);
        sec.setAttribute("transform", `rotate(${s * 6} ${r} ${r})`);
      }
    };
  }

  // ---------- padlock ----------
  function padlock(parent, cx, cy, s, color = "#FFC24B") {
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("width", s * 1.4); svg.setAttribute("height", s * 1.7);
    svg.style.position = "absolute";
    svg.style.left = (cx - s * 0.7) + "px"; svg.style.top = (cy - s * 0.85) + "px";
    svg.style.overflow = "visible";
    parent.appendChild(svg);
    const shackle = document.createElementNS(NS, "path");
    const w = s * 0.62, sw = s * 0.16;
    shackle.setAttribute("fill", "none");
    shackle.setAttribute("stroke", color); shackle.setAttribute("stroke-width", sw);
    shackle.setAttribute("stroke-linecap", "round");
    svg.appendChild(shackle);
    const body = document.createElementNS(NS, "rect");
    body.setAttribute("x", s * 0.7 - w * 0.82); body.setAttribute("y", s * 0.72);
    body.setAttribute("width", w * 1.64); body.setAttribute("height", s * 0.92);
    body.setAttribute("rx", s * 0.18);
    body.setAttribute("fill", color);
    body.style.filter = `drop-shadow(0 8px 24px ${color}55)`;
    svg.appendChild(body);
    const key = document.createElementNS(NS, "circle");
    key.setAttribute("cx", s * 0.7); key.setAttribute("cy", s * 1.08);
    key.setAttribute("r", s * 0.1); key.setAttribute("fill", "#0A0F22");
    svg.appendChild(key);
    const slot = document.createElementNS(NS, "rect");
    slot.setAttribute("x", s * 0.7 - s * 0.035); slot.setAttribute("y", s * 1.12);
    slot.setAttribute("width", s * 0.07); slot.setAttribute("height", s * 0.28);
    slot.setAttribute("rx", s * 0.03); slot.setAttribute("fill", "#0A0F22");
    svg.appendChild(slot);
    return {
      svg,
      /** p: 0=open … 1=locked */
      set(p) {
        const open = (1 - NB.clamp01(p)) * s * 0.42;
        const d = `M ${s * 0.7 - w} ${s * 0.78} V ${s * 0.42 - open}
                   A ${w} ${w} 0 0 1 ${s * 0.7 + w} ${s * 0.42 - open} V ${s * 0.78 - open * 0.4}`;
        shackle.setAttribute("d", d);
      }
    };
  }

  // ---------- note card ----------
  function noteCard(parent, x, y, w, h, opt = {}) {
    const card = glassCard(parent, x, y, w, h, { r: 30, bg: opt.bg ?? "linear-gradient(165deg,#171F3D,#0E1430)" });
    if (opt.title) {
      div(card, {
        left: "36px", top: "30px", fontFamily: FONT, fontSize: "40px",
        fontWeight: "900", color: opt.titleColor ?? "#FFC24B",
      }).textContent = opt.title;
    }
    return card;
  }

  // ---------- procedural background tile ----------
  const TILE_THEMES = [
    ["#FF9E3D", "#7A2E0E"], ["#35D0A0", "#0B3B34"], ["#8B7CFF", "#2A1B66"],
    ["#FF5C8A", "#58102E"], ["#3EB6FF", "#0B2A55"], ["#FFC24B", "#59360B"],
    ["#7CFFB2", "#0C4433"], ["#FF8A5C", "#571E08"], ["#5C9CFF", "#101F55"],
    ["#E15CFF", "#3E0B55"], ["#B6FF5C", "#2E4A08"], ["#5CF2FF", "#083F4A"],
  ];
  function bgTile(parent, x, y, w, h, themeIdx, seed = 1) {
    const th = TILE_THEMES[themeIdx % TILE_THEMES.length];
    const t = div(parent, {
      left: x + "px", top: y + "px", width: w + "px", height: h + "px",
      borderRadius: "22px", overflow: "hidden",
      background: `linear-gradient(${120 + themeIdx * 37}deg, ${th[0]}, ${th[1]})`,
      boxShadow: "0 14px 40px rgba(0,0,0,.4)",
    });
    const R = (i) => NB.rnd(seed * 31 + themeIdx * 7, i);
    for (let i = 0; i < 3; i++) {
      const bw = w * (0.3 + R(i) * 0.7);
      div(t, {
        left: (R(i + 3) * (w - bw)) + "px", top: (R(i + 6) * (h - bw)) + "px",
        width: bw + "px", height: bw + "px",
        borderRadius: R(i + 9) > 0.5 ? "50%" : "24%",
        background: `rgba(255,255,255,${0.08 + R(i + 12) * 0.14})`,
        filter: `blur(${R(i + 15) * 2}px)`,
      });
    }
    div(t, {
      left: "0", top: "0", width: "100%", height: "100%",
      background: "linear-gradient(0deg, rgba(0,0,0,.28), transparent 55%)",
    });
    return t;
  }

  // ---------- sparkle (4-point star SVG) ----------
  function sparkleSVG(parent, cx, cy, s, color = "#FFC24B") {
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
    p.style.filter = `drop-shadow(0 0 ${s * 0.25}px ${color})`;
    svg.appendChild(p);
    parent.appendChild(svg);
    return svg;
  }

  // ---------- ring (morphable: circle <-> rounded rect) ----------
  function morphRing(parent, cx, cy, size, opt = {}) {
    const el = div(parent, {
      left: "0", top: "0",
      width: size + "px", height: size + "px",
      borderRadius: "50%",
      border: `${opt.w ?? 10}px solid ${opt.color ?? "#FFC24B"}`,
      boxShadow: `0 0 ${opt.glow ?? 40}px ${opt.glowColor ?? "rgba(255,194,75,.4)"}`,
    });
    return el;
  }

  // ---------- avatar ----------
  function avatar(parent, cx, cy, r, color, label) {
    const a = div(parent, {
      left: (cx - r) + "px", top: (cy - r) + "px", width: r * 2 + "px", height: r * 2 + "px",
      borderRadius: "50%", background: `linear-gradient(150deg, ${color}, #0D1430 160%)`,
      border: "3px solid rgba(255,255,255,.25)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: FONT, fontWeight: "900", fontSize: r * 0.8 + "px", color: "#fff",
      boxShadow: `0 12px 34px ${color}66`,
    });
    a.textContent = label;
    return a;
  }

  // ---------- cursor arrow ----------
  function cursorArrow(parent, color = "#fff") {
    const c = div(parent, { width: "0", height: "0" });
    c.innerHTML = `<svg width="54" height="54" viewBox="0 0 24 24" style="overflow:visible;filter:drop-shadow(0 6px 14px rgba(0,0,0,.5))">
      <path d="M4 2 L20 12 L12.5 13.5 L9.5 21 Z" fill="${color}" stroke="#0A0F22" stroke-width="1.4"/></svg>`;
    return c;
  }

  NB.ui = { glassCard, chatBubble, counter, setCounter, bar, donut, clock, padlock, noteCard, bgTile, sparkleSVG, morphRing, avatar, cursorArrow, TILE_THEMES, FONT };
})();
