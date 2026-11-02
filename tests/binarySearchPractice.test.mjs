import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateAnswer,
  calculateProgress
} from "../frontend/src/algorithms/binarySearchPractice.js";
import { BINARY_SEARCH_QUESTIONS } from "../frontend/src/algorithms/binarySearchPracticeData.js";

describe("Binary Search Practice - Question Bank Integrity", () => {
  it("contains at least 5 structured questions progressing in difficulty", () => {
    assert.ok(BINARY_SEARCH_QUESTIONS.length >= 5);

    const hasBeginner = BINARY_SEARCH_QUESTIONS.some((q) => q.difficulty === "Beginner");
    const hasIntermediate = BINARY_SEARCH_QUESTIONS.some((q) => q.difficulty === "Intermediate");
    assert.equal(hasBeginner, true, "Should have beginner questions");
    assert.equal(hasIntermediate, true, "Should have intermediate questions");
  });

  it("verifies all questions have required fields (hint, explanation, target/array)", () => {
    for (const q of BINARY_SEARCH_QUESTIONS) {
      assert.ok(q.id, `Question ${q.id} missing id`);
      assert.ok(q.question, `Question ${q.id} missing question text`);
      assert.ok(q.hint, `Question ${q.id} missing hint`);
      assert.ok(q.explanation, `Question ${q.id} missing explanation`);
      assert.ok(q.correctAnswer !== undefined, `Question ${q.id} missing correctAnswer`);
    }
  });
});

describe("Binary Search Practice - Deterministic Evaluation", () => {
  const q1 = BINARY_SEARCH_QUESTIONS.find((q) => q.id === 1); // target 19 -> index 4
  const q3 = BINARY_SEARCH_QUESTIONS.find((q) => q.id === 3); // pointer movement -> 'A'
  const q4 = BINARY_SEARCH_QUESTIONS.find((q) => q.id === 4); // not found -> -1

  it("evaluates correct numeric answer", () => {
    const resultNum = evaluateAnswer(q1, 4);
    assert.equal(resultNum.isCorrect, true);
    assert.match(resultNum.feedback, /Correct/i);

    const resultStr = evaluateAnswer(q1, "4");
    assert.equal(resultStr.isCorrect, true);
  });

  it("evaluates incorrect numeric answer", () => {
    const result = evaluateAnswer(q1, 3);
    assert.equal(result.isCorrect, false);
    assert.match(result.feedback, /Incorrect/i);
    assert.equal(result.correctAnswerDisplay, "4");
  });

  it("evaluates negative number answer (target missing: -1)", () => {
    const correctRes = evaluateAnswer(q4, -1);
    assert.equal(correctRes.isCorrect, true);

    const correctStr = evaluateAnswer(q4, "-1");
    assert.equal(correctStr.isCorrect, true);

    const wrongRes = evaluateAnswer(q4, 0);
    assert.equal(wrongRes.isCorrect, false);
  });

  it("evaluates multiple choice questions with case insensitivity", () => {
    const resUpper = evaluateAnswer(q3, "A");
    assert.equal(resUpper.isCorrect, true);

    const resLower = evaluateAnswer(q3, "a");
    assert.equal(resLower.isCorrect, true);

    const resWrong = evaluateAnswer(q3, "B");
    assert.equal(resWrong.isCorrect, false);
    assert.match(resWrong.correctAnswerDisplay, /Option A/);
  });

  it("rejects empty or whitespace answers with a friendly validation message", () => {
    const emptyRes = evaluateAnswer(q1, "");
    assert.equal(emptyRes.isCorrect, false);
    assert.match(emptyRes.feedback, /Please select or enter an answer/i);

    const nullRes = evaluateAnswer(q1, null);
    assert.equal(nullRes.isCorrect, false);
  });
});

describe("Binary Search Practice - Progress & Score Tracking", () => {
  it("calculates 0 progress when no questions have been attempted", () => {
    const progress = calculateProgress({}, 7);
    assert.equal(progress.attemptedCount, 0);
    assert.equal(progress.correctCount, 0);
    assert.equal(progress.percentage, 0);
  });

  it("tracks correct and incorrect attempts accurately without data loss", () => {
    const stats = {
      1: { attempted: true, answeredCorrectly: true },
      2: { attempted: true, answeredCorrectly: false },
      3: { attempted: true, answeredCorrectly: true }
    };
    const progress = calculateProgress(stats, 7);
    assert.equal(progress.attemptedCount, 3);
    assert.equal(progress.correctCount, 2);
    assert.equal(progress.percentage, 67); // 2/3 rounded
  });

  it("tracks 100% score when all attempted are correct", () => {
    const stats = {
      1: { attempted: true, answeredCorrectly: true },
      2: { attempted: true, answeredCorrectly: true }
    };
    const progress = calculateProgress(stats, 5);
    assert.equal(progress.attemptedCount, 2);
    assert.equal(progress.correctCount, 2);
    assert.equal(progress.percentage, 100);
  });
});
