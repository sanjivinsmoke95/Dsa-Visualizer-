import type { SortStep, SortStats } from "../types/visualization";

const snapshot = (a: number[]) => [...a];

export function bubbleSortSteps(input: number[]): { steps: SortStep[]; stats: SortStats } {
  const a = [...input];
  const steps: SortStep[] = [{
    array: snapshot(a), kind: "start", indices: [], sorted: [], message: "Start with the input array.", phase: "Initial state"
  }];
  const sorted = new Set<number>();
  let comparisons = 0;
  let swaps = 0;
  let passes = 0;

  for (let end = a.length - 1; end > 0; end--) {
    passes++;
    let changed = false;
    for (let j = 0; j < end; j++) {
      comparisons++;
      steps.push({
        array: snapshot(a), kind: "compare", indices: [j, j + 1], sorted: [...sorted],
        message: `Compare ${a[j]} and ${a[j + 1]}.`, phase: `Pass ${passes} · comparison`
      });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        changed = true;
        steps.push({
          array: snapshot(a), kind: "swap", indices: [j, j + 1], sorted: [...sorted],
          message: `Swap them because ${a[j]} is now followed by the smaller value.`, phase: `Pass ${passes} · swap`
        });
      }
    }
    sorted.add(end);
    steps.push({
      array: snapshot(a), kind: "mark-sorted", indices: [end], sorted: [...sorted],
      message: `The largest remaining value is now fixed at position ${end}.`, phase: `Pass ${passes} complete`
    });
    if (!changed) {
      for (let i = 0; i < end; i++) sorted.add(i);
      break;
    }
  }
  sorted.add(0);
  steps.push({
    array: snapshot(a), kind: "complete", indices: [], sorted: [...Array(a.length).keys()],
    message: "Array sorted. Bubble Sort is complete.", phase: "Complete"
  });
  return { steps, stats: { comparisons, swaps, writes: swaps * 2, passes, maxDepth: 1 } };
}

export function mergeSortSteps(input: number[]): { steps: SortStep[]; stats: SortStats } {
  const a = [...input];
  const steps: SortStep[] = [{
    array: snapshot(a), kind: "start", indices: [], sorted: [], message: "Start with the input array.", phase: "Initial state"
  }];
  let comparisons = 0;
  let writes = 0;
  let maxDepth = 0;

  function merge(left: number, mid: number, right: number, depth: number) {
    const L = a.slice(left, mid + 1);
    const R = a.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;
    while (i < L.length && j < R.length) {
      comparisons++;
      steps.push({
        array: snapshot(a), kind: "merge-compare", indices: [left + i, mid + 1 + j],
        sorted: [], message: `Compare ${L[i]} and ${R[j]} while merging.`, phase: `Merge [${left}..${right}]`
      });
      if (L[i] <= R[j]) a[k] = L[i++];
      else a[k] = R[j++];
      writes++;
      steps.push({
        array: snapshot(a), kind: "merge-write", indices: [k], sorted: [],
        message: `Write the smaller value into position ${k}.`, phase: `Merge [${left}..${right}]`
      });
      k++;
    }
    while (i < L.length) {
      a[k] = L[i++];
      writes++;
      steps.push({
        array: snapshot(a), kind: "merge-write", indices: [k], sorted: [],
        message: `Append the remaining left value into position ${k}.`, phase: `Merge [${left}..${right}]`
      });
      k++;
    }
    while (j < R.length) {
      a[k] = R[j++];
      writes++;
      steps.push({
        array: snapshot(a), kind: "merge-write", indices: [k], sorted: [],
        message: `Append the remaining right value into position ${k}.`, phase: `Merge [${left}..${right}]`
      });
      k++;
    }
  }

  function divide(left: number, right: number, depth: number) {
    maxDepth = Math.max(maxDepth, depth);
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    steps.push({
      array: snapshot(a), kind: "split", indices: [left, mid, right], sorted: [],
      message: `Split the range [${left}..${right}] at ${mid}.`, phase: `Depth ${depth} · split`
    });
    divide(left, mid, depth + 1);
    divide(mid + 1, right, depth + 1);
    merge(left, mid, right, depth);
  }

  if (a.length > 1) divide(0, a.length - 1, 1);
  steps.push({
    array: snapshot(a), kind: "complete", indices: [], sorted: [...Array(a.length).keys()],
    message: "Array sorted. Merge Sort is complete.", phase: "Complete"
  });
  return { steps, stats: { comparisons, swaps: 0, writes, passes: 0, maxDepth } };
}

export function generateArray(size = 12): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}