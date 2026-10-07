/* Scenes 7-14 — Features & Play Store CTA:
 * S7: AI Note Enhancer (Play Store Screen 8)
 * S8: Manage Secure Notes (Play Store Screen 6)
 * S9 & S10: 1,000+ Backgrounds (Play Store Screen 4)
 * S11: Collaborate with Anyone (Play Store Screen 1)
 * S12-S14: Clean Product Reveal & Official Play Store CTA
 */
"use strict";
(function () {
    const { tw, E, div, setT, setO, Scene } = NB;
    const UI = NB.ui;
    const FONT = UI.FONT;

    /* ============================== S7 — AI NOTE ENHANCER ============================== */
    class S7 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "AI Note Enhancer", "Transform rough notes into polished text instantly.", { top: 220 });

            // Clean Phone Frame Showing AI Enhancer (From Screen 8)
            this.phone = UI.phoneChassis(r, 220, 480, 640, 1140);
            const screen = this.phone.screen;

            const card = div(screen, { padding: "30px 24px" });
            div(card, { fontFamily: FONT, fontSize: "32px", fontWeight: "900", color: "#0E172E" }).textContent = "AI Note Enhancer ☀️";
            div(card, { fontFamily: FONT, fontSize: "22px", color: "#64748B", marginTop: "10px", lineHeight: "1.4" }).textContent =
                "Enhance notes effortlessly with AI. Automatically fixes grammar and turns rough notes into clear structures.";

            // AI Button Inside Screen
            const aiBtn = div(screen, {
                position: "absolute", bottom: "40px", left: "40px", right: "40px", height: "70px",
                borderRadius: "35px", background: "#3B82F6", display: "flex",
                alignItems: "center", justifyContent: "center"
            });
            div(aiBtn, { fontFamily: FONT, fontSize: "24px", fontWeight: "800", color: "#FFFFFF" }).textContent = "✦ Auto Enhance";

            // Floating Badge (From Screen 8)
            this.b1 = UI.featureBadge(r, 100, 1140, {
                title: "One-Tap AI", sub: "Refine in Seconds", iconBg: "#DBEAFE", glyph: "✦"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));
            setT(this.phone.chassis, 220, 480);
            setO(this.phone.chassis, enter * (1 - out));

            const bp = tw(t, this.start + 0.25, this.start + 0.75, E.outBack);
            setT(this.b1, 100, 1140);
            this.b1.style.transform = `scale(${0.7 + 0.3 * bp})`;
            setO(this.b1, bp * (1 - out));
        }
    }

    /* ============================== S8 — NOTE PRIVACY ============================== */
    class S8 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Manage Your Secure Notes", "Protected. Deceptive. Encrypted on your device.", { top: 220 });

            // Clean Floating Badges (From Screen 6)
            this.b1 = UI.featureBadge(r, 120, 560, {
                title: "Personal Password", sub: "Private Lock", iconBg: "#EDE9FE", glyph: "🔒"
            });
            this.b2 = UI.featureBadge(r, 520, 720, {
                title: "Fake Content", sub: "Stealth Preview", iconBg: "#DBEAFE", glyph: "🕶"
            });
            this.b3 = UI.featureBadge(r, 120, 880, {
                title: "Stealth Mode", sub: "Hidden Security", iconBg: "#EDE9FE", glyph: "👻"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const b1p = tw(t, this.start + 0.1, this.start + 0.55, E.outBack);
            setT(this.b1, 120, 560); setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, this.start + 0.3, this.start + 0.75, E.outBack);
            setT(this.b2, 520, 720); setO(this.b2, b2p * (1 - out));

            const b3p = tw(t, this.start + 0.5, this.start + 0.95, E.outBack);
            setT(this.b3, 120, 880); setO(this.b3, b3p * (1 - out));
        }
    }

    /* ============================== S9 & S10 — BACKGROUNDS ============================== */
    class S9 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Explore 1,000+ Backgrounds", "Choose the perfect style, mood, and aesthetic.", { top: 220 });

            // Floating Aesthetic Theme Badges (From Screen 4)
            this.b1 = UI.featureBadge(r, 120, 600, {
                title: "Minimalist", sub: "Clean & Simple", iconBg: "#F1F5F9", glyph: "◻"
            });
            this.b2 = UI.featureBadge(r, 520, 740, {
                title: "Serene & Vibrant", sub: "Scenic Photos", iconBg: "#FED7AA", glyph: "🌅"
            });
            this.b3 = UI.featureBadge(r, 280, 920, {
                title: "AI-Suggested", sub: "Context Matched", iconBg: "#DBEAFE", glyph: "✦"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const b1p = tw(t, this.start + 0.1, this.start + 0.55, E.outBack);
            setT(this.b1, 120, 600); setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, this.start + 0.3, this.start + 0.75, E.outBack);
            setT(this.b2, 520, 740); setO(this.b2, b2p * (1 - out));

            const b3p = tw(t, this.start + 0.5, this.start + 0.95, E.outBack);
            setT(this.b3, 280, 920); setO(this.b3, b3p * (1 - out));
        }
    }

    /* ============================== S10 — AI SUGGESTED THEMES ============================== */
    class S10 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "AI Context Themes", "Your notes automatically match their visual aesthetic.", { top: 260 });
            this.badge = UI.featureBadge(r, 260, 660, {
                title: "Smart Mood Match", sub: "Automatic Backgrounds", iconBg: "#DCFCE7", glyph: "🎨"
            });
        }
        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);
            setO(this.header, enter * (1 - out));
            setT(this.badge, 260, 660);
            setO(this.badge, enter * (1 - out));
        }
    }

    /* ============================== S11 — COLLABORATION ============================== */
    class S11 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Collaborate with Anyone", "Share notes with friends and make updates in real-time.", { top: 220 });

            // From Screen 1
            this.b1 = UI.featureBadge(r, 120, 600, {
                title: "Real-time Updates", sub: "Instant Sync", iconBg: "#EDE9FE", glyph: "↻"
            });
            this.b2 = UI.featureBadge(r, 520, 740, {
                title: "Friends & Family", sub: "Easy Sharing", iconBg: "#DBEAFE", glyph: "👥"
            });
            this.b3 = UI.featureBadge(r, 160, 920, {
                title: "Read & Write", sub: "Granular Permissions", iconBg: "#DCFCE7", glyph: "✍"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const b1p = tw(t, this.start + 0.1, this.start + 0.55, E.outBack);
            setT(this.b1, 120, 600); setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, this.start + 0.3, this.start + 0.75, E.outBack);
            setT(this.b2, 520, 740); setO(this.b2, b2p * (1 - out));

            const b3p = tw(t, this.start + 0.5, this.start + 0.95, E.outBack);
            setT(this.b3, 160, 920); setO(this.b3, b3p * (1 - out));
        }
    }

    /* ============================== S12 — CLEAN INTERFACE ============================== */
    class S12 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Clean & Modern Interface", "Everything organized cleanly in one place.", { top: 280 });
            this.badge = UI.featureBadge(r, 260, 680, {
                title: "Unified Notes", sub: "Zero Clutter Collection", iconBg: "#FED7AA", glyph: "★"
            });
        }
        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);
            setO(this.header, enter * (1 - out));
            setT(this.badge, 260, 680);
            setO(this.badge, enter * (1 - out));
        }
    }

    /* ============================== S13 — PRODUCT REVEAL ============================== */
    class S13 extends Scene {
        buildContent(r) {
            this.iconWrap = div(r, {
                left: "540px", top: "720px", width: "280px", height: "280px",
                borderRadius: "64px", background: "#FFFFFF",
                boxShadow: "0 25px 60px rgba(15,23,42,0.15)",
                transform: "translate(-50%, -50%)", display: "flex",
                alignItems: "center", justifyContent: "center"
            });
            this.icon = document.createElement("img");
            this.icon.src = "/" + this.T.assets.appIcon;
            Object.assign(this.icon.style, { width: "240px", height: "240px", borderRadius: "52px" });
            this.iconWrap.appendChild(this.icon);

            this.title = div(r, {
                left: "540px", top: "960px", fontFamily: FONT, fontSize: "78px",
                fontWeight: "900", color: "#0E172E", letterSpacing: "-1.5px",
                transform: "translate(-50%, -50%)", textAlign: "center"
            });
            this.title.textContent = "NotesBee";

            this.sub = div(r, {
                left: "540px", top: "1050px", fontFamily: FONT, fontSize: "36px",
                fontWeight: "700", color: "#F59E0B", transform: "translate(-50%, -50%)",
                textAlign: "center"
            });
            this.sub.textContent = "Notes App, Like Never Before.";
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.5, E.outBack);
            const out = tw(t, this.end - 0.35, this.end, E.inCubic);

            setT(this.iconWrap, 540, 720);
            this.iconWrap.style.transform += ` translate(-50%, -50%) scale(${0.7 + 0.3 * enter})`;
            setO(this.iconWrap, enter);

            setO(this.title, enter * (1 - out));
            setO(this.sub, enter * (1 - out));
        }
    }

    /* ============================== S14 — OFFICIAL PLAY STORE CTA ============================== */
    class S14 extends Scene {
        buildContent(r) {
            this.iconWrap = div(r, {
                left: "540px", top: "540px", width: "240px", height: "240px",
                borderRadius: "56px", background: "#FFFFFF",
                boxShadow: "0 20px 50px rgba(15,23,42,0.12)",
                transform: "translate(-50%, -50%)", display: "flex",
                alignItems: "center", justifyContent: "center"
            });
            this.icon = document.createElement("img");
            this.icon.src = "/" + this.T.assets.appIcon;
            Object.assign(this.icon.style, { width: "210px", height: "210px", borderRadius: "46px" });
            this.iconWrap.appendChild(this.icon);

            this.title = div(r, {
                left: "540px", top: "740px", fontFamily: FONT, fontSize: "68px",
                fontWeight: "900", color: "#0E172E", letterSpacing: "-1px",
                transform: "translate(-50%, -50%)", textAlign: "center"
            });
            this.title.textContent = "NotesBee";

            // Official Play Store Badge
            this.badge = document.createElement("img");
            this.badge.src = "/" + this.T.assets.playBadge;
            Object.assign(this.badge.style, {
                position: "absolute", left: "240px", top: "900px", width: "600px",
                filter: "drop-shadow(0 15px 35px rgba(15,23,42,0.15))"
            });
            r.appendChild(this.badge);

            // Clean Link In Bio Button
            this.btn = div(r, {
                left: "540px", top: "1280px", padding: "20px 60px", borderRadius: "999px",
                background: "#0E172E", color: "#FFFFFF", fontFamily: FONT,
                fontSize: "36px", fontWeight: "800", letterSpacing: "4px",
                boxShadow: "0 15px 35px rgba(14,23,46,0.2)",
                transform: "translate(-50%, -50%)", whiteSpace: "nowrap"
            });
            this.btn.textContent = "LINK IN BIO";
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.5, E.outCubic);

            setT(this.iconWrap, 540, 540);
            this.iconWrap.style.transform += ` translate(-50%, -50%) scale(${0.8 + 0.2 * enter})`;
            setO(this.iconWrap, enter);

            setO(this.title, enter);
            setO(this.badge, tw(t, this.start + 0.2, this.start + 0.7, E.outBack));

            const bp = tw(t, this.start + 0.45, this.start + 0.9, E.outBack);
            setT(this.btn, 540, 1280);
            this.btn.style.transform += ` translate(-50%, -50%) scale(${0.7 + 0.3 * bp})`;
            setO(this.btn, bp);
        }
    }

    /* ============================== FACTORY ============================== */
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