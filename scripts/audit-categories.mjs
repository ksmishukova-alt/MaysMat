/**
 * Считает generic «Категории» и «Предметы из условия» после парсинга.
 * node scripts/audit-categories.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parseTaskModel } from "./dirichlet-model-parser.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(
  fs.readFileSync(path.join(root, "content/import/dirichlet-methodologies-config.json"), "utf8"),
);

const stats = { genericCell: 0, genericRabbit: 0, total: 0, byFlow: {} };

for (const theme of config.themes) {
  for (const task of theme.tasks) {
    stats.total++;
    const model = parseTaskModel(task, task.flow_id);
    const flow = task.flow_id;
    if (!stats.byFlow[flow]) stats.byFlow[flow] = { cell: 0, rabbit: 0, n: 0 };
    stats.byFlow[flow].n++;

    const cl = model.cells[0]?.label ?? "";
    const rl = model.rabbits[0]?.label ?? "";
    if (/^категории \(«клетки»\)$/i.test(cl)) {
      stats.genericCell++;
      stats.byFlow[flow].cell++;
    }
    if (/^предметы из условия$/i.test(rl)) {
      stats.genericRabbit++;
      stats.byFlow[flow].rabbit++;
    }
  }
}

console.log(JSON.stringify(stats, null, 2));
