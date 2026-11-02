import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateLinearSearchAnswer,
  calculateLinearSearchProgress
} from "../frontend/src/algorithms/linearSearchPractice.js";
import { LINEAR_SEARCH_QUESTIONS } from "../frontend/src/algorithms/linearSearchPracticeData.js";

describe("Linear Search Practice - Question Bank Integrity", () => {
  it("contains at least 7 structured questions progressing in difficulty", () => {
    assert.ok(LINEAR_SEARCH_QUESTIONS.length >= 7);

    const hasBeginner = LINEAR_SEARCH_QUESTIONS.some((q) => q.difficulty === "Beginner");
    const hasIntermediate = LINEAR_SEARCH_QUESTIONS.some((q) => q.difficulty === "Intermediate");
    assert.equal(hasBeginner, true, "Should have beginner questions");
    assert.equal(hasIntermediate, true, "Should have intermediate questions");
  });

  it("covers required topics: first pos, last pos, comparisons count, predict next, duplicates, absent", () => {
    const types = LINEAR_SEARCH_QUESTIONS.map((q) => q.type);
    assert.ok(types.includes("find_index"));
    assert.ok(types.includes("first_position"));
    assert.ok(types.includes("last_position"));
    assert.ok(types.includes("comparisons_count"));
    assert.ok(types.includes("predict_next"));
    assert.ok(types.includes("duplicate_elements"));
    assert.ok(types.includes("target_absent"));
  });

  it("verifies all questions have required fields (hint, explanation, target/array)", () => {
    for (const q of LINEAR_SEARCH_QUESTIONS) {
      assert.ok(q.id, `Question ${q.id} missing id`);
      assert.ok(q.question, `Question ${q.id} missing question text`);
      assert.ok(q.hint, `Question ${q.id} missing hint`);
      assert.ok(q.explanation, `Question ${q.id} missing explanation`);
      assert.ok(q.correctAnswer !== undefined, `Question ${q.id} missing correctAnswer`);
    }
  });
});

describe("Linear Search Practice - Deterministic Evaluation", () => {
  const q1 = LINEAR_SEARCH_QUESTIONS.find((q) => q.id === 1); // target 33 -> index 3
  const q2 = LINEAR_SEARCH_QUESTIONS.find((q) => q.id === 2); // best case -> 'A'
  const q3 = LINEAR_SEARCH_QUESTIONS.find((q) => q.id === 3); // last pos -> 8 comparisons
  const q6 = LINEAR_SEARCH_QUESTIONS.find((q) => q.id === 6); // duplicates -> 'A'

  it("evaluates correct numeric answer", () => {
    const resultNum = evaluateLinearSearchAnswer(q1, 3);
    assert.equal(resultNum.isCorrect, true);
    assert.match(resultNum.feedback, /Correct/i);

    const resultStr = evaluateLinearSearchAnswer(q1, "3");
    assert.equal(resultStr.isCorrect, true);
  });

  it("evaluates incorrect numeric answer", () => {
    const result = evaluateLinearSearchAnswer(q1, 2);
    assert.equal(result.isCorrect, false);
    assert.match(result.feedback, /Incorrect/i);
    assert.equal(result.correctAnswerDisplay, "3");
  });

  it("evaluates last position comparison count", () => {
    const correctRes = evaluateLinearSearchAnswer(q3, 8);
    assert.equal(correctRes.isCorrect, true);

    const wrongRes = evaluateLinearSearchAnswer(q3, 7);
    assert.equal(wrongRes.isCorrect, false);
  });

  it("evaluates multiple choice questions with case insensitivity", () => {
    const resUpper = evaluateLinearSearchAnswer(q2, "A");
    assert.equal(resUpper.isCorrect, true);

    const resLower = evaluateLinearSearchAnswer(q2, "a");
    assert.equal(resLower.isCorrect, true);

    const resWrong = evaluateLinearSearchAnswer(q2, "B");
    assert.equal(resWrong.isCorrect, false);
    assert.match(resWrong.correctAnswerDisplay, /Option A/);
  });

  it("evaluates duplicate elements question correctly", () => {
    const res = evaluateLinearSearchAnswer(q6, "A");
    assert.equal(res.isCorrect, true);
  });

  it("rejects empty or whitespace answers with a friendly validation message", () => {
    const emptyRes = evaluateLinearSearchAnswer(q1, "");
    assert.equal(emptyRes.isCorrect, false);
    assert.match(emptyRes.feedback, /Please select or enter an answer/i);

    const nullRes = evaluateLinearSearchAnswer(q1, null);
    assert.equal(nullRes.isCorrect, false);
  });
});

describe("Linear Search Practice - Progress & Score Tracking", () => {
  it("calculates 0 progress when no questions have been attempted", () => {
    const progress = calculateLinearSearchProgress({}, 7);
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
    const progress = calculateLinearSearchProgress(stats, 7);
    assert.equal(progress.attemptedCount, 3);
    assert.equal(progress.correctCount, 2);
    assert.equal(progress.percentage, 67); // 2/3 rounded
  });

  it("tracks 100% score when all attempted are correct", () => {
    const stats = {
      1: { attempted: true, answeredCorrectly: true },
      2: { attempted: true, answeredCorrectly: true },
      3: { attempted: true, answeredCorrectly: true }
    };
    const progress = calculateLinearSearchProgress(stats, 7);
    assert.equal(progress.attemptedCount, 3);
    assert.equal(progress.correctCount, 3);
    assert.equal(progress.percentage, 100);
  });
});
