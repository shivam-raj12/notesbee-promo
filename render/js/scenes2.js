/* Scenes 4-6: chat, analytics, left-on-read. */
"use strict";
(function () {
  const { E, P, tw, pulse, clamp, clamp01, lerp, rnd, div, setT, setO, ktext, kIn, kOut, Scene } = NB;
  const UI = NB.ui, label = NB.label;
  const { AMBER, HONEY, MINT, VIOLET, RED, INK, DIM } = NB.PAL;
  const FONT = UI.FONT;

  /* ============================== S4 — NOTES + CHATS ============================== */
  class S4 extends Scene {
    buildContent(r) {
      this.panel = UI.glassCard(r, 70, 300, 940, 1260, { r: 44 });
      // header
      const hd = div(this.panel, { left: "0", top: "0", width: "100%", height: "110px", borderBottom: "1px solid rgba(120,140,200,.14)" });
      this.hdrAvatar = UI.avatar(hd, 90, 55, 34, "#3EB6FF", "A");
      const nm = div(hd, { left: "150px", top: "24px", fontFamily: FONT, fontSize: "34px", fontWeight: "700", color: INK });
      nm.textContent = "Alex";
      const on = div(hd, { left: "150px", top: "66px", fontFamily: FONT, fontSize: "24px", color: MINT });
      on.textContent = "● online";
      // input bar (matches S3 handoff line)
      this.inputBar = div(this.panel, {
        left: "40px", bottom: "40px", width: "860px", height: "96px", borderRadius: "48px",
        background: "rgba(255,255,255,.06)", border: "1.5px solid rgba(120,140,200,.2)",
        display: "flex", alignItems: "center",
      });
      const ph = div(this.inputBar, { left: "44px", top: "32px", fontFamily: FONT, fontSize: "30px", color: DIM });
      ph.textContent = "Message";
      // bubbles
      this.msgArea = div(this.panel, { left: "0", top: "120px", width: "100%", height: "1000px", overflow: "visible" });
      const B = (side, text, time, opt = {}) => ({ side, text, time, ...opt });
      this.msgs = [
        B("them", "Hey! Did you save the notes from today?", "8:41 PM"),
        B("me", "Yes! Just finished them", "8:42 PM", { read: true }),
        B("them", "", "8:43 PM", { media: "linear-gradient(130deg,#3EB6FF,#8B7CFF 60%,#FF5C8A)", mtext: "Photo" }),
        B("me", "This is perfect — saving it", "8:44 PM", { read: true }),
        B("them", "don't lose it this time!", "8:45 PM"),
        B("me", "Never. Everything lives in NotesBee now", "8:46 PM", { read: true }),
      ];
      this.bubbles = this.msgs.map(m => {
        const b = UI.chatBubble(this.msgArea, m);
        b.style.visibility = "hidden";
        return b;
      });
      // organize overlay
      this.orgLabel = label(r, "NOTES  +  IMPORTANT CHATS", 540, 560, { size: 46, color: INK, ls: 6, weight: 900 });
      this.arrow = label(r, "↓", 540, 700, { size: 90, color: AMBER, ls: 0, weight: 900 });
      this.iconWrap = div(r, { left: "0", top: "0" });
      this.icon = document.createElement("img");
      this.icon.src = "/" + this.T.assets.appIcon;
      Object.assign(this.icon.style, { width: "280px", height: "280px", borderRadius: "64px", boxShadow: "0 30px 90px rgba(255,158,61,.5)" });
      this.iconWrap.appendChild(this.icon);
      this.secRing = UI.morphRing(r, 540, 900, 420, { w: 8, color: MINT, glowColor: "rgba(53,208,160,.4)" });
      this.lock = UI.padlock(r, 540, 1210, 90, AMBER);
      this.secLabel = label(r, "SECURELY IN NOTESBEE", 540, 1330, { size: 40, color: MINT, ls: 10, weight: 900 });
    }
    render(t) {
      const A = this.A;
      const enter = tw(t, this.start, this.start + 0.5, E.outCubic);
      const clutter = tw(t, A.l8.s, A.l8.s + 1.2, E.inOutCubic) * (1 - tw(t, A.l9.s + 0.4, A.l9.s + 1.4, E.inOutCubic));
      const organize = tw(t, A.l9.s + 0.35, A.l9.e - 0.5, E.inOutCubic);
      const out = tw(t, this.end - 0.4, this.end, E.inCubic);

      // panel
      setT(this.panel, 0, 0);
      this.panel.style.transformOrigin = "470px 1290px";
      this.panel.style.transform = `scale(${0.7 + 0.3 * enter})`;
      setO(this.panel, enter);
      setO(this.inputBar, enter);

      // bubble entrance schedule
      const base = A.l7.s + 0.35;
      let yPos = [];
      let y = 10;
      this.bubbles.forEach((b, i) => {
        if (!b.__h) { b.style.visibility = "visible"; b.__h = b.offsetHeight || 90; b.__w = b.offsetWidth || 300; }
        yPos[i] = y; y += b.__h + 26;
      });
      this.bubbles.forEach((b, i) => {
        const t0 = base + i * 0.5;
        const ep = tw(t, t0, t0 + 0.45, E.outBack);
        const mine = this.msgs[i].side === "me";
        let bx = mine ? 940 - 40 - b.__w : 40;
        let by = yPos[i];
        let s = 0.4 + 0.6 * ep, o = ep;
        // clutter: seeded scatter
        if (clutter > 0.001) {
          const sx = (rnd(31, i) - 0.5) * 260 * clutter;
          const sy = (rnd(32, i) - 0.5) * 340 * clutter - 60 * clutter;
          const rr = (rnd(33, i) - 0.5) * 40 * clutter;
          bx += sx; by += sy;
          b.style.rotate = rr + "deg";
        } else b.style.rotate = "0deg";
        // organize: fly to icon
        if (organize > 0.001) {
          const k = E.inOutCubic(organize);
          bx = lerp(bx, 470 - b.__w / 2 - 400, k);
          by = lerp(by, 560 - yPos[i], k);
          s = lerp(s, 0.05, k);
          o = 1 - k;
        }
        b.style.transformOrigin = mine ? "100% 100%" : "0% 100%";
        b.style.transform = `translate(${bx}px,${by}px) scale(${s})`;
        setO(b, o);
      });

      // organize overlay
      const op = organize;
      setO(this.orgLabel, tw(t, A.l9.s + 0.9, A.l9.s + 1.4) * (1 - out));
      setO(this.arrow, tw(t, A.l9.s + 1.2, A.l9.s + 1.7) * (1 - out) * (0.7 + 0.3 * Math.sin(t * 5)));
      const is = 0.2 + 0.8 * tw(t, A.l9.s + 1.1, A.l9.e - 0.3, E.outElastic);
      setT(this.iconWrap, 540 - 140 * is, 900 - 140 * is);
      this.icon.style.width = this.icon.style.height = 280 * is + "px";
      this.icon.style.borderRadius = 64 * is + "px";
      setO(this.iconWrap, clamp01(op * 2) * (1 - out));
      const rp = tw(t, A.l9.s + 1.5, A.l9.e + 0.2, E.outElastic);
      const rr = 0.5 + 0.5 * rp;
      setT(this.secRing, 540 - 210 * rr, 900 - 210 * rr);
      this.secRing.style.width = this.secRing.style.height = 420 * rr + "px";
      setO(this.secRing, rp * (1 - out));
      this.lock.set(tw(t, A.l9.e - 0.4, A.l9.e + 0.1, E.outBack));
      setO(this.lock.svg, tw(t, A.l9.e - 0.5, A.l9.e - 0.1) * (1 - out));
      setO(this.secLabel, tw(t, A.l9.e - 0.2, A.l9.e + 0.3) * (1 - out));
      // panel fades as icon takes over
      setO(this.panel, enter * (1 - tw(t, A.l9.s + 0.9, A.l9.e - 0.4)));
    }
    fx(ctx, t) {
      const A = this.A;
      // message pop sparkles
      const base = A.l7.s + 0.35;
      for (let i = 0; i < 6; i++)
        NB.burst(ctx, t, i % 2 ? 760 : 320, 560 + i * 150, base + i * 0.5 + 0.3, 8,
          { color: MINT, dur: 0.4, spMax: 160, szMax: 4, seed: 41 + i, alpha: 0.6 });
      // organize converge burst
      NB.burst(ctx, t, 540, 900, A.l9.e - 0.5, 30, { color: [AMBER, MINT], dur: 0.8, seed: 49 });
      NB.ambientDust(ctx, t, 10, 9, 0.25);
    }
  }

  /* ============================== S5 — CHAT ANALYTICS ============================== */
  class S5 extends Scene {
    buildContent(r) {
      this.panel = UI.glassCard(r, 70, 250, 940, 1400, { r: 44 });
      this.iconMini = document.createElement("img");
      this.iconMini.src = "/" + this.T.assets.appIcon;
      Object.assign(this.iconMini.style, {
        position: "absolute", left: "50px", top: "46px", width: "76px", height: "76px", borderRadius: "20px",
      });
      this.panel.appendChild(this.iconMini);
      this.title = label(this.panel, "CHAT ANALYSIS", 540, 84, { size: 44, color: INK, ls: 12, weight: 900 });
      this.title.__bx = 470; this.title.__by = 84; // panel-relative
      this.phase = label(this.panel, "MESSAGES", 470, 220, { size: 74, color: AMBER, ls: 8, weight: 900 });
      this.phase.__bx = 470; this.phase.__by = 220;
      // bars phase
      this.barPhase = div(this.panel, { left: "0", top: "0" });
      this.bars = [
        { who: "YOU", val: 482, color: `linear-gradient(90deg,#0E7C66,${MINT})`, y: 420 },
        { who: "ALEX", val: 731, color: `linear-gradient(90deg,${HONEY},${AMBER})`, y: 640 },
      ].map(cfg => {
        const lab = label(this.barPhase, cfg.who, 140, cfg.y - 64, { size: 34, color: DIM, ls: 8 });
        const bb = UI.bar(this.barPhase, 90, cfg.y, 760, 74, cfg.color);
        const cnt = UI.counter(this.barPhase, 0, 0, { size: 80, color: INK });
        return { ...cfg, ...bb, cnt, lab };
      });
      // donut phase
      this.donutPhase = div(this.panel, { left: "0", top: "0" });
      this.donut = UI.donut(this.donutPhase, 470, 640, 300, 56, [
        { frac: 4823 / 12114, color: MINT }, { frac: 7291 / 12114, color: AMBER },
      ]);
      this.dLeg = [
        { who: "YOU", val: 4823, color: MINT, y: 1080 },
        { who: "ALEX", val: 7291, color: AMBER, y: 1210 },
      ].map(cfg => {
        const chip = div(this.donutPhase, { left: "150px", top: cfg.y - 14 + "px", width: "28px", height: "28px", borderRadius: "8px", background: cfg.color });
        const lab = label(this.donutPhase, cfg.who, 300, cfg.y, { size: 34, color: DIM, ls: 4 });
        const cnt = UI.counter(this.donutPhase, 620, cfg.y, { size: 62, color: INK });
        cnt.style.transform = "translate(0,-50%)";
        return { ...cfg, cnt, lab, chip };
      });
      this.dCenter = UI.counter(this.donutPhase, 470, 620, { size: 76, color: INK });
      this.dCenterLab = label(this.donutPhase, "WORDS TOTAL", 470, 710, { size: 28, color: DIM, ls: 6 });
      this.dCenterLab.style.transform = "translate(-50%,-50%)";
      // media phase
      this.mediaPhase = div(this.panel, { left: "0", top: "0" });
      this.orbs = [
        { who: "YOU", val: 84, color: MINT, x: 300 },
        { who: "ALEX", val: 137, color: AMBER, x: 640 },
      ].map(cfg => {
        const orb = div(this.mediaPhase, {
          left: "0", top: "0", borderRadius: "50%",
          background: `radial-gradient(circle at 32% 28%, ${cfg.color}, #0B1026 130%)`,
          boxShadow: `0 20px 70px ${cfg.color}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
        });
        const cnt = UI.counter(orb, 0, 0, { size: 78, color: "#fff" });
        cnt.style.left = "50%"; cnt.style.top = "50%"; cnt.style.transform = "translate(-50%,-58%)";
        const lab = label(this.mediaPhase, cfg.who, cfg.x, 1000, { size: 36, color: DIM, ls: 8 });
        lab.__bx = cfg.x; lab.__by = 1000;
        return { ...cfg, orb, cnt, lab };
      });
      this.vs = label(this.mediaPhase, "VS", 470, 640, { size: 54, color: DIM, ls: 4, weight: 900 });
      this.vs.__bx = 470; this.vs.__by = 640;
    }
    render(t) {
      const A = this.A;
      const enter = tw(t, this.start, this.start + 0.55, E.outCubic);
      const out = tw(t, this.end - 0.55, this.end - 0.1, E.inCubic);
      setT(this.panel, 0, 0);
      this.panel.style.transformOrigin = "470px 700px";
      this.panel.style.transform = `scale(${0.75 + 0.25 * enter})`;
      setO(this.panel, enter * (1 - out));
      setO(this.title, enter);
      setO(this.iconMini, enter);

      // phase windows
      const wMsg = [A.l11.s + 0.6, A.l12.e + 0.7];
      const wWord = [A.l13.s - 0.35, A.l13.e + 0.7];
      const wMed = [A.l14.s - 0.35, this.end - 0.5];
      const inWin = (w, fade = 0.35) => pulse(t, w[0], w[1], Math.min(0.45, fade / (w[1] - w[0])));

      // phase title swap
      const ph = t < wWord[0] ? "MESSAGES" : t < wMed[0] ? "WORDS" : "MEDIA";
      if (this.phase.textContent !== ph) this.phase.textContent = ph;
      setO(this.phase, 0.35 + 0.65 * Math.max(inWin(wMsg), inWin(wWord), inWin(wMed)));
      setT(this.phase, 470, 220); this.phase.style.transform += " translate(-50%,-50%)";
      setT(this.title, 470, 84); this.title.style.transform += " translate(-50%,-50%)";

      // MESSAGES bars
      const pm = inWin(wMsg);
      setO(this.barPhase, pm);
      if (pm > 0) {
        const trackP = tw(t, wMsg[0], wMsg[0] + 0.6, E.outCubic);
        const cp = tw(t, A.l12.s - 0.15, A.l12.e + 0.4, E.outQuart);
        this.bars.forEach(b => {
          b.wrap.style.opacity = trackP;
          b.set(Math.max(cp * b.val / 760, trackP * 0.02));
          UI.setCounter(b.cnt, b.val * cp);
          setT(b.cnt, 890, b.y + 37); b.cnt.style.transform += " translate(-50%,-50%)";
        });
      }
      // WORDS donut
      const pw = inWin(wWord);
      setO(this.donutPhase, pw);
      if (pw > 0) {
        const cp = tw(t, A.l13.s - 0.1, A.l13.e + 0.35, E.outQuart);
        this.donut.set(cp);
        this.dLeg.forEach(d => UI.setCounter(d.cnt, d.val * cp));
        UI.setCounter(this.dCenter, 12114 * cp);
        setO(this.dCenter, pw); setO(this.dCenterLab, pw);
        this.dLeg.forEach(d => { setO(d.cnt, pw); setO(d.lab, pw); setO(d.chip, pw); });
      }
      // MEDIA orbs
      const pd = inWin(wMed);
      setO(this.mediaPhase, pd);
      if (pd > 0) {
        const cp = tw(t, A.l14.s - 0.1, A.l14.e + 0.35, E.outBack);
        this.orbs.forEach(o => {
          const R = (140 + o.val * 1.1) * cp;
          o.orb.style.width = o.orb.style.height = R * 2 + "px";
          setT(o.orb, o.x - R, 640 - R);
          UI.setCounter(o.cnt, o.val * clamp01(cp));
        });
        setO(this.vs, pd);
      }
    }
    fx(ctx, t) {
      const A = this.A;
      // particles streaming into the dashboard at entry
      const t0 = this.start + 0.1;
      const p = P(t, t0, t0 + 1.0);
      if (p > 0 && p < 1) {
        for (let i = 0; i < 26; i++) {
          const sx = 200 + rnd(61, i) * 680, sy = -40;
          const kk = E.inOutCubic(clamp01(p * 1.4 - rnd(62, i) * 0.4));
          const x = lerp(sx, 540, kk), y = lerp(sy, 480 + rnd(63, i) * 500, kk);
          ctx.globalAlpha = (1 - kk) * 0.8 + 0.1;
          ctx.fillStyle = i % 2 ? MINT : AMBER;
          ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      NB.ambientDust(ctx, t, 8, 12, 0.22);
    }
  }

  /* ============================== S6 — LEFT ON READ ============================== */
  class S6 extends Scene {
    buildContent(r) {
      this.dimAll = div(r, { left: "0", top: "0", width: "1080px", height: "1920px", background: "#03050E" });
      this.panel = UI.glassCard(r, 130, 330, 820, 560, { r: 40 });
      const hd = div(this.panel, { left: "0", top: "0", width: "100%", height: "100px", borderBottom: "1px solid rgba(120,140,200,.14)" });
      UI.avatar(hd, 82, 50, 30, "#3EB6FF", "A");
      const nm = div(hd, { left: "132px", top: "22px", fontFamily: FONT, fontSize: "32px", fontWeight: "700", color: INK });
      nm.textContent = "Alex";
      this.bubble = UI.chatBubble(this.panel, { side: "me", text: "Hey! Are you coming?", time: "8:41 PM", read: true });
      this.bubble.style.left = "180px"; this.bubble.style.top = "160px";
      this.readTag = label(this.panel, "READ", 660, 315, { size: 30, color: MINT, ls: 6, weight: 900 });
      this.clock = UI.clock(r, 540, 1050, 250);
      this.digi = div(r, {
        left: "0", top: "0", fontFamily: "'DejaVu Sans Mono',monospace", fontSize: "64px",
        fontWeight: "700", color: INK, letterSpacing: "4px", whiteSpace: "nowrap",
      });
      this.digi.textContent = "8:41 PM";
      this.flash = div(r, { left: "0", top: "0", width: "1080px", height: "1920px", background: "#FFFFFF" });
      this.noMore = ktext(r, "NO MORE GUESSING.", { left: "0", top: "0", fontSize: "74px", color: INK, fontWeight: "900", letterSpacing: "0px" });
      this.decide = ktext(r, "LET THE DATA DECIDE.", { left: "0", top: "0", fontSize: "64px", color: AMBER, fontWeight: "900", letterSpacing: "0px" });
      this.decideGlow = div(r, {
        left: "140px", top: "700px", width: "800px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,178,64,.32), transparent 65%)", filter: "blur(30px)",
      });
    }
    render(t) {
      const A = this.A;
      const enter = tw(t, this.start + 0.4, this.start + 1.0, E.outCubic);
      // clock time schedule (mirrored in mix.py for ticking sfx)
      const T0 = A.l15.s + 0.6;
      const steps = [[0.0, 20, 41], [0.8, 21, 2], [1.5, 22, 17], [2.1, 23, 48]];
      const spinStart = T0 + 2.6, freeze = A.l16.s - 0.12;
      // panel + bubble
      const chatGone = tw(t, T0 - 0.1, T0 + 0.5, E.inCubic);
      setT(this.panel, 0, 0);
      this.panel.style.transformOrigin = "410px 280px";
      this.panel.style.transform = `translateY(${(1 - enter) * 160}px) scale(${(0.8 + 0.2 * enter) * (1 - 0.15 * chatGone)})`;
      setO(this.panel, enter * (1 - chatGone));
      setO(this.readTag, tw(t, T0 - 0.5, T0 - 0.1) * (1 - chatGone) * (Math.sin(t * 4) > -0.6 ? 1 : 0.5));
      // clock + accelerating time
      const cp = tw(t, T0 + 0.1, T0 + 0.8, E.outBack);
      let h = 20, m = 41, sec = 0;
      let clockBlur = 0, frozen = t >= freeze;
      if (t < spinStart) {
        for (const [dt, hh, mm] of steps) if (t >= T0 + dt) { h = hh; m = mm; }
        sec = (t * 4) % 60;
      } else if (!frozen) {
        const sp = (t - spinStart);
        sec = (t * 4 + sp * sp * 90) % 60;
        m = (48 + sp * sp * 160) % 60;
        h = 23;
        clockBlur = Math.min(10, sp * sp * 14);
      } else { h = 23; m = 48; sec = 17; clockBlur = 0; }
      this.clock.set(h, m, sec);
      this.clock.face.style.filter = clockBlur > 0.4 ? `blur(${clockBlur * 0.4}px)` : "none";
      this.clock.face.style.transform = `scale(${0.5 + 0.5 * cp})`;
      this.clock.face.style.transformOrigin = "260px 260px";
      setO(this.clock.face, cp * (1 - tw(t, freeze + 0.05, freeze + 0.4)));
      const digiTxt = `${((h - 1) % 12) + 1}:${String(Math.floor(m)).padStart(2, "0")} PM`;
      if (this.digi.textContent !== digiTxt) this.digi.textContent = digiTxt;
      setT(this.digi, 540, 1390); this.digi.style.transform += " translate(-50%,-50%)";
      setO(this.digi, cp * (1 - tw(t, freeze + 0.05, freeze + 0.35)));
      // tension dim + shake handled by camera; freeze flash
      setO(this.dimAll, 0.45 * cp * (1 - tw(t, freeze, freeze + 0.3)));
      setO(this.flash, pulse(t, freeze, freeze + 0.22, 0.5) * 0.9);
      // NO MORE GUESSING
      kIn(this.noMore.chars, t, A.l16.s + 0.02, 0.02, 0.4, "slam");
      setT(this.noMore.el, 540, 780); this.noMore.el.style.transform += " translate(-50%,-50%)";
      kOut(this.noMore.chars, t, A.l16.e + 0.25, 0.012, 0.25);
      // LET THE DATA DECIDE
      kIn(this.decide.chars, t, A.l17.s + 0.02, 0.024, 0.45, "slam");
      setT(this.decide.el, 540, 980); this.decide.el.style.transform += " translate(-50%,-50%)";
      setO(this.decideGlow, tw(t, A.l17.s + 0.2, A.l17.s + 0.9) * (0.8 + 0.2 * Math.sin(t * 3)));
      // exit scatter
      const out = tw(t, this.end - 0.5, this.end, E.inCubic);
      if (out > 0) {
        this.decide.chars.forEach((c, i) => {
          c.style.transform = `translateY(${-260 * E.inCubic(out) * (0.6 + rnd(71, i))}px) rotate(${(rnd(72, i) - 0.5) * 90 * out}deg)`;
          c.style.filter = `blur(${out * 8}px)`;
          setO(c, 1 - out);
        });
        setO(this.decideGlow, 1 - out);
      }
    }
    fx(ctx, t) {
      const A = this.A;
      NB.burst(ctx, t, 540, 980, A.l17.s + 0.25, 46, { color: [AMBER, "#FFF3D6", HONEY], dur: 1.2, spMax: 640, seed: 77 });
      NB.ambientDust(ctx, t, 10, 13, 0.2);
    }
  }

  NB.scenes2 = { S4, S5, S6 };
})();
