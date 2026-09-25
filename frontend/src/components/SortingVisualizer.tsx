import { useEffect, useMemo, useState } from "react";
import { bubbleSortSteps, generateArray, mergeSortSteps } from "../algorithms/sorting";
import type { SortAlgorithm, SortStep } from "../types/visualization";

const DEFAULT = [38, 72, 21, 56, 14, 83, 45, 29, 67, 11, 51, 34];

const descriptions: Record<SortAlgorithm, { title: string; summary: string; complexity: string; space: string }> = {
  bubble: {
    title: "Bubble Sort",
    summary: "Compare adjacent values and swap them when they are out of order. After every pass, the largest remaining value settles at the right.",
    complexity: "Best O(n) · Average/Worst O(n²)",
    space: "O(1) auxiliary space",
  },
  merge: {
    title: "Merge Sort",
    summary: "Recursively split the array into halves, sort each half, then merge the sorted halves by repeatedly taking the smaller front value.",
    complexity: "O(n log n) in every case",
    space: "O(n) auxiliary space",
  },
};

function stepLabel(step: SortStep) {
  const labels: Record<SortStep["kind"], string> = {
    start: "Start",
    compare: "Compare",
    swap: "Swap",
    "mark-sorted": "Sorted",
    split: "Split",
    "merge-compare": "Compare",
    "merge-write": "Write",
    complete: "Complete",
  };
  return labels[step.kind];
}

export default function SortingVisualizer({ algorithm, onAlgorithmChange }: { algorithm: SortAlgorithm; onAlgorithmChange: (algorithm: SortAlgorithm) => void }) {
  const [input, setInput] = useState(DEFAULT);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(520);

  const result = useMemo(
    () => algorithm === "bubble" ? bubbleSortSteps(input) : mergeSortSteps(input),
    [algorithm, input],
  );
  const step = result.steps[stepIndex] ?? result.steps[result.steps.length - 1];
  const info = descriptions[algorithm];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [algorithm, input]);

  useEffect(() => {
    if (!playing) return;
    if (stepIndex >= result.steps.length - 1) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(() => setStepIndex((s) => s + 1), speed);
    return () => window.clearTimeout(id);
  }, [playing, stepIndex, result.steps.length, speed]);

  const reset = () => { setPlaying(false); setStepIndex(0); };
  const shuffle = () => { setPlaying(false); setInput(generateArray(input.length)); };
  const setSize = (size: number) => { setPlaying(false); setInput(generateArray(size)); };

  const active = new Set(step.indices);
  const sorted = new Set(step.sorted);
  const max = Math.max(...step.array, 1);
  const progress = Math.round((stepIndex / Math.max(result.steps.length - 1, 1)) * 100);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container" style={{padding:"13px 0",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
          <div>
            <div style={{fontWeight:800,letterSpacing:"-.03em"}}>DSA Visualizer</div>
            <div style={{fontSize:11,color:"#6a746e"}}>Algorithms · step by step</div>
          </div>
          <span className="pill">SORTING LAB</span>
        </div>
      </header>

      <main className="container" style={{padding:"28px 0 48px"}}>
        <section className="hero-grid">
          <div className="card card-pad">
            <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"flex-start"}}>
              <div>
                <div className="mono" style={{fontSize:11,color:"#0b5d3b",fontWeight:700}}>INTERACTIVE ALGORITHM</div>
                <h1 style={{fontSize:"clamp(28px,4vw,42px)",lineHeight:1.05,margin:"8px 0 10px",letterSpacing:"-.045em"}}>{info.title}</h1>
                <p style={{maxWidth:720,color:"#65716a",lineHeight:1.7,margin:0,fontSize:14}}>{info.summary}</p>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:18,flexWrap:"wrap"}}>
              <button className={`btn ${algorithm === "bubble" ? "btn-primary" : "btn-secondary"}`} onClick={() => onAlgorithmChange("bubble")} aria-pressed={algorithm === "bubble"}>Bubble Sort</button>
              <button className={`btn ${algorithm === "merge" ? "btn-primary" : "btn-secondary"}`} onClick={() => onAlgorithmChange("merge")} aria-pressed={algorithm === "merge"}>Merge Sort</button>
              <span className="pill">{info.complexity}</span>
            </div>
          </div>
          <div className="card card-pad">
            <div className="mono" style={{fontSize:11,color:"#6a746e",fontWeight:700}}>HOW TO READ IT</div>
            <div style={{marginTop:14,display:"grid",gap:12,fontSize:13,color:"#4f5b54",lineHeight:1.55}}>
              <div><b style={{color:"#d97706"}}>Orange</b> = values currently compared.</div>
              <div><b style={{color:"#dc2626"}}>Red</b> = values being swapped.</div>
              <div><b style={{color:"#2563eb"}}>Blue</b> = active merge/write region.</div>
              <div><b style={{color:"#15803d"}}>Green</b> = positions already fixed.</div>
            </div>
          </div>
        </section>

        <section className="card card-pad" style={{marginTop:18}}>
          <div className="control-grid">
            <input
              className="input mono"
              value={input.join(", ")}
              aria-label="Array values"
              onChange={(e) => {
                const values = e.target.value.split(",").map(v => Number(v.trim())).filter(v => Number.isFinite(v));
                if (values.length > 0 && values.length <= 24) setInput(values);
              }}
              onBlur={() => setInput(input.slice(0, 24))}
            />
            <button className="btn btn-secondary" onClick={shuffle}>Shuffle</button>
            <button className="btn btn-secondary" onClick={reset}>Reset</button>
            <button className="btn btn-ghost" onClick={() => setPlaying(v => !v)} disabled={stepIndex >= result.steps.length - 1}>
              {playing ? "Pause" : "Play"}
            </button>
            <button className="btn btn-primary" onClick={() => setStepIndex(s => Math.min(s + 1, result.steps.length - 1))} disabled={stepIndex >= result.steps.length - 1}>Next step</button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12,marginTop:12,flexWrap:"wrap"}}>
            <span style={{fontSize:11,color:"#6a746e"}}>Array size</span>
            {[8,12,16,20].map(n => <button key={n} className="btn btn-secondary" style={{padding:"5px 9px"}} onClick={() => setSize(n)}>{n}</button>)}
            <label style={{marginLeft:"auto",fontSize:11,color:"#6a746e",display:"flex",alignItems:"center",gap:7}}>
              Speed
              <input type="range" min="100" max="1000" step="50" value={1100-speed} onChange={e => setSpeed(1100-Number(e.target.value))} />
            </label>
          </div>
        </section>

        <section className="card visual-card" style={{marginTop:18}}>
          <div style={{padding:"18px 20px 0",display:"flex",justifyContent:"space-between",gap:12,alignItems:"center"}}>
            <div>
              <div className="mono" style={{fontSize:10,color:"#6a746e"}}>VISUALIZATION STATE</div>
              <div style={{fontWeight:800,marginTop:3}}>{stepLabel(step)} <span style={{fontWeight:500,color:"#6a746e"}}>· {step.phase}</span></div>
            </div>
            <div className="mono" style={{fontSize:11,color:"#6a746e"}}>{progress}%</div>
          </div>
          <div className="bars" aria-label={`${info.title} visualization`}>
            {step.array.map((value, i) => {
              const cls = step.kind === "swap" && active.has(i) ? "swap"
                : step.kind === "merge-write" && active.has(i) ? "merge"
                : active.has(i) ? "compare"
                : sorted.has(i) ? "sorted" : "";
              return (
                <div className="bar-wrap" key={i}>
                  <div className={`bar ${cls}`} style={{height:`${Math.max(5,(value/max)*250)}px`}} title={`index ${i}, value ${value}`} />
                  <div className="value-label">{value}</div>
                  <div className="mono" style={{fontSize:9,color:"#9aa19d"}}>{i}</div>
                </div>
              );
            })}
          </div>
          <div style={{height:4,margin:"0 20px 18px",background:"#eeeae1",borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${progress}%`,background:"#0b5d3b",transition:"width .18s ease"}} />
          </div>
        </section>

        <section className="stat-grid" style={{marginTop:18}}>
          <div className="stat"><div className="stat-value">{stepIndex + 1}</div><div className="stat-label">Current step / {result.steps.length}</div></div>
          <div className="stat"><div className="stat-value">{result.stats.comparisons}</div><div className="stat-label">Total comparisons</div></div>
          <div className="stat"><div className="stat-value">{algorithm === "bubble" ? result.stats.swaps : result.stats.writes}</div><div className="stat-label">{algorithm === "bubble" ? "Swaps" : "Array writes"}</div></div>
          <div className="stat"><div className="stat-value">{algorithm === "bubble" ? result.stats.passes : result.stats.maxDepth}</div><div className="stat-label">{algorithm === "bubble" ? "Passes" : "Max recursion depth"}</div></div>
        </section>

        <section className="two-col" style={{marginTop:18}}>
          <div className="card card-pad">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
              <div><div className="mono" style={{fontSize:10,color:"#6a746e"}}>CURRENT OPERATION</div><h2 style={{fontSize:18,margin:"5px 0 0"}}>{step.message}</h2></div>
              <span className="pill">{stepLabel(step)}</span>
            </div>
            <div className="legend" style={{marginTop:16}}>
              <span><i className="dot" style={{background:"#d97706"}} />Compare</span>
              <span><i className="dot" style={{background:"#dc2626"}} />Swap</span>
              <span><i className="dot" style={{background:"#2563eb"}} />Merge</span>
              <span><i className="dot" style={{background:"#15803d"}} />Sorted</span>
            </div>
            <div style={{marginTop:20,fontSize:13,color:"#65716a",lineHeight:1.7}}>
              <b style={{color:"#18211d"}}>Complexity:</b> {info.complexity}. <b style={{color:"#18211d"}}>Space:</b> {info.space}.
            </div>
          </div>

          <div className="card card-pad">
            <div className="mono" style={{fontSize:10,color:"#6a746e"}}>STEP TIMELINE</div>
            <div className="timeline" style={{marginTop:10}}>
              {result.steps.slice(Math.max(0, stepIndex - 5), Math.min(result.steps.length, stepIndex + 5)).map((s, offset) => {
                const actual = Math.max(0, stepIndex - 5) + offset;
                return <div className="timeline-row" key={actual}>
                  <span className={`step-no ${actual === stepIndex ? "current" : ""}`}>{actual + 1}</span>
                  <div><div style={{fontWeight:700,color:"#334039"}}>{stepLabel(s)}</div><div style={{color:"#7a847e",marginTop:2}}>{s.message}</div></div>
                </div>;
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
