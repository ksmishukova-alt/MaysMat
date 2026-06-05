import { HEADS_LEGS_TASKS } from "../src/data/heads-legs/build-task";

const ids = process.argv.slice(2);
const tasks = ids.length
  ? ids.map((id) => HEADS_LEGS_TASKS[id]).filter(Boolean)
  : Object.values(HEADS_LEGS_TASKS);

for (const t of tasks) {
  console.log(`\n=== ${t.id} ${t.headsLegsMeta?.methodTaskId} ===`);
  for (const s of t.steps) {
    if (s.type === "drag_select")
      console.log(" drag:", s.options.filter((o) => o.correct).map((o) => o.label).join(", "));
    if (s.type === "table_input")
      console.log(" table:", s.rows.map((r) => `${r.label}:${r.answer}`).join(", "));
    if (s.type === "single_select")
      console.log(" assume:", s.options.map((o) => o.label).join(" / "));
    if (s.type === "worksheet_table")
      console.log(" ws:", s.title, "-", s.worksheetRows.length, "rows");
    if (s.type === "auto_explanation") console.log(" explain:", s.title);
  }
}
