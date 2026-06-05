import type { DirichletFlowId, DirichletInferredModel } from "../types";



import { DIRICHLET_MODEL_OVERRIDES_GENERATED } from "./model-overrides.generated";

import { DIRICHLET_MODEL_MANUAL_OVERRIDES } from "./model-overrides";



export type { DirichletEntity, DirichletInferredModel } from "../types";



function mergeModel(
  base: DirichletInferredModel,
  patch?: Partial<DirichletInferredModel>,
): DirichletInferredModel {
  if (!patch) return base;

  const merged: DirichletInferredModel = {
    rabbits: patch.rabbits ?? base.rabbits,
    cells: patch.cells ?? base.cells,
    counts: { ...base.counts, ...patch.counts },
    compareOp: patch.compareOp ?? base.compareOp,
    conclusionText: patch.conclusionText ?? base.conclusionText,
  };

  const c = merged.counts;
  if (c.minInCell != null && c.minInCell > 1) {
    const derivedK = c.minInCell - 1;
    if (c.k == null || (c.m != null && c.k >= c.m)) {
      c.k = derivedK;
    }
  }

  return merged;
}



function inferRabbitsFallback(condition: string): DirichletInferredModel["rabbits"] {

  if (/турист/i.test(condition)) return [{ id: "tourists", label: "Туристы" }];

  if (/монет/i.test(condition)) return [{ id: "coins", label: "Монеты" }];

  return [{ id: "objects", label: "Предметы из условия" }];

}



function inferCellsFallback(condition: string, flowId: DirichletFlowId): DirichletInferredModel["cells"] {

  if (/день недели/i.test(condition)) return [{ id: "weekdays", label: "Дни недели" }];

  if (flowId === "F4_REMAINDERS") return [{ id: "remainders", label: "Остатки при делении" }];

  return [{ id: "categories", label: "Категории («клетки»)" }];

}



export function inferDirichletModel(

  condition: string,

  _answerKey: string,

  methodTaskId: string,

  flowId: DirichletFlowId,

): DirichletInferredModel {

  const generated = DIRICHLET_MODEL_OVERRIDES_GENERATED[methodTaskId];

  const manual = DIRICHLET_MODEL_MANUAL_OVERRIDES[methodTaskId];



  if (generated) {

    return mergeModel(generated as DirichletInferredModel, manual);

  }



  const fallback: DirichletInferredModel = {

    rabbits: inferRabbitsFallback(condition),

    cells: inferCellsFallback(condition, flowId),

    counts: { n: null, m: null },

    compareOp: "gt",

    conclusionText: "утверждение верно по принципу Дирихле",

  };

  return mergeModel(fallback, manual);

}

