# DSA Visualizer

A React + TypeScript UI foundation for a Data Structures & Algorithms visualizer. The current repository contains the reusable visual UI system and design tokens; the algorithm visualizer logic can be built on top of these components.

## Tech Stack

| Technology | Role |
|---|---|
| **React** | Component-based UI architecture |
| **TypeScript** | Type-safe component and application code |
| **React Router** | Client-side navigation for React applications |
| **Tailwind CSS v4** | Utility-first styling and responsive layouts |
| **CSS custom properties / Tailwind @theme** | Centralized design tokens such as colors and typography |
| **SVG** | Lightweight data visualization primitives, including the donut chart |
| **Manrope** | Primary interface font |
| **IBM Plex Mono** | Technical/data-oriented text |
| **Source Serif 4** | Reading/document-style text |

> **Current scope:** this repository is currently a UI foundation, not yet a complete DSA visualizer application. The repository does not currently contain the algorithm implementations, visualization state machine, or a package manifest. The stack above describes the technologies used by the checked-in UI code.

## How the UI works

The UI is organized around reusable React components rather than styling every screen independently.

### 1. Design tokens

`frontend/src/index.css` defines the visual system through Tailwind v4's `@theme`:

- Warm cream application canvas
- Near-white surfaces
- Soft borders and panels
- Deep green primary color
- Saffron accent
- Semantic success/warning/danger colors
- Three typography roles

This means components can use semantic utilities such as `bg-surface`, `text-ink`, `bg-primary`, and `border-line` instead of hard-coding colors throughout the application.

### 2. Reusable component layer

`frontend/src/components/ui.tsx` contains the reusable UI primitives:

- **Card** — common content container
- **Button / LinkButton** — consistent actions and navigation
- **StatusChip / StatusBanner** — semantic status communication
- **Meter / MatchBar** — progress and percentage visualization
- **Stat / StatTile** — KPI-style metrics
- **ActionItem** — action-required rows
- **EmptyState / Skeleton** — empty and loading states
- **Tooltip** — contextual help
- **SeverityPill** — critical/high/medium/low indicators
- **FilterChip** — interactive filtering controls
- **SectionAccordion** — collapsible detail
- **DetailDrawer** — right-side detail panel with Escape-key handling
- **Donut** — SVG-based ring chart
- **Tabs** — in-panel navigation

A future visualizer screen can compose these components with algorithm-specific components such as arrays, linked lists, trees, graphs, heaps, sorting timelines, and step controls.

## How a DSA visualizer would use this foundation

The intended architecture is:

**User action → algorithm state → visualization state → React render**

For example, a sorting visualizer could work like this:

1. User selects an algorithm such as Bubble Sort or Quick Sort.
2. The application generates or accepts an input array.
3. The algorithm produces a sequence of meaningful steps such as compare, swap, partition, or sorted.
4. React stores the current step and input state.
5. Visualization components render the array using the current state.
6. Controls such as Play, Pause, Next, Previous, and Reset update the visualization state.
7. The reusable UI components provide the surrounding controls, metrics, status indicators, and panels.

A clean implementation should keep **algorithm logic separate from presentation logic**. The algorithm should describe what happened; the visualizer decides how that event is rendered.

### Example conceptual flow

```text
Input Array
    ↓
Algorithm
    ↓
Step/Event Sequence
    ↓
Visualizer State
    ↓
React Components
    ↓
Animated UI
```

## Suggested project structure

```text
src/
├── components/
│   ├── ui/                 # reusable UI primitives
│   ├── visualizers/        # array/tree/graph/etc. visualizers
│   └── controls/           # play, pause, step, reset
├── algorithms/
│   ├── sorting/
│   ├── searching/
│   ├── trees/
│   ├── graphs/
│   └── data-structures/
├── hooks/
│   └── useVisualizer.ts
├── types/
│   └── visualization.ts
├── pages/
└── main.tsx
```

## Why TypeScript + React?

**TypeScript** makes algorithm-step data and component props explicit. This is useful for a visualizer because an event can contain operation type, affected indices, values, current step, comparison state, swap state, or traversal state.

**React** is useful because every algorithm step can become application state, and the UI can declaratively render the current state.

## Current design direction

- warm cream background
- deep green primary actions
- restrained saffron accents
- rounded surfaces
- subtle shadows
- semantic status colors
- technical identifiers in monospace
- responsive utility classes
- keyboard-focus styling
- reduced-motion support

## Repository

https://github.com/sanjivinsmoke95/Dsa-Visualizer-