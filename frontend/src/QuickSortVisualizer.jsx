import { useEffect, useState } from "react";
import LanguageSelector from "./components/LanguageSelector";
import { quickSortContent } from "./algorithms/quickSortData";
import {
  LANGUAGE_LABELS,
  useLanguagePreference
} from "./utils/languagePreferences";
import {
  generateQuickSortTrace,
  validateQuickSortInput
} from "./algorithms/quickSort";

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
    name: "Already Sorted (Worst Case O(n²))",
    array: "10, 20, 30, 40, 50, 60"
  },
  {
    name: "Reverse Sorted (Worst Case O(n²))",
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

function QuickSortVisualizer() {
  const [language, setLanguage] = useLanguagePreference();

  const [rawArray, setRawArray] = useState(PRESETS[0].array);
  const [numbers, setNumbers] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [trace, setTrace] = useState(() =>
    generateQuickSortTrace([38, 27, 43, 3, 9, 82, 10])
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
    const validation = validateQuickSortInput(rawArray);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    setNumbers(validation.numbers);

    const newTrace = generateQuickSortTrace(validation.numbers);
    setTrace(newTrace);
    setStepIndex(0);
  }

  function handlePresetSelect(preset) {
    setIsPlaying(false);
    setRawArray(preset.array);
    const validation = validateQuickSortInput(preset.array);
    if (validation.valid) {
      setError(null);
      setNumbers(validation.numbers);
      const newTrace = generateQuickSortTrace(validation.numbers);
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
    quickSortContent.implementations[language] ||
    quickSortContent.implementations.java;

  const activeCodeLine = currentImpl.mapStepToLine(currentStep);

  // Dynamic bar heights
  const allValues = currentStep.array.length > 0 ? currentStep.array : numbers;
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, 10);
  const range = Math.max(1, maxVal - minVal);

  const isPartitioning = [
    "pivot_selected",
    "compare",
    "swap",
    "pivot_placed",
    "partition_complete"
  ].includes(currentStep.phase);

  return (
    <div className="binary-search-visualizer merge-sort-visualizer">
      {/* HEADER & PRESETS CARD */}
      <div className="bs-header-card">
        <div className="bs-title-row">
          <div>
            <h2>⚡ Quick Sort Visualizer</h2>
            <p>
              Divide and conquer: partition elements around a pivot using the Lomuto partition scheme in O(n log n) average time.
            </p>
          </div>

          <div className="header-status-badge">
            {currentStep.finished ? (
              <span className="status-pill success">🎉 Array Sorted</span>
            ) : (
              <span className="status-pill active">
                Partition [{currentStep.left}..{currentStep.right}] (Depth {currentStep.depth})
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
            <label htmlFor="quick-array-input">
              Array Elements (comma-separated):
            </label>
            <input
              id="quick-array-input"
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
            {currentStep.phase === "initial" && "🚀 Initial State"}
            {currentStep.phase === "empty" && "⚪ Empty Array"}
            {currentStep.phase === "pivot_selected" && "🎯 Pivot Selected"}
            {currentStep.phase === "compare" && "🔍 Compare with Pivot"}
            {currentStep.phase === "swap" && "🔄 Swap Elements"}
            {currentStep.phase === "pivot_placed" && "📍 Place Pivot"}
            {currentStep.phase === "partition_complete" && "✅ Partition Complete"}
            {currentStep.phase === "recursion" && "🌿 Recursive Calls"}
            {currentStep.phase === "base_case" && "🍃 Base Case (n ≤ 1)"}
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
          <label htmlFor="quick-speed-select">Speed:</label>
          <select
            id="quick-speed-select"
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

      {/* METRICS & PARTITION STATE DASHBOARD */}
      <div className="metrics-dashboard">
        <div className="metric-box">
          <span className="metric-label">Active Subarray</span>
          <strong className="metric-val slot-val">
            [{currentStep.left}..{currentStep.right}]
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Current Pivot</span>
          <strong className="metric-val key-val">
            {currentStep.pivotIndex !== null && currentStep.array[currentStep.pivotIndex] !== undefined
              ? `[${currentStep.pivotIndex}] = ${currentStep.array[currentStep.pivotIndex]}`
              : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Boundary (i)</span>
          <strong className="metric-val">
            {currentStep.boundaryIndex !== null ? `i = ${currentStep.boundaryIndex}` : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Scan Pointer (j)</span>
          <strong className="metric-val">
            {currentStep.scanIndex !== null ? `j = ${currentStep.scanIndex}` : "--"}
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

      {/* ARRAY VISUALIZATION DISPLAY */}
      <div className="bs-display-card">
        {/* LEGEND */}
        <div className="legend-row">
          <div className="legend-item">
            <span className="legend-badge key-pill">Pivot</span>
            <span className="legend-desc">numbers[high]</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge slot-pill">Boundary (i)</span>
            <span className="legend-desc">Last element &le; pivot</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge current-pill">Scanner (j)</span>
            <span className="legend-desc">Current scan pointer</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge shift-pill">Swapping</span>
            <span className="legend-desc">Exchanging elements</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge match-pill">Sorted / Placed</span>
            <span className="legend-desc">Finalized position</span>
          </div>
        </div>

        {/* LOMUTO PARTITION OVERVIEW PANEL */}
        {isPartitioning && currentStep.pivotIndex !== null && (
          <div className="merge-buffer-panel">
            <div className="sub-buffer-box">
              <span className="sub-buffer-title">
                &le; Pivot [{currentStep.left}..{currentStep.boundaryIndex !== null && currentStep.boundaryIndex >= currentStep.left ? currentStep.boundaryIndex : "none"}]
              </span>
              <div className="sub-buffer-chips">
                {currentStep.boundaryIndex !== null && currentStep.boundaryIndex >= currentStep.left ? (
                  currentStep.array
                    .slice(currentStep.left, currentStep.boundaryIndex + 1)
                    .map((val, idx) => (
                      <span key={idx} className="sub-chip left">
                        {val}
                      </span>
                    ))
                ) : (
                  <span style={{ fontSize: "11px", color: "#64748b" }}>(empty)</span>
                )}
              </div>
            </div>

            <div className="sub-buffer-box" style={{ borderColor: "#f59e0b" }}>
              <span className="sub-buffer-title" style={{ color: "#f59e0b" }}>
                🎯 Pivot [{currentStep.pivotIndex}]
              </span>
              <div className="sub-buffer-chips">
                <span className="sub-chip" style={{ background: "#fef3c7", color: "#b45309", borderColor: "#f59e0b" }}>
                  {currentStep.array[currentStep.pivotIndex]}
                </span>
              </div>
            </div>

            <div className="sub-buffer-box">
              <span className="sub-buffer-title">
                &gt; Pivot [{currentStep.boundaryIndex !== null ? currentStep.boundaryIndex + 1 : currentStep.left}..{currentStep.scanIndex !== null ? currentStep.scanIndex - 1 : currentStep.left - 1}]
              </span>
              <div className="sub-buffer-chips">
                {currentStep.scanIndex !== null && currentStep.scanIndex > (currentStep.boundaryIndex !== null ? currentStep.boundaryIndex + 1 : currentStep.left) ? (
                  currentStep.array
                    .slice(
                      currentStep.boundaryIndex !== null ? currentStep.boundaryIndex + 1 : currentStep.left,
                      currentStep.scanIndex
                    )
                    .map((val, idx) => (
                      <span key={idx} className="sub-chip right">
                        {val}
                      </span>
                    ))
                ) : (
                  <span style={{ fontSize: "11px", color: "#64748b" }}>(empty)</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PRIMARY ARRAY TRACK */}
        <div className="array-track">
          {currentStep.array.length === 0 ? (
            <div className="empty-track-msg">Array is empty.</div>
          ) : (
            currentStep.array.map((val, idx) => {
              const inActiveRange = idx >= currentStep.left && idx <= currentStep.right;
              const isPivot = currentStep.pivotIndex !== null && idx === currentStep.pivotIndex;
              const isScan = currentStep.scanIndex !== null && idx === currentStep.scanIndex;
              const isBoundary = currentStep.boundaryIndex !== null && idx === currentStep.boundaryIndex;
              const isFinalComplete = currentStep.phase === "complete";
              const isPivotPlaced = (currentStep.phase === "pivot_placed" || currentStep.phase === "partition_complete") && isPivot;
              const isSwapping = currentStep.phase === "swap" && (idx === currentStep.boundaryIndex || idx === currentStep.scanIndex);

              let nodeClass = "node-unvisited";
              let tagText = null;
              let tagClass = "";

              if (isFinalComplete) {
                nodeClass = "node-match";
                tagText = "SORTED";
                tagClass = "match-pill";
              } else if (isSwapping) {
                nodeClass = "node-shift";
                tagText = `SWAP [${idx}]`;
                tagClass = "shift-pill";
              } else if (isPivotPlaced) {
                nodeClass = "node-match";
                tagText = "PIVOT FIXED";
                tagClass = "match-pill";
              } else if (isPivot) {
                nodeClass = "node-key";
                tagText = "PIVOT";
                tagClass = "key-pill";
              } else if (isScan) {
                nodeClass = "node-active-block";
                tagText = `SCAN (j=${idx})`;
                tagClass = "current-pill";
              } else if (isBoundary && inActiveRange) {
                nodeClass = "node-active-block";
                tagText = `i=${idx}`;
                tagClass = "slot-pill";
              } else if (inActiveRange) {
                if (currentStep.boundaryIndex !== null && idx <= currentStep.boundaryIndex) {
                  nodeClass = "node-active-block";
                  tagText = "≤ PIVOT";
                  tagClass = "slot-pill";
                } else if (
                  currentStep.scanIndex !== null &&
                  currentStep.boundaryIndex !== null &&
                  idx > currentStep.boundaryIndex &&
                  idx < currentStep.scanIndex
                ) {
                  nodeClass = "node-unvisited";
                  tagText = "> PIVOT";
                  tagClass = "min-pill";
                } else {
                  nodeClass = "node-active-block";
                  tagText = "ACTIVE";
                  tagClass = "slot-pill";
                }
              } else {
                // Dim elements outside the active subarray
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

export default QuickSortVisualizer;
