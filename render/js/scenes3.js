/* Scenes 7-14 — AI Intelligence, Security Vault, Customization & High-Converting CTA
 * S7: Futuristic AI laser scan transforming raw thoughts into clean tasks.
 * S8: 2-stage biometric vault security lock down.
 * S9 & S10: Parallax wallpaper gallery + AI auto-match crossfade.
 * S11 & S12: Real-time multiplayer cursors & modern Bento Grid ecosystem.
 * S13 & S14: Hero 3D icon reveal + high-impact Google Play Store CTA.
 */
"use strict";
(function () {
    const { E, tw, pulse, clamp01, lerp, rnd, div, setT, setO, ktext, kIn, kOut, Scene } = NB;
    const UI = NB.ui, label = NB.label;
    const { AMBER, HONEY, MINT, VIOLET, INK, DIM } = NB.PAL;
    const FONT = UI.FONT;
    const MONO = UI.MONO;

    function noteStructured(card, opt = {}) {
        const header = div(card, { left: "46px", top: "44px" });
        const t1 = div(header, { fontFamily: FONT, fontSize: "48px", fontWeight: "800", color: INK, letterSpacing: "-1px" });
        t1.textContent = opt.title ?? "Product Roadmap Sprint";

        const t2 = div(header, {
            fontFamily: FONT, fontSize: "28px", fontWeight: "700", color: AMBER,
            marginTop: "8px", display: "flex", alignItems: "center"
        });
        t2.innerHTML = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${AMBER};margin-right:10px"></span>${opt.when ?? "Tomorrow · 10:00 AM"}`;

        const items = opt.items ?? ["Finish core architecture", "Review beta feedback", "Sync team notes"];
        const rows = items.map((it, i) => {
            const row = div(card, {
                left: "46px", top: 190 + i * 84 + "px", width: "760px",
                display: "flex", alignItems: "center", padding: "14px 20px", borderRadius: "18px",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)"
            });
            const check = div(row, {
                width: "28px", height: "28px", borderRadius: "8px",
                background: "rgba(0, 245, 160, 0.18)", border: `2px solid ${MINT}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0"
            });
            check.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${MINT}" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`;

            const tx = div(row, {
                marginLeft: "18px", fontFamily: FONT, fontSize: "32px",
                fontWeight: "600", color: "#F1F5F9"
            });
            tx.textContent = it;
            return row;
        });
        return { title: t1, when: t2, rows };
    }

    /* ============================== S7 — AI NOTE ENHANCEMENT ============================== */
    class S7 extends Scene {
        buildContent(r) {
            this.card = UI.glassCard(r, 100, 540, 880, 680, {
                r: 44,
                bg: "linear-gradient(155deg, rgba(26, 33, 64, 0.95), rgba(12, 16, 36, 0.98))"
            });

            this.roughWrap = div(this.card, { left: "46px", top: "70px", width: "780px" });
            const promptLab = div(this.roughWrap, {
                fontFamily: MONO, fontSize: "22px", color: DIM, textTransform: "uppercase", letterSpacing: "3px", marginBottom: "14px"
            });
            promptLab.textContent = "// Raw Brain Dump";

            this.rough = div(this.roughWrap, {
                fontFamily: MONO, fontSize: "36px", color: "#CBD5E1", lineHeight: "1.5",
                background: "rgba(0,0,0,0.25)", padding: "20px 24px", borderRadius: "18px",
                border: "1px dashed rgba(255,255,255,0.15)"
            });
            this.rough.textContent = "meeting tomorrow at 10 need to polish release roadmap";

            this.struct = div(this.card, { left: "0", top: "0", width: "100%", height: "100%" });
            this.parts = noteStructured(this.struct);

            // AI Laser Scanner with intense bloom
            this.scan = div(this.card, {
                left: "0", top: "0", width: "100%", height: "12px",
                background: `linear-gradient(90deg, transparent 5%, ${VIOLET} 50%, transparent 95%)`,
                boxShadow: `0 0 35px ${VIOLET}, 0 0 80px ${VIOLET}`,
            });

            // AI Pill Badge
            this.tag = div(this.card, {
                right: "40px", top: "40px", left: "auto", padding: "10px 26px", borderRadius: "30px",
                background: "rgba(139, 124, 255, 0.2)", border: `1.5px solid ${VIOLET}`,
                fontFamily: FONT, fontSize: "24px", fontWeight: "800", color: "#DDD6FE", letterSpacing: "3px",
                boxShadow: `0 0 25px ${VIOLET}55`, backdropFilter: "blur(10px)"
            });
            this.tag.textContent = "✦ AI ORGANIZED";

            this.sparks = [0, 1, 2, 3].map(i => UI.sparkleSVG(r, 0, 0, 48 - i * 6, i % 2 ? VIOLET : AMBER));
            this.cap = label(r, "AI-POWERED NOTE SYNTHESIS", 540, 1340, { size: 36, color: DIM, ls: 10, weight: 800 });
        }

        render(t) {
            const A = this.A, enter = tw(t, this.start, this.start + 0.5, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            setT(this.card, 0, 0);
            this.card.style.transformOrigin = "440px 340px";
            this.card.style.transform = `scale(${0.8 + 0.2 * enter})`;
            setO(this.card, enter * (1 - out));

            const scanP = tw(t, A.l19a.s + 0.1, A.l19a.s + 1.15, E.inOutCubic);
            setO(this.roughWrap, enter * (1 - scanP));
            this.roughWrap.style.filter = scanP > 0.02 ? `blur(${scanP * 8}px)` : "none";

            const bp = tw(t, A.l19a.s + 0.55, A.l19a.s + 1.5, E.outCubic);
            setO(this.struct, bp);

            this.parts.rows.forEach((row, i) => {
                const rp = tw(t, A.l19a.s + 0.7 + i * 0.16, A.l19a.s + 1.0 + i * 0.16, E.outBack);
                row.style.transform = `translateX(${(1 - rp) * -50}px)`;
                setO(row, rp * bp);
            });

            setO(this.parts.title, bp);
            setO(this.parts.when, tw(t, A.l19a.s + 0.6, A.l19a.s + 1.0) * bp);

            setT(this.scan, 0, scanP * 680);
            setO(this.scan, pulse(t, A.l19a.s + 0.1, A.l19a.s + 1.15, 0.12));

            const tp = tw(t, A.l19a.s + 1.35, A.l19a.s + 1.8, E.outBack);
            this.tag.style.transform = `scale(${0.3 + 0.7 * tp})`;
            setO(this.tag, tp * (1 - out));

            this.sparks.forEach((s, i) => {
                const aa = t * (0.8 + i * 0.23) + i * 2.1;
                const sx = 540 + Math.cos(aa) * (490 + i * 14);
                const syy = 880 + Math.sin(aa * 1.3) * (410 + i * 10);
                setT(s, 0, 0);
                s.style.left = sx + "px"; s.style.top = syy + "px";
                const twk = 0.5 + 0.5 * Math.sin(t * 5 + i * 1.7);
                s.style.transform = `scale(${0.4 + 0.6 * twk * enter}) rotate(${t * 40}deg)`;
                setO(s, enter * twk * (1 - out));
            });

            setO(this.cap, tw(t, A.l18.s + 0.2, A.l18.s + 0.8) * (1 - out));
        }

        fx(ctx, t) {
            NB.burst(ctx, t, 540, 880, this.A.l19a.s + 1.3, 28, { color: [VIOLET, AMBER, "#FFFFFF"], dur: 0.8, seed: 91 });
            NB.ambientDust(ctx, t, 10, 14, 0.22);
        }
    }

    /* ============================== S8 — DOUBLE-LAYER PRIVACY ============================== */
    class S8 extends Scene {
        buildContent(r) {
            this.card = UI.glassCard(r, 140, 600, 800, 580, {
                r: 44,
                bg: "linear-gradient(150deg, rgba(22, 30, 58, 0.92), rgba(10, 15, 34, 0.98))"
            });
            this.parts = noteStructured(this.card);

            // Glass Frost Privacy Overlay
            this.blurCover = div(this.card, {
                left: "0", top: "0", width: "100%", height: "100%", borderRadius: "44px",
                background: "rgba(6, 9, 20, 0.4)", backdropFilter: "blur(0px)",
            });

            // Protective Concentric Security Rings
            this.ring1 = UI.morphRing(r, 540, 890, 920, { w: 6, color: AMBER, glow: 50, glowColor: "rgba(255,183,43,0.5)" });
            this.ring2 = UI.morphRing(r, 540, 890, 680, { w: 6, color: MINT, glow: 50, glowColor: "rgba(0,245,160,0.5)" });

            this.lock1 = UI.padlock(r, 540, 440, 88, AMBER);
            this.lock2 = UI.padlock(r, 540, 560, 72, MINT);

            this.lab1 = label(r, "LAYER 1 · APP BIOMETRIC LOCK", 540, 290, { size: 38, color: AMBER, ls: 8, weight: 800 });
            this.lab2 = label(r, "LAYER 2 · PRIVATE NOTE VAULT", 540, 1370, { size: 38, color: MINT, ls: 8, weight: 800 });
            this.cap = label(r, "MILITARY-GRADE ENCRYPTION", 540, 210, { size: 32, color: DIM, ls: 10, weight: 700 });
        }

        render(t) {
            const A = this.A;
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.4, this.end, E.inCubic);

            setO(this.card, enter * (1 - out));

            // Layer 1 Lock Engagement
            const l1p = tw(t, A.l19b.s + 0.05, A.l19b.s + 0.75, E.outExpo);
            const r1s = 1.35 - 0.35 * l1p;
            setT(this.ring1, 540 - 460 * r1s, 890 - 460 * r1s);
            this.ring1.style.width = this.ring1.style.height = (920 * r1s) + "px";
            setO(this.ring1, l1p * (1 - out));

            this.lock1.set(tw(t, A.l19b.s + 0.55, A.l19b.s + 1.0, E.outBack));
            setO(this.lock1.svg, tw(t, A.l19b.s + 0.4, A.l19b.s + 0.7) * (1 - out));
            setO(this.lab1, tw(t, A.l19b.s + 0.35, A.l19b.s + 0.8) * (1 - out));

            // Layer 2 Lock Engagement
            const l2p = tw(t, A.l19b.s + 0.7, A.l19b.s + 1.4, E.outExpo);
            const r2s = 1.35 - 0.35 * l2p;
            setT(this.ring2, 540 - 340 * r2s, 890 - 340 * r2s);
            this.ring2.style.width = this.ring2.style.height = (680 * r2s) + "px";
            setO(this.ring2, l2p * (1 - out));

            this.lock2.set(tw(t, A.l19b.s + 1.15, A.l19b.s + 1.55, E.outBack));
            setO(this.lock2.svg, tw(t, A.l19b.s + 1.0, A.l19b.s + 1.3) * (1 - out));
            setO(this.lab2, tw(t, A.l19b.s + 0.95, A.l19b.s + 1.4) * (1 - out));

            // Content frosting blur
            const blur = tw(t, A.l19b.s + 1.1, A.l19b.s + 1.6);
            this.blurCover.style.backdropFilter = `blur(${blur * 22}px)`;
            this.blurCover.style.background = `rgba(6,9,20,${0.35 + blur * 0.45})`;
            setO(this.blurCover, enter * (1 - out));
            setO(this.cap, enter * (1 - out));

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
                const col = div(r, {
                    left: 50 + c * 335 + "px", top: "0", width: "310px", height: "1920px", overflow: "visible"
                });
                const tiles = [];
                for (let i = 0; i < 8; i++) {
                    tiles.push(UI.bgTile(col, 0, 0, 310, 420, c * 3 + i, 100 + c * 17 + i));
                }
                this.cols.push({ el: col, tiles });
            }

            this.shade = div(r, {
                left: "0", top: "0", width: "1080px", height: "1920px",
                background: "radial-gradient(circle at 50% 50%, rgba(4, 6, 15, 0.82) 0%, rgba(4, 6, 15, 0.4) 65%, transparent 100%)"
            });

            this.big = div(r, {
                left: "0", top: "0", fontFamily: FONT, fontWeight: "900", fontSize: "360px",
                letterSpacing: "-12px", whiteSpace: "nowrap",
                background: `linear-gradient(180deg, #FFFFFF 30%, ${AMBER} 100%)`,
                webkitBackgroundClip: "text", webkitTextFillColor: "transparent",
                filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.8))"
            });
            this.big.textContent = "1,000+";

            this.lab = label(r, "CURATED BACKGROUNDS", 540, 1120, { size: 54, color: AMBER, ls: 14, weight: 800, glow: true });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.4, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            const speeds = [460, 680, 540];
            this.cols.forEach((c, ci) => {
                const scroll = (t - this.start) * speeds[ci] + ci * 150;
                c.el.style.opacity = enter * (1 - out);
                c.tiles.forEach((tile, i) => {
                    let y = ((i * 450 - scroll) % (8 * 450) + 8 * 450) % (8 * 450) - 450;
                    tile.style.transform = `translateY(${y}px) scale(${enter})`;
                });
            });

            setO(this.shade, enter * (1 - out));

            const sp = tw(t, this.start + 0.55, this.start + 1.1, E.outBack);
            setT(this.big, 540, 830);
            this.big.style.transform += ` translate(-50%,-50%) scale(${0.35 + 0.65 * sp})`;
            this.big.style.filter = (1 - sp) > 0.05 ? `blur(${(1 - sp) * 16}px)` : "drop-shadow(0 20px 60px rgba(0,0,0,0.8))";
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

            this.card = UI.glassCard(r, 130, 640, 820, 600, {
                r: 44,
                bg: "rgba(10, 15, 32, 0.85)",
                shadow: "0 30px 80px rgba(0,0,0,0.7)"
            });
            this.parts = noteStructured(this.card, {
                title: "Maldives Beach Retreat 🏖️",
                when: "Sunday · 9:00 AM",
                items: ["Book reef diving tour", "Pack cameras & sun gear", "Pick up flight tickets"]
            });

            this.tag = div(r, {
                left: "0", top: "0", padding: "14px 34px", borderRadius: "34px",
                background: "rgba(139, 124, 255, 0.25)", border: `1.5px solid ${VIOLET}`,
                fontFamily: FONT, fontSize: "28px", fontWeight: "800", color: "#EDE9FE", letterSpacing: "3px",
                boxShadow: `0 0 30px ${VIOLET}66`, backdropFilter: "blur(12px)", whiteSpace: "nowrap"
            });
            this.tag.textContent = "✦ AI CONTEXT MATCH";

            this.sparks = [0, 1, 2].map(i => UI.sparkleSVG(r, 0, 0, 48 - i * 8, i % 2 ? "#DDD6FE" : AMBER));
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.5, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            const z = 0.3 + 0.7 * enter;
            this.bg1.style.transform = `scale(${z})`;
            this.bg1.style.transformOrigin = "540px 940px";
            setO(this.bg1, enter);

            const pick = tw(t, this.start + 0.9, this.start + 1.5, E.inOutCubic);
            setO(this.bg2, pick * (1 - out));
            this.bg2.style.transform = `scale(${1.05 - 0.05 * pick})`;
            this.bg2.style.transformOrigin = "540px 940px";
            setO(this.bg1, enter * (1 - pick * 0.9) * (1 - out));

            setT(this.card, 0, 0);
            this.card.style.transform = `translateY(${(1 - enter) * 90}px)`;
            setO(this.card, enter * (1 - out));

            const tp = tw(t, this.start + 1.0, this.start + 1.45, E.outBack);
            setT(this.tag, 540, 540);
            this.tag.style.transform += ` translate(-50%,-50%) scale(${0.4 + 0.6 * tp})`;
            setO(this.tag, tp * (1 - out));

            this.sparks.forEach((s, i) => {
                const aa = t * 1.2 + i * 2.4;
                s.style.left = 540 + Math.cos(aa) * 440 + "px";
                s.style.top = 940 + Math.sin(aa * 1.4) * 330 + "px";
                s.style.transform = `scale(${0.5 + 0.5 * Math.sin(t * 6 + i)})`;
                setO(s, enter * (1 - out) * (0.4 + 0.6 * Math.sin(t * 4 + i * 2) ** 2));
            });
        }

        fx(ctx, t) {
            NB.burst(ctx, t, 540, 940, this.start + 1.0, 24, { color: [VIOLET, "#EDE9FE", AMBER], dur: 0.75, seed: 95 });
        }
    }

    /* ============================== S11 — COLLABORATION ============================== */
    class S11 extends Scene {
        buildContent(r) {
            this.card = UI.glassCard(r, 130, 620, 820, 620, {
                r: 44,
                bg: "linear-gradient(155deg, rgba(24, 32, 64, 0.95), rgba(12, 16, 36, 0.98))"
            });
            this.parts = noteStructured(this.card, {
                title: "Shared Project Sprint 🚀",
                when: "Today · 6:00 PM",
                items: ["Ship Play Store release", "Review crash logs", "Sync marketing reel"]
            });

            this.avA = UI.avatar(r, 290, 480, 56, MINT, "A");
            this.avB = UI.avatar(r, 790, 480, 56, VIOLET, "B");
            this.curA = UI.cursorArrow(r, MINT);
            this.curB = UI.cursorArrow(r, VIOLET);

            this.typeLine = div(this.card, {
                left: "46px", top: "480px", fontFamily: MONO,
                fontSize: "30px", color: "#E2E8F0",
                background: "rgba(255,255,255,0.06)", padding: "14px 20px", borderRadius: "14px"
            });
            this.typeLine.textContent = "";

            this.linkSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            this.linkSvg.setAttribute("width", "1080"); this.linkSvg.setAttribute("height", "1920");
            this.linkSvg.style.cssText = "position:absolute;left:0;top:0;overflow:visible;pointer-events:none";
            this.link = document.createElementNS("http://www.w3.org/2000/svg", "path");
            this.link.setAttribute("fill", "none");
            this.link.setAttribute("stroke", "rgba(0, 245, 160, 0.6)");
            this.link.setAttribute("stroke-width", "4");
            this.link.setAttribute("stroke-dasharray", "12 12");
            this.linkSvg.appendChild(this.link);
            r.appendChild(this.linkSvg);

            this.merged = div(r, {
                left: "0", top: "0", width: "160px", height: "160px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${MINT}, ${VIOLET})`,
                border: "3px solid rgba(255,255,255,0.6)", boxShadow: "0 20px 60px rgba(139,124,255,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT, fontWeight: "900", fontSize: "48px", color: "#FFFFFF",
            });
            this.merged.textContent = "AB";

            this.cap = label(r, "REAL-TIME COLLABORATION", 540, 360, { size: 36, color: DIM, ls: 12, weight: 800 });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            setT(this.card, 0, 0);
            setO(this.card, enter * (1 - out));

            const ax = 540 + Math.sin(t * 2.1) * 260, ay = 940 + Math.cos(t * 1.6) * 200;
            const bx = 540 + Math.sin(t * 1.7 + 2) * 240, by = 940 + Math.cos(t * 2.3 + 1) * 210;

            const mp = tw(t, this.end - 0.85, this.end - 0.35, E.inOutCubic);
            const max = lerp(290, 540, mp), may = lerp(480, 940, mp);
            const mbx = lerp(790, 540, mp), mby = lerp(480, 940, mp);

            setT(this.avA, max - 56, may - 56); setO(this.avA, enter * (1 - mp) * (1 - out));
            setT(this.avB, mbx - 56, mby - 56); setO(this.avB, enter * (1 - mp) * (1 - out));

            setT(this.curA, lerp(ax, 540, mp), lerp(ay, 940, mp)); setO(this.curA, enter * (1 - mp) * (1 - out));
            setT(this.curB, lerp(bx, 540, mp), lerp(by, 940, mp)); setO(this.curB, enter * (1 - mp) * (1 - out));

            this.link.setAttribute("d", `M ${lerp(ax, 540, mp)} ${lerp(ay, 940, mp)} Q 540 ${Math.min(ay, by) - 160} ${lerp(bx, 540, mp)} ${lerp(by, 940, mp)}`);
            setO(this.linkSvg, enter * (1 - mp) * (1 - out) * 0.8);

            const full = "+ Alex added launch checklist items…";
            const n = Math.floor(clamp01((t - this.start - 0.5) / 1.6) * full.length);
            this.typeLine.textContent = full.slice(0, n);
            setO(this.typeLine, enter * (1 - mp * 0.5) * (1 - out));

            const msc = tw(t, this.end - 0.4, this.end - 0.05, E.outBack);
            setT(this.merged, 540 - 80, 940 - 80);
            this.merged.style.transform += ` scale(${0.2 + 0.8 * msc})`;
            setO(this.merged, msc * (1 - out));

            setO(this.cap, tw(t, this.start + 0.3, this.start + 0.8) * (1 - out));
        }

        fx(ctx, t) { NB.ambientDust(ctx, t, 8, 17, 0.2); }
    }

    /* ============================== S12 — CLEAN BENTO INTERFACE ============================== */
    class S12 extends Scene {
        buildContent(r) {
            const feats = [
                ["Smart Notes", AMBER, "✎"], ["Chat Vault", MINT, "◔"],
                ["Analytics", "#38BDF8", "◫"], ["AI Co-pilot", VIOLET, "✦"],
                ["Zero Knowledge", HONEY, "⛉"],
            ];

            this.cards = feats.map(([nm, col, glyph]) => {
                const c = UI.glassCard(r, 0, 0, 440, 290, {
                    r: 36, bg: "linear-gradient(145deg, rgba(22, 30, 56, 0.9), rgba(11, 15, 34, 0.95))"
                });
                const gWrap = div(c, {
                    left: "40px", top: "40px", width: "80px", height: "80px", borderRadius: "24px",
                    background: `rgba(${col === MINT ? "0,245,160" : col === AMBER ? "255,183,43" : "139,124,255"}, 0.15)`,
                    border: `1.5px solid ${col}`, display: "flex", alignItems: "center", justifyContent: "center"
                });
                const g = div(gWrap, {
                    fontFamily: FONT, fontSize: "44px", fontWeight: "900", color: col,
                });
                g.textContent = glyph;

                const lab = div(c, {
                    left: "40px", top: "180px", fontFamily: FONT, fontSize: "36px",
                    fontWeight: "800", color: INK, letterSpacing: "1px",
                });
                lab.textContent = nm;
                return { el: c, nm };
            });

            this.onePlace = ktext(r, "ALL IN ONE BEAUTIFUL PLACE.", {
                left: "0", top: "0", fontSize: "58px", color: INK, fontWeight: "900", letterSpacing: "2px"
            });
            this.cap = label(r, "INTUITIVE · FAST · SECURE", 540, 240, { size: 34, color: DIM, ls: 12, weight: 700 });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.5, E.outCubic);
            const out = tw(t, this.end - 0.45, this.end, E.inCubic);

            const pos = [[90, 560], [550, 560], [90, 890], [550, 890], [320, 1220]];
            const gather = tw(t, this.end - 1.0, this.end - 0.35, E.inOutCubic);

            this.cards.forEach((c, i) => {
                const ep = tw(t, this.start + 0.1 + i * 0.12, this.start + 0.55 + i * 0.12, E.outBack);
                const gx = pos[i][0], gy = pos[i][1];
                const fromX = i % 2 ? 1080 : -440;
                let x = lerp(fromX, gx, ep), y = gy;
                let s = 0.7 + 0.3 * ep, o = ep;

                if (gather > 0) {
                    const ang = i * 1.05 + gather * 2.4;
                    const rad = (1 - gather) * 60;
                    x = lerp(x, 320 + Math.cos(ang) * rad, gather);
                    y = lerp(y, 810 + Math.sin(ang) * rad, gather);
                    s = lerp(s, 0.25, gather);
                    o = 1 - gather * 0.85;
                }

                setT(c.el, x, y, { s });
                setO(c.el, o * enter);
            });

            setO(this.cap, tw(t, this.start + 0.15, this.start + 0.6) * (1 - gather) * (1 - out));

            kIn(this.onePlace.chars, t, this.start + 0.8, 0.02, 0.35, "rise");
            setT(this.onePlace.el, 540, 360);
            this.onePlace.el.style.transform += " translate(-50%,-50%)";

            if (gather > 0) this.onePlace.chars.forEach(ch => setO(ch, clamp01(1 - gather * 1.4)));
        }

        fx(ctx, t) { NB.ambientDust(ctx, t, 8, 18, 0.2); }
    }

    /* ============================== S13 — PRODUCT REVEAL ============================== */
    class S13 extends Scene {
        buildContent(r) {
            this.glow = div(r, {
                left: "240px", top: "580px", width: "600px", height: "600px", borderRadius: "50%",
                background: `radial-gradient(circle, ${AMBER}66, transparent 65%)`, filter: "blur(38px)",
            });

            this.ring = UI.morphRing(r, 540, 880, 580, { w: 6, color: AMBER, glow: 50 });

            this.iconWrap = div(r, { left: "0", top: "0" });
            this.icon = document.createElement("img");
            this.icon.src = "/" + this.T.assets.appIcon;
            Object.assign(this.icon.style, {
                width: "380px", height: "380px", borderRadius: "88px",
                boxShadow: "0 50px 140px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.25)",
            });
            this.iconWrap.appendChild(this.icon);

            this.orbiters = ["◔", "◫", "✦", "⛉", "▦", "AB"].map((g, i) => {
                const col = [MINT, "#38BDF8", VIOLET, HONEY, "#F43F5E", "#34D399"][i];
                const o = div(r, {
                    left: "0", top: "0", width: "116px", height: "116px", borderRadius: "32px",
                    background: "rgba(14, 20, 44, 0.95)", border: `2px solid ${col}88`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: FONT, fontSize: "50px", fontWeight: "900", color: col,
                    boxShadow: `0 16px 45px ${col}44`,
                });
                o.textContent = g;
                return o;
            });

            this.word = ktext(r, "NOTESBEE", {
                left: "0", top: "0", fontSize: "136px", color: INK, fontWeight: "900", letterSpacing: "10px",
                textShadow: "0 20px 40px rgba(0,0,0,0.6)"
            });
            this.tagline = label(r, this.T.tagline, 540, 1370, { size: 44, color: AMBER, ls: 8, weight: 800, glow: true });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.5, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            this.orbiters.forEach((o, i) => {
                const phase = i * (Math.PI * 2 / 6);
                const collapse = tw(t, this.start + 0.5 + i * 0.05, this.start + 1.35, E.inOutCubic);
                const ang = phase + t * 1.4;
                const rad = lerp(580, 0, collapse);
                const x = 540 + Math.cos(ang) * rad - 58;
                const y = 880 + Math.sin(ang) * rad * 1.25 - 58;
                setT(o, x, y, { s: lerp(1, 0.2, collapse) });
                setO(o, enter * (1 - collapse));
            });

            const ip = tw(t, this.start + 1.15, this.start + 1.9, E.outElastic);
            const is = 0.25 + 0.75 * ip;
            setT(this.iconWrap, 540 - 190 * is, 880 - 190 * is);
            this.icon.style.width = this.icon.style.height = (380 * is) + "px";
            this.icon.style.borderRadius = (88 * is) + "px";
            setO(this.iconWrap, ip);
            setO(this.glow, ip * (0.8 + 0.2 * Math.sin(t * 3)));

            const rp = tw(t, this.start + 1.3, this.start + 2.1, E.outCubic);
            const rs = 0.5 + 1.1 * rp;
            setT(this.ring, 540 - 290 * rs, 880 - 290 * rs);
            this.ring.style.width = this.ring.style.height = (580 * rs) + "px";
            setO(this.ring, (1 - rp) * 0.9);

            kIn(this.word.chars, t, this.start + 1.7, 0.045, 0.5, "pop");
            setT(this.word.el, 540, 1240);
            this.word.el.style.transform += " translate(-50%,-50%)";

            setO(this.tagline, tw(t, this.start + 2.2, this.start + 2.7) * (1 - out));
            if (out > 0) this.word.chars.forEach(ch => setO(ch, 1 - out));
        }

        fx(ctx, t) {
            NB.burst(ctx, t, 540, 880, this.start + 1.5, 52, { color: [AMBER, "#FFFFFF", HONEY, MINT], dur: 1.3, spMax: 760, seed: 111 });
            NB.ambientDust(ctx, t, 14, 19, 0.3);
        }
    }

    /* ============================== S14 — FINAL CONVERTING CTA ============================== */
    class S14 extends Scene {
        buildContent(r) {
            this.glow = div(r, {
                left: "200px", top: "180px", width: "680px", height: "680px", borderRadius: "50%",
                background: `radial-gradient(circle, ${AMBER}55, transparent 65%)`, filter: "blur(40px)",
            });

            this.iconWrap = div(r, { left: "0", top: "0" });
            this.icon = document.createElement("img");
            this.icon.src = "/" + this.T.assets.appIcon;
            Object.assign(this.icon.style, {
                width: "340px", height: "340px", borderRadius: "82px",
                boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.25)",
            });
            this.iconWrap.appendChild(this.icon);

            this.word = ktext(r, "NOTESBEE", {
                left: "0", top: "0", fontSize: "124px", color: INK, fontWeight: "900", letterSpacing: "10px",
                textShadow: "0 10px 40px rgba(0,0,0,0.7)"
            });
            this.tagline = label(r, this.T.tagline, 540, 940, { size: 42, color: AMBER, ls: 8, weight: 800, glow: true });

            // Official Play Store Badge
            this.badge = document.createElement("img");
            this.badge.src = "/" + this.T.assets.playBadge;
            Object.assign(this.badge.style, {
                position: "absolute", left: "0", top: "0", width: "620px",
                filter: "drop-shadow(0 25px 60px rgba(0,0,0,0.7))",
            });
            r.appendChild(this.badge);

            this.dl = ktext(r, "DOWNLOAD FREE TODAY", {
                left: "0", top: "0", fontSize: "72px", color: INK, fontWeight: "900", letterSpacing: "4px"
            });

            this.bio = div(r, {
                left: "0", top: "0", padding: "18px 52px", borderRadius: "40px",
                background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.25)",
                fontFamily: FONT, fontSize: "40px", fontWeight: "800", color: MINT,
                letterSpacing: "6px", whiteSpace: "nowrap", backdropFilter: "blur(14px)",
                boxShadow: `0 10px 30px rgba(0,245,160,0.2)`
            });
            this.bio.textContent = "LINK IN BIO";
        }

        render(t) {
            const A = this.A;
            const enter = tw(t, this.start, this.start + 0.6, E.outCubic);

            const br = 1 + 0.02 * Math.sin(t * 2.0);
            const is = enter * br;
            setT(this.iconWrap, 540 - 170 * is, 450 - 170 * is);
            this.icon.style.width = this.icon.style.height = (340 * is) + "px";
            this.icon.style.borderRadius = (82 * is) + "px";
            setO(this.iconWrap, enter);

            setO(this.glow, enter * (0.75 + 0.25 * Math.sin(t * 2.2)));

            kIn(this.word.chars, t, this.start + 0.25, 0.04, 0.45, "rise");
            setT(this.word.el, 540, 810);
            this.word.el.style.transform += " translate(-50%,-50%)";

            setO(this.tagline, tw(t, this.start + 0.7, this.start + 1.2));

            const bp = tw(t, A.l22.s - 0.1, A.l22.s + 0.7, E.outBack);
            const bw = 620 * bp, bimg = this.badge;
            bimg.style.width = bw + "px";
            const bh = bw * (384 / 1292);
            setT(bimg, 540 - bw / 2, 1120 - bh / 2 + (1 - bp) * 120);
            setO(bimg, bp);

            kIn(this.dl.chars, t, A.l22.s + 0.25, 0.03, 0.4, "pop");
            setT(this.dl.el, 540, 1330);
            this.dl.el.style.transform += " translate(-50%,-50%)";

            const biop = tw(t, A.l23.s - 0.05, A.l23.s + 0.6, E.outBack);
            setT(this.bio, 540, 1580);
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