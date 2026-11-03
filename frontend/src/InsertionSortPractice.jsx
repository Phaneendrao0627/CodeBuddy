import { useEffect, useState } from "react";
import { INSERTION_SORT_QUESTIONS } from "./algorithms/insertionSortPracticeData";
import {
  calculateInsertionSortProgress,
  evaluateInsertionSortAnswer
} from "./algorithms/insertionSortPractice";

const STORAGE_KEY_STATS = "codebuddy_insertion_sort_practice_stats";
const STORAGE_KEY_INDEX = "codebuddy_insertion_sort_practice_idx";

function loadSavedStats() {
  try {
    const raw = typeof window !== "undefined" ? window.sessionStorage.getItem(STORAGE_KEY_STATS) : null;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadSavedIndex() {
  try {
    const raw = typeof window !== "undefined" ? window.sessionStorage.getItem(STORAGE_KEY_INDEX) : null;
    const parsed = parseInt(raw, 10);
    return !isNaN(parsed) && parsed >= 0 && parsed < INSERTION_SORT_QUESTIONS.length ? parsed : 0;
  } catch {
    return 0;
  }
}

function InsertionSortPractice() {
  const totalQuestions = INSERTION_SORT_QUESTIONS.length;

  const [questionStats, setQuestionStats] = useState(loadSavedStats);
  const [currentIndex, setCurrentIndex] = useState(loadSavedIndex);

  const [userAnswer, setUserAnswer] = useState(() => {
    const savedStats = loadSavedStats();
    const saved = savedStats[INSERTION_SORT_QUESTIONS[loadSavedIndex()]?.id];
    return saved?.savedAnswer ?? "";
  });
  const [submitted, setSubmitted] = useState(() => {
    const savedStats = loadSavedStats();
    const saved = savedStats[INSERTION_SORT_QUESTIONS[loadSavedIndex()]?.id];
    return Boolean(saved?.attempted);
  });
  const [evaluation, setEvaluation] = useState(() => {
    const savedStats = loadSavedStats();
    const saved = savedStats[INSERTION_SORT_QUESTIONS[loadSavedIndex()]?.id];
    return saved?.evaluation ?? null;
  });
  const [showHint, setShowHint] = useState(false);

  // Persist question stats to sessionStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(questionStats));
      }
    } catch {
      // ignore
    }
  }, [questionStats]);

  // Persist current question index
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(STORAGE_KEY_INDEX, String(currentIndex));
      }
    } catch {
      // ignore
    }
  }, [currentIndex]);

  function handleSelectQuestion(index) {
    setCurrentIndex(index);
    const targetQ = INSERTION_SORT_QUESTIONS[index];
    const saved = questionStats[targetQ?.id];
    setShowHint(false);
    if (saved) {
      setUserAnswer(saved.savedAnswer ?? "");
      setSubmitted(Boolean(saved.attempted));
      setEvaluation(saved.evaluation ?? null);
    } else {
      setUserAnswer("");
      setSubmitted(false);
      setEvaluation(null);
    }
  }

  function handleSubmit() {
    const result = evaluateInsertionSortAnswer(currentQuestion, userAnswer);
    setEvaluation(result);
    setSubmitted(true);

    setQuestionStats((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        attempted: true,
        answeredCorrectly: result.isCorrect,
        savedAnswer: userAnswer,
        evaluation: result
      }
    }));
  }

  function handleTryAgain() {
    setUserAnswer("");
    setSubmitted(false);
    setEvaluation(null);

    setQuestionStats((prev) => {
      const updated = { ...prev };
      delete updated[currentQuestion.id];
      return updated;
    });
  }

  function handleNextQuestion() {
    if (currentIndex < totalQuestions - 1) {
      handleSelectQuestion(currentIndex + 1);
    }
  }

  function handlePrevQuestion() {
    if (currentIndex > 0) {
      handleSelectQuestion(currentIndex - 1);
    }
  }

  function handleResetPractice() {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(STORAGE_KEY_STATS);
        window.sessionStorage.removeItem(STORAGE_KEY_INDEX);
      }
    } catch {
      // ignore
    }
    setQuestionStats({});
    setCurrentIndex(0);
    setUserAnswer("");
    setSubmitted(false);
    setEvaluation(null);
    setShowHint(false);
  }

  const progress = calculateInsertionSortProgress(questionStats, totalQuestions);

  return (
    <div className="practice-container">
      {/* PRACTICE STUDIO HEADER */}
      <div className="practice-header-card">
        <div className="practice-header-top">
          <div>
            <h2>🧩 Insertion Sort Practice Studio</h2>
            <p className="practice-subtitle">
              Test your understanding of key selection, element shifting, pass configurations, best/worst cases, and stability.
            </p>
          </div>

          <div className="practice-score-badge">
            <span className="score-label">SCORE</span>
            <span className="score-numbers">
              {progress.correctCount} / {progress.attemptedCount}
            </span>
            <span className="score-percent">({progress.percentage}%)</span>
          </div>
        </div>

        {/* QUESTION NAVIGATOR PILLS */}
        <div className="question-nav-row">
          <div className="question-pills">
            {INSERTION_SORT_QUESTIONS.map((q, idx) => {
              const stat = questionStats[q.id];
              let statusClass = "unattempted";
              if (stat?.attempted) {
                statusClass = stat.answeredCorrectly ? "correct" : "incorrect";
              }
              const isActive = idx === currentIndex;

              return (
                <button
                  key={q.id}
                  type="button"
                  className={`q-pill ${statusClass} ${isActive ? "active" : ""}`}
                  onClick={() => handleSelectQuestion(idx)}
                  title={`Question ${idx + 1}: ${q.title}`}
                >
                  <span className="pill-num">{idx + 1}</span>
                  {stat?.attempted && (
                    <span className="pill-status-dot">
                      {stat.answeredCorrectly ? "✓" : "✗"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="practice-header-actions">
            <button
              type="button"
              className="reset-practice-btn"
              onClick={handleResetPractice}
              title="Reset all practice answers"
            >
              ↻ Reset Progress
            </button>
          </div>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="practice-question-card">
        <div className="q-card-header">
          <div className="q-meta-badges">
            <span className="q-badge">Question {currentIndex + 1} of {totalQuestions}</span>
            <span className={`difficulty-badge ${currentQuestion.difficulty.toLowerCase()}`}>
              {currentQuestion.difficulty}
            </span>
          </div>
          <h3>{currentQuestion.title}</h3>
          <p className="q-prompt-text">{currentQuestion.question}</p>
        </div>

        {/* VISUAL ARRAY CONTEXT (IF PRESENT) */}
        {Array.isArray(currentQuestion.array) && (
          <div className="practice-array-wrapper">
            <div className="practice-context-bar">
              <span>Array Elements (Length {currentQuestion.array.length})</span>
            </div>

            <div className="practice-array-track">
              {currentQuestion.array.map((val, idx) => (
                <div key={idx} className="practice-array-node">
                  <div className="node-badge-slot">
                    <span className="tag-spacer">&nbsp;</span>
                  </div>

                  <div className="practice-cell">
                    {val}
                  </div>

                  <span className="node-index">[{idx}]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTERACTIVE SOLVING AREA */}
        <div className="solving-area">
          {currentQuestion.inputType === "multiple_choice" ? (
            <div className="options-grid">
              {currentQuestion.options.map((opt) => {
                const isSelected = userAnswer === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`option-card ${isSelected ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`q-${currentQuestion.id}`}
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => setUserAnswer(opt.id)}
                      disabled={submitted && evaluation?.isCorrect}
                    />
                    <span className="opt-marker">{opt.id}</span>
                    <span className="opt-text">{opt.text}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="numeric-input-wrap">
              <input
                type="text"
                className="practice-text-input"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={currentQuestion.placeholder || "Enter your answer"}
                disabled={submitted && evaluation?.isCorrect}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (!submitted || !evaluation?.isCorrect)) {
                    handleSubmit();
                  }
                }}
              />
            </div>
          )}

          {/* ACTIONS: SUBMIT & HINT */}
          <div className="solving-actions">
            <button
              type="button"
              className="submit-answer-btn"
              onClick={handleSubmit}
              disabled={submitted && evaluation?.isCorrect}
            >
              Submit Answer
            </button>

            <button
              type="button"
              className="toggle-hint-btn"
              onClick={() => setShowHint(!showHint)}
            >
              {showHint ? "🙈 Hide Hint" : "💡 Need a Hint?"}
            </button>
          </div>

          {/* HINT DRAWER */}
          {showHint && (
            <div className="hint-drawer">
              <span className="hint-icon">💡</span>
              <p className="hint-text">{currentQuestion.hint}</p>
            </div>
          )}
        </div>

        {/* FEEDBACK BANNER */}
        {evaluation && (
          <div className={`feedback-card ${evaluation.isCorrect ? "success" : "error"}`}>
            <div className="feedback-top">
              <span className="fb-icon">{evaluation.isCorrect ? "🎉" : "⚠️"}</span>
              <strong>{evaluation.feedback}</strong>
            </div>

            <p className="fb-explanation">{evaluation.explanation}</p>

            {!evaluation.isCorrect && (
              <div className="fb-correct-reveal">
                Correct Answer: <strong>{evaluation.correctAnswerDisplay}</strong>
              </div>
            )}

            <div className="fb-actions">
              {!evaluation.isCorrect && (
                <button
                  type="button"
                  className="try-again-btn"
                  onClick={handleTryAgain}
                >
                  🔄 Try Again
                </button>
              )}

              {currentIndex < totalQuestions - 1 && (
                <button
                  type="button"
                  className="next-q-btn"
                  onClick={handleNextQuestion}
                >
                  Next Question →
                </button>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM QUESTION PAGINATION */}
        <div className="q-card-footer">
          <button
            type="button"
            className="prev-q-btn"
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
          >
            ← Previous Question
          </button>

          <span className="footer-q-info">
            Question {currentIndex + 1} of {totalQuestions}
          </span>

          <button
            type="button"
            className="next-q-btn"
            onClick={handleNextQuestion}
            disabled={currentIndex >= totalQuestions - 1}
          >
            Next Question →
          </button>
        </div>
      </div>
    </div>
  );
}

export default InsertionSortPractice;
