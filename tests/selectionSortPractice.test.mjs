import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateSelectionSortAnswer,
  calculateSelectionSortProgress
} from "../frontend/src/algorithms/selectionSortPractice.js";
import { SELECTION_SORT_QUESTIONS } from "../frontend/src/algorithms/selectionSortPracticeData.js";

describe("Selection Sort Practice - Question Bank Integrity", () => {
  it("contains 7 structured questions progressing in difficulty", () => {
    assert.equal(SELECTION_SORT_QUESTIONS.length, 7);

    const hasBeginner = SELECTION_SORT_QUESTIONS.some((q) => q.difficulty === "Beginner");
    const hasIntermediate = SELECTION_SORT_QUESTIONS.some((q) => q.difficulty === "Intermediate");
    const hasChallenging = SELECTION_SORT_QUESTIONS.some((q) => q.difficulty === "Challenging");

    assert.equal(hasBeginner, true, "Should have beginner questions");
    assert.equal(hasIntermediate, true, "Should have intermediate questions");
    assert.equal(hasChallenging, true, "Should have challenging questions");
  });

  it("covers required topics: first minimum, tracking min, pass state, swap counts, complexity, in-place, and stability", () => {
    const types = SELECTION_SORT_QUESTIONS.map((q) => q.type);
    assert.ok(types.includes("first_minimum"), "Must include first_minimum question");
    assert.ok(types.includes("track_minimum"), "Must include track_minimum question");
    assert.ok(types.includes("pass_state"), "Must include pass_state question");
    assert.ok(types.includes("swap_count"), "Must include swap_count question");
    assert.ok(types.includes("time_complexity"), "Must include time_complexity question");
    assert.ok(types.includes("in_place_space"), "Must include in_place_space question");
    assert.ok(types.includes("stability_property"), "Must include stability_property question");
  });

  it("verifies all 7 questions have required fields (id, question, hint, explanation, correctAnswer, array)", () => {
    for (const q of SELECTION_SORT_QUESTIONS) {
      assert.ok(q.id, `Question missing id`);
      assert.ok(q.question, `Question ${q.id} missing question text`);
      assert.ok(q.hint, `Question ${q.id} missing hint`);
      assert.ok(q.explanation, `Question ${q.id} missing explanation`);
      assert.ok(q.correctAnswer !== undefined, `Question ${q.id} missing correctAnswer`);
      assert.ok(Array.isArray(q.array), `Question ${q.id} missing array`);
    }
  });
});

describe("Selection Sort Practice - Deterministic Grading", () => {
  const q1 = SELECTION_SORT_QUESTIONS.find((q) => q.id === 1); // first_minimum: 11
  const q2 = SELECTION_SORT_QUESTIONS.find((q) => q.id === 2); // track_minimum: 2
  const q3 = SELECTION_SORT_QUESTIONS.find((q) => q.id === 3); // pass_state: 'A'
  const q4 = SELECTION_SORT_QUESTIONS.find((q) => q.id === 4); // swap_count: 3
  const q5 = SELECTION_SORT_QUESTIONS.find((q) => q.id === 5); // time_complexity: 'B'
  const q6 = SELECTION_SORT_QUESTIONS.find((q) => q.id === 6); // in_place_space: 'B'
  const q7 = SELECTION_SORT_QUESTIONS.find((q) => q.id === 7); // stability_property: 'A'

  it("grades numeric first minimum question correctly", () => {
    const resCorrect = evaluateSelectionSortAnswer(q1, 11);
    assert.equal(resCorrect.isCorrect, true);
    assert.match(resCorrect.feedback, /Correct/i);

    const resStr = evaluateSelectionSortAnswer(q1, "11");
    assert.equal(resStr.isCorrect, true);

    const resWrong = evaluateSelectionSortAnswer(q1, 12);
    assert.equal(resWrong.isCorrect, false);
    assert.match(resWrong.feedback, /Incorrect/i);
    assert.equal(resWrong.correctAnswerDisplay, "11");
  });

  it("grades numeric track minimum question correctly", () => {
    const resCorrect = evaluateSelectionSortAnswer(q2, 2);
    assert.equal(resCorrect.isCorrect, true);

    const resStr = evaluateSelectionSortAnswer(q2, "2");
    assert.equal(resStr.isCorrect, true);

    const resWrong = evaluateSelectionSortAnswer(q2, 1);
    assert.equal(resWrong.isCorrect, false);
    assert.match(resWrong.feedback, /Incorrect/i);
    assert.equal(resWrong.correctAnswerDisplay, "2");
  });

  it("grades multiple-choice pass state question correctly", () => {
    const resUpper = evaluateSelectionSortAnswer(q3, "A");
    assert.equal(resUpper.isCorrect, true);

    const resLower = evaluateSelectionSortAnswer(q3, "a");
    assert.equal(resLower.isCorrect, true);

    const resWrong = evaluateSelectionSortAnswer(q3, "B");
    assert.equal(resWrong.isCorrect, false);
    assert.match(resWrong.correctAnswerDisplay, /Option A/i);
  });

  it("grades numeric swap count question correctly", () => {
    const resCorrect = evaluateSelectionSortAnswer(q4, 3);
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateSelectionSortAnswer(q4, 4);
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades quadratic time complexity question correctly", () => {
    const resCorrect = evaluateSelectionSortAnswer(q5, "B");
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateSelectionSortAnswer(q5, "A");
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades in-place and auxiliary space question correctly", () => {
    const resCorrect = evaluateSelectionSortAnswer(q6, "B");
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateSelectionSortAnswer(q6, "C");
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades stability counterexample question correctly", () => {
    const resCorrect = evaluateSelectionSortAnswer(q7, "A");
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateSelectionSortAnswer(q7, "D");
    assert.equal(resWrong.isCorrect, false);
  });

  it("handles empty and invalid answers deterministically", () => {
    const resEmpty = evaluateSelectionSortAnswer(q1, "");
    assert.equal(resEmpty.isCorrect, false);
    assert.match(resEmpty.feedback, /Please select or enter an answer/i);

    const resNull = evaluateSelectionSortAnswer(q1, null);
    assert.equal(resNull.isCorrect, false);

    const resNaN = evaluateSelectionSortAnswer(q1, "not-a-number");
    assert.equal(resNaN.isCorrect, false);
    assert.match(resNaN.feedback, /valid numeric value/i);
  });
});

describe("Selection Sort Practice - Progress & Scoring", () => {
  it("calculates progress for unattempted practice", () => {
    const stats = {};
    const progress = calculateSelectionSortProgress(stats, 7);
    assert.equal(progress.attemptedCount, 0);
    assert.equal(progress.correctCount, 0);
    assert.equal(progress.totalQuestions, 7);
    assert.equal(progress.percentage, 0);
  });

  it("calculates progress for partially answered practice", () => {
    const stats = {
      1: { attempted: true, answeredCorrectly: true },
      2: { attempted: true, answeredCorrectly: false },
      3: { attempted: true, answeredCorrectly: true }
    };
    const progress = calculateSelectionSortProgress(stats, 7);
    assert.equal(progress.attemptedCount, 3);
    assert.equal(progress.correctCount, 2);
    assert.equal(progress.totalQuestions, 7);
    assert.equal(progress.percentage, 67); // Math.round(2/3 * 100) = 67
  });

  it("calculates progress for 100% correct completion", () => {
    const stats = {};
    for (let i = 1; i <= 7; i++) {
      stats[i] = { attempted: true, answeredCorrectly: true };
    }
    const progress = calculateSelectionSortProgress(stats, 7);
    assert.equal(progress.attemptedCount, 7);
    assert.equal(progress.correctCount, 7);
    assert.equal(progress.percentage, 100);
  });
});
