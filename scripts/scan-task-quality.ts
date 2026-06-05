/**
 * QA-сканер банка задач → docs/task-quality-report.json
 * Запуск: npm run qa:task-quality
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { DIRICHLET_TASKS } from "../src/data/dirichlet/build-task";
import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";
import { isChildVisible } from "../src/data/task-publishing/resolve";
import type { QaIssue, QaStatus, PublishTier } from "../src/data/task-publishing/types";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const allTasks = { ...HEADS_LEGS_TASKS, ...DIRICHLET_TASKS };

interface TaskReportRow {
  id: string;
  branchId: string;
  methodTaskId?: string;
  publishTier: PublishTier;
  qaStatus: QaStatus;
  issues: QaIssue[];
  routeOrder?: number;
  childVisible: boolean;
}

const issuesByType: Partial<Record<QaIssue, number>> = {};
const rows: TaskReportRow[] = [];
let ready = 0;
let needsReview = 0;
let blocked = 0;
let childRouteCount = 0;

for (const task of Object.values(allTasks)) {
  const pub = task.publishing;
  if (!pub) continue;

  for (const issue of pub.issues) {
    issuesByType[issue] = (issuesByType[issue] ?? 0) + 1;
  }

  if (pub.qaStatus === "ready") ready++;
  else if (pub.qaStatus === "needsReview") needsReview++;
  else blocked++;

  if (isChildVisible(pub)) childRouteCount++;

  rows.push({
    id: task.id,
    branchId: task.branchId,
    methodTaskId: task.dirichletMeta?.methodTaskId ?? task.headsLegsMeta?.methodTaskId,
    publishTier: pub.publishTier,
    qaStatus: pub.qaStatus,
    issues: pub.issues,
    routeOrder: pub.routeOrder,
    childVisible: isChildVisible(pub),
  });
}

rows.sort((a, b) => (a.routeOrder ?? 9999) - (b.routeOrder ?? 9999));

const report = {
  generatedAt: new Date().toISOString(),
  totalTasks: rows.length,
  ready,
  needsReview,
  blocked,
  childRouteVisible: childRouteCount,
  issuesByType,
  tasks: rows,
};

const outPath = path.join(ROOT, "docs", "task-quality-report.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

console.log("=== QA: качество задач ===\n");
console.log(`Всего: ${report.totalTasks}`);
console.log(`ready: ${ready}, needsReview: ${needsReview}, blocked: ${blocked}`);
console.log(`В детском маршруте (видимо): ${childRouteCount}`);
console.log("issuesByType:", JSON.stringify(issuesByType));
console.log(`\nОтчёт: ${outPath}`);

const badChild = rows.filter((r) => r.childVisible && r.issues.length > 0);
if (badChild.length) {
  console.error("\nОШИБКА: в детском маршруте задачи с issues:");
  badChild.slice(0, 10).forEach((r) => console.error(" ", r.id, r.issues.join(", ")));
  process.exit(1);
}

const nm = issuesByType.contains_N_equals_N ?? 0;
const childNm = rows.filter(
  (r) => r.childVisible && r.issues.includes("contains_N_equals_N"),
).length;
if (childNm > 0) {
  console.error(`ОШИБКА: ${childNm} задач детского маршрута с N=N`);
  process.exit(1);
}

console.log("\n✓ Детский маршрут без блокирующих issues.");
process.exit(0);
