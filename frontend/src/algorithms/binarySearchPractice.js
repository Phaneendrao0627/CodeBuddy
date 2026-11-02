/**
 * Pure, deterministic evaluation logic for Binary Search practice questions.
 */

/**
 * Evaluates a user answer against a question.
 * 
 * @param {object} question - Question object from BINARY_SEARCH_QUESTIONS
 * @param {string|number} rawAnswer - User provided answer
 * @returns {{ isCorrect: boolean, feedback: string, explanation: string, correctAnswerDisplay: string }}
 */
export function evaluateAnswer(question, rawAnswer) {
  if (!question) {
    return {
      isCorrect: false,
      feedback: "Invalid question.",
      explanation: "",
      correctAnswerDisplay: ""
    };
  }

  if (rawAnswer === undefined || rawAnswer === null || String(rawAnswer).trim() === "") {
    return {
      isCorrect: false,
      feedback: "Please select or enter an answer before submitting.",
      explanation: "",
      correctAnswerDisplay: ""
    };
  }

  let isCorrect = false;
  let correctAnswerDisplay = String(question.correctAnswer);

  if (question.inputType === "number") {
    const userNum = Number(String(rawAnswer).trim());
    const expectedNum = Number(question.correctAnswer);

    if (Number.isFinite(userNum) && Number.isFinite(expectedNum)) {
      isCorrect = userNum === expectedNum;
    }
  } else if (question.inputType === "multiple_choice") {
    const cleanedUser = String(rawAnswer).trim().toUpperCase();
    const cleanedExpected = String(question.correctAnswer).trim().toUpperCase();
    isCorrect = cleanedUser === cleanedExpected;

    // Enhance correct answer display with option text
    if (Array.isArray(question.options)) {
      const matchedOpt = question.options.find(
        (opt) => opt.id.toUpperCase() === cleanedExpected
      );
      if (matchedOpt) {
        correctAnswerDisplay = `Option ${matchedOpt.id}: ${matchedOpt.text}`;
      }
    }
  } else {
    isCorrect = String(rawAnswer).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
  }

  return {
    isCorrect,
    feedback: isCorrect
      ? "🎉 Correct! Great job!"
      : "❌ Incorrect. Take a look at the explanation below and try again.",
    explanation: question.explanation || "",
    correctAnswerDisplay
  };
}

/**
 * Calculates current progress summary.
 * 
 * @param {object} questionStats - Map of questionId -> { attempted, answeredCorrectly }
 * @param {number} totalQuestions - Total number of available questions
 * @returns {{ attemptedCount: number, correctCount: number, percentage: number }}
 */
export function calculateProgress(questionStats, totalQuestions) {
  if (!questionStats || typeof questionStats !== "object" || totalQuestions <= 0) {
    return { attemptedCount: 0, correctCount: 0, percentage: 0 };
  }

  let attemptedCount = 0;
  let correctCount = 0;

  for (const qId in questionStats) {
    const stat = questionStats[qId];
    if (stat && stat.attempted) {
      attemptedCount++;
      if (stat.answeredCorrectly) {
        correctCount++;
      }
    }
  }

  const percentage = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  return {
    attemptedCount,
    correctCount,
    percentage
  };
}
