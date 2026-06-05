import type { TopicMethodology } from "./types";

export const HEADS_LEGS_METHODOLOGY: TopicMethodology = {
  branchId: "modeling-heads-legs",
  title: "Головы и ноги",
  mentalModel:
    "В задаче два (иногда три) типа объектов с разным вкладом в общий признак. " +
    "Метод замены: «представим, что все одного вида» → сравни с условием → шаг замены → ответ. " +
    "Обязательно записываем развёрнутое решение словами.",
  algorithm: [
    "Выдели два вида объектов и их вклад (ноги, колёса, цена…).",
    "Перенеси числа из условия в модель; не придумывай недостающие.",
    "Представь, что все объекты «лёгкого» типа, посчитай итог.",
    "Сравни с условием, найди разницу и шаг замены.",
    "Запиши решение словами и ответ.",
  ],
  ladder: [
    { level: 1, role: "Сборка из карточек", taskId: "heads-legs-1-01", hints: "Режим A" },
    { level: 1, role: "Сборка из карточек", taskId: "heads-legs-1-02", hints: "Режим A" },
    { level: 2, role: "Пропуски", taskId: "heads-legs-1-04", hints: "Режим B" },
    { level: 3, role: "Самостоятельнее", taskId: "heads-legs-1-09", hints: "Режим C" },
    { level: 3, role: "Перебор", taskId: "heads-legs-3-02", hints: "Режим E" },
    { level: 4, role: "Ограничения", taskId: "heads-legs-4-01", hints: "both_types > 0" },
    { level: 5, role: "Письменно", taskId: "heads-legs-5-01", hints: "Развёрнутый текст" },
    { level: 5, role: "Три вида", taskId: "heads-legs-6-02", hints: "Объединение типов" },
    { level: 5, role: "Ключевое условие", taskId: "heads-legs-7-01", hints: "Равенство признаков" },
  ],
};
