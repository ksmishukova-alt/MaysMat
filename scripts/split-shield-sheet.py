"""Нарезка листа классических щитов 2×4 на PNG в public/shields/classic/."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "scripts" / "shield-source-classic.png"
OUT_DIR = ROOT / "public" / "shields" / "classic"
OUT_SIZE = 256

# Порядок на листе: верхний ряд 1,3,7,15 — нижний 30,60,100,365+
MILESTONES = [1, 3, 7, 15, 30, 60, 100, 365]

# Грубые ячейки листа (x0, x1, y0, y1) — уточняются по bbox
CELL_BOXES = [
    (64, 248, 96, 272),
    (304, 488, 96, 272),
    (536, 720, 96, 272),
    (760, 960, 96, 272),
    (64, 248, 368, 560),
    (304, 488, 368, 560),
    (536, 720, 368, 560),
    (760, 960, 368, 560),
]


def is_bright(r: int, g: int, b: int, a: int = 255) -> bool:
    return max(r, g, b) > 45 and a > 10


def tight_bbox(im: Image.Image, x0: int, x1: int, y0: int, y1: int) -> tuple[int, int, int, int]:
    px = im.load()
    xs: list[int] = []
    ys: list[int] = []
    for y in range(y0, y1):
        for x in range(x0, x1):
            r, g, b, a = px[x, y]
            if is_bright(r, g, b, a):
                xs.append(x)
                ys.append(y)
    if not xs:
        raise ValueError(f"Пустая ячейка ({x0},{y0})-({x1},{y1})")
    return min(xs), min(ys), max(xs), max(ys)


def crop_cell(im: Image.Image, box: tuple[int, int, int, int], pad: int = 4) -> Image.Image:
    x0, x1, y0, y1 = box
    left, top, right, bottom = tight_bbox(im, x0, x1, y0, y1)
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(im.width - 1, right + pad)
    bottom = min(im.height - 1, bottom + pad)
    return im.crop((left, top, right + 1, bottom + 1))


def is_sheet_black(r: int, g: int, b: int, a: int) -> bool:
    """Чёрный фон листа макета — делаем прозрачным."""
    if a < 10:
        return True
    return max(r, g, b) < 42


def key_sheet_black(im: Image.Image) -> Image.Image:
    out = im.convert("RGBA")
    px = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_sheet_black(r, g, b, a):
                px[x, y] = (0, 0, 0, 0)
    return out


def trim_alpha(im: Image.Image, pad: int = 2) -> Image.Image:
    px = im.load()
    w, h = im.size
    xs: list[int] = []
    ys: list[int] = []
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 8:
                xs.append(x)
                ys.append(y)
    if not xs:
        return im
    left = max(0, min(xs) - pad)
    top = max(0, min(ys) - pad)
    right = min(w - 1, max(xs) + pad)
    bottom = min(h - 1, max(ys) + pad)
    return im.crop((left, top, right + 1, bottom + 1))


def export_square(cell: Image.Image, size: int) -> Image.Image:
    cell = key_sheet_black(cell)
    cell = trim_alpha(cell)
    w, h = cell.size
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    ox = (side - w) // 2
    oy = (side - h) // 2
    canvas.paste(cell, (ox, oy), cell if cell.mode == "RGBA" else None)
    return canvas.resize((size, size), Image.Resampling.LANCZOS)


def split_sheet(source: Path, out_dir: Path, size: int) -> None:
    im = Image.open(source).convert("RGBA")
    out_dir.mkdir(parents=True, exist_ok=True)

    for milestone, box in zip(MILESTONES, CELL_BOXES, strict=True):
        cell = crop_cell(im, box)
        square = export_square(cell, size)
        square.save(out_dir / f"classic-{milestone}.png", optimize=True)
        print(f"  classic-{milestone}.png  ({square.size[0]}x{square.size[1]})")

    # Промежуточные вехи без отдельного арта — копии соседних
    for src, dst in [(100, 150), (100, 200)]:
        shutil.copy2(out_dir / f"classic-{src}.png", out_dir / f"classic-{dst}.png")
        print(f"  classic-{dst}.png  (копия {src})")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--out", type=Path, default=OUT_DIR)
    parser.add_argument("--size", type=int, default=OUT_SIZE)
    args = parser.parse_args()
    if not args.source.is_file():
        raise SystemExit(f"Нет файла: {args.source}")
    print(f"Источник: {args.source}")
    split_sheet(args.source, args.out, args.size)
    print(f"Готово: {args.out}")


if __name__ == "__main__":
    main()
