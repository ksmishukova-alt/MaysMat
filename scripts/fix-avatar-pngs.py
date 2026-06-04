"""Убирает сиренево-белое кольцо в PNG аватаров, заливает #FEE499."""

from __future__ import annotations

import glob
import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
AVATARS_DIR = ROOT / "public" / "avatars"
BG = (254, 228, 153)


def is_lavender_border(r: int, g: int, b: int, a: int) -> bool:
    if a < 128:
        return False
    if r > 235 and g > 228 and b > 245:
        if (
            abs(r - BG[0]) < 12
            and abs(g - BG[1]) < 12
            and abs(b - BG[2]) < 25
        ):
            return False
        return True
    return False


def fix_image(path: Path) -> int:
    im = Image.open(path).convert("RGBA")
    px = im.load()
    w, h = im.size
    changed = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_lavender_border(r, g, b, a):
                px[x, y] = (*BG, 255)
                changed += 1
    im.save(path, optimize=True)
    return changed


def main() -> None:
    pattern = str(AVATARS_DIR / "**" / "*.png")
    for fp in sorted(glob.glob(pattern, recursive=True)):
        name = os.path.basename(fp)
        if "sheet" in name or "mission" in name:
            continue
        n = fix_image(Path(fp))
        print(f"{name}: заменено {n} px")


if __name__ == "__main__":
    main()
