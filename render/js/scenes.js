/* Scenes 1-3 — Clean Product Story:
 * S1: Clean Day Hook with Honey Amber accent
 * S2: Solo Developer introduction with app icon
 * S3: The 100-Day Challenge progress roadmap
 */
"use strict";
(function () {
    const { tw, E, P, div, setT, setO, Scene } = NB;
    const UI = NB.ui;
    const FONT = UI.FONT;

    /* ============================== S1 — DAY HOOK ============================== */
    class S1 extends Scene {
        buildContent(r) {
            // 1. Top Challenge Pill
            this.badge = div(r, {
                left: "540px", top: "420px", padding: "14px 36px", borderRadius: "999px",
                background: "#FFFFFF", border: "1.5px solid #DBEAFE",
                boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
                transform: "translate(-50%, -50%)", zIndex: "10"
            });
            const bt = div(this.badge, {
                fontFamily: FONT, fontSize: "28px", fontWeight: "800", color: "#F59E0B",
                letterSpacing: "4px", textTransform: "uppercase"
            });
            bt.textContent = "100-DAY APP CHALLENGE";

            // 2. Main Title
            this.title = div(r, {
                left: "540px", top: "540px", fontFamily: FONT, fontSize: "76px",
                fontWeight: "900", color: "#0E172E", letterSpacing: "-2px",
                transform: "translate(-50%, -50%)", textAlign: "center", whiteSpace: "nowrap"
            });
            this.title.textContent = "Promoting NotesBee";

            // 3. Large Clean Day Card
            this.card = div(r, {
                left: "540px", top: "960px", width: "760px", height: "620px",
                borderRadius: "48px", background: "#FFFFFF",
                border: "2px solid #E2E8F0", boxShadow: "0 30px 70px rgba(15,23,42,0.12)",
                transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center"
            });

            const dayPrefix = div(this.card, {
                fontFamily: FONT, fontSize: "40px", fontWeight: "800",
                color: "#64748B", letterSpacing: "8px", textTransform: "uppercase"
            });
            dayPrefix.textContent = "TODAY IS";

            this.num = div(this.card, {
                fontFamily: FONT, fontSize: "260px", fontWeight: "900",
                color: "#F59E0B", lineHeight: "1", letterSpacing: "-8px", margin: "10px 0"
            });
            this.num.textContent = `DAY ${this.T.day}`;

            this.sub = div(this.card, {
                fontFamily: FONT, fontSize: "32px", fontWeight: "700",
                color: "#0E172E", letterSpacing: "1px"
            });
            this.sub.textContent = "Zero Paid Ads · Pure Consistency";

            this.t0 = this.A.l1.s;
        }

        render(t) {
            const t0 = this.t0;
            const enter = tw(t, t0, t0 + 0.5, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            setT(this.badge, 540, 420);
            this.badge.style.transform += ` translate(-50%, -50%) scale(${0.7 + 0.3 * enter})`;
            setO(this.badge, enter * (1 - out));

            setO(this.title, tw(t, t0 + 0.15, t0 + 0.5) * (1 - out));

            const cp = tw(t, t0 + 0.25, t0 + 0.75, E.outBack);
            setT(this.card, 540, 960);
            this.card.style.transform += ` translate(-50%, -50%) scale(${0.85 + 0.15 * cp})`;
            setO(this.card, cp * (1 - out));
        }
    }

    /* ============================== S2 — SOLO DEVELOPER ============================== */
    class S2 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Built by a Solo Developer", "Creating a note app like never before.", { top: 280 });

            // Clean App Icon Presentation
            this.iconWrap = div(r, {
                left: "540px", top: "780px", width: "280px", height: "280px",
                borderRadius: "64px", background: "#FFFFFF",
                boxShadow: "0 25px 60px rgba(15,23,42,0.15)",
                border: "4px solid #FFFFFF", transform: "translate(-50%, -50%)",
                display: "flex", alignItems: "center", justifyContent: "center"
            });
            this.icon = document.createElement("img");
            this.icon.src = "/" + this.T.assets.appIcon;
            Object.assign(this.icon.style, { width: "240px", height: "240px", borderRadius: "52px" });
            this.iconWrap.appendChild(this.icon);

            // Clean floating feature pills around icon
            this.b1 = UI.featureBadge(r, 120, 1020, {
                title: "Clean Experience", sub: "No Clutter", iconBg: "#DBEAFE", glyph: "✦"
            });
            this.b2 = UI.featureBadge(r, 520, 1160, {
                title: "Protected & Private", sub: "On-Device Storage", iconBg: "#DCFCE7", glyph: "🔒"
            });
        }

        render(t) {
            const a = this.A.l2;
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const ip = tw(t, a.s + 0.1, a.s + 0.65, E.outBack);
            setT(this.iconWrap, 540, 780);
            this.iconWrap.style.transform += ` translate(-50%, -50%) scale(${0.7 + 0.3 * ip})`;
            setO(this.iconWrap, ip * (1 - out));

            const b1p = tw(t, a.s + 0.4, a.s + 0.85, E.outBack);
            setT(this.b1, 120, 1020);
            this.b1.style.transform = `scale(${0.7 + 0.3 * b1p}) translateY(${(1 - b1p) * 30}px)`;
            setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, a.s + 0.65, a.s + 1.1, E.outBack);
            setT(this.b2, 520, 1160);
            this.b2.style.transform = `scale(${0.7 + 0.3 * b2p}) translateY(${(1 - b2p) * 30}px)`;
            setO(this.b2, b2p * (1 - out));
        }
    }

    /* ============================== S3 — 100-DAY CHALLENGE ============================== */
    class S3 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "The 100-Day Challenge", "Growing solely through social media & consistency.", { top: 260 });

            // Clean Progress Board Card
            this.board = div(r, {
                left: "540px", top: "720px", width: "840px", height: "260px",
                borderRadius: "36px", background: "#FFFFFF",
                border: "1.5px solid #E2E8F0", boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
                padding: "36px 44px", transform: "translate(-50%, -50%)",
                display: "flex", flexDirection: "column", justifyContent: "space-between"
            });

            const topRow = div(this.board, { display: "flex", justifyContent: "space-between", alignItems: "center" });
            const boardTitle = div(topRow, { fontFamily: FONT, fontSize: "36px", fontWeight: "800", color: "#0E172E" });
            boardTitle.textContent = "Challenge Progress";

            this.counter = div(topRow, { fontFamily: FONT, fontSize: "40px", fontWeight: "900", color: "#F59E0B" });
            this.counter.textContent = `Day ${this.T.day} of ${this.T.totalDays}`;

            this.track = div(this.board, {
                width: "100%", height: "24px", borderRadius: "12px", background: "#F1F5F9",
                overflow: "hidden", position: "relative"
            });
            this.fill = div(this.track, {
                left: "0", top: "0", height: "100%", width: "0%", borderRadius: "12px",
                background: "linear-gradient(90deg, #F59E0B, #D97706)"
            });

            // Simple Statement Badges
            this.b1 = UI.featureBadge(r, 140, 960, {
                title: "No Paid Ads", sub: "100% Organic", iconBg: "#FEE2E2", glyph: "✕"
            });
            this.b2 = UI.featureBadge(r, 520, 1080, {
                title: "Just Consistency", sub: "Daily Progress", iconBg: "#DCFCE7", glyph: "✓"
            });
        }

        render(t) {
            const A = this.A;
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const bp = tw(t, A.l3.s, A.l3.s + 0.6, E.outCubic);
            setT(this.board, 540, 720);
            this.board.style.transform += ` translate(-50%, -50%) scale(${0.85 + 0.15 * bp})`;
            setO(this.board, bp * (1 - out));

            // Fill bar
            const fp = tw(t, A.l3.s + 0.3, A.l3.e + 0.2, E.inOutCubic);
            const pct = (this.T.day / this.T.totalDays) * fp * 100;
            this.fill.style.width = pct.toFixed(1) + "%";

            const b1p = tw(t, A.l4.s, A.l4.s + 0.5, E.outBack);
            setT(this.b1, 140, 960);
            this.b1.style.transform = `scale(${0.7 + 0.3 * b1p}) translateY(${(1 - b1p) * 20}px)`;
            setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, A.l6.s, A.l6.s + 0.5, E.outBack);
            setT(this.b2, 520, 1080);
            this.b2.style.transform = `scale(${0.7 + 0.3 * b2p}) translateY(${(1 - b2p) * 20}px)`;
            setO(this.b2, b2p * (1 - out));
        }
    }

    NB.scenes1 = { S1, S2, S3 };
})();