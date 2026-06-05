"use client";

export type ExplanationRole = "intro" | "preview";

interface AutoExplanationStepProps {
  template: string[];
  role: ExplanationRole;
  onComplete: () => void;
}

export function AutoExplanationStep({ template, role, onComplete }: AutoExplanationStepProps) {
  const isPreview = role === "preview";

  return (
    <div>
      {isPreview ? (
        <p className="mb-4 text-sm text-gray-500">
          Вот как собралось твоё решение — запомни эту конструкцию:
        </p>
      ) : null}
      <div
        className={`space-y-3 ${isPreview ? "mb-6 rounded-xl bg-white p-6 shadow-card" : "mb-5 rounded-xl border border-lavender-200 bg-lavender-50/50 p-5"}`}
      >
        {template.map((line, i) => (
          <p key={i} className="text-gray-700 leading-relaxed">
            {line}
          </p>
        ))}
      </div>
      <button
        type="button"
        onClick={onComplete}
        className={
          isPreview
            ? "rounded-xl bg-gradient-to-r from-brand-purple to-brand-purple-light px-8 py-3 font-medium text-white shadow-lg"
            : "rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-medium text-white"
        }
      >
        {isPreview ? "Завершить задачу ⭐" : "Понятно, дальше →"}
      </button>
    </div>
  );
}
