"""Нарезка листов аватаров 4×2 на отдельные PNG с фоном #FEE499."""

from __future__ import annotations

import argparse
import math
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "avatars"
OUT_SIZE = 512
# Чуть уменьшаем персонажа, чтобы не обрезало в круге UI
SCALE_FACTOR = 1.03
# Запас вокруг персонажа при нарезке квадрата
CELL_MARGIN = 0.14

GIRLS_SHEET = ROOT / "scripts" / "avatar-source-girls.png"
BOYS_SHEET = ROOT / "scripts" / "avatar-source-boys.png"


def sample_sheet_bg(im: Image.Image) -> tuple[int, int, int]:
    w, h = im.size
    corners = [(2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3)]
    rs: list[int] = []
    gs: list[int] = []
    bs: list[int] = []
    for x, y in corners:
        r, g, b, _a = im.getpixel((x, y))
        rs.append(r)
        gs.append(g)
        bs.append(b)
    return (sum(rs) // 4, sum(gs) // 4, sum(bs) // 4)


def is_black(r: int, g: int, b: int) -> bool:
    return r < 35 and g < 35 and b < 35


def is_sheet_bg(
    r: int,
    g: int,
    b: int,
    sheet_bg: tuple[int, int, int] | None,
    tolerance: int = 22,
) -> bool:
    if sheet_bg is None:
        return False
    return (
        abs(r - sheet_bg[0]) <= tolerance
        and abs(g - sheet_bg[1]) <= tolerance
        and abs(b - sheet_bg[2]) <= tolerance
    )


def is_foreground(
    r: int,
    g: int,
    b: int,
    a: int,
    sheet_bg: tuple[int, int, int] | None,
) -> bool:
    if a < 20:
        return False
    if is_black(r, g, b):
        return False
    if is_sheet_bg(r, g, b, sheet_bg):
        return False
    return True


def column_bounds(
    width: int,
    pixels: list[tuple[int, int, int, int]],
) -> list[tuple[int, int]]:
    col_sum = [0] * width
    for x, y, _r, _g, _b in pixels:
        col_sum[x] += 1
    thresh = max(col_sum) * 0.05
    blocks: list[tuple[int, int]] = []
    in_block = False
    start = 0
    for x, s in enumerate(col_sum):
        if s > thresh and not in_block:
            in_block = True
            start = x
        elif s <= thresh and in_block:
            in_block = False
            blocks.append((start, x - 1))
    if in_block:
        blocks.append((start, width - 1))
    return blocks


def row_bounds(
    height: int,
    pixels: list[tuple[int, int, int, int]],
) -> list[tuple[int, int]]:
    row_sum = [0] * height
    for x, y, _r, _g, _b in pixels:
        row_sum[y] += 1
    thresh = max(row_sum) * 0.05
    blocks: list[tuple[int, int]] = []
    in_block = False
    start = 0
    for y, s in enumerate(row_sum):
        if s > thresh and not in_block:
            in_block = True
            start = y
        elif s <= thresh and in_block:
            in_block = False
            blocks.append((start, y - 1))
    if in_block:
        blocks.append((start, height - 1))
    return blocks


def foreground_pixels(
    im: Image.Image,
    sheet_bg: tuple[int, int, int] | None,
) -> list[tuple[int, int, int, int]]:
    w, h = im.size
    out: list[tuple[int, int, int, int]] = []
    px = im.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_foreground(r, g, b, a, sheet_bg):
                out.append((x, y, r, g, b))
    return out


def strip_background(
    im: Image.Image,
    sheet_bg: tuple[int, int, int] | None,
) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 128:
                continue
            if is_black(r, g, b) or is_sheet_bg(r, g, b, sheet_bg):
                px[x, y] = (0, 0, 0, 0)
    return im


def measure_content(im: Image.Image) -> tuple[float, float, float]:
    sheet_bg = sample_sheet_bg(im) if has_uniform_bg(im) else None
    pts = foreground_pixels(im, sheet_bg)
    if not pts:
        w, h = im.size
        return w / 2, h / 2, min(w, h) / 2
    cx = sum(p[0] for p in pts) / len(pts)
    cy = sum(p[1] for p in pts) / len(pts)
    radius = max(math.hypot(p[0] - cx, p[1] - cy) for p in pts)
    return cx, cy, radius


def has_uniform_bg(im: Image.Image) -> bool:
    bg = sample_sheet_bg(im)
    # Чёрный лист — фон не однородный жёлтый
    if is_black(*bg):
        return False
    return bg[0] > 180 and bg[1] > 160 and bg[2] > 100


def extract_square_cell(
    im: Image.Image,
    x0: int,
    y0: int,
    x1: int,
    y1: int,
    sheet_bg: tuple[int, int, int] | None,
) -> Image.Image:
    """Квадратный кроп по центру ячейки с запасом и заливкой фона листа."""
    w, h = im.size
    cell_w = x1 - x0 + 1
    cell_h = y1 - y0 + 1
    cx = (x0 + x1) / 2
    cy = (y0 + y1) / 2
    side = math.ceil(max(cell_w, cell_h) * (1 + CELL_MARGIN))
    left = int(round(cx - side / 2))
    top = int(round(cy - side / 2))

    fill: tuple[int, int, int, int] = (
        (*sheet_bg, 255) if sheet_bg else (0, 0, 0, 0)
    )
    square = Image.new("RGBA", (side, side), fill)

    src_left = max(0, left)
    src_top = max(0, top)
    src_right = min(w, left + side)
    src_bottom = min(h, top + side)
    dst_left = src_left - left
    dst_top = src_top - top
    patch = im.crop((src_left, src_top, src_right, src_bottom))
    square.paste(patch, (dst_left, dst_top))
    return square


def render_cell(cell: Image.Image, sheet_bg: tuple[int, int, int] | None) -> Image.Image:
    if sheet_bg is not None:
        target = int(round(OUT_SIZE * SCALE_FACTOR))
        scaled = cell.resize((target, target), Image.Resampling.LANCZOS)
        out = Image.new("RGBA", (OUT_SIZE, OUT_SIZE), (*sheet_bg, 255))
        offset = (OUT_SIZE - target) // 2
        out.paste(scaled, (offset, offset), scaled)
        return out

    content = strip_background(cell, None)
    cx, cy, radius = measure_content(content)
    if radius < 1:
        radius = min(content.size) / 2

    target_r = OUT_SIZE / 2 - 2
    scale = (target_r / radius) * SCALE_FACTOR

    new_w = max(1, int(round(content.width * scale)))
    new_h = max(1, int(round(content.height * scale)))
    scaled = content.resize((new_w, new_h), Image.Resampling.LANCZOS)

    out = Image.new("RGBA", (OUT_SIZE, OUT_SIZE), (0, 0, 0, 0))
    paste_x = int(round(OUT_SIZE / 2 - cx * scale))
    paste_y = int(round(OUT_SIZE / 2 - cy * scale))
    out.paste(scaled, (paste_x, paste_y), scaled)
    return out


def split_sheet(sheet_path: Path, folder: str, prefix: str) -> None:
    im = Image.open(sheet_path).convert("RGBA")
    w, h = im.size
    sheet_bg = sample_sheet_bg(im) if has_uniform_bg(im) else None
    pts = foreground_pixels(im, sheet_bg)
    cols = column_bounds(w, pts)
    rows = row_bounds(h, pts)
    if len(cols) != 4 or len(rows) != 2:
        raise RuntimeError(
            f"{sheet_path.name}: ожидалась сетка 4x2, получено {len(cols)}x{len(rows)}"
        )

    dest = ASSETS / folder
    dest.mkdir(parents=True, exist_ok=True)

    idx = 1
    for _row_i, (y0, y1) in enumerate(rows):
        for _col_i, (x0, x1) in enumerate(cols):
            square = extract_square_cell(im, x0, y0, x1, y1, sheet_bg)
            avatar = render_cell(square, sheet_bg)
            out_path = dest / f"{prefix}-{idx}.png"
            avatar.save(out_path, optimize=True)
            print(f"  {out_path.name} ({avatar.size[0]}x{avatar.size[1]})")
            idx += 1

    sheet_dest = ASSETS / f"{prefix}-sheet.png"
    im.save(sheet_dest, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--only",
        choices=("girls", "boys", "all"),
        default="all",
        help="Какой лист нарезать",
    )
    args = parser.parse_args()

    if args.only in ("girls", "all"):
        print("Devochki:")
        split_sheet(GIRLS_SHEET, "girls", "girls")
    if args.only in ("boys", "all"):
        print("Malchiki:")
        split_sheet(BOYS_SHEET, "boys", "boys")
    print("Gotovo.")


if __name__ == "__main__":
    main()
