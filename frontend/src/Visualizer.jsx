import { useEffect, useState } from "react";

function Visualizer({ topic }) {
  const [array, setArray] = useState([5, 3, 8, 4, 2]);
  const [active, setActive] = useState([]);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);

  const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function startVisualization() {
    if (running) return;

    setRunning(true);
    setStep(0);

    let arr = [5, 3, 8, 4, 2];

    setArray([...arr]);
    await sleep(700);

    let currentStep = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setActive([j, j + 1]);
        await sleep(600);

        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;

          setArray([...arr]);
          await sleep(600);
        }

        currentStep++;
        setStep(currentStep);
      }
    }

    setActive([]);
    setArray([...arr]);
    setRunning(false);
  }

  function reset() {
    setArray([5, 3, 8, 4, 2]);
    setActive([]);
    setStep(0);
    setRunning(false);
  }

  return (
    <div className="visualizer">

      <div className="visualizer-header">
        <div>
          <h2>📊 {topic} Visualizer</h2>
          <p>
            Watch the algorithm work step-by-step.
          </p>
        </div>
      </div>

      <div className="array-container">

        {array.map((value, index) => (
          <div
            className={`array-item ${
              active.includes(index) ? "active" : ""
            }`}
            key={index}
          >
            <div
              className="array-bar"
              style={{
                height: `${value * 25}px`,
              }}
            >
              {value}
            </div>

            <span>[{index}]</span>
          </div>
        ))}

      </div>

      <div className="visualizer-info">
        <span>
          Step: <strong>{step}</strong>
        </span>

        <span>
          {running
            ? "Comparing elements..."
            : "Ready to visualize"}
        </span>
      </div>

      <div className="visualizer-controls">

        <button
          className="visualizer-button"
          onClick={startVisualization}
          disabled={running}
        >
          {running ? "Running..." : "▶ Start Visualization"}
        </button>

        <button
          className="reset-button"
          onClick={reset}
        >
          ↻ Reset
        </button>

      </div>

    </div>
  );
}

export default Visualizer;