/* Scenes 1-3 — Strictly bounded within 1080x1920 */
"use strict";
(function () {
    const { tw, E, div, setT, setO, Scene } = NB;
    const UI = NB.ui;
    const FONT = UI.FONT;

    /* ============================== S1 — DAY HOOK ============================== */
    /* ============================== S1 — DAY HOOK ============================== */
    class S1 extends Scene {
        buildContent(r) {
            // 1. Top Challenge Pill
            this.badge = div(r, {
                position: "absolute",
                left: "320px",
                top: "340px",
                width: "440px",
                padding: "12px 0",
                borderRadius: "999px",
                background: "#FFFFFF",
                border: "1.5px solid #DBEAFE",
                boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
                textAlign: "center",
                zIndex: "10"
            });
            div(this.badge, {
                fontFamily: FONT,
                fontSize: "24px",
                fontWeight: "800",
                color: "#D97706",
                letterSpacing: "3px",
                textTransform: "uppercase"
            }).textContent = "100-DAY APP CHALLENGE";

            // 2. Main Title
            this.title = div(r, {
                position: "absolute",
                left: "100px",
                top: "430px",
                width: "880px",
                fontFamily: FONT,
                fontSize: "68px",
                fontWeight: "900",
                color: "#0E172E",
                letterSpacing: "-1.5px",
                textAlign: "center"
            });
            this.title.textContent = "Promoting NotesBee";

            // 3. Card Container
            this.card = div(r, {
                position: "absolute",
                left: "140px",
                top: "580px",
                width: "800px",
                height: "640px",
                borderRadius: "44px",
                background: "#FFFFFF",
                border: "2px solid #E2E8F0",
                boxShadow: "0 25px 60px rgba(15,23,42,0.08)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                overflow: "hidden",
                zIndex: "10"
            });

            // Ambient radial warm glow behind the day number (matching the image)
            div(this.card, {
                position: "absolute",
                right: "60px",
                top: "40%",
                width: "360px",
                height: "360px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(230, 126, 34, 0.22) 0%, rgba(230, 126, 34, 0) 70%)",
                transform: "translateY(-50%)",
                pointerEvents: "none"
            });

            div(this.card, {
                fontFamily: FONT,
                fontSize: "30px",
                fontWeight: "800",
                color: "#64748B",
                letterSpacing: "6px",
                textTransform: "uppercase",
                zIndex: "2"
            }).textContent = "TODAY IS";

            // Two-Tone "DAY 01" Row
            const dayRow = div(this.card, {
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: "18px",
                margin: "12px 0 20px 0",
                zIndex: "2"
            });

            // "DAY" in bold dark slate/black
            div(dayRow, {
                fontFamily: FONT,
                fontSize: "170px",
                fontWeight: "900",
                color: "#0B0F19",
                lineHeight: "1",
                letterSpacing: "-4px"
            }).textContent = "DAY";

            // "01" / "03" in warm amber
            const dayPadded = String(this.T.day).padStart(2, "0");
            div(dayRow, {
                fontFamily: FONT,
                fontSize: "170px",
                fontWeight: "900",
                color: "#D97706",
                lineHeight: "1",
                letterSpacing: "-4px"
            }).textContent = dayPadded;

            div(this.card, {
                fontFamily: FONT,
                fontSize: "28px",
                fontWeight: "700",
                color: "#475569",
                zIndex: "2"
            }).textContent = "Zero Paid Ads · Pure Consistency";

            this.t0 = this.A.l1.s;
        }

        render(t) {
            const enter = tw(t, this.t0, this.t0 + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            setT(this.badge, 0, (1 - enter) * -20, 1);
            setO(this.badge, enter * (1 - out));

            setO(this.title, tw(t, this.t0 + 0.1, this.t0 + 0.5) * (1 - out));

            const cp = tw(t, this.t0 + 0.2, this.t0 + 0.65, E.outBack);
            setT(this.card, 0, (1 - cp) * 30, 0.95 + 0.05 * cp);
            setO(this.card, cp * (1 - out));
        }
    }

    /* ============================== S2 — SOLO DEVELOPER ============================== */
    class S2 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Built by a Solo Developer", "Creating a note app like never before.");

            // App Icon (Centered, 260px wide -> left = (1080 - 260)/2 = 410px, top: 580px)
            this.iconWrap = div(r, {
                position: "absolute",
                left: "410px",
                top: "580px",
                width: "260px",
                height: "260px",
                borderRadius: "56px",
                background: "#FFFFFF",
                boxShadow: "0 25px 60px rgba(15,23,42,0.15)",
                border: "4px solid #FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                zIndex: "10"
            });
            const im = document.createElement("img");
            im.src = "/" + this.T.assets.appIcon;
            Object.assign(im.style, { width: "220px", height: "220px", borderRadius: "46px" });
            this.iconWrap.appendChild(im);

            // Badges inside 1080 bounds
            this.b1 = UI.featureBadge(r, 140, 940, {
                title: "Clean Experience", sub: "No Clutter", iconBg: "#DBEAFE", glyph: "✦"
            });
            this.b2 = UI.featureBadge(r, 520, 1100, {
                title: "Protected & Private", sub: "On-Device Storage", iconBg: "#DCFCE7", glyph: "🔒"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const ip = tw(t, this.A.l2.s, this.A.l2.s + 0.5, E.outBack);
            setT(this.iconWrap, 0, (1 - ip) * 30, 0.9 + 0.1 * ip);
            setO(this.iconWrap, ip * (1 - out));

            const b1p = tw(t, this.A.l2.s + 0.35, this.A.l2.s + 0.75, E.outBack);
            setT(this.b1, 0, (1 - b1p) * 20);
            setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, this.A.l2.s + 0.6, this.A.l2.s + 1.0, E.outBack);
            setT(this.b2, 0, (1 - b2p) * 20);
            setO(this.b2, b2p * (1 - out));
        }
    }

    /* ============================== S3 — 100-DAY CHALLENGE ============================== */
    class S3 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "The 100-Day Challenge", "Growing solely through social media & consistency.");

            // Progress Board Card (Centered, 840px wide -> left = 120px, top: 560px)
            this.board = div(r, {
                position: "absolute",
                left: "120px",
                top: "560px",
                width: "840px",
                height: "260px",
                borderRadius: "36px",
                background: "#FFFFFF",
                border: "1.5px solid #E2E8F0",
                boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
                padding: "36px 44px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxSizing: "border-box",
                zIndex: "10"
            });

            const topRow = div(this.board, { display: "flex", justifyContent: "space-between", alignItems: "center" });
            div(topRow, { fontFamily: FONT, fontSize: "34px", fontWeight: "800", color: "#0E172E" }).textContent = "Challenge Progress";
            div(topRow, { fontFamily: FONT, fontSize: "38px", fontWeight: "900", color: "#F59E0B" }).textContent = `Day ${this.T.day} of ${this.T.totalDays}`;

            this.track = div(this.board, {
                width: "100%", height: "24px", borderRadius: "12px", background: "#F1F5F9",
                overflow: "hidden", position: "relative"
            });
            this.fill = div(this.track, {
                position: "absolute", left: "0", top: "0", height: "100%", width: "0%",
                borderRadius: "12px", background: "linear-gradient(90deg, #F59E0B, #D97706)"
            });

            this.b1 = UI.featureBadge(r, 140, 920, {
                title: "No Paid Ads", sub: "100% Organic", iconBg: "#FEE2E2", glyph: "✕"
            });
            this.b2 = UI.featureBadge(r, 520, 1060, {
                title: "Just Consistency", sub: "Daily Progress", iconBg: "#DCFCE7", glyph: "✓"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const bp = tw(t, this.A.l3.s, this.A.l3.s + 0.55, E.outCubic);
            setT(this.board, 0, (1 - bp) * 20);
            setO(this.board, bp * (1 - out));

            const fp = tw(t, this.A.l3.s + 0.2, this.A.l3.e, E.inOutCubic);
            this.fill.style.width = ((this.T.day / this.T.totalDays) * fp * 100).toFixed(1) + "%";

            const b1p = tw(t, this.A.l4.s, this.A.l4.s + 0.5, E.outBack);
            setT(this.b1, 0, (1 - b1p) * 20);
            setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, this.A.l6.s, this.A.l6.s + 0.5, E.outBack);
            setT(this.b2, 0, (1 - b2p) * 20);
            setO(this.b2, b2p * (1 - out));
        }
    }

    NB.scenes1 = { S1, S2, S3 };
})();