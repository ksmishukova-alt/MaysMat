"use client";

interface StepSuccessProps {
  message?: string;
}

export function StepSuccess({ message = "✅ Верно!" }: StepSuccessProps) {
  return (
    <p className="animate-pulse text-lg font-medium text-green-600" role="status">
      {message}
    </p>
  );
}
