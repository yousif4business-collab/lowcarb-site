#!/usr/bin/env python3
"""Brand QR for the Low Carb app — grape modules on white, LC mark centered.

Usage: python3 scripts/gen-qr.py
Deps:  pip install "qrcode[pil]" --break-system-packages
"""

from pathlib import Path

import qrcode
from PIL import Image
from qrcode.constants import ERROR_CORRECT_H

APP_URL = "https://lowcarb-app.pages.dev"
GRAPE = "#482465"
TARGET = 600  # px

ROOT = Path(__file__).resolve().parent.parent
MARK = ROOT / "src" / "assets" / "brand" / "lc-mark-purple.png"
OUT = ROOT / "src" / "assets" / "brand" / "app-qr.png"

# ERROR_CORRECT_H tolerates ~30% damage, so the centered mark stays scannable
qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, box_size=12, border=2)
qr.add_data(APP_URL)
qr.make(fit=True)

img = qr.make_image(fill_color=GRAPE, back_color="white").convert("RGBA")
img = img.resize((TARGET, TARGET), Image.NEAREST)

mark = Image.open(MARK).convert("RGBA")
# the asset has transparent margins and white wordmark text — keep only the
# purple LC glyph: visible pixels that are actually dark
glyph_mask = Image.eval(
    Image.composite(mark.convert("L"), Image.new("L", mark.size, 255), mark.getchannel("A")),
    lambda l: 255 if l < 200 else 0,
)
mark = mark.crop(glyph_mask.getbbox())
side = TARGET * 22 // 100  # keep the mark well under the 30% damage budget
mark.thumbnail((side, side), Image.LANCZOS)

# white pad behind the mark so modules don't touch it
pad = 14
plate = Image.new("RGBA", (mark.width + pad * 2, mark.height + pad * 2), "white")
plate.paste(mark, (pad, pad), mark)

img.alpha_composite(plate, ((TARGET - plate.width) // 2, (TARGET - plate.height) // 2))
img.convert("RGB").save(OUT)
print(f"wrote {OUT} ({img.width}x{img.height})")
