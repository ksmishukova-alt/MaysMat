/** Методический шаблон темы (v2) */

export interface MethodLadderStep {
  level: 1 | 2 | 3 | 4 | 5;
  role: string;
  taskId?: string;
  hints: string;
}

export interface TopicMethodology {
  branchId: string;
  title: string;
  mentalModel: string;
  algorithm: string[];
  ladder: MethodLadderStep[];
}
