import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateInsertionSortAnswer,
  calculateInsertionSortProgress
} from "../frontend/src/algorithms/insertionSortPractice.js";
import { INSERTION_SORT_QUESTIONS } from "../frontend/src/algorithms/insertionSortPracticeData.js";

describe("Insertion Sort Practice - Question Bank Integrity", () => {
  it("contains 7 structured questions progressing in difficulty", () => {
    assert.equal(INSERTION_SORT_QUESTIONS.length, 7);

    const hasBeginner = INSERTION_SORT_QUESTIONS.some((q) => q.difficulty === "Beginner");
    const hasIntermediate = INSERTION_SORT_QUESTIONS.some((q) => q.difficulty === "Intermediate");
    const hasChallenging = INSERTION_SORT_QUESTIONS.some((q) => q.difficulty === "Challenging");

    assert.equal(hasBeginner, true, "Should have beginner questions");
    assert.equal(hasIntermediate, true, "Should have intermediate questions");
    assert.equal(hasChallenging, true, "Should have challenging questions");
  });

  it("covers required topics: first pass, key selection, element shifting, pass results, comparisons, best/worst cases, stability", () => {
    const types = INSERTION_SORT_QUESTIONS.map((q) => q.type);
    assert.ok(types.includes("key_selection"), "Must include key_selection question");
    assert.ok(types.includes("first_pass"), "Must include first_pass question");
    assert.ok(types.includes("element_shifting"), "Must include element_shifting question");
    assert.ok(types.includes("pass_result"), "Must include pass_result question");
    assert.ok(types.includes("comparison_count"), "Must include comparison_count question");
    assert.ok(types.includes("worst_case_shifts"), "Must include worst_case_shifts question");
    assert.ok(types.includes("stability_property"), "Must include stability_property question");
  });

  it("verifies all 7 questions have required fields (id, question, hint, explanation, correctAnswer, array)", () => {
    for (const q of INSERTION_SORT_QUESTIONS) {
      assert.ok(q.id, `Question missing id`);
      assert.ok(q.question, `Question ${q.id} missing question text`);
      assert.ok(q.hint, `Question ${q.id} missing hint`);
      assert.ok(q.explanation, `Question ${q.id} missing explanation`);
      assert.ok(q.correctAnswer !== undefined, `Question ${q.id} missing correctAnswer`);
      assert.ok(Array.isArray(q.array), `Question ${q.id} missing array`);
    }
  });
});

describe("Insertion Sort Practice - Deterministic Grading", () => {
  const q1 = INSERTION_SORT_QUESTIONS.find((q) => q.id === 1); // key_selection: 4
  const q2 = INSERTION_SORT_QUESTIONS.find((q) => q.id === 2); // first_pass: 'A'
  const q3 = INSERTION_SORT_QUESTIONS.find((q) => q.id === 3); // element_shifting: 3
  const q4 = INSERTION_SORT_QUESTIONS.find((q) => q.id === 4); // pass_result: 'A'
  const q5 = INSERTION_SORT_QUESTIONS.find((q) => q.id === 5); // comparison_count: 5
  const q6 = INSERTION_SORT_QUESTIONS.find((q) => q.id === 6); // worst_case_shifts: 10
  const q7 = INSERTION_SORT_QUESTIONS.find((q) => q.id === 7); // stability_property: 'A'

  it("grades numeric key selection question correctly", () => {
    const resCorrect = evaluateInsertionSortAnswer(q1, 4);
    assert.equal(resCorrect.isCorrect, true);
    assert.match(resCorrect.feedback, /Correct/i);

    const resStr = evaluateInsertionSortAnswer(q1, "4");
    assert.equal(resStr.isCorrect, true);

    const resWrong = evaluateInsertionSortAnswer(q1, 9);
    assert.equal(resWrong.isCorrect, false);
    assert.match(resWrong.feedback, /Incorrect/i);
    assert.equal(resWrong.correctAnswerDisplay, "4");
  });

  it("grades multiple-choice questions with case insensitivity", () => {
    const resUpper = evaluateInsertionSortAnswer(q2, "A");
    assert.equal(resUpper.isCorrect, true);

    const resLower = evaluateInsertionSortAnswer(q2, "a");
    assert.equal(resLower.isCorrect, true);

    const resWrong = evaluateInsertionSortAnswer(q2, "B");
    assert.equal(resWrong.isCorrect, false);
    assert.match(resWrong.correctAnswerDisplay, /Option A/);
  });

  it("grades element shifting and pass result questions correctly", () => {
    assert.equal(evaluateInsertionSortAnswer(q3, 3).isCorrect, true);
    assert.equal(evaluateInsertionSortAnswer(q3, 2).isCorrect, false);

    assert.equal(evaluateInsertionSortAnswer(q4, "A").isCorrect, true);
    assert.equal(evaluateInsertionSortAnswer(q4, "C").isCorrect, false);
  });

  it("grades best-case comparisons, worst-case shifts, and stability questions correctly", () => {
    assert.equal(evaluateInsertionSortAnswer(q5, 5).isCorrect, true);
    assert.equal(evaluateInsertionSortAnswer(q5, 6).isCorrect, false);

    assert.equal(evaluateInsertionSortAnswer(q6, 10).isCorrect, true);
    assert.equal(evaluateInsertionSortAnswer(q6, 15).isCorrect, false);

    assert.equal(evaluateInsertionSortAnswer(q7, "A").isCorrect, true);
    assert.equal(evaluateInsertionSortAnswer(q7, "B").isCorrect, false);
  });

  it("rejects empty or whitespace inputs gracefully", () => {
    const emptyRes = evaluateInsertionSortAnswer(q1, "");
    assert.equal(emptyRes.isCorrect, false);
    assert.match(emptyRes.feedback, /Please select or enter an answer/i);

    const nullRes = evaluateInsertionSortAnswer(q1, null);
    assert.equal(nullRes.isCorrect, false);

    const undefinedRes = evaluateInsertionSortAnswer(q1, undefined);
    assert.equal(undefinedRes.isCorrect, false);
  });

  it("rejects invalid non-numeric inputs for numeric questions", () => {
    const invalidRes = evaluateInsertionSortAnswer(q1, "xyz");
    assert.equal(invalidRes.isCorrect, false);
    assert.match(invalidRes.feedback, /Please enter a valid numeric value/i);
  });
});

describe("Insertion Sort Practice - Progress & Score Tracking", () => {
  it("calculates 0 progress when no questions have been attempted", () => {
    const progress = calculateInsertionSortProgress({}, 7);
    assert.equal(progress.attemptedCount, 0);
    assert.equal(progress.correctCount, 0);
    assert.equal(progress.totalQuestions, 7);
    assert.equal(progress.percentage, 0);
  });

  it("tracks correct and incorrect attempts accurately", () => {
    const stats = {
      1: { attempted: true, answeredCorrectly: true },
      2: { attempted: true, answeredCorrectly: false },
      3: { attempted: true, answeredCorrectly: true },
      4: { attempted: true, answeredCorrectly: true }
    };
    const progress = calculateInsertionSortProgress(stats, 7);
    assert.equal(progress.attemptedCount, 4);
    assert.equal(progress.correctCount, 3);
    assert.equal(progress.percentage, 75);
  });

  it("tracks 100% score when all attempted questions are correct", () => {
    const stats = {
      1: { attempted: true, answeredCorrectly: true },
      2: { attempted: true, answeredCorrectly: true },
      3: { attempted: true, answeredCorrectly: true }
    };
    const progress = calculateInsertionSortProgress(stats, 7);
    assert.equal(progress.attemptedCount, 3);
    assert.equal(progress.correctCount, 3);
    assert.equal(progress.percentage, 100);
  });
});
