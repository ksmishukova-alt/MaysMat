import type { DailySubject } from "@/lib/daily";
import maminaRaw from "@/data/daily-mamina.json";

export type DailyExerciseType =
  | "reading_passage"
  | "single_choice"
  | "number_input"
  | "text_input";

export interface DailyOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface DailyExercise {
  id: string;
  type: DailyExerciseType;
  title?: string;
  passage?: string;
  question: string;
  options?: DailyOption[];
  answer?: number;
  textAnswer?: string;
  hint?: string;
  successMessage?: string;
  /** Ответ нужно загрузить фото/файлом — уйдёт в Telegram вместе с отчётом */
  requiresFileAnswer?: boolean;
  /** Требует проверки родителем (галочка в админке); по умолчанию — да для daily */
  requiresReview?: boolean;
}

export type DailyWeekdayIndex = 0 | 1 | 2 | 3 | 4;
export type DailyProgramWeekIndex = 0 | 1 | 2 | 3 | 4 | 5;

export const DAILY_PROGRAM_WEEKS = 6;

export type DailyWeekRow = [
  DailyExercise[],
  DailyExercise[],
  DailyExercise[],
  DailyExercise[],
  DailyExercise[],
];

export type DailyWeekGrid = [
  DailyWeekRow,
  DailyWeekRow,
  DailyWeekRow,
  DailyWeekRow,
  DailyWeekRow,
  DailyWeekRow,
];

export interface DailySubjectPack {
  subject: DailySubject;
  title: string;
  emoji: string;
  description: string;
  /** «СлышМышь, задания решишь?» — 6 недель × Пн–Пт */
  programTitle?: string;
  byWeek: DailyWeekGrid;
}

/** Фирменная фраза daily и подпись на экране ребёнка */
export const DAILY_CATCHPHRASE = "Слышь, Мышь, задания решишь?";
export const DAILY_CATCHPHRASE_LINE1 = "Слышь, Мышь,";
export const DAILY_CATCHPHRASE_LINE2 = "задания решишь?";
export const DAILY_CHILD_TAGLINE = "Три миссии на сегодня — читай, пиши, считай!";

export const WEEKDAY_LABELS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"] as const;
export const PROGRAM_WEEK_LABELS = [
  "Неделя 1",
  "Неделя 2",
  "Неделя 3",
  "Неделя 4",
  "Неделя 5",
  "Неделя 6",
] as const;

interface MaminaOption {
  id: string;
  text: string;
  correct: boolean;
}

interface MaminaQuestion {
  number: number;
  question: string;
  options: MaminaOption[];
}

interface MaminaDay {
  workbookDay: number;
  passage: string;
  russianQuestions: MaminaQuestion[];
  math: { question: string; answer: number | null };
  writingNote?: string;
}

function emptyGrid(): DailyWeekGrid {
  const row = (): DailyWeekRow => [[], [], [], [], []];
  return [row(), row(), row(), row(), row(), row()];
}

function mapQuestion(
  q: MaminaQuestion,
  id: string,
  hint?: string
): DailyExercise {
  return {
    id,
    type: "single_choice",
    question: q.question,
    options: q.options.map((o) => ({ ...o })),
    hint,
    successMessage: "✅ Верно!",
  };
}

function buildFromMamina(): Record<DailySubject, DailySubjectPack> {
  const readingGrid = emptyGrid();
  const russianGrid = emptyGrid();
  const mathGrid = emptyGrid();

  for (const week of maminaRaw.weeks) {
    const wi = (week.weekNumber - 1) as DailyProgramWeekIndex;
    for (let di = 0; di < week.days.length; di++) {
      const day = week.days[di] as MaminaDay | null;
      if (!day) continue;
      const w = wi;
      const d = di as DailyWeekdayIndex;
      const prefix = `d${day.workbookDay}`;

      readingGrid[w][d] = [
        {
          id: `${prefix}-read`,
          type: "reading_passage",
          passage: day.passage.replace(/\s*\(\d+\s*слова?\)\s*$/, ""),
          question: "Прочитай текст три раза (можно вслух с родителями). Когда будешь готов — нажми «Прочитал».",
          options: [{ id: "done", text: "Прочитал три раза", correct: true }],
          hint: day.writingNote,
          successMessage: "✅ Отлично! Не забудь дома переписать текст в тетрадь.",
        },
      ];

      russianGrid[w][d] = day.russianQuestions.map((q) =>
        mapQuestion(q, `${prefix}-ru-${q.number}`)
      );

      if (day.math.question && day.math.answer != null) {
        mathGrid[w][d] = [
          {
            id: `${prefix}-math`,
            type: "number_input",
            question: day.math.question,
            answer: day.math.answer,
            successMessage: "✅ Задача решена!",
          },
        ];
      }
    }
  }

  return {
    reading: {
      subject: "reading",
      title: "Чтение",
      emoji: "📖",
      description: "1 текст · 3 прочтения",
      programTitle: maminaRaw.title,
      byWeek: readingGrid,
    },
    russian: {
      subject: "russian",
      title: "Русский язык",
      emoji: "✏️",
      description: "Тест по 5 вопросов",
      programTitle: maminaRaw.title,
      byWeek: russianGrid,
    },
    math: {
      subject: "math",
      title: "Математика",
      emoji: "🔢",
      description: "1 задача",
      programTitle: maminaRaw.title,
      byWeek: mathGrid,
    },
  };
}

export const DAILY_CONTENT = buildFromMamina();

export const DAILY_SUBJECTS: DailySubject[] = ["reading", "russian", "math"];

export function getDailySubjectPack(subject: DailySubject): DailySubjectPack {
  return DAILY_CONTENT[subject];
}

/** @deprecated используйте byWeek + programWeek */
export function legacyByWeekday(pack: DailySubjectPack): DailyWeekRow {
  return pack.byWeek[0];
}
