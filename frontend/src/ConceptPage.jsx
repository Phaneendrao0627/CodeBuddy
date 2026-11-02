import { useEffect, useState } from "react";
import Visualizer from "./Visualizer";
import BinarySearchPractice from "./BinarySearchPractice";
import { binarySearchContent } from "./algorithms/binarySearchData";

function ConceptPage({ topic, onBack }) {
  const isCurated = topic === "Binary Search";

  const [backendData, setBackendData] = useState(null);
  const [backendLoading, setBackendLoading] = useState(true);
  const [backendError, setBackendError] = useState("");
  const [mode, setMode] = useState("learn");

  const data = isCurated ? binarySearchContent : backendData;
  const loading = isCurated ? false : backendLoading;
  const error = isCurated ? "" : backendError;

  useEffect(() => {
    if (!topic || topic === "Binary Search") return;

    let cancelled = false;

    async function fetchConcept() {
      try {
        setBackendLoading(true);
        setBackendError("");

        const response = await fetch("http://127.0.0.1:5001/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_id: `concept-${topic}`,
            question: `Teach me ${topic}`,
            topic: topic,
            level: "beginner",
            mode: "learn",
            language: "java",
          }),
        });

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        const result = await response.json();

        let answer = result.answer;

        if (typeof answer === "string") {
          try {
            answer = JSON.parse(answer);
          } catch {
            // Keep plain text
          }
        }

        if (!cancelled) {
          setBackendData(answer);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setBackendError(err.message || "Could not connect to backend.");
        }
      } finally {
        if (!cancelled) {
          setBackendLoading(false);
        }
      }
    }

    fetchConcept();

    return () => {
      cancelled = true;
    };
  }, [topic]);

  return (
    <div className="concept-page">

      <header className="header">

        <button className="back-button" onClick={onBack}>
          ← Back
        </button>

        <div>
          <div className="logo">CodeBuddy</div>
          <div className="tagline">
            AI-powered DSA learning
          </div>
        </div>

      </header>

      <main className="concept-container">

        <div className="breadcrumb">
          DSA CONCEPT
        </div>

        <div className="concept-header">

          <h1>{topic}</h1>

          <p className="subtitle">
            Learn {topic} step-by-step with CodeBuddy AI.
          </p>

        </div>

        {/* TABS */}

        <div className="tabs">

          <button
            className={`tab ${mode === "learn" ? "active" : ""}`}
            onClick={() => setMode("learn")}
          >
            Learn
          </button>

          <button
            className={`tab ${mode === "visualize" ? "active" : ""}`}
            onClick={() => setMode("visualize")}
          >
            Visualize
          </button>

          <button
            className={`tab ${mode === "practice" ? "active" : ""}`}
            onClick={() => setMode("practice")}
          >
            Practice
          </button>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="card loading-card">
            <h2>🧠 CodeBuddy is thinking...</h2>

            <p>
              Preparing a beginner-friendly explanation of {topic}.
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="card error-card">

            <h2>⚠️ Something went wrong</h2>

            <p>{error}</p>

            <button
              className="retry-button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>

          </div>
        )}

        {/* LEARN */}

        {!loading &&
          !error &&
          mode === "learn" &&
          data &&
          typeof data === "object" && (

            <div className="concept-content">

              {data.concept && (
                <section className="card">
                  <h2>🧠 Concept</h2>
                  <p>{data.concept}</p>
                </section>
              )}

              {data.intuition && (
                <section className="card">
                  <h2>💡 Intuition</h2>
                  <p>{data.intuition}</p>
                </section>
              )}

              {data.real_world_example && (
                <section className="card">
                  <h2>🌍 Real-World Example</h2>
                  <p>{data.real_world_example}</p>
                </section>
              )}

              {data.visualization && (
                <section className="card">
                  <h2>📊 Visualization</h2>

                  <p className="pre-text">
                    {data.visualization}
                  </p>
                </section>
              )}

              {Array.isArray(data.algorithm) && (
                <section className="card">
                  <h2>⚙️ Algorithm</h2>

                  <ol>
                    {data.algorithm.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </section>
              )}

              {data.pseudocode && (
                <section className="card">
                  <h2>📝 Pseudocode</h2>

                  <pre className="code-block">
                    <code>{data.pseudocode}</code>
                  </pre>
                </section>
              )}

              {data.code && (
                <section className="card">
                  <h2>💻 Java Code</h2>

                  <pre className="code-block">
                    <code>{data.code}</code>
                  </pre>
                </section>
              )}

              {data.code_explanation && (
                <section className="card">
                  <h2>🔍 Code Explanation</h2>

                  <p className="pre-text">
                    {data.code_explanation}
                  </p>
                </section>
              )}

              {data.complexity && (
                <section className="card">

                  <h2>⏱️ Complexity</h2>

                  <div className="complexity-grid">

                    <div className="complexity-item">
                      <span>Best Case</span>
                      <strong>
                        {data.complexity.best}
                      </strong>
                    </div>

                    <div className="complexity-item">
                      <span>Average Case</span>
                      <strong>
                        {data.complexity.average}
                      </strong>
                    </div>

                    <div className="complexity-item">
                      <span>Worst Case</span>
                      <strong>
                        {data.complexity.worst}
                      </strong>
                    </div>

                    <div className="complexity-item">
                      <span>Space</span>
                      <strong>
                        {data.complexity.space}
                      </strong>
                    </div>

                  </div>

                </section>
              )}

              {Array.isArray(data.common_mistakes) && (
                <section className="card">

                  <h2>⚠️ Common Mistakes</h2>

                  <ul>
                    {data.common_mistakes.map((mistake, index) => (
                      <li key={index}>{mistake}</li>
                    ))}
                  </ul>

                </section>
              )}

              {data.practice && (
                <section className="card practice-card">

                  <h2>🧩 Practice</h2>

                  <p>{data.practice}</p>

                  <button
                    className="practice-button"
                    onClick={() => setMode("practice")}
                  >
                    Start Practice →
                  </button>

                </section>
              )}

            </div>
          )}

        {/* PLAIN TEXT */}

        {!loading &&
          !error &&
          mode === "learn" &&
          typeof data === "string" && (

            <section className="card">
              <h2>🤖 CodeBuddy</h2>

              <div className="pre-text">
                {data}
              </div>
            </section>
          )}

        {/* VISUALIZER */}

        {!loading &&
          !error &&
          mode === "visualize" && (

            <Visualizer topic={topic} />

          )}

        {/* PRACTICE */}

        {!loading &&
          !error &&
          mode === "practice" &&
          (topic === "Binary Search" ? (
            <BinarySearchPractice />
          ) : (
            <section className="card practice-card">
              <h2>🧩 Practice: {topic}</h2>

              <p>
                Interactive practice modules for <strong>{topic}</strong> are currently under development.
              </p>

              <div className="practice-available-box">
                <span className="available-label">Active Practice Modules:</span>
                <p>
                  Switch to <strong>Binary Search</strong> from the sidebar to try our full interactive Practice Studio!
                </p>
              </div>
            </section>
          ))}

      </main>

    </div>
  );
}

export default ConceptPage;