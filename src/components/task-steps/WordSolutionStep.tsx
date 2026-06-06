"use client";

import { useState } from "react";
import type { WordSolutionStep as WordSolutionStepDef } from "@/data/task-steps";
import type { RunnerContext } from "@/lib/runner-context";
import { validateWordSolutionFull } from "@/lib/word-solution-blanks";
import { WordSolutionFillBlanks } from "./WordSolutionFillBlanks";

interface WordSolutionStepProps {
  step: WordSolutionStepDef;
  runnerContext?: RunnerContext;
  onComplete: () => void;
}

export function WordSolutionStep({ step, runnerContext = "heads-legs", onComplete }: WordSolutionStepProps) {
  const [text, setText] = useState("");
  const [blanks, setBlanks] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [hintIdx, setHintIdx] = useState(0);
  const [scaffoldDone, setScaffoldDone] = useState(false);

  const mode = step.solutionMode;
  const accepted = step.acceptedAnswers;
  const lines = step.solutionLines ?? [];
  const modeCWithScaffold = mode === "C" && lines.length > 0;

  const readOnlyBlankTestId = (sample: string): string | undefined => {
    if (/17\s*[x×*]\s*20\s*=\s*340/i.test(sample)) return "answer-transform-expression";
    if (/340\s*простых/i.test(sample)) return "answer-transform-result";
    return undefined;
  };

  const submit = () => {
    const result = validateWordSolutionFull(text, mode, accepted, lines, blanks);
    if (result.ok) {
      onComplete();
    } else {
      setError(result.message ?? "Проверь решение.");
      if (step.hintLevels?.[hintIdx]) {
        setHintIdx((i) => Math.min(i + 1, (step.hintLevels?.length ?? 1) - 1));
      }
    }
  };

  const renderLine = (line: (typeof lines)[0], li: number, readOnly = false) => {
    let bi = 0;
    return (
      <div key={li} className="rounded-lg bg-gray-50 px-3 py-2 text-sm leading-relaxed">
        {line.template.split(/(\[[^\]]*\])/).map((part, pi) => {
          const m = part.match(/^\[(.*)\]$/);
          if (!m) return <span key={pi}>{part}</span>;
          const blank = line.blanks[bi++];
          if (!blank) return <span key={pi}>{part}</span>;
          if (readOnly) {
            const sample = Array.isArray(blank.accept)
              ? String(blank.accept[0] ?? "…")
              : "…";
            const testId = readOnlyBlankTestId(sample);
            return (
              <span
                key={blank.id}
                data-testid={testId}
                className="mx-1 rounded bg-lavender-100 px-1.5 py-0.5 font-medium text-brand-purple"
              >
                {sample}
              </span>
            );
          }
          const wide = blank.type === "expression" || blank.type === "conclusion";
          return (
            <input
              key={blank.id}
              type="text"
              value={blanks[blank.id] ?? ""}
              onChange={(e) => setBlanks((b) => ({ ...b, [blank.id]: e.target.value }))}
              className={`mx-1 inline-block rounded border border-lavender-200 px-1 py-0.5 text-center ${
                wide ? "min-w-[140px]" : "w-20"
              }`}
              placeholder={blank.placeholder ?? "…"}
              aria-label={`Пропуск ${li + 1}`}
            />
          );
        })}
      </div>
    );
  };

  if (mode === "A" && lines.length > 0) {
    return (
      <div className="space-y-4" data-testid="word-solution-step">
        <WordSolutionFillBlanks
          stepId={step.id}
          lines={lines}
          blanks={blanks}
          onBlanksChange={setBlanks}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {step.hintLevels?.[hintIdx] ? (
          <p className="text-sm text-amber-800">💡 {step.hintLevels[hintIdx]}</p>
        ) : null}
        <button
          type="button"
          onClick={submit}
          className="w-full rounded-xl bg-brand-purple py-3 text-sm font-semibold text-white"
        >
          Проверить решение и ответ
        </button>
        <p className="text-xs text-gray-500">
          {runnerContext === "dirichlet"
            ? "⑭ Убедись, что есть вывод по принципу Дирихле и ответ на вопрос задачи."
            : "⑭ Убедись, что есть строка «Ответ:» и в ней названы и звери, и птицы."}
        </p>
      </div>
    );
  }

  if (modeCWithScaffold && !scaffoldDone) {
    return (
      <div className="space-y-4" data-testid="word-solution-step">
        <p className="text-sm font-medium text-gray-800">Шаг 1. Изучи опору</p>
        <p className="text-sm text-gray-600">
          Прочитай образец решения. Цифры в цветных блоках — подсказка, как может выглядеть запись. Запомни
          порядок шагов, затем напишешь своими словами.
        </p>
        <div className="space-y-2">{lines.map((line, li) => renderLine(line, li, true))}</div>
        <button
          type="button"
          onClick={() => setScaffoldDone(true)}
          className="w-full rounded-xl bg-brand-purple py-3 text-sm font-semibold text-white"
        >
          Понятно — напишу своими словами →
        </button>
      </div>
    );
  }

  if (mode === "B" || mode === "E") {
    return (
      <div className="space-y-4" data-testid="word-solution-step">
        <p className="text-sm text-gray-600">
          {mode === "B" && "Дополни пропуски в готовом тексте решения."}
          {mode === "E" && "Запиши перебор: заполни строки проверки и итог."}
        </p>
        {lines.map((line, li) => renderLine(line, li))}
        {mode === "B" && lines.length > 0 ? (
          <p className="text-xs text-gray-400">
            Или запиши полное решение ниже (не короче 3–4 предложений).
          </p>
        ) : null}
        {mode === "B" && lines.length > 0 ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-sm"
            placeholder="Полное решение своими словами…"
          />
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {step.hintLevels?.[hintIdx] ? (
          <p className="text-sm text-amber-800">💡 {step.hintLevels[hintIdx]}</p>
        ) : null}
        <button
          type="button"
          onClick={submit}
          className="rounded-xl bg-brand-purple px-5 py-2 text-sm font-semibold text-white"
        >
          Проверить решение
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="word-solution-step">
      {modeCWithScaffold ? (
        <p className="text-sm font-medium text-gray-800">Шаг 2. Напиши решение своими словами</p>
      ) : null}
      <p className="text-sm text-gray-600">
        {mode === "D"
          ? "Объясни, почему единственный ответ найти нельзя, или запиши полное решение."
          : mode === "C"
            ? "Запиши развёрнутое решение своими словами: предположение → вычисления → ответ."
            : "Запиши развёрнутое решение: предположение → вычисления → ответ."}
      </p>
      {mode === "C" && accepted.kind === "multi_set" ? (
        <p className="text-sm text-amber-800">
          В этой задаче несколько правильных ответов — найди и запиши все варианты.
        </p>
      ) : null}
      {mode !== "C" && lines.length > 0 ? (
        <div className="space-y-2">{lines.map((l, i) => renderLine(l, i))}</div>
      ) : null}
      <ul className="list-inside list-disc text-xs text-gray-500">
        <li>Есть ли предположение «представим, что все…»?</li>
        <li>Есть ли вычисления и сравнение с условием?</li>
        <li>Есть ли строка «Ответ:»?</li>
      </ul>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        className="w-full rounded-xl border border-lavender-200 px-3 py-2 text-sm"
        placeholder="Представим, что…"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {step.hintLevels?.[hintIdx] ? (
        <p className="text-sm text-amber-800">💡 {step.hintLevels[hintIdx]}</p>
      ) : null}
      <button
        type="button"
        onClick={submit}
        className="rounded-xl bg-brand-purple px-5 py-2 text-sm font-semibold text-white"
      >
        Проверить решение
      </button>
    </div>
  );
}
