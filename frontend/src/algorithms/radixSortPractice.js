/**
 * Deterministic evaluation logic and progress tracking for Radix Sort practice questions.
 */

/**
 * Evaluates a user's answer against a Radix Sort question.
 *
 * @param {Object} question - Question object from RADIX_SORT_QUESTIONS
 * @param {string|number} userAnswer - User's submitted answer
 * @returns {Object} { isCorrect, feedback, explanation, correctAnswerDisplay }
 */
export function evaluateRadixSortAnswer(question, userAnswer) {
  if (!question) {
    return {
      isCorrect: false,
      feedback: "Invalid question.",
      explanation: "",
      correctAnswerDisplay: ""
    };
  }

  // Handle empty or whitespace-only answers
  if (
    userAnswer === null ||
    userAnswer === undefined ||
    String(userAnswer).trim() === ""
  ) {
    return {
      isCorrect: false,
      feedback: "Please enter an answer before submitting.",
      explanation: question.explanation || "",
      correctAnswerDisplay: getCorrectAnswerDisplay(question)
    };
  }

  const rawUserStr = String(userAnswer).trim();

  let isCorrect = false;

  if (question.inputType === "multiple_choice") {
    // Case-insensitive comparison for MCQ option IDs ('A', 'B', etc.)
    isCorrect = rawUserStr.toUpperCase() === String(question.correctAnswer).toUpperCase();
  } else if (question.inputType === "number") {
    const parsedNum = Number(rawUserStr);
    const expectedNum = Number(question.correctAnswer);
    isCorrect = !Number.isNaN(parsedNum) && Math.abs(parsedNum - expectedNum) < 1e-9;
  } else {
    isCorrect = rawUserStr === String(question.correctAnswer).trim();
  }

  return {
    isCorrect,
    feedback: isCorrect ? "Correct! 🎉" : "Not quite. Try again!",
    explanation: question.explanation || "",
    correctAnswerDisplay: getCorrectAnswerDisplay(question)
  };
}

/**
 * Formats the correct answer for display in feedback banners.
 */
function getCorrectAnswerDisplay(question) {
  if (question.inputType === "multiple_choice" && Array.isArray(question.options)) {
    const match = question.options.find(
      (opt) => String(opt.id).toUpperCase() === String(question.correctAnswer).toUpperCase()
    );
    if (match) {
      return `${match.id}: ${match.text}`;
    }
  }
  return String(question.correctAnswer);
}

/**
 * Calculates current user progress and accuracy score.
 *
 * @param {Object} questionStats - Map of questionId -> { attempted: boolean, answeredCorrectly: boolean }
 * @param {number} totalQuestions - Total count of questions in module
 * @returns {Object} { attemptedCount, correctCount, percentage }
 */
export function calculateRadixSortProgress(questionStats = {}, totalQuestions = 0) {
  if (!questionStats || totalQuestions <= 0) {
    return {
      attemptedCount: 0,
      correctCount: 0,
      percentage: 0
    };
  }

  let attemptedCount = 0;
  let correctCount = 0;

  for (const key of Object.keys(questionStats)) {
    const entry = questionStats[key];
    if (entry && entry.attempted) {
      attemptedCount++;
      if (entry.answeredCorrectly) {
        correctCount++;
      }
    }
  }

  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    attemptedCount,
    correctCount,
    percentage
  };
}
