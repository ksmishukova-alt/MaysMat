"use client";

export type ProgressDotsProps = {
  total?: number;
  /** Номер текущей темы, 1…total */
  current: number;
  showLabel?: boolean;
};

export function ProgressDots({ total = 15, current, showLabel = true }: ProgressDotsProps) {
  const safeCurrent = Math.min(Math.max(current, 1), total);

  return (
    <div
      className="progress-dots-wrap"
      data-testid="diagnostic-progress-dots"
      aria-label={`Тема ${safeCurrent} из ${total}`}
    >
      {showLabel ? (
        <div className="progress-dots-label" data-testid="diagnostic-progress-label">
          Тема {safeCurrent} из {total}
        </div>
      ) : null}

      <div
        className="progress-dots"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={safeCurrent}
      >
        {Array.from({ length: total }, (_, index) => {
          const step = index + 1;
          const state = step < safeCurrent ? "done" : step === safeCurrent ? "active" : "future";

          return (
            <span key={step} className="progress-dots__dot" data-state={state} aria-hidden="true" />
          );
        })}
      </div>
    </div>
  );
}
