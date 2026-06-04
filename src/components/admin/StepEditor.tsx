"use client";

import type {
  ConditionChip,
  ConditionParseData,
  DragOption,
  OrderQuestionItem,
  TableRow,
  TaskStep,
  WorksheetRow,
} from "@/data/tasks";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-500">{label}</span>
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  multiline,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const className =
    "w-full rounded-lg border border-lavender-200 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none";
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={className}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}

function NumberInput({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <input
      type="number"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-sm focus:border-brand-purple focus:outline-none"
    />
  );
}

function ChipListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: ConditionChip[];
  onChange: (items: ConditionChip[]) => void;
}) {
  const update = (index: number, text: string) => {
    const next = [...items];
    next[index] = { ...next[index], text };
    onChange(next);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  const add = () =>
    onChange([...items, { id: `chip-${Date.now().toString(36)}`, text: "Новый вариант" }]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <button type="button" onClick={add} className="text-xs text-brand-purple hover:underline">
          + Добавить
        </button>
      </div>
      <div className="space-y-2">
        {items.map((chip, index) => (
          <div key={chip.id} className="flex gap-2">
            <TextInput value={chip.text} onChange={(text) => update(index, text)} />
            <button
              type="button"
              onClick={() => remove(index)}
              className="shrink-0 rounded-lg px-2 text-sm text-red-500 hover:bg-red-50"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function OptionsEditor({
  options,
  onChange,
}: {
  options: DragOption[];
  onChange: (options: DragOption[]) => void;
}) {
  const update = (index: number, patch: Partial<DragOption>) => {
    const next = [...options];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const remove = (index: number) => onChange(options.filter((_, i) => i !== index));

  const add = () =>
    onChange([
      ...options,
      {
        id: `opt-${Date.now().toString(36)}`,
        label: "Новый вариант",
        emoji: "❓",
        correct: false,
      },
    ]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">Варианты ответа</span>
        <button type="button" onClick={add} className="text-xs text-brand-purple hover:underline">
          + Вариант
        </button>
      </div>
      <div className="space-y-3">
        {options.map((opt, index) => (
          <div
            key={opt.id}
            className="grid gap-2 rounded-lg border border-lavender-100 p-3 sm:grid-cols-[1fr_4rem_1fr_auto]"
          >
            <TextInput
              value={opt.label}
              onChange={(label) => update(index, { label })}
              placeholder="Текст"
            />
            <TextInput
              value={opt.emoji}
              onChange={(emoji) => update(index, { emoji })}
              placeholder="Emoji"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={opt.correct}
                onChange={(e) => update(index, { correct: e.target.checked })}
              />
              Верный
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-sm text-red-500 hover:underline"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderItemsEditor({
  items,
  onChange,
}: {
  items: OrderQuestionItem[];
  onChange: (items: OrderQuestionItem[]) => void;
}) {
  const update = (index: number, text: string) => {
    const next = [...items];
    next[index] = { ...next[index], text };
    onChange(next);
  };

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index));

  const add = () =>
    onChange([...items, { id: `q-${Date.now().toString(36)}`, text: "Новый вопрос плана" }]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">Пункты плана (порядок = правильный)</span>
        <button type="button" onClick={add} className="text-xs text-brand-purple hover:underline">
          + Пункт
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-2">
            <span className="flex w-6 shrink-0 items-center text-sm text-gray-400">{index + 1}.</span>
            <TextInput value={item.text} onChange={(text) => update(index, text)} />
            <button
              type="button"
              onClick={() => remove(index)}
              className="shrink-0 text-sm text-red-500 hover:underline"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TableRowsEditor({
  rows,
  onChange,
}: {
  rows: TableRow[];
  onChange: (rows: TableRow[]) => void;
}) {
  const update = (index: number, patch: Partial<TableRow>) => {
    const next = [...rows];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const add = () =>
    onChange([
      ...rows,
      {
        id: `row-${Date.now().toString(36)}`,
        label: "Новая строка",
        emoji: "❓",
        answer: 0,
      },
    ]);

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={row.id} className="grid gap-2 rounded-lg border border-lavender-100 p-3 sm:grid-cols-4">
          <TextInput value={row.label} onChange={(label) => update(index, { label })} placeholder="Название" />
          <TextInput value={row.emoji} onChange={(emoji) => update(index, { emoji })} placeholder="Emoji" />
          <NumberInput value={row.answer} onChange={(answer) => update(index, { answer: answer ?? 0 })} />
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, i) => i !== index))}
            className="text-sm text-red-500"
          >
            Удалить
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-xs text-brand-purple hover:underline">
        + Строка таблицы
      </button>
    </div>
  );
}

function WorksheetRowsEditor({
  rows,
  onChange,
}: {
  rows: WorksheetRow[];
  onChange: (rows: WorksheetRow[]) => void;
}) {
  const update = (index: number, patch: Partial<WorksheetRow>) => {
    const next = [...rows];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const add = () =>
    onChange([
      ...rows,
      {
        id: `ws-${Date.now().toString(36)}`,
        question: "Новый вопрос",
        inputType: "number",
        answer: 0,
      },
    ]);

  return (
    <div className="space-y-3">
      {rows.map((row, index) => (
        <div key={row.id} className="space-y-2 rounded-lg border border-lavender-100 p-3">
          <TextInput
            value={row.question}
            onChange={(question) => update(index, { question })}
            placeholder="Вопрос"
          />
          <div className="grid gap-2 sm:grid-cols-3">
            <Field label="Тип поля">
              <select
                value={row.inputType}
                onChange={(e) =>
                  update(index, { inputType: e.target.value as WorksheetRow["inputType"] })
                }
                className="w-full rounded-lg border border-lavender-200 px-3 py-2 text-sm"
              >
                <option value="static">Текст (static)</option>
                <option value="number">Число</option>
                <option value="formula">Формула</option>
              </select>
            </Field>
            {row.inputType === "static" ? (
              <Field label="Значение">
                <TextInput
                  value={row.staticValue ?? ""}
                  onChange={(staticValue) => update(index, { staticValue })}
                />
              </Field>
            ) : (
              <Field label="Ответ">
                <NumberInput
                  value={row.answer}
                  onChange={(answer) => update(index, { answer })}
                />
              </Field>
            )}
            <Field label="Префикс">
              <TextInput value={row.prefix ?? ""} onChange={(prefix) => update(index, { prefix })} />
            </Field>
          </div>
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, i) => i !== index))}
            className="text-sm text-red-500"
          >
            Удалить строку
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-xs text-brand-purple hover:underline">
        + Строка worksheet
      </button>
    </div>
  );
}

function TemplateEditor({
  lines,
  onChange,
}: {
  lines: string[];
  onChange: (lines: string[]) => void;
}) {
  const update = (index: number, text: string) => {
    const next = [...lines];
    next[index] = text;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {lines.map((line, index) => (
        <div key={index} className="flex gap-2">
          <TextInput value={line} onChange={(text) => update(index, text)} />
          <button
            type="button"
            onClick={() => onChange(lines.filter((_, i) => i !== index))}
            className="text-sm text-red-500"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...lines, "Новый пункт разбора"])}
        className="text-xs text-brand-purple hover:underline"
      >
        + Строка разбора
      </button>
    </div>
  );
}

export function GivenStepEditor({
  data,
  onChange,
}: {
  data: ConditionParseData;
  onChange: (data: ConditionParseData) => void;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-lavender-200 bg-lavender-50/50 p-4">
      <ChipListEditor
        label="Дано (верные факты)"
        items={data.given}
        onChange={(given) => onChange({ ...data, given })}
      />
      <Field label="Найти (верный вопрос)">
        <TextInput
          value={data.find.text}
          onChange={(text) => onChange({ ...data, find: { ...data.find, text } })}
        />
      </Field>
      <ChipListEditor
        label="Лишние фразы для «Дано»"
        items={data.distractors}
        onChange={(distractors) => onChange({ ...data, distractors })}
      />
      <ChipListEditor
        label="Неверные формулировки «Найти»"
        items={data.findDistractors}
        onChange={(findDistractors) => onChange({ ...data, findDistractors })}
      />
    </div>
  );
}

const STEP_TYPE_LABELS: Record<TaskStep["type"], string> = {
  condition_parse: "Дано / Найти",
  drag_select: "Выбор перетаскиванием",
  single_select: "Один вариант",
  order_questions: "План (порядок)",
  worksheet_table: "Таблица ответов",
  table_input: "Таблица ввода",
  number_input: "Числовой ответ",
  comparison: "Сравнение",
  auto_explanation: "Разбор",
};

export function StepEditor({
  step,
  index,
  onChange,
  onRemove,
}: {
  step: TaskStep;
  index: number;
  onChange: (step: TaskStep) => void;
  onRemove: () => void;
}) {
  const patch = (partial: Partial<TaskStep>) => onChange({ ...step, ...partial });

  return (
    <details className="group rounded-xl border border-lavender-200 bg-white" open={index < 2}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
        <div>
          <span className="text-xs text-gray-400">Шаг {index + 1}</span>
          <div className="font-medium text-gray-900">
            {step.title || "Без названия"}
            <span className="ml-2 text-xs font-normal text-gray-500">
              ({STEP_TYPE_LABELS[step.type]})
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="text-xs text-red-500 hover:underline"
        >
          Удалить шаг
        </button>
      </summary>

      <div className="space-y-4 border-t border-lavender-100 px-4 py-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Заголовок шага">
            <TextInput value={step.title} onChange={(title) => patch({ title })} />
          </Field>
          <Field label="Тип шага">
            <input
              value={STEP_TYPE_LABELS[step.type]}
              readOnly
              className="w-full rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500"
            />
          </Field>
        </div>
        <Field label="Подсказка">
          <TextInput value={step.hint ?? ""} onChange={(hint) => patch({ hint })} />
        </Field>

        {step.type === "drag_select" || step.type === "single_select" ? (
          <>
            {step.type === "single_select" ? (
              <Field label="Вопрос над вариантами">
                <TextInput
                  value={step.selectPrompt ?? ""}
                  onChange={(selectPrompt) => patch({ selectPrompt })}
                />
              </Field>
            ) : null}
            <OptionsEditor
              options={step.options ?? []}
              onChange={(options) => patch({ options })}
            />
          </>
        ) : null}

        {step.type === "condition_parse" && step.parseData ? (
          <GivenStepEditor
            data={step.parseData}
            onChange={(parseData) => patch({ parseData })}
          />
        ) : null}

        {step.type === "order_questions" ? (
          <OrderItemsEditor
            items={step.orderItems ?? []}
            onChange={(orderItems) => patch({ orderItems })}
          />
        ) : null}

        {step.type === "table_input" ? (
          <>
            <Field label="Подпись столбца">
              <TextInput
                value={step.tableColumnLabel ?? ""}
                onChange={(tableColumnLabel) => patch({ tableColumnLabel })}
              />
            </Field>
            <TableRowsEditor rows={step.rows ?? []} onChange={(rows) => patch({ rows })} />
          </>
        ) : null}

        {step.type === "worksheet_table" ? (
          <>
            <Field label="Сообщение об успехе">
              <TextInput
                value={step.successMessage ?? ""}
                onChange={(successMessage) => patch({ successMessage })}
              />
            </Field>
            <WorksheetRowsEditor
              rows={step.worksheetRows ?? []}
              onChange={(worksheetRows) => patch({ worksheetRows })}
            />
          </>
        ) : null}

        {step.type === "number_input" ? (
          <div className="space-y-3">
            <Field label="Контекст">
              <TextInput value={step.context ?? ""} onChange={(context) => patch({ context })} multiline />
            </Field>
            <Field label="Вопрос">
              <TextInput value={step.question ?? ""} onChange={(question) => patch({ question })} />
            </Field>
            <Field label="Правильный ответ">
              <NumberInput value={step.answer} onChange={(answer) => patch({ answer })} />
            </Field>
            <Field label="Сообщение об успехе">
              <TextInput
                value={step.successMessage ?? ""}
                onChange={(successMessage) => patch({ successMessage })}
              />
            </Field>
          </div>
        ) : null}

        {step.type === "auto_explanation" ? (
          <Field label="Строки разбора">
            <TemplateEditor
              lines={step.template ?? []}
              onChange={(template) => patch({ template })}
            />
          </Field>
        ) : null}
      </div>
    </details>
  );
}

export function createEmptyStep(type: TaskStep["type"], taskId: string, index: number): TaskStep {
  const id = `${taskId}-step-new-${index}`;
  switch (type) {
    case "drag_select":
      return {
        id,
        type,
        title: "Новый шаг",
        options: [{ id: "a", label: "Вариант A", emoji: "🅰️", correct: true }],
      };
    case "single_select":
      return {
        id,
        type,
        title: "Новый шаг",
        selectPrompt: "Выбери ответ",
        options: [
          { id: "a", label: "Вариант A", emoji: "🅰️", correct: true },
          { id: "b", label: "Вариант B", emoji: "🅱️", correct: false },
        ],
      };
    case "order_questions":
      return { id, type, title: "План решения", orderItems: [] };
    case "number_input":
      return { id, type, title: "Числовой вопрос", question: "?", answer: 0 };
    case "auto_explanation":
      return { id, type, title: "Разбор", template: ["Пункт 1"] };
    default:
      return { id, type, title: "Новый шаг" } as TaskStep;
  }
}
