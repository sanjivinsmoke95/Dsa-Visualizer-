import { useState } from "react";
import SortingVisualizer from "./components/SortingVisualizer";
import type { SortAlgorithm } from "./types/visualization";

export default function App() {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>("bubble");
  return <SortingVisualizer algorithm={algorithm} onAlgorithmChange={setAlgorithm} />;
}