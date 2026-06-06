import type { DirichletTaskMeta } from "@/data/dirichlet/types";
import { inferDirichletModel } from "@/data/dirichlet/guided/infer-model";
import { REMAINDERS_MODELS, withCompactDefaults } from "./models";
import { buildRemaindersRuleInstance } from "@/data/method-rules";
import type { RemaindersModel } from "./types";

/** Извлечь модуль из условия («делится на N», «делении на N») */
function parseModulusFromCondition(condition: string): number | null {
  const patterns = [
    /делится на\s+(\d+)/i,
    /делении на\s+(\d+)/i,
    /остатк\w*\s+при\s+делении\s+на\s+(\d+)/i,
    /mod\s*(\d+)/i,
  ];
  for (const re of patterns) {
    const m = condition.match(re);
    if (m) return parseInt(m[1], 10);
  }
  return null;
}

function labelFromEntities(
  inferred: ReturnType<typeof inferDirichletModel>,
  fallback: string,
): string {
  const label = inferred.rabbits[0]?.label?.toLowerCase() ?? "";
  if (/числ|разност|двузначн|цел/i.test(label)) {
    return label.replace(/^./, (c) => c.toLowerCase());
  }
  return fallback;
}

/** Собрать модель из inferred overrides (для F4 без явной pilot-модели) */
export function inferRemaindersModel(meta: DirichletTaskMeta): RemaindersModel | undefined {
  const inferred = inferDirichletModel(
    meta.condition,
    meta.acceptedAnswers.solutionReference,
    meta.methodTaskId,
    meta.flowId,
  );

  const objectsCount = inferred.counts.n;
  if (objectsCount == null) return undefined;

  const parsedMod = parseModulusFromCondition(meta.condition);
  const modulus = inferred.counts.m ?? parsedMod ?? undefined;
  if (modulus == null) return undefined;

  const housesCount = modulus;
  if (objectsCount <= housesCount) return undefined;

  const objectsLabel = labelFromEntities(inferred, "чисел из условия");
  const targetRelation = `разность делится на ${modulus}`;

  return withCompactDefaults({
    modulus,
    objectsCount,
    objectsLabel,
    housesCount,
    housesLabel: "остатков",
    targetRelation,
    conclusionTemplate: inferred.conclusionText || `найдутся два числа, ${targetRelation}`,
    ruleInstance: buildRemaindersRuleInstance(
      {
        modulus,
        objectsCount,
        objectsLabel,
        housesCount,
        housesLabel: "остатков",
        targetRelation,
        conclusionTemplate: "",
      },
      { showRuleScreen: false },
    ),
  });
}

/** Явная pilot-модель или inferred fallback */
export function resolveRemaindersModel(meta: DirichletTaskMeta): RemaindersModel | undefined {
  const explicit = REMAINDERS_MODELS[meta.methodTaskId];
  if (explicit) return withCompactDefaults(explicit);
  return inferRemaindersModel(meta);
}
