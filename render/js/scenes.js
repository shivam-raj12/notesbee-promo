/* Scenes — the 14-section continuous NotesBee story.
 * Every scene is a pure function of t. Transitions hand off visual elements
 * between sections (ring->terminal, line->chat, bubbles->charts, ring->clock,
 * lock->gallery, cards->orbit->icon).
 */
"use strict";
(function () {
  const { E, P, tw, pulse, clamp, clamp01, lerp, rnd, div, setT, setO, ktext, kIn, kOut, Scene, blurFor } = NB;
  const UI = NB.ui;
  const FONT = UI.FONT;

  const AMBER = "#FFC24B", HONEY = "#FF9E3D", MINT = "#35D0A0", VIOLET = "#8B7CFF", RED = "#FF5C5C";
  const INK = "#F4F6FF", DIM = "#8A93B2";

  function label(parent, text, x, y, opt = {}) {
    const el = div(parent, {
      left: "0", top: "0", fontFamily: FONT, fontWeight: opt.weight ?? 700,
      fontSize: (opt.size ?? 34) + "px", color: opt.color ?? DIM,
      letterSpacing: (opt.ls ?? 6) + "px", textTransform: "uppercase",
      whiteSpace: "nowrap", textAlign: "center",
    });
    el.textContent = text;
    setT(el, x, y);
    el.style.transform += " translate(-50%,-50%)";
    el.__bx = x; el.__by = y;
    return el;
  }
  function center(el) { // re-center after content set
    el.style.transform = `translate(${el.__bx}px,${el.__by}px) translate(-50%,-50%)`;
  }

  /* ============================== S1 — DAY HOOK ============================== */
  class S1 extends Scene {
    buildContent(r) {
      this.glow = div(r, {
        left: "140px", top: "330px", width: "800px", height: "800px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,178,64,.28), transparent 65%)",
        filter: "blur(30px)",
      });
      this.dayLabel = ktext(r, "DAY", {
        left: "0", top: "0", fontSize: "120px", color: INK, letterSpacing: "42px", fontWeight: "900",
      });
      this.num = div(r, {
        left: "0", top: "0", fontFamily: FONT, fontWeight: "900",
        fontSize: "430px", color: AMBER, letterSpacing: "-14px", lineHeight: "1",
        textShadow: "0 0 120px rgba(255,178,64,.55), 0 20px 60px rgba(0,0,0,.5)",
        whiteSpace: "nowrap",
      });
      this.num.textContent = String(this.T.day).padStart(2, "0");
      this.ghosts = [0, 1].map(() => {
        const g = div(r, {
          left: "0", top: "0", fontFamily: FONT, fontWeight: "900", fontSize: "430px",
          color: "rgba(255,178,64,.35)", letterSpacing: "-14px", lineHeight: "1", whiteSpace: "nowrap",
        });
        g.textContent = this.num.textContent;
        return g;
      });
      this.sub = ktext(r, "OF PROMOTING MY APP", {
        left: "0", top: "0", fontSize: "56px", color: INK, letterSpacing: "10px", fontWeight: "700",
      });
      this.ring = UI.morphRing(r, 540, 850, 850, { w: 12, color: AMBER });
      this.ring2 = UI.morphRing(r, 540, 850, 960, { w: 3, color: "rgba(255,194,75,.4)", glow: 10 });
      this.flash = div(r, { left: "0", top: "0", width: "1080px", height: "1920px", background: "#FFF8EA" });
      this.hundred = label(r, "100 DAY CHALLENGE", 540, 1380, { size: 46, color: INK, ls: 14, weight: 900 });
      this.t0 = this.A.l1.s;
    }
    render(t) {
      const t0 = this.t0;
      const slam = tw(t, t0 + 0.05, t0 + 0.62, E.outQuint);
      const s = 3.6 - 2.6 * slam;
      const blur = (1 - slam) * 26;
      setT(this.num, 540, 830); this.num.style.transform += " translate(-50%,-50%) scale(" + s + ")";
      this.num.style.filter = blur > 0.5 ? `blur(${blur}px)` : "none";
      setO(this.num, tw(t, t0, t0 + 0.25));
      this.ghosts.forEach((g, i) => {
        const gs = 3.6 - 2.6 * tw(t, t0 + 0.05 - 0.05 * (i + 1), t0 + 0.62 - 0.05 * (i + 1), E.outQuint);
        setT(g, 540, 830); g.style.transform += ` translate(-50%,-50%) scale(${gs})`;
        g.style.filter = "blur(14px)";
        setO(g, (1 - slam) * 0.5);
      });
      // impact flash
      setO(this.flash, 0.85 * pulse(t, t0 + 0.55, t0 + 0.62, 0.5));
      // glow breathing after slam
      setO(this.glow, tw(t, t0 + 0.4, t0 + 1.2) * (0.8 + 0.2 * Math.sin(t * 3)));
      // DAY label letters track in
      const dl = this.dayLabel.chars;
      for (let i = 0; i < dl.length; i++) {
        const p = tw(t, t0 + 0.15 + i * 0.07, t0 + 0.55 + i * 0.07, E.outCubic);
        setO(dl[i], p);
        dl[i].style.transform = `translateY(${(1 - E.outBack(p)) * 60}px)`;
        dl[i].style.letterSpacing = lerp(80, 42, p) + "px";
      }
      setT(this.dayLabel.el, 540, 500); this.dayLabel.el.style.transform += " translate(-50%,-50%)";
      // rings
      const rp = tw(t, t0 + 0.5, t0 + 1.3, E.outElastic);
      const rs = 0.4 + 0.6 * rp;
      setT(this.ring, 540 - 425 * rs, 850 - 425 * rs);
      this.ring.style.width = this.ring.style.height = 850 * rs + "px";
      setO(this.ring, rp);
      const r2p = tw(t, t0 + 0.7, t0 + 1.6, E.outElastic);
      const rs2 = 0.5 + 0.5 * r2p;
      setT(this.ring2, 540 - 480 * rs2, 850 - 480 * rs2);
      this.ring2.style.width = this.ring2.style.height = 960 * rs2 + "px";
      setO(this.ring2, r2p * 0.8);
      this.ring2.style.transform += ` rotate(${t * 12}deg)`;
      this.ring2.style.borderStyle = "dashed";
      // sub line
      kIn(this.sub.chars, t, t0 + 0.9, 0.028, 0.4, "rise");
      setT(this.sub.el, 540, 1250); this.sub.el.style.transform += " translate(-50%,-50%)";
      // hundred label
      setO(this.hundred, tw(t, t0 + 1.7, t0 + 2.3));
      // exit: everything scales slightly up & fades as S2 ring takes over
      const out = tw(t, this.end - 0.45, this.end, E.inCubic);
      this.root.style.opacity = 1 - out;
      this.root.style.transform = `scale(${1 + 0.12 * out})`;
      this.root.style.transformOrigin = "540px 900px";
    }
    fx(ctx, t) {
      const t0 = this.t0;
      NB.burst(ctx, t, 540, 830, t0 + 0.58, 40, { color: [AMBER, "#FFF3D6", HONEY], dur: 1.1, spMax: 700, seed: 11 });
      NB.ambientDust(ctx, t, 18, 5, 0.35);
    }
  }

  /* ============================== S2 — SOLO DEVELOPER ============================== */
  class S2 extends Scene {
    buildContent(r) {
      const cx = 540, cy = 900;
      this.term = UI.glassCard(r, cx - 430, cy - 320, 860, 640, { r: 26, bg: "linear-gradient(165deg,#0C1226,#080D1E)" });
      this.termBar = div(this.term, {
        left: "0", top: "0", width: "100%", height: "64px",
        borderBottom: "1px solid rgba(120,140,200,.15)",
      });
      ["#FF5C5C", "#FFC24B", "#35D0A0"].forEach((c, i) => div(this.termBar, {
        left: 34 + i * 44 + "px", top: "24px", width: "18px", height: "18px", borderRadius: "50%", background: c,
      }));
      const ttl = div(this.termBar, {
        left: "180px", top: "18px", fontFamily: "'DejaVu Sans Mono',monospace",
        fontSize: "24px", color: DIM,
      });
      ttl.textContent = "notesbee — zsh";
      this.code = [];
      const lines = [
        ["$ notesbee init", "#7CE38B"],
        ["▸ notes, chats, analytics…", "#8B7CFF"],
        ["▸ privacy: double-layer", "#8B7CFF"],
        ["▸ backgrounds: 1000+", "#8B7CFF"],
        ["$ notesbee build --release", "#7CE38B"],
        ["✓ build complete in 0.42s", "#FFC24B"],
      ];
      lines.forEach((ln, i) => {
        const el = div(this.term, {
          left: "46px", top: 104 + i * 62 + "px", fontFamily: "'DejaVu Sans Mono',monospace",
          fontSize: "30px", color: ln[1], whiteSpace: "nowrap",
        });
        el.textContent = ln[0];
        this.code.push(el);
      });
      this.cursor = div(this.term, {
        left: "46px", top: "104px", width: "18px", height: "34px", background: "#7CE38B",
      });
      this.iconWrap = div(r, { left: "0", top: "0" });
      this.icon = document.createElement("img");
      this.icon.src = "/" + this.T.assets.appIcon;
      Object.assign(this.icon.style, {
        width: "300px", height: "300px", borderRadius: "70px",
        boxShadow: "0 40px 110px rgba(255,158,61,.45)",
      });
      this.iconWrap.appendChild(this.icon);
      this.iconGlow = div(r, {
        left: "0", top: "0", width: "460px", height: "460px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,178,64,.4), transparent 65%)", filter: "blur(24px)",
      });
      this.cursorArrow = UI.cursorArrow(r, "#FFFFFF");
      this.cap = label(r, "built by one developer", 540, 1330, { size: 38, color: DIM, ls: 12 });
    }
    render(t) {
      const a = this.A.l2, enter = tw(t, this.start, this.start + 0.6, E.outCubic);
      const out = tw(t, this.end - 0.5, this.end, E.inCubic);
      // terminal: grows from ring-morph (scale from small circle-ish)
      const ts = 0.25 + 0.75 * enter;
      setT(this.term, 0, 0);
      this.term.style.transformOrigin = "430px 320px";
      this.term.style.transform += ` scale(${ts})`;
      this.term.style.borderRadius = lerp(430, 26, enter) + "px";
      setO(this.term, enter * (1 - out));
      // code typing
      const typeT = a.s + 0.15;
      this.code.forEach((el, i) => {
        const lt = typeT + i * 0.34;
        const full = el.textContent;
        const n = Math.floor(clamp01((t - lt) / 0.3) * full.length);
        if (!el.__full) el.__full = full;
        el.textContent = el.__full.slice(0, n);
        setO(el, t > lt ? 1 : 0.25 * enter);
      });
      // cursor follows typing lines
      const li = clamp(Math.floor((t - typeT) / 0.34), 0, 5);
      const ly = 104 + li * 62;
      setT(this.cursor, 50 + (this.code[li]?.textContent.length ?? 0) * 18.2, ly);
      setO(this.cursor, (enter * (1 - out)) * (Math.sin(t * 9) > -0.3 ? 1 : 0.15));
      // icon reveal
      const ir = tw(t, a.e - 1.7, a.e - 0.7, E.outElastic);
      const isc = 0.2 + 0.8 * ir;
      setT(this.iconWrap, 540 - 150 * isc, 900 - 150 * isc);
      this.icon.style.width = this.icon.style.height = 300 * isc + "px";
      this.icon.style.borderRadius = 70 * isc + "px";
      setO(this.iconWrap, ir * (1 - out));
      setT(this.iconGlow, 540 - 230, 900 - 230);
      setO(this.iconGlow, ir * 0.9 * (1 - out) * (0.75 + 0.25 * Math.sin(t * 4)));
      // cursor arrow flies toward bottom (handoff to S3 dot)
      const fly = tw(t, this.end - 0.55, this.end - 0.05, E.inOutCubic);
      const axp = lerp(860, 130, fly), ayp = lerp(1160, 1620, fly);
      setT(this.cursorArrow, axp, ayp, { r: -20 + 20 * fly });
      setO(this.cursorArrow, enter * (1 - out));
      setO(this.cap, tw(t, a.s + 0.6, a.s + 1.1) * (1 - out));
    }
    fx(ctx, t) {
      const ir0 = this.A.l2.e - 1.7;
      NB.burst(ctx, t, 540, 900, ir0 + 0.55, 34, { color: [AMBER, "#FFF3D6"], dur: 0.9, seed: 21 });
      NB.ambientDust(ctx, t, 14, 6, 0.3);
    }
  }

  /* ============================== S3 — 100-DAY CHALLENGE ============================== */
  class S3 extends Scene {
    buildContent(r) {
      this.cap = label(r, "the 100-day challenge", 540, 460, { size: 40, color: DIM, ls: 16 });
      this.dayBig = div(r, {
        left: "0", top: "0", fontFamily: FONT, fontWeight: "900", fontSize: "190px",
        color: INK, letterSpacing: "-4px", whiteSpace: "nowrap",
      });
      this.dayBig.innerHTML = `DAY <span style="color:${AMBER}">${String(this.T.day).padStart(2, "0")}</span><span style="color:${DIM};font-size:110px"> / ${this.T.totalDays}</span>`;
      this.track = div(r, {
        left: "90px", top: "1010px", width: "900px", height: "18px", borderRadius: "9px",
        background: "rgba(255,255,255,.08)",
      });
      this.fill = div(this.track, {
        left: "0", top: "0", height: "100%", width: "0%", borderRadius: "9px",
        background: `linear-gradient(90deg, ${HONEY}, ${AMBER})`,
        boxShadow: "0 0 26px rgba(255,178,64,.5)",
      });
      this.dot = div(r, {
        left: "0", top: "0", width: "44px", height: "44px", borderRadius: "50%",
        background: AMBER, boxShadow: "0 0 30px rgba(255,178,64,.8), 0 0 0 8px rgba(255,178,64,.2)",
      });
      this.no1 = ktext(r, "NO PAID ADS.", { left: "0", top: "0", fontSize: "96px", color: INK, fontWeight: "900", letterSpacing: "2px" });
      this.no2 = ktext(r, "NO HUGE BUDGET.", { left: "0", top: "0", fontSize: "96px", color: INK, fontWeight: "900", letterSpacing: "2px" });
      this.strike1 = div(r, { left: "0", top: "0", height: "14px", background: RED, borderRadius: "7px", transformOrigin: "0 50%" });
      this.strike2 = div(r, { left: "0", top: "0", height: "14px", background: RED, borderRadius: "7px", transformOrigin: "0 50%" });
      this.just = ktext(r, "JUST CONSISTENCY.", { left: "0", top: "0", fontSize: "78px", color: AMBER, fontWeight: "900", letterSpacing: "2px" });
      this.journey = label(r, "content · the journey", 540, 1420, { size: 40, color: DIM, ls: 8 });
      // the "journey line" that becomes the chat input bar in S4
      this.line = div(r, {
        left: "0", top: "0", height: "10px", borderRadius: "5px",
        background: `linear-gradient(90deg, ${AMBER}, ${MINT})`,
        boxShadow: "0 0 24px rgba(53,208,160,.5)", transformOrigin: "0 50%",
      });
    }
    render(t) {
      const A = this.A, out = tw(t, this.end - 0.4, this.end, E.inCubic);
      setO(this.cap, tw(t, this.start + 0.1, this.start + 0.6) * (1 - out));
      // day counter
      const dp = tw(t, A.l3.s - 0.1, A.l3.s + 0.7, E.outBack);
      setT(this.dayBig, 540, 700);
      this.dayBig.style.transform += ` translate(-50%,-50%) scale(${0.6 + 0.4 * dp})`;
      setO(this.dayBig, dp);
      // progress fill up to day%
      const fp = tw(t, A.l3.s + 0.4, A.l3.e + 0.3, E.inOutCubic);
      const frac = (this.T.day / this.T.totalDays) * fp;
      this.fill.style.width = (frac * 100).toFixed(2) + "%";
      setO(this.track, tw(t, A.l3.s + 0.2, A.l3.s + 0.6));
      setT(this.dot, 90 + 900 * frac - 22, 1019 - 22);
      const pulseS = 1 + 0.18 * Math.sin(t * 6);
      this.dot.style.transform += ` scale(${pulseS})`;
      setO(this.dot, tw(t, A.l3.s + 0.3, A.l3.s + 0.7));
      // NO PAID ADS / NO HUGE BUDGET with strikes
      const showStrike = (kt, strike, t0, y) => {
        kIn(kt.chars, t, t0, 0.024, 0.34, "pop");
        setT(kt.el, 540, y); kt.el.style.transform += " translate(-50%,-50%)";
        const sp = tw(t, t0 + 0.5, t0 + 0.85, E.outExpo);
        const w = kt.el.offsetWidth || 700;
        strike.style.width = w * 1.06 + "px";
        setT(strike, 540 - w * 0.53, y + 4, { sx: sp, sy: 1 });
        setO(strike, sp > 0 ? 1 : 0);
        kOut(kt.chars, t, t0 + 1.5, 0.014, 0.26);
        if (t > t0 + 1.5) setO(strike, 1 - tw(t, t0 + 1.55, t0 + 1.9));
      };
      showStrike(this.no1, this.strike1, A.l4.s - 0.05, 1250);
      showStrike(this.no2, this.strike2, A.l5.s - 0.05, 1250);
      // JUST CONSISTENCY
      kIn(this.just.chars, t, A.l6.s - 0.05, 0.024, 0.4, "rise");
      setT(this.just.el, 540, 1330); this.just.el.style.transform += " translate(-50%,-50%)";
      setO(this.journey, tw(t, A.l6.s + 0.5, A.l6.s + 1.0) * (1 - out));
      // journey line: grows then slides down to become chat input bar
      const grow = tw(t, A.l6.s + 0.2, A.l6.e + 0.1, E.inOutCubic);
      const slide = tw(t, this.end - 0.55, this.end - 0.05, E.inOutCubic);
      const lw = lerp(30, 940, Math.max(grow, slide));
      const lx = lerp(70, 70, 0), ly = lerp(1660, 1690, slide);
      this.line.style.width = lw + "px";
      this.line.style.height = lerp(10, 96, slide) + "px";
      this.line.style.borderRadius = lerp(5, 48, slide) + "px";
      setT(this.line, lx, ly);
      setO(this.line, tw(t, A.l6.s + 0.1, A.l6.s + 0.4));
      // fade non-line elements out
      setO(this.dayBig, dp * (1 - tw(t, this.end - 0.5, this.end - 0.1)));
      setO(this.track, 1 - tw(t, this.end - 0.5, this.end - 0.1));
      setO(this.dot, 1 - tw(t, this.end - 0.5, this.end - 0.1));
    }
    fx(ctx, t) {
      NB.ambientDust(ctx, t, 12, 8, 0.28);
    }
  }

  NB.scenes1 = { S1, S2, S3 };
  NB.PAL = { AMBER, HONEY, MINT, VIOLET, RED, INK, DIM };
  NB.label = label;
})();
