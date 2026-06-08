"use client";

import type { RunnerKind } from "@/data/entry-diagnostic/types";

export interface RunnerVisualSpec {
  boardTitle: string;
  cells: string[];
  hint?: string;
}

export const RUNNER_VISUALS: Record<RunnerKind, RunnerVisualSpec> = {
  reading_comprehension_visual: {
    boardTitle: "4 параметра условия",
    cells: ["Дано", "Искать", "Лишнее", "Ответ"],
    hint: "Выдели смысл вопроса",
  },
  story_add_sub_visual: {
    boardTitle: "Сюжетная модель",
    cells: ["Было", "Изменение", "Стало", "Ответ"],
  },
  column_add_sub_visual: {
    boardTitle: "Столбик",
    cells: ["Ед.", "Дес.", "Сот.", "Перенос"],
  },
  column_multiplication_visual: {
    boardTitle: "Умножение столбиком",
    cells: ["×", "Частичное 1", "Частичное 2", "Сумма"],
  },
  long_division_visual: {
    boardTitle: "Деление (запись РФ)",
    cells: ["Делимое", "Делитель", "Частное", "Остаток"],
  },
  remainder_interpretation_visual: {
    boardTitle: "Остаток и смысл",
    cells: ["Деление", "Остаток", "Округление", "Ответ"],
  },
  expression_order_visual_with_embedded_calculation: {
    boardTitle: "Порядок действий",
    cells: ["× :", "+ −", "Скобки", "Итог"],
    hint: "Сначала × и :, потом + и −",
  },
  text_problem_plan_visual: {
    boardTitle: "План задачи",
    cells: ["Шаг 1", "Шаг 2", "Шаг 3", "Ответ"],
  },
  motion_model_visual: {
    boardTitle: "S · v · t",
    cells: ["Путь S", "Скорость v", "Время t", "Формула"],
  },
  geometry_grid_visual: {
    boardTitle: "Сетка",
    cells: ["Стороны", "Периметр", "Площадь", "Единицы"],
  },
  fraction_model_visual: {
    boardTitle: "Доля целого",
    cells: ["Целое", "Часть", "Знаменатель", "Ответ"],
  },
  percent_model_visual: {
    boardTitle: "Проценты",
    cells: ["100%", "1%", "Часть", "Ответ"],
  },
  logic_if_then_visual: {
    boardTitle: "Если → то",
    cells: ["Условие", "Следствие", "Контрпример", "Вывод"],
  },
  systematic_search_visual: {
    boardTitle: "Перебор",
    cells: ["Вариант 1", "Вариант 2", "…", "Счёт"],
  },
  pattern_cycle_visual: {
    boardTitle: "Цикл",
    cells: ["Период", "Позиция", "Остаток", "Символ"],
  },
};

export function RunnerVisualBoard({ kind }: { kind: RunnerKind }) {
  const spec = RUNNER_VISUALS[kind];
  return (
    <div
      className="rounded-xl border-2 border-dashed border-lavender-300 bg-lavender-50/50 p-6 text-center text-sm text-gray-500"
      aria-label={spec.boardTitle}
    >
      <p className="font-medium text-gray-700">{spec.boardTitle}</p>
      {spec.hint ? <p className="mt-1 text-xs text-gray-500">{spec.hint}</p> : null}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {spec.cells.map((l) => (
          <div key={l} className="rounded-lg bg-white p-3 shadow-sm">
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}
