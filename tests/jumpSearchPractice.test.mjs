import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateJumpSearchAnswer,
  calculateJumpSearchProgress
} from "../frontend/src/algorithms/jumpSearchPractice.js";
import { JUMP_SEARCH_QUESTIONS } from "../frontend/src/algorithms/jumpSearchPracticeData.js";

describe("Jump Search Practice - Question Bank Integrity", () => {
  it("contains 7 structured questions progressing in difficulty", () => {
    assert.equal(JUMP_SEARCH_QUESTIONS.length, 7);

    const hasBeginner = JUMP_SEARCH_QUESTIONS.some((q) => q.difficulty === "Beginner");
    const hasIntermediate = JUMP_SEARCH_QUESTIONS.some((q) => q.difficulty === "Intermediate");
    const hasChallenging = JUMP_SEARCH_QUESTIONS.some((q) => q.difficulty === "Challenging");

    assert.equal(hasBeginner, true, "Should have beginner questions");
    assert.equal(hasIntermediate, true, "Should have intermediate questions");
    assert.equal(hasChallenging, true, "Should have challenging questions");
  });

  it("covers required topics: jump size, block boundary, candidate block, comparisons, duplicates, absent, complexity", () => {
    const types = JUMP_SEARCH_QUESTIONS.map((q) => q.type);
    assert.ok(types.includes("jump_size"), "Must include jump_size question");
    assert.ok(types.includes("first_boundary"), "Must include first_boundary question");
    assert.ok(types.includes("candidate_block"), "Must include candidate_block question");
    assert.ok(types.includes("comparisons_count"), "Must include comparisons_count question");
    assert.ok(types.includes("duplicate_elements"), "Must include duplicate_elements question");
    assert.ok(types.includes("target_absent"), "Must include target_absent question");
    assert.ok(types.includes("complexity_worst_case"), "Must include complexity_worst_case question");
  });

  it("verifies all 7 questions have required fields (id, question, hint, explanation, correctAnswer)", () => {
    for (const q of JUMP_SEARCH_QUESTIONS) {
      assert.ok(q.id, `Question missing id`);
      assert.ok(q.question, `Question ${q.id} missing question text`);
      assert.ok(q.hint, `Question ${q.id} missing hint`);
      assert.ok(q.explanation, `Question ${q.id} missing explanation`);
      assert.ok(q.correctAnswer !== undefined, `Question ${q.id} missing correctAnswer`);
      assert.ok(Array.isArray(q.array), `Question ${q.id} missing array`);
    }
  });
});

describe("Jump Search Practice - Deterministic Grading", () => {
  const q1 = JUMP_SEARCH_QUESTIONS.find((q) => q.id === 1); // jump_size: 4
  const q2 = JUMP_SEARCH_QUESTIONS.find((q) => q.id === 2); // first_boundary: 'A'
  const q3 = JUMP_SEARCH_QUESTIONS.find((q) => q.id === 3); // candidate_block: 'A'
  const q4 = JUMP_SEARCH_QUESTIONS.find((q) => q.id === 4); // comparisons_count: 4
  const q5 = JUMP_SEARCH_QUESTIONS.find((q) => q.id === 5); // duplicate_elements: 'A'
  const q6 = JUMP_SEARCH_QUESTIONS.find((q) => q.id === 6); // target_absent: 'A'
  const q7 = JUMP_SEARCH_QUESTIONS.find((q) => q.id === 7); // complexity_worst_case: 'A'

  it("grades numeric optimal jump size question correctly", () => {
    const resCorrect = evaluateJumpSearchAnswer(q1, 4);
    assert.equal(resCorrect.isCorrect, true);
    assert.match(resCorrect.feedback, /Correct/i);

    const resStr = evaluateJumpSearchAnswer(q1, "4");
    assert.equal(resStr.isCorrect, true);

    const resWrong = evaluateJumpSearchAnswer(q1, 5);
    assert.equal(resWrong.isCorrect, false);
    assert.match(resWrong.feedback, /Incorrect/i);
    assert.equal(resWrong.correctAnswerDisplay, "4");
  });

  it("grades comparison count question correctly", () => {
    const resCorrect = evaluateJumpSearchAnswer(q4, 4);
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateJumpSearchAnswer(q4, 3);
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades multiple-choice questions with case insensitivity", () => {
    const resUpper = evaluateJumpSearchAnswer(q2, "A");
    assert.equal(resUpper.isCorrect, true);

    const resLower = evaluateJumpSearchAnswer(q2, "a");
    assert.equal(resLower.isCorrect, true);

    const resWrong = evaluateJumpSearchAnswer(q2, "B");
    assert.equal(resWrong.isCorrect, false);
    assert.match(resWrong.correctAnswerDisplay, /Option A/);
  });

  it("grades duplicate elements and absent target questions correctly", () => {
    assert.equal(evaluateJumpSearchAnswer(q5, "A").isCorrect, true);
    assert.equal(evaluateJumpSearchAnswer(q5, "B").isCorrect, false);

    assert.equal(evaluateJumpSearchAnswer(q6, "A").isCorrect, true);
    assert.equal(evaluateJumpSearchAnswer(q6, "C").isCorrect, false);

    assert.equal(evaluateJumpSearchAnswer(q7, "A").isCorrect, true);
    assert.equal(evaluateJumpSearchAnswer(q7, "B").isCorrect, false);
  });

  it("rejects empty or whitespace inputs gracefully", () => {
    const emptyRes = evaluateJumpSearchAnswer(q1, "");
    assert.equal(emptyRes.isCorrect, false);
    assert.match(emptyRes.feedback, /Please select or enter an answer/i);

    const nullRes = evaluateJumpSearchAnswer(q1, null);
    assert.equal(nullRes.isCorrect, false);

    const undefinedRes = evaluateJumpSearchAnswer(q1, undefined);
    assert.equal(undefinedRes.isCorrect, false);
  });

  it("rejects invalid non-numeric inputs for numeric questions", () => {
    const invalidRes = evaluateJumpSearchAnswer(q1, "abc");
    assert.equal(invalidRes.isCorrect, false);
    assert.match(invalidRes.feedback, /Please enter a valid numeric value/i);
  });
});

describe("Jump Search Practice - Progress & Score Tracking", () => {
  it("calculates 0 progress when no questions have been attempted", () => {
    const progress = calculateJumpSearchProgress({}, 7);
    assert.equal(progress.attemptedCount, 0);
    assert.equal(progress.correctCount, 0);
    assert.equal(progress.totalQuestions, 7);
    assert.equal(progress.percentage, 0);
  });

  it("tracks correct and incorrect attempts accurately", () => {
    const stats = {
      1: { attempted: true, answeredCorrectly: true },
      2: { attempted: true, answeredCorrectly: false },
      3: { attempted: true, answeredCorrectly: true }
    };
    const progress = calculateJumpSearchProgress(stats, 7);
    assert.equal(progress.attemptedCount, 3);
    assert.equal(progress.correctCount, 2);
    assert.equal(progress.percentage, 67);
  });

  it("tracks 100% score when all attempted questions are correct", () => {
    const stats = {
      1: { attempted: true, answeredCorrectly: true },
      2: { attempted: true, answeredCorrectly: true },
      3: { attempted: true, answeredCorrectly: true },
      4: { attempted: true, answeredCorrectly: true }
    };
    const progress = calculateJumpSearchProgress(stats, 7);
    assert.equal(progress.attemptedCount, 4);
    assert.equal(progress.correctCount, 4);
    assert.equal(progress.percentage, 100);
  });
});
