"""Нарезка общего баннера графов на 4 иконки тем."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

SRC = Path(
    r"C:\Users\Ivan\.cursor\projects\c-Users-Ivan-album-myshleniya\assets"
    r"\c__Users_Ivan_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images"
    r"_ChatGPT_Image_3____._2026__.__00_27_10-18a98138-cbdd-4dae-9ace-e1875c8734be.png"
)
OUT_DIR = Path(r"C:\Users\Ivan\album-myshleniya\public\topics")

BRANCHES = [
    "graphs-vertices",
    "graphs-edges",
    "graphs-paths",
    "graphs-connectivity",
]


def is_black(r: int, g: int, b: int, a: int) -> bool:
    return a > 20 and r < 40 and g < 40 and b < 40


def is_bg(r: int, g: int, b: int, a: int) -> bool:
    if a < 20:
        return True
    if r < 40 and g < 40 and b < 40:
        return True
    if r > 235 and g > 235 and b > 235:
        return True
    if abs(r - g) < 18 and abs(g - b) < 18 and 165 <= r <= 225:
        return True
    return False


def content_bbox(img: Image.Image) -> tuple[int, int, int, int]:
    px = img.load()
    w, h = img.size
    min_x, min_y, max_x, max_y = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if not is_black(r, g, b, a) and a > 20:
                found = True
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if not found:
        return 0, 0, w, h
    pad = 8
    return (
        max(0, min_x - pad),
        max(0, min_y - pad),
        min(w, max_x + pad + 1),
        min(h, max_y + pad + 1),
    )


def remove_bg(img: Image.Image) -> Image.Image:
    from collections import deque

    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()
    visited = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            if is_bg(*px[x, y]):
                visited[y][x] = True
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not visited[y][x] and is_bg(*px[x, y]):
                visited[y][x] = True
                q.append((x, y))

    while q:
        x, y = q.popleft()
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx] and is_bg(*px[nx, ny]):
                visited[ny][nx] = True
                q.append((nx, ny))

    return img


def find_card_columns(img: Image.Image) -> list[tuple[int, int]]:
    """Ищем 4 колонки с карточками по вертикальным чёрным промежуткам."""
    px = img.load()
    w, h = img.size
    col_score = []
    for x in range(w):
        dark = sum(1 for y in range(h) if is_black(*px[x, y]))
        col_score.append(dark / h)

    # Центры четырёх равных зон + подрезка по плотности карточки
    bounds: list[tuple[int, int]] = []
    quarter = w // 4
    for i in range(4):
        start = i * quarter
        end = (i + 1) * quarter if i < 3 else w
        # сузить до области, где не сплошной чёрный
        left = start
        right = end
        for x in range(start, end):
            if col_score[x] < 0.92:
                left = x
                break
        for x in range(end - 1, start - 1, -1):
            if col_score[x] < 0.92:
                right = x + 1
                break
        bounds.append((left, right))
    return bounds


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    src = Image.open(SRC).convert("RGBA")
    columns = find_card_columns(src)

    for branch_id, (left, right) in zip(BRANCHES, columns, strict=True):
        tile = src.crop((left, 0, right, src.height))
        tile = tile.crop(content_bbox(tile))
        tile = remove_bg(tile)
        out = OUT_DIR / f"{branch_id}.png"
        tile.save(out)
        px = list(tile.getdata())
        t = sum(1 for p in px if p[3] < 20)
        print(f"{branch_id}: {tile.size[0]}x{tile.size[1]}, transparent {100 * t / len(px):.0f}%")


if __name__ == "__main__":
    main()
