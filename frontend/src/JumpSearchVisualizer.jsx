import { useEffect, useState } from "react";
import LanguageSelector from "./components/LanguageSelector";
import { jumpSearchContent } from "./algorithms/jumpSearchData";
import {
  LANGUAGE_LABELS,
  useLanguagePreference
} from "./utils/languagePreferences";
import {
  generateJumpSearchTrace,
  sortArrayAscending,
  validateJumpSearchInput
} from "./algorithms/jumpSearch";

const PRESETS = [
  {
    name: "Default (Found: 55)",
    array: "0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144",
    target: "55"
  },
  {
    name: "First Element (Best Case O(1))",
    array: "2, 4, 6, 8, 10, 12, 14, 16",
    target: "2"
  },
  {
    name: "Last Element (Worst Case)",
    array: "3, 6, 9, 12, 15, 18, 21, 24, 27",
    target: "27"
  },
  {
    name: "Target Missing (In Range)",
    array: "5, 10, 15, 20, 25, 30, 35, 40",
    target: "22"
  },
  {
    name: "Target Beyond Array",
    array: "10, 20, 30, 40, 50, 60, 70, 80",
    target: "99"
  },
  {
    name: "With Duplicates",
    array: "2, 5, 5, 5, 12, 18, 24, 30",
    target: "5"
  },
  {
    name: "Single Element",
    array: "42",
    target: "42"
  }
];

function JumpSearchVisualizer() {
  const [language, setLanguage] = useLanguagePreference();

  const [rawArray, setRawArray] = useState(PRESETS[0].array);
  const [rawTarget, setRawTarget] = useState(PRESETS[0].target);

  const [numbers, setNumbers] = useState([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]);
  const [target, setTarget] = useState(55);
  const [trace, setTrace] = useState(() =>
    generateJumpSearchTrace([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144], 55)
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
    const validation = validateJumpSearchInput(rawArray, rawTarget);

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

    const newTrace = generateJumpSearchTrace(validation.numbers, validation.target);
    setTrace(newTrace);
    setStepIndex(0);
  }

  function handleAutoSort() {
    if (!pendingNumbers) return;
    const sorted = sortArrayAscending(pendingNumbers);
    const sortedStr = sorted.join(", ");
    setRawArray(sortedStr);
    setIsUnsorted(false);
    setError(null);

    setNumbers(sorted);
    const newTrace = generateJumpSearchTrace(sorted, target);
    setTrace(newTrace);
    setStepIndex(0);
  }

  function handlePresetSelect(preset) {
    setIsPlaying(false);
    setRawArray(preset.array);
    setRawTarget(preset.target);
    setError(null);
    setIsUnsorted(false);
    setPendingNumbers(null);

    const validation = validateJumpSearchInput(preset.array, preset.target);
    if (validation.valid) {
      setNumbers(validation.numbers);
      setTarget(validation.target);
      const newTrace = generateJumpSearchTrace(validation.numbers, validation.target);
      setTrace(newTrace);
      setStepIndex(0);
    }
  }

  function handlePrev() {
    setIsPlaying(false);
    setStepIndex((prev) => Math.max(0, prev - 1));
  }

  function handleNext() {
    setIsPlaying(false);
    setStepIndex((prev) => Math.min(trace.length - 1, prev + 1));
  }

  function handleReset() {
    setIsPlaying(false);
    setStepIndex(0);
  }

  function handleReplay() {
    setStepIndex(0);
    setIsPlaying(true);
  }

  const currentStep = trace[stepIndex] || trace[0] || {};
  const currentImpl =
    jumpSearchContent.implementations[language] ||
    jumpSearchContent.implementations.java;
  const activeCodeLine = currentImpl.mapStepToLine(currentStep);

  return (
    <div className="binary-search-visualizer jump-search-visualizer">
      {/* HEADER & PRESETS CARD */}
      <div className="bs-header-card">
        <div className="bs-title-row">
          <div>
            <h2>🐇 Jump Search Visualizer</h2>
            <p>
              Jump ahead in blocks of size <code>m = ⌊√n⌋</code>, then linearly scan the identified block.
            </p>
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
                className={`preset-chip ${
                  rawArray === preset.array && rawTarget === preset.target ? "active" : ""
                }`}
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
            <label htmlFor="jump-array-input">
              Sorted Array (comma-separated):
            </label>
            <input
              id="jump-array-input"
              type="text"
              value={rawArray}
              onChange={(e) => setRawArray(e.target.value)}
              placeholder="e.g. 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144"
              className={error ? "input-error" : ""}
            />
          </div>

          <div className="input-field-wrap target-wrap">
            <label htmlFor="jump-target-input">Target Value:</label>
            <input
              id="jump-target-input"
              type="text"
              value={rawTarget}
              onChange={(e) => setRawTarget(e.target.value)}
              placeholder="e.g. 55"
              className={error ? "input-error" : ""}
            />
          </div>

          <button
            type="button"
            className="action-btn apply-btn"
            onClick={handleApply}
          >
            Apply &amp; Visualize
          </button>
        </div>

        {/* ERROR / SORT ALERT */}
        {error && (
          <div className="validation-alert">
            <div className="alert-content">
              <span className="alert-icon">⚠️</span>
              <div className="alert-message">{error}</div>
            </div>
            {isUnsorted && (
              <button
                type="button"
                className="action-btn sort-btn"
                onClick={handleAutoSort}
              >
                Sort Array Ascending &amp; Trace
              </button>
            )}
          </div>
        )}
      </div>

      {/* STEP CONTROLS BAR */}
      <div className="bs-controls-card">
        <div className="stepper-stats">
          <span className="step-counter">
            Step <strong>{stepIndex + 1}</strong> of <strong>{trace.length}</strong>
          </span>
          <span className="phase-pill">
            {currentStep.phase === "initial" && "🚀 Ready to Jump"}
            {currentStep.phase === "block_jump" && "⏭️ Block Jumping"}
            {currentStep.phase === "block_found" && "🎯 Block Bounded"}
            {currentStep.phase === "linear_scan" && "🔍 Linear Scan in Block"}
            {currentStep.phase === "found" && "🎉 Target Found"}
            {currentStep.phase === "not_found" && "❌ Target Not Found"}
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
          <label htmlFor="jump-speed-select">Speed:</label>
          <select
            id="jump-speed-select"
            value={playSpeed}
            onChange={(e) => setPlaySpeed(Number(e.target.value))}
          >
            <option value={1800}>0.5x (Slow)</option>
            <option value={1100}>1.0x (Normal)</option>
            <option value={700}>1.5x (Fast)</option>
            <option value={400}>2.0x (Very Fast)</option>
          </select>
        </div>
      </div>

      {/* ARRAY VISUALIZATION DISPLAY */}
      <div className="bs-display-card">
        <div className="legend-row">
          <div className="legend-item">
            <span className="legend-badge current-pill">Jump Boundary</span>
            <span className="legend-desc">Block boundary check</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge active-block-pill">Active Block</span>
            <span className="legend-desc">Candidate interval</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge linear-pill">Linear Scan</span>
            <span className="legend-desc">Checked element</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge match-pill">Match</span>
            <span className="legend-desc">Target found</span>
          </div>
          <div className="legend-item">
            <span className="legend-badge skipped-pill">Skipped</span>
            <span className="legend-desc">Overshot / bypassed block</span>
          </div>
        </div>

        {/* ARRAY NODES */}
        <div className="bs-array-container">
          {numbers.map((val, idx) => {
            const isMatch = currentStep.foundIndex === idx;
            const isBoundaryCheck = currentStep.currentIndex === idx && (currentStep.phase === "block_jump" || currentStep.phase === "block_found");
            const isLinearScan = currentStep.currentIndex === idx && (currentStep.phase === "linear_scan" || currentStep.phase === "found");
            const isInActiveBlock = currentStep.activeBlockIndices?.includes(idx);
            const isSkipped = currentStep.skippedIndices?.includes(idx);
            const isCheckedLinear = currentStep.checkedIndices?.includes(idx);

            let nodeStateClass = "node-normal";
            if (isMatch) {
              nodeStateClass = "node-match";
            } else if (isBoundaryCheck) {
              nodeStateClass = "node-boundary";
            } else if (isLinearScan) {
              nodeStateClass = "node-current-scan";
            } else if (isCheckedLinear) {
              nodeStateClass = "node-checked";
            } else if (isInActiveBlock) {
              nodeStateClass = "node-active-block";
            } else if (isSkipped) {
              nodeStateClass = "node-eliminated";
            }

            return (
              <div
                key={idx}
                className={`bs-array-node ${nodeStateClass}`}
              >
                {/* POINTER PILLS */}
                <div className="pointer-tag-slot">
                  {isMatch && <span className="pointer-pill match">Found!</span>}
                  {!isMatch && isBoundaryCheck && (
                    <span className="pointer-pill boundary-tag">Block End</span>
                  )}
                  {!isMatch && isLinearScan && (
                    <span className="pointer-pill scan-tag">i = {idx}</span>
                  )}
                  {!isMatch && !isBoundaryCheck && !isLinearScan && idx === currentStep.prev && (
                    <span className="pointer-pill prev-tag">prev</span>
                  )}
                </div>

                <div className="node-box">
                  <span className="node-val">{val}</span>
                </div>

                <div className="node-index">[{idx}]</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILS AND CODE SYNCHRONIZATION */}
      <div className="bs-details-grid">
        {/* STEP EXPLANATION PANEL */}
        <div className="bs-explanation-card">
          <h3>📝 Step Explanation</h3>

          <div className="pointers-readout">
            <div className="readout-item">
              <span className="label">Jump Size (m):</span>
              <span className="value">{currentStep.jumpSize ?? "—"}</span>
            </div>
            <div className="readout-item">
              <span className="label">Active Block:</span>
              <span className="value">
                [{currentStep.blockStart ?? 0} .. {currentStep.blockEnd ?? 0}]
              </span>
            </div>
            <div className="readout-item">
              <span className="label">Comparisons:</span>
              <span className="value">{currentStep.comparisonsCount ?? 0}</span>
            </div>
            <div className="readout-item">
              <span className="label">Target:</span>
              <span className="value target-val">{target}</span>
            </div>
          </div>

          <div className="step-narrative">
            <p className="narrative-action">{currentStep.action}</p>
            {currentStep.comparisonResult && (
              <div className="comparison-detail">
                <span className="detail-tag">Comparison:</span>
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
                      <strong>{currentStep.comparisonsCount}</strong> comparison(s).
                    </p>
                  </>
                ) : (
                  <>
                    <strong>Target Not Found</strong>
                    <p>
                      Element <strong>{target}</strong> does not exist in this array. Returned <code>-1</code>.
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h3>💻 Executing {LANGUAGE_LABELS[language] || "Code"} Logic</h3>
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
    </div>
  );
}

export default JumpSearchVisualizer;
