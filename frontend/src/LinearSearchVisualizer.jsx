import { useEffect, useState } from "react";
import LanguageSelector from "./components/LanguageSelector";
import { linearSearchContent } from "./algorithms/linearSearchData";
import {
  LANGUAGE_LABELS,
  useLanguagePreference
} from "./utils/languagePreferences";
import {
  generateLinearSearchTrace,
  validateLinearSearchInput
} from "./algorithms/linearSearch";

const PRESETS = [
  {
    name: "Middle Match (Unsorted)",
    array: "14, 27, 8, 42, 19, 35, 50",
    target: "42"
  },
  {
    name: "First Element (Best Case O(1))",
    array: "99, 12, 58, 3, 77",
    target: "99"
  },
  {
    name: "Last Element (Worst Case O(n))",
    array: "15, 23, 4, 88, 62",
    target: "62"
  },
  {
    name: "Target Missing",
    array: "5, 12, 33, 48, 71",
    target: "25"
  },
  {
    name: "With Duplicates",
    array: "10, 20, 30, 20, 50",
    target: "20"
  },
  {
    name: "Single Element",
    array: "7",
    target: "7"
  }
];

function LinearSearchVisualizer() {
  const [language, setLanguage] = useLanguagePreference();
  const [rawArray, setRawArray] = useState(PRESETS[0].array);
  const [rawTarget, setRawTarget] = useState(PRESETS[0].target);

  const [numbers, setNumbers] = useState([14, 27, 8, 42, 19, 35, 50]);
  const [target, setTarget] = useState(42);
  const [trace, setTrace] = useState(() =>
    generateLinearSearchTrace([14, 27, 8, 42, 19, 35, 50], 42)
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

    const validation = validateLinearSearchInput(rawArray, rawTarget);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setError(null);
    setNumbers(validation.numbers);
    setTarget(validation.target);

    const newTrace = generateLinearSearchTrace(validation.numbers, validation.target);
    setTrace(newTrace);
    setStepIndex(0);
  }

  function handleSelectPreset(preset) {
    setIsPlaying(false);
    setRawArray(preset.array);
    setRawTarget(preset.target);
    setError(null);

    const validation = validateLinearSearchInput(preset.array, preset.target);
    if (validation.valid) {
      setNumbers(validation.numbers);
      setTarget(validation.target);
      const newTrace = generateLinearSearchTrace(validation.numbers, validation.target);
      setTrace(newTrace);
      setStepIndex(0);
    }
  }

  const currentStep = trace[stepIndex] || trace[0] || {};
  const currentImpl =
    linearSearchContent.implementations[language] ||
    linearSearchContent.implementations.java;
  const activeCodeLine = currentImpl.mapStepToLine(currentStep);

  return (
    <div className="binary-search-visualizer linear-search-visualizer">
      {/* HEADER */}
      <div className="bs-header-card">
        <div className="bs-title-area">
          <h2>🔍 Linear Search Interactive Visualizer</h2>
          <p>
            Watch the algorithm inspect each element sequentially from left to right on sorted or unsorted data.
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
            <label htmlFor="ls-array-input">
              Array Elements <span className="label-hint">(comma-separated, any order)</span>
            </label>
            <input
              id="ls-array-input"
              type="text"
              value={rawArray}
              onChange={(e) => setRawArray(e.target.value)}
              placeholder="e.g. 14, 27, 8, 42, 19, 35, 50"
            />
          </div>

          <div className="input-group target-input-group">
            <label htmlFor="ls-target-input">Target Value</label>
            <input
              id="ls-target-input"
              type="number"
              value={rawTarget}
              onChange={(e) => setRawTarget(e.target.value)}
              placeholder="e.g. 42"
            />
          </div>

          <button type="submit" className="bs-submit-button">
            Apply &amp; Visualize
          </button>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="bs-error-banner">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <strong>Input Validation Error</strong>
              <p>{error}</p>
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
            {currentStep.phase === "comparing" && `🔍 Checking Index ${currentStep.currentIndex}`}
            {currentStep.phase === "initial" && "🚀 Ready to Scan"}
          </div>

          <div className="speed-control">
            <label htmlFor="ls-speed-select">Speed:</label>
            <select
              id="ls-speed-select"
              value={playSpeed}
              onChange={(e) => setPlaySpeed(Number(e.target.value))}
            >
              <option value={1500}>0.7x (Slow)</option>
              <option value={1000}>1.0x (Normal)</option>
              <option value={500}>2.0x (Fast)</option>
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
            <span className="legend-indicator pointer-mid">Current (i)</span>
            <span>Currently Inspected Element</span>
          </div>
          <div className="legend-item">
            <span className="legend-indicator pointer-low">Checked</span>
            <span>Already Checked (No Match)</span>
          </div>
          <div className="legend-item">
            <span className="legend-indicator badge-found" style={{ background: "#10b981" }}>
              Match
            </span>
            <span>Target Found</span>
          </div>
          <div className="legend-item">
            <span className="legend-box eliminated-sample" />
            <span>Unchecked Element</span>
          </div>
        </div>

        <div className="bs-array-scroll-container">
          <div className="bs-array-track">
            {numbers.map((val, idx) => {
              const isCurrent = currentStep.currentIndex === idx;
              const isFound = currentStep.found && currentStep.foundIndex === idx;
              const isChecked =
                currentStep.checkedIndices &&
                currentStep.checkedIndices.includes(idx) &&
                !isFound;

              let itemClass = "bs-array-node";
              if (isFound) itemClass += " node-found";
              else if (isCurrent) itemClass += " node-mid";
              else if (isChecked) itemClass += " node-active";
              else itemClass += " node-eliminated";

              return (
                <div key={idx} className={itemClass}>
                  {/* POINTER LABEL */}
                  <div className="node-pointer-slot">
                    {isCurrent ? (
                      <span className={`pointer-badge ${isFound ? "badge-found" : "badge-mid"}`}>
                        {isFound ? "Found!" : `i = ${idx}`}
                      </span>
                    ) : isChecked ? (
                      <span className="pointer-badge badge-low" style={{ opacity: 0.85 }}>
                        Checked
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
                Current Index:{" "}
                <strong>
                  {currentStep.currentIndex !== null ? currentStep.currentIndex : "—"}
                </strong>
              </span>
              <span>
                Inspected Value:{" "}
                <strong>
                  {currentStep.comparedValue !== null ? currentStep.comparedValue : "—"}
                </strong>
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
                      <strong>{currentStep.foundIndex}</strong> after{" "}
                      <strong>{currentStep.foundIndex + 1}</strong> comparison(s).
                    </p>
                  </>
                ) : (
                  <>
                    <strong>Target Not Found</strong>
                    <p>
                      Element <strong>{target}</strong> does not exist in this array. Checked all{" "}
                      <strong>{numbers.length}</strong> elements sequentially without a match. Returned <code>-1</code>.
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

export default LinearSearchVisualizer;
