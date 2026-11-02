import { useEffect, useState } from "react";
import {
  calculateJumpSearchProgress,
  evaluateJumpSearchAnswer
} from "./algorithms/jumpSearchPractice";
import { JUMP_SEARCH_QUESTIONS } from "./algorithms/jumpSearchPracticeData";

const STORAGE_KEY_STATS = "codebuddy_jump_search_practice_stats";
const STORAGE_KEY_INDEX = "codebuddy_jump_search_practice_index";

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
    return !isNaN(parsed) && parsed >= 0 && parsed < JUMP_SEARCH_QUESTIONS.length ? parsed : 0;
  } catch {
    return 0;
  }
}

function JumpSearchPractice() {
  const [questionStats, setQuestionStats] = useState(loadSavedStats);
  const [currentIndex, setCurrentIndex] = useState(loadSavedIndex);

  const [userAnswer, setUserAnswer] = useState(() => {
    const savedStats = loadSavedStats();
    const saved = savedStats[JUMP_SEARCH_QUESTIONS[loadSavedIndex()]?.id];
    return saved?.savedAnswer ?? "";
  });
  const [submitted, setSubmitted] = useState(() => {
    const savedStats = loadSavedStats();
    const saved = savedStats[JUMP_SEARCH_QUESTIONS[loadSavedIndex()]?.id];
    return Boolean(saved?.attempted);
  });
  const [evaluation, setEvaluation] = useState(() => {
    const savedStats = loadSavedStats();
    const saved = savedStats[JUMP_SEARCH_QUESTIONS[loadSavedIndex()]?.id];
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

  const totalQuestions = JUMP_SEARCH_QUESTIONS.length;
  const currentQuestion = JUMP_SEARCH_QUESTIONS[currentIndex];

  const progress = calculateJumpSearchProgress(questionStats, totalQuestions);

  function handleSelectQuestion(index) {
    setCurrentIndex(index);
    const targetQ = JUMP_SEARCH_QUESTIONS[index];
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

    const result = evaluateJumpSearchAnswer(currentQuestion, userAnswer);
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
            <h2>🧩 Jump Search Practice Studio</h2>
            <p>
              Test your understanding of optimal block sizes, block jumping logic, linear scan boundaries, and edge cases.
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
          <div className="question-nav-pills">
            {JUMP_SEARCH_QUESTIONS.map((q, idx) => {
              const stat = questionStats[q.id];
              let statusClass = "unattempted";
              if (stat && stat.attempted) {
                statusClass = stat.answeredCorrectly ? "correct" : "incorrect";
              }
              const isActive = idx === currentIndex;

              return (
                <button
                  key={q.id}
                  type="button"
                  className={`q-pill ${statusClass} ${isActive ? "active-pill" : ""}`}
                  onClick={() => handleSelectQuestion(idx)}
                >
                  <span className="pill-num">{idx + 1}</span>
                  {stat?.attempted && (
                    <span className="pill-icon">
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
              {currentQuestion.target !== null && currentQuestion.target !== undefined && (
                <span className="target-pill">
                  Target: <strong>{currentQuestion.target}</strong>
                </span>
              )}
            </div>

            <div className="practice-array-track">
              {currentQuestion.array.map((val, idx) => {
                const isTargetMatch = currentQuestion.target === val;
                return (
                  <div key={idx} className="practice-array-node">
                    <div className="node-badge-slot">
                      <span className="tag-spacer">&nbsp;</span>
                    </div>

                    <div
                      className={`practice-cell ${
                        isTargetMatch ? "cell-target" : ""
                      }`}
                    >
                      {val}
                    </div>

                    <span className="node-index">[{idx}]</span>
                  </div>
                );
              })}
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
                    className={`option-card ${isSelected ? "selected" : ""} ${
                      submitted ? "disabled" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`mcq-${currentQuestion.id}`}
                      value={opt.id}
                      checked={isSelected}
                      disabled={submitted}
                      onChange={() => setUserAnswer(opt.id)}
                    />
                    <span className="opt-marker">{opt.id}</span>
                    <span className="opt-text">{opt.text}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleSubmitAnswer} className="numeric-input-form">
              <label htmlFor="jump-user-answer-input">Your Answer:</label>
              <div className="input-with-button">
                <input
                  id="jump-user-answer-input"
                  type="number"
                  value={userAnswer}
                  disabled={submitted}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={currentQuestion.placeholder || "Enter numeric answer"}
                  className="q-input-field"
                />
              </div>
            </form>
          )}

          {/* ACTION BUTTONS */}
          <div className="solving-actions">
            {!submitted ? (
              <button
                type="button"
                className="submit-answer-btn"
                onClick={handleSubmitAnswer}
                disabled={userAnswer === "" || userAnswer === null || userAnswer === undefined}
              >
                Submit Answer
              </button>
            ) : (
              <div className="post-submit-actions">
                {!isCurrentCorrect && (
                  <button
                    type="button"
                    className="try-again-btn"
                    onClick={handleTryAgain}
                  >
                    ↻ Try Again
                  </button>
                )}
                {!isLastQuestion ? (
                  <button
                    type="button"
                    className="next-question-btn"
                    onClick={handleNextQuestion}
                  >
                    Next Question ▶
                  </button>
                ) : (
                  <button
                    type="button"
                    className="next-question-btn"
                    onClick={() => handleSelectQuestion(0)}
                  >
                    Review From Start ↺
                  </button>
                )}
              </div>
            )}

            {/* HINT TOGGLE */}
            <button
              type="button"
              className="hint-toggle-btn"
              onClick={() => setShowHint(!showHint)}
            >
              {showHint ? "🙈 Hide Hint" : "💡 Need a Hint?"}
            </button>
          </div>
        </div>

        {/* HINT DRAWER */}
        {showHint && (
          <div className="hint-drawer">
            <span className="hint-icon">💡</span>
            <p>{currentQuestion.hint}</p>
          </div>
        )}

        {/* FEEDBACK BANNER */}
        {submitted && evaluation && (
          <div
            className={`feedback-banner ${
              evaluation.isCorrect ? "feedback-correct" : "feedback-incorrect"
            }`}
          >
            <div className="feedback-status-line">
              <span className="feedback-icon">
                {evaluation.isCorrect ? "🎉 🥳" : "❌"}
              </span>
              <h4>{evaluation.feedback}</h4>
            </div>

            {!evaluation.isCorrect && (
              <div className="correct-answer-callout">
                <span>Correct Answer:</span>{" "}
                <strong>{evaluation.correctAnswerDisplay}</strong>
              </div>
            )}

            <div className="feedback-explanation">
              <strong>Why this is correct:</strong>
              <p>{evaluation.explanation}</p>
            </div>
          </div>
        )}

        {/* BOTTOM STEPPER NAV */}
        <div className="practice-footer-stepper">
          <button
            type="button"
            className="stepper-btn"
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
          >
            ← Previous Question
          </button>
          <span className="footer-step-indicator">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <button
            type="button"
            className="stepper-btn"
            onClick={handleNextQuestion}
            disabled={isLastQuestion}
          >
            Next Question →
          </button>
        </div>
      </div>
    </div>
  );
}

export default JumpSearchPractice;
