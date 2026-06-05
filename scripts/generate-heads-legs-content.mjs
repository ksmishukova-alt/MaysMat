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

const DEV_CHECKLIST_MARKERS = [
  /чек-лист/i,
  /разработчик/i,
  /режима\s+[A-E]/i,
  /Не использовать один общий шаблон/i,
  /min_count:/i,
];

function parseSolutionLines(blockLines, methodTaskId) {
  const result = [];
  for (const raw of blockLines) {
    const line = raw.trim();
    if (!line) continue;
    if (
      line.startsWith("Методическая") ||
      line.startsWith("Пошаговые") ||
      /^\d+\.\s/.test(line) ||
      DEV_CHECKLIST_MARKERS.some((re) => re.test(line))
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
    { template: "Представим, что все роботы — AT-ST (по [3] ноги).", blanks: [] },
    { template: "Тогда ног было бы [12 × 3 = 36].", blanks: [] },
    { template: "Лишних ног [39 − 36 = 3].", blanks: [] },
    { template: "Замена одного AT-ST на AT-AT добавляет [1] ногу.", blanks: [] },
    { template: "Роботов AT-AT [3 ÷ 1 = 3], роботов AT-ST [12 − 3 = 9].", blanks: [] },
    { template: "Проверка: [9×3 + 3×4 = 39] ног.", blanks: [] },
    { template: "Ответ: [9 роботов AT-ST и 3 робота AT-AT].", blanks: [] },
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

function stripDevChecklist(solutionLines) {
  const cutIdx = solutionLines.findIndex((line) =>
    DEV_CHECKLIST_MARKERS.some((re) => re.test(line.template)),
  );
  return cutIdx >= 0 ? solutionLines.slice(0, cutIdx) : solutionLines;
}

function postProcessSolutionLines(methodTaskId, solutionLines) {
  let lines = solutionLines;
  if (SOLUTION_OVERRIDES[methodTaskId]) {
    const raw = SOLUTION_OVERRIDES[methodTaskId];
    lines = raw.map((line, li) => {
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
  return stripDevChecklist(lines);
}

/** Рекомендованный порядок сложности (аудит ветки, §5) */
const CATALOG_ORDER = [
  "1.1",
  "1.2",
  "1.3",
  "1.4",
  "1.6",
  "1.7",
  "1.10",
  "1.5",
  "1.8",
  "1.13",
  "2.1",
  "2.2",
  "2.3",
  "2.4",
  "2.5",
  "2.6",
  "2.7",
  "1.9",
  "1.11",
  "1.14",
  "3.2",
  "3.3",
  "3.4",
  "3.5",
  "3.6",
  "3.7",
  "4.1",
  "4.2",
  "4.3",
  "4.4",
  "4.5",
  "5.1",
  "5.2",
  "5.3",
  "5.4",
  "5.5",
  "5.6",
  "5.7",
  "6.1",
  "6.2",
  "6.3",
  "6.4",
  "3.1",
  "6.5",
  "7.6",
  "7.1",
  "7.2",
  "7.3",
  "7.4",
  "7.5",
  "7.7",
];

const PEDAGOGICAL_LEVEL_BY_ID = Object.fromEntries(
  [
    ["1.1", "1.2", "1.3", "1.4", "1.6", "1.7", "1.10"],
    ["1.5", "1.8", "1.13", "2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7"],
    ["1.9", "1.11", "1.14"],
    ["3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "4.1", "4.2", "4.3", "4.4", "4.5"],
    ["5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7"],
    ["6.1", "6.2", "6.3", "6.4"],
    ["3.1", "6.5", "7.6"],
    ["7.1", "7.2", "7.3", "7.4", "7.5", "7.7"],
  ].flatMap((ids, idx) => ids.map((id) => [id, idx + 1])),
);

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

// Правки ТЗ / аудит P0–P1
const fix113 = entries.find((e) => e.methodTaskId === "1.13");
if (fix113) {
  fix113.condition =
    "На Альдераан высадилось несколько шагающих роботов AT-ST (трёхногие) и AT-AT (четырёхногие). Всего высадилось 12 роботов и 39 ног. Сколько роботов AT-ST и сколько AT-AT?";
  fix113.solutionMode = "C";
}

const fix61 = entries.find((e) => e.methodTaskId === "6.1");
if (fix61) {
  fix61.condition =
    "Дарт Вейдер захватил 40 баз повстанцев. На каждой базе он захватывал 12 генералов, 15 адмиралов или 17 дипломатов. Известно, что адмиралов было в два раза меньше, чем дипломатов, и всего был захвачен 571 пленник. Сколько генералов было захвачено всего?";
}

const fix31 = entries.find((e) => e.methodTaskId === "3.1");
if (fix31) {
  fix31.condition =
    "Учительница проверила всего 42 задачи. Каждый третьеклассник решил по 3 задачи, а каждый пятиклассник — по 5. Сколько было третьеклассников и пятиклассников?";
}

const fix65 = entries.find((e) => e.methodTaskId === "6.5");
if (fix65) {
  fix65.condition = fix65.condition.replace(
    /Сколько лет[^?]*\?/i,
    "Найди все возможные варианты: сколько лет каждый мастер обучал юнлингов.",
  );
}

const byMethodId = Object.fromEntries(entries.map((e) => [e.methodTaskId, e]));
for (const id of CATALOG_ORDER) {
  if (!byMethodId[id]) {
    throw new Error(`CATALOG_ORDER: нет задачи ${id} в исходнике`);
  }
}
const orderedEntries = CATALOG_ORDER.map((id) => byMethodId[id]);

let globalNum = 0;
const catalog = orderedEntries.map((e) => {
  globalNum++;
  const pedagogicalLevel = PEDAGOGICAL_LEVEL_BY_ID[e.methodTaskId] ?? e.difficulty;
  return {
    id: `heads-legs-${e.difficulty}-${String(e.num).padStart(2, "0")}`,
    methodTaskId: e.methodTaskId,
    number: globalNum,
    title: e.title,
    condition: e.condition,
    difficultyLevel: e.difficulty,
    patternId: e.difficulty,
    solutionMode: e.solutionMode,
    stage: pedagogicalLevel,
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
