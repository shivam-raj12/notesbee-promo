/* Scenes 4-6 — Strictly bounded within 1080x1920 */
"use strict";
(function () {
    const { tw, E, div, setT, setO, Scene } = NB;
    const UI = NB.ui;
    const FONT = UI.FONT;

    /* ============================== S4 — CHAT SAVING ============================== */
    class S4 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Manage Your Important Chats", "Organized. Private. Always on your device.");

            // Centered Real Phone Screenshot (assets/chat.png)
            // Width: 600px -> left = (1080 - 600)/2 = 240px
            this.phoneWrap = div(r, {
                position: "absolute",
                left: "240px",
                top: "440px",
                width: "600px",
                height: "1140px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                filter: "drop-shadow(0 25px 50px rgba(15,23,42,0.18))",
                zIndex: "10"
            });

            this.phoneImg = document.createElement("img");
            this.phoneImg.src = "/assets/chat.png";
            Object.assign(this.phoneImg.style, {
                width: "100%",
                height: "auto",
                maxHeight: "1140px",
                objectFit: "contain",
                borderRadius: "44px"
            });
            this.phoneWrap.appendChild(this.phoneImg);

            // Keep original feature badges intact
            this.b1 = UI.featureBadge(r, 60, 560, {
                title: "No Clutter", sub: "Clean View", iconBg: "#DBEAFE", glyph: "☰"
            });
            this.b2 = UI.featureBadge(r, 560, 1080, {
                title: "Secure on Device", sub: "No Cloud Tracking", iconBg: "#DCFCE7", glyph: "🔒"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const pp = tw(t, this.start + 0.1, this.start + 0.55, E.outBack);
            setT(this.phoneWrap, 0, (1 - pp) * 40);
            setO(this.phoneWrap, pp * (1 - out));

            const b1p = tw(t, this.A.l8.s, this.A.l8.s + 0.5, E.outBack);
            setT(this.b1, 0, (1 - b1p) * 20);
            setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, this.A.l9.s, this.A.l9.s + 0.5, E.outBack);
            setT(this.b2, 0, (1 - b2p) * 20);
            setO(this.b2, b2p * (1 - out));
        }
    }

    /* ============================== S5 — CHAT ANALYTICS ============================== */
    class S5 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Instantly Analyze Your Chats", "Discover patterns, message counts, and word splits.");

            this.board = div(r, {
                position: "absolute",
                left: "120px",
                top: "480px",
                width: "840px",
                height: "680px",
                borderRadius: "40px",
                background: "#FFFFFF",
                border: "1.5px solid #E2E8F0",
                boxShadow: "0 25px 60px rgba(15,23,42,0.1)",
                padding: "40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxSizing: "border-box",
                zIndex: "10"
            });

            const topRow = div(this.board, { display: "flex", justifyContent: "space-between" });
            const stat1 = div(topRow, {
                width: "360px", padding: "20px", borderRadius: "20px", background: "#F8FAFC",
                border: "1px solid #E2E8F0", boxSizing: "border-box"
            });
            div(stat1, { fontFamily: FONT, fontSize: "22px", color: "#64748B", fontWeight: "700" }).textContent = "TOTAL TURNS";
            div(stat1, { fontFamily: FONT, fontSize: "48px", color: "#0E172E", fontWeight: "900", marginTop: "4px" }).textContent = "129";

            const stat2 = div(topRow, {
                width: "360px", padding: "20px", borderRadius: "20px", background: "#F8FAFC",
                border: "1px solid #E2E8F0", boxSizing: "border-box"
            });
            div(stat2, { fontFamily: FONT, fontSize: "22px", color: "#64748B", fontWeight: "700" }).textContent = "TOTAL WORDS";
            div(stat2, { fontFamily: FONT, fontSize: "48px", color: "#F59E0B", fontWeight: "900", marginTop: "4px" }).textContent = "3,232";

            const mid = div(this.board, { margin: "24px 0" });
            div(mid, { fontFamily: FONT, fontSize: "24px", fontWeight: "800", color: "#0E172E", marginBottom: "12px" }).textContent = "Participant Message Split";
            const splitTrack = div(mid, { width: "100%", height: "28px", borderRadius: "14px", background: "#F59E0B", display: "flex", overflow: "hidden" });
            div(splitTrack, { width: "53%", height: "100%", background: "#3B82F6" });

            const splitLabels = div(mid, { display: "flex", justifyContent: "space-between", marginTop: "10px" });
            div(splitLabels, { fontFamily: FONT, fontSize: "24px", fontWeight: "700", color: "#3B82F6" }).textContent = "Ananya: 53%";
            div(splitLabels, { fontFamily: FONT, fontSize: "24px", fontWeight: "700", color: "#F59E0B" }).textContent = "You: 47%";

            this.b1 = UI.featureBadge(r, 120, 1220, {
                title: "Vocabulary & Split", sub: "Word Breakdown", iconBg: "#CCFBF1", glyph: "Tt"
            });
            this.b2 = UI.featureBadge(r, 540, 1220, {
                title: "Detailed Gaps", sub: "Silence Duration", iconBg: "#EDE9FE", glyph: "⏱"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const bp = tw(t, this.start + 0.1, this.start + 0.55, E.outBack);
            setT(this.board, 0, (1 - bp) * 20);
            setO(this.board, bp * (1 - out));

            const b1p = tw(t, this.A.l13.s, this.A.l13.s + 0.5, E.outBack);
            setT(this.b1, 0, (1 - b1p) * 20);
            setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, this.A.l14.s, this.A.l14.s + 0.5, E.outBack);
            setT(this.b2, 0, (1 - b2p) * 20);
            setO(this.b2, b2p * (1 - out));
        }
    }

    /* ============================== S6 — LEFT ON READ ============================== */
    class S6 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "No More Guessing", "See who replies fast, and who leaves you on read.");

            this.card = div(r, {
                position: "absolute",
                left: "120px",
                top: "560px",
                width: "840px",
                borderRadius: "40px",
                background: "#FFFFFF",
                border: "1.5px solid #E2E8F0",
                boxShadow: "0 25px 60px rgba(15,23,42,0.1)",
                padding: "44px",
                boxSizing: "border-box",
                zIndex: "10"
            });

            div(this.card, { fontFamily: FONT, fontSize: "28px", fontWeight: "800", color: "#64748B" }).textContent = "CHAT SILENCE DURATION";

            const gapBox = div(this.card, {
                background: "#FFFBEB", border: "1.5px solid #FDE68A", padding: "28px",
                borderRadius: "24px", display: "flex", justifyContent: "space-between", alignItems: "center",
                margin: "32px 0", boxSizing: "border-box"
            });
            div(gapBox, { fontFamily: FONT, fontSize: "32px", fontWeight: "800", color: "#D97706" }).textContent = "Longest Silence Gap";
            div(gapBox, { fontFamily: FONT, fontSize: "44px", fontWeight: "900", color: "#B45309" }).textContent = "1d 0h";

            div(this.card, {
                fontFamily: FONT, fontSize: "36px", fontWeight: "800", color: "#0E172E", textAlign: "center"
            }).textContent = "Let the data decide.";
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const cp = tw(t, this.start + 0.1, this.start + 0.55, E.outBack);
            setT(this.card, 0, (1 - cp) * 20);
            setO(this.card, cp * (1 - out));
        }
    }

    NB.scenes2 = { S4, S5, S6 };
})();