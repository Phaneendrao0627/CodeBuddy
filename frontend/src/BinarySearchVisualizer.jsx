import { useEffect, useState } from "react";
import {
  generateBinarySearchTrace,
  sortArrayAscending,
  validateBinarySearchInput
} from "./algorithms/binarySearch";

const PRESETS = [
  {
    name: "Default (Found)",
    array: "2, 5, 8, 12, 16, 23, 38, 56, 72, 91",
    target: "23"
  },
  {
    name: "Target Missing",
    array: "1, 3, 5, 7, 9, 11",
    target: "6"
  },
  {
    name: "First Element",
    array: "10, 20, 30, 40, 50",
    target: "10"
  },
  {
    name: "Last Element",
    array: "10, 20, 30, 40, 50",
    target: "50"
  },
  {
    name: "Single Element",
    array: "42",
    target: "42"
  }
];

const JAVA_CODE_LINES = [
  { line: 1, text: "int low = 0, high = numbers.length - 1;" },
  { line: 2, text: "while (low <= high) {" },
  { line: 3, text: "    int mid = low + (high - low) / 2;" },
  { line: 4, text: "    if (numbers[mid] == target)" },
  { line: 5, text: "        return mid; // Found!" },
  { line: 6, text: "    else if (numbers[mid] < target)" },
  { line: 7, text: "        low = mid + 1; // Search right half" },
  { line: 8, text: "    else" },
  { line: 9, text: "        high = mid - 1; // Search left half" },
  { line: 10, text: "}" },
  { line: 11, text: "return -1; // Not found" }
];

function mapTraceToCodeLine(step) {
  if (!step) return null;
  if (step.phase === "initial") return 1;
  if (step.phase === "found") return 5;
  if (step.phase === "not_found") return 11;
  if (step.phase === "comparing") {
    if (step.comparedValue < step.target) {
      return 7; // low = mid + 1
    }
    return 9; // high = mid - 1
  }
  return 3;
}

function BinarySearchVisualizer() {
  const [rawArray, setRawArray] = useState(PRESETS[0].array);
  const [rawTarget, setRawTarget] = useState(PRESETS[0].target);

  const [numbers, setNumbers] = useState([2, 5, 8, 12, 16, 23, 38, 56, 72, 91]);
  const [target, setTarget] = useState(23);
  const [trace, setTrace] = useState(() =>
    generateBinarySearchTrace([2, 5, 8, 12, 16, 23, 38, 56, 72, 91], 23)
  );
  const [stepIndex, setStepIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1100);

  const [error, setError] = useState(null);
  const [isUnsorted, setIsUnsorted] = useState(false);
  const [pendingNumbers, setPendingNumbers] = useState(null);

  // Autoplay effect
  useEffect(() => {
    if (!isPlaying) return;

    if (stepIndex >= trace.length - 1) {
      return;
    }

    const timer = setTimeout(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= trace.length - 1) {
          setIsPlaying(false);
          return trace.length - 1;
        }
        return next;
      });
    }, playSpeed);

    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, trace.length, playSpeed]);

  function handleLoadInput(e) {
    if (e) e.preventDefault();
    setIsPlaying(false);

    const validation = validateBinarySearchInput(rawArray, rawTarget);

    if (!validation.valid) {
      setError(validation.error);
      setIsUnsorted(Boolean(validation.isUnsorted));
      setPendingNumbers(validation.numbers || null);
      return;
    }

    setError(null);
    setIsUnsorted(false);
    setPendingNumbers(null);
    setNumbers(validation.numbers);
    setTarget(validation.target);

    const newTrace = generateBinarySearchTrace(validation.numbers, validation.target);
    setTrace(newTrace);
    setStepIndex(0);
  }

  function handleSortAndApply() {
    if (!pendingNumbers) return;
    const sorted = sortArrayAscending(pendingNumbers);
    const sortedString = sorted.join(", ");
    setRawArray(sortedString);
    setIsUnsorted(false);
    setError(null);

    const validation = validateBinarySearchInput(sorted, rawTarget);
    if (validation.valid) {
      setNumbers(validation.numbers);
      setTarget(validation.target);
      const newTrace = generateBinarySearchTrace(validation.numbers, validation.target);
      setTrace(newTrace);
      setStepIndex(0);
    }
  }

  function handleSelectPreset(preset) {
    setIsPlaying(false);
    setRawArray(preset.array);
    setRawTarget(preset.target);
    setError(null);
    setIsUnsorted(false);
    setPendingNumbers(null);

    const validation = validateBinarySearchInput(preset.array, preset.target);
    if (validation.valid) {
      setNumbers(validation.numbers);
      setTarget(validation.target);
      const newTrace = generateBinarySearchTrace(validation.numbers, validation.target);
      setTrace(newTrace);
      setStepIndex(0);
    }
  }

  const currentStep = trace[stepIndex] || trace[0] || {};
  const activeCodeLine = mapTraceToCodeLine(currentStep);

  function getPointersForIndex(index) {
    const isLow = currentStep.low === index;
    const isMid = currentStep.mid === index;
    const isHigh = currentStep.high === index;

    if (isLow && isMid && isHigh) return "L, M, H";
    if (isLow && isMid) return "Low, Mid";
    if (isMid && isHigh) return "Mid, High";
    if (isLow && isHigh) return "Low, High";
    if (isMid) return "Mid";
    if (isLow) return "Low";
    if (isHigh) return "High";
    return null;
  }

  return (
    <div className="binary-search-visualizer">
      {/* HEADER */}
      <div className="bs-header-card">
        <div className="bs-title-area">
          <h2>🔍 Binary Search Interactive Visualizer</h2>
          <p>
            Experience step-by-step interval halving on sorted data with dynamic custom inputs.
          </p>
        </div>

        {/* PRESET PILLS */}
        <div className="bs-presets">
          <span className="presets-label">Presets:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className={`preset-pill ${
                rawArray === preset.array && rawTarget === preset.target ? "active" : ""
              }`}
              onClick={() => handleSelectPreset(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* INPUT CONTROLS */}
      <form className="bs-input-card" onSubmit={handleLoadInput}>
        <div className="bs-inputs-row">
          <div className="input-group array-input-group">
            <label htmlFor="bs-array-input">
              Sorted Array <span className="label-hint">(comma-separated numbers)</span>
            </label>
            <input
              id="bs-array-input"
              type="text"
              value={rawArray}
              onChange={(e) => setRawArray(e.target.value)}
              placeholder="e.g. 2, 5, 8, 12, 16, 23, 38, 56"
            />
          </div>

          <div className="input-group target-input-group">
            <label htmlFor="bs-target-input">Target Value</label>
            <input
              id="bs-target-input"
              type="number"
              value={rawTarget}
              onChange={(e) => setRawTarget(e.target.value)}
              placeholder="e.g. 23"
            />
          </div>

          <button type="submit" className="bs-submit-button">
            Apply &amp; Visualize
          </button>
        </div>

        {/* ERROR / UNSORTED ALERT */}
        {error && (
          <div className="bs-error-banner">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <strong>Input Validation Error</strong>
              <p>{error}</p>
              {isUnsorted && (
                <button
                  type="button"
                  className="bs-fix-sort-button"
                  onClick={handleSortAndApply}
                >
                  Click to Sort Ascending
                </button>
              )}
            </div>
          </div>
        )}
      </form>

      {/* STEP PROGRESS & CONTROLS */}
      <div className="bs-controls-card">
        <div className="bs-status-row">
          <div className="step-counter-badge">
            Step <strong>{stepIndex + 1}</strong> of <strong>{trace.length}</strong>
          </div>

          <div className={`phase-badge phase-${currentStep.phase || "initial"}`}>
            {currentStep.phase === "found" && "🎉 Target Found"}
            {currentStep.phase === "not_found" && "❌ Target Not Found"}
            {currentStep.phase === "comparing" && "🔍 Comparing Mid"}
            {currentStep.phase === "initial" && "🚀 Initial Range"}
          </div>

          <div className="speed-control">
            <label htmlFor="speed-select">Speed:</label>
            <select
              id="speed-select"
              value={playSpeed}
              onChange={(e) => setPlaySpeed(Number(e.target.value))}
            >
              <option value={1500}>0.7x (Slow)</option>
              <option value={1100}>1.0x (Normal)</option>
              <option value={600}>1.8x (Fast)</option>
            </select>
          </div>
        </div>

        <div className="bs-buttons-row">
          <button
            type="button"
            className="control-btn"
            onClick={() => {
              setIsPlaying(false);
              setStepIndex(0);
            }}
            disabled={stepIndex === 0}
            title="Jump to Start"
          >
            ⏮ Reset
          </button>

          <button
            type="button"
            className="control-btn"
            onClick={() => {
              setIsPlaying(false);
              setStepIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={stepIndex === 0}
            title="Previous Step"
          >
            ◀ Previous
          </button>

          <button
            type="button"
            className={`control-btn play-btn ${isPlaying ? "playing" : ""}`}
            onClick={() => {
              if (stepIndex >= trace.length - 1) {
                setStepIndex(0);
                setIsPlaying(true);
              } else {
                setIsPlaying((prev) => !prev);
              }
            }}
          >
            {isPlaying ? "⏸ Pause" : stepIndex >= trace.length - 1 ? "↺ Replay" : "▶ Play"}
          </button>

          <button
            type="button"
            className="control-btn"
            onClick={() => {
              setIsPlaying(false);
              setStepIndex((prev) => Math.min(trace.length - 1, prev + 1));
            }}
            disabled={stepIndex >= trace.length - 1}
            title="Next Step"
          >
            Next ▶
          </button>
        </div>
      </div>

      {/* ARRAY DISPLAY */}
      <div className="bs-display-card">
        <div className="bs-legend">
          <div className="legend-item">
            <span className="legend-indicator pointer-low">Low</span>
            <span>Left Boundary (low)</span>
          </div>
          <div className="legend-item">
            <span className="legend-indicator pointer-mid">Mid</span>
            <span>Current Pivot (mid)</span>
          </div>
          <div className="legend-item">
            <span className="legend-indicator pointer-high">High</span>
            <span>Right Boundary (high)</span>
          </div>
          <div className="legend-item">
            <span className="legend-box eliminated-sample" />
            <span>Eliminated Search Space</span>
          </div>
        </div>

        <div className="bs-array-scroll-container">
          <div className="bs-array-track">
            {numbers.map((val, idx) => {
              const pointers = getPointersForIndex(idx);
              const isMid = currentStep.mid === idx;
              const isFound = currentStep.found && currentStep.foundIndex === idx;
              const isEliminated =
                currentStep.eliminatedIndices &&
                currentStep.eliminatedIndices.includes(idx);
              const isInRange =
                currentStep.activeRange &&
                idx >= currentStep.activeRange[0] &&
                idx <= currentStep.activeRange[1];

              let itemClass = "bs-array-node";
              if (isFound) itemClass += " node-found";
              else if (isMid) itemClass += " node-mid";
              else if (isEliminated) itemClass += " node-eliminated";
              else if (isInRange) itemClass += " node-active";

              return (
                <div key={idx} className={itemClass}>
                  {/* POINTER LABEL */}
                  <div className="node-pointer-slot">
                    {pointers ? (
                      <span
                        className={`pointer-badge ${
                          isFound
                            ? "badge-found"
                            : isMid
                            ? "badge-mid"
                            : pointers.includes("Low")
                            ? "badge-low"
                            : "badge-high"
                        }`}
                      >
                        {pointers}
                      </span>
                    ) : (
                      <span className="pointer-spacer">&nbsp;</span>
                    )}
                  </div>

                  {/* VALUE CELL */}
                  <div className="node-cell">
                    <span className="cell-value">{val}</span>
                  </div>

                  {/* INDEX */}
                  <span className="node-index">[{idx}]</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP EXPLANATION & CODE SPLIT */}
      <div className="bs-details-grid">
        {/* EXPLANATION PANEL */}
        <div className="bs-explanation-card">
          <div className="explanation-header">
            <h3>📝 Step Explanation</h3>
            <div className="pointer-readout">
              <span>
                Low: <strong>{currentStep.low !== null ? currentStep.low : "—"}</strong>
              </span>
              <span>
                Mid:{" "}
                <strong>
                  {currentStep.mid !== null
                    ? `${currentStep.mid} (val: ${currentStep.comparedValue})`
                    : "—"}
                </strong>
              </span>
              <span>
                High: <strong>{currentStep.high !== null ? currentStep.high : "—"}</strong>
              </span>
              <span>
                Target: <strong>{target}</strong>
              </span>
            </div>
          </div>

          <div className="step-action-box">
            <p className="action-text">{currentStep.action}</p>
            {currentStep.comparisonResult && (
              <div className="comparison-pill">
                <span>Comparison: </span>
                <code>{currentStep.comparisonResult}</code>
              </div>
            )}
          </div>

          {/* FINAL RESULT BANNER */}
          {currentStep.finished && (
            <div
              className={`final-result-card ${
                currentStep.found ? "result-success" : "result-failed"
              }`}
            >
              <div className="result-icon">{currentStep.found ? "🎉" : "❌"}</div>
              <div className="result-text">
                {currentStep.found ? (
                  <>
                    <strong>Target Found!</strong>
                    <p>
                      Element <strong>{target}</strong> was found at index{" "}
                      <strong>{currentStep.foundIndex}</strong> in{" "}
                      <strong>{stepIndex}</strong> comparison step(s).
                    </p>
                  </>
                ) : (
                  <>
                    <strong>Target Not Found</strong>
                    <p>
                      Element <strong>{target}</strong> does not exist in this array. The search
                      interval contracted until <code>low &gt; high</code>.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CODE SYNCHRONIZATION PANEL */}
        <div className="bs-code-card">
          <div className="code-header">
            <h3>💻 Executing Java Logic</h3>
            <span className="code-badge">Active Line {activeCodeLine}</span>
          </div>

          <pre className="bs-code-block">
            <code>
              {JAVA_CODE_LINES.map(({ line, text }) => (
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
    </div>
  );
}

export default BinarySearchVisualizer;
