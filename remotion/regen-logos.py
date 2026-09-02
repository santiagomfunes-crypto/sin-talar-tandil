#!/usr/bin/env python3
"""Regenera los logos de remotion/public/ desde los originales de img/.

Por qué existe: los PNG que salieron del generador tienen TODO el trazo a alpha ~143
(translúcidos) y solo 15 píxeles llegan a 179. Copiarlos crudo deja un logo que se ve
lavado sobre el video (contraste 3.2:1, por debajo del mínimo legible). Normalizar por
el máximo tampoco alcanza: deja el cuerpo al 80%.

Solución: knee en 143 (todo lo que esté en el trazo pasa a 255, los bordes siguen con
antialias) + relleno del RGB con el color de marca exacto, para no depender del export.

Uso: cd remotion && python3 regen-logos.py
"""
import os
from PIL import Image

KNEE = 143
HERE = os.path.dirname(os.path.abspath(__file__))
PAIRS = [
    ("../img/logo-wpc-cream.png", "public/logo-wpc-cream.png", (244, 241, 230)),  # #f4f1e6
    ("../img/logo-wpc-green.png", "public/logo-wpc-green.png", (47, 81, 51)),     # #2f5133
]

os.chdir(HERE)
for src, dst, rgb in PAIRS:
    alpha = Image.open(src).convert("RGBA").getchannel("A")
    alpha = alpha.point(lambda v: min(255, round(v * 255 / KNEE)))
    out = Image.new("RGBA", alpha.size, rgb + (0,))
    out.putalpha(alpha)
    out.save(dst)
    print(f"✓ {dst} — {alpha.histogram()[255]} px sólidos, RGB {rgb}")
