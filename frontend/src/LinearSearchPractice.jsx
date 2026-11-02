import { useEffect, useState } from "react";
import {
  calculateLinearSearchProgress,
  evaluateLinearSearchAnswer
} from "./algorithms/linearSearchPractice";
import { LINEAR_SEARCH_QUESTIONS } from "./algorithms/linearSearchPracticeData";

const STORAGE_KEY_STATS = "codebuddy_linear_search_practice_stats";
const STORAGE_KEY_INDEX = "codebuddy_linear_search_practice_index";

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
    return !isNaN(parsed) && parsed >= 0 && parsed < LINEAR_SEARCH_QUESTIONS.length ? parsed : 0;
  } catch {
    return 0;
  }
}

function LinearSearchPractice() {
  const [questionStats, setQuestionStats] = useState(loadSavedStats);
  const [currentIndex, setCurrentIndex] = useState(loadSavedIndex);

  const [userAnswer, setUserAnswer] = useState(() => {
    const savedStats = loadSavedStats();
    const saved = savedStats[LINEAR_SEARCH_QUESTIONS[loadSavedIndex()]?.id];
    return saved?.savedAnswer ?? "";
  });
  const [submitted, setSubmitted] = useState(() => {
    const savedStats = loadSavedStats();
    const saved = savedStats[LINEAR_SEARCH_QUESTIONS[loadSavedIndex()]?.id];
    return Boolean(saved?.attempted);
  });
  const [evaluation, setEvaluation] = useState(() => {
    const savedStats = loadSavedStats();
    const saved = savedStats[LINEAR_SEARCH_QUESTIONS[loadSavedIndex()]?.id];
    return saved?.evaluation ?? null;
  });
  const [showHint, setShowHint] = useState(false);

  // Sync state to sessionStorage for progress preservation across tab switches
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(questionStats));
      }
    } catch {
      // ignore
    }
  }, [questionStats]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(STORAGE_KEY_INDEX, String(currentIndex));
      }
    } catch {
      // ignore
    }
  }, [currentIndex]);

  const totalQuestions = LINEAR_SEARCH_QUESTIONS.length;
  const currentQuestion = LINEAR_SEARCH_QUESTIONS[currentIndex];

  const progress = calculateLinearSearchProgress(questionStats, totalQuestions);

  function handleSelectQuestion(index) {
    setCurrentIndex(index);
    const targetQ = LINEAR_SEARCH_QUESTIONS[index];
    const saved = questionStats[targetQ.id];

    if (saved && saved.attempted) {
      setUserAnswer(saved.savedAnswer || "");
      setSubmitted(true);
      setEvaluation(saved.evaluation || null);
    } else {
      setUserAnswer("");
      setSubmitted(false);
      setEvaluation(null);
    }
    setShowHint(false);
  }

  function handleSubmitAnswer(e) {
    if (e) e.preventDefault();
    if (!userAnswer && userAnswer !== 0) return;

    const result = evaluateLinearSearchAnswer(currentQuestion, userAnswer);
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
    setCurrentIndex(0);
    setUserAnswer("");
    setSubmitted(false);
    setEvaluation(null);
    setShowHint(false);
    setQuestionStats({});
  }

  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isAnswered = submitted && evaluation;
  const isCurrentCorrect = isAnswered && evaluation.isCorrect;

  return (
    <div className="practice-studio">
      {/* HEADER / PROGRESS BAR */}
      <div className="practice-header-card">
        <div className="practice-title-row">
          <div>
            <h2>🧩 Linear Search Practice Studio</h2>
            <p>
              Master sequential scanning, index tracking, comparison counts, duplicates, and edge cases.
            </p>
          </div>

          <div className="practice-score-badge">
            <span className="score-label">Score</span>
            <span className="score-value">
              {progress.correctCount} / {progress.attemptedCount}{" "}
              <small>({progress.percentage}%)</small>
            </span>
          </div>
        </div>

        {/* PROGRESS BAR & QUESTION NAV */}
        <div className="practice-nav-container">
          <div className="practice-pills">
            {LINEAR_SEARCH_QUESTIONS.map((q, idx) => {
              const stat = questionStats[q.id];
              let pillClass = "nav-pill";
              if (idx === currentIndex) pillClass += " current";
              if (stat?.attempted) {
                pillClass += stat.answeredCorrectly ? " correct" : " incorrect";
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  className={pillClass}
                  onClick={() => handleSelectQuestion(idx)}
                  title={q.title}
                >
                  <span className="pill-num">{idx + 1}</span>
                  {stat?.attempted && (
                    <span className="pill-status">
                      {stat.answeredCorrectly ? "✓" : "✗"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="practice-reset-btn"
            onClick={handleResetPractice}
            title="Clear all attempts and start over"
          >
            ↻ Reset Practice
          </button>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="practice-question-card">
        <div className="question-header">
          <div className="question-meta">
            <span className="question-number">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span
              className={`difficulty-badge ${
                currentQuestion.difficulty === "Intermediate"
                  ? "diff-intermediate"
                  : "diff-beginner"
              }`}
            >
              {currentQuestion.difficulty}
            </span>
          </div>

          <h3 className="question-title">{currentQuestion.title}</h3>
          <p className="question-text">{currentQuestion.question}</p>
        </div>

        {/* VISUAL ARRAY CONTEXT (IF PRESENT) */}
        {Array.isArray(currentQuestion.array) && (
          <div className="practice-array-wrapper">
            <div className="practice-context-bar">
              <span>
                Array Elements (Length {currentQuestion.array.length})
              </span>
              {currentQuestion.target !== undefined && (
                <span className="target-pill">
                  Target: <strong>{currentQuestion.target}</strong>
                </span>
              )}
            </div>

            <div className="practice-array-track">
              {currentQuestion.array.map((val, idx) => {
                const isCurrent = currentQuestion.activePointers?.current === idx;
                const isTargetMatch = currentQuestion.target === val;

                return (
                  <div key={idx} className="practice-array-node">
                    <div className="node-badge-slot">
                      {isCurrent ? (
                        <span className="practice-pointer-tag tag-mid">
                          i = {idx}
                        </span>
                      ) : (
                        <span className="tag-spacer">&nbsp;</span>
                      )}
                    </div>

                    <div
                      className={`practice-cell ${
                        isCurrent ? "cell-mid" : isTargetMatch ? "cell-target" : ""
                      }`}
                    >
                      {val}
                    </div>

                    <span className="practice-index">[{idx}]</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* INTERACTIVE ANSWER INPUT FORM */}
        <form onSubmit={handleSubmitAnswer} className="practice-input-form">
          {currentQuestion.inputType === "multiple_choice" ? (
            <div className="practice-options-grid">
              {currentQuestion.options.map((opt) => (
                <label
                  key={opt.id}
                  className={`option-card ${
                    userAnswer === opt.id ? "selected" : ""
                  } ${
                    submitted && opt.id === currentQuestion.correctAnswer
                      ? "option-correct"
                      : ""
                  } ${
                    submitted &&
                    userAnswer === opt.id &&
                    userAnswer !== currentQuestion.correctAnswer
                      ? "option-wrong"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={`linear-question-${currentQuestion.id}`}
                    value={opt.id}
                    checked={userAnswer === opt.id}
                    onChange={() => {
                      if (!submitted) {
                        setUserAnswer(opt.id);
                      }
                    }}
                    disabled={submitted}
                  />
                  <span className="opt-letter">{opt.id}</span>
                  <span className="opt-text">{opt.text}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="practice-numeric-group">
              <label htmlFor="linear-user-numeric-answer">Your Answer:</label>
              <div className="numeric-input-row">
                <input
                  id="linear-user-numeric-answer"
                  type="number"
                  value={userAnswer}
                  onChange={(e) => {
                    if (!submitted) {
                      setUserAnswer(e.target.value);
                    }
                  }}
                  disabled={submitted}
                  placeholder={currentQuestion.placeholder || "Enter number"}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* ACTION BUTTONS (SUBMIT & HINT) */}
          <div className="practice-actions-row">
            {!submitted ? (
              <button
                type="submit"
                className="practice-submit-button"
                disabled={userAnswer === "" || userAnswer === null}
              >
                Submit Answer
              </button>
            ) : (
              <div className="post-submit-controls">
                {!isCurrentCorrect && (
                  <button
                    type="button"
                    className="practice-retry-button"
                    onClick={handleTryAgain}
                  >
                    🔄 Try Again
                  </button>
                )}

                {!isLastQuestion ? (
                  <button
                    type="button"
                    className="practice-next-button"
                    onClick={handleNextQuestion}
                  >
                    Next Question ▶
                  </button>
                ) : (
                  <button
                    type="button"
                    className="practice-next-button finish-btn"
                    onClick={() => handleSelectQuestion(0)}
                  >
                    Review From Beginning ↺
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              className="practice-hint-toggle"
              onClick={() => setShowHint((prev) => !prev)}
            >
              {showHint ? "Hide Hint" : "💡 Need a Hint?"}
            </button>
          </div>
        </form>

        {/* HINT ACCORDION */}
        {showHint && (
          <div className="practice-hint-box">
            <div className="hint-header">
              <span className="hint-icon">💡</span>
              <strong>Helpful Hint:</strong>
            </div>
            <p>{currentQuestion.hint}</p>
          </div>
        )}

        {/* FEEDBACK & EXPLANATION BANNER */}
        {submitted && evaluation && (
          <div
            className={`practice-feedback-banner ${
              evaluation.isCorrect ? "feedback-success" : "feedback-error"
            }`}
          >
            <div className="feedback-status-row">
              <span className="feedback-icon">
                {evaluation.isCorrect ? "🎉" : "❌"}
              </span>
              <strong className="feedback-title">
                {evaluation.feedback}
              </strong>
            </div>

            {!evaluation.isCorrect && (
              <div className="correct-answer-callout">
                <span>Correct Answer: </span>
                <strong>{evaluation.correctAnswerDisplay}</strong>
              </div>
            )}

            <div className="explanation-content">
              <strong>Why this is correct:</strong>
              <p className="explanation-text">{evaluation.explanation}</p>
            </div>
          </div>
        )}

        {/* PREV / NEXT QUESTION STEPPER */}
        <div className="practice-footer-stepper">
          <button
            type="button"
            className="stepper-btn"
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
          >
            ◀ Previous Question
          </button>

          <span className="footer-step-indicator">
            {currentIndex + 1} / {totalQuestions}
          </span>

          <button
            type="button"
            className="stepper-btn"
            onClick={handleNextQuestion}
            disabled={currentIndex === totalQuestions - 1}
          >
            Next Question ▶
          </button>
        </div>
      </div>
    </div>
  );
}

export default LinearSearchPractice;
