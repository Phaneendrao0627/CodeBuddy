import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateQuickSortAnswer,
  calculateQuickSortProgress
} from "../frontend/src/algorithms/quickSortPractice.js";
import { QUICK_SORT_QUESTIONS } from "../frontend/src/algorithms/quickSortPracticeData.js";

describe("Quick Sort Practice - Question Bank Integrity", () => {
  it("contains at least 10 structured questions progressing in difficulty", () => {
    assert.ok(QUICK_SORT_QUESTIONS.length >= 10, "Should have at least 10 questions");

    const hasBeginner = QUICK_SORT_QUESTIONS.some((q) => q.difficulty === "Beginner");
    const hasIntermediate = QUICK_SORT_QUESTIONS.some((q) => q.difficulty === "Intermediate");
    const hasChallenging = QUICK_SORT_QUESTIONS.some((q) => q.difficulty === "Challenging");

    assert.equal(hasBeginner, true, "Should have beginner questions");
    assert.equal(hasIntermediate, true, "Should have intermediate questions");
    assert.equal(hasChallenging, true, "Should have challenging questions");
  });

  it("covers required topics: fundamentals, pivot selection, lomuto boundary, tracing swap, final pivot index, recursion, best case, average case, worst case, space and stability", () => {
    const types = QUICK_SORT_QUESTIONS.map((q) => q.type);
    assert.ok(types.includes("concept_fundamentals"), "Must include concept_fundamentals question");
    assert.ok(types.includes("pivot_selection"), "Must include pivot_selection question");
    assert.ok(types.includes("lomuto_boundary"), "Must include lomuto_boundary question");
    assert.ok(types.includes("partition_trace_first_swap"), "Must include partition_trace_first_swap question");
    assert.ok(types.includes("final_pivot_index"), "Must include final_pivot_index question");
    assert.ok(types.includes("recursive_calls"), "Must include recursive_calls question");
    assert.ok(types.includes("best_case_complexity"), "Must include best_case_complexity question");
    assert.ok(types.includes("average_case_complexity"), "Must include average_case_complexity question");
    assert.ok(types.includes("worst_case_complexity"), "Must include worst_case_complexity question");
    assert.ok(types.includes("stability_and_space"), "Must include stability_and_space question");
  });

  it("verifies all questions have required fields (id, question, hint, explanation, correctAnswer, array)", () => {
    for (const q of QUICK_SORT_QUESTIONS) {
      assert.ok(q.id, `Question missing id`);
      assert.ok(q.question, `Question ${q.id} missing question text`);
      assert.ok(q.hint, `Question ${q.id} missing hint`);
      assert.ok(q.explanation, `Question ${q.id} missing explanation`);
      assert.ok(q.correctAnswer !== undefined, `Question ${q.id} missing correctAnswer`);
      assert.ok(Array.isArray(q.array), `Question ${q.id} missing array`);
    }
  });
});

describe("Quick Sort Practice - Deterministic Grading", () => {
  const q1 = QUICK_SORT_QUESTIONS.find((q) => q.id === 1); // concept: "A"
  const q2 = QUICK_SORT_QUESTIONS.find((q) => q.id === 2); // pivot: 10
  const q3 = QUICK_SORT_QUESTIONS.find((q) => q.id === 3); // boundary i: -1
  const q4 = QUICK_SORT_QUESTIONS.find((q) => q.id === 4); // first swap j: 3
  const q5 = QUICK_SORT_QUESTIONS.find((q) => q.id === 5); // final pivot index: 2
  const q6 = QUICK_SORT_QUESTIONS.find((q) => q.id === 6); // recursive ranges: "A"
  const q7 = QUICK_SORT_QUESTIONS.find((q) => q.id === 7); // best case: "A"
  const q8 = QUICK_SORT_QUESTIONS.find((q) => q.id === 8); // average case: "A"
  const q9 = QUICK_SORT_QUESTIONS.find((q) => q.id === 9); // worst case: "A"
  const q10 = QUICK_SORT_QUESTIONS.find((q) => q.id === 10); // stability & space: "A"

  it("grades multiple-choice concept fundamentals question correctly", () => {
    const resCorrect = evaluateQuickSortAnswer(q1, "A");
    assert.equal(resCorrect.isCorrect, true);
    assert.match(resCorrect.feedback, /Correct/i);

    const resLower = evaluateQuickSortAnswer(q1, "a");
    assert.equal(resLower.isCorrect, true);

    const resWrong = evaluateQuickSortAnswer(q1, "B");
    assert.equal(resWrong.isCorrect, false);
    assert.match(resWrong.feedback, /Incorrect/i);
  });

  it("grades numeric pivot selection question correctly", () => {
    const resCorrect = evaluateQuickSortAnswer(q2, 10);
    assert.equal(resCorrect.isCorrect, true);

    const resStr = evaluateQuickSortAnswer(q2, "10");
    assert.equal(resStr.isCorrect, true);

    const resWrong = evaluateQuickSortAnswer(q2, 38);
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades numeric initial boundary pointer i question correctly (including negative -1)", () => {
    const resCorrect = evaluateQuickSortAnswer(q3, -1);
    assert.equal(resCorrect.isCorrect, true);

    const resStr = evaluateQuickSortAnswer(q3, "-1");
    assert.equal(resStr.isCorrect, true);

    const resWrong = evaluateQuickSortAnswer(q3, 0);
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades numeric first swap scan index j question correctly", () => {
    const resCorrect = evaluateQuickSortAnswer(q4, 3);
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateQuickSortAnswer(q4, 0);
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades numeric final pivot index question correctly", () => {
    const resCorrect = evaluateQuickSortAnswer(q5, 2);
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateQuickSortAnswer(q5, 6);
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades recursive call boundaries question correctly", () => {
    const resCorrect = evaluateQuickSortAnswer(q6, "A");
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateQuickSortAnswer(q6, "B");
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades complexity questions correctly (best, average, worst)", () => {
    assert.equal(evaluateQuickSortAnswer(q7, "A").isCorrect, true);
    assert.equal(evaluateQuickSortAnswer(q7, "B").isCorrect, false);

    assert.equal(evaluateQuickSortAnswer(q8, "A").isCorrect, true);
    assert.equal(evaluateQuickSortAnswer(q8, "C").isCorrect, false);

    assert.equal(evaluateQuickSortAnswer(q9, "A").isCorrect, true);
    assert.equal(evaluateQuickSortAnswer(q9, "B").isCorrect, false);
  });

  it("grades auxiliary space and stability question correctly", () => {
    assert.equal(evaluateQuickSortAnswer(q10, "A").isCorrect, true);
    assert.equal(evaluateQuickSortAnswer(q10, "B").isCorrect, false);
  });

  it("handles empty and invalid answers deterministically", () => {
    const resEmpty = evaluateQuickSortAnswer(q2, "");
    assert.equal(resEmpty.isCorrect, false);
    assert.match(resEmpty.feedback, /Please select or enter an answer/i);

    const resNull = evaluateQuickSortAnswer(q2, null);
    assert.equal(resNull.isCorrect, false);

    const resNaN = evaluateQuickSortAnswer(q2, "invalid-num");
    assert.equal(resNaN.isCorrect, false);
    assert.match(resNaN.feedback, /valid numeric value/i);
  });
});

describe("Quick Sort Practice - Progress & Scoring", () => {
  it("calculates progress for unattempted practice", () => {
    const stats = {};
    const progress = calculateQuickSortProgress(stats, 10);
    assert.equal(progress.attemptedCount, 0);
    assert.equal(progress.correctCount, 0);
    assert.equal(progress.totalQuestions, 10);
    assert.equal(progress.percentage, 0);
  });

  it("calculates progress for partially answered practice", () => {
    const stats = {
      1: { attempted: true, answeredCorrectly: true },
      2: { attempted: true, answeredCorrectly: true },
      3: { attempted: true, answeredCorrectly: false },
      4: { attempted: true, answeredCorrectly: true }
    };
    const progress = calculateQuickSortProgress(stats, 10);
    assert.equal(progress.attemptedCount, 4);
    assert.equal(progress.correctCount, 3);
    assert.equal(progress.totalQuestions, 10);
    assert.equal(progress.percentage, 75);
  });

  it("calculates progress for 100% correct completion", () => {
    const stats = {};
    for (let i = 1; i <= 10; i++) {
      stats[i] = { attempted: true, answeredCorrectly: true };
    }
    const progress = calculateQuickSortProgress(stats, 10);
    assert.equal(progress.attemptedCount, 10);
    assert.equal(progress.correctCount, 10);
    assert.equal(progress.percentage, 100);
  });
});
