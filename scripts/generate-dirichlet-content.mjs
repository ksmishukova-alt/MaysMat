/**
 * Генерирует каталог и вспомогательные данные ветки proof-dirichlet
 * из content/import/dirichlet-methodologies-config.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  buildEnrichedProofLines,
  buildProofCardOrder,
  parseTaskModel,
} from "./dirichlet-model-parser.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "src/data/dirichlet");

const CONFIG_CANDIDATES = [
  path.join(root, "content/import/dirichlet-methodologies-config.json"),
];

function isMethodologiesConfig(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Array.isArray(data.themes) && data.themes.length > 0;
  } catch {
    return false;
  }
}

function resolveConfigPath() {
  const candidates = [];
  for (const p of CONFIG_CANDIDATES) {
    if (fs.existsSync(p)) candidates.push(p);
  }

  const downloads = "C:/Users/Ivan/Downloads";
  if (fs.existsSync(downloads)) {
    for (const name of fs.readdirSync(downloads)) {
      if (name.includes("темам_config") && name.endsWith(".json")) {
        candidates.push(path.join(downloads, name));
      }
    }
    const nestedDir = fs
      .readdirSync(downloads)
      .find((name) => name.includes("Дирихле") && name.includes("смежные") && !name.endsWith(".zip"));
    if (nestedDir) {
      const nested = path.join(downloads, nestedDir);
      for (const name of fs.readdirSync(nested)) {
        if (name.includes("темам_config") && name.endsWith(".json")) {
          candidates.push(path.join(nested, name));
        }
      }
    }
  }

  for (const p of candidates) {
    if (isMethodologiesConfig(p)) return p;
  }
  throw new Error("Не найден config с полем themes (Методологии_пo_темам_config.json)");
}

function themeShort(themeId) {
  const m = themeId.match(/^T(\d+)_/);
  return m ? `t${m[1]}` : themeId.toLowerCase();
}

function makeTitle(statement, taskIdOld, childTitle, rank) {
  const first = statement.split(/\n|\.(?=\s)/)[0]?.trim() ?? "";
  if (first.length >= 12 && first.length <= 72) return first;
  if (first.length > 72) return `${first.slice(0, 69)}…`;
  return `${childTitle} · ${taskIdOld}`;
}

function parseAnswerKey(raw) {
  const key = raw.trim();
  let shortAnswer = null;
  let solutionKey = key;

  const answerMatch = key.match(/\bОтвет\s*:\s*/i);
  const keyMatch = key.match(/\bКлюч\s*:\s*/i);

  if (answerMatch) {
    const start = answerMatch.index + answerMatch[0].length;
    const end = keyMatch ? keyMatch.index : key.length;
    shortAnswer = key.slice(start, end).trim().replace(/\.\s*$/, "");
  }

  if (keyMatch) {
    solutionKey = key.slice(keyMatch.index + keyMatch[0].length).trim();
  } else if (answerMatch) {
    solutionKey = key.slice(answerMatch.index + answerMatch[0].length).trim();
  }

  const nums = [...new Set((solutionKey.match(/\d+/g) ?? []).map(Number))]
    .filter((n) => n > 1)
    .sort((a, b) => b - a)
    .slice(0, 5);

  const answerTokens = [];
  if (shortAnswer) {
    for (const part of shortAnswer.split(/[;,]/)) {
      const p = part.trim();
      if (p.length >= 2) answerTokens.push(p);
    }
  }

  return { shortAnswer, solutionKey, signatureNumbers: nums, answerTokens };
}

function inferStage(themeIndex, level) {
  const base = themeIndex + 1;
  if (level >= 2.5) return Math.min(9, base + 1);
  if (level >= 2) return Math.min(9, base);
  return Math.max(1, base);
}

function inferSolutionMode(level, writingMode) {
  if (writingMode.includes("карточ")) return "A";
  if (level >= 2.5) return "C";
  return "B";
}

/** Приоритет из аудита: OK → P2 → P1 → P0 */
const AUDIT_OK = new Set([
  "M0.1", "M0.2", "M1.3", "M2.1", "M2.4", "M1.5", "M2.6",
  "M4.2", "M4.4", "M4.11", "M4.12", "M4.21", "M7.1",
]);
const AUDIT_P0 = new Set([
  "M0.4", "M2.2", "M2.3", "M2.5", "M2.7", "M3.1", "M3.3", "M3.5",
  "M5.15", "M5.27", "M5.32", "M5.46", "M5.47", "M5.48",
]);
const AUDIT_P2 = new Set([
  "M1.2", "M5.30", "M7.30", "M9.1", "M9.10", "M9.27", "M9.32", "M9.37", "M9.57",
]);

/** Рекомендованный порядок внутри темы T1 (базовый Дирихле) */
const T1_CATALOG_ORDER = [
  "M0.1", "M0.2", "M1.3", "M2.1", "M2.4", "M1.5", "M2.6",
  "M0.3", "M1.1", "M1.2", "M1.4", "M2.2", "M0.4", "M2.3", "M2.5", "M2.7",
];

const THEME_CATALOG_ORDER = {
  T1_DIRICHLET_CORE: T1_CATALOG_ORDER,
  T2_UNLUCKY: ["M3.2", "M3.1", "M3.4", "M3.3", "M3.5"],
};

function auditSortKey(methodTaskId) {
  if (AUDIT_OK.has(methodTaskId)) return 0;
  if (AUDIT_P2.has(methodTaskId)) return 1;
  if (AUDIT_P0.has(methodTaskId)) return 3;
  return 2;
}

function reorderCatalogEntries(entries) {
  const byTheme = new Map();
  for (const e of entries) {
    if (!byTheme.has(e.themeId)) byTheme.set(e.themeId, []);
    byTheme.get(e.themeId).push(e);
  }

  const out = [];
  for (const [themeId, list] of byTheme) {
    const explicit = THEME_CATALOG_ORDER[themeId];
    if (explicit) {
      const byId = Object.fromEntries(list.map((e) => [e.methodTaskId, e]));
      for (const id of explicit) {
        if (byId[id]) out.push(byId[id]);
      }
      for (const e of list) {
        if (!explicit.includes(e.methodTaskId)) out.push(e);
      }
    } else {
      list.sort((a, b) => {
        const pa = auditSortKey(a.methodTaskId);
        const pb = auditSortKey(b.methodTaskId);
        if (pa !== pb) return pa - pb;
        return a.difficultyLevel - b.difficultyLevel;
      });
      out.push(...list);
    }
  }
  return out;
}

const CONDITION_PATCHES = {
  "M5.15":
    "В прямоугольнике 3×4 расположено 6 точек. Докажите, что среди них найдутся две точки, расстояние между которыми не превосходит √2.",
};

const ANSWER_KEY_PATCHES = {
  "M5.32":
    "Ответ: нельзя. Ключ: у скобки «П» три единичных отрезка — на каждом из 12 рёбер каркаса куба 2×2×2 нужны оба конца, но у одной детали только два конца; проволочный каркас из таких скобок невозможен.",
};

function tsKey(key) {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : JSON.stringify(key);
}

function tsString(value, indent = 0) {
  const pad = "  ".repeat(indent);
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return `[\n${value.map((v) => `${pad}  ${tsString(v, indent + 1)},`).join("\n")}\n${pad}]`;
  }
  const entries = Object.entries(value).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return "{}";
  return `{\n${entries
    .map(([k, v]) => `${pad}  ${tsKey(k)}: ${tsString(v, indent + 1)},`)
    .join("\n")}\n${pad}}`;
}

function main() {
  const configPath = resolveConfigPath();
  const importTarget = path.join(root, "content/import/dirichlet-methodologies-config.json");
  if (configPath !== importTarget) {
    fs.mkdirSync(path.dirname(importTarget), { recursive: true });
    fs.copyFileSync(configPath, importTarget);
    console.log(`Скопирован config → ${importTarget}`);
  }

  const config = JSON.parse(fs.readFileSync(importTarget, "utf8"));
  const themeBranches = JSON.parse(
    fs.readFileSync(path.join(root, "src/data/methodology-bank/theme-branches.json"), "utf8"),
  );
  const catalog = [];
  const hints = {};
  const answers = {};
  const solutionLines = {};
  const modelOverrides = {};
  const proofCards = {};
  const branchCounters = {};
  let globalNum = 0;

  config.themes.forEach((theme, themeIndex) => {
    const branchCfg = themeBranches[theme.theme_id];
    if (!branchCfg) {
      throw new Error(`Нет ветки для темы ${theme.theme_id}`);
    }
    const short = themeShort(theme.theme_id);
    for (const task of theme.tasks) {
      globalNum++;
      branchCounters[branchCfg.branchId] = (branchCounters[branchCfg.branchId] ?? 0) + 1;
      const branchNumber = branchCounters[branchCfg.branchId];
      const rank = String(task.theme_rank).padStart(2, "0");
      const id = `dirichlet-${short}-${rank}`;
      const methodTaskId = task.task_id_old;
      const rawAnswerKey = ANSWER_KEY_PATCHES[methodTaskId] ?? task.answer_key;
      const parsed = parseAnswerKey(rawAnswerKey);
      const flowId = task.flow_id;
      const model = parseTaskModel(task, flowId);
      const lines = buildEnrichedProofLines(model, flowId, methodTaskId);
      modelOverrides[methodTaskId] = model;
      proofCards[methodTaskId] = buildProofCardOrder(model, flowId);
      const level = Number(task.level) || 1;
      const solutionMode = inferSolutionMode(level, task.writing_mode ?? "");
      const conditionText = CONDITION_PATCHES[methodTaskId] ?? task.statement.trim();

      catalog.push({
        id,
        methodTaskId,
        number: branchNumber,
        globalNumber: globalNum,
        title: makeTitle(conditionText, methodTaskId, theme.child_title, task.theme_rank),
        condition: conditionText,
        difficultyLevel: Math.round(level * 10) / 10,
        stage: inferStage(themeIndex, level),
        themeId: theme.theme_id,
        themeTitle: theme.child_title,
        branchId: branchCfg.branchId,
        flowId,
        supportMode: task.support_mode,
        writingMode: task.writing_mode,
        solutionMode,
        sourcePi: task.source_pi,
      });

      const hintParts = [task.hint?.trim(), parsed.shortAnswer ? `Ответ: ${parsed.shortAnswer}` : ""].filter(
        Boolean,
      );
      hints[methodTaskId] = [
        hintParts[0] ?? "Найди «клетки» и «предметы» в условии.",
        hintParts[1] ?? "Сравни количество предметов и клеток.",
        parsed.solutionKey.slice(0, 180) + (parsed.solutionKey.length > 180 ? "…" : ""),
      ];

      answers[methodTaskId] = {
        kind: "proof",
        answerPhrase: parsed.shortAnswer ?? undefined,
        answerTokens: parsed.answerTokens.length ? parsed.answerTokens : undefined,
        signatureNumbers: parsed.signatureNumbers.length ? parsed.signatureNumbers : undefined,
        solutionReference: parsed.solutionKey,
      };

      solutionLines[methodTaskId] = lines;
    }
  });

  const orderedCatalog = reorderCatalogEntries(catalog);
  const branchCountersFinal = {};
  orderedCatalog.forEach((entry, idx) => {
    entry.globalNumber = idx + 1;
    branchCountersFinal[entry.branchId] = (branchCountersFinal[entry.branchId] ?? 0) + 1;
    entry.number = branchCountersFinal[entry.branchId];
  });

  fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, "catalog.generated.ts"),
    `/** AUTO-GENERATED — scripts/generate-dirichlet-content.mjs */\nimport type { DirichletCatalogEntry } from "./types";\n\nexport const DIRICHLET_CATALOG: DirichletCatalogEntry[] = ${tsString(orderedCatalog)};\n`,
    "utf8",
  );

  fs.writeFileSync(
    path.join(outDir, "hints.generated.ts"),
    `/** AUTO-GENERATED — scripts/generate-dirichlet-content.mjs */\nexport const DIRICHLET_HINTS: Record<string, [string, string, string]> = ${tsString(hints)};\n`,
    "utf8",
  );

  fs.writeFileSync(
    path.join(outDir, "answers.generated.ts"),
    `/** AUTO-GENERATED — scripts/generate-dirichlet-content.mjs */\nimport type { DirichletAcceptedAnswer } from "./types";\n\nexport const DIRICHLET_ANSWERS: Record<string, DirichletAcceptedAnswer> = ${tsString(answers)};\n`,
    "utf8",
  );

  fs.writeFileSync(
    path.join(outDir, "solution-lines.generated.ts"),
    `/** AUTO-GENERATED — scripts/generate-dirichlet-content.mjs */\nimport type { DirichletSolutionLine } from "./types";\n\nexport const DIRICHLET_SOLUTION_LINES: Record<string, DirichletSolutionLine[]> = ${tsString(solutionLines)};\n`,
    "utf8",
  );

  fs.writeFileSync(
    path.join(outDir, "guided/model-overrides.generated.ts"),
    `/** AUTO-GENERATED — scripts/generate-dirichlet-content.mjs */\nimport type { DirichletInferredModel } from "../types";\n\nexport const DIRICHLET_MODEL_OVERRIDES_GENERATED: Partial<\n  Record<string, Partial<DirichletInferredModel>>\n> = ${tsString(modelOverrides)};\n`,
    "utf8",
  );

  fs.writeFileSync(
    path.join(outDir, "proof-cards.generated.ts"),
    `/** AUTO-GENERATED — scripts/generate-dirichlet-content.mjs */\nimport type { OrderQuestionItem } from "@/data/tasks";\n\nexport const DIRICHLET_PROOF_CARDS: Record<string, OrderQuestionItem[]> = ${tsString(proofCards)};\n`,
    "utf8",
  );

  console.log(`Готово: ${orderedCatalog.length} задач в ${config.themes.length} темах`);
  console.log("По веткам:", branchCountersFinal);
}

main();
