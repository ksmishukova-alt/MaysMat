"use client";

import type { HeadsLegsMethodRuleInstance, MethodRule } from "@/data/method-rules/types";
import { buildHeadsLegsRuleExample } from "@/data/method-rules";

interface HeadsLegsMethodRuleScreenProps {
  rule: MethodRule;
  instance: HeadsLegsMethodRuleInstance;
  variant?: "step" | "modal";
  compact?: boolean;
  onComplete?: () => void;
  onClose?: () => void;
}

export function HeadsLegsMethodRuleScreen({
  rule,
  instance,
  variant = "step",
  compact = false,
  onComplete,
  onClose,
}: HeadsLegsMethodRuleScreenProps) {
  const example = buildHeadsLegsRuleExample(instance);

  const handlePrimary = () => {
    if (variant === "modal") {
      onClose?.();
    } else {
      onComplete?.();
    }
  };

  return (
    <div data-testid="method-rule-screen">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-purple">
        {rule.title}
      </p>
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{rule.childTitle}</h3>

      <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-3 text-base font-medium leading-relaxed text-amber-950">
        {rule.anchorPhrase}
      </div>

      {!compact ? (
        <div className="mb-6 space-y-3">
          <p className="text-sm font-medium text-gray-700">Пример из этой задачи</p>
          <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-relaxed text-sky-950">
            {example.map((line, i) =>
              line === "" ? (
                <div key={i} className="h-2" />
              ) : (
                <p key={i}>{line}</p>
              ),
            )}
          </div>
        </div>
      ) : (
        <p className="mb-6 text-sm text-gray-600">
          {instance.ruleId === "heads-legs-production-base" ? (
            <>
              {instance.totalParticipants != null ? (
                <>
                  В этой задаче {instance.totalParticipants}{" "}
                  {instance.participantsLabel ?? "участников"} и {instance.totalResult}{" "}
                  {instance.resultName}
                </>
              ) : (
                <>В этой задаче всего {instance.totalResult} {instance.resultName}</>
              )}{" "}
              — представим, что все {instance.assumeKindPhrase ?? instance.assumeKind}.
            </>
          ) : instance.ruleId === "heads-legs-score-base" ? (
            <>
              В этой задаче {instance.totalObjects} {instance.objectsLabel ?? "объектов"} и{" "}
              {instance.totalScore} {instance.scoreName} — представим, что все{" "}
              {instance.assumeKindPhrase ?? instance.assumeKind}.
            </>
          ) : (
            <>
              В этой задаче {instance.totalObjects} {instance.objectsLabel ?? "объектов"} и{" "}
              {instance.totalFeature} {instance.featureName} — представим, что все{" "}
              {instance.assumeKindPhrase ?? instance.assumeKind}.
            </>
          )}
        </p>
      )}

      {!compact ? (
        <details className="mb-6 rounded-xl border border-lavender-200 bg-lavender-50/50 px-4 py-3">
          <summary className="cursor-pointer text-sm font-medium text-brand-purple">
            Полное правило
          </summary>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-gray-700">
            {rule.fullRule.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </details>
      ) : null}

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

export function HeadsLegsMethodRuleModal({
  open,
  rule,
  instance,
  onClose,
}: {
  open: boolean;
  rule: MethodRule;
  instance: HeadsLegsMethodRuleInstance;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal
      aria-labelledby="hl-method-rule-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <HeadsLegsMethodRuleScreen
          rule={rule}
          instance={instance}
          variant="modal"
          onClose={onClose}
        />
      </div>
    </div>
  );
}
