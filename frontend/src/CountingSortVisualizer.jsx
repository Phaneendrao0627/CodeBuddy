import { useEffect, useState } from "react";
import { generateCountingSortTrace, validateCountingSortInput } from "./algorithms/countingSort";
import { countingSortContent } from "./algorithms/countingSortData";
import LanguageSelector from "./components/LanguageSelector";
import { LANGUAGE_LABELS, useLanguagePreference } from "./utils/languagePreferences";

const PRESETS = [
  { name: "Default (Mixed)",    array: "4, 2, 2, 8, 3, 3, 1" },
  { name: "All Same",           array: "5, 5, 5, 5" },
  { name: "Already Sorted",     array: "1, 2, 3, 4, 5" },
  { name: "Reverse Sorted",     array: "5, 4, 3, 2, 1" },
  { name: "With Duplicates",    array: "3, 1, 4, 1, 5, 9, 2, 6, 5, 3" },
  { name: "Small Range",        array: "0, 1, 0, 1, 1, 0" },
  { name: "Single Element",     array: "7" },
];

const PHASE_LABELS = {
  initial:      "🚀 Starting Array",
  find_min_max: "🔍 Finding Min & Max",
  counting:     "🔢 Counting Occurrences",
  cumulative:   "📊 Cumulative Counts",
  placing:      "📍 Placing Elements",
  copyback:     "📋 Copy to Output",
  complete:     "🎉 Fully Sorted!",
  empty:        "⚪ Empty Array",
};

function CountingSortVisualizer() {
  const [language, setLanguage] = useLanguagePreference();

  const [rawArray, setRawArray] = useState(PRESETS[0].array);
  const [numbers, setNumbers] = useState([4, 2, 2, 8, 3, 3, 1]);
  const [trace, setTrace] = useState(() =>
    generateCountingSortTrace([4, 2, 2, 8, 3, 3, 1])
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1000);
  const [error, setError] = useState(null);

  // Autoplay
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
    const validation = validateCountingSortInput(rawArray);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setError(null);
    setNumbers(validation.numbers);
    const newTrace = generateCountingSortTrace(validation.numbers);
    setTrace(newTrace);
    setStepIndex(0);
  }

  function handlePresetSelect(preset) {
    setIsPlaying(false);
    setRawArray(preset.array);
    const validation = validateCountingSortInput(preset.array);
    if (validation.valid) {
      setError(null);
      setNumbers(validation.numbers);
      const newTrace = generateCountingSortTrace(validation.numbers);
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
  const phase = currentStep.phase;

  // Code sync
  const currentImpl =
    countingSortContent.implementations[language] ||
    countingSortContent.implementations.java;
  const activeCodeLine = currentImpl.mapStepToLine(currentStep);

  // Bar height normalization
  const allValues = currentStep.array && currentStep.array.length > 0
    ? currentStep.array
    : numbers;
  const minBarVal = Math.min(...allValues, 0);
  const maxBarVal = Math.max(...allValues, 10);
  const barRange = Math.max(1, maxBarVal - minBarVal);

  // Counting-sort–specific fields
  const countArray   = currentStep.countArray   ?? null;
  const outputArray  = currentStep.outputArray  ?? null;
  const minVal       = currentStep.minVal       ?? null;
  const maxVal       = currentStep.maxVal       ?? null;
  const countingIndex = currentStep.countingIndex ?? null;
  const cumulativeIndex = currentStep.cumulativeIndex ?? null;
  const placingIndex  = currentStep.placingIndex  ?? null;
  const sortedIndices = currentStep.sortedIndices ?? [];

  const phaseLabel = PHASE_LABELS[phase] ?? phase;

  return (
    <div className="binary-search-visualizer merge-sort-visualizer">

      {/* ── HEADER & PRESETS CARD ── */}
      <div className="bs-header-card">
        <div className="bs-title-row">
          <div>
            <h2>🔢 Counting Sort Visualizer</h2>
            <p>
              Non-comparison integer sort: count occurrences, build cumulative
              counts, then place each element into its correct output position
              in O(n + k) time.
            </p>
          </div>

          <div className="header-status-badge">
            {currentStep.finished ? (
              <span className="status-pill success">🎉 Array Sorted</span>
            ) : (
              <span className="status-pill active">
                Counting — {phaseLabel}
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

      {/* ── INPUT CONTROLS CARD ── */}
      <div className="bs-input-card">
        <div className="input-group-row">
          <div className="input-field-wrap grow">
            <label htmlFor="counting-array-input">
              Array Elements (comma-separated integers):
            </label>
            <input
              id="counting-array-input"
              type="text"
              value={rawArray}
              onChange={(e) => setRawArray(e.target.value)}
              placeholder="e.g. 4, 2, 2, 8, 3, 3, 1"
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

        {error && (
          <div className="validation-alert">
            <div className="alert-content">
              <span className="alert-icon">⚠️</span>
              <div className="alert-message">{error}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── CONTROLS BAR ── */}
      <div className="bs-controls-card">
        <div className="stepper-stats">
          <span className="step-counter">
            Step <strong>{stepIndex + 1}</strong> of{" "}
            <strong>{trace.length}</strong>
          </span>
          <span className="phase-pill">{phaseLabel}</span>
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
          <label htmlFor="counting-speed-select">Speed:</label>
          <select
            id="counting-speed-select"
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

      {/* ── METRICS DASHBOARD ── */}
      <div className="metrics-dashboard">
        <div className="metric-box">
          <span className="metric-label">Min Value</span>
          <strong className="metric-val key-val">
            {minVal !== null ? minVal : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Max Value</span>
          <strong className="metric-val slot-val">
            {maxVal !== null ? maxVal : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Count Array Size (k)</span>
          <strong className="metric-val">
            {countArray ? countArray.length : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Currently Placing</span>
          <strong className="metric-val shift-val">
            {placingIndex !== null ? `idx ${placingIndex}` : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Comparisons</span>
          <strong className="metric-val">
            {currentStep.comparisonsCount ?? 0}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Phase</span>
          <strong className="metric-val" style={{ fontSize: "12px" }}>
            {phaseLabel}
          </strong>
        </div>
      </div>

      {/* ── DISPLAY CARD ── */}
      <div className="bs-display-card">

        {/* LEGEND */}
        <div className="legend-row">
          <div className="legend-item">
            <span className="legend-badge key-pill">Counting</span>
            <span className="legend-desc">Currently Counting</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge shift-pill">Placing</span>
            <span className="legend-desc">Being Placed</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge match-pill">Sorted</span>
            <span className="legend-desc">Finalized</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge">Unsorted</span>
            <span className="legend-desc">Waiting</span>
          </div>
        </div>

        {/* ── PANEL 1: MAIN ARRAY BAR TRACK ── */}
        <div style={{ marginBottom: "8px" }}>
          <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600 }}>
            📋 Input Array
          </span>
        </div>
        <div className="array-track">
          {currentStep.array.length === 0 ? (
            <div className="empty-track-msg">Array is empty.</div>
          ) : (
            currentStep.array.map((val, idx) => {
              const isCounting =
                phase === "counting" && countingIndex === idx;
              const isPlacing =
                phase === "placing" && placingIndex === idx;
              const isSorted =
                phase === "complete" ||
                sortedIndices.includes(idx);

              let nodeClass = "node-unvisited";
              let tagText = null;
              let tagClass = "";

              if (isSorted) {
                nodeClass = "node-match";
                tagText = "SORTED";
                tagClass = "match-pill";
              } else if (isCounting) {
                nodeClass = "node-key";
                tagText = "COUNTING";
                tagClass = "key-pill";
              } else if (isPlacing) {
                nodeClass = "node-shift";
                tagText = "PLACING";
                tagClass = "shift-pill";
              }

              const normalizedHeight =
                Math.round(((val - minBarVal) / barRange) * 90) + 55;

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

        {/* ── PANEL 2: COUNT ARRAY ── */}
        {countArray && minVal !== null && (
          <div className="count-array-panel" style={{ marginTop: "24px" }}>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600 }}>
                📊 Count Array{" "}
                <span style={{ color: "#64748b", fontWeight: 400 }}>
                  (index = value − {minVal})
                </span>
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "8px",
              }}
            >
              {countArray.map((cnt, i) => {
                let isActive = false;
                if (phase === "counting" && countingIndex !== null) {
                  isActive = i === countingIndex - minVal;
                } else if (phase === "cumulative" && cumulativeIndex !== null) {
                  isActive = i === cumulativeIndex;
                }

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      background: isActive ? "#8b5cf6" : "#1e293b",
                      border: `2px solid ${isActive ? "#c4b5fd" : "#334155"}`,
                      borderRadius: "8px",
                      padding: "6px 10px",
                      minWidth: "44px",
                      transition: "background 0.2s, border-color 0.2s",
                    }}
                  >
                    <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                      {minVal + i}
                    </span>
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      {cnt}
                    </span>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>
                      [{i}]
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PANEL 3: OUTPUT ARRAY ── */}
        {outputArray && (
          <div className="output-array-panel" style={{ marginTop: "24px" }}>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600 }}>
                📤 Output Array
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: "8px",
              }}
            >
              {outputArray.map((val, i) => {
                const isFilled = val !== 0 && val !== null && val !== undefined;
                const isCurrentlyPlaced =
                  phase === "placing" && placingIndex !== null && i === placingIndex;

                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      background: isCurrentlyPlaced
                        ? "#f97316"
                        : isFilled
                        ? "#10b981"
                        : "#0f172a",
                      border: `2px solid ${
                        isCurrentlyPlaced
                          ? "#fed7aa"
                          : isFilled
                          ? "#6ee7b7"
                          : "#1e293b"
                      }`,
                      borderRadius: "8px",
                      padding: "6px 10px",
                      minWidth: "44px",
                      transition: "background 0.2s, border-color 0.2s",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      {isFilled ? val : "—"}
                    </span>
                    <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                      [{i}]
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP MESSAGE */}
        <div className="step-message-box" style={{ marginTop: "20px" }}>
          <span className="msg-icon">💡</span>
          <p className="msg-text">{currentStep.message}</p>
        </div>
      </div>

      {/* ── CODE SYNCHRONIZATION CARD ── */}
      <div className="bs-code-card">
        <div className="code-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
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
                className={`code-line ${
                  activeCodeLine === line ? "line-highlight" : ""
                }`}
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

export default CountingSortVisualizer;
