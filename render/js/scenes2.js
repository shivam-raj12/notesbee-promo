/* Scenes 4-6 — Interactive Messenger, Bento Analytics & Left-on-Read Drama
 * S4: WhatsApp-style sleek conversation floating into encrypted storage.
 * S5: Bento-Grid Chat Analytics with live glowing bar meters & donut chart.
 * S6: Cinematic "Left on Read" clock tension moment with high-impact reveal.
 */
"use strict";
(function () {
    const { E, P, tw, pulse, clamp, clamp01, lerp, rnd, div, setT, setO, ktext, kIn, kOut, Scene } = NB;
    const UI = NB.ui, label = NB.label;
    const { AMBER, HONEY, MINT, VIOLET, RED, INK, DIM } = NB.PAL;
    const FONT = UI.FONT;
    const MONO = UI.MONO;

    /* ============================== S4 — NOTES + CHATS ============================== */
    class S4 extends Scene {
        buildContent(r) {
            // Main Chat Window Frame
            this.panel = UI.glassCard(r, 60, 260, 960, 1320, {
                r: 48,
                bg: "linear-gradient(160deg, rgba(20, 28, 55, 0.94), rgba(9, 13, 28, 0.98))",
                border: "rgba(255, 255, 255, 0.14)",
                shadow: "0 35px 90px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.2)"
            });

            // Chat Header
            const hd = div(this.panel, {
                left: "0", top: "0", width: "100%", height: "130px",
                background: "rgba(255,255,255,0.03)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                display: "flex", alignItems: "center"
            });
            this.hdrAvatar = UI.avatar(hd, 96, 65, 38, "#3B82F6", "A");

            const infoWrap = div(hd, { left: "160px", top: "28px" });
            const nm = div(infoWrap, { fontFamily: FONT, fontSize: "36px", fontWeight: "800", color: INK });
            nm.textContent = "Alex Morgan";
            const on = div(infoWrap, {
                fontFamily: FONT, fontSize: "22px", color: MINT, fontWeight: "600",
                marginTop: "4px", display: "flex", alignItems: "center"
            });
            on.innerHTML = `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${MINT};margin-right:8px;box-shadow:0 0 10px ${MINT}"></span>Online`;

            // Input Bar
            this.inputBar = div(this.panel, {
                left: "34px", bottom: "34px", width: "892px", height: "100px", borderRadius: "50px",
                background: "rgba(255, 255, 255, 0.06)", border: "1px solid rgba(255, 255, 255, 0.15)",
                display: "flex", alignItems: "center", padding: "0 36px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
            });
            const ph = div(this.inputBar, { fontFamily: FONT, fontSize: "28px", color: DIM });
            ph.textContent = "Save to NotesBee...";

            // Floating Chat Messages
            this.msgArea = div(this.panel, { left: "0", top: "140px", width: "100%", height: "1020px", overflow: "visible" });
            const B = (side, text, time, opt = {}) => ({ side, text, time, ...opt });
            this.msgs = [
                B("them", "Hey! Did you save today's meeting notes?", "8:41 PM"),
                B("me", "Yes! Just polished and organized them 🔥", "8:42 PM", { read: true }),
                B("them", "", "8:43 PM", { media: "linear-gradient(135deg, #06B6D4, #3B82F6 50%, #EC4899)", mtext: "Photo" }),
                B("me", "Saved! Backing this up right now.", "8:44 PM", { read: true }),
                B("them", "Don't let these get lost in old chats again!", "8:45 PM"),
                B("me", "Never. Everything is archived in NotesBee now ✨", "8:46 PM", { read: true }),
            ];

            this.bubbles = this.msgs.map(m => {
                const b = UI.chatBubble(this.msgArea, m);
                b.style.visibility = "hidden";
                return b;
            });

            // Organize / Vault Conversion Overlay
            this.orgBadge = div(r, {
                left: "540px", top: "520px", padding: "12px 34px", borderRadius: "40px",
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(12px)", transform: "translate(-50%, -50%)"
            });
            const orgTxt = div(this.orgBadge, {
                fontFamily: FONT, fontSize: "30px", fontWeight: "800", color: INK,
                letterSpacing: "6px", textTransform: "uppercase"
            });
            orgTxt.textContent = "NOTES + ENCRYPTED CHATS";

            this.arrow = label(r, "↓", 540, 680, { size: 90, color: AMBER, ls: 0, weight: 900 });

            // App Vault Lock Center
            this.iconWrap = div(r, { left: "0", top: "0" });
            this.icon = document.createElement("img");
            this.icon.src = "/" + this.T.assets.appIcon;
            Object.assign(this.icon.style, {
                width: "300px", height: "300px", borderRadius: "70px",
                boxShadow: "0 35px 100px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.2)"
            });
            this.iconWrap.appendChild(this.icon);

            this.secRing = UI.morphRing(r, 540, 900, 440, { w: 8, color: MINT, glowColor: "rgba(0,245,160,0.5)" });
            this.lock = UI.padlock(r, 540, 1220, 96, AMBER);
            this.secLabel = label(r, "SECURE CLOUD VAULT", 540, 1350, { size: 40, color: MINT, ls: 10, weight: 800 });
        }

        render(t) {
            const A = this.A;
            const enter = tw(t, this.start, this.start + 0.55, E.outCubic);
            const clutter = tw(t, A.l8.s, A.l8.s + 1.2, E.inOutCubic) * (1 - tw(t, A.l9.s + 0.4, A.l9.s + 1.4, E.inOutCubic));
            const organize = tw(t, A.l9.s + 0.35, A.l9.e - 0.5, E.inOutCubic);
            const out = tw(t, this.end - 0.4, this.end, E.inCubic);

            // Panel entry
            setT(this.panel, 0, 0);
            this.panel.style.transformOrigin = "480px 1290px";
            this.panel.style.transform = `scale(${0.72 + 0.28 * enter})`;
            setO(this.panel, enter);
            setO(this.inputBar, enter);

            // Bubble cascade
            const base = A.l7.s + 0.32;
            let yPos = [];
            let y = 14;
            this.bubbles.forEach((b, i) => {
                if (!b.__h) { b.style.visibility = "visible"; b.__h = b.offsetHeight || 96; b.__w = b.offsetWidth || 320; }
                yPos[i] = y;
                y += b.__h + 24;
            });

            this.bubbles.forEach((b, i) => {
                const t0 = base + i * 0.48;
                const ep = tw(t, t0, t0 + 0.45, E.outBack);
                const mine = this.msgs[i].side === "me";
                let bx = mine ? 960 - 46 - b.__w : 46;
                let by = yPos[i];
                let s = 0.4 + 0.6 * ep, o = ep;

                // Visual clutter / overflow
                if (clutter > 0.001) {
                    const sx = (rnd(31, i) - 0.5) * 220 * clutter;
                    const sy = (rnd(32, i) - 0.5) * 300 * clutter - 40 * clutter;
                    const rr = (rnd(33, i) - 0.5) * 30 * clutter;
                    bx += sx; by += sy;
                    b.style.rotate = rr + "deg";
                } else b.style.rotate = "0deg";

                // Suction animation into vault icon
                if (organize > 0.001) {
                    const k = E.inOutCubic(organize);
                    bx = lerp(bx, 480 - b.__w / 2, k);
                    by = lerp(by, 580 - yPos[i], k);
                    s = lerp(s, 0.04, k);
                    o = 1 - k;
                }

                b.style.transformOrigin = mine ? "100% 100%" : "0% 100%";
                b.style.transform = `translate(${bx}px,${by}px) scale(${s})`;
                setO(b, o);
            });

            // Vault Lock Sequence
            setO(this.orgBadge, tw(t, A.l9.s + 0.85, A.l9.s + 1.3) * (1 - out));
            setO(this.arrow, tw(t, A.l9.s + 1.1, A.l9.s + 1.6) * (1 - out) * (0.8 + 0.2 * Math.sin(t * 5)));

            const is = 0.2 + 0.8 * tw(t, A.l9.s + 1.05, A.l9.e - 0.3, E.outElastic);
            setT(this.iconWrap, 540 - 150 * is, 900 - 150 * is);
            this.icon.style.width = this.icon.style.height = (300 * is) + "px";
            this.icon.style.borderRadius = (70 * is) + "px";
            setO(this.iconWrap, clamp01(organize * 2) * (1 - out));

            const rp = tw(t, A.l9.s + 1.45, A.l9.e + 0.2, E.outElastic);
            const rr = 0.5 + 0.5 * rp;
            setT(this.secRing, 540 - 220 * rr, 900 - 220 * rr);
            this.secRing.style.width = this.secRing.style.height = (440 * rr) + "px";
            setO(this.secRing, rp * (1 - out));

            this.lock.set(tw(t, A.l9.e - 0.4, A.l9.e + 0.1, E.outBack));
            setO(this.lock.svg, tw(t, A.l9.e - 0.45, A.l9.e - 0.05) * (1 - out));
            setO(this.secLabel, tw(t, A.l9.e - 0.2, A.l9.e + 0.3) * (1 - out));

            setO(this.panel, enter * (1 - tw(t, A.l9.s + 0.85, A.l9.e - 0.35)));
        }

        fx(ctx, t) {
            const A = this.A;
            const base = A.l7.s + 0.32;
            for (let i = 0; i < 6; i++) {
                NB.burst(ctx, t, i % 2 ? 780 : 300, 520 + i * 150, base + i * 0.48 + 0.3, 10,
                    { color: MINT, dur: 0.4, spMax: 170, szMax: 4, seed: 41 + i, alpha: 0.7 });
            }
            NB.burst(ctx, t, 540, 900, A.l9.e - 0.45, 34, { color: [AMBER, MINT, "#FFFFFF"], dur: 0.85, seed: 50 });
            NB.ambientDust(ctx, t, 10, 9, 0.25);
        }
    }

    /* ============================== S5 — BENTO CHAT ANALYTICS ============================== */
    class S5 extends Scene {
        buildContent(r) {
            // Main Dashboard Container
            this.panel = UI.glassCard(r, 60, 240, 960, 1440, {
                r: 48,
                bg: "linear-gradient(155deg, rgba(22, 30, 58, 0.94), rgba(11, 16, 34, 0.98))",
                border: "rgba(255, 255, 255, 0.16)",
                shadow: "0 35px 90px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2)"
            });

            // Top Title Bar
            const header = div(this.panel, {
                left: "40px", top: "40px", width: "880px", height: "90px",
                display: "flex", alignItems: "center", justifyContent: "space-between"
            });

            const leftHead = div(header, { display: "flex", alignItems: "center" });
            this.iconMini = document.createElement("img");
            this.iconMini.src = "/" + this.T.assets.appIcon;
            Object.assign(this.iconMini.style, { width: "68px", height: "68px", borderRadius: "18px", marginRight: "20px" });
            leftHead.appendChild(this.iconMini);

            const titleTxt = div(leftHead, {
                fontFamily: FONT, fontSize: "36px", fontWeight: "800", color: INK, letterSpacing: "1px"
            });
            titleTxt.textContent = "Chat Analytics";

            this.phase = div(header, {
                padding: "8px 24px", borderRadius: "24px",
                background: "rgba(255, 183, 43, 0.15)", border: `1px solid ${AMBER}`,
                fontFamily: FONT, fontSize: "24px", fontWeight: "800", color: AMBER,
                letterSpacing: "4px", textTransform: "uppercase"
            });
            this.phase.textContent = "MESSAGES";

            // --- Phase 1: Messages Bento Bars ---
            this.barPhase = div(this.panel, { left: "0", top: "180px", width: "100%", height: "1200px" });
            this.bars = [
                { who: "YOU", val: 482, color: `linear-gradient(90deg, #059669, ${MINT})`, y: 160 },
                { who: "ALEX", val: 731, color: `linear-gradient(90deg, ${HONEY}, ${AMBER})`, y: 440 },
            ].map(cfg => {
                const card = UI.glassCard(this.barPhase, 40, cfg.y, 880, 220, {
                    r: 32, bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)"
                });
                const lab = div(card, {
                    left: "40px", top: "34px", fontFamily: FONT, fontSize: "30px", fontWeight: "700",
                    color: DIM, letterSpacing: "6px"
                });
                lab.textContent = cfg.who;

                const cnt = UI.counter(card, 780, 48, { size: 54, color: INK, glow: "rgba(255,255,255,0.2)" });
                cnt.style.transform = "translate(-100%, 0)";

                const bb = UI.bar(card, 40, 110, 800, 60, cfg.color);
                return { ...cfg, ...bb, cnt, lab, card };
            });

            // --- Phase 2: Words Donut Bento ---
            this.donutPhase = div(this.panel, { left: "0", top: "180px", width: "100%", height: "1200px" });
            this.donut = UI.donut(this.donutPhase, 480, 460, 270, 52, [
                { frac: 4823 / 12114, color: MINT }, { frac: 7291 / 12114, color: AMBER },
            ]);
            this.dCenter = UI.counter(this.donutPhase, 480, 435, { size: 74, color: INK });
            this.dCenterLab = label(this.donutPhase, "WORDS EXCHANGED", 480, 525, { size: 26, color: DIM, ls: 6 });

            this.dLeg = [
                { who: "YOU (WORDS)", val: 4823, color: MINT, y: 880 },
                { who: "ALEX (WORDS)", val: 7291, color: AMBER, y: 1020 },
            ].map(cfg => {
                const card = UI.glassCard(this.donutPhase, 40, cfg.y, 880, 110, {
                    r: 28, bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)"
                });
                const chip = div(card, { left: "36px", top: "40px", width: "30px", height: "30px", borderRadius: "10px", background: cfg.color, boxShadow: `0 0 16px ${cfg.color}` });
                const lab = div(card, { left: "84px", top: "38px", fontFamily: FONT, fontSize: "28px", fontWeight: "700", color: DIM, letterSpacing: "4px" });
                lab.textContent = cfg.who;
                const cnt = UI.counter(card, 820, 55, { size: 48, color: INK });
                cnt.style.transform = "translate(-100%, -50%)";
                return { ...cfg, cnt, lab, chip, card };
            });

            // --- Phase 3: Media Shared Clash ---
            this.mediaPhase = div(this.panel, { left: "0", top: "180px", width: "100%", height: "1200px" });
            this.orbs = [
                { who: "YOU", val: 84, color: MINT, x: 290 },
                { who: "ALEX", val: 137, color: AMBER, x: 670 },
            ].map(cfg => {
                const orb = div(this.mediaPhase, {
                    left: "0", top: "0", borderRadius: "50%",
                    background: `radial-gradient(circle at 35% 30%, ${cfg.color}, #080D20 120%)`,
                    boxShadow: `0 24px 80px ${cfg.color}66`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid rgba(255,255,255,0.3)"
                });
                const cnt = UI.counter(orb, 0, 0, { size: 76, color: "#FFFFFF" });
                cnt.style.left = "50%"; cnt.style.top = "50%"; cnt.style.transform = "translate(-50%,-56%)";
                const lab = label(this.mediaPhase, cfg.who, cfg.x, 860, { size: 36, color: DIM, ls: 8, weight: 800 });
                lab.__bx = cfg.x; lab.__by = 860;
                return { ...cfg, orb, cnt, lab };
            });
            this.vs = label(this.mediaPhase, "VS", 480, 530, { size: 58, color: INK, ls: 6, weight: 900 });
            this.vs.__bx = 480; this.vs.__by = 530;
        }

        render(t) {
            const A = this.A;
            const enter = tw(t, this.start, this.start + 0.55, E.outCubic);
            const out = tw(t, this.end - 0.55, this.end - 0.1, E.inCubic);

            setT(this.panel, 0, 0);
            this.panel.style.transformOrigin = "480px 720px";
            this.panel.style.transform = `scale(${0.78 + 0.22 * enter})`;
            setO(this.panel, enter * (1 - out));

            const wMsg = [A.l11.s + 0.6, A.l12.e + 0.7];
            const wWord = [A.l13.s - 0.35, A.l13.e + 0.7];
            const wMed = [A.l14.s - 0.35, this.end - 0.5];
            const inWin = (w, fade = 0.35) => pulse(t, w[0], w[1], Math.min(0.45, fade / (w[1] - w[0])));

            // Phase title swap
            const ph = t < wWord[0] ? "MESSAGES" : t < wMed[0] ? "WORDS" : "MEDIA";
            if (this.phase.textContent !== ph) this.phase.textContent = ph;

            // 1. MESSAGES phase
            const pm = inWin(wMsg);
            setO(this.barPhase, pm);
            if (pm > 0) {
                const trackP = tw(t, wMsg[0], wMsg[0] + 0.6, E.outCubic);
                const cp = tw(t, A.l12.s - 0.15, A.l12.e + 0.4, E.outQuart);
                this.bars.forEach(b => {
                    b.set(Math.max(cp * b.val / 760, trackP * 0.02));
                    UI.setCounter(b.cnt, b.val * cp);
                });
            }

            // 2. WORDS donut phase
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

            // 3. MEDIA shared bubbles
            const pd = inWin(wMed);
            setO(this.mediaPhase, pd);
            if (pd > 0) {
                const cp = tw(t, A.l14.s - 0.1, A.l14.e + 0.35, E.outBack);
                this.orbs.forEach(o => {
                    const R = (135 + o.val * 1.05) * cp;
                    o.orb.style.width = o.orb.style.height = (R * 2) + "px";
                    setT(o.orb, o.x - R, 530 - R);
                    UI.setCounter(o.cnt, o.val * clamp01(cp));
                });
                setO(this.vs, pd);
            }
        }

        fx(ctx, t) {
            const t0 = this.start + 0.1;
            const p = P(t, t0, t0 + 1.0);
            if (p > 0 && p < 1) {
                for (let i = 0; i < 28; i++) {
                    const sx = 200 + rnd(61, i) * 680, sy = -40;
                    const kk = E.inOutCubic(clamp01(p * 1.4 - rnd(62, i) * 0.4));
                    const x = lerp(sx, 540, kk), y = lerp(sy, 480 + rnd(63, i) * 500, kk);
                    ctx.globalAlpha = (1 - kk) * 0.85 + 0.1;
                    ctx.fillStyle = i % 2 ? MINT : AMBER;
                    ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
                }
                ctx.globalAlpha = 1;
            }
            NB.ambientDust(ctx, t, 8, 12, 0.22);
        }
    }

    /* ============================== S6 — LEFT ON READ ============================== */
    class S6 extends Scene {
        buildContent(r) {
            // Atmospheric tension darkness
            this.dimAll = div(r, { left: "0", top: "0", width: "1080px", height: "1920px", background: "#020308" });

            // Chat bubble teaser
            this.panel = UI.glassCard(r, 100, 310, 880, 580, {
                r: 44,
                bg: "linear-gradient(155deg, rgba(24, 33, 62, 0.95), rgba(12, 17, 36, 0.98))"
            });

            const hd = div(this.panel, {
                left: "0", top: "0", width: "100%", height: "110px",
                background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", paddingLeft: "34px"
            });
            UI.avatar(hd, 84, 55, 34, "#3B82F6", "A");
            const nm = div(hd, { left: "140px", top: "26px", fontFamily: FONT, fontSize: "34px", fontWeight: "700", color: INK });
            nm.textContent = "Alex Morgan";

            this.bubble = UI.chatBubble(this.panel, { side: "me", text: "Hey! Are you still joining tonight?", time: "8:41 PM", read: true });
            this.bubble.style.left = "180px"; this.bubble.style.top = "170px";

            this.readPill = div(this.panel, {
                left: "670px", top: "330px", padding: "6px 18px", borderRadius: "14px",
                background: "rgba(0, 245, 160, 0.15)", border: `1px solid ${MINT}`,
                fontFamily: FONT, fontSize: "22px", fontWeight: "800", color: MINT, letterSpacing: "3px"
            });
            this.readPill.textContent = "READ 8:41 PM";

            // Tension Clock
            this.clock = UI.clock(r, 540, 1050, 260);

            // Digital Timestamp Display
            this.digiWrap = div(r, {
                left: "540px", top: "1400px", padding: "14px 44px", borderRadius: "34px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
                transform: "translate(-50%, -50%)", backdropFilter: "blur(12px)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
            });
            this.digi = div(this.digiWrap, {
                fontFamily: MONO, fontSize: "64px", fontWeight: "700",
                color: INK, letterSpacing: "4px", whiteSpace: "nowrap"
            });
            this.digi.textContent = "8:41 PM";

            // Tension Freeze Flash
            this.flash = div(r, { left: "0", top: "0", width: "1080px", height: "1920px", background: "#FFFFFF" });

            // Impact Text
            this.noMore = ktext(r, "TIRED OF BEING LEFT ON READ?", {
                left: "0", top: "0", fontSize: "62px", color: INK, fontWeight: "900", letterSpacing: "1px"
            });

            this.decide = ktext(r, "LET THE STATS SPEAK.", {
                left: "0", top: "0", fontSize: "74px", color: AMBER, fontWeight: "900", letterSpacing: "2px",
                textShadow: `0 0 35px ${AMBER}88`
            });

            this.decideGlow = div(r, {
                left: "140px", top: "700px", width: "800px", height: "500px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,183,43,0.35), transparent 65%)", filter: "blur(40px)",
            });
        }

        render(t) {
            const A = this.A;
            const enter = tw(t, this.start + 0.4, this.start + 1.0, E.outCubic);

            const T0 = A.l15.s + 0.6;
            const steps = [[0.0, 20, 41], [0.8, 21, 2], [1.5, 22, 17], [2.1, 23, 48]];
            const spinStart = T0 + 2.6, freeze = A.l16.s - 0.12;

            // Panel & Bubble dismissal
            const chatGone = tw(t, T0 - 0.1, T0 + 0.5, E.inCubic);
            setT(this.panel, 0, 0);
            this.panel.style.transformOrigin = "440px 290px";
            this.panel.style.transform = `translateY(${(1 - enter) * 160}px) scale(${(0.8 + 0.2 * enter) * (1 - 0.15 * chatGone)})`;
            setO(this.panel, enter * (1 - chatGone));
            setO(this.readPill, tw(t, T0 - 0.5, T0 - 0.1) * (1 - chatGone));

            // Accelerating Clock Hands
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

            setT(this.digiWrap, 540, 1400);
            this.digiWrap.style.transform += " translate(-50%,-50%)";
            setO(this.digiWrap, cp * (1 - tw(t, freeze + 0.05, freeze + 0.35)));

            // Impact Tension
            setO(this.dimAll, 0.55 * cp * (1 - tw(t, freeze, freeze + 0.3)));
            setO(this.flash, pulse(t, freeze, freeze + 0.22, 0.5) * 0.95);

            // Kicking hooks
            kIn(this.noMore.chars, t, A.l16.s + 0.02, 0.02, 0.4, "slam");
            setT(this.noMore.el, 540, 780);
            this.noMore.el.style.transform += " translate(-50%,-50%)";
            kOut(this.noMore.chars, t, A.l16.e + 0.25, 0.012, 0.25);

            kIn(this.decide.chars, t, A.l17.s + 0.02, 0.024, 0.45, "slam");
            setT(this.decide.el, 540, 980);
            this.decide.el.style.transform += " translate(-50%,-50%)";
            setO(this.decideGlow, tw(t, A.l17.s + 0.2, A.l17.s + 0.9) * (0.85 + 0.15 * Math.sin(t * 3)));

            // Outro scatter
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
            NB.burst(ctx, t, 540, 980, A.l17.s + 0.25, 48, { color: [AMBER, "#FFFFFF", HONEY], dur: 1.2, spMax: 700, seed: 77 });
            NB.ambientDust(ctx, t, 10, 13, 0.2);
        }
    }

    NB.scenes2 = { S4, S5, S6 };
})();