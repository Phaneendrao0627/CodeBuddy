import { useEffect, useState } from "react";
import { generateRadixSortTrace, validateRadixSortInput } from "./algorithms/radixSort";
import { radixSortContent } from "./algorithms/radixSortData";
import LanguageSelector from "./components/LanguageSelector";
import { LANGUAGE_LABELS, useLanguagePreference } from "./utils/languagePreferences";

const PRESETS = [
  { name: "Default (Mixed Length)", array: "170, 45, 75, 90, 802, 24, 2, 66" },
  { name: "Same Length (3-digit)",   array: "329, 457, 657, 839, 436, 720, 355" },
  { name: "Already Sorted",         array: "2, 24, 45, 66, 75, 90, 170, 802" },
  { name: "Reverse Sorted",         array: "802, 170, 90, 75, 66, 45, 24, 2" },
  { name: "With Duplicates",        array: "42, 17, 42, 9, 17, 90, 42" },
  { name: "With Zero Included",     array: "0, 50, 12, 100, 5, 20" },
  { name: "Single Element",         array: "42" },
];

const PHASE_LABELS = {
  initial:           "🚀 Starting Array",
  find_max:          "🔍 Finding Max Element",
  pass_start:        "🏁 Digit Pass Started",
  counting:          "🔢 Tallying Digit Frequencies",
  counting_complete: "✅ Frequencies Counted",
  cumulative:        "📊 Cumulative Prefix Sums",
  placing:           "📍 Stable Output Placement",
  copyback:          "📋 Copying to Main Array",
  pass_complete:     "🎉 Pass Completed",
  complete:          "🏆 Fully Sorted!",
  empty:             "⚪ Empty Array",
};

/**
 * Splits a number into digits and highlights the digit at place `exp`.
 */
function renderNumberWithHighlightedDigit(val, exp) {
  if (exp === null || exp === undefined || val === null || val === undefined) {
    return <span>{val}</span>;
  }
  const s = String(val);
  const power = Math.round(Math.log10(exp)); // 0 for 1s, 1 for 10s, 2 for 100s
  const charIndexFromRight = power;

  if (charIndexFromRight >= s.length) {
    // Leading zero implied
    return (
      <span>
        <span style={{ color: "#f59e0b", fontWeight: "900", borderBottom: "2px solid #f59e0b" }}>
          (0)
        </span>
        {s}
      </span>
    );
  }

  const charIndex = s.length - 1 - charIndexFromRight;
  const before = s.slice(0, charIndex);
  const activeChar = s[charIndex];
  const after = s.slice(charIndex + 1);

  return (
    <span>
      {before}
      <span style={{ color: "#f59e0b", fontWeight: "900", textDecoration: "underline", textUnderlineOffset: "3px" }}>
        {activeChar}
      </span>
      {after}
    </span>
  );
}

function RadixSortVisualizer() {
  const [language, setLanguage] = useLanguagePreference();

  const [rawArray, setRawArray] = useState(PRESETS[0].array);
  const [numbers, setNumbers] = useState([170, 45, 75, 90, 802, 24, 2, 66]);
  const [trace, setTrace] = useState(() =>
    generateRadixSortTrace([170, 45, 75, 90, 802, 24, 2, 66])
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
    const validation = validateRadixSortInput(rawArray);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setError(null);
    setNumbers(validation.numbers);
    const newTrace = generateRadixSortTrace(validation.numbers);
    setTrace(newTrace);
    setStepIndex(0);
  }

  function handlePresetSelect(preset) {
    setIsPlaying(false);
    setRawArray(preset.array);
    const validation = validateRadixSortInput(preset.array);
    if (validation.valid) {
      setError(null);
      setNumbers(validation.numbers);
      const newTrace = generateRadixSortTrace(validation.numbers);
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
    radixSortContent.implementations[language] ||
    radixSortContent.implementations.java;

  const activeCodeLine = currentImpl.mapStepToLine(currentStep);

  // Dynamic bar height calculation
  const allValues = currentStep.array.length > 0 ? currentStep.array : numbers;
  const minVal = Math.min(...allValues, 0);
  const maxVal = Math.max(...allValues, 10);
  const range = Math.max(1, maxVal - minVal);

  return (
    <div className="binary-search-visualizer merge-sort-visualizer">
      {/* HEADER & PRESETS CARD */}
      <div className="bs-header-card">
        <div className="bs-title-row">
          <div>
            <h2>🧮 Radix Sort Visualizer</h2>
            <p>
              Non-comparison integer sorting: process elements digit by digit (LSD) using a stable counting sort in O(d × (n + b)) linear time.
            </p>
          </div>

          <div className="header-status-badge">
            {currentStep.finished ? (
              <span className="status-pill success">🎉 Array Fully Sorted</span>
            ) : currentStep.exp ? (
              <span className="status-pill active">
                {currentStep.digitPlace} (Pass {currentStep.passNumber}/{currentStep.totalPasses})
              </span>
            ) : (
              <span className="status-pill active">Initializing</span>
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
            <label htmlFor="radix-array-input">
              Array Elements (non-negative integers, comma-separated):
            </label>
            <input
              id="radix-array-input"
              type="text"
              value={rawArray}
              onChange={(e) => setRawArray(e.target.value)}
              placeholder="e.g. 170, 45, 75, 90, 802, 24, 2, 66"
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
            {PHASE_LABELS[currentStep.phase] || currentStep.phase}
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
          <label htmlFor="radix-speed-select">Speed:</label>
          <select
            id="radix-speed-select"
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

      {/* METRICS & RADIX STATE DASHBOARD */}
      <div className="metrics-dashboard">
        <div className="metric-box">
          <span className="metric-label">Digit Place</span>
          <strong className="metric-val key-val">
            {currentStep.digitPlace || "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Digit Pass</span>
          <strong className="metric-val slot-val">
            {currentStep.totalPasses ? `Pass ${currentStep.passNumber} / ${currentStep.totalPasses}` : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Active Element</span>
          <strong className="metric-val">
            {currentStep.activeElementIndex !== null && currentStep.array[currentStep.activeElementIndex] !== undefined
              ? `[${currentStep.activeElementIndex}] = ${currentStep.array[currentStep.activeElementIndex]}`
              : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Target Digit</span>
          <strong className="metric-val" style={{ color: "#f59e0b" }}>
            {currentStep.activeDigit !== null ? `Digit = ${currentStep.activeDigit}` : "--"}
          </strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Max Element</span>
          <strong className="metric-val">{currentStep.maxVal ?? "--"}</strong>
        </div>

        <div className="metric-box">
          <span className="metric-label">Comparisons</span>
          <strong className="metric-val">0 (Non-Comparison)</strong>
        </div>
      </div>

      {/* DISPLAY CARD */}
      <div className="bs-display-card">
        {/* LEGEND */}
        <div className="legend-row">
          <div className="legend-item">
            <span className="legend-badge key-pill">Active Input</span>
            <span className="legend-desc">Being evaluated</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge shift-pill">Placing</span>
            <span className="legend-desc">Output placement</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge current-pill">Underlined</span>
            <span className="legend-desc">Active digit</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge match-pill">Sorted</span>
            <span className="legend-desc">Finalized order</span>
          </div>
        </div>

        {/* PRIMARY MAIN ARRAY BAR TRACK */}
        <div className="array-track">
          {currentStep.array.length === 0 ? (
            <div className="empty-track-msg">Array is empty.</div>
          ) : (
            currentStep.array.map((val, idx) => {
              const isActiveInput = currentStep.activeElementIndex === idx;
              const isPlacing = currentStep.phase === "placing" && currentStep.placingIndex === idx;
              const isSorted =
                currentStep.finished ||
                (currentStep.sortedIndices && currentStep.sortedIndices.includes(idx));

              let nodeClass = "node-unvisited";
              let tagText = null;
              let tagClass = "";

              if (isSorted) {
                nodeClass = "node-match";
                tagText = "SORTED";
                tagClass = "match-pill";
              } else if (isPlacing) {
                nodeClass = "node-shift";
                tagText = `PLACING`;
                tagClass = "shift-pill";
              } else if (isActiveInput) {
                nodeClass = "node-key";
                tagText = `DIGIT: ${currentStep.activeDigit ?? ""}`;
                tagClass = "key-pill";
              }

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
                    <span className="node-val">
                      {renderNumberWithHighlightedDigit(val, currentStep.exp)}
                    </span>
                  </div>

                  <span className="node-idx">[{idx}]</span>
                </div>
              );
            })
          )}
        </div>

        {/* DIGIT FREQUENCY COUNT PANEL (BASE 10 BUCKETS 0..9) */}
        {currentStep.countArray && (
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "10px",
              padding: "14px 18px",
              marginTop: "16px",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.25)"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                borderBottom: "1px solid #1e293b",
                paddingBottom: "6px"
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px"
                }}
              >
                {currentStep.phase === "cumulative" || currentStep.phase === "placing"
                  ? `📊 Cumulative Output Positions for Base 10 (${currentStep.digitPlace})`
                  : `🔢 Digit Frequency Buckets 0–9 (${currentStep.digitPlace})`}
              </span>
              <span style={{ fontSize: "11px", color: "#64748b" }}>Base b = 10</span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                justifyContent: "center"
              }}
            >
              {currentStep.countArray.map((cnt, digit) => {
                const isCurrentDigitBucket = currentStep.activeDigit === digit;
                return (
                  <div
                    key={digit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      background: isCurrentDigitBucket ? "#8b5cf6" : "#1e293b",
                      border: `2px solid ${isCurrentDigitBucket ? "#c4b5fd" : "#334155"}`,
                      borderRadius: "8px",
                      padding: "6px 10px",
                      minWidth: "46px",
                      transition: "all 0.2s ease",
                      boxShadow: isCurrentDigitBucket ? "0 0 12px rgba(139, 92, 246, 0.5)" : "none"
                    }}
                  >
                    <span style={{ fontSize: "10px", color: "#94a3b8" }}>Digit {digit}</span>
                    <span style={{ fontSize: "18px", fontWeight: "bold", color: "#fff" }}>
                      {cnt}
                    </span>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>count[{digit}]</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* OUTPUT BUFFER ARRAY TRACK */}
        {currentStep.outputArray && (
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "10px",
              padding: "14px 18px",
              marginTop: "16px",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.25)"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                borderBottom: "1px solid #1e293b",
                paddingBottom: "6px"
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px"
                }}
              >
                📥 Stable Output Buffer (Intermediate Placement)
              </span>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Target: {currentStep.digitPlace}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                justifyContent: "center"
              }}
            >
              {currentStep.outputArray.map((val, idx) => {
                const isJustPlaced = currentStep.outputIndex === idx && currentStep.phase === "placing";
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      background: isJustPlaced ? "#f97316" : val !== null ? "#334155" : "#1e293b",
                      border: `2px solid ${isJustPlaced ? "#fed7aa" : val !== null ? "#475569" : "#334155"}`,
                      borderRadius: "8px",
                      padding: "6px 12px",
                      minWidth: "48px",
                      transition: "all 0.2s ease",
                      boxShadow: isJustPlaced ? "0 0 14px rgba(249, 115, 22, 0.6)" : "none"
                    }}
                  >
                    <span style={{ fontSize: "10px", color: "#94a3b8" }}>[{idx}]</span>
                    <span style={{ fontSize: "16px", fontWeight: "bold", color: val !== null ? "#fff" : "#64748b" }}>
                      {val !== null ? renderNumberWithHighlightedDigit(val, currentStep.exp) : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
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

export default RadixSortVisualizer;
