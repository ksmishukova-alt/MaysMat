/** Какой task-runner запускает TaskPlayer */
export type TaskRunnerKind =
  | "heads-legs-guided"
  | "dirichlet-guided"
  | "dirichlet-unlucky"
  | "dirichlet-remainders"
  | "dirichlet-geometry"
  | "dirichlet-table-values"
  | "dirichlet-graph"
  | "dirichlet-coloring"
  | "paper-construction"
  | "paper-generic";
