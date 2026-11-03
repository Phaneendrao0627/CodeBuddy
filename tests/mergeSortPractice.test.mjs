import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateMergeSortAnswer,
  calculateMergeSortProgress
} from "../frontend/src/algorithms/mergeSortPractice.js";
import { MERGE_SORT_QUESTIONS } from "../frontend/src/algorithms/mergeSortPracticeData.js";

describe("Merge Sort Practice - Question Bank Integrity", () => {
  it("contains 7 structured questions progressing in difficulty", () => {
    assert.equal(MERGE_SORT_QUESTIONS.length, 7);

    const hasBeginner = MERGE_SORT_QUESTIONS.some((q) => q.difficulty === "Beginner");
    const hasIntermediate = MERGE_SORT_QUESTIONS.some((q) => q.difficulty === "Intermediate");
    const hasChallenging = MERGE_SORT_QUESTIONS.some((q) => q.difficulty === "Challenging");

    assert.equal(hasBeginner, true, "Should have beginner questions");
    assert.equal(hasIntermediate, true, "Should have intermediate questions");
    assert.equal(hasChallenging, true, "Should have challenging questions");
  });

  it("covers required topics: midpoint calculation, base case, merge comparison, merge result, time complexity, space complexity, and stability", () => {
    const types = MERGE_SORT_QUESTIONS.map((q) => q.type);
    assert.ok(types.includes("midpoint_calculation"), "Must include midpoint_calculation question");
    assert.ok(types.includes("base_case"), "Must include base_case question");
    assert.ok(types.includes("merge_comparison"), "Must include merge_comparison question");
    assert.ok(types.includes("merge_result"), "Must include merge_result question");
    assert.ok(types.includes("time_complexity"), "Must include time_complexity question");
    assert.ok(types.includes("space_complexity"), "Must include space_complexity question");
    assert.ok(types.includes("stability_property"), "Must include stability_property question");
  });

  it("verifies all 7 questions have required fields (id, question, hint, explanation, correctAnswer, array)", () => {
    for (const q of MERGE_SORT_QUESTIONS) {
      assert.ok(q.id, `Question missing id`);
      assert.ok(q.question, `Question ${q.id} missing question text`);
      assert.ok(q.hint, `Question ${q.id} missing hint`);
      assert.ok(q.explanation, `Question ${q.id} missing explanation`);
      assert.ok(q.correctAnswer !== undefined, `Question ${q.id} missing correctAnswer`);
      assert.ok(Array.isArray(q.array), `Question ${q.id} missing array`);
    }
  });
});

describe("Merge Sort Practice - Deterministic Grading", () => {
  const q1 = MERGE_SORT_QUESTIONS.find((q) => q.id === 1); // midpoint_calculation: 3
  const q2 = MERGE_SORT_QUESTIONS.find((q) => q.id === 2); // base_case: 'A'
  const q3 = MERGE_SORT_QUESTIONS.find((q) => q.id === 3); // merge_comparison: 3
  const q4 = MERGE_SORT_QUESTIONS.find((q) => q.id === 4); // merge_result: 'A'
  const q5 = MERGE_SORT_QUESTIONS.find((q) => q.id === 5); // time_complexity: 'A'
  const q6 = MERGE_SORT_QUESTIONS.find((q) => q.id === 6); // space_complexity: 'A'
  const q7 = MERGE_SORT_QUESTIONS.find((q) => q.id === 7); // stability_property: 'A'

  it("grades numeric midpoint calculation question correctly", () => {
    const resCorrect = evaluateMergeSortAnswer(q1, 3);
    assert.equal(resCorrect.isCorrect, true);
    assert.match(resCorrect.feedback, /Correct/i);

    const resStr = evaluateMergeSortAnswer(q1, "3");
    assert.equal(resStr.isCorrect, true);

    const resWrong = evaluateMergeSortAnswer(q1, 4);
    assert.equal(resWrong.isCorrect, false);
    assert.match(resWrong.feedback, /Incorrect/i);
    assert.equal(resWrong.correctAnswerDisplay, "3");
  });

  it("grades multiple-choice base case question correctly", () => {
    const resUpper = evaluateMergeSortAnswer(q2, "A");
    assert.equal(resUpper.isCorrect, true);

    const resLower = evaluateMergeSortAnswer(q2, "a");
    assert.equal(resLower.isCorrect, true);

    const resWrong = evaluateMergeSortAnswer(q2, "B");
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades numeric merge comparison question correctly", () => {
    const resCorrect = evaluateMergeSortAnswer(q3, 3);
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateMergeSortAnswer(q3, 27);
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades multiple-choice merge result question correctly", () => {
    const resCorrect = evaluateMergeSortAnswer(q4, "A");
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateMergeSortAnswer(q4, "B");
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades time complexity question correctly", () => {
    const resCorrect = evaluateMergeSortAnswer(q5, "A");
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateMergeSortAnswer(q5, "B");
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades space complexity question correctly", () => {
    const resCorrect = evaluateMergeSortAnswer(q6, "A");
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateMergeSortAnswer(q6, "B");
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades stability condition question correctly", () => {
    const resCorrect = evaluateMergeSortAnswer(q7, "A");
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateMergeSortAnswer(q7, "D");
    assert.equal(resWrong.isCorrect, false);
  });

  it("handles empty and invalid answers deterministically", () => {
    const resEmpty = evaluateMergeSortAnswer(q1, "");
    assert.equal(resEmpty.isCorrect, false);
    assert.match(resEmpty.feedback, /Please select or enter an answer/i);

    const resNull = evaluateMergeSortAnswer(q1, null);
    assert.equal(resNull.isCorrect, false);

    const resNaN = evaluateMergeSortAnswer(q1, "invalid-num");
    assert.equal(resNaN.isCorrect, false);
    assert.match(resNaN.feedback, /valid numeric value/i);
  });
});

describe("Merge Sort Practice - Progress & Scoring", () => {
  it("calculates progress for unattempted practice", () => {
    const stats = {};
    const progress = calculateMergeSortProgress(stats, 7);
    assert.equal(progress.attemptedCount, 0);
    assert.equal(progress.correctCount, 0);
    assert.equal(progress.totalQuestions, 7);
    assert.equal(progress.percentage, 0);
  });

  it("calculates progress for partially answered practice", () => {
    const stats = {
      1: { attempted: true, answeredCorrectly: true },
      2: { attempted: true, answeredCorrectly: true },
      3: { attempted: true, answeredCorrectly: false },
      4: { attempted: true, answeredCorrectly: true }
    };
    const progress = calculateMergeSortProgress(stats, 7);
    assert.equal(progress.attemptedCount, 4);
    assert.equal(progress.correctCount, 3);
    assert.equal(progress.totalQuestions, 7);
    assert.equal(progress.percentage, 75); // Math.round(3/4 * 100) = 75
  });

  it("calculates progress for 100% correct completion", () => {
    const stats = {};
    for (let i = 1; i <= 7; i++) {
      stats[i] = { attempted: true, answeredCorrectly: true };
    }
    const progress = calculateMergeSortProgress(stats, 7);
    assert.equal(progress.attemptedCount, 7);
    assert.equal(progress.correctCount, 7);
    assert.equal(progress.percentage, 100);
  });
});
