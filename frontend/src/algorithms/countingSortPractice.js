/**
 * Deterministic evaluation logic and score tracking for Counting Sort practice questions.
 */

/**
 * Evaluates a user's answer against the question definition deterministically.
 *
 * @param {object} question  - A question object from COUNTING_SORT_QUESTIONS.
 * @param {string|number} userAnswer - The raw value submitted by the user.
 * @returns {{ isCorrect: boolean, feedback: string, explanation: string, correctAnswerDisplay: string }}
 */
export function evaluateCountingSortAnswer(question, userAnswer) {
  // Guard: empty / whitespace answer
  if (
    userAnswer === null ||
    userAnswer === undefined ||
    String(userAnswer).trim() === ""
  ) {
    return {
      isCorrect: false,
      feedback: "Please enter an answer.",
      explanation: "",
      correctAnswerDisplay: ""
    };
  }

  const trimmed = String(userAnswer).trim();

  // ── Numeric questions ────────────────────────────────────────────────────
  if (question.inputType === "number") {
    const userNum = Number(trimmed);
    const expectedNum = Number(question.correctAnswer);

    if (Number.isNaN(userNum)) {
      return {
        isCorrect: false,
        feedback: "Please enter a valid numeric value.",
        explanation: question.explanation,
        correctAnswerDisplay: String(expectedNum)
      };
    }

    // Allow ±0 tolerance (exact match required for integer answers)
    const isCorrect = userNum === expectedNum;
    return {
      isCorrect,
      feedback: isCorrect ? "Correct! 🎉" : "Not quite. Try again!",
      explanation: question.explanation,
      correctAnswerDisplay: String(expectedNum)
    };
  }

  // ── Multiple-choice questions ────────────────────────────────────────────
  if (question.inputType === "multiple_choice") {
    const isCorrect =
      trimmed.toUpperCase() === String(question.correctAnswer).toUpperCase();

    const correctOpt = question.options?.find(
      (opt) =>
        opt.id.toUpperCase() === String(question.correctAnswer).toUpperCase()
    );
    const correctAnswerDisplay = correctOpt
      ? `Option ${correctOpt.id}: ${correctOpt.text}`
      : String(question.correctAnswer);

    return {
      isCorrect,
      feedback: isCorrect ? "Correct! 🎉" : "Not quite. Try again!",
      explanation: question.explanation,
      correctAnswerDisplay
    };
  }

  // ── Fallback: generic string comparison ─────────────────────────────────
  const isCorrect =
    trimmed.toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
  return {
    isCorrect,
    feedback: isCorrect ? "Correct! 🎉" : "Not quite. Try again!",
    explanation: question.explanation,
    correctAnswerDisplay: String(question.correctAnswer)
  };
}

/**
 * Calculates overall progress metrics across all practice questions.
 *
 * @param {Record<string|number, { attempted: boolean, answeredCorrectly: boolean }>} questionStats
 *   An object keyed by question id containing per-question attempt data.
 * @param {number} totalQuestions - The total number of questions in the set.
 * @returns {{ attemptedCount: number, correctCount: number, percentage: number }}
 */
export function calculateCountingSortProgress(questionStats, totalQuestions) {
  const ids = Object.keys(questionStats);
  const attemptedCount = ids.length;
  let correctCount = 0;

  for (const id of ids) {
    if (questionStats[id].answeredCorrectly) {
      correctCount++;
    }
  }

  const percentage =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  return {
    attemptedCount,
    correctCount,
    percentage
  };
}
