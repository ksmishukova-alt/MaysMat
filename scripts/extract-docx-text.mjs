import fs from "fs";
import path from "path";

const input = process.argv[2];
if (!input) {
  console.error("Usage: node extract-docx-text.mjs <path-to-docx>");
  process.exit(1);
}

const xmlPath = input.endsWith(".xml")
  ? input
  : path.join(process.env.TEMP ?? "/tmp", "hl-audit-docx/unzipped/word/document.xml");

const xml = fs.readFileSync(xmlPath, "utf8");
const paras = [];
const re = /<w:p[\s>][\s\S]*?<\/w:p>/g;
let m;
while ((m = re.exec(xml))) {
  const p = m[0];
  const texts = [...p.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((x) =>
    x[1].replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"),
  );
  if (texts.length) paras.push(texts.join(""));
}
console.log(paras.join("\n"));
