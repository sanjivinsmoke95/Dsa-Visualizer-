# DSA Visualizer

An interactive React + TypeScript visualizer for learning Data Structures & Algorithms by watching each meaningful algorithm operation happen step by step.

## Current modules

### Sorting
- **Bubble Sort**
  - Adjacent comparisons
  - Swap animation/state
  - Sorted suffix tracking
  - Early-termination optimization
  - Pass, comparison, and swap statistics
  - Complexity: best O(n), average/worst O(n²), O(1) auxiliary space

- **Merge Sort**
  - Recursive split states
  - Merge comparisons
  - Array writes during merging
  - Recursion-depth tracking
  - Complexity: O(n log n), O(n) auxiliary space

## Visualizer controls

- Play / Pause
- Next step
- Reset
- Shuffle
- Array-size presets
- Editable input array
- Animation speed control
- Current-operation explanation
- Step timeline
- Comparison / swap / merge / sorted visual states

## Architecture

The visualizer follows:

```
User action
   ↓
Algorithm step engine
   ↓
Typed visualization state
   ↓
React visualizer
   ↓
Rendered algorithm state
```

Algorithm logic is kept separate from presentation logic. Each sorting engine emits typed `SortStep` events containing the array snapshot, operation type, affected indices, sorted positions, and human-readable explanation.

## Tech stack

- React
- TypeScript
- Vite
- React Router dependency for the reusable UI foundation
- CSS custom properties / responsive CSS
- Manrope + IBM Plex Mono

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Repository

https://github.com/sanjivinsmoke95/Dsa-Visualizer-
