/* Scenes 7-14 — Strictly bounded within 1080x1920 */
"use strict";
(function () {
    const { tw, E, div, setT, setO, Scene } = NB;
    const UI = NB.ui;
    const FONT = UI.FONT;

    /* ============================== S7 — AI NOTE ENHANCER ============================== */
    class S7 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "AI Note Enhancer", "Transform rough notes into polished text instantly.");
            this.phone = UI.phoneChassis(r, 460);
            const screen = this.phone.screen;

            const card = div(screen, { padding: "30px 24px" });
            div(card, { fontFamily: FONT, fontSize: "32px", fontWeight: "900", color: "#0E172E" }).textContent = "AI Note Enhancer ☀️";
            div(card, { fontFamily: FONT, fontSize: "22px", color: "#64748B", marginTop: "12px", lineHeight: "1.4" }).textContent =
                "Enhance notes effortlessly with AI. Automatically fixes grammar and turns rough notes into clear structures.";

            const aiBtn = div(screen, {
                position: "absolute", bottom: "40px", left: "30px", right: "30px", height: "70px",
                borderRadius: "35px", background: "#3B82F6", display: "flex",
                alignItems: "center", justifyContent: "center"
            });
            div(aiBtn, { fontFamily: FONT, fontSize: "24px", fontWeight: "800", color: "#FFFFFF" }).textContent = "✦ Auto Enhance";

            this.b1 = UI.featureBadge(r, 520, 1100, {
                title: "One-Tap AI", sub: "Refine in Seconds", iconBg: "#DBEAFE", glyph: "✦"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));
            setT(this.phone.chassis, 0, (1 - enter) * 30);
            setO(this.phone.chassis, enter * (1 - out));

            const bp = tw(t, this.start + 0.25, this.start + 0.7, E.outBack);
            setT(this.b1, 0, (1 - bp) * 20);
            setO(this.b1, bp * (1 - out));
        }
    }

    /* ============================== S8 — NOTE PRIVACY ============================== */
    class S8 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Manage Your Secure Notes", "Protected. Deceptive. Encrypted on your device.");

            this.b1 = UI.featureBadge(r, 140, 560, {
                title: "Personal Password", sub: "Private Lock", iconBg: "#EDE9FE", glyph: "🔒"
            });
            this.b2 = UI.featureBadge(r, 520, 740, {
                title: "Fake Content", sub: "Stealth Preview", iconBg: "#DBEAFE", glyph: "🕶"
            });
            this.b3 = UI.featureBadge(r, 140, 920, {
                title: "Stealth Mode", sub: "Hidden Security", iconBg: "#EDE9FE", glyph: "👻"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const b1p = tw(t, this.start + 0.1, this.start + 0.5, E.outBack);
            setT(this.b1, 0, (1 - b1p) * 20); setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, this.start + 0.3, this.start + 0.7, E.outBack);
            setT(this.b2, 0, (1 - b2p) * 20); setO(this.b2, b2p * (1 - out));

            const b3p = tw(t, this.start + 0.5, this.start + 0.9, E.outBack);
            setT(this.b3, 0, (1 - b3p) * 20); setO(this.b3, b3p * (1 - out));
        }
    }

    /* ============================== S9 — BACKGROUNDS ============================== */
    class S9 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Explore 1,000+ Backgrounds", "Choose the perfect style, mood, and aesthetic.");

            this.b1 = UI.featureBadge(r, 140, 560, {
                title: "Minimalist", sub: "Clean & Simple", iconBg: "#F1F5F9", glyph: "◻"
            });
            this.b2 = UI.featureBadge(r, 520, 740, {
                title: "Serene & Vibrant", sub: "Scenic Photos", iconBg: "#FED7AA", glyph: "🌅"
            });
            this.b3 = UI.featureBadge(r, 260, 920, {
                title: "AI-Suggested", sub: "Context Matched", iconBg: "#DBEAFE", glyph: "✦"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const b1p = tw(t, this.start + 0.1, this.start + 0.5, E.outBack);
            setT(this.b1, 0, (1 - b1p) * 20); setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, this.start + 0.3, this.start + 0.7, E.outBack);
            setT(this.b2, 0, (1 - b2p) * 20); setO(this.b2, b2p * (1 - out));

            const b3p = tw(t, this.start + 0.5, this.start + 0.9, E.outBack);
            setT(this.b3, 0, (1 - b3p) * 20); setO(this.b3, b3p * (1 - out));
        }
    }

    /* ============================== S10 — AI SUGGESTED THEMES ============================== */
    class S10 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "AI Context Themes", "Your notes automatically match their visual aesthetic.");
            this.badge = UI.featureBadge(r, 260, 680, {
                title: "Smart Mood Match", sub: "Automatic Backgrounds", iconBg: "#DCFCE7", glyph: "🎨"
            });
        }
        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);
            setO(this.header, enter * (1 - out));
            setT(this.badge, 0, (1 - enter) * 20);
            setO(this.badge, enter * (1 - out));
        }
    }

    /* ============================== S11 — COLLABORATION ============================== */
    class S11 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Collaborate with Anyone", "Share notes with friends and make updates in real-time.");

            this.b1 = UI.featureBadge(r, 140, 560, {
                title: "Real-time Updates", sub: "Instant Sync", iconBg: "#EDE9FE", glyph: "↻"
            });
            this.b2 = UI.featureBadge(r, 520, 740, {
                title: "Friends & Family", sub: "Easy Sharing", iconBg: "#DBEAFE", glyph: "👥"
            });
            this.b3 = UI.featureBadge(r, 180, 920, {
                title: "Read & Write", sub: "Granular Permissions", iconBg: "#DCFCE7", glyph: "✍"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            const b1p = tw(t, this.start + 0.1, this.start + 0.5, E.outBack);
            setT(this.b1, 0, (1 - b1p) * 20); setO(this.b1, b1p * (1 - out));

            const b2p = tw(t, this.start + 0.3, this.start + 0.7, E.outBack);
            setT(this.b2, 0, (1 - b2p) * 20); setO(this.b2, b2p * (1 - out));

            const b3p = tw(t, this.start + 0.5, this.start + 0.9, E.outBack);
            setT(this.b3, 0, (1 - b3p) * 20); setO(this.b3, b3p * (1 - out));
        }
    }

    /* ============================== S12 — CLEAN INTERFACE ============================== */
    class S12 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Clean & Modern Interface", "Everything organized cleanly in one place.");
            this.badge = UI.featureBadge(r, 260, 680, {
                title: "Unified Notes", sub: "Zero Clutter Collection", iconBg: "#FED7AA", glyph: "★"
            });
        }
        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);
            setO(this.header, enter * (1 - out));
            setT(this.badge, 0, (1 - enter) * 20);
            setO(this.badge, enter * (1 - out));
        }
    }

    /* ============================== S13 — PRODUCT REVEAL ============================== */
    class S13 extends Scene {
        buildContent(r) {
            // Icon: 260px wide -> left: (1080 - 260)/2 = 410px, top: 560px
            this.iconWrap = div(r, {
                position: "absolute",
                left: "410px",
                top: "560px",
                width: "260px",
                height: "260px",
                borderRadius: "56px",
                background: "#FFFFFF",
                boxShadow: "0 25px 60px rgba(15,23,42,0.15)",
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

            this.title = div(r, {
                position: "absolute",
                left: "140px",
                top: "860px",
                width: "800px",
                fontFamily: FONT,
                fontSize: "80px",
                fontWeight: "900",
                color: "#0E172E",
                letterSpacing: "-1.5px",
                textAlign: "center"
            });
            this.title.textContent = "NotesBee";

            this.sub = div(r, {
                position: "absolute",
                left: "140px",
                top: "970px",
                width: "800px",
                fontFamily: FONT,
                fontSize: "36px",
                fontWeight: "700",
                color: "#F59E0B",
                textAlign: "center"
            });
            this.sub.textContent = "Notes App, Like Never Before.";
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.5, E.outBack);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            setT(this.iconWrap, 0, (1 - enter) * 20, 0.9 + 0.1 * enter);
            setO(this.iconWrap, enter);

            setO(this.title, enter * (1 - out));
            setO(this.sub, enter * (1 - out));
        }
    }

    /* ============================== S14 — OFFICIAL PLAY STORE CTA ============================== */
    class S14 extends Scene {
        buildContent(r) {
            // App icon matching verify.py template match size (240px wide -> left: (1080 - 240)/2 = 420px, top: 460px)
            this.iconWrap = div(r, {
                position: "absolute",
                left: "420px",
                top: "460px",
                width: "240px",
                height: "240px",
                borderRadius: "52px",
                background: "#FFFFFF",
                boxShadow: "0 20px 50px rgba(15,23,42,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
                zIndex: "10"
            });
            const im = document.createElement("img");
            im.src = "/" + this.T.assets.appIcon;
            Object.assign(im.style, { width: "210px", height: "210px", borderRadius: "44px" });
            this.iconWrap.appendChild(im);

            this.title = div(r, {
                position: "absolute",
                left: "140px",
                top: "740px",
                width: "800px",
                fontFamily: FONT,
                fontSize: "68px",
                fontWeight: "900",
                color: "#0E172E",
                letterSpacing: "-1px",
                textAlign: "center"
            });
            this.title.textContent = "NotesBee";

            // Google Play Badge: 600px wide -> left: (1080 - 600)/2 = 240px, top: 880px
            this.badge = document.createElement("img");
            this.badge.src = "/" + this.T.assets.playBadge;
            Object.assign(this.badge.style, {
                position: "absolute",
                left: "240px",
                top: "880px",
                width: "600px",
                filter: "drop-shadow(0 15px 35px rgba(15,23,42,0.15))"
            });
            r.appendChild(this.badge);

            // Link in bio button: 480px wide -> left: (1080 - 480)/2 = 300px, top: 1220px
            this.btn = div(r, {
                position: "absolute",
                left: "300px",
                top: "1220px",
                width: "480px",
                padding: "20px 0",
                borderRadius: "999px",
                background: "#0E172E",
                color: "#FFFFFF",
                fontFamily: FONT,
                fontSize: "34px",
                fontWeight: "800",
                letterSpacing: "4px",
                boxShadow: "0 15px 35px rgba(14,23,46,0.2)",
                textAlign: "center"
            });
            this.btn.textContent = "LINK IN BIO";
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.5, E.outCubic);

            setT(this.iconWrap, 0, (1 - enter) * 20);
            setO(this.iconWrap, enter);

            setO(this.title, enter);
            setO(this.badge, tw(t, this.start + 0.2, this.start + 0.65, E.outBack));

            const bp = tw(t, this.start + 0.4, this.start + 0.85, E.outBack);
            setT(this.btn, 0, (1 - bp) * 20);
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