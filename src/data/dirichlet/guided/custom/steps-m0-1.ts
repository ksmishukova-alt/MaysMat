import type { DiscriminatedTaskStep } from "@/data/task-steps";

import type { DirichletInferredModel } from "../../types";

import { buildCountWorksheetRows, extractBooleanQuestion, inferMinInCell } from "../count-patterns";

/** Эталон F1: 20 туристов, возрасты 20–35, одногодки */
export function buildStepsM01(taskId: string, model: DirichletInferredModel): DiscriminatedTaskStep[] {
  const n = 20;
  const m = 16;
  const min = inferMinInCell({ ...model, counts: { ...model.counts, n, m } });
  const question =
    extractBooleanQuestion(
      "В поход пошли 20 туристов. Самому старшему из них 35 лет, а самому младшему 20 лет. Верно ли, что среди туристов есть одногодки?",
    ) ?? "Верно ли, что среди туристов есть одногодки?";

  return [
    {
      id: `${taskId}-counts`,
      type: "worksheet_table",
      title: "Подсчёт N и M",
      hint: "Сначала число туристов, затем посчитай, сколько различных возрастов от 20 до 35 включительно.",
      successMessage: "Числа на месте!",
      worksheetRows: buildCountWorksheetRows(
        {
          id: taskId,
          methodTaskId: "M0.1",
          condition:
            "В поход пошли 20 туристов. Самому старшему из них 35 лет, а самому младшему 20 лет. Верно ли, что среди туристов есть одногодки?",
        } as import("../../types").DirichletTaskMeta,
        { ...model, counts: { n, m } },
      ),
    },
    {
      id: `${taskId}-compare`,
      type: "single_select",
      title: "Сравнение",
      selectPrompt: "Как соотносятся туристы и возможные возрасты?",
      context: "N = 20 туристов, M = 16 возможных возрастов (от 20 до 35).",
      options: [
        { id: "gt", label: "Туристов больше, чем возрастов (N > M)", emoji: "✅", correct: true },
        { id: "le", label: "Туристов не больше, чем возрастов (N ≤ M)", emoji: "❌", correct: false },
      ],
      successMessage: "Верно! Значит, в одном возрасте окажется больше одного туриста.",
    },
    {
      id: `${taskId}-min-cell`,
      type: "single_select",
      title: "Следствие Дирихле",
      hint: "20 туристов раскладываем по 16 «клеткам-возрастам».",
      selectPrompt: "Сколько минимум туристов окажется одного возраста?",
      context: "N = 20 > M = 16.",
      options: [
        { id: "min-2", label: "Не менее 2 (найдутся одногодки)", emoji: "🎯", correct: min >= 2 },
        { id: "min-1", label: "Достаточно одного туриста каждого возраста", emoji: "1️⃣", correct: false },
        { id: "min-0", label: "Все возрасты могут быть разными", emoji: "❌", correct: false },
      ],
      successMessage: "Верно! Минимум двое — значит, есть одногодки.",
    },
    {
      id: `${taskId}-answer`,
      type: "single_select",
      title: "Ответ на вопрос задачи",
      selectPrompt: question,
      context: `По Дирихле: ${min} туриста одного возраста — это одногодки.`,
      options: [
        { id: "yes", label: "Да, верно — одногодки найдутся", emoji: "✅", correct: true },
        { id: "no", label: "Нет, одногодков может не быть", emoji: "❌", correct: false },
      ],
      successMessage: "Отлично! Ответ: «Верно».",
    },
  ];
}
