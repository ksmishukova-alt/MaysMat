/**
 * Генерирует catalog + solution-lines + hints для всех 51 задач из method-heads-legs.txt
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

function classifyBlank(content) {
  const c = content.trim();
  if (/^[\d\s]+$/.test(c) && /\d/.test(c)) {
    const n = Number(c.replace(/\s/g, ""));
    if (!Number.isNaN(n)) return { type: "number", accept: [c, n] };
  }
  if (/[x×÷/+\-=]/.test(c) || /\d+\s*[x×]/.test(c)) {
    return { type: "expression", accept: [c] };
  }
  if (/^нельзя|не\s*хватает|единственн/i.test(c)) {
    return { type: "conclusion", accept: [c] };
  }
  if (/^ответ:/i.test(c) || c.length > 20) {
    return { type: "conclusion", accept: [c] };
  }
  return { type: "object", accept: [c] };
}

function parseSolutionLines(blockLines, methodTaskId) {
  const result = [];
  for (const raw of blockLines) {
    const line = raw.trim();
    if (!line) continue;
    if (
      line.startsWith("Методическая") ||
      line.startsWith("Пошаговые") ||
      /^\d+\.\s/.test(line)
    ) {
      break;
    }

    const blanks = [];
    let bi = 0;
    const re = /\[([^\]]+)\]/g;
    let m;
    while ((m = re.exec(line)) !== null) {
      const cls = classifyBlank(m[1]);
      blanks.push({
        id: `${methodTaskId}-b-${result.length}-${bi++}`,
        type: cls.type,
        accept: cls.accept,
        placeholder: m[1].length > 12 ? "…" : undefined,
      });
    }

    result.push({ template: line, blanks });
  }
  return result;
}

const SOLUTION_OVERRIDES = {
  "1.13": [
    { template: "Всего роботов [12], всего ног [39].", blanks: [] },
    { template: "Пусть AT-AT будет [3], тогда AT-ST [9].", blanks: [] },
    { template: "Проверка: [3×4 + 9×3 = 39] ног.", blanks: [] },
    { template: "В каждом роботе [1] штурмовик, значит штурмовиков [12].", blanks: [] },
    { template: "Ответ: [12 штурмовиков].", blanks: [] },
  ],
  "2.1": [
    { template: "Представим, что все клумбы были около [Гимназии].", blanks: [] },
    { template: "Тогда цветков было бы [11 x 19 = 209].", blanks: [] },
    { template: "По условию цветков [225].", blanks: [] },
    { template: "Лишних цветков [225 - 209 = 16].", blanks: [] },
    { template: "Одна клумба около Лицея добавляет [23 - 19 = 4] цветка.", blanks: [] },
    { template: "Клумб около Лицея было [16 ÷ 4 = 4].", blanks: [] },
    { template: "Клумб около Гимназии было [11 - 4 = 7].", blanks: [] },
    { template: "Ответ: [4 клумбы около Лицея и 7 клумб около Гимназии].", blanks: [] },
  ],
};

function postProcessSolutionLines(methodTaskId, solutionLines) {
  if (SOLUTION_OVERRIDES[methodTaskId]) {
    const raw = SOLUTION_OVERRIDES[methodTaskId];
    return raw.map((line, li) => {
      const blanks = [];
      let bi = 0;
      const re = /\[([^\]]+)\]/g;
      let m;
      while ((m = re.exec(line.template)) !== null) {
        const cls = classifyBlank(m[1]);
        blanks.push({
          id: `${methodTaskId}-b-${li}-${bi++}`,
          type: cls.type,
          accept: cls.accept,
        });
      }
      return { template: line.template, blanks };
    });
  }
  return solutionLines;
}

const DEFAULT_HINTS = {
  1: [
    "Начни с «Представим, что все объекты одного вида…»",
    "Посчитай, сколько получилось бы, и сравни с условием.",
    "Разницу подели на шаг замены одного объекта на другой.",
  ],
  2: [
    "Запиши, сколько даёт один объект каждого вида.",
    "Представим, что все объекты «дешевле» или «легче».",
    "Найди разницу и подели на шаг замены.",
  ],
  3: [
    "Проверь, есть ли в условии общее число участников.",
    "Если данных не хватает — перебери положительные варианты.",
    "Запиши проверку для каждого подходящего варианта.",
  ],
  4: [
    "Помни: если названы оба типа, ноль не подходит.",
    "Сначала найди общее число, потом замену.",
    "Ответ — полным предложением.",
  ],
  5: [
    "Выдели все числа из условия в модель.",
    "Запиши каждый шаг отдельной строкой.",
    "В конце — «Ответ:» с числами из вопроса.",
  ],
  6: [
    "Можно объединить типы в группу — ищи одинаковые пары.",
    "Если ответов несколько — перечисли все.",
    "Проверь, что сумма сходится.",
  ],
  7: [
    "Ищи ключевое равенство в условии — с него начинается решение.",
    "Сначала найди соотношение количеств, потом числа.",
    "Если данных мало — объясни, чего не хватает.",
  ],
};

const entries = [];
const solutionMap = {};
const hintsMap = {};

for (let i = 0; i < lines.length; i++) {
  const hm = lines[i].match(/^(\d+)\.(\d+)\.\s+(.+)$/);
  if (!hm) continue;

  const difficulty = Number(hm[1]);
  const num = Number(hm[2]);
  const title = hm[3].trim();
  const methodTaskId = `${difficulty}.${num}`;

  let condition = "";
  let solutionMode = "B";
  const solutionBlock = [];
  let inSolution = false;

  for (let j = i + 1; j < lines.length; j++) {
    if (/^\d+\.\d+\.\s/.test(lines[j]) && j > i + 1) break;
    if (lines[j].startsWith("Сложность ")) break;

    if (lines[j].startsWith("Условие:")) {
      condition = lines[j].replace(/^Условие:\s*/, "").trim();
      continue;
    }

    const sm = lines[j].match(/Режим\s+([A-E](?:\/[A-E])*(?:\+)?)/i);
    if (sm) {
      solutionMode = sm[1].replace(/\+.*$/, "").split("/")[0];
      continue;
    }

    if (lines[j].includes("Текстовое решение с блоками")) {
      inSolution = true;
      continue;
    }

    if (inSolution) {
      if (
        lines[j].startsWith("Методическая") ||
        lines[j].startsWith("Пошаговые действия") ||
        lines[j].startsWith("Сбор модели")
      ) {
        break;
      }
      if (lines[j].trim()) solutionBlock.push(lines[j]);
    }
  }

  let parsed = parseSolutionLines(solutionBlock, methodTaskId);
  parsed = postProcessSolutionLines(methodTaskId, parsed);
  solutionMap[methodTaskId] = parsed;
  hintsMap[methodTaskId] = DEFAULT_HINTS[difficulty] ?? DEFAULT_HINTS[1];

  entries.push({ difficulty, num, title, condition, solutionMode, methodTaskId });
}

// Правки ТЗ
const fix113 = entries.find((e) => e.methodTaskId === "1.13");
if (fix113) {
  fix113.condition =
    "На Альдераан высадилось несколько шагающих роботов AT-ST (трёхногие) и AT-AT (четырёхногие). В каждом роботе было по одному штурмовику. Всего на планете высадилось 12 роботов и 39 ног. Сколько высадилось штурмовиков?";
  fix113.solutionMode = "C";
}

const fix61 = entries.find((e) => e.methodTaskId === "6.1");
if (fix61) {
  fix61.condition = fix61.condition.replace(
    /Сколько было захвачено генералов.*/,
    "Сколько генералов было захвачено всего?",
  );
}

let globalNum = 0;
const catalog = entries.map((e) => {
  globalNum++;
  return {
    id: `heads-legs-${e.difficulty}-${String(e.num).padStart(2, "0")}`,
    methodTaskId: e.methodTaskId,
    number: globalNum,
    title: e.title,
    condition: e.condition,
    difficultyLevel: e.difficulty,
    patternId: e.difficulty,
    solutionMode: e.solutionMode,
    stage: e.difficulty,
  };
});

const outDir = path.join(root, "src/data/heads-legs");

fs.writeFileSync(
  path.join(outDir, "catalog.generated.ts"),
  `/** AUTO-GENERATED — scripts/generate-heads-legs-content.mjs */
import type { HeadsLegsCatalogEntry } from "./types";

export const HEADS_LEGS_CATALOG: HeadsLegsCatalogEntry[] = ${JSON.stringify(catalog, null, 2)} as HeadsLegsCatalogEntry[];
`,
);

fs.writeFileSync(
  path.join(outDir, "solution-lines.generated.ts"),
  `/** AUTO-GENERATED — scripts/generate-heads-legs-content.mjs */
import type { SolutionLine } from "./types";

export const HEADS_LEGS_SOLUTION_LINES: Record<string, SolutionLine[]> = ${JSON.stringify(solutionMap, null, 2)} as Record<string, SolutionLine[]>;
`,
);

fs.writeFileSync(
  path.join(outDir, "hints.generated.ts"),
  `/** AUTO-GENERATED — scripts/generate-heads-legs-content.mjs */

export const HEADS_LEGS_HINTS: Record<string, [string, string, string]> = ${JSON.stringify(hintsMap, null, 2)};
`,
);

console.log(`Generated ${catalog.length} tasks, ${Object.keys(solutionMap).length} solution sets`);

const empty = Object.entries(solutionMap).filter(([, v]) => v.length === 0);
if (empty.length) console.warn("Empty solutions:", empty.map(([k]) => k).join(", "));
