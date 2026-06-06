"use client";

import type { MethodRule, RemaindersRuleInstance } from "@/data/method-rules/types";
import {
  buildRemaindersRuleExample,
  buildWhyRemaindersRangeBlock,
  localizeRuleLines,
} from "@/data/method-rules";

interface MethodRuleScreenProps {
  rule: MethodRule;
  instance: RemaindersRuleInstance;
  /** step — в цепочке задачи; modal — из кнопки помощи */
  variant?: "step" | "modal";
  onComplete?: () => void;
  onClose?: () => void;
}

export function MethodRuleScreen({
  rule,
  instance,
  variant = "step",
  onComplete,
  onClose,
}: MethodRuleScreenProps) {
  const example = buildRemaindersRuleExample(instance);
  const whyRange = buildWhyRemaindersRangeBlock(instance);
  const localized = localizeRuleLines(rule, instance.modulus);

  const handlePrimary = () => {
    if (variant === "modal") {
      onClose?.();
    } else {
      onComplete?.();
    }
  };

  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-purple">
        {rule.title}
      </p>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{rule.childTitle}</h3>

      <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-base font-medium leading-relaxed text-amber-950">
        {rule.anchorPhrase}
      </div>

      <div className="mb-6 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-relaxed text-emerald-950">
        {whyRange.map((line, i) =>
          line === "" ? (
            <div key={`why-${i}`} className="h-2" />
          ) : (
            <p key={`why-${i}`} className={line.startsWith("Почему") ? "font-semibold" : undefined}>
              {line}
            </p>
          ),
        )}
      </div>

      <div className="mb-6 space-y-3">
        <p className="text-sm font-medium text-gray-700">Пример из этой задачи</p>
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-relaxed text-sky-950">
          {example.map((line, i) =>
            line === "" ? (
              <div key={i} className="h-2" />
            ) : (
              <p key={i} className={line.startsWith("Почему") ? "font-medium" : undefined}>
                {line}
              </p>
            ),
          )}
        </div>
      </div>

      <details className="mb-6 rounded-xl border border-lavender-200 bg-lavender-50/50 px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium text-brand-purple">
          Полное правило
        </summary>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
          {localized.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </details>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handlePrimary}
          className="rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
        >
          {variant === "modal" ? "Понятно" : "Понятно, решаю"}
        </button>
        {variant === "modal" ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm text-gray-600"
          >
            Закрыть
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Modal-обёртка для кнопки помощи */
export function MethodRuleModal({
  open,
  rule,
  instance,
  onClose,
}: {
  open: boolean;
  rule: MethodRule;
  instance: RemaindersRuleInstance;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal
      aria-labelledby="method-rule-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <MethodRuleScreen rule={rule} instance={instance} variant="modal" onClose={onClose} />
      </div>
    </div>
  );
}
