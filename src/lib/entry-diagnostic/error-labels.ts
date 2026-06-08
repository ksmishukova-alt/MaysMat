/** Человекочитаемые подписи ошибок для отчёта (не для ребёнка в процессе) */
const ERROR_LABELS: Record<string, string> = {
  reading_error: "ошибка чтения условия",
  question_focus_error: "не тот вопрос в условии",
  data_error: "ошибка в данных",
  extra_data_error: "лишние данные",
  calculation_error: "ошибка вычисления",
  computation_error: "ошибка вычисления",
  order_error: "ошибка порядка действий",
  carry_error: "ошибка переноса",
  borrow_error: "ошибка заёма",
  alignment_error: "ошибка записи столбиком",
  unit_error: "ошибка единиц",
  perimeter_area_confusion: "периметр и площадь",
  action_count_error: "число действий",
  plan_error: "план решения",
  mini_motor: "моторика в мини-игре",
  mini_semantic: "смысл в мини-игре",
};

export function humanizeErrorClusterKey(key: string): string {
  return ERROR_LABELS[key] ?? key.replace(/_/g, " ");
}
