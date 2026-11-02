import BinarySearchVisualizer from "./BinarySearchVisualizer";
import BubbleSortVisualizer from "./BubbleSortVisualizer";

function Visualizer({ topic }) {
  if (topic === "Binary Search") {
    return <BinarySearchVisualizer />;
  }

  if (topic === "Bubble Sort") {
    return <BubbleSortVisualizer />;
  }

  return (
    <div className="card visualizer-placeholder-card">
      <div className="placeholder-icon">📊</div>
      <h2>{topic} Visualizer Coming Soon</h2>
      <p>
        An interactive step-by-step visualizer for <strong>{topic}</strong> is currently being developed.
      </p>

      <div className="placeholder-supported-box">
        <span className="supported-title">Available Interactive Visualizers:</span>
        <div className="supported-badges">
          <span className="algo-badge active">
            🔍 Binary Search (Dynamic Inputs &amp; Step Tracing)
          </span>
          <span className="algo-badge">
            ↕️ Bubble Sort (Step Stepper)
          </span>
        </div>
      </div>
    </div>
  );
}

export default Visualizer;