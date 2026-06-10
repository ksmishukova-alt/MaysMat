/**
 * Безопасная зачистка chess-board: flood-fill серых клеток от краёв.
 * node scripts/fix-entry-diagnostic-png-alpha.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "entry-diagnostic");

const TARGETS = [
  ...fs
    .readdirSync(path.join(ROOT, "characters"))
    .filter((f) => f.endsWith(".png"))
    .map((f) => `characters/${f}`),
  "parkomat/myshmat-car.png",
];

function isGrayCheckerCell(r, g, b) {
  if (!isNeutral(r, g, b)) return false;
  const avg = avgRgb(r, g, b);
  return avg >= 185 && avg <= 248;
}

function isNeutral(r, g, b) {
  return Math.abs(r - g) <= 12 && Math.abs(g - b) <= 12;
}

function avgRgb(r, g, b) {
  return (r + g + b) / 3;
}

async function fixPng(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return;

  const { data, info } = await sharp(abs).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const queue = [];

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (visited[i]) return;
    const p = i * channels;
    if (!isGrayCheckerCell(data[p], data[p + 1], data[p + 2])) return;
    visited[i] = 1;
    queue.push([x, y]);
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }

  while (queue.length) {
    const [x, y] = queue.pop();
    const p = (y * width + x) * channels;
    data[p + 3] = 0;
    push(x - 1, y);
    push(x + 1, y);
    push(x, y - 1);
    push(x, y + 1);
  }

  // Белые клетки board, примыкающие к уже прозрачным
  const whiteQueue = [];
  const whiteVisited = new Uint8Array(width * height);
  const pushWhite = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const i = y * width + x;
    if (whiteVisited[i]) return;
    const p = i * channels;
    if (data[p + 3] === 0) {
      whiteVisited[i] = 1;
      whiteQueue.push([x, y]);
      return;
    }
    if (!isNeutral(data[p], data[p + 1], data[p + 2])) return;
    if (avgRgb(data[p], data[p + 1], data[p + 2]) < 249) return;
    whiteVisited[i] = 1;
    whiteQueue.push([x, y]);
  };

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const i = y * width + x;
      if (data[i * channels + 3] === 0) pushWhite(x, y);
    }
  }

  while (whiteQueue.length) {
    const [x, y] = whiteQueue.pop();
    const p = (y * width + x) * channels;
    if (data[p + 3] !== 0) data[p + 3] = 0;
    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const ni = ny * width + nx;
      if (whiteVisited[ni]) continue;
      const np = ni * channels;
      if (data[np + 3] === 0) {
        whiteVisited[ni] = 1;
        whiteQueue.push([nx, ny]);
        continue;
      }
      if (!isNeutral(data[np], data[np + 1], data[np + 2])) continue;
      if (avgRgb(data[np], data[np + 1], data[np + 2]) < 249) continue;
      whiteVisited[ni] = 1;
      whiteQueue.push([nx, ny]);
    }
  }

  const buf = await sharp(data, { raw: { width, height, channels } }).png().toBuffer();
  const out = `${abs}.new`;
  fs.writeFileSync(out, buf);
  fs.unlinkSync(abs);
  fs.renameSync(out, abs);
  console.log("fixed", relPath);
}

for (const rel of TARGETS) {
  await fixPng(rel);
}

console.log("Done.");
