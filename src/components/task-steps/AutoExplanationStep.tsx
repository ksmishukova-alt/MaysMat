"use client";

interface AutoExplanationStepProps {
  template: string[];
  onComplete: () => void;
}

export function AutoExplanationStep({ template, onComplete }: AutoExplanationStepProps) {
  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">
        Вот как собралось твоё решение — запомни эту конструкцию:
      </p>
      <div className="mb-6 space-y-3 rounded-xl bg-white p-6 shadow-card">
        {template.map((line, i) => (
          <p key={i} className="text-gray-700 leading-relaxed">
            {line}
          </p>
        ))}
      </div>
      <button
        type="button"
        onClick={onComplete}
        className="rounded-xl bg-gradient-to-r from-brand-purple to-brand-purple-light px-8 py-3 font-medium text-white shadow-lg"
      >
        Завершить задачу ⭐
      </button>
    </div>
  );
}
