/**
 * Генерирует src/data/heads-legs/catalog.generated.ts из method-heads-legs.txt
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = fs.readFileSync(
  path.join(root, "content/import/method-heads-legs.txt"),
  "utf8",
);

const lines = src.split(/\r?\n/);
const entries = [];

for (let i = 0; i < lines.length; i++) {
  const m = lines[i].match(/^(\d+)\.(\d+)\.\s+(.+)$/);
  if (!m) continue;
  const difficulty = Number(m[1]);
  const num = Number(m[2]);
  const title = m[3].trim();
  let condition = "";
  for (let j = i + 1; j < lines.length; j++) {
    if (lines[j].startsWith("Условие:")) {
      condition = lines[j].replace(/^Условие:\s*/, "").trim();
      break;
    }
    if (/^\d+\.\d+\./.test(lines[j])) break;
  }

  let solutionMode = "B";
  for (let j = i + 1; j < Math.min(i + 20, lines.length); j++) {
    const sm = lines[j].match(/Режим\s+([A-E](?:\/[A-E])*(?:\+)?)/i);
    if (sm) {
      const raw = sm[1].replace(/\+.*$/, "").split("/")[0];
      solutionMode = raw;
      break;
    }
  }

  entries.push({ difficulty, num, title, condition, solutionMode });
}

// Правки по ТЗ
const fix = entries.find((e) => e.difficulty === 1 && e.num === 13);
if (fix) {
  fix.condition =
    "На Альдераан высадилось несколько шагающих роботов AT-ST (трёхногие) и AT-AT (четырёхногие). В каждом роботе было по одному штурмовику. Всего на планете высадилось 12 роботов и 39 ног. Сколько высадилось штурмовиков?";
  fix.solutionMode = "C";
}

const fix61 = entries.find((e) => e.difficulty === 6 && e.num === 1);
if (fix61) {
  fix61.condition = fix61.condition.replace(
    /Сколько было захвачено генералов.*/,
    "Сколько генералов было захвачено всего?",
  );
}

let globalNum = 0;
const out = entries.map((e) => {
  globalNum++;
  const id = `heads-legs-${e.difficulty}-${String(e.num).padStart(2, "0")}`;
  const methodTaskId = `${e.difficulty}.${e.num}`;
  return {
    id,
    methodTaskId,
    number: globalNum,
    title: e.title,
    condition: e.condition,
    difficultyLevel: e.difficulty,
    patternId: e.difficulty,
    solutionMode: e.solutionMode,
    stage: e.difficulty,
  };
});

const ts = `/** AUTO-GENERATED — scripts/generate-heads-legs-catalog.mjs */
import type { HeadsLegsCatalogEntry } from "./types";

export const HEADS_LEGS_CATALOG: HeadsLegsCatalogEntry[] = ${JSON.stringify(out, null, 2)} as HeadsLegsCatalogEntry[];
`;

fs.writeFileSync(path.join(root, "src/data/heads-legs/catalog.generated.ts"), ts);
console.log(`Generated ${out.length} catalog entries`);
