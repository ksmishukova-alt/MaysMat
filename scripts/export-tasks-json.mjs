/**
 * Экспорт каталога задач в tasks.json (метаданные + fairy-caves).
 * Полный дамп со steps: npm run export:tasks:full (tsx).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function extractCatalogArray(filePath, exportName) {
  const src = fs.readFileSync(filePath, "utf8");
  const re = new RegExp(`export const ${exportName}[^=]*=\\s*(\\[[\\s\\S]*?\\])\\s*(?:as[^;]+)?;`);
  const m = src.match(re);
  if (!m) throw new Error(`Cannot parse ${exportName} from ${filePath}`);
  // eslint-disable-next-line no-new-func
  return new Function(`return ${m[1]}`)();
}

const hl = extractCatalogArray(
  path.join(root, "src/data/heads-legs/catalog.generated.ts"),
  "HEADS_LEGS_CATALOG",
).map((e) => ({
  ...e,
  branchId: "modeling-heads-legs",
}));

const dirichlet = extractCatalogArray(
  path.join(root, "src/data/dirichlet/catalog.generated.ts"),
  "DIRICHLET_CATALOG",
);

const fairyCaves = [
  {
    id: "fairy-caves-01",
    branchId: "fairy-caves",
    number: 1,
    title: "Первая пещера",
    condition:
      "В сказочной пещере живут двухголовые сороконожки и трёхголовые драконы. Всего у них 36 голов и 396 ног. Голов у всех сороконожек столько же, сколько голов у всех драконов.\n\nСколько ног у трёхголового дракона?",
    stage: 1,
    maxStars: 3,
    stepCount: 7,
  },
  {
    id: "fairy-caves-02",
    branchId: "fairy-caves",
    number: 2,
    title: "Вторая пещера",
    condition:
      "В другой пещере — одноголовые сорокonожки и четырёхголовые драконы. Всего 25 существ и 850 ног. Голов у сороконожек и драконов поровну.\n\nСколько ног у четырёхголового дракона?",
    stage: 1,
    maxStars: 3,
    stepCount: 7,
  },
  {
    id: "fairy-caves-03",
    branchId: "fairy-caves",
    number: 3,
    title: "Третья пещера",
    condition:
      "В третьей пещере — одноголовые сороконожки и пятиголовые драконы. Всего 420 ног. Голов у сорокonожек и драконов поровну.\n\nСколько ног у пятиголового дракона?",
    stage: 2,
    maxStars: 3,
    stepCount: 5,
  },
];

const tasks = [...hl, ...dirichlet, ...fairyCaves].sort((a, b) => {
  if (a.branchId !== b.branchId) return String(a.branchId).localeCompare(String(b.branchId));
  return a.number - b.number;
});

const out = {
  generatedAt: new Date().toISOString(),
  note: "Каталог задач. Полный экспорт со steps: npm run export:tasks:full",
  count: tasks.length,
  byBranch: tasks.reduce((acc, t) => {
    acc[t.branchId] = (acc[t.branchId] ?? 0) + 1;
    return acc;
  }, {}),
  tasks,
};

const outPath = path.join(root, "tasks.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.log(`Wrote ${tasks.length} tasks to ${outPath}`);
