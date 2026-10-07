/* Scenes 7-14 — Features & Play Store CTA (Using real assets) */
"use strict";
(function () {
    const { tw, E, div, setT, setO, Scene } = NB;
    const UI = NB.ui;
    const FONT = UI.FONT;

    /* ============================== S7 — AI NOTE ENHANCER ============================== */
    class S7 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "AI Note Enhancer", "Transform rough notes into polished text instantly.");

            // Centered Real Phone Screenshot (assets/ai.png)
            // Width: 600px -> left = 240px
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
            this.phoneImg.src = "/assets/ai.png";
            Object.assign(this.phoneImg.style, {
                width: "100%",
                height: "auto",
                maxHeight: "1140px",
                objectFit: "contain",
                borderRadius: "44px"
            });
            this.phoneWrap.appendChild(this.phoneImg);

            // Keep feature badge
            this.b1 = UI.featureBadge(r, 520, 1100, {
                title: "One-Tap AI", sub: "Refine in Seconds", iconBg: "#DBEAFE", glyph: "✦"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));
            const pp = tw(t, this.start + 0.1, this.start + 0.55, E.outBack);
            setT(this.phoneWrap, 0, (1 - pp) * 35);
            setO(this.phoneWrap, pp * (1 - out));

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

    /* ============================== S9 — 1,000+ BACKGROUNDS (REAL ASSETS) ============================== */
    class S9 extends Scene {
        buildContent(r) {
            this.header = UI.headerBlock(r, "Explore 1,000+ Backgrounds", "Choose the perfect style, mood, and aesthetic.");

            // Clean 3-Card Showcase container (assets/b1.png, assets/b2.png, assets/b3.png)
            this.cardsWrap = div(r, {
                position: "absolute",
                left: "80px",
                top: "480px",
                width: "920px",
                height: "640px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: "10"
            });

            this.bgCards = ["/assets/b1.png", "/assets/b2.png", "/assets/b3.png"].map((src, i) => {
                const wrap = div(this.cardsWrap, {
                    width: "280px",
                    height: "560px",
                    borderRadius: "32px",
                    overflow: "hidden",
                    background: "#FFFFFF",
                    boxShadow: i === 1
                        ? "0 25px 60px rgba(15,23,42,0.2)"
                        : "0 15px 35px rgba(15,23,42,0.1)",
                    border: "2px solid #FFFFFF",
                    boxSizing: "border-box",
                    transformOrigin: "center center"
                });
                const img = document.createElement("img");
                img.src = src;
                Object.assign(img.style, {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                });
                wrap.appendChild(img);
                return wrap;
            });

            // Feature pill at the bottom
            this.b1 = UI.featureBadge(r, 260, 1180, {
                title: "1,000+ Wallpapers", sub: "Vibrant & Minimalist Styles", iconBg: "#FED7AA", glyph: "🌅"
            });
        }

        render(t) {
            const enter = tw(t, this.start, this.start + 0.45, E.outCubic);
            const out = tw(t, this.end - 0.3, this.end, E.inCubic);

            setO(this.header, enter * (1 - out));

            this.bgCards.forEach((card, i) => {
                const p = tw(t, this.start + 0.1 + i * 0.12, this.start + 0.55 + i * 0.12, E.outBack);
                const yOff = (1 - p) * 40;
                const scale = i === 1 ? (0.95 + 0.08 * p) : (0.88 + 0.05 * p);
                card.style.transform = `translate3d(0, ${yOff}px, 0) scale(${scale})`;
                setO(card, p * (1 - out));
            });

            const bp = tw(t, this.start + 0.4, this.start + 0.8, E.outBack);
            setT(this.b1, 0, (1 - bp) * 20);
            setO(this.b1, bp * (1 - out));
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

        const t1 = A.l1.e + 0.35;
        const t2 = A.l2.e + 0.35;
        const t3 = A.l6.e + 0.45;
        const t4 = A.l9.e + 0.45;
        const t5 = A.l14.e + 0.55;
        const t6 = A.l17.e + 0.55;
        const t7 = A.l19a.e + 0.35;
        const t8 = A.l19b.e + 0.35;
        const t9 = A.l19c.s + (A.l19c.e - A.l19c.s) * 0.52;
        const t10 = A.l19c.e + 0.35;
        const t11 = A.l19d.s + (A.l19d.e - A.l19d.s) * 0.50;
        const t12 = A.l19d.e + 0.35;
        const t13 = A.l20.e + 0.50;

        const defs = [
            [S1,  0,    t1],
            [S2,  t1,   t2],
            [S3,  t2,   t3],
            [S4,  t3,   t4],
            [S5,  t4,   t5],
            [S6,  t5,   t6],
            [S7,  t6,   t7],
            [S8,  t7,   t8],
            [S9,  t8,   t9],
            [S10, t9,   t10],
            [S11, t10,  t11],
            [S12, t11,  t12],
            [S13, t12,  t13],
            [S14, t13,  T.duration],
        ];

        return defs.map(([Cls, s, e], i) => {
            const sc = new Cls("s" + (i + 1), s, e);
            sc.A = A; sc.T = T;
            sc.build(world);
            return sc;
        });
    };
})();