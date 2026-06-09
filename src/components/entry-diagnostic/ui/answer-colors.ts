export const ANSWER_COLORS = {
  purple: {
    border: "#B987FF",
    bg: "#F5ECFF",
    bgHover: "#EFE2FF",
    bgSelected: "#E8D5FF",
    text: "#4B237C",
    shadow: "rgba(123, 66, 246, 0.22)",
  },
  blue: {
    border: "#7BCBFF",
    bg: "#EEF8FF",
    bgHover: "#DFF2FF",
    bgSelected: "#CDEBFF",
    text: "#174D7A",
    shadow: "rgba(46, 167, 255, 0.22)",
  },
  orange: {
    border: "#FFB85C",
    bg: "#FFF5E3",
    bgHover: "#FFEAC0",
    bgSelected: "#FFE1A3",
    text: "#8A4300",
    shadow: "rgba(255, 159, 46, 0.24)",
  },
  green: {
    border: "#74D99A",
    bg: "#EFFCF3",
    bgHover: "#DFF8E8",
    bgSelected: "#CFF1DD",
    text: "#1F6B38",
    shadow: "rgba(34, 197, 94, 0.22)",
  },
} as const;

export type AnswerColor = keyof typeof ANSWER_COLORS;

export const ANSWER_COLOR_ORDER: AnswerColor[] = ["purple", "blue", "orange", "green"];

export function answerColorAt(index: number): AnswerColor {
  return ANSWER_COLOR_ORDER[index % ANSWER_COLOR_ORDER.length]!;
}
