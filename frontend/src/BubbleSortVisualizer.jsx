import { useCallback, useEffect, useState } from "react";
import LanguageSelector from "./components/LanguageSelector";
import { bubbleSortContent } from "./algorithms/bubbleSortData";
import {
  LANGUAGE_LABELS,
  useLanguagePreference
} from "./utils/languagePreferences";

function BubbleSortVisualizer() {
  const [language, setLanguage] = useLanguagePreference();

  const originalArray = [5, 3, 8, 4, 2];

  const [array, setArray] = useState(originalArray);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [steps, setSteps] = useState(0);
  const [comparing, setComparing] = useState([]);
  const [sortedFrom, setSortedFrom] = useState(originalArray.length);
  const [finished, setFinished] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [lastSwapped, setLastSwapped] = useState(false);

  const nextStep = useCallback(() => {
    if (finished) return;

    const newArray = [...array];

    setComparing([j, j + 1]);
    setSteps((prev) => prev + 1);

    const didSwap = newArray[j] > newArray[j + 1];
    setLastSwapped(didSwap);

    if (didSwap) {
      const temp = newArray[j];
      newArray[j] = newArray[j + 1];
      newArray[j + 1] = temp;

      setArray(newArray);
    }

    if (j + 1 >= array.length - i - 1) {
      setSortedFrom(array.length - i - 1);
      setI((prev) => prev + 1);
      setJ(0);

      if (i >= array.length - 2) {
        setFinished(true);
        setPlaying(false);
        setComparing([]);
      }
    } else {
      setJ((prev) => prev + 1);
    }
  }, [array, finished, i, j]);

  useEffect(() => {
    if (!playing || finished) return;

    const timer = setTimeout(() => {
      nextStep();
    }, 900);

    return () => clearTimeout(timer);
  }, [playing, finished, nextStep]);

  function reset() {
    setArray(originalArray);
    setI(0);
    setJ(0);
    setSteps(0);
    setComparing([]);
    setSortedFrom(originalArray.length);
    setFinished(false);
    setPlaying(false);
    setLastSwapped(false);
  }

  const currentImpl =
    bubbleSortContent.implementations[language] ||
    bubbleSortContent.implementations.java;

  const activeCodeLine = currentImpl.mapStepToLine({
    comparing: comparing.length > 0,
    swapped: lastSwapped,
    finished
  });

  return (
    <div className="visualizer">
      <div className="visualizer-header">
        <div>
          <h2>📊 Bubble Sort Visualizer</h2>
          <p>
            Watch the algorithm compare and swap elements step-by-step.
          </p>
        </div>

        <div className="step-counter">Step {steps}</div>
      </div>

      <div className="array-container">
        {array.map((value, index) => {
          const isComparing = comparing.includes(index);
          const isSorted = index >= sortedFrom;

          return (
            <div
              className={`array-item
                ${isComparing ? "comparing" : ""}
                ${isSorted ? "sorted" : ""}
              `}
              key={index}
            >
              <div
                className="array-bar"
                style={{
                  height: `${value * 28 + 30}px`,
                }}
              >
                {value}
              </div>

              <span className="array-index">[{index}]</span>
            </div>
          );
        })}
      </div>

      <div className="visualizer-status">
        {finished ? (
          <strong>🎉 Array Sorted!</strong>
        ) : comparing.length === 2 ? (
          <span>
            🔍 Comparing <strong>{array[comparing[0]]}</strong> and{" "}
            <strong>{array[comparing[1]]}</strong>
          </span>
        ) : (
          <span>
            Press <strong>Next Step</strong> to begin.
          </span>
        )}
      </div>

      <div className="visualizer-controls">
        <button
          className="visualizer-button"
          onClick={nextStep}
          disabled={finished}
        >
          Next Step →
        </button>

        <button
          className="visualizer-button secondary"
          onClick={() => setPlaying((prev) => !prev)}
          disabled={finished}
        >
          {playing ? "⏸ Pause" : "▶ Auto Play"}
        </button>

        <button className="visualizer-button secondary" onClick={reset}>
          ↻ Reset
        </button>
      </div>

      {/* CODE SYNCHRONIZATION PANEL */}
      <div className="bs-code-card" style={{ marginTop: "24px" }}>
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
  );
}

export default BubbleSortVisualizer;