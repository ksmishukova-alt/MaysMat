import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task.ts";
import { resolveTaskFlow } from "../src/data/heads-legs/guided/task-flow.ts";
import { inferTaskEntities } from "../src/data/heads-legs/guided/participants.ts";
import { inferFeatureTable } from "../src/data/heads-legs/guided/feature-table.ts";
import { skipsDefaultParticipant } from "../src/data/heads-legs/guided/custom/index.ts";

const tasks = Object.values(HEADS_LEGS_TASKS).sort((a, b) => a.number - b.number);

for (const t of tasks) {
  const m = t.headsLegsMeta;
  if (!m) continue;
  const flow = resolveTaskFlow(m);
  const ents = inferTaskEntities(m.condition, m.methodTaskId, m.solutionLines);
  const feat = flow.featureTable
    ? inferFeatureTable(m.condition, ents, m.solutionLines ?? [], m.methodTaskId)
    : null;
  const issues = [];
  if (/вид\s*[12]/i.test(ents.map((e) => e.label).join("|"))) issues.push("generic entities");
  if (ents.length > 2 && flow.assumptionStep) issues.push("3+ types with assumption");
  if (ents.length > 2 && flow.featureTable && feat?.length === 2)
    issues.push("feature table only 2 rows for 3+ types");
  if (ents.length > 2 && !skipsDefaultParticipant(m.methodTaskId) && flow.profile === "classic")
    issues.push("3+ types on classic flow");
  if (feat?.some((r) => /^(Вася|Комнате|Вид|Люди|Машины)/i.test(r.label)))
    issues.push(`bad feature: ${feat.map((r) => r.label).join(",")}`);
  const drag = t.steps.find((s) => s.type === "drag_select");
  const dragLabels = drag?.options?.filter((o) => o.correct).map((o) => o.label) ?? [];
  if (ents.length > 2 && dragLabels.length < ents.length)
    issues.push(`drag missing types: ${dragLabels.join("/")} vs ${ents.map((e) => e.label).join("/")}`);
  if (issues.length)
    console.log(`${m.methodTaskId}\t${t.id}\t${ents.map((e) => e.label).join(" | ")}\t${flow.profile}\t${issues.join("; ")}`);
}
