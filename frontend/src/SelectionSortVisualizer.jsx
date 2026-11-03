import { useEffect, useState } from "react";
import LanguageSelector from "./components/LanguageSelector";
import { selectionSortContent } from "./algorithms/selectionSortData";
import {
  LANGUAGE_LABELS,
  useLanguagePreference
} from "./utils/languagePreferences";
import {
  generateSelectionSortTrace,
  validateSelectionSortInput
} from "./algorithms/selectionSort";

const PRESETS = [
  {
    name: "Default (Scrambled)",
    array: "64, 25, 12, 22, 11"
  },
  {
    name: "Already Sorted (Best Case O(n²))",
    array: "10, 20, 30, 40, 50"
  },
  {
    name: "Reverse Sorted (Worst Case O(n²))",
    array: "50, 40, 30, 20, 10"
  },
  {
    name: "With Duplicates",
    array: "4, 2, 4, 1, 3"
  },
  {
    name: "Negative Numbers",
    array: "-3, 5, -8, 2, 0, -1"
  },
  {
    name: "Single Element",
    array: "42"
  }
];

function SelectionSortVisualizer() {
  const [language, setLanguage] = useLanguagePreference();

  const [rawArray, setRawArray] = useState(PRESETS[0].array);
  const [numbers, setNumbers] = useState([64, 25, 12, 22, 11]);
  const [trace, setTrace] = useState(() =>
    generateSelectionSortTrace([64, 25, 12, 22, 11])
  );
  const [stepIndex, setStepIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1000);
  const [error, setError] = useState(null);

  // Autoplay effect
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
    const validation = validateSelectionSortInput(rawArray);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    setNumbers(validation.numbers);

    const newTrace = generateSelectionSortTrace(validation.numbers);
    setTrace(newTrace);
    setStepIndex(0);
  }

  function handlePresetSelect(preset) {
    setIsPlaying(false);
    setRawArray(preset.array);
    const validation = validateSelectionSortInput(preset.array);
    if (validation.valid) {
      setError(null);
      setNumbers(validation.numbers);
      const newTrace = generateSelectionSortTrace(validation.numbers);
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
    selectionSortContent.implementations[language] ||
    selectionSortContent.implementations.java;

  const activeCodeLine = currentImpl.mapStepToLine(currentStep);

  // Calculate dynamic bar heights based on min/max of current array
  const allValues = currentStep.array.length > 0 ? currentStep.array : numbers;
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, 10);
  const range = Math.max(1, maxVal - minVal);

  return (
    <div className="binary-search-visualizer selection-sort-visualizer">
      {/* HEADER & PRESETS CARD */}
      <div className="bs-header-card">
        <div className="bs-title-row">
          <div>
            <h2>🎯 Selection Sort Visualizer</h2>
            <p>
              Repeatedly find the minimum element in the unsorted suffix and swap it into the current slot.
            </p>
          </div>

          <div className="header-status-badge">
            {currentStep.finished ? (
              <span className="status-pill success">🎉 Array Sorted</span>
            ) : (
              <span className="status-pill active">
                Pass {currentStep.pass + 1} of {Math.max(1, numbers.length - 1)}
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
            <label htmlFor="selection-array-input">
              Array Elements (comma-separated):
            </label>
            <input
              id="selection-array-input"
              type="text"
              value={rawArray}
              onChange={(e) => setRawArray(e.target.value)}
              placeholder="e.g. 64, 25, 12, 22, 11"
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
            {currentStep.phase === "initial" && "🚀 Ready"}
            {currentStep.phase === "empty" && "⚪ Empty Array"}
            {currentStep.phase === "start_pass" && "🎯 Target Slot [i]"}
            {currentStep.phase === "compare" && "🔍 Compare Candidate"}
            {currentStep.phase === "update_min" && "⭐ New Minimum Found"}
            {currentStep.phase === "swap" && "🔄 Swap to Slot [i]"}
            {currentStep.phase === "pass_complete" && "✅ Pass Complete"}
            {currentStep.phase === "complete" && "🎉 Sorted!"}
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
          <label htmlFor="selection-speed-select">Speed:</label>
          <select
            id="selection-speed-select"
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

      {/* METRICS & DASHBOARD */}
      <div className="metrics-dashboard">
        <div className="metric-box">
          <span className="metric-label">Slot Filling [i]</span>
          <strong className="metric-val slot-val">
            {currentStep.targetIndex !== null ? `[${currentStep.targetIndex}]` : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Current Minimum</span>
          <strong className="metric-val min-val">
            {currentStep.minIdx !== null && currentStep.array[currentStep.minIdx] !== undefined
              ? `${currentStep.array[currentStep.minIdx]} (@ [${currentStep.minIdx}])`
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

        <div className="metric-box">
          <span className="metric-label">Sorted Prefix</span>
          <strong className="metric-val">
            {currentStep.sortedIndices.length > 0
              ? `[0..${currentStep.sortedIndices.length - 1}]`
              : "[]"}
          </strong>
        </div>
      </div>

      {/* ARRAY VISUALIZATION DISPLAY */}
      <div className="bs-display-card">
        {/* LEGEND */}
        <div className="legend-row">
          <div className="legend-item">
            <span className="legend-badge slot-pill">Slot [i]</span>
            <span className="legend-desc">Position being filled</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge min-pill">Minimum</span>
            <span className="legend-desc">Smallest found so far</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge current-pill">Comparing</span>
            <span className="legend-desc">Inspecting candidate</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge shift-pill">Swapping</span>
            <span className="legend-desc">Exchanging into slot</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge match-pill">Sorted Prefix</span>
            <span className="legend-desc">Locked in final place</span>
          </div>
        </div>

        {/* ARRAY NODES / BARS */}
        <div className="array-track">
          {currentStep.array.length === 0 ? (
            <div className="empty-track-msg">Array is empty.</div>
          ) : (
            currentStep.array.map((val, idx) => {
              const isSwapping =
                currentStep.phase === "swap" &&
                (idx === currentStep.swapFrom || idx === currentStep.swapTo);
              const isCurrentMin =
                !currentStep.finished &&
                idx === currentStep.minIdx &&
                currentStep.phase !== "swap";
              const isComparing =
                currentStep.phase === "compare" && idx === currentStep.compareIndex;
              const isTargetSlot =
                !currentStep.finished &&
                idx === currentStep.targetIndex &&
                !isCurrentMin &&
                currentStep.phase !== "swap";
              const isSorted =
                currentStep.sortedIndices.includes(idx) &&
                !isSwapping;

              let nodeClass = "node-unvisited";
              let tagText = null;
              let tagClass = "";

              if (isSwapping) {
                nodeClass = "node-shift";
                tagText = "SWAP 🔄";
                tagClass = "shift-pill";
              } else if (isComparing) {
                nodeClass = "node-boundary";
                tagText = "COMPARING 🔍";
                tagClass = "current-pill";
              } else if (isCurrentMin) {
                nodeClass = "node-key";
                tagText = "MIN ⭐";
                tagClass = "min-pill";
              } else if (isTargetSlot) {
                nodeClass = "node-active-block";
                tagText = `SLOT [${idx}]`;
                tagClass = "slot-pill";
              } else if (isSorted) {
                nodeClass = "node-match";
                tagText = "SORTED";
                tagClass = "match-pill";
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

export default SelectionSortVisualizer;
