"""Убирает шахматный/белый фон из PNG иллюстраций тем. Запуск: python scripts/remove-topic-bg.py public/topics/logic-knights.png"""

from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image


def is_background(r: int, g: int, b: int, a: int) -> bool:
    if a < 20:
        return True
    # белый и шахматная сетка экспорта
    if r > 235 and g > 235 and b > 235:
        return True
    if abs(r - g) < 18 and abs(g - b) < 18 and 165 <= r <= 225:
        return True
    # чёрный фон из генератора
    if r < 35 and g < 35 and b < 35:
        return True
    # бежевый / кремовый градиент
    if r >= 198 and g >= 188 and b >= 168 and abs(r - g) < 22 and abs(g - b) < 35:
        return True
    return False


def flood_remove(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    px = img.load()
    visited = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            if is_background(*px[x, y]):
                visited[y][x] = True
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not visited[y][x] and is_background(*px[x, y]):
                visited[y][x] = True
                q.append((x, y))

    while q:
        x, y = q.popleft()
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx] and is_background(*px[nx, ny]):
                visited[ny][nx] = True
                q.append((nx, ny))

    for _ in range(3):
        to_clear: list[tuple[int, int]] = []
        for y in range(h):
            for x in range(w):
                r, g, b, a = px[x, y]
                if a == 0:
                    continue
                light_fringe = (r > 210 and g > 210 and b > 210) or (
                    r >= 198 and g >= 188 and b >= 168 and abs(r - g) < 22
                )
                dark_fringe = r < 45 and g < 45 and b < 45
                if not (light_fringe or dark_fringe):
                    continue
                for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                    if 0 <= nx < w and 0 <= ny < h and px[nx, ny][3] == 0:
                        to_clear.append((x, y))
                        break
        for x, y in to_clear:
            px[x, y] = (0, 0, 0, 0)

    img.save(path)
    print(f"OK: {path}")


if __name__ == "__main__":
    for arg in sys.argv[1:]:
        flood_remove(Path(arg))
