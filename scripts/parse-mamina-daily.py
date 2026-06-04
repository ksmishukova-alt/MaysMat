# -*- coding: utf-8 -*-
"""Парсит extracted.txt тетради «Переходим в 4 класс» → JSON для Daily (6×5)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "content" / "import" / "extracted.txt"
OUT = ROOT / "src" / "data" / "daily-mamina.json"

OPTION_RE = re.compile(
    r"^[аa]\)\s*(.+?)(?=\s+[бb]\)|$)|^[бb]\)\s*(.+?)(?=\s+[вvg]\)|$)|^[вvg]\)\s*(.+?)(?=\s+[гd]\)|$)|^[гd]\)\s*(.+?)$",
    re.IGNORECASE,
)

MATH_ANSWERS = {
    1: 25,
    2: 52,
    3: 860,  # кг в первый магазин (430*2); в приложении — один числовой ответ
    4: 48,
    5: 360,
    6: 360,
    7: 8,
    8: 9,
    9: 8,
    10: 7,
    11: 13,
    12: 17,
    13: 7,
    14: 5,
    15: 864,
    16: 465,
    17: 4,
    18: 34,
    19: 86,
    20: 28,
    21: 10,
    22: 19,
    23: 30,
    24: 34,
    25: 30,
    26: 150,
    27: 96,
    28: 3,
    29: 10,
    30: 48,
}

# Ключ: (день, номер вопроса) -> буква a/b/c/d
RUSSIAN_KEYS: dict[tuple[int, int], str] = {
    (1, 1): "a",
    (1, 2): "b",
    (1, 3): "b",
    (1, 4): "b",
    (1, 5): "c",
    (2, 1): "b",
    (2, 2): "b",
    (3, 1): "a",
    (3, 2): "b",
    (3, 3): "a",
    (3, 4): "c",
    (4, 1): "b",
    (4, 2): "a",
    (4, 3): "a",
    (4, 4): "b",
    (5, 1): "a",
    (5, 2): "c",
    (5, 3): "b",
    (5, 4): "a",
    (5, 5): "a",
    (10, 1): "c",
    (10, 2): "b",
    (10, 3): "a",
    (10, 4): "a",
    (10, 5): "c",
    (20, 1): "b",
    (30, 1): "b",
    (30, 2): "c",
}


def parse_options_block(text: str) -> list[dict]:
    """Разбирает варианты а/б/в на одной или нескольких строках."""
    opts: list[dict] = []
    if not text.strip():
        return opts
    # Сначала пробуем построчно
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    inline = " ".join(lines)
    # Разбиение по шаблону «а) … б) … в) …»
    for m in re.finditer(
        r"([абвгa-d])\)\s*(.*?)(?=\s+[бвгa-d]\)|$)",
        inline + " ",
        re.I,
    ):
        letter = (
            m.group(1)
            .lower()
            .replace("а", "a")
            .replace("б", "b")
            .replace("в", "c")
            .replace("г", "d")
        )
        txt = m.group(2).strip().rstrip(";,")
        if txt:
            opts.append({"id": letter, "text": txt, "correct": False})
    if opts:
        return opts
    for line in lines:
        m = re.match(r"^([абвгa-d])\)\s*(.+)$", line, re.I)
        if m:
            letter = m.group(1).lower().replace("а", "a").replace("б", "b").replace("в", "c").replace("г", "d")
            opts.append({"id": letter, "text": m.group(2).strip(), "correct": False})
    return opts


def split_days(text: str) -> list[str]:
    parts = re.split(r"Задание №\s*(\d+)", text)
    chunks = []
    for i in range(1, len(parts), 2):
        num = int(parts[i])
        body = parts[i + 1]
        chunks.append((num, body))
    return chunks


def extract_passage(body: str) -> str:
    lines = []
    for line in body.splitlines():
        s = line.strip()
        if re.match(r"^\d+[\.\)]", s):
            break
        if s.startswith("Задача №"):
            break
        if len(s) < 3:
            if lines:
                break
            continue
        if re.match(r"^[_\s]+$", s):
            continue
        lines.append(s)
    return " ".join(lines).strip()


def extract_questions(body: str) -> list[dict]:
    questions = []
    q_parts = re.split(r"(?:^|\n)(\d+)\.\s*", body)
    i = 1
    while i < len(q_parts) - 1:
        qnum = int(q_parts[i])
        block = q_parts[i + 1]
        i += 2
        if "Задача №" in block:
            block = block.split("Задача №")[0]
        lines = block.strip().splitlines()
        qtext_lines = []
        opt_lines = []
        for line in lines:
            if re.match(r"^[абвгa-d]\)", line.strip(), re.I):
                opt_lines.append(line.strip())
            elif opt_lines:
                opt_lines.append(line.strip())
            else:
                qtext_lines.append(line.strip())
        qtext = " ".join(x for x in qtext_lines if x).strip()
        if not qtext:
            continue
        opts = parse_options_block("\n".join(opt_lines))
        questions.append({"number": qnum, "question": qtext, "options": opts})
    return questions


def extract_math(full_text: str, day: int) -> str:
    m = re.search(rf"Задача №\s*{day}\s*(.*?)(?=--- PAGE|Задание №|\Z)", full_text, re.S)
    if not m:
        return ""
    block = m.group(1)
    lines = [ln.strip() for ln in block.splitlines() if ln.strip() and not re.match(r"^[_\s]+$", ln.strip())]
    return " ".join(lines[:6]).strip()


def main():
    text = SRC.read_text(encoding="utf-8")
    # только страницы с заданиями
    if "--- PAGE 3 ---" in text:
        text = text.split("--- PAGE 3 ---", 1)[1]

    days_raw = split_days(text)
    program = {"title": "СлышМышь, задания решишь?", "weeks": []}

    for day_num, body in days_raw:
        if day_num > 30:
            continue
        week_idx = (day_num - 1) // 5
        day_idx = (day_num - 1) % 5
        while len(program["weeks"]) <= week_idx:
            program["weeks"].append({"weekNumber": len(program["weeks"]) + 1, "days": []})
        while len(program["weeks"][week_idx]["days"]) <= day_idx:
            program["weeks"][week_idx]["days"].append(None)

        passage = extract_passage(body)
        questions = extract_questions(body)
        math_q = extract_math(text, day_num)

        for q in questions:
            key = RUSSIAN_KEYS.get((day_num, q["number"]))
            if not key and q["options"]:
                key = "a"
            for o in q["options"]:
                o["correct"] = o["id"] == key

        reading_q = questions[0] if questions else None
        russian_qs = questions if questions else []

        program["weeks"][week_idx]["days"][day_idx] = {
            "workbookDay": day_num,
            "passage": passage,
            "wordCount": len(passage.split()),
            "readingQuestion": reading_q,
            "russianQuestions": russian_qs if russian_qs else questions,
            "math": {
                "question": math_q,
                "answer": MATH_ANSWERS.get(day_num),
            },
            "writingNote": "Дома: перепиши текст для чтения аккуратно за 5 минут (из тетради).",
        }

    OUT.write_text(json.dumps(program, ensure_ascii=False, indent=2), encoding="utf-8")
    print("written", OUT, "weeks", len(program["weeks"]))


if __name__ == "__main__":
    main()
