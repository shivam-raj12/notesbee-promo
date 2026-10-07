/* Scenes 1-3 — Re-engineered for high-retention, modern motion design.
 * S1: High-energy kinetic Day Slam with 3D scale and shockwaves.
 * S2: Glassmorphic terminal with syntax glow and floating app badge.
 * S3: Tactile 100-Day timeline with dynamic laser strikethroughs.
 */
"use strict";
(function () {
    const { E, tw, pulse, clamp, clamp01, lerp, div, setT, setO, ktext, kIn, kOut, Scene } = NB;
    const UI = NB.ui;
    const FONT = UI.FONT;
    const MONO = UI.MONO;

    const AMBER = "#FFB72B", HONEY = "#FF8F3D", MINT = "#00F5A0", VIOLET = "#8F72FF", RED = "#FF4B6E";
    const INK = "#FFFFFF", DIM = "#94A3B8";

    function label(parent, text, x, y, opt = {}) {
        const el = div(parent, {
            left: "0", top: "0", fontFamily: FONT, fontWeight: opt.weight ?? 700,
            fontSize: (opt.size ?? 32) + "px", color: opt.color ?? DIM,
            letterSpacing: (opt.ls ?? 6) + "px", textTransform: "uppercase",
            whiteSpace: "nowrap", textAlign: "center",
            textShadow: opt.glow ? `0 0 20px ${opt.color ?? AMBER}` : "none",
        });
        el.textContent = text;
        setT(el, x, y);
        el.style.transform += " translate(-50%,-50%)";
        el.__bx = x; el.__by = y;
        return el;
    }

    /* ============================== S1 — KINETIC DAY HOOK ============================== */
    class S1 extends Scene {
        buildContent(r) {
            // Ambient core glow
            this.glow = div(r, {
                left: "540px", top: "830px", width: "850px", height: "850px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,183,43,0.35) 0%, rgba(255,143,61,0.15) 45%, transparent 70%)",
                transform: "translate(-50%, -50%)", filter: "blur(50px)",
            });

            // Challenge micro-badge
            this.badge = div(r, {
                left: "540px", top: "410px", padding: "12px 32px", borderRadius: "40px",
                background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.18)",
                backdropFilter: "blur(12px)", transform: "translate(-50%, -50%)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
            });
            this.badgeText = div(this.badge, {
                fontFamily: FONT, fontSize: "28px", fontWeight: "800", color: AMBER,
                letterSpacing: "8px", textTransform: "uppercase"
            });
            this.badgeText.textContent = "100-DAY APP CHALLENGE";

            // DAY Prefix
            this.dayLabel = ktext(r, "DAY", {
                left: "0", top: "0", fontSize: "110px", color: INK, letterSpacing: "36px", fontWeight: "900",
            });

            // Massive Day Number with metallic gradient text
            this.num = div(r, {
                left: "0", top: "0", fontFamily: FONT, fontWeight: "900",
                fontSize: "440px", letterSpacing: "-16px", lineHeight: "1",
                background: `linear-gradient(180deg, #FFFFFF 20%, ${AMBER} 85%)`,
                webkitBackgroundClip: "text", webkitTextFillColor: "transparent",
                filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))",
                whiteSpace: "nowrap",
            });
            this.num.textContent = String(this.T.day).padStart(2, "0");

            // Impact Shockwave Rings
            this.ring = UI.morphRing(r, 540, 830, 880, { w: 10, color: AMBER, glow: 60, glowColor: "rgba(255,183,43,0.6)" });
            this.ring2 = UI.morphRing(r, 540, 830, 980, { w: 2, color: "rgba(255,255,255,0.4)", glow: 20 });
            this.ring2.style.borderStyle = "dashed";

            // Screen impact flash
            this.flash = div(r, { left: "0", top: "0", width: "1080px", height: "1920px", background: "#FFFFFF" });

            // Subtitle kicker
            this.sub = ktext(r, "OF PROMOTING MY APP", {
                left: "0", top: "0", fontSize: "52px", color: INK, letterSpacing: "8px", fontWeight: "800",
            });

            this.t0 = this.A.l1.s;
        }

        render(t) {
            const t0 = this.t0;

            // 1. Badge entry
            const bp = tw(t, t0, t0 + 0.4, E.outBack);
            setT(this.badge, 540, 420);
            this.badge.style.transform += ` translate(-50%, -50%) scale(${bp})`;
            setO(this.badge, bp);

            // 2. Heavy kinetic slam for number
            const slam = tw(t, t0 + 0.06, t0 + 0.58, E.outQuint);
            const s = 4.0 - 3.0 * slam;
            const blur = (1 - slam) * 35;

            setT(this.num, 540, 830);
            this.num.style.transform += ` translate(-50%,-50%) scale(${s})`;
            this.num.style.filter = blur > 0.5 ? `blur(${blur}px)` : "drop-shadow(0 24px 50px rgba(255,183,43,0.35))";
            setO(this.num, tw(t, t0 + 0.02, t0 + 0.2));

            // 3. Impact Flash
            setO(this.flash, 0.85 * pulse(t, t0 + 0.52, t0 + 0.62, 0.45));

            // 4. Glow breathing
            setO(this.glow, tw(t, t0 + 0.35, t0 + 1.0) * (0.85 + 0.15 * Math.sin(t * 4)));

            // 5. "DAY" tracking in
            const dl = this.dayLabel.chars;
            for (let i = 0; i < dl.length; i++) {
                const p = tw(t, t0 + 0.12 + i * 0.06, t0 + 0.5 + i * 0.06, E.outCubic);
                setO(dl[i], p);
                dl[i].style.transform = `translateY(${(1 - E.outBack(p)) * 50}px)`;
                dl[i].style.letterSpacing = lerp(70, 36, p) + "px";
            }
            setT(this.dayLabel.el, 540, 530);
            this.dayLabel.el.style.transform += " translate(-50%,-50%)";

            // 6. Rings Shockwave Expansion
            const rp = tw(t, t0 + 0.48, t0 + 1.4, E.outElastic);
            const rs = 0.35 + 0.65 * rp;
            setT(this.ring, 540 - 440 * rs, 830 - 440 * rs);
            this.ring.style.width = this.ring.style.height = (880 * rs) + "px";
            setO(this.ring, rp);

            const r2p = tw(t, t0 + 0.65, t0 + 1.6, E.outElastic);
            const rs2 = 0.45 + 0.55 * r2p;
            setT(this.ring2, 540 - 490 * rs2, 830 - 490 * rs2);
            this.ring2.style.width = this.ring2.style.height = (980 * rs2) + "px";
            setO(this.ring2, r2p * 0.7);
            this.ring2.style.transform += ` rotate(${t * 15}deg)`;

            // 7. Subtitle Rise
            kIn(this.sub.chars, t, t0 + 0.85, 0.026, 0.38, "rise");
            setT(this.sub.el, 540, 1260);
            this.sub.el.style.transform += " translate(-50%,-50%)";

            // Exit transition
            const out = tw(t, this.end - 0.45, this.end, E.inCubic);
            this.root.style.opacity = 1 - out;
            this.root.style.transform = `scale(${1 + 0.1 * out})`;
            this.root.style.transformOrigin = "540px 900px";
        }

        fx(ctx, t) {
            const t0 = this.t0;
            NB.burst(ctx, t, 540, 830, t0 + 0.54, 45, { color: [AMBER, "#FFFFFF", HONEY], dur: 1.1, spMax: 850, seed: 15 });
            NB.ambientDust(ctx, t, 20, 6, 0.35);
        }
    }

    /* ============================== S2 — SOLO DEVELOPER ============================== */
    class S2 extends Scene {
        buildContent(r) {
            const cx = 540, cy = 900;

            // Premium Glass Terminal
            this.term = UI.glassCard(r, cx - 440, cy - 350, 880, 700, {
                r: 32,
                bg: "linear-gradient(150deg, rgba(22, 30, 58, 0.9), rgba(10, 15, 30, 0.95))",
                border: "rgba(255, 255, 255, 0.16)",
                shadow: "0 40px 100px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.2)"
            });

            // Terminal Header
            this.termBar = div(this.term, {
                left: "0", top: "0", width: "100%", height: "70px",
                background: "rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
            });
            ["#FF5F56", "#FFBD2E", "#27C93F"].forEach((c, i) => div(this.termBar, {
                left: 36 + i * 42 + "px", top: "26px", width: "18px", height: "18px", borderRadius: "50%", background: c,
                boxShadow: `0 0 10px ${c}88`
            }));

            const ttl = div(this.termBar, {
                left: "50%", top: "20px", transform: "translateX(-50%)",
                fontFamily: MONO, fontSize: "22px", color: DIM, fontWeight: "600",
            });
            ttl.textContent = "developer — bash — 80×24";

            // Code lines with rich syntax colors
            this.code = [];
            const lines = [
                ["$ git commit -m 'Initial Release'", "#60A5FA"],
                ["  → notes + encrypted chats", "#E2E8F0"],
                ["  → double-layer privacy active", MINT],
                ["  → 1,000+ custom wallpapers loaded", AMBER],
                ["$ notesbee build --production", "#60A5FA"],
                ["✓ App published to Play Store in 0.4s", MINT],
            ];
            lines.forEach((ln, i) => {
                const el = div(this.term, {
                    left: "50px", top: 115 + i * 66 + "px", fontFamily: MONO,
                    fontSize: "28px", color: ln[1], fontWeight: "500", whiteSpace: "nowrap",
                });
                el.textContent = ln[0];
                this.code.push(el);
            });

            this.cursor = div(this.term, {
                left: "50px", top: "115px", width: "16px", height: "34px",
                background: MINT, borderRadius: "2px", boxShadow: `0 0 12px ${MINT}`
            });

            // App Icon Pop-in Card
            this.iconWrap = div(r, { left: "0", top: "0" });
            this.icon = document.createElement("img");
            this.icon.src = "/" + this.T.assets.appIcon;
            Object.assign(this.icon.style, {
                width: "320px", height: "320px", borderRadius: "74px",
                boxShadow: "0 35px 80px rgba(0,0,0,0.8), 0 0 0 2px rgba(255,255,255,0.25)",
            });
            this.iconWrap.appendChild(this.icon);

            this.iconGlow = div(r, {
                left: "0", top: "0", width: "520px", height: "520px", borderRadius: "50%",
                background: `radial-gradient(circle, ${AMBER}66, transparent 65%)`, filter: "blur(40px)",
            });

            this.cursorArrow = UI.cursorArrow(r, "#FFFFFF");
            this.cap = label(r, "BUILT BY A SOLO DEVELOPER", 540, 1370, { size: 36, color: INK, ls: 10, weight: 800 });
        }

        render(t) {
            const a = this.A.l2, enter = tw(t, this.start, this.start + 0.65, E.outCubic);
            const out = tw(t, this.end - 0.45, this.end, E.inCubic);

            // Terminal scale & morph
            const ts = 0.4 + 0.6 * enter;
            setT(this.term, 0, 0);
            this.term.style.transformOrigin = "440px 350px";
            this.term.style.transform += ` scale(${ts})`;
            setO(this.term, enter * (1 - out));

            // Code line sequence
            const typeT = a.s + 0.15;
            this.code.forEach((el, i) => {
                const lt = typeT + i * 0.32;
                const full = el.textContent;
                const n = Math.floor(clamp01((t - lt) / 0.28) * full.length);
                if (!el.__full) el.__full = full;
                el.textContent = el.__full.slice(0, n);
                setO(el, t > lt ? 1 : 0.2 * enter);
            });

            // Blinking cursor
            const li = clamp(Math.floor((t - typeT) / 0.32), 0, 5);
            const ly = 115 + li * 66;
            setT(this.cursor, 54 + (this.code[li]?.textContent.length ?? 0) * 17, ly);
            setO(this.cursor, (enter * (1 - out)) * (Math.sin(t * 10) > -0.2 ? 1 : 0.1));

            // Icon reveal with spring pop
            const ir = tw(t, a.e - 1.8, a.e - 0.7, E.outElastic);
            const isc = 0.2 + 0.8 * ir;
            setT(this.iconWrap, 540 - 160 * isc, 900 - 160 * isc);
            this.icon.style.width = this.icon.style.height = (320 * isc) + "px";
            this.icon.style.borderRadius = (74 * isc) + "px";
            setO(this.iconWrap, ir * (1 - out));

            setT(this.iconGlow, 540 - 260, 900 - 260);
            setO(this.iconGlow, ir * 0.85 * (1 - out) * (0.8 + 0.2 * Math.sin(t * 4)));

            // Pointer cursor glide
            const fly = tw(t, this.end - 0.55, this.end - 0.05, E.inOutCubic);
            const axp = lerp(880, 130, fly), ayp = lerp(1180, 1620, fly);
            setT(this.cursorArrow, axp, ayp, { r: -20 + 20 * fly });
            setO(this.cursorArrow, enter * (1 - out));

            setO(this.cap, tw(t, a.s + 0.6, a.s + 1.1) * (1 - out));
        }

        fx(ctx, t) {
            const ir0 = this.A.l2.e - 1.8;
            NB.burst(ctx, t, 540, 900, ir0 + 0.55, 36, { color: [AMBER, "#FFFFFF", MINT], dur: 0.9, seed: 25 });
            NB.ambientDust(ctx, t, 16, 6, 0.3);
        }
    }

    /* ============================== S3 — 100-DAY CHALLENGE ============================== */
    class S3 extends Scene {
        buildContent(r) {
            // Top section badge
            this.cap = div(r, {
                left: "540px", top: "440px", padding: "10px 28px", borderRadius: "30px",
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                transform: "translate(-50%, -50%)"
            });
            const capTxt = div(this.cap, {
                fontFamily: FONT, fontSize: "28px", fontWeight: "700", color: DIM,
                letterSpacing: "10px", textTransform: "uppercase"
            });
            capTxt.textContent = "THE 100-DAY JOURNEY";

            // Big Day Card
            this.dayCard = UI.glassCard(r, 90, 540, 900, 360, {
                r: 36,
                bg: "linear-gradient(145deg, rgba(25, 34, 65, 0.8), rgba(12, 17, 36, 0.9))",
                border: "rgba(255,255,255,0.14)"
            });

            this.dayBig = div(this.dayCard, {
                left: "50%", top: "110px", fontFamily: FONT, fontWeight: "900", fontSize: "170px",
                color: INK, letterSpacing: "-4px", whiteSpace: "nowrap", transform: "translateX(-50%)"
            });
            this.dayBig.innerHTML = `DAY <span style="color:${AMBER};text-shadow:0 0 40px ${AMBER}66">${String(this.T.day).padStart(2, "0")}</span><span style="color:${DIM};font-size:100px;font-weight:600"> / ${this.T.totalDays}</span>`;

            // Progress Track inside card
            this.track = div(this.dayCard, {
                left: "60px", top: "270px", width: "780px", height: "20px", borderRadius: "10px",
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.06)"
            });
            this.fill = div(this.track, {
                left: "0", top: "0", height: "100%", width: "0%", borderRadius: "10px",
                background: `linear-gradient(90deg, ${HONEY}, ${AMBER}, ${MINT})`,
                boxShadow: `0 0 25px ${AMBER}`,
            });
            this.dot = div(this.track, {
                left: "0", top: "-10px", width: "40px", height: "40px", borderRadius: "50%",
                background: "#FFFFFF", boxShadow: `0 0 25px ${AMBER}, 0 0 0 6px ${AMBER}`,
            });

            // Big Statements
            this.no1 = ktext(r, "NO PAID ADS.", { left: "0", top: "0", fontSize: "94px", color: INK, fontWeight: "900", letterSpacing: "2px" });
            this.no2 = ktext(r, "NO HUGE BUDGET.", { left: "0", top: "0", fontSize: "94px", color: INK, fontWeight: "900", letterSpacing: "2px" });

            // Laser Strikethrough Bars
            this.strike1 = div(r, {
                left: "0", top: "0", height: "16px", background: RED, borderRadius: "8px",
                boxShadow: `0 0 20px ${RED}`, transformOrigin: "0 50%"
            });
            this.strike2 = div(r, {
                left: "0", top: "0", height: "16px", background: RED, borderRadius: "8px",
                boxShadow: `0 0 20px ${RED}`, transformOrigin: "0 50%"
            });

            this.just = ktext(r, "JUST CONSISTENCY.", {
                left: "0", top: "0", fontSize: "80px", color: MINT, fontWeight: "900", letterSpacing: "2px",
                textShadow: `0 0 35px ${MINT}66`
            });

            // Journey line handoff to S4 chat input
            this.line = div(r, {
                left: "0", top: "0", height: "12px", borderRadius: "6px",
                background: `linear-gradient(90deg, ${AMBER}, ${MINT})`,
                boxShadow: `0 0 30px ${MINT}88`, transformOrigin: "0 50%",
            });
        }

        render(t) {
            const A = this.A, out = tw(t, this.end - 0.4, this.end, E.inCubic);

            setO(this.cap, tw(t, this.start + 0.1, this.start + 0.5) * (1 - out));

            // Day card pop
            const dp = tw(t, A.l3.s - 0.1, A.l3.s + 0.65, E.outBack);
            setO(this.dayCard, dp * (1 - out));
            this.dayCard.style.transform = `scale(${0.7 + 0.3 * dp})`;

            // Fill progress bar
            const fp = tw(t, A.l3.s + 0.3, A.l3.e + 0.3, E.inOutCubic);
            const frac = (this.T.day / this.T.totalDays) * fp;
            this.fill.style.width = (frac * 100).toFixed(2) + "%";
            setT(this.dot, 780 * frac - 20, -10);

            // Strikethrough reveals
            const showStrike = (kt, strike, t0, y) => {
                kIn(kt.chars, t, t0, 0.022, 0.32, "pop");
                setT(kt.el, 540, y); kt.el.style.transform += " translate(-50%,-50%)";
                const sp = tw(t, t0 + 0.45, t0 + 0.8, E.outExpo);
                const w = kt.el.offsetWidth || 720;
                strike.style.width = (w * 1.08) + "px";
                setT(strike, 540 - w * 0.54, y + 4, { sx: sp, sy: 1 });
                setO(strike, sp > 0 ? 1 : 0);
                kOut(kt.chars, t, t0 + 1.45, 0.014, 0.24);
                if (t > t0 + 1.45) setO(strike, 1 - tw(t, t0 + 1.5, t0 + 1.85));
            };

            showStrike(this.no1, this.strike1, A.l4.s - 0.05, 1180);
            showStrike(this.no2, this.strike2, A.l5.s - 0.05, 1180);

            // "JUST CONSISTENCY."
            kIn(this.just.chars, t, A.l6.s - 0.05, 0.024, 0.4, "rise");
            setT(this.just.el, 540, 1280);
            this.just.el.style.transform += " translate(-50%,-50%)";

            // Journey line handoff to S4 chat bar
            const grow = tw(t, A.l6.s + 0.2, A.l6.e + 0.1, E.inOutCubic);
            const slide = tw(t, this.end - 0.5, this.end - 0.05, E.inOutCubic);
            const lw = lerp(30, 940, Math.max(grow, slide));
            const ly = lerp(1660, 1690, slide);

            this.line.style.width = lw + "px";
            this.line.style.height = lerp(12, 96, slide) + "px";
            this.line.style.borderRadius = lerp(6, 48, slide) + "px";
            setT(this.line, 70, ly);
            setO(this.line, tw(t, A.l6.s + 0.1, A.l6.s + 0.4));
        }

        fx(ctx, t) {
            NB.ambientDust(ctx, t, 14, 8, 0.28);
        }
    }

    NB.scenes1 = { S1, S2, S3 };
    NB.PAL = { AMBER, HONEY, MINT, VIOLET, RED, INK, DIM };
    NB.label = label;
})();