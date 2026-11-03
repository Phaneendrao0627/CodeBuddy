import BinarySearchVisualizer from "./BinarySearchVisualizer";
import BubbleSortVisualizer from "./BubbleSortVisualizer";
import InsertionSortVisualizer from "./InsertionSortVisualizer";
import JumpSearchVisualizer from "./JumpSearchVisualizer";
import LinearSearchVisualizer from "./LinearSearchVisualizer";
import SelectionSortVisualizer from "./SelectionSortVisualizer";

function Visualizer({ topic }) {
  if (topic === "Linear Search") {
    return <LinearSearchVisualizer />;
  }

  if (topic === "Binary Search") {
    return <BinarySearchVisualizer />;
  }

  if (topic === "Jump Search") {
    return <JumpSearchVisualizer />;
  }

  if (topic === "Bubble Sort") {
    return <BubbleSortVisualizer />;
  }

  if (topic === "Insertion Sort") {
    return <InsertionSortVisualizer />;
  }

  if (topic === "Selection Sort") {
    return <SelectionSortVisualizer />;
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
            🔍 Linear Search (Sequential Scan &amp; Tracing)
          </span>
          <span className="algo-badge active">
            🔍 Binary Search (Dynamic Inputs &amp; Step Tracing)
          </span>
          <span className="algo-badge active">
            🐇 Jump Search (Block Jumping &amp; Linear Scan)
          </span>
          <span className="algo-badge active">
            🃏 Insertion Sort (Passes, Shifting &amp; Key Insertion)
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