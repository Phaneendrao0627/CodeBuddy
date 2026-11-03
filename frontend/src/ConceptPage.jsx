import { useEffect, useState } from "react";
import Visualizer from "./Visualizer";
import BinarySearchPractice from "./BinarySearchPractice";
import LinearSearchPractice from "./LinearSearchPractice";
import JumpSearchPractice from "./JumpSearchPractice";
import InsertionSortPractice from "./InsertionSortPractice";
import LanguageSelector from "./components/LanguageSelector";
import { binarySearchContent } from "./algorithms/binarySearchData";
import { linearSearchContent } from "./algorithms/linearSearchData";
import { jumpSearchContent } from "./algorithms/jumpSearchData";
import { bubbleSortContent } from "./algorithms/bubbleSortData";
import { insertionSortContent } from "./algorithms/insertionSortData";
import {
  LANGUAGE_LABELS,
  useLanguagePreference
} from "./utils/languagePreferences";

const CURATED_TOPICS = {
  "Binary Search": binarySearchContent,
  "Linear Search": linearSearchContent,
  "Jump Search": jumpSearchContent,
  "Bubble Sort": bubbleSortContent,
  "Insertion Sort": insertionSortContent,
};

function ConceptPage({ topic, onBack }) {
  const isCurated = Boolean(CURATED_TOPICS[topic]);
  const [language, setLanguage] = useLanguagePreference();

  const [backendData, setBackendData] = useState(null);
  const [backendLoading, setBackendLoading] = useState(true);
  const [backendError, setBackendError] = useState("");
  const [mode, setMode] = useState("learn");

  const data = isCurated ? CURATED_TOPICS[topic] : backendData;
  const loading = isCurated ? false : backendLoading;
  const error = isCurated ? "" : backendError;

  useEffect(() => {
    if (!topic || isCurated) return;

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
            language: language,
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
  }, [topic, isCurated, language]);

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

              {data.prerequisites && (
                <section className="card">
                  <h2>📋 Prerequisites</h2>
                  <p>{data.prerequisites}</p>
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

              {data && (data.implementations?.[language]?.code || data.code) && (
                <section className="card">
                  <div className="code-header-row">
                    <h2>💻 {LANGUAGE_LABELS[language] || "Language"} Code</h2>
                    <LanguageSelector
                      language={language}
                      onSelectLanguage={setLanguage}
                      size="small"
                    />
                  </div>

                  <pre className="code-block">
                    <code>{data.implementations?.[language]?.code || data.code}</code>
                  </pre>
                </section>
              )}

              {data && (data.implementations?.[language]?.code_explanation || data.code_explanation) && (
                <section className="card">
                  <h2>🔍 {LANGUAGE_LABELS[language] || "Language"} Code Explanation</h2>

                  <p className="pre-text">
                    {data.implementations?.[language]?.code_explanation || data.code_explanation}
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

              {Array.isArray(data.advantages) && (
                <section className="card">
                  <h2>⚖️ Advantages &amp; Disadvantages</h2>
                  <ul>
                    {data.advantages.map((adv, index) => (
                      <li key={`adv-${index}`}><strong>Advantage:</strong> {adv}</li>
                    ))}
                    {Array.isArray(data.disadvantages) &&
                      data.disadvantages.map((dis, index) => (
                        <li key={`dis-${index}`}><strong>Disadvantage:</strong> {dis}</li>
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
          ) : topic === "Linear Search" ? (
            <LinearSearchPractice />
          ) : topic === "Jump Search" ? (
            <JumpSearchPractice />
          ) : topic === "Insertion Sort" ? (
            <InsertionSortPractice />
          ) : (
            <section className="card practice-card">
              <h2>🧩 Practice: {topic}</h2>

              <p>
                Interactive practice modules for <strong>{topic}</strong> are currently under development.
              </p>

              <div className="practice-available-box">
                <span className="available-label">Active Practice Modules:</span>
                <p>
                  Try <strong>Binary Search</strong>, <strong>Linear Search</strong>, <strong>Jump Search</strong>, or <strong>Insertion Sort</strong> from the sidebar to use our full interactive Practice Studio!
                </p>
              </div>
            </section>
          ))}

      </main>

    </div>
  );
}

export default ConceptPage;