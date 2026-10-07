/* Scenes 7-14: AI notes, privacy, backgrounds, AI-suggested, collab, clean UI, reveal, CTA. */
"use strict";
(function () {
  const { E, P, tw, pulse, clamp, clamp01, lerp, rnd, div, setT, setO, ktext, kIn, kOut, Scene } = NB;
  const UI = NB.ui, label = NB.label;
  const { AMBER, HONEY, MINT, VIOLET, RED, INK, DIM } = NB.PAL;
  const FONT = UI.FONT;

  function noteStructured(card, opt = {}) {
    const t1 = div(card, { left: "44px", top: "44px", fontFamily: FONT, fontSize: "52px", fontWeight: "900", color: INK });
    t1.textContent = opt.title ?? "Team Meeting";
    const t2 = div(card, { left: "44px", top: "118px", fontFamily: FONT, fontSize: "32px", fontWeight: "700", color: AMBER });
    t2.textContent = opt.when ?? "Tomorrow · 10:00 AM";
    const items = opt.items ?? ["Project update", "Demo walkthrough", "Open questions"];
    const rows = items.map((it, i) => {
      const row = div(card, { left: "44px", top: 200 + i * 78 + "px", display: "flex", alignItems: "center" });
      div(row, { left: "0", top: "0", position: "relative", width: "30px", height: "30px", borderRadius: "50%", background: "rgba(53,208,160,.18)", border: `2px solid ${MINT}` });
      const tx = div(row, { left: "52px", top: "-2px", position: "relative", fontFamily: FONT, fontSize: "34px", fontWeight: "500", color: "#DCE3F8" });
      tx.textContent = it;
      return row;
    });
    return { title: t1, when: t2, rows };
  }

  /* ============================== S7 — AI NOTE ENHANCEMENT ============================== */
  class S7 extends Scene {
    buildContent(r) {
      this.card = UI.glassCard(r, 110, 560, 860, 660, { r: 34 });
      this.rough = div(this.card, {
        left: "44px", top: "60px", width: "780px", fontFamily: "'DejaVu Sans Mono',monospace",
        fontSize: "40px", color: DIM, lineHeight: "1.5", fontStyle: "italic",
      });
      this.rough.textContent = "meeting tomorrow at 10";
      this.struct = div(this.card, { left: "0", top: "0", width: "100%", height: "100%" });
      this.parts = noteStructured(this.struct);
      this.scan = div(this.card, {
        left: "0", top: "0", width: "100%", height: "8px", borderRadius: "4px",
        background: `linear-gradient(90deg, transparent, ${VIOLET}, transparent)`,
        boxShadow: `0 0 40px ${VIOLET}, 0 0 90px ${VIOLET}88`,
      });
      this.tag = div(this.card, {
        right: "36px", top: "36px", left: "auto", padding: "12px 26px", borderRadius: "999px",
        background: "rgba(139,124,255,.16)", border: `1.5px solid ${VIOLET}`,
        fontFamily: FONT, fontSize: "26px", fontWeight: "900", color: VIOLET, letterSpacing: "3px",
      });
      this.tag.textContent = "✦ AI ENHANCED";
      this.sparks = [0, 1, 2, 3].map(i => UI.sparkleSVG(r, 0, 0, 46 - i * 6, i % 2 ? VIOLET : AMBER));
      this.cap = label(r, "AI-POWERED NOTE ENHANCEMENT", 540, 1330, { size: 40, color: DIM, ls: 10, weight: 900 });
    }
    render(t) {
      const A = this.A, enter = tw(t, this.start, this.start + 0.5, E.outCubic);
      const out = tw(t, this.end - 0.35, this.end, E.inCubic);
      setT(this.card, 0, 0);
      this.card.style.transformOrigin = "430px 330px";
      this.card.style.transform = `scale(${0.8 + 0.2 * enter})`;
      setO(this.card, enter * (1 - out));
      // rough note first
      const scanP = tw(t, A.l19a.s + 0.1, A.l19a.s + 1.15, E.inOutCubic);
      setO(this.rough, enter * (1 - scanP));
      this.rough.style.filter = scanP > 0.02 ? `blur(${scanP * 6}px)` : "none";
      // structured content builds after scan passes
      const bp = tw(t, A.l19a.s + 0.55, A.l19a.s + 1.5, E.outCubic);
      setO(this.struct, bp);
      this.parts.rows.forEach((row, i) => {
        const rp = tw(t, A.l19a.s + 0.7 + i * 0.16, A.l19a.s + 1.0 + i * 0.16, E.outBack);
        row.style.transform = `translateX(${(1 - rp) * -40}px)`;
        setO(row, rp * bp);
      });
      setO(this.parts.title, bp); setO(this.parts.when, tw(t, A.l19a.s + 0.6, A.l19a.s + 1.0) * bp);
      // scan line
      const sy = scanP * 660;
      setT(this.scan, 0, sy);
      setO(this.scan, pulse(t, A.l19a.s + 0.1, A.l19a.s + 1.15, 0.12));
      // tag
      const tp = tw(t, A.l19a.s + 1.35, A.l19a.s + 1.8, E.outBackBig);
      this.tag.style.transform = `scale(${0.3 + 0.7 * tp})`;
      setO(this.tag, tp * (1 - out));
      // sparkles orbit card
      this.sparks.forEach((s, i) => {
        const aa = t * (0.8 + i * 0.23) + i * 2.1;
        const sx = 540 + Math.cos(aa) * (480 + i * 14);
        const syy = 890 + Math.sin(aa * 1.3) * (400 + i * 10);
        setT(s, 0, 0);
        s.style.left = sx + "px"; s.style.top = syy + "px";
        const twk = 0.5 + 0.5 * Math.sin(t * 5 + i * 1.7);
        s.style.transform = `scale(${0.4 + 0.6 * twk * enter}) rotate(${t * 40}deg)`;
        setO(s, enter * twk * (1 - out));
      });
      setO(this.cap, tw(t, A.l18.s + 0.2, A.l18.s + 0.8) * (1 - out));
    }
    fx(ctx, t) {
      NB.burst(ctx, t, 540, 890, this.A.l19a.s + 1.3, 24, { color: [VIOLET, AMBER, "#fff"], dur: 0.8, seed: 91 });
      NB.ambientDust(ctx, t, 10, 14, 0.22);
    }
  }

  /* ============================== S8 — DOUBLE-LAYER PRIVACY ============================== */
  class S8 extends Scene {
    buildContent(r) {
      this.card = UI.glassCard(r, 160, 610, 760, 560, { r: 34 });
      this.parts = noteStructured(this.card);
      this.blurCover = div(this.card, {
        left: "0", top: "0", width: "100%", height: "100%", borderRadius: "34px",
        background: "rgba(10,14,30,.35)", backdropFilter: "blur(0px)",
      });
      // two ring layers
      this.ring1 = UI.morphRing(r, 540, 890, 900, { w: 7, color: AMBER, glow: 50 });
      this.ring2 = UI.morphRing(r, 540, 890, 660, { w: 7, color: VIOLET, glow: 50, glowColor: "rgba(139,124,255,.45)" });
      this.lock1 = UI.padlock(r, 540, 890 - 450, 84, AMBER);
      this.lock2 = UI.padlock(r, 540, 890 - 330, 64, VIOLET);
      this.lab1 = label(r, "LAYER 1 · APP LOCK", 540, 260, { size: 44, color: AMBER, ls: 10, weight: 900 });
      this.lab2 = label(r, "LAYER 2 · NOTE LOCK", 540, 1380, { size: 44, color: VIOLET, ls: 10, weight: 900 });
      this.cap = label(r, "DOUBLE-LAYER PRIVACY", 540, 200, { size: 40, color: DIM, ls: 10, weight: 900 });
    }
    render(t) {
      const A = this.A;
      const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
      const out = tw(t, this.end - 0.4, this.end, E.inCubic);
      setO(this.card, enter * (1 - out));
      // layer 1
      const l1p = tw(t, A.l19b.s + 0.05, A.l19b.s + 0.75, E.outExpo);
      const r1s = 1.35 - 0.35 * l1p;
      setT(this.ring1, 540 - 450 * r1s, 890 - 450 * r1s);
      this.ring1.style.width = this.ring1.style.height = 900 * r1s + "px";
      setO(this.ring1, l1p * (1 - out));
      this.lock1.set(tw(t, A.l19b.s + 0.55, A.l19b.s + 1.0, E.outBack));
      setO(this.lock1.svg, tw(t, A.l19b.s + 0.4, A.l19b.s + 0.7) * (1 - out));
      setO(this.lab1, tw(t, A.l19b.s + 0.35, A.l19b.s + 0.8) * (1 - out));
      // layer 2
      const l2p = tw(t, A.l19b.s + 0.7, A.l19b.s + 1.4, E.outExpo);
      const r2s = 1.35 - 0.35 * l2p;
      setT(this.ring2, 540 - 330 * r2s, 890 - 330 * r2s);
      this.ring2.style.width = this.ring2.style.height = 660 * r2s + "px";
      setO(this.ring2, l2p * (1 - out));
      this.lock2.set(tw(t, A.l19b.s + 1.15, A.l19b.s + 1.55, E.outBack));
      setO(this.lock2.svg, tw(t, A.l19b.s + 1.0, A.l19b.s + 1.3) * (1 - out));
      setO(this.lab2, tw(t, A.l19b.s + 0.95, A.l19b.s + 1.4) * (1 - out));
      // content blurs as layer 2 closes
      const blur = tw(t, A.l19b.s + 1.1, A.l19b.s + 1.6);
      this.blurCover.style.backdropFilter = `blur(${blur * 14}px)`;
      this.blurCover.style.background = `rgba(10,14,30,${0.35 + blur * 0.35})`;
      setO(this.blurCover, enter * (1 - out));
      setO(this.cap, enter * (1 - out));
      // exit: rings rotate & flatten into gallery rows
      if (out > 0) {
        this.ring1.style.transform += ` scaleY(${1 - out * 0.9}) rotate(${out * 40}deg)`;
        this.ring2.style.transform += ` scaleY(${1 - out * 0.9}) rotate(${-out * 40}deg)`;
      }
    }
    fx(ctx, t) {
      NB.ambientDust(ctx, t, 8, 15, 0.2);
    }
  }

  /* ============================== S9 — 1000+ BACKGROUNDS ============================== */
  class S9 extends Scene {
    buildContent(r) {
      this.cols = [];
      for (let c = 0; c < 3; c++) {
        const col = div(r, { left: 60 + c * 330 + "px", top: "0", width: "300px", height: "1920px", overflow: "visible" });
        const tiles = [];
        for (let i = 0; i < 8; i++) {
          tiles.push(UI.bgTile(col, 0, 0, 300, 380, c * 3 + i, 100 + c * 17 + i));
        }
        this.cols.push({ el: col, tiles });
      }
      this.big = div(r, {
        left: "0", top: "0", fontFamily: FONT, fontWeight: "900", fontSize: "380px",
        color: "#fff", letterSpacing: "-10px", whiteSpace: "nowrap",
        textShadow: "0 0 90px rgba(255,194,75,.5), 0 24px 70px rgba(0,0,0,.6)",
      });
      this.big.textContent = "1000+";
      this.lab = label(r, "BACKGROUNDS", 540, 1130, { size: 64, color: AMBER, ls: 18, weight: 900 });
      this.shade = div(r, { left: "0", top: "0", width: "1080px", height: "1920px", background: "radial-gradient(90% 60% at 50% 50%, rgba(5,8,20,.78), rgba(5,8,20,.25) 70%, transparent)" });
    }
    render(t) {
      const A = this.A;
      const enter = tw(t, this.start, this.start + 0.4, E.outCubic);
      const out = tw(t, this.end - 0.35, this.end, E.inCubic);
      // fly-through: columns scroll at different speeds
      const speeds = [420, 640, 520];
      this.cols.forEach((c, ci) => {
        const scroll = (t - this.start) * speeds[ci] + ci * 140;
        c.el.style.opacity = enter * (1 - out);
        c.tiles.forEach((tile, i) => {
          let y = ((i * 420 - scroll) % (8 * 420) + 8 * 420) % (8 * 420) - 420;
          tile.style.transform = `translateY(${y}px) scale(${enter})`;
        });
      });
      setO(this.shade, enter * (1 - out));
      // 1000+ slam
      const sp = tw(t, this.start + 0.55, this.start + 1.1, E.outBackBig);
      setT(this.big, 540, 830);
      this.big.style.transform += ` translate(-50%,-50%) scale(${0.3 + 0.7 * sp})`;
      this.big.style.filter = (1 - sp) > 0.05 ? `blur(${(1 - sp) * 12}px)` : "none";
      setO(this.big, sp * (1 - out));
      setO(this.lab, tw(t, this.start + 0.9, this.start + 1.4) * (1 - out));
    }
    fx(ctx, t) { NB.ambientDust(ctx, t, 8, 16, 0.2); }
  }

  /* ============================== S10 — AI-SUGGESTED BACKGROUNDS ============================== */
  class S10 extends Scene {
    buildContent(r) {
      this.bg1 = UI.bgTile(r, 0, 0, 1080, 1920, 2, 900);
      this.bg1.style.borderRadius = "0";
      this.bg2 = UI.bgTile(r, 0, 0, 1080, 1920, 5, 950);
      this.bg2.style.borderRadius = "0";
      this.card = UI.glassCard(r, 140, 660, 800, 560, { r: 34 });
      this.parts = noteStructured(this.card, { title: "Beach trip — packing list", when: "Sunday · 9:00 AM", items: ["Sunscreen & hats", "Snacks + water", "Camera"] });
      this.tag = div(r, {
        left: "0", top: "0", padding: "14px 30px", borderRadius: "999px",
        background: "rgba(139,124,255,.2)", border: `1.5px solid ${VIOLET}`,
        fontFamily: FONT, fontSize: "28px", fontWeight: "900", color: "#CFC6FF", letterSpacing: "3px",
        whiteSpace: "nowrap",
      });
      this.tag.textContent = "✦ AI SUGGESTED";
      this.sparks = [0, 1, 2].map(i => UI.sparkleSVG(r, 0, 0, 44 - i * 8, i % 2 ? "#CFC6FF" : AMBER));
    }
    render(t) {
      const A = this.A;
      const enter = tw(t, this.start, this.start + 0.5, E.outCubic);
      const out = tw(t, this.end - 0.35, this.end, E.inCubic);
      // bg1 zooms in from grid tile feel
      const z = 0.3 + 0.7 * enter;
      this.bg1.style.transform = `scale(${z})`;
      this.bg1.style.transformOrigin = "540px 940px";
      setO(this.bg1, enter);
      // AI picks a better match: crossfade to bg2 mid-scene
      const pick = tw(t, this.start + 0.9, this.start + 1.5, E.inOutCubic);
      setO(this.bg2, pick * (1 - out));
      this.bg2.style.transform = `scale(${1.06 - 0.06 * pick})`;
      this.bg2.style.transformOrigin = "540px 940px";
      setO(this.bg1, enter * (1 - pick * 0.9) * (1 - out));
      // card
      setT(this.card, 0, 0);
      this.card.style.transform = `translateY(${(1 - enter) * 80}px)`;
      setO(this.card, enter * (1 - out));
      // tag
      const tp = tw(t, this.start + 1.0, this.start + 1.45, E.outBackBig);
      setT(this.tag, 540, 560);
      this.tag.style.transform += ` translate(-50%,-50%) scale(${0.4 + 0.6 * tp})`;
      setO(this.tag, tp * (1 - out));
      this.sparks.forEach((s, i) => {
        const aa = t * 1.2 + i * 2.4;
        s.style.left = 540 + Math.cos(aa) * 430 + "px";
        s.style.top = 940 + Math.sin(aa * 1.4) * 320 + "px";
        s.style.transform = `scale(${0.5 + 0.5 * Math.sin(t * 6 + i)})`;
        setO(s, enter * (1 - out) * (0.4 + 0.6 * Math.sin(t * 4 + i * 2) ** 2));
      });
    }
    fx(ctx, t) {
      NB.burst(ctx, t, 540, 940, this.start + 1.0, 22, { color: [VIOLET, "#CFC6FF", AMBER], dur: 0.7, seed: 95 });
    }
  }

  /* ============================== S11 — COLLABORATION ============================== */
  class S11 extends Scene {
    buildContent(r) {
      this.card = UI.glassCard(r, 140, 620, 800, 600, { r: 34 });
      this.parts = noteStructured(this.card, { title: "Shared grocery run", when: "Today · 6:00 PM", items: ["Eggs, milk, coffee", "Bread + honey", "NotesBee cookies"] });
      this.avA = UI.avatar(r, 300, 480, 56, MINT, "A");
      this.avB = UI.avatar(r, 780, 480, 56, VIOLET, "B");
      this.curA = UI.cursorArrow(r, MINT);
      this.curB = UI.cursorArrow(r, VIOLET);
      this.typeLine = div(this.card, {
        left: "44px", top: "470px", fontFamily: "'DejaVu Sans Mono',monospace",
        fontSize: "32px", color: "#DCE3F8",
      });
      this.typeLine.textContent = "";
      this.linkSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.linkSvg.setAttribute("width", "1080"); this.linkSvg.setAttribute("height", "1920");
      this.linkSvg.style.cssText = "position:absolute;left:0;top:0;overflow:visible;pointer-events:none";
      this.link = document.createElementNS("http://www.w3.org/2000/svg", "path");
      this.link.setAttribute("fill", "none"); this.link.setAttribute("stroke", "rgba(160,180,255,.5)");
      this.link.setAttribute("stroke-width", "3"); this.link.setAttribute("stroke-dasharray", "10 12");
      this.linkSvg.appendChild(this.link);
      r.appendChild(this.linkSvg);
      this.merged = div(r, {
        left: "0", top: "0", width: "150px", height: "150px", borderRadius: "50%",
        background: `linear-gradient(90deg, ${MINT} 50%, ${VIOLET} 50%)`,
        border: "3px solid rgba(255,255,255,.3)", boxShadow: "0 20px 60px rgba(139,124,255,.4)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: FONT, fontWeight: "900", fontSize: "44px", color: "#fff",
      });
      this.merged.textContent = "AB";
      this.cap = label(r, "COLLABORATION", 540, 380, { size: 44, color: DIM, ls: 14, weight: 900 });
    }
    render(t) {
      const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
      const out = tw(t, this.end - 0.35, this.end, E.inCubic);
      setT(this.card, 0, 0); setO(this.card, enter * (1 - out));
      // cursors wander over the card (deterministic Lissajous)
      const ax = 540 + Math.sin(t * 2.1) * 260, ay = 940 + Math.cos(t * 1.6) * 200;
      const bx = 540 + Math.sin(t * 1.7 + 2) * 240, by = 940 + Math.cos(t * 2.3 + 1) * 210;
      // merge near end
      const mp = tw(t, this.end - 0.85, this.end - 0.35, E.inOutCubic);
      const max = lerp(300, 540, mp), may = lerp(480, 940, mp);
      const mbx = lerp(780, 540, mp), mby = lerp(480, 940, mp);
      setT(this.avA, max - 56, may - 56); setO(this.avA, enter * (1 - mp) * (1 - out));
      setT(this.avB, mbx - 56, mby - 56); setO(this.avB, enter * (1 - mp) * (1 - out));
      setT(this.curA, lerp(ax, 540, mp), lerp(ay, 940, mp)); setO(this.curA, enter * (1 - mp) * (1 - out));
      setT(this.curB, lerp(bx, 540, mp), lerp(by, 940, mp)); setO(this.curB, enter * (1 - mp) * (1 - out));
      this.link.setAttribute("d", `M ${lerp(ax, 540, mp)} ${lerp(ay, 940, mp)} Q 540 ${Math.min(ay, by) - 160} ${lerp(bx, 540, mp)} ${lerp(by, 940, mp)}`);
      setO(this.linkSvg, enter * (1 - mp) * (1 - out) * 0.8);
      // typing
      const full = "+ add notes for the trip…";
      const n = Math.floor(clamp01((t - this.start - 0.5) / 1.6) * full.length);
      this.typeLine.textContent = full.slice(0, n);
      setO(this.typeLine, enter * (1 - mp * 0.5) * (1 - out));
      // merged symbol
      const msc = tw(t, this.end - 0.4, this.end - 0.05, E.outBack);
      setT(this.merged, 540 - 75, 940 - 75);
      this.merged.style.transform += ` scale(${0.2 + 0.8 * msc})`;
      setO(this.merged, msc * (1 - out));
      setO(this.cap, tw(t, this.start + 0.3, this.start + 0.8) * (1 - out));
    }
    fx(ctx, t) { NB.ambientDust(ctx, t, 8, 17, 0.2); }
  }

  /* ============================== S12 — CLEAN SIMPLE INTERFACE ============================== */
  class S12 extends Scene {
    buildContent(r) {
      const feats = [
        ["Notes", AMBER, "✎"], ["Chats", MINT, "◔"], ["Analytics", "#3EB6FF", "◫"],
        ["AI", VIOLET, "✦"], ["Privacy", HONEY, "⛉"],
      ];
      this.cards = feats.map(([nm, col, glyph], i) => {
        const c = UI.glassCard(r, 0, 0, 440, 300, { r: 30 });
        const g = div(c, {
          left: "0", top: "56px", width: "100%", textAlign: "center",
          fontFamily: FONT, fontSize: "96px", fontWeight: "900", color: col,
        });
        g.textContent = glyph;
        const lab = div(c, {
          left: "0", top: "196px", width: "100%", textAlign: "center",
          fontFamily: FONT, fontSize: "38px", fontWeight: "700", color: INK, letterSpacing: "2px",
        });
        lab.textContent = nm;
        return { el: c, nm };
      });
      this.onePlace = ktext(r, "EVERYTHING IN ONE PLACE.", { left: "0", top: "0", fontSize: "66px", color: INK, fontWeight: "900", letterSpacing: "4px" });
      this.cap = label(r, "a clean, simple interface", 540, 240, { size: 40, color: DIM, ls: 12 });
    }
    render(t) {
      const enter = tw(t, this.start, this.start + 0.5, E.outCubic);
      const out = tw(t, this.end - 0.45, this.end, E.inCubic);
      // grid positions: 2 cols x 3 rows (last row centered single)
      const pos = [[90, 560], [550, 560], [90, 910], [550, 910], [320, 1260]];
      const gather = tw(t, this.end - 1.0, this.end - 0.35, E.inOutCubic); // fly toward center for S13
      this.cards.forEach((c, i) => {
        const ep = tw(t, this.start + 0.1 + i * 0.12, this.start + 0.55 + i * 0.12, E.outBack);
        const gx = pos[i][0], gy = pos[i][1];
        const fromX = i % 2 ? 1080 : -440;
        let x = lerp(fromX, gx, ep), y = gy;
        let s = 0.7 + 0.3 * ep, o = ep;
        if (gather > 0) { // spiral toward center
          const ang = i * 1.05 + gather * 2.4;
          const rad = (1 - gather) * 60;
          x = lerp(x, 320 + Math.cos(ang) * rad, gather);
          y = lerp(y, 810 + Math.sin(ang) * rad, gather);
          s = lerp(s, 0.25, gather); o = 1 - gather * 0.85;
        }
        setT(c.el, x, y, { s });
        setO(c.el, o * enter);
      });
      setO(this.cap, tw(t, this.start + 0.15, this.start + 0.6) * (1 - gather) * (1 - out));
      kIn(this.onePlace.chars, t, this.start + 0.8, 0.02, 0.35, "rise");
      setT(this.onePlace.el, 540, 360); this.onePlace.el.style.transform += " translate(-50%,-50%)";
      if (gather > 0) this.onePlace.chars.forEach(ch => setO(ch, clamp01(1 - gather * 1.4)));
    }
    fx(ctx, t) { NB.ambientDust(ctx, t, 8, 18, 0.2); }
  }

  /* ============================== S13 — PRODUCT REVEAL ============================== */
  class S13 extends Scene {
    buildContent(r) {
      this.glow = div(r, {
        left: "240px", top: "590px", width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,178,64,.4), transparent 65%)", filter: "blur(28px)",
      });
      this.ring = UI.morphRing(r, 540, 890, 560, { w: 6, color: AMBER });
      this.iconWrap = div(r, { left: "0", top: "0" });
      this.icon = document.createElement("img");
      this.icon.src = "/" + this.T.assets.appIcon;
      Object.assign(this.icon.style, {
        width: "360px", height: "360px", borderRadius: "84px",
        boxShadow: "0 50px 130px rgba(255,158,61,.5)",
      });
      this.iconWrap.appendChild(this.icon);
      // orbiters: small glyphs representing features
      this.orbiters = ["◔", "◫", "✦", "⛉", "▦", "AB"].map((g, i) => {
        const col = [MINT, "#3EB6FF", VIOLET, HONEY, "#FF5C8A", "#7CFFB2"][i];
        const o = div(r, {
          left: "0", top: "0", width: "110px", height: "110px", borderRadius: "30px",
          background: "rgba(16,24,50,.9)", border: `2px solid ${col}88`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: FONT, fontSize: "48px", fontWeight: "900", color: col,
          boxShadow: `0 14px 40px ${col}44`,
        });
        o.textContent = g;
        return o;
      });
      this.word = ktext(r, "NOTESBEE", { left: "0", top: "0", fontSize: "130px", color: INK, fontWeight: "900", letterSpacing: "8px" });
      this.tagline = label(r, this.T.tagline, 540, 1370, { size: 46, color: AMBER, ls: 8, weight: 700 });
    }
    render(t) {
      const A = this.A;
      const enter = tw(t, this.start, this.start + 0.5, E.outCubic);
      const out = tw(t, this.end - 0.3, this.end, E.inCubic);
      // orbiters spiral in and collapse
      this.orbiters.forEach((o, i) => {
        const phase = i * (Math.PI * 2 / 6);
        const collapse = tw(t, this.start + 0.5 + i * 0.05, this.start + 1.35, E.inOutCubic);
        const ang = phase + t * 1.4;
        const rad = lerp(560, 0, collapse);
        const x = 540 + Math.cos(ang) * rad - 55;
        const y = 890 + Math.sin(ang) * rad * 1.25 - 55;
        setT(o, x, y, { s: lerp(1, 0.2, collapse) });
        setO(o, enter * (1 - collapse));
      });
      // icon reveal
      const ip = tw(t, this.start + 1.15, this.start + 1.9, E.outElastic);
      const is = 0.25 + 0.75 * ip;
      setT(this.iconWrap, 540 - 180 * is, 890 - 180 * is);
      this.icon.style.width = this.icon.style.height = 360 * is + "px";
      this.icon.style.borderRadius = 84 * is + "px";
      setO(this.iconWrap, ip);
      setO(this.glow, ip * (0.75 + 0.25 * Math.sin(t * 3)));
      const rp = tw(t, this.start + 1.3, this.start + 2.1, E.outCubic);
      const rs = 0.5 + 1.1 * rp;
      setT(this.ring, 540 - 280 * rs, 890 - 280 * rs);
      this.ring.style.width = this.ring.style.height = 560 * rs + "px";
      setO(this.ring, (1 - rp) * 0.9);
      kIn(this.word.chars, t, this.start + 1.7, 0.045, 0.5, "pop");
      setT(this.word.el, 540, 1240); this.word.el.style.transform += " translate(-50%,-50%)";
      setO(this.tagline, tw(t, this.start + 2.2, this.start + 2.7) * (1 - out));
      if (out > 0) this.word.chars.forEach(ch => setO(ch, 1 - out));
      setO(this.iconWrap, ip * (1 - out * 0));  // icon hands off to S14
    }
    fx(ctx, t) {
      NB.burst(ctx, t, 540, 890, this.start + 1.5, 50, { color: [AMBER, "#FFF3D6", HONEY, MINT], dur: 1.3, spMax: 700, seed: 111 });
      NB.ambientDust(ctx, t, 14, 19, 0.3);
    }
  }

  /* ============================== S14 — FINAL CTA ============================== */
  class S14 extends Scene {
    buildContent(r) {
      this.glow = div(r, {
        left: "190px", top: "190px", width: "700px", height: "700px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,178,64,.34), transparent 65%)", filter: "blur(30px)",
      });
      this.iconWrap = div(r, { left: "0", top: "0" });
      this.icon = document.createElement("img");
      this.icon.src = "/" + this.T.assets.appIcon;
      Object.assign(this.icon.style, {
        width: "330px", height: "330px", borderRadius: "78px",
        boxShadow: "0 50px 130px rgba(255,158,61,.5)",
      });
      this.iconWrap.appendChild(this.icon);
      this.word = ktext(r, "NOTESBEE", { left: "0", top: "0", fontSize: "118px", color: INK, fontWeight: "900", letterSpacing: "8px" });
      this.tagline = label(r, this.T.tagline, 540, 950, { size: 44, color: AMBER, ls: 8, weight: 700 });
      this.badge = document.createElement("img");
      this.badge.src = "/" + this.T.assets.playBadge;
      Object.assign(this.badge.style, {
        position: "absolute", left: "0", top: "0", width: "600px",
        filter: "drop-shadow(0 24px 60px rgba(0,0,0,.55))",
      });
      r.appendChild(this.badge);
      this.dl = ktext(r, "DOWNLOAD NOW", { left: "0", top: "0", fontSize: "86px", color: AMBER, fontWeight: "900", letterSpacing: "6px" });
      this.bio = div(r, {
        left: "0", top: "0", padding: "16px 44px", borderRadius: "999px",
        border: "2px solid rgba(255,255,255,.35)", fontFamily: FONT,
        fontSize: "44px", fontWeight: "700", color: INK, letterSpacing: "6px", whiteSpace: "nowrap",
      });
      this.bio.textContent = "LINK IN BIO";
    }
    render(t) {
      const A = this.A;
      const enter = tw(t, this.start, this.start + 0.6, E.outCubic);
      // gentle breathing
      const br = 1 + 0.022 * Math.sin(t * 1.8);
      const is = enter * br;
      setT(this.iconWrap, 540 - 165 * is, 470 - 165 * is);
      this.icon.style.width = this.icon.style.height = 330 * is + "px";
      this.icon.style.borderRadius = 78 * is + "px";
      setO(this.iconWrap, enter);
      setO(this.glow, enter * (0.7 + 0.3 * Math.sin(t * 2.2)));
      kIn(this.word.chars, t, this.start + 0.25, 0.04, 0.45, "rise");
      setT(this.word.el, 540, 830); this.word.el.style.transform += " translate(-50%,-50%)";
      setO(this.tagline, tw(t, this.start + 0.7, this.start + 1.2));
      // badge rises at l22
      const bp = tw(t, A.l22.s - 0.1, A.l22.s + 0.7, E.outBack);
      const bw = 600 * bp, bimg = this.badge;
      bimg.style.width = bw + "px";
      const bh = bw * (384 / 1292);
      setT(bimg, 540 - bw / 2, 1130 - bh / 2 + (1 - bp) * 120);
      setO(bimg, bp);
      kIn(this.dl.chars, t, A.l22.s + 0.25, 0.03, 0.4, "pop");
      setT(this.dl.el, 540, 1325); this.dl.el.style.transform += " translate(-50%,-50%)";
      const biop = tw(t, A.l23.s - 0.05, A.l23.s + 0.6, E.outBack);
      setT(this.bio, 540, 1625);
      this.bio.style.transform += ` translate(-50%,-50%) scale(${0.5 + 0.5 * biop})`;
      setO(this.bio, biop);
    }
    fx(ctx, t) {
      NB.ambientDust(ctx, t, 22, 21, 0.4);
    }
  }

  /* ============================== factory ============================== */
  NB.buildScenes = function (world, A, T) {
    const { S1, S2, S3 } = NB.scenes1;
    const { S4, S5, S6 } = NB.scenes2;
    const l19cMid = A.l19c.s + (A.l19c.e - A.l19c.s) * 0.55;
    const l19dMid = A.l19d.s + (A.l19d.e - A.l19d.s) * 0.52;
    const defs = [
      [S1, 0, A.l1.e + 0.55],
      [S2, A.l1.e + 0.1, A.l2.e + 0.5],
      [S3, A.l3.s - 0.35, A.l6.e + 0.72],
      [S4, A.l7.s - 0.4, A.l9.e + 0.55],
      [S5, A.l10.s - 0.3, A.l14.e + 0.75],
      [S6, A.l15.s - 0.35, A.l17.e + 0.85],
      [S7, A.l18.s - 0.35, A.l19a.e + 0.4],
      [S8, A.l19b.s - 0.32, A.l19b.e + 0.5],
      [S9, A.l19c.s - 0.28, l19cMid],
      [S10, l19cMid - 0.12, A.l19c.e + 0.35],
      [S11, A.l19d.s - 0.25, l19dMid],
      [S12, l19dMid - 0.08, A.l19d.e + 0.5],
      [S13, A.l20.s - 0.4, A.l20.e + 0.6],
      [S14, A.l21.s - 0.35, T.duration],
    ];
    return defs.map(([Cls, s, e], i) => {
      const sc = new Cls("s" + (i + 1), s, e);
      sc.A = A; sc.T = T;
      sc.build(world);
      return sc;
    });
  };
})();
