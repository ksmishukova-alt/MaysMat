import type { AcceptedAnswer } from "@/data/heads-legs/types";
import type { SolutionMode } from "@/data/heads-legs/solution-modes";
import type { SolutionLine } from "@/data/heads-legs/types";

const STEP_KEYWORDS: Record<string, RegExp> = {
  assumption: /представим|допустим|пусть/i,
  compute: /\d+\s*[×x*+\-/÷]|=\s*\d+/i,
  compare: /по условию|лишн|не хватает|разниц/i,
  answer: /ответ\s*:/i,
  diagnosis: /нельзя|не\s*хватает|неполн/i,
};

export function normalizeBlank(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/×/g, "x")
    .replace(/÷/g, "/")
    .replace(/[−–—]/g, "-")
    .replace(/[х]/g, "x");
}

/** Каноническая запись примера: без пробелов, единые символы умножения, деления и минуса */
export function normalizeExpression(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[х]/g, "x")
    .replace(/[×*·⋅]/g, "x")
    .replace(/[÷/:]/g, "/")
    .replace(/[−–—]/g, "-");
}

/** Полный пример: есть знак = и операция до него */
export function looksLikeFullExpression(user: string): boolean {
  const raw = user.trim();
  if (!/=/.test(raw)) return false;
  const left = raw.split("=")[0] ?? "";
  return /[×xX*·⋅+\-−÷/:]/.test(left);
}

export function blankMatchesStrict(
  user: string,
  accept: (string | number) | (string | number)[] | undefined,
): boolean {
  if (!accept) return user.trim().length > 0;
  const norm = normalizeExpression(user);
  const list = Array.isArray(accept) ? accept : [accept];
  return list.some((a) => normalizeExpression(String(a)) === norm);
}

export function blankMatches(
  user: string,
  accept: (string | number) | (string | number)[] | undefined,
): boolean {
  if (!accept) return user.trim().length > 0;
  const norm = normalizeBlank(user);
  const list = Array.isArray(accept) ? accept : [accept];
  return list.some((a) => {
    const na = normalizeBlank(String(a));
    if (norm === na) return true;
    const userNums = norm.match(/\d+/g);
    const acceptNums = na.match(/\d+/g);
    if (userNums?.length && acceptNums?.length && userNums.join() === acceptNums.join()) {
      return true;
    }
    return norm.includes(na) || na.includes(norm);
  });
}

const PROOF_REASONING = /клетк|короб|зайц|кролик|дирихл|если бы|предполож|противореч|больше|не более|не менее|доказ|остат|раскрас|разбиен/i;

function validateProofSolution(text: string, accepted: Extract<AcceptedAnswer, { kind: "proof" }>) {
  const t = text.trim();
  const norm = normalizeBlank(t);

  if (t.length < 40) {
    return { ok: false, message: "Решение слишком короткое. Добавь рассуждение и вывод." };
  }

  if (!PROOF_REASONING.test(t)) {
    return {
      ok: false,
      message: "Объясни связь «предметов» и «клеток»: что раскладываем, куда и почему вывод неизбежен.",
    };
  }

  if (accepted.answerTokens?.length) {
    const hit = accepted.answerTokens.some((token) => {
      const nt = normalizeBlank(token);
      return nt.length >= 2 && (norm.includes(nt) || nt.includes(norm.slice(0, Math.min(norm.length, 24))));
    });
    if (!hit && accepted.answerPhrase) {
      const phrase = normalizeBlank(accepted.answerPhrase);
      if (!norm.includes(phrase.slice(0, Math.min(phrase.length, 20)))) {
        return { ok: false, message: "Проверь итоговый ответ — он должен совпадать с условием задачи." };
      }
    }
  } else if (accepted.answerPhrase) {
    const phrase = normalizeBlank(accepted.answerPhrase);
    const snippet = phrase.slice(0, Math.min(phrase.length, 24));
    if (snippet.length >= 3 && !norm.includes(snippet)) {
      return { ok: false, message: `В решении должен быть ответ: «${accepted.answerPhrase.slice(0, 60)}».` };
    }
  }

  if (accepted.signatureNumbers?.length) {
    const hasNumber = accepted.signatureNumbers.some((n) => t.includes(String(n)));
    if (!hasNumber && !accepted.answerPhrase) {
      return { ok: false, message: "Добавь ключевые числа из рассуждения (сравнение количеств)." };
    }
  }

  return { ok: true };
}

export function validateWordSolution(
  text: string,
  mode: SolutionMode,
  accepted: AcceptedAnswer,
  _lines?: SolutionLine[],
): { ok: boolean; message?: string } {
  const t = text.trim();

  if (accepted.kind === "proof") {
    return validateProofSolution(text, accepted);
  }

  if (t.length < 40) {
    return { ok: false, message: "Решение слишком короткое. Добавь рассуждение и ответ." };
  }

  if (mode === "D" || accepted.kind === "diagnostic") {
    if (!STEP_KEYWORDS.diagnosis.test(t)) {
      return { ok: false, message: "Объясни, какого числа не хватает или почему ответ не единственный." };
    }
    return { ok: true };
  }

  if (!STEP_KEYWORDS.assumption.test(t)) {
    return { ok: false, message: "Добавь строку с предположением («Представим, что все…»)." };
  }
  if (!STEP_KEYWORDS.compute.test(t)) {
    return { ok: false, message: "Добавь вычисления с числами." };
  }
  if (!STEP_KEYWORDS.answer.test(t)) {
    return { ok: false, message: "Заверши строкой «Ответ: …»." };
  }

  if (accepted.kind === "single_scalar") {
    if (!t.includes(String(accepted.value))) {
      return { ok: false, message: `В решении должно быть число ${accepted.value}.` };
    }
  }

  if (accepted.kind === "text") {
    if (!t.includes(accepted.format)) {
      return { ok: false, message: `Ответ должен содержать «${accepted.format}».` };
    }
  }

  if (accepted.kind === "single") {
    const nums = Object.values(accepted.values);
    if (!nums.every((n) => t.includes(String(n)))) {
      return { ok: false, message: "Проверь, что в тексте есть все числа из ответа." };
    }
  }

  if (accepted.kind === "multi_set") {
    const matched = accepted.sets.filter((set) => {
      const nums = Object.values(set);
      return nums.every((n) => t.includes(String(n)));
    });
    if (matched.length === 0) {
      return { ok: false, message: "Запиши хотя бы один полный вариант ответа со всеми числами." };
    }
    if (matched.length < accepted.sets.length && !/вариант|возможн|или|также|ещё|еще/i.test(t)) {
      return {
        ok: false,
        message: `В задаче ${accepted.sets.length} варианта ответа — найди и запиши все.`,
      };
    }
  }

  return { ok: true };
}
