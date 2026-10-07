#!/usr/bin/env python3
"""Asset validation + placeholder generation for NotesBee promo generator.

If the user has not dropped in their real assets yet, we generate clean
placeholder images so the pipeline always runs. Placeholders are visibly
marked so they never ship by accident.
"""
import json
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent


def _font(size, bold=True):
    candidates = [
        "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for c in candidates:
        if c and Path(c).exists():
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()


def _rounded_gradient(size, radius, c_top, c_bottom):
    """Vertical gradient inside a rounded-rect mask."""
    w = h = size
    grad = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(1, h - 1)
        grad.putpixel((0, y), tuple(int(c_top[i] + (c_bottom[i] - c_top[i]) * t) for i in range(3)))
    grad = grad.resize((w, h))
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, w - 1, h - 1], radius=radius, fill=255)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    out.paste(grad, (0, 0), mask)
    return out, mask


def gen_icon(path: Path, size=1024):
    """Stylized bee app icon: honey gradient tile + abstract bee mark."""
    img, _ = _rounded_gradient(size, int(size * 0.235), (255, 200, 64), (245, 130, 32))
    d = ImageDraw.Draw(img)
    cx, cy = size / 2, size / 2
    u = size / 1024.0

    # soft inner glow
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([cx - 340 * u, cy - 380 * u, cx + 340 * u, cy + 300 * u], fill=(255, 240, 200, 70))
    glow = glow.filter(ImageFilter.GaussianBlur(int(90 * u)))
    img.alpha_composite(glow)

    # wings
    wing = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    wd = ImageDraw.Draw(wing)
    wd.ellipse([cx - 300 * u, cy - 300 * u, cx - 20 * u, cy - 60 * u], fill=(255, 255, 255, 165))
    wd.ellipse([cx + 20 * u, cy - 300 * u, cx + 300 * u, cy - 60 * u], fill=(255, 255, 255, 165))
    wing = wing.filter(ImageFilter.GaussianBlur(int(6 * u)))
    img.alpha_composite(wing)

    # bee body (dark) with amber stripes
    body = [cx - 175 * u, cy - 170 * u, cx + 175 * u, cy + 265 * u]
    d.ellipse(body, fill=(38, 28, 18, 255))
    stripe_mask = Image.new("L", (size, size), 0)
    sd = ImageDraw.Draw(stripe_mask)
    sd.ellipse(body, fill=255)
    stripes = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sd2 = ImageDraw.Draw(stripes)
    for i, sy in enumerate([40, 140, 235]):
        sd2.ellipse([cx - 190 * u, cy + (sy - 34) * u, cx + 190 * u, cy + (sy + 34) * u],
                    fill=(255, 196, 66, 255))
    img.paste(stripes, (0, 0), stripe_mask)

    # stinger tip
    d.polygon([(cx - 26 * u, cy + 250 * u), (cx + 26 * u, cy + 250 * u), (cx, cy + 330 * u)],
              fill=(38, 28, 18, 255))
    # eyes (white + dark pupils for contrast)
    for ex in (-54, 54):
        d.ellipse([cx + (ex - 30) * u, cy - 118 * u, cx + (ex + 30) * u, cy - 58 * u],
                  fill=(250, 246, 238, 255))
        d.ellipse([cx + (ex - 14) * u, cy - 100 * u, cx + (ex + 14) * u, cy - 72 * u],
                  fill=(28, 20, 12, 255))
    # antennae
    d.arc([cx - 130 * u, cy - 300 * u, cx - 10 * u, cy - 130 * u], 200, 330, fill=(38, 28, 18, 255), width=int(14 * u))
    d.arc([cx + 10 * u, cy - 300 * u, cx + 130 * u, cy - 130 * u], 210, 340, fill=(38, 28, 18, 255), width=int(14 * u))

    img.save(path)


def gen_badge(path: Path):
    """Placeholder 'Get it on Google Play' style badge (user replaces with official PNG)."""
    w, h = 1292, 384  # official badge aspect ~ 3.36:1
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([4, 4, w - 5, h - 5], radius=52, fill=(16, 16, 18, 255),
                        outline=(168, 168, 172, 255), width=5)
    # play triangle (four-color approximation)
    tx, ty, ts = 92, h / 2, 118
    tri = [(tx, ty - ts), (tx, ty + ts), (tx + ts * 1.16, ty)]
    d.polygon([(tri[0][0], tri[0][1]), (tri[1][0], tri[1][1]), (tx + 58, ty + 16), (tx + 58, ty - 16)], fill=(0, 168, 255, 255))
    d.polygon([(tx + 62, ty - 20), (tx + 62, ty + 20), (tri[2][0], tri[2][1]), (tx + 104, ty)], fill=(255, 210, 60, 255))
    d.polygon([(tx + 100, ty - 24), (tx + 104, ty), (tri[2][0], tri[2][1]), (tx + 150, ty - 40)], fill=(255, 70, 70, 255))
    d.polygon([(tx + 100, ty + 24), (tx + 104, ty), (tri[2][0], tri[2][1]), (tx + 150, ty + 40)], fill=(0, 200, 120, 255))
    f_small = _font(64, bold=False)
    f_big = _font(112)
    d.text((tx + 200, 78), "GET IT ON", font=f_small, fill=(235, 235, 240, 255))
    d.text((tx + 196, 158), "Google Play", font=f_big, fill=(255, 255, 255, 255))
    f_tiny = _font(30, bold=False)
    d.text((w - 330, h - 48), "PLACEHOLDER — REPLACE", font=f_tiny, fill=(255, 120, 120, 200))
    img.save(path)


def ensure_assets(cfg: dict) -> dict:
    """Validate assets; generate placeholders if missing. Returns status dict."""
    status = {"icon": "ok", "badge": "ok", "placeholders": []}
    icon = ROOT / cfg["assets"]["appIcon"]
    badge = ROOT / cfg["assets"]["playBadge"]
    if not icon.exists():
        gen_icon(icon)
        status["icon"] = "placeholder"
        status["placeholders"].append(str(icon.relative_to(ROOT)))
    else:
        im = Image.open(icon)
        if im.width < 256 or im.height < 256:
            raise SystemExit(f"[assets] {icon} is too small ({im.size}). Provide at least 512x512.")
    if not badge.exists():
        gen_badge(badge)
        status["badge"] = "placeholder"
        status["placeholders"].append(str(badge.relative_to(ROOT)))
    else:
        im = Image.open(badge)
        if im.width < 300:
            raise SystemExit(f"[assets] {badge} looks too small ({im.size}).")
    return status


if __name__ == "__main__":
    cfg = json.loads((ROOT / "config/campaign.json").read_text())
    st = ensure_assets(cfg)
    print(json.dumps(st, indent=2))
