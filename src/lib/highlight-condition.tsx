import type { ReactNode } from "react";



/** Ключевые слова условия «головы и ноги» */

const HEADS_LEGS_KEYWORD_RE =

  /\b(сколько|всего|каждый|каждая|каждому|каждой|поровну|больше|меньше|вместе|остал|осталось|не\s+сказано|участвовал|участвовали|известно)\b/giu;



/** Ключевые слова для задач Дирихле */

const DIRICHLET_KEYWORD_RE =

  /\b(докаж|доказать|гарантир|минимум|максимум|худш|не\s+менее|не\s+более|остат|клетк|зайц|дирихле|если\s+бы|в\s+одной|одинаков|переполн|расклад|категори)\b/giu;



const NUMBER_RE = /(\d+(?:[.,]\d+)?)/g;



export type ConditionHighlightVariant = "heads-legs" | "dirichlet";



function keywordPattern(variant: ConditionHighlightVariant): RegExp {

  if (variant === "dirichlet") {

    return new RegExp(

      `${HEADS_LEGS_KEYWORD_RE.source}|${DIRICHLET_KEYWORD_RE.source}`,

      "giu",

    );

  }

  return new RegExp(HEADS_LEGS_KEYWORD_RE.source, HEADS_LEGS_KEYWORD_RE.flags);

}



const MONTH_AFTER_NUMBER =
  /^\s*(?:январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр)/i;

export function highlightConditionText(
  text: string,
  variant: ConditionHighlightVariant = "heads-legs",
): ReactNode[] {
  const nodes: ReactNode[] = [];
  let key = 0;
  const KEYWORD_RE = keywordPattern(variant);

  const segments = text.split(NUMBER_RE);
  for (let si = 0; si < segments.length; si++) {
    const segment = segments[si];
    if (!segment) continue;

    if (/^\d/.test(segment)) {
      const following = segments[si + 1] ?? "";
      if (MONTH_AFTER_NUMBER.test(following)) {
        nodes.push(<span key={`t-${key++}`}>{segment}</span>);
        continue;
      }

      nodes.push(
        <mark
          key={`n-${key++}`}
          className="rounded bg-amber-100 px-0.5 font-semibold text-amber-900"
        >
          {segment}
        </mark>,
      );
      continue;
    }



    let last = 0;

    let m: RegExpExecArray | null;

    const re = new RegExp(KEYWORD_RE.source, KEYWORD_RE.flags);

    while ((m = re.exec(segment)) !== null) {

      if (m.index > last) {

        nodes.push(<span key={`t-${key++}`}>{segment.slice(last, m.index)}</span>);

      }

      nodes.push(

        <mark

          key={`k-${key++}`}

          className="rounded bg-violet-100 px-0.5 font-medium text-violet-900"

        >

          {m[0]}

        </mark>,

      );

      last = m.index + m[0].length;

    }

    if (last < segment.length) {

      nodes.push(<span key={`t-${key++}`}>{segment.slice(last)}</span>);

    }

  }



  return nodes;

}

