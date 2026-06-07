/**
 * Каноническая методическая карта банка «Головы и ноги» (51 задача).
 * Назначение runner — по primaryMethod / preludeType, НЕ по legacy patternId.
 *
 * Pattern 5 runner ЗАМОРОЖЕН (июнь 2026): публикация и новые pilot — только после этого аудита.
 */

import { HEADS_LEGS_CATALOG } from "./catalog.generated";
import { HEADS_LEGS_TASKS } from "./build-task";
import { resolveHeadsLegsPilot } from "./pilot/resolve";
import { isHeadsLegsProgressionTask } from "./base-pattern/build-player-steps";
import {
  CANONICAL_PUBLISH_BY_METHOD,
  PATTERN5_FROZEN,
  PUBLICATION_CANDIDATE_CHILD_ROUTE_ALLOWLIST,
} from "./full-methodology-audit-publish";
import { HEADS_LEGS_CHILD_ROUTE_MAX_NUMBER } from "@/data/task-publishing/config";
import type { HeadsLegsProgressionProfile } from "@/data/method-rules/types";

/** Математический / runner-метод (не legacy patternId) */
export type PrimaryMethod =
  | "standard_replacement"
  | "value_replacement"
  | "production_replacement"
  | "score_plus_minus"
  | "score_ordinary"
  | "score_match_total"
  | "transfer_replacement"
  | "compare_after_replacement"
  | "diagnostic_incomplete"
  | "enumeration"
  | "multiple_answers"
  | "triple_type_replacement"
  | "text_ratio_answer"
  | "key_condition_equality"
  | "feature_switch_then_replace"
  | "unit_conversion_then_replace"
  | "common_resource_then_replace"
  | "limb_decompose"
  | "derived_feature"
  | "multi_limb_constraint"
  | "unsupported_for_now";

/** Что нужно получить ДО основного метода */
export type PreludeType =
  | "none"
  | "derive_total_objects"
  | "unit_conversion"
  | "feature_switch"
  | "common_resource"
  | "limb_decompose"
  | "derived_half_feature"
  | "multi_feature_balance"
  | "key_condition_equality"
  | "missing_total_objects";

/** Платформенный режим решения (не буква A–E из каталога) */
export type PlatformSolutionMode =
  | "standard_replacement"
  | "diagnostic"
  | "enumeration"
  | "multiple_answers"
  | "compare_results"
  | "match_total"
  | "transfer"
  | "paper_solution"
  | "unsupported_for_now";

export type ExpressionScaffoldLevel =
  | "result_only"
  | "one_operand_blank"
  | "assemble_expression"
  | "write_expression"
  | "write_full_solution";

export type PublishRecommendation =
  | "childRoute"
  | "publicationCandidate"
  | "reserve"
  | "blocked"
  | "methodistOnly"
  | "algebraCandidate";

export interface FullMethodologyAuditRecord {
  taskId: string;
  catalogNumber: number;
  methodTaskId: string;
  title: string;
  /** Legacy patternId из каталога — только справочно */
  legacyPatternId: number;
  primaryMethod: PrimaryMethod;
  preludeType: PreludeType;
  solutionMode: PlatformSolutionMode;
  progressionProfile: HeadsLegsProgressionProfile | 5;
  expressionScaffoldLevel: ExpressionScaffoldLevel;
  /** Каноническая рекомендация из методической карты (без учёта фактического tier) */
  canonicalPublishRecommendation: PublishRecommendation;
  /** С учётом текущего publishTier в build-task (для отчётов) */
  publishRecommendation: PublishRecommendation;
  blockers: string[];
  notes: string;
  /** Текущий ruleId pilot, если есть */
  currentRuleId?: string;
  /** Pilot flow, если есть */
  currentFlowMode?: string;
  /** Рекомендуемый ruleId по методике */
  recommendedRuleId: string;
  algebraCandidate: boolean;
}

/** Ручная методическая классификация по methodTaskId */
const AUDIT_BY_METHOD_ID: Record<
  string,
  Omit<
    FullMethodologyAuditRecord,
    | "taskId"
    | "catalogNumber"
    | "methodTaskId"
    | "title"
    | "legacyPatternId"
    | "currentRuleId"
    | "currentFlowMode"
    | "canonicalPublishRecommendation"
    | "publishRecommendation"
  > & { recommendedRuleId?: string; publishRecommendation: PublishRecommendation }
> = {
  "1.1": {
    primaryMethod: "standard_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 1,
    expressionScaffoldLevel: "one_operand_blank",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Эталон base profile 1. Полный rule-flow.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "1.2": {
    primaryMethod: "standard_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 2,
    expressionScaffoldLevel: "one_operand_blank",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Base profile 2, compact rule.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "1.3": {
    primaryMethod: "standard_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 2,
    expressionScaffoldLevel: "one_operand_blank",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Два ответа в вопросе; оба вида > 0.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "1.4": {
    primaryMethod: "standard_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Hub выбора шага, mode B blanks.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "1.5": {
    primaryMethod: "derived_feature",
    preludeType: "derived_half_feature",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "242 правые = половина ног; не derive-base, а derived_feature внутри base.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: false,
  },
  "1.6": {
    primaryMethod: "standard_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 4,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Profile 4: word + preview.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "1.7": {
    primaryMethod: "standard_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 4,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Profile 4.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "1.8": {
    primaryMethod: "text_ratio_answer",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "childRoute",
    blockers: ["legacy guided runner — нет progression pilot"],
    notes: "Ответ текстом «4:6», не два числа. Нужен отдельный answerTransform text.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: false,
  },
  "1.9": {
    primaryMethod: "multi_limb_constraint",
    preludeType: "multi_feature_balance",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["custom steps-1-9", "legacy guided", "два признака: ноги + руки"],
    notes: "Не heads-legs в лоб; custom worksheets. Reserve до unified multi-feature runner.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: false,
  },
  "1.10": {
    primaryMethod: "standard_replacement",
    preludeType: "derive_total_objects",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "reserve",
    blockers: ["нет totalObjects в условии явно", "legacy DigitalTaskPlayer"],
    notes: "17 голов + 54 ноги → нужен prelude «сколько участников». Reserve.",
    recommendedRuleId: "heads-legs-derive-base",
    algebraCandidate: true,
  },
  "1.11": {
    primaryMethod: "compare_after_replacement",
    preludeType: "none",
    solutionMode: "compare_results",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["legacy guided", "compare_results без pilot"],
    notes: "Сравнение «кого больше и на сколько» после замены.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: false,
  },
  "1.13": {
    primaryMethod: "standard_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["legacy guided", "mode C"],
    notes: "12 роботов явно; AT-ST vs AT-AT. Кандидат publication после legacy→pilot.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "1.14": {
    primaryMethod: "standard_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["legacy custom steps-1-14", "люди сидят на стульях — лишние ноги"],
    notes: "120 ног включает людей; custom runner. Reserve.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: false,
  },
  "2.1": {
    primaryMethod: "value_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 1,
    expressionScaffoldLevel: "assemble_expression",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Value pattern этalon p1.",
    recommendedRuleId: "heads-legs-value-base",
    algebraCandidate: true,
  },
  "2.2": {
    primaryMethod: "value_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 2,
    expressionScaffoldLevel: "one_operand_blank",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Value p2.",
    recommendedRuleId: "heads-legs-value-base",
    algebraCandidate: true,
  },
  "2.3": {
    primaryMethod: "value_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 2,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Value p2, mode B.",
    recommendedRuleId: "heads-legs-value-base",
    algebraCandidate: true,
  },
  "2.4": {
    primaryMethod: "value_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Value hub p3.",
    recommendedRuleId: "heads-legs-value-base",
    algebraCandidate: true,
  },
  "2.5": {
    primaryMethod: "value_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "answerTransform multiply_found_objects.",
    recommendedRuleId: "heads-legs-value-base",
    algebraCandidate: true,
  },
  "2.6": {
    primaryMethod: "value_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 4,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Value p4.",
    recommendedRuleId: "heads-legs-value-base",
    algebraCandidate: true,
  },
  "2.7": {
    primaryMethod: "value_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 4,
    expressionScaffoldLevel: "assemble_expression",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Value p4, mode A.",
    recommendedRuleId: "heads-legs-value-base",
    algebraCandidate: true,
  },
  "3.1": {
    primaryMethod: "diagnostic_incomplete",
    preludeType: "missing_total_objects",
    solutionMode: "diagnostic",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["нет числа учеников", "mode E/D+", "custom diagnostic"],
    notes: "Данных не хватает без допущения. Не replacement в лоб.",
    recommendedRuleId: "heads-legs-production-base",
    algebraCandidate: false,
  },
  "3.2": {
    primaryMethod: "enumeration",
    preludeType: "missing_total_objects",
    solutionMode: "enumeration",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Production enumeration pilot.",
    recommendedRuleId: "heads-legs-production-base",
    algebraCandidate: false,
  },
  "3.3": {
    primaryMethod: "production_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 1,
    expressionScaffoldLevel: "one_operand_blank",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Production p1.",
    recommendedRuleId: "heads-legs-production-base",
    algebraCandidate: true,
  },
  "3.4": {
    primaryMethod: "production_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Production hub p3.",
    recommendedRuleId: "heads-legs-production-base",
    algebraCandidate: true,
  },
  "3.5": {
    primaryMethod: "compare_after_replacement",
    preludeType: "none",
    solutionMode: "compare_results",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Production compare_results pilot.",
    recommendedRuleId: "heads-legs-production-base",
    algebraCandidate: false,
  },
  "3.6": {
    primaryMethod: "production_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 4,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Production p4.",
    recommendedRuleId: "heads-legs-production-base",
    algebraCandidate: true,
  },
  "3.7": {
    primaryMethod: "diagnostic_incomplete",
    preludeType: "missing_total_objects",
    solutionMode: "diagnostic",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Diagnostic pilot — несколько ответов по числу девочек.",
    recommendedRuleId: "heads-legs-production-base",
    algebraCandidate: false,
  },
  "4.1": {
    primaryMethod: "score_plus_minus",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 1,
    expressionScaffoldLevel: "one_operand_blank",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Score plus_minus p1.",
    recommendedRuleId: "heads-legs-score-base",
    algebraCandidate: true,
  },
  "4.2": {
    primaryMethod: "score_ordinary",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 2,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Ordinary score; question-check критичен.",
    recommendedRuleId: "heads-legs-score-base",
    algebraCandidate: true,
  },
  "4.3": {
    primaryMethod: "transfer_replacement",
    preludeType: "none",
    solutionMode: "transfer",
    progressionProfile: 4,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Transfer этalon: 4 экрана, base rule (не score).",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "4.4": {
    primaryMethod: "score_match_total",
    preludeType: "none",
    solutionMode: "match_total",
    progressionProfile: 2,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Match total special mode.",
    recommendedRuleId: "heads-legs-score-base",
    algebraCandidate: false,
  },
  "4.5": {
    primaryMethod: "score_plus_minus",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "childRoute",
    blockers: [],
    notes: "Plus_minus hub p3.",
    recommendedRuleId: "heads-legs-score-base",
    algebraCandidate: true,
  },
  "5.1": {
    primaryMethod: "feature_switch_then_replace",
    preludeType: "feature_switch",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["prelude: ноги→22 животных, потом рога", "custom steps-5-1", "pattern 5 frozen"],
    notes: "Derive-base кандидат Wave C. Не публиковать до runner.",
    recommendedRuleId: "heads-legs-derive-base",
    algebraCandidate: false,
  },
  "5.2": {
    primaryMethod: "unit_conversion_then_replace",
    preludeType: "unit_conversion",
    solutionMode: "standard_replacement",
    progressionProfile: 2,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["54 пары → 108 ног", "pattern 5 frozen"],
    notes: "Derive-base: unit_conversion prelude.",
    recommendedRuleId: "heads-legs-derive-base",
    algebraCandidate: false,
  },
  "5.3": {
    primaryMethod: "transfer_replacement",
    preludeType: "none",
    solutionMode: "transfer",
    progressionProfile: 4,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "publicationCandidate",
    blockers: ["methodist pilot only (catalog > 31)", "manual smoke pending"],
    notes: "НЕ derive-base: все данные в условии. Transfer + method choice.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "5.4": {
    primaryMethod: "compare_after_replacement",
    preludeType: "none",
    solutionMode: "compare_results",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "reserve",
    blockers: ["compare_results runner", "pattern 5 frozen"],
    notes: "Стандартная замена + compare.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: false,
  },
  "5.5": {
    primaryMethod: "limb_decompose",
    preludeType: "limb_decompose",
    solutionMode: "unsupported_for_now",
    progressionProfile: 4,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "blocked",
    blockers: ["limb_decompose runner", "custom steps-5-5", "не replacement в лоб"],
    notes: "methodistOnly/blocked. Не reserve.",
    recommendedRuleId: "heads-legs-derive-base",
    algebraCandidate: false,
  },
  "5.6": {
    primaryMethod: "common_resource_then_replace",
    preludeType: "common_resource",
    solutionMode: "standard_replacement",
    progressionProfile: 2,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "publicationCandidate",
    blockers: ["derive-base prelude: 17 мечей из рукоятей", "pattern 5 frozen", "Wave B stopped"],
    notes: "Настоящий derive-base pilot (после 5.3 transfer validation).",
    recommendedRuleId: "heads-legs-derive-base",
    algebraCandidate: false,
  },
  "5.7": {
    primaryMethod: "key_condition_equality",
    preludeType: "key_condition_equality",
    solutionMode: "unsupported_for_now",
    progressionProfile: 4,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "blocked",
    blockers: ["ratio/equality, не replacement", "отдельный runner"],
    notes: "Blocked до ratio runner или algebra.",
    recommendedRuleId: "heads-legs-derive-base",
    algebraCandidate: true,
  },
  "6.1": {
    primaryMethod: "triple_type_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["3 вида объектов", "custom steps-6-1", "legacy guided"],
    notes: "228 генералов — исправленный вопрос.",
    recommendedRuleId: "heads-legs-production-base",
    algebraCandidate: false,
  },
  "6.2": {
    primaryMethod: "triple_type_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["3 вида", "custom structural"],
    notes: "Reserve stage 6.",
    recommendedRuleId: "heads-legs-production-base",
    algebraCandidate: false,
  },
  "6.3": {
    primaryMethod: "multiple_answers",
    preludeType: "none",
    solutionMode: "multiple_answers",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["multi_set answers", "enumeration-like"],
    notes: "3 допустимых состава флота.",
    recommendedRuleId: "heads-legs-production-base",
    algebraCandidate: false,
  },
  "6.4": {
    primaryMethod: "triple_type_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["3 вида столов", "custom"],
    notes: "Reserve.",
    recommendedRuleId: "heads-legs-production-base",
    algebraCandidate: false,
  },
  "6.5": {
    primaryMethod: "multiple_answers",
    preludeType: "none",
    solutionMode: "multiple_answers",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["multi_set / mode D", "custom steps-6-5"],
    notes: "Несколько распределений лет обучения.",
    recommendedRuleId: "heads-legs-production-base",
    algebraCandidate: false,
  },
  "7.1": {
    primaryMethod: "key_condition_equality",
    preludeType: "key_condition_equality",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["равенство лап", "legacy guided"],
    notes: "Stage 7 — ключевое условие.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "7.2": {
    primaryMethod: "key_condition_equality",
    preludeType: "key_condition_equality",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["равенство колёс", "legacy"],
    notes: "Reserve stage 7.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "7.3": {
    primaryMethod: "standard_replacement",
    preludeType: "none",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_expression",
    publishRecommendation: "reserve",
    blockers: ["legacy guided", "уравнение на углы"],
    notes: "Algebra candidate сильный.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "7.4": {
    primaryMethod: "key_condition_equality",
    preludeType: "key_condition_equality",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["custom steps-7-4", "головы поровну"],
    notes: "Structural custom.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "7.5": {
    primaryMethod: "key_condition_equality",
    preludeType: "key_condition_equality",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["legacy guided"],
    notes: "25 существ, головы поровну.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
  "7.6": {
    primaryMethod: "diagnostic_incomplete",
    preludeType: "missing_total_objects",
    solutionMode: "diagnostic",
    progressionProfile: 4,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "methodistOnly",
    blockers: ["нет числа существ", "mode D", "custom steps-7-6"],
    notes: "Диагностика: данных не хватает для unique answer.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: false,
  },
  "7.7": {
    primaryMethod: "key_condition_equality",
    preludeType: "key_condition_equality",
    solutionMode: "standard_replacement",
    progressionProfile: 3,
    expressionScaffoldLevel: "write_full_solution",
    publishRecommendation: "reserve",
    blockers: ["legacy guided", "горбы + равенство лошадей и верблюдов"],
    notes: "Stage 7 финал.",
    recommendedRuleId: "heads-legs-base",
    algebraCandidate: true,
  },
};

function inferPublishFromCatalog(
  entry: (typeof HEADS_LEGS_CATALOG)[number],
  override: PublishRecommendation,
): PublishRecommendation {
  const task = HEADS_LEGS_TASKS[entry.id];
  const tier = task?.publishing?.publishTier;
  if (override !== "childRoute" && override !== "publicationCandidate") return override;
  if (entry.number <= HEADS_LEGS_CHILD_ROUTE_MAX_NUMBER && tier === "childRoute") {
    return "childRoute";
  }
  if (entry.number > HEADS_LEGS_CHILD_ROUTE_MAX_NUMBER && override === "childRoute") {
    return "publicationCandidate";
  }
  return override;
}

function buildRecord(entry: (typeof HEADS_LEGS_CATALOG)[number]): FullMethodologyAuditRecord {
  const override = AUDIT_BY_METHOD_ID[entry.methodTaskId];
  if (!override) {
    throw new Error(`Missing audit override for ${entry.methodTaskId}`);
  }
  const pilot = resolveHeadsLegsPilot(entry.methodTaskId);
  const canonicalPublishRecommendation =
    CANONICAL_PUBLISH_BY_METHOD[entry.methodTaskId] ?? override.publishRecommendation;
  const publishRecommendation = inferPublishFromCatalog(entry, canonicalPublishRecommendation);

  return {
    taskId: entry.id,
    catalogNumber: entry.number,
    methodTaskId: entry.methodTaskId,
    title: entry.title,
    legacyPatternId: entry.patternId,
    primaryMethod: override.primaryMethod,
    preludeType: override.preludeType,
    solutionMode: override.solutionMode,
    progressionProfile: override.progressionProfile,
    expressionScaffoldLevel: override.expressionScaffoldLevel,
    canonicalPublishRecommendation: canonicalPublishRecommendation,
    publishRecommendation,
    blockers: override.blockers,
    notes: override.notes,
    currentRuleId: pilot?.ruleInstance.ruleId,
    currentFlowMode: pilot?.flowMode,
    recommendedRuleId: override.recommendedRuleId ?? pilot?.ruleInstance.ruleId ?? "heads-legs-base",
    algebraCandidate: override.algebraCandidate,
  };
}

/** Полный аудит 51 задачи */
export const HEADS_LEGS_FULL_METHODOLOGY_AUDIT: FullMethodologyAuditRecord[] =
  HEADS_LEGS_CATALOG.map(buildRecord).sort((a, b) => a.catalogNumber - b.catalogNumber);

export function getFullMethodologyAudit(
  taskIdOrMethodId: string,
): FullMethodologyAuditRecord | undefined {
  return HEADS_LEGS_FULL_METHODOLOGY_AUDIT.find(
    (r) => r.taskId === taskIdOrMethodId || r.methodTaskId === taskIdOrMethodId,
  );
}

export const CHILD_ROUTE_AUDIT = HEADS_LEGS_FULL_METHODOLOGY_AUDIT.filter(
  (r) => r.publishRecommendation === "childRoute",
);

export const PUBLICATION_CANDIDATES = HEADS_LEGS_FULL_METHODOLOGY_AUDIT.filter(
  (r) => r.publishRecommendation === "publicationCandidate",
);

export const RESERVE_TASKS = HEADS_LEGS_FULL_METHODOLOGY_AUDIT.filter(
  (r) => r.publishRecommendation === "reserve",
);

export const BLOCKED_TASKS = HEADS_LEGS_FULL_METHODOLOGY_AUDIT.filter(
  (r) => r.publishRecommendation === "blocked",
);

export const METHODIST_ONLY_TASKS = HEADS_LEGS_FULL_METHODOLOGY_AUDIT.filter(
  (r) => r.publishRecommendation === "methodistOnly",
);

export const ALGEBRA_CANDIDATES = HEADS_LEGS_FULL_METHODOLOGY_AUDIT.filter(
  (r) => r.algebraCandidate,
);

/** Pattern 5 заморожен — все задачи stage 5 */
export { PATTERN5_FROZEN } from "./full-methodology-audit-publish";

export const PATTERN5_TASK_IDS = HEADS_LEGS_FULL_METHODOLOGY_AUDIT.filter(
  (r) => r.legacyPatternId === 5,
).map((r) => r.taskId);

/**
 * Рекомендуемый порядок прохождения (по методу, не по legacy patternId).
 * Фазы обучения → core tasks → reserve.
 */
export const RECOMMENDED_ROUTE_ORDER: string[] = [
  // Фаза A — base replacement
  "heads-legs-1-01",
  "heads-legs-1-02",
  "heads-legs-1-03",
  "heads-legs-1-04",
  "heads-legs-1-06",
  "heads-legs-1-07",
  // Фаза B — value
  "heads-legs-2-01",
  "heads-legs-2-02",
  "heads-legs-2-03",
  "heads-legs-2-04",
  "heads-legs-2-05",
  "heads-legs-2-06",
  "heads-legs-2-07",
  // Фаза C — production
  "heads-legs-3-03",
  "heads-legs-3-04",
  "heads-legs-3-06",
  "heads-legs-3-02",
  "heads-legs-3-05",
  "heads-legs-3-07",
  // Фаза D — score ordinary → plus_minus
  "heads-legs-4-02",
  "heads-legs-4-01",
  "heads-legs-4-05",
  "heads-legs-4-04",
  // Фаза E — transfer (узнавание метода)
  "heads-legs-4-03",
  "heads-legs-5-03",
  // Фаза F — derive-base (после transfer validation)
  "heads-legs-5-02",
  "heads-legs-5-06",
  "heads-legs-5-01",
  // Фаза G — compare / special
  "heads-legs-5-04",
  "heads-legs-1-11",
  // Фаза H — derived / multi-feature reserve
  "heads-legs-1-05",
  "heads-legs-1-13",
  "heads-legs-1-10",
  "heads-legs-1-08",
  "heads-legs-1-09",
  "heads-legs-1-14",
  // Фаза I — stage 6
  "heads-legs-6-01",
  "heads-legs-6-02",
  "heads-legs-6-04",
  "heads-legs-6-03",
  "heads-legs-6-05",
  // Фаза J — stage 7
  "heads-legs-7-03",
  "heads-legs-7-01",
  "heads-legs-7-02",
  "heads-legs-7-04",
  "heads-legs-7-05",
  "heads-legs-7-07",
  "heads-legs-7-06",
  // Заблокированные / methodist (вне child route)
  "heads-legs-5-05",
  "heads-legs-5-07",
  "heads-legs-3-01",
];

/** Задачи без progression pilot (legacy guided) */
export const LEGACY_GUIDED_TASK_IDS = HEADS_LEGS_FULL_METHODOLOGY_AUDIT.filter((r) => {
  const task = HEADS_LEGS_TASKS[r.taskId];
  return task && !isHeadsLegsProgressionTask(task);
}).map((r) => r.taskId);

const DERIVE_PRELUDE_TYPES: PreludeType[] = [
  "derive_total_objects",
  "unit_conversion",
  "feature_switch",
  "common_resource",
];

/** Ожидаемый flowMode pilot по канонической карте (если pilot подключён) */
export function expectedPilotFlowMode(
  record: FullMethodologyAuditRecord,
): "transfer" | "derive" | "standard" | "enumeration" | "multiple_answers" | undefined {
  if (record.primaryMethod === "transfer_replacement") return "transfer";
  if (DERIVE_PRELUDE_TYPES.includes(record.preludeType)) return "derive";
  if (record.solutionMode === "enumeration") return "enumeration";
  if (record.solutionMode === "multiple_answers") return "multiple_answers";
  if (record.solutionMode === "unsupported_for_now") return undefined;
  if (
    record.primaryMethod === "standard_replacement" ||
    record.primaryMethod === "value_replacement" ||
    record.primaryMethod === "production_replacement" ||
    record.primaryMethod.startsWith("score_") ||
    record.primaryMethod === "compare_after_replacement" ||
    record.primaryMethod === "derived_feature" ||
    record.primaryMethod === "text_ratio_answer"
  ) {
    return "standard";
  }
  return undefined;
}

/** Можно ли публиковать в childRoute по канонической карте */
export function isChildRouteAllowedByAudit(record: FullMethodologyAuditRecord): boolean {
  return record.canonicalPublishRecommendation === "childRoute";
}

/** Pattern 5: auto childRoute запрещён, кроме явного allowlist publicationCandidate */
export function isPattern5FrozenForChildRoute(record: FullMethodologyAuditRecord): boolean {
  if (record.legacyPatternId !== 5) return false;
  if (record.canonicalPublishRecommendation === "publicationCandidate") return true;
  return true;
}

export type MethodologyAuditIssue =
  | "transfer_on_derive_runner"
  | "derive_without_prelude"
  | "blocked_in_child_route"
  | "methodist_only_in_child_route"
  | "publication_candidate_in_child_route"
  | "pattern5_frozen_in_child_route"
  | "runner_flow_mismatch"
  | "runner_rule_mismatch";

/** Проверка соответствия pilot канонической карте */
export function collectMethodologyAuditIssues(
  record: FullMethodologyAuditRecord,
  opts?: { childRouteVisible?: boolean },
): MethodologyAuditIssue[] {
  const issues: MethodologyAuditIssue[] = [];
  const pilot = resolveHeadsLegsPilot(record.methodTaskId);
  const childVisible = opts?.childRouteVisible ?? false;

  if (
    record.primaryMethod === "transfer_replacement" &&
    record.preludeType === "none"
  ) {
    if (pilot?.flowMode === "derive") issues.push("transfer_on_derive_runner");
    if (pilot?.ruleInstance.ruleId === "heads-legs-derive-base") {
      issues.push("transfer_on_derive_runner");
    }
  }

  if (pilot?.flowMode === "derive" && !DERIVE_PRELUDE_TYPES.includes(record.preludeType)) {
    issues.push("derive_without_prelude");
  }

  const expectedFlow = expectedPilotFlowMode(record);
  if (pilot?.flowMode && expectedFlow && pilot.flowMode !== expectedFlow) {
    issues.push("runner_flow_mismatch");
  }

  if (pilot && record.recommendedRuleId && pilot.ruleInstance.ruleId !== record.recommendedRuleId) {
    if (
      record.primaryMethod === "transfer_replacement" &&
      pilot.ruleInstance.ruleId === "heads-legs-derive-base"
    ) {
      issues.push("runner_rule_mismatch");
    }
  }

  if (childVisible) {
    const allowlisted = PUBLICATION_CANDIDATE_CHILD_ROUTE_ALLOWLIST.has(record.taskId);
    if (record.canonicalPublishRecommendation === "blocked") {
      issues.push("blocked_in_child_route");
    }
    if (record.canonicalPublishRecommendation === "methodistOnly") {
      issues.push("methodist_only_in_child_route");
    }
    if (record.canonicalPublishRecommendation === "publicationCandidate" && !allowlisted) {
      issues.push("publication_candidate_in_child_route");
    }
    if (
      PATTERN5_FROZEN &&
      record.legacyPatternId === 5 &&
      record.canonicalPublishRecommendation !== "childRoute" &&
      !allowlisted
    ) {
      issues.push("pattern5_frozen_in_child_route");
    }
  }

  return issues;
}

/** publicationCandidate, прошедшие smoke — явный allowlist для childRoute */
export { PUBLICATION_CANDIDATE_CHILD_ROUTE_ALLOWLIST } from "./full-methodology-audit-publish";

export function canAutoPublishToChildRoute(record: FullMethodologyAuditRecord): boolean {
  if (record.canonicalPublishRecommendation === "childRoute") return true;
  if (
    record.canonicalPublishRecommendation === "publicationCandidate" &&
    PUBLICATION_CANDIDATE_CHILD_ROUTE_ALLOWLIST.has(record.taskId)
  ) {
    return true;
  }
  return false;
}
