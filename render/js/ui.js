/* Clean, Minimal UI components matching NotesBee Play Store Listing
 * Crisp white cards, soft pill badges, and centered phone frames.
 */
"use strict";
(function () {
    const { div } = NB;
    const FONT = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";

    // ---------- Clean Headline with safe margins ----------
    function headerBlock(parent, titleText, subText, opt = {}) {
        const wrap = div(parent, {
            left: "100px", top: (opt.top ?? 220) + "px", width: "880px",
            textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center"
        });
        const h1 = div(wrap, {
            fontFamily: FONT, fontSize: (opt.titleSize ?? 68) + "px", fontWeight: "900",
            color: "#0E172E", letterSpacing: "-1.5px", lineHeight: "1.15",
            maxWidth: "840px"
        });
        h1.innerHTML = titleText;

        if (subText) {
            const p = div(wrap, {
                fontFamily: FONT, fontSize: (opt.subSize ?? 32) + "px", fontWeight: "600",
                color: "#475569", lineHeight: "1.4", marginTop: "20px",
                maxWidth: "800px"
            });
            p.innerHTML = subText;
        }
        return wrap;
    }

    // ---------- Realistic Floating Phone Frame ----------
    function phoneChassis(parent, x, y, w = 680, h = 1180) {
        const chassis = div(parent, {
            left: x + "px", top: y + "px", width: w + "px", height: h + "px",
            borderRadius: "56px", background: "#0F172A", padding: "12px",
            boxShadow: "0 35px 80px -15px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(0,0,0,0.06)",
            display: "flex", flexDirection: "column"
        });
        const screen = div(chassis, {
            width: "100%", height: "100%", borderRadius: "44px",
            background: "#FFFFFF", position: "relative", overflow: "hidden",
            display: "flex", flexDirection: "column"
        });
        // Camera punch-hole
        div(screen, {
            left: "50%", top: "18px", width: "24px", height: "24px",
            borderRadius: "50%", background: "#0F172A", transform: "translateX(-50%)",
            zIndex: "50"
        });
        return { chassis, screen };
    }

    // ---------- Listing-Style Floating Pill Badges ----------
    function featureBadge(parent, x, y, opt = {}) {
        const b = div(parent, {
            left: x + "px", top: y + "px",
            padding: "20px 28px", borderRadius: "30px",
            background: "#FFFFFF",
            border: "1.5px solid rgba(226, 232, 240, 0.8)",
            boxShadow: "0 20px 40px -8px rgba(15, 23, 42, 0.12)",
            display: "flex", alignItems: "center", gap: "18px",
            transformOrigin: "center center", zIndex: "30"
        });
        if (opt.iconBg) {
            const iconWrap = div(b, {
                width: "60px", height: "60px", borderRadius: "18px",
                background: opt.iconBg, display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: "0"
            });
            iconWrap.innerHTML = opt.iconSvg || `<span style="font-size:30px">${opt.glyph || '★'}</span>`;
        }
        const textWrap = div(b, { display: "flex", flexDirection: "column" });
        div(textWrap, {
            fontFamily: FONT, fontSize: "30px", fontWeight: "800", color: "#0E172E",
            letterSpacing: "-0.5px", lineHeight: "1.2"
        }).textContent = opt.title ?? "Feature";

        if (opt.sub) {
            div(textWrap, {
                fontFamily: FONT, fontSize: "22px", fontWeight: "600", color: "#64748B",
                marginTop: "4px"
            }).textContent = opt.sub;
        }
        return b;
    }

    // ---------- Clean Chat Row Component ----------
    function chatBubble(parent, opt) {
        const mine = opt.side === "me";
        const b = div(parent, {
            maxWidth: "520px", padding: "18px 22px",
            borderRadius: "24px",
            borderBottomRightRadius: mine ? "6px" : "24px",
            borderBottomLeftRadius: mine ? "24px" : "6px",
            background: mine ? "#F3F4F6" : "#EBF3FF",
            fontFamily: FONT, fontSize: "26px", lineHeight: "1.35",
            fontWeight: "600", color: "#0E172E",
            alignSelf: mine ? "flex-end" : "flex-start",
            marginBottom: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
        });
        b.textContent = opt.text;
        return b;
    }

    // ---------- Clean Donut Chart ----------
    function cleanDonut(parent, cx, cy, r, segs) {
        const NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(NS, "svg");
        svg.setAttribute("width", r * 2); svg.setAttribute("height", r * 2);
        svg.style.position = "absolute";
        svg.style.left = (cx - r) + "px"; svg.style.top = (cy - r) + "px";
        parent.appendChild(svg);
        const circ = 2 * Math.PI * (r - 20);
        const arcs = segs.map(s => {
            const c = document.createElementNS(NS, "circle");
            c.setAttribute("cx", r); c.setAttribute("cy", r);
            c.setAttribute("r", r - 20); c.setAttribute("fill", "none");
            c.setAttribute("stroke", s.color); c.setAttribute("stroke-width", "36");
            c.setAttribute("stroke-linecap", "round");
            svg.appendChild(c);
            return c;
        });
        return {
            svg, arcs,
            set(p) {
                let acc = -0.25;
                segs.forEach((s, i) => {
                    const frac = s.frac * p;
                    arcs[i].setAttribute("stroke-dasharray", `${Math.max(0.001, frac * circ)} ${circ}`);
                    arcs[i].setAttribute("stroke-dashoffset", -acc * circ);
                    acc += frac;
                });
            }
        };
    }

    NB.ui = {
        headerBlock, phoneChassis, featureBadge, chatBubble, cleanDonut, FONT
    };
})();