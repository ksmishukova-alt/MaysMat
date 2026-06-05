import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "../src/data/tasks.ts");
let src = fs.readFileSync(file, "utf8");

const start = src.indexOf('export const TASKS: Record<string, Task> = {');
const fairyStart = src.indexOf('  "fairy-caves-01": {');
if (start === -1 || fairyStart === -1) {
  console.error("markers not found");
  process.exit(1);
}

const before = src.slice(0, start);
const after = src.slice(fairyStart);
const middle = `export const TASKS: Record<string, Task> = {
  ...HEADS_LEGS_TASKS,
`;

src = before + middle + after;
fs.writeFileSync(file, src);
console.log("tasks.ts patched");
