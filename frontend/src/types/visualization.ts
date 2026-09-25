export type SortAlgorithm = "bubble" | "merge";

export type StepKind =
  | "start"
  | "compare"
  | "swap"
  | "mark-sorted"
  | "split"
  | "merge-compare"
  | "merge-write"
  | "complete";

export interface SortStep {
  array: number[];
  kind: StepKind;
  indices: number[];
  sorted: number[];
  message: string;
  phase: string;
}

export interface SortStats {
  comparisons: number;
  swaps: number;
  writes: number;
  passes: number;
  maxDepth: number;
}