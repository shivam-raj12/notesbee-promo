/* NotesBee Safe UI Kit — Fits strictly inside 1080x1920 */
"use strict";
(function () {
    const { div } = NB;
    const FONT = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

    // Top header strictly centered, 920px max width (80px padding on each side)
    function headerBlock(parent, titleText, subText) {
        const wrap = div(parent, {
            position: "absolute",
            top: "160px",
            left: "80px",
            width: "920px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: "20"
        });

        const h1 = div(wrap, {
            fontFamily: FONT,
            fontSize: "64px",
            fontWeight: "900",
            color: "#0E172E",
            letterSpacing: "-1.5px",
            lineHeight: "1.18",
            width: "100%"
        });
        h1.innerHTML = titleText;

        if (subText) {
            const p = div(wrap, {
                fontFamily: FONT,
                fontSize: "30px",
                fontWeight: "600",
                color: "#475569",
                lineHeight: "1.35",
                marginTop: "16px",
                width: "100%"
            });
            p.innerHTML = subText;
        }
        return wrap;
    }

    // Centered Phone: 620px width (Leaves 230px space on left/right for safe margins)
    function phoneChassis(parent, top = 460) {
        const chassis = div(parent, {
            position: "absolute",
            left: "230px",
            top: top + "px",
            width: "620px",
            height: "1080px",
            borderRadius: "52px",
            background: "#0F172A",
            padding: "12px",
            boxShadow: "0 25px 60px rgba(15,23,42,0.18)",
            boxSizing: "border-box",
            zIndex: "10"
        });
        const screen = div(chassis, {
            width: "100%",
            height: "100%",
            borderRadius: "40px",
            background: "#FFFFFF",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box"
        });
        // Camera punch-hole
        div(screen, {
            position: "absolute",
            left: "50%",
            top: "16px",
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            background: "#0F172A",
            transform: "translateX(-50%)",
            zIndex: "50"
        });
        return { chassis, screen };
    }

    // Floating pill badge with strict coordinates inside 1080x1920
    function featureBadge(parent, x, y, opt = {}) {
        const b = div(parent, {
            position: "absolute",
            left: x + "px",
            top: y + "px",
            padding: "18px 24px",
            borderRadius: "28px",
            background: "#FFFFFF",
            border: "1.5px solid rgba(226, 232, 240, 0.9)",
            boxShadow: "0 18px 36px rgba(15, 23, 42, 0.12)",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            boxSizing: "border-box",
            zIndex: "30"
        });

        if (opt.iconBg) {
            const iconWrap = div(b, {
                width: "54px",
                height: "54px",
                borderRadius: "16px",
                background: opt.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: "0"
            });
            iconWrap.innerHTML = `<span style="font-size:26px">${opt.glyph || '★'}</span>`;
        }

        const textWrap = div(b, { display: "flex", flexDirection: "column" });
        div(textWrap, {
            fontFamily: FONT,
            fontSize: "28px",
            fontWeight: "800",
            color: "#0E172E",
            lineHeight: "1.2"
        }).textContent = opt.title ?? "Feature";

        if (opt.sub) {
            div(textWrap, {
                fontFamily: FONT,
                fontSize: "20px",
                fontWeight: "600",
                color: "#64748B",
                marginTop: "4px"
            }).textContent = opt.sub;
        }
        return b;
    }

    // Chat message bubble inside phone screen
    function chatBubble(parent, opt) {
        const mine = opt.side === "me";
        const b = div(parent, {
            maxWidth: "480px",
            padding: "16px 20px",
            borderRadius: "20px",
            borderBottomRightRadius: mine ? "4px" : "20px",
            borderBottomLeftRadius: mine ? "20px" : "4px",
            background: mine ? "#F1F5F9" : "#E0EDFF",
            fontFamily: FONT,
            fontSize: "24px",
            lineHeight: "1.35",
            fontWeight: "600",
            color: "#0E172E",
            alignSelf: mine ? "flex-end" : "flex-start",
            marginBottom: "14px"
        });
        b.textContent = opt.text;
        return b;
    }

    NB.ui = { headerBlock, phoneChassis, featureBadge, chatBubble, FONT };
})();