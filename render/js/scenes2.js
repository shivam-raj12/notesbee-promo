/* Scenes 4-6 — Clean Product Core:
 * S4: Manage Your Important Chats (Play Store Screen 7)
 * S5: Instantly Analyze Your Chats (Play Store Screen 2)
 * S6: The "Left on Read" Resolution
 */
"use strict";
(function () {
    const { tw, E, div, setT, setO, Scene } = NB;
    const UI = NB.ui;
    const FONT = UI.FONT;

    /* ============================== S4 — CHAT SAVING ============================== */
    class S4 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Manage Your Important Chats", "Organized. Private. Always on your device.", { top: 220 });

            // Clean Center Phone
            this.phone = UI.phoneChassis(r, 220, 480, 640, 1140);
            const screen = this.phone.screen;

            // In-Screen Chat App Bar
            const topBar = div(screen, {
                height: "80px", borderBottom: "1px solid #E2E8F0", padding: "0 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between"
            });
            const name = div(topBar, { fontFamily: FONT, fontSize: "28px", fontWeight: "800", color: "#0E172E" });
            name.textContent = "←  Ananya";

            // Chat Messages Inside Screen
            this.msgList = div(screen, { padding: "24px 20px", display: "flex", flexDirection: "column" });
            this.msgs = [
                UI.chatBubble(this.msgList, { side: "them", text: "Are you awake? Did you save today's notes?" }),
                UI.chatBubble(this.msgList, { side: "me", text: "Yes! Everything is saved in NotesBee." }),
                UI.chatBubble(this.msgList, { side: "them", text: "Great! Don't lose this discussion." }),
                UI.chatBubble(this.msgList, { side: "me", text: "Never. Secure and archived on device." })
            ];

            // Clean Floating Badges (From Screen 7)
            this.b1 = UI.featureBadge(r, 80, 640, {
                title: "No Clutter", sub: "Clean View", iconBg: "#DBEAFE", glyph: "☰"
            });
            this.b2 = UI.featureBadge(r, 560, 1120, {
                title: "Secure on Device", sub: "No Cloud Tracking", iconBg: "#DCFCE7", glyph: "🔒"
            });
        }

        render(t) {
            const A = this.A;
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const pp = tw(t, this.start + 0.1, this.start + 0.6, E.outBack);
            setT(this.phone.chassis, 220, 480 + (1 - pp) * 50);
            setO(this.phone.chassis, pp * (1 - out));

            const b1p = tw(t, A.l8.s, A.l8.s + 0.5, E.outBack);
            setT(this.b1, 80, 640);
            this.b1.style.transform = `scale(${0.7 + 0.3 * b1p}) translateY(${(1 - b1p) * 20}px)`;
            setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, A.l9.s, A.l9.s + 0.5, E.outBack);
            setT(this.b2, 560, 1120);
            this.b2.style.transform = `scale(${0.7 + 0.3 * b2p}) translateY(${(1 - b2p) * 20}px)`;
            setO(this.b2, b2p * (1 - out));
        }
    }

    /* ============================== S5 — CHAT ANALYTICS ============================== */
    class S5 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Instantly Analyze Your Chats", "Discover patterns, message counts, and word splits.", { top: 220 });

            // Clean Center Analytics Dashboard Card
            this.board = div(r, {
                left: "540px", top: "840px", width: "820px", height: "780px",
                borderRadius: "44px", background: "#FFFFFF",
                border: "1.5px solid #E2E8F0", boxShadow: "0 25px 60px rgba(15,23,42,0.1)",
                padding: "40px", transform: "translate(-50%, -50%)",
                display: "flex", flexDirection: "column", justifyContent: "space-between"
            });

            // Top Stat Summary
            const topRow = div(this.board, { display: "flex", justifyContent: "space-between" });
            const statCard1 = div(topRow, {
                width: "350px", padding: "24px", borderRadius: "24px", background: "#F8FAFC",
                border: "1px solid #E2E8F0"
            });
            div(statCard1, { fontFamily: FONT, fontSize: "22px", color: "#64748B", fontWeight: "700" }).textContent = "TOTAL TURNS";
            div(statCard1, { fontFamily: FONT, fontSize: "52px", color: "#0E172E", fontWeight: "900", marginTop: "6px" }).textContent = "129";

            const statCard2 = div(topRow, {
                width: "350px", padding: "24px", borderRadius: "24px", background: "#F8FAFC",
                border: "1px solid #E2E8F0"
            });
            div(statCard2, { fontFamily: FONT, fontSize: "22px", color: "#64748B", fontWeight: "700" }).textContent = "TOTAL WORDS";
            div(statCard2, { fontFamily: FONT, fontSize: "52px", color: "#F59E0B", fontWeight: "900", marginTop: "6px" }).textContent = "3,232";

            // Middle Donut Chart
            this.chartArea = div(this.board, { height: "260px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" });
            this.donut = UI.cleanDonut(this.chartArea, 370, 130, 110, [
                { frac: 0.53, color: "#3B82F6" },
                { frac: 0.47, color: "#F59E0B" }
            ]);

            // Bottom Row Breakdown
            const bottomRow = div(this.board, { display: "flex", justifyContent: "space-between", borderTop: "1px solid #F1F5F9", paddingTop: "20px" });
            div(bottomRow, { fontFamily: FONT, fontSize: "26px", fontWeight: "800", color: "#3B82F6" }).textContent = "● Ananya: 53%";
            div(bottomRow, { fontFamily: FONT, fontSize: "26px", fontWeight: "800", color: "#F59E0B" }).textContent = "● You: 47%";

            // Floating Badges (From Screen 2)
            this.b1 = UI.featureBadge(r, 100, 1180, {
                title: "Vocabulary & Split", sub: "Word Breakdown", iconBg: "#CCFBF1", glyph: "Tt"
            });
            this.b2 = UI.featureBadge(r, 540, 1260, {
                title: "Detailed Gaps", sub: "Silence Duration", iconBg: "#EDE9FE", glyph: "⏱"
            });
        }

        render(t) {
            const A = this.A;
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const bp = tw(t, this.start + 0.1, this.start + 0.6, E.outBack);
            setT(this.board, 540, 840);
            this.board.style.transform += ` translate(-50%, -50%) scale(${0.85 + 0.15 * bp})`;
            setO(this.board, bp * (1 - out));

            const cp = tw(t, A.l12.s, A.l12.e + 0.4, E.outQuart);
            this.donut.set(cp);

            const b1p = tw(t, A.l13.s, A.l13.s + 0.5, E.outBack);
            setT(this.b1, 100, 1180);
            this.b1.style.transform = `scale(${0.7 + 0.3 * b1p}) translateY(${(1 - b1p) * 20}px)`;
            setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, A.l14.s, A.l14.s + 0.5, E.outBack);
            setT(this.b2, 540, 1260);
            this.b2.style.transform = `scale(${0.7 + 0.3 * b2p}) translateY(${(1 - b2p) * 20}px)`;
            setO(this.b2, b2p * (1 - out));
        }
    }

    /* ============================== S6 — LEFT ON READ ============================== */
    class S6 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "No More Guessing", "See who replies fast, and who leaves you on read.", { top: 260 });

            this.card = div(r, {
                left: "540px", top: "780px", width: "780px", height: "460px",
                borderRadius: "44px", background: "#FFFFFF",
                border: "1.5px solid #E2E8F0", boxShadow: "0 25px 60px rgba(15,23,42,0.1)",
                padding: "44px", transform: "translate(-50%, -50%)",
                display: "flex", flexDirection: "column", justifyContent: "space-between"
            });

            div(this.card, { fontFamily: FONT, fontSize: "28px", fontWeight: "800", color: "#64748B" }).textContent = "CHAT SILENCE DURATION";

            const gapBox = div(this.card, {
                background: "#FFFBEB", border: "1.5px solid #FDE68A", padding: "28px",
                borderRadius: "28px", display: "flex", justifyContent: "space-between", alignItems: "center"
            });
            div(gapBox, { fontFamily: FONT, fontSize: "32px", fontWeight: "800", color: "#D97706" }).textContent = "Longest Silence Gap";
            div(gapBox, { fontFamily: FONT, fontSize: "48px", fontWeight: "900", color: "#B45309" }).textContent = "1d 0h";

            const hook = div(this.card, {
                fontFamily: FONT, fontSize: "34px", fontWeight: "800",
                color: "#0E172E", textAlign: "center"
            });
            hook.textContent = "Let the data decide.";
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const cp = tw(t, this.start + 0.1, this.start + 0.6, E.outBack);
            setT(this.card, 540, 780);
            this.card.style.transform += ` translate(-50%, -50%) scale(${0.85 + 0.15 * cp})`;
            setO(this.card, cp * (1 - out));
        }
    }

    NB.scenes2 = { S4, S5, S6 };
})();