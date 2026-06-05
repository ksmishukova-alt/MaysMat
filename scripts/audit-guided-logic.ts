import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";
import { inferTaskEntities } from "../src/data/heads-legs/guided/participants";

const tasks = Object.values(HEADS_LEGS_TASKS).sort((a, b) => a.number - b.number);

for (const t of tasks) {
  const m = t.headsLegsMeta;
  if (!m) continue;
  const ents = inferTaskEntities(m.condition, m.methodTaskId, m.solutionLines);
  const issues: string[] = [];

  const table = t.steps.find((s) => s.type === "table_input");
  if (table) {
    for (const r of table.rows) {
      const ok = ents.some(
        (e) =>
          e.label.toLowerCase().includes(r.label.toLowerCase().slice(0, 4)) ||
          r.label.toLowerCase().includes(e.label.toLowerCase().slice(0, 4)),
      );
      if (!ok && r.label.length > 1 && !/^(Звери|Птицы|Гусята|Крокодил|Двух|Трёх|Стол|Дроид|Истреб|Крейс|Флагм|Мальчик|Девочк|Совят|Котят|Пирожн|Льв|Тигр|Собак|Кошк|Дрон|Табурет|Стул|Генерал|Адмирал|Дипломат)/i.test(r.label)) {
        issues.push(`table row "${r.label}"`);
      }
      if (/^(—|Комнате|Вася|Вид\s*1)/i.test(r.label)) issues.push(`bad table "${r.label}"`);
    }
  }

  const drag = t.steps.find((s) => s.type === "drag_select");
  if (drag && ents.length >= 3) {
    const correct = drag.options.filter((o) => o.correct);
    if (correct.length < ents.length) issues.push(`drag ${correct.length}/${ents.length} types`);
  }

  if (issues.length) console.log(`${m.methodTaskId}\t${t.id}\t${issues.join("; ")}`);
}
