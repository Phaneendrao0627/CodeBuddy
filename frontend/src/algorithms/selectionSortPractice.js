/**
 * Deterministic evaluation logic and score tracking for Selection Sort practice questions.
 */

/**
 * Evaluates user answer against question definition deterministically.
 */
export function evaluateSelectionSortAnswer(question, rawAnswer) {
  if (rawAnswer === null || rawAnswer === undefined || String(rawAnswer).trim() === "") {
    return {
      isCorrect: false,
      feedback: "Please select or enter an answer before submitting.",
      explanation: question.explanation,
      correctAnswerDisplay: String(question.correctAnswer)
    };
  }

  const trimmed = String(rawAnswer).trim();

  if (question.inputType === "number") {
    const userNum = Number(trimmed);
    const expectedNum = Number(question.correctAnswer);

    if (Number.isNaN(userNum)) {
      return {
        isCorrect: false,
        feedback: "Please enter a valid numeric value.",
        explanation: question.explanation,
        correctAnswerDisplay: String(question.correctAnswer)
      };
    }

    const isCorrect = userNum === expectedNum;
    return {
      isCorrect,
      feedback: isCorrect
        ? "🎉 Correct! Great job!"
        : `Incorrect. You answered ${userNum}, but the correct answer is ${expectedNum}.`,
      explanation: question.explanation,
      correctAnswerDisplay: String(expectedNum)
    };
  }

  if (question.inputType === "multiple_choice") {
    const isCorrect = trimmed.toUpperCase() === String(question.correctAnswer).toUpperCase();
    const correctOpt = question.options?.find(
      (opt) => opt.id.toUpperCase() === String(question.correctAnswer).toUpperCase()
    );
    const answerDisplay = correctOpt
      ? `Option ${correctOpt.id}: ${correctOpt.text}`
      : String(question.correctAnswer);

    return {
      isCorrect,
      feedback: isCorrect
        ? "🎉 Correct! Great job!"
        : `Incorrect. The correct option is ${question.correctAnswer}.`,
      explanation: question.explanation,
      correctAnswerDisplay: answerDisplay
    };
  }

  const isCorrect = trimmed.toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
  return {
    isCorrect,
    feedback: isCorrect ? "🎉 Correct!" : "Incorrect.",
    explanation: question.explanation,
    correctAnswerDisplay: String(question.correctAnswer)
  };
}

/**
 * Calculates current progress and score metrics.
 */
export function calculateSelectionSortProgress(questionStats, totalQuestions) {
  const attemptedIds = Object.keys(questionStats);
  const attemptedCount = attemptedIds.length;
  let correctCount = 0;

  for (const id of attemptedIds) {
    if (questionStats[id].answeredCorrectly) {
      correctCount++;
    }
  }

  const percentage = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  return {
    attemptedCount,
    correctCount,
    totalQuestions,
    percentage
  };
}
