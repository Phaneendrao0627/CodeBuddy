import { useEffect, useState } from "react";

const STAGES = [
  { id: 1, text: "Preparing your learning environment", icon: "🛠️" },
  { id: 2, text: "Loading algorithm concepts", icon: "🧠" },
  { id: 3, text: "Building your example walkthrough", icon: "📊" },
  { id: 4, text: "Preparing the visualization", icon: "✨" },
  { id: 5, text: "Setting up practice studio", icon: "🧩" }
];

const TOTAL_DURATION_MS = 5000;
const TICK_INTERVAL_MS = 50;

function AlgorithmEntryAnimation({ algorithmName, onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Respect reduced-motion accessibility settings
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      onComplete?.();
      return;
    }

    const stepIncrement = (TICK_INTERVAL_MS / TOTAL_DURATION_MS) * 100;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete?.();
          }, 150);
          return 100;
        }
        return next;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Determine current active stage index (0 to 4)
  const activeStageIndex = Math.min(
    STAGES.length - 1,
    Math.floor((progress / 100) * STAGES.length)
  );
  const currentStage = STAGES[activeStageIndex];

  return (
    <div
      className="entry-animation-overlay"
      role="status"
      aria-live="polite"
      aria-label={`Preparing ${algorithmName}`}
    >
      <div className="entry-animation-card">
        {/* TOP BRANDING / BADGE */}
        <div className="entry-brand-badge">
          <span className="brand-dot" />
          <span className="brand-name">CodeBuddy DSA Studio</span>
        </div>

        {/* ALGORITHM TITLE */}
        <h2 className="entry-algo-title">{algorithmName}</h2>
        <p className="entry-algo-subtitle">
          Preparing an interactive, multilingual learning experience.
        </p>

        {/* PROGRESS BAR */}
        <div className="entry-progress-wrap">
          <div className="entry-progress-track">
            <div
              className="entry-progress-fill"
              style={{ width: `${Math.min(100, Math.round(progress))}%` }}
            />
          </div>
          <div className="entry-progress-labels">
            <span className="stage-description">
              <span className="stage-icon">{currentStage.icon}</span>
              <strong>{currentStage.text}</strong>
            </span>
            <span className="progress-percent">
              {Math.min(100, Math.round(progress))}%
            </span>
          </div>
        </div>

        {/* STAGES LIST */}
        <div className="entry-stages-list">
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < activeStageIndex;
            const isCurrent = idx === activeStageIndex;
            let statusClass = "pending";
            if (isCompleted) statusClass = "completed";
            else if (isCurrent) statusClass = "current";

            return (
              <div key={stage.id} className={`stage-step-row ${statusClass}`}>
                <span className="step-circle">
                  {isCompleted ? "✓" : isCurrent ? "●" : idx + 1}
                </span>
                <span className="step-name">{stage.text}</span>
              </div>
            );
          })}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="entry-footer">
          <button
            type="button"
            className="entry-skip-btn"
            onClick={() => onComplete?.()}
          >
            Skip Preparation →
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlgorithmEntryAnimation;
