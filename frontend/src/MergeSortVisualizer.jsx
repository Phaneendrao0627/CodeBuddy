import { useEffect, useState } from "react";
import LanguageSelector from "./components/LanguageSelector";
import { mergeSortContent } from "./algorithms/mergeSortData";
import {
  LANGUAGE_LABELS,
  useLanguagePreference
} from "./utils/languagePreferences";
import {
  generateMergeSortTrace,
  validateMergeSortInput
} from "./algorithms/mergeSort";

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
    name: "Already Sorted (Best Case O(n log n))",
    array: "10, 20, 30, 40, 50, 60"
  },
  {
    name: "Reverse Sorted (Worst Case O(n log n))",
    array: "60, 50, 40, 30, 20, 10"
  },
  {
    name: "With Duplicates (Stable)",
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

function MergeSortVisualizer() {
  const [language, setLanguage] = useLanguagePreference();

  const [rawArray, setRawArray] = useState(PRESETS[0].array);
  const [numbers, setNumbers] = useState([38, 27, 43, 3, 9, 82, 10]);
  const [trace, setTrace] = useState(() =>
    generateMergeSortTrace([38, 27, 43, 3, 9, 82, 10])
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
    const validation = validateMergeSortInput(rawArray);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    setNumbers(validation.numbers);

    const newTrace = generateMergeSortTrace(validation.numbers);
    setTrace(newTrace);
    setStepIndex(0);
  }

  function handlePresetSelect(preset) {
    setIsPlaying(false);
    setRawArray(preset.array);
    const validation = validateMergeSortInput(preset.array);
    if (validation.valid) {
      setError(null);
      setNumbers(validation.numbers);
      const newTrace = generateMergeSortTrace(validation.numbers);
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
    mergeSortContent.implementations[language] ||
    mergeSortContent.implementations.java;

  const activeCodeLine = currentImpl.mapStepToLine(currentStep);

  // Dynamic bar heights
  const allValues = currentStep.array.length > 0 ? currentStep.array : numbers;
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, 10);
  const range = Math.max(1, maxVal - minVal);

  const isMergePhase = [
    "merge_start",
    "compare",
    "copy_left",
    "copy_right",
    "copy_remaining",
    "merge_complete"
  ].includes(currentStep.phase);

  return (
    <div className="binary-search-visualizer merge-sort-visualizer">
      {/* HEADER & PRESETS CARD */}
      <div className="bs-header-card">
        <div className="bs-title-row">
          <div>
            <h2>🔀 Merge Sort Visualizer</h2>
            <p>
              Divide and conquer: recursively split the array into halves, then merge sorted subarrays in O(n log n) time.
            </p>
          </div>

          <div className="header-status-badge">
            {currentStep.finished ? (
              <span className="status-pill success">🎉 Array Sorted</span>
            ) : (
              <span className="status-pill active">
                Range [{currentStep.left}..{currentStep.right}] (Depth {currentStep.depth})
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
            <label htmlFor="merge-array-input">
              Array Elements (comma-separated):
            </label>
            <input
              id="merge-array-input"
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
            {currentStep.phase === "split" && "✂️ Divide (Split)"}
            {currentStep.phase === "base_case" && "🍃 Base Case (n ≤ 1)"}
            {currentStep.phase === "merge_start" && "🤝 Merge Begin"}
            {currentStep.phase === "compare" && "🔍 Compare Elements"}
            {currentStep.phase === "copy_left" && "⬅️ Copy Left"}
            {currentStep.phase === "copy_right" && "➡️ Copy Right"}
            {currentStep.phase === "copy_remaining" && "📥 Copy Remaining"}
            {currentStep.phase === "merge_complete" && "✅ Subarray Merged"}
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
          <label htmlFor="merge-speed-select">Speed:</label>
          <select
            id="merge-speed-select"
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

      {/* METRICS & RECURSION STATE DASHBOARD */}
      <div className="metrics-dashboard">
        <div className="metric-box">
          <span className="metric-label">Active Range</span>
          <strong className="metric-val slot-val">
            [{currentStep.left}..{currentStep.right}]
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Midpoint</span>
          <strong className="metric-val">
            {currentStep.mid !== null ? `mid = ${currentStep.mid}` : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Target Slot [k]</span>
          <strong className="metric-val key-val">
            {currentStep.targetIndex !== null ? `[${currentStep.targetIndex}]` : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Comparisons</span>
          <strong className="metric-val">{currentStep.comparisonsCount}</strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Element Writes</span>
          <strong className="metric-val">{currentStep.writesCount}</strong>
        </div>
      </div>

      {/* ARRAY VISUALIZATION DISPLAY */}
      <div className="bs-display-card">
        {/* LEGEND */}
        <div className="legend-row">
          <div className="legend-item">
            <span className="legend-badge slot-pill">Left Subarray</span>
            <span className="legend-desc">[left..mid]</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge min-pill">Right Subarray</span>
            <span className="legend-desc">[mid+1..right]</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge current-pill">Comparing</span>
            <span className="legend-desc">leftArr[i] vs rightArr[j]</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge shift-pill">Writing Slot</span>
            <span className="legend-desc">Slot k being written</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge match-pill">Merged Subarray</span>
            <span className="legend-desc">Sorted segment</span>
          </div>
        </div>

        {/* SUBARRAY BUFFERS (DURING MERGE PHASES) */}
        {isMergePhase && (currentStep.leftSubarray.length > 0 || currentStep.rightSubarray.length > 0) && (
          <div className="merge-buffer-panel">
            <div className="sub-buffer-box">
              <span className="sub-buffer-title">Left Subarray (i = {currentStep.leftPointer !== null ? currentStep.leftPointer : "--"})</span>
              <div className="sub-buffer-chips">
                {currentStep.leftSubarray.map((val, idx) => {
                  const isActivePtr = idx === currentStep.leftPointer;
                  const isDone = currentStep.leftPointer !== null && idx < currentStep.leftPointer;
                  return (
                    <span
                      key={idx}
                      className={`sub-chip left ${isActivePtr ? "active-ptr" : ""} ${isDone ? "exhausted" : ""}`}
                    >
                      {val}
                    </span>
                  );
                })}
              </div>
            </div>

            <span style={{ color: "#64748b", fontWeight: "bold" }}>➔ MERGING INTO ➔</span>

            <div className="sub-buffer-box">
              <span className="sub-buffer-title">Right Subarray (j = {currentStep.rightPointer !== null ? currentStep.rightPointer : "--"})</span>
              <div className="sub-buffer-chips">
                {currentStep.rightSubarray.map((val, idx) => {
                  const isActivePtr = idx === currentStep.rightPointer;
                  const isDone = currentStep.rightPointer !== null && idx < currentStep.rightPointer;
                  return (
                    <span
                      key={idx}
                      className={`sub-chip right ${isActivePtr ? "active-ptr" : ""} ${isDone ? "exhausted" : ""}`}
                    >
                      {val}
                    </span>
                  );
                })}
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
              const isTargetSlot = idx === currentStep.targetIndex;
              const isMid = currentStep.mid !== null && idx === currentStep.mid;
              const isLeftSub = currentStep.mid !== null && idx >= currentStep.left && idx <= currentStep.mid;
              const isRightSub = currentStep.mid !== null && idx > currentStep.mid && idx <= currentStep.right;
              const isMerged = currentStep.phase === "merge_complete" && inActiveRange;
              const isFinalComplete = currentStep.phase === "complete";

              let nodeClass = "node-unvisited";
              let tagText = null;
              let tagClass = "";

              if (isFinalComplete) {
                nodeClass = "node-match";
                tagText = "SORTED";
                tagClass = "match-pill";
              } else if (isTargetSlot) {
                nodeClass = "node-shift";
                tagText = `WRITE [${idx}]`;
                tagClass = "shift-pill";
              } else if (isMerged) {
                nodeClass = "node-match";
                tagText = "MERGED";
                tagClass = "match-pill";
              } else if (inActiveRange) {
                if (isLeftSub) {
                  nodeClass = "node-active-block";
                  tagText = isMid ? "LEFT MID" : "LEFT";
                  tagClass = "slot-pill";
                } else if (isRightSub) {
                  nodeClass = "node-key";
                  tagText = "RIGHT";
                  tagClass = "min-pill";
                } else {
                  nodeClass = "node-active-block";
                  tagText = `ACTIVE`;
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

export default MergeSortVisualizer;
