import { useEffect, useState } from "react";
import LanguageSelector from "./components/LanguageSelector";
import { heapSortContent } from "./algorithms/heapSortData";
import {
  LANGUAGE_LABELS,
  useLanguagePreference
} from "./utils/languagePreferences";
import {
  generateHeapSortTrace,
  validateHeapSortInput
} from "./algorithms/heapSort";

const PRESETS = [
  {
    name: "Default (Scrambled)",
    array: "38, 27, 43, 3, 9, 82, 10"
  },
  {
    name: "Symmetric (Power of 2)",
    array: "8, 4, 5, 7, 1, 3, 6, 2"
  },
  {
    name: "Already Sorted",
    array: "10, 20, 30, 40, 50, 60"
  },
  {
    name: "Reverse Sorted",
    array: "60, 50, 40, 30, 20, 10"
  },
  {
    name: "With Duplicates",
    array: "5, 2, 5, 1, 8, 2"
  },
  {
    name: "Negative Numbers",
    array: "-4, 7, -1, 0, 9, -6"
  },
  {
    name: "Single Element",
    array: "42"
  }
];

function computeTreeLayout(array, width = 700) {
  const n = array.length;
  if (n === 0) return { nodes: [], edges: [], height: 100 };

  const maxLevel = Math.floor(Math.log2(n));
  const levelHeight = 65;
  const topPadding = 35;
  const bottomPadding = 35;
  const totalHeight = topPadding + maxLevel * levelHeight + bottomPadding;

  const nodes = [];
  const edges = [];

  for (let i = 0; i < n; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const levelStart = Math.pow(2, level) - 1;
    const countInLevel = Math.pow(2, level);
    const indexInLevel = i - levelStart;

    const x = ((indexInLevel + 0.5) / countInLevel) * width;
    const y = topPadding + level * levelHeight;

    nodes.push({ index: i, val: array[i], x, y, level });

    if (i > 0) {
      const parentIdx = Math.floor((i - 1) / 2);
      edges.push({
        from: parentIdx,
        to: i
      });
    }
  }

  return { nodes, edges, height: totalHeight };
}

function HeapSortVisualizer() {
  const [language, setLanguage] = useLanguagePreference();

  const [rawArray, setRawArray] = useState(PRESETS[0].array);
  const [numbers, setNumbers] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [trace, setTrace] = useState(() =>
    generateHeapSortTrace([38, 27, 43, 3, 9, 82, 10])
  );
  const [stepIndex, setStepIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1000);
  const [error, setError] = useState(null);

  // Autoplay effect with safe cleanup
  useEffect(() => {
    if (!isPlaying) return;

    if (stepIndex >= trace.length - 1) {
      return;
    }

    const timer = setTimeout(() => {
      setStepIndex((prev) => {
        if (prev >= trace.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playSpeed);

    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, trace.length, playSpeed]);

  function handleApply() {
    setIsPlaying(false);
    const validation = validateHeapSortInput(rawArray);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    setNumbers(validation.numbers);

    const newTrace = generateHeapSortTrace(validation.numbers);
    setTrace(newTrace);
    setStepIndex(0);
  }

  function handlePresetSelect(preset) {
    setIsPlaying(false);
    setRawArray(preset.array);
    const validation = validateHeapSortInput(preset.array);
    if (validation.valid) {
      setError(null);
      setNumbers(validation.numbers);
      const newTrace = generateHeapSortTrace(validation.numbers);
      setTrace(newTrace);
      setStepIndex(0);
    }
  }

  function handleReset() {
    setIsPlaying(false);
    setStepIndex(0);
  }

  function handlePrev() {
    setIsPlaying(false);
    setStepIndex((prev) => Math.max(0, prev - 1));
  }

  function handleNext() {
    setIsPlaying(false);
    setStepIndex((prev) => Math.min(trace.length - 1, prev + 1));
  }

  function handleReplay() {
    setStepIndex(0);
    setIsPlaying(true);
  }

  const currentStep = trace[stepIndex] || trace[0];

  // Multilingual Code Synchronization
  const currentImpl =
    heapSortContent.implementations[language] ||
    heapSortContent.implementations.java;

  const activeCodeLine = currentImpl.mapStepToLine(currentStep);

  // Dynamic bar heights
  const allValues = currentStep.array.length > 0 ? currentStep.array : numbers;
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, 10);
  const range = Math.max(1, maxVal - minVal);

  // Binary tree layout for current array snapshot
  const treeLayout = computeTreeLayout(currentStep.array, 700);

  return (
    <div className="binary-search-visualizer merge-sort-visualizer">
      {/* HEADER & PRESETS CARD */}
      <div className="bs-header-card">
        <div className="bs-title-row">
          <div>
            <h2>⛰️ Heap Sort Visualizer</h2>
            <p>
              In-place comparison sort: build a binary Max Heap in O(n) time, then repeatedly extract the root maximum in O(n log n) guaranteed time.
            </p>
          </div>

          <div className="header-status-badge">
            {currentStep.finished ? (
              <span className="status-pill success">🎉 Array Sorted</span>
            ) : (
              <span className="status-pill active">
                Heap Size: {currentStep.heapSize} / {currentStep.array.length}
              </span>
            )}
          </div>
        </div>

        {/* PRESET CHIPS */}
        <div className="preset-bar">
          <span className="preset-label">PRESETS:</span>
          <div className="preset-chips">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                className={`preset-chip ${rawArray === preset.array ? "active" : ""}`}
                onClick={() => handlePresetSelect(preset)}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INPUT CONTROLS CARD */}
      <div className="bs-input-card">
        <div className="input-group-row">
          <div className="input-field-wrap grow">
            <label htmlFor="heap-array-input">
              Array Elements (comma-separated):
            </label>
            <input
              id="heap-array-input"
              type="text"
              value={rawArray}
              onChange={(e) => setRawArray(e.target.value)}
              placeholder="e.g. 38, 27, 43, 3, 9, 82, 10"
              className={error ? "input-error" : ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleApply();
              }}
            />
          </div>

          <button
            type="button"
            className="action-btn apply-btn"
            onClick={handleApply}
          >
            Apply &amp; Sort
          </button>
        </div>

        {/* ERROR ALERT */}
        {error && (
          <div className="validation-alert">
            <div className="alert-content">
              <span className="alert-icon">⚠️</span>
              <div className="alert-message">{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* CONTROLS BAR */}
      <div className="bs-controls-card">
        <div className="stepper-stats">
          <span className="step-counter">
            Step <strong>{stepIndex + 1}</strong> of <strong>{trace.length}</strong>
          </span>
          <span className="phase-pill">
            {currentStep.phase === "initial" && "🚀 Initial Array"}
            {currentStep.phase === "empty" && "⚪ Empty Array"}
            {currentStep.phase === "build_heap_start" && "🏗️ Begin Build-Heap"}
            {currentStep.phase === "heapify_compare" && "🔍 Compare Parent & Children"}
            {currentStep.phase === "heapify_swap" && "🔄 Sift-Down Swap"}
            {currentStep.phase === "build_heap_complete" && "✅ Max Heap Ready"}
            {currentStep.phase === "extract_max" && "👑 Extract Root Maximum"}
            {currentStep.phase === "element_sorted" && "📌 Element Finalized"}
            {currentStep.phase === "heapify_down_compare" && "🔍 Sift-Down Comparison"}
            {currentStep.phase === "heapify_down_swap" && "🔄 Sift-Down Swap"}
            {currentStep.phase === "complete" && "🎉 Fully Sorted!"}
          </span>
        </div>

        <div className="stepper-buttons">
          <button
            type="button"
            className="control-btn"
            onClick={handleReset}
            disabled={stepIndex === 0}
            title="Reset to Step 1"
          >
            ⏮ Reset
          </button>

          <button
            type="button"
            className="control-btn"
            onClick={handlePrev}
            disabled={stepIndex === 0}
            title="Previous Step"
          >
            ◀ Previous
          </button>

          {stepIndex >= trace.length - 1 ? (
            <button
              type="button"
              className="control-btn play-btn"
              onClick={handleReplay}
              title="Replay from Beginning"
            >
              🔄 Replay
            </button>
          ) : (
            <button
              type="button"
              className={`control-btn play-btn ${isPlaying ? "playing" : ""}`}
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause Playback" : "Auto Play"}
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
          )}

          <button
            type="button"
            className="control-btn"
            onClick={handleNext}
            disabled={stepIndex >= trace.length - 1}
            title="Next Step"
          >
            Next ▶
          </button>
        </div>

        <div className="speed-control">
          <label htmlFor="heap-speed-select">Speed:</label>
          <select
            id="heap-speed-select"
            value={playSpeed}
            onChange={(e) => setPlaySpeed(Number(e.target.value))}
          >
            <option value={1600}>0.5x (Slow)</option>
            <option value={1000}>1.0x (Normal)</option>
            <option value={600}>1.5x (Fast)</option>
            <option value={300}>2.0x (Very Fast)</option>
          </select>
        </div>
      </div>

      {/* METRICS & HEAP STATE DASHBOARD */}
      <div className="metrics-dashboard">
        <div className="metric-box">
          <span className="metric-label">Active Heap Range</span>
          <strong className="metric-val slot-val">
            {currentStep.heapSize > 0
              ? `[0..${currentStep.heapSize - 1}] (${currentStep.heapSize} items)`
              : "None (Done)"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Parent (i)</span>
          <strong className="metric-val key-val">
            {currentStep.parentIndex !== null && currentStep.array[currentStep.parentIndex] !== undefined
              ? `[${currentStep.parentIndex}] = ${currentStep.array[currentStep.parentIndex]}`
              : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Left Child (2i + 1)</span>
          <strong className="metric-val">
            {currentStep.leftChildIndex !== null &&
            currentStep.leftChildIndex < currentStep.heapSize &&
            currentStep.array[currentStep.leftChildIndex] !== undefined
              ? `[${currentStep.leftChildIndex}] = ${currentStep.array[currentStep.leftChildIndex]}`
              : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Right Child (2i + 2)</span>
          <strong className="metric-val">
            {currentStep.rightChildIndex !== null &&
            currentStep.rightChildIndex < currentStep.heapSize &&
            currentStep.array[currentStep.rightChildIndex] !== undefined
              ? `[${currentStep.rightChildIndex}] = ${currentStep.array[currentStep.rightChildIndex]}`
              : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Comparisons</span>
          <strong className="metric-val">{currentStep.comparisonsCount}</strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Swaps</span>
          <strong className="metric-val">{currentStep.swapsCount}</strong>
        </div>
      </div>

      {/* ARRAY & BINARY HEAP VISUALIZATION DISPLAY */}
      <div className="bs-display-card">
        {/* LEGEND */}
        <div className="legend-row">
          <div className="legend-item">
            <span className="legend-badge key-pill">Parent</span>
            <span className="legend-desc">Root / Subtree Parent</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge slot-pill">Left Child</span>
            <span className="legend-desc">2 * i + 1</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge current-pill">Right Child</span>
            <span className="legend-desc">2 * i + 2</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge shift-pill">Swapping</span>
            <span className="legend-desc">Exchanging Elements</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge match-pill">Sorted</span>
            <span className="legend-desc">Finalized in Array</span>
          </div>
        </div>

        {/* PRIMARY ARRAY BAR TRACK */}
        <div className="array-track">
          {currentStep.array.length === 0 ? (
            <div className="empty-track-msg">Array is empty.</div>
          ) : (
            currentStep.array.map((val, idx) => {
              const inActiveHeap = idx < currentStep.heapSize;
              const isParent = currentStep.parentIndex !== null && idx === currentStep.parentIndex;
              const isLeft = currentStep.leftChildIndex !== null && idx === currentStep.leftChildIndex;
              const isRight = currentStep.rightChildIndex !== null && idx === currentStep.rightChildIndex;
              const isSwapping =
                currentStep.swapIndices &&
                currentStep.swapIndices.includes(idx);
              const isSorted =
                currentStep.phase === "complete" ||
                (currentStep.sortedIndices && currentStep.sortedIndices.includes(idx));

              let nodeClass = "node-unvisited";
              let tagText = null;
              let tagClass = "";

              if (isSorted) {
                nodeClass = "node-match";
                tagText = "SORTED";
                tagClass = "match-pill";
              } else if (isSwapping) {
                nodeClass = "node-shift";
                tagText = `SWAP [${idx}]`;
                tagClass = "shift-pill";
              } else if (isParent) {
                nodeClass = "node-key";
                tagText = idx === 0 ? "ROOT (P)" : `PARENT [${idx}]`;
                tagClass = "key-pill";
              } else if (isLeft && inActiveHeap) {
                nodeClass = "node-active-block";
                tagText = `LEFT [${idx}]`;
                tagClass = "slot-pill";
              } else if (isRight && inActiveHeap) {
                nodeClass = "node-active-block";
                tagText = `RIGHT [${idx}]`;
                tagClass = "current-pill";
              } else if (inActiveHeap) {
                nodeClass = "node-unvisited";
                tagText = "IN HEAP";
                tagClass = "min-pill";
              } else {
                nodeClass = "node-unvisited node-dimmed";
              }

              // Compute normalized height (min 48px, max 160px)
              const normalizedHeight =
                Math.round(((val - minVal) / range) * 90) + 55;

              return (
                <div key={idx} className="track-column">
                  <div className="pointer-slot">
                    {tagText ? (
                      <span className={`pointer-pill ${tagClass}`}>
                        {tagText}
                      </span>
                    ) : (
                      <span className="pointer-spacer">&nbsp;</span>
                    )}
                  </div>

                  <div
                    className={`array-bar-node ${nodeClass}`}
                    style={{ height: `${normalizedHeight}px` }}
                  >
                    <span className="node-val">{val}</span>
                  </div>

                  <span className="node-idx">[{idx}]</span>
                </div>
              );
            })
          )}
        </div>

        {/* DUAL VIEW: COMPLETE BINARY HEAP TREE (SVG) */}
        {currentStep.array.length > 0 && (
          <div className="heap-tree-card">
            <div className="heap-tree-header">
              <span className="heap-tree-title">
                🌳 Complete Binary Tree Representation
              </span>
              <div className="heap-tree-legend">
                <span>Active Heap: <strong>{currentStep.heapSize} nodes</strong></span>
                <span>Sorted: <strong>{currentStep.sortedIndices ? currentStep.sortedIndices.length : 0} nodes</strong></span>
              </div>
            </div>

            <svg
              className="heap-tree-svg"
              viewBox={`0 0 700 ${treeLayout.height}`}
              style={{ width: "100%", maxHeight: "320px" }}
            >
              {/* TREE EDGES */}
              {treeLayout.edges.map((edge, idx) => {
                const parentNode = treeLayout.nodes[edge.from];
                const childNode = treeLayout.nodes[edge.to];
                if (!parentNode || !childNode) return null;

                const isChildInActiveHeap = edge.to < currentStep.heapSize;
                const isSwappingEdge =
                  currentStep.swapIndices &&
                  ((edge.from === currentStep.swapIndices[0] && edge.to === currentStep.swapIndices[1]) ||
                    (edge.to === currentStep.swapIndices[0] && edge.from === currentStep.swapIndices[1]));
                const isComparingEdge =
                  edge.from === currentStep.parentIndex &&
                  (edge.to === currentStep.leftChildIndex || edge.to === currentStep.rightChildIndex);

                let strokeColor = "#475569";
                let strokeWidth = 2;
                let strokeDash = "none";

                if (isSwappingEdge) {
                  strokeColor = "#f97316";
                  strokeWidth = 3.5;
                  strokeDash = "4 3";
                } else if (isComparingEdge) {
                  strokeColor = "#38bdf8";
                  strokeWidth = 3;
                } else if (!isChildInActiveHeap) {
                  strokeColor = "#1e293b";
                  strokeWidth = 1.5;
                  strokeDash = "3 3";
                }

                return (
                  <line
                    key={`edge-${idx}`}
                    x1={parentNode.x}
                    y1={parentNode.y}
                    x2={childNode.x}
                    y2={childNode.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                  />
                );
              })}

              {/* TREE NODES */}
              {treeLayout.nodes.map((node) => {
                const inActiveHeap = node.index < currentStep.heapSize;
                const isParent = currentStep.parentIndex !== null && node.index === currentStep.parentIndex;
                const isLeft = currentStep.leftChildIndex !== null && node.index === currentStep.leftChildIndex;
                const isRight = currentStep.rightChildIndex !== null && node.index === currentStep.rightChildIndex;
                const isSwapping =
                  currentStep.swapIndices &&
                  currentStep.swapIndices.includes(node.index);
                const isSorted =
                  currentStep.phase === "complete" ||
                  (currentStep.sortedIndices && currentStep.sortedIndices.includes(node.index));

                let fillColor = "#1e293b";
                let strokeColor = "#64748b";
                let strokeWidth = 2;

                if (isSorted) {
                  fillColor = "#10b981";
                  strokeColor = "#a7f3d0";
                  strokeWidth = 2.5;
                } else if (isSwapping) {
                  fillColor = "#f97316";
                  strokeColor = "#fed7aa";
                  strokeWidth = 3;
                } else if (isParent) {
                  fillColor = "#8b5cf6";
                  strokeColor = "#c4b5fd";
                  strokeWidth = 3;
                } else if (isLeft && inActiveHeap) {
                  fillColor = "#0284c7";
                  strokeColor = "#7dd3fc";
                  strokeWidth = 2.5;
                } else if (isRight && inActiveHeap) {
                  fillColor = "#06b6d4";
                  strokeColor = "#67e8f9";
                  strokeWidth = 2.5;
                } else if (!inActiveHeap) {
                  fillColor = "#0f172a";
                  strokeColor = "#334155";
                  strokeWidth = 1.5;
                }

                return (
                  <g key={`node-${node.index}`}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={19}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                    />
                    <text
                      x={node.x}
                      y={node.y + 5}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontWeight="bold"
                      fontSize="13px"
                    >
                      {node.val}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 32}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="10px"
                    >
                      [{node.index}]
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* STEP MESSAGE */}
        <div className="step-message-box">
          <span className="msg-icon">💡</span>
          <p className="msg-text">{currentStep.message}</p>
        </div>
      </div>

      {/* CODE SYNCHRONIZATION CARD */}
      <div className="bs-code-card">
        <div className="code-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h3>💻 Executing {LANGUAGE_LABELS[language] || "Language"} Code</h3>
            <LanguageSelector
              language={language}
              onSelectLanguage={setLanguage}
              size="small"
            />
          </div>
          <span className="code-badge">Active Line {activeCodeLine}</span>
        </div>

        <pre className="bs-code-block">
          <code>
            {currentImpl.codeLines.map(({ line, text }) => (
              <div
                key={line}
                className={`code-line ${activeCodeLine === line ? "line-highlight" : ""}`}
              >
                <span className="line-num">{line}</span>
                <span className="line-content">{text}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default HeapSortVisualizer;
