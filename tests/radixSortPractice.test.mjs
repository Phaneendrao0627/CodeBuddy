import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { RADIX_SORT_QUESTIONS } from "../frontend/src/algorithms/radixSortPracticeData.js";
import {
  evaluateRadixSortAnswer,
  calculateRadixSortProgress
} from "../frontend/src/algorithms/radixSortPractice.js";

describe("Radix Sort Practice - Question Bank Integrity", () => {
  it("contains at least 10 structured questions progressing in difficulty", () => {
    assert.ok(
      Array.isArray(RADIX_SORT_QUESTIONS),
      "Questions must be exported as an array"
    );
    assert.ok(
      RADIX_SORT_QUESTIONS.length >= 10,
      `Expected at least 10 questions, found ${RADIX_SORT_QUESTIONS.length}`
    );

    const difficulties = RADIX_SORT_QUESTIONS.map((q) => q.difficulty);
    assert.ok(difficulties.includes("Beginner"), "Must include Beginner questions");
    assert.ok(difficulties.includes("Intermediate"), "Must include Intermediate questions");
    assert.ok(difficulties.includes("Advanced"), "Must include Advanced questions");
  });

  it("covers required topics: fundamentals, LSD vs MSD, digit extraction, passes, counting sort role, stability, frequency, pass trace, complexity, space, and limitations", () => {
    const types = RADIX_SORT_QUESTIONS.map((q) => q.type);
    assert.ok(types.includes("radix_sort_fundamentals"));
    assert.ok(types.includes("lsd_vs_msd"));
    assert.ok(types.includes("digit_extraction_formula"));
    assert.ok(types.includes("total_passes_calculation"));
    assert.ok(types.includes("counting_sort_subroutine"));
    assert.ok(types.includes("stability_requirement"));
    assert.ok(types.includes("digit_frequency_count"));
    assert.ok(types.includes("trace_pass_1"));
    assert.ok(types.includes("time_complexity_analysis"));
    assert.ok(types.includes("space_and_properties"));
    assert.ok(types.includes("limitations_and_edge_cases"));
  });

  it("verifies all questions have required fields", () => {
    for (const q of RADIX_SORT_QUESTIONS) {
      assert.ok(typeof q.id === "number", `Question ${q.id} must have a numeric id`);
      assert.ok(typeof q.title === "string" && q.title.length > 0);
      assert.ok(typeof q.question === "string" && q.question.length > 10);
      assert.ok(typeof q.difficulty === "string");
      assert.ok(["multiple_choice", "number"].includes(q.inputType));
      assert.ok(typeof q.hint === "string" && q.hint.length > 5);
      assert.ok(typeof q.explanation === "string" && q.explanation.length > 10);
      assert.ok(q.correctAnswer !== undefined && q.correctAnswer !== null);

      if (q.inputType === "multiple_choice") {
        assert.ok(Array.isArray(q.options) && q.options.length >= 2);
        for (const opt of q.options) {
          assert.ok(typeof opt.id === "string");
          assert.ok(typeof opt.text === "string" && opt.text.length > 0);
        }
      }
    }
  });
});

describe("Radix Sort Practice - Deterministic Grading", () => {
  it("grades multiple-choice fundamentals question correctly (Q1)", () => {
    const q1 = RADIX_SORT_QUESTIONS.find((q) => q.id === 1);
    assert.ok(q1);

    const correctRes = evaluateRadixSortAnswer(q1, "A");
    assert.equal(correctRes.isCorrect, true);
    assert.match(correctRes.feedback, /correct/i);

    // Case insensitivity
    const lowerRes = evaluateRadixSortAnswer(q1, "a");
    assert.equal(lowerRes.isCorrect, true);

    const incorrectRes = evaluateRadixSortAnswer(q1, "B");
    assert.equal(incorrectRes.isCorrect, false);
    assert.match(incorrectRes.feedback, /try again/i);
    assert.ok(incorrectRes.correctAnswerDisplay.length > 0);
  });

  it("grades LSD vs MSD direction question correctly (Q2)", () => {
    const q2 = RADIX_SORT_QUESTIONS.find((q) => q.id === 2);
    assert.ok(q2);

    assert.equal(evaluateRadixSortAnswer(q2, "A").isCorrect, true);
    assert.equal(evaluateRadixSortAnswer(q2, "C").isCorrect, false);
  });

  it("grades numeric digit extraction question correctly (Q3)", () => {
    const q3 = RADIX_SORT_QUESTIONS.find((q) => q.id === 3);
    assert.ok(q3);

    assert.equal(evaluateRadixSortAnswer(q3, "4").isCorrect, true);
    assert.equal(evaluateRadixSortAnswer(q3, 4).isCorrect, true);
    assert.equal(evaluateRadixSortAnswer(q3, "2").isCorrect, false);
  });

  it("grades numeric total passes question correctly (Q4)", () => {
    const q4 = RADIX_SORT_QUESTIONS.find((q) => q.id === 4);
    assert.ok(q4);

    assert.equal(evaluateRadixSortAnswer(q4, "3").isCorrect, true);
    assert.equal(evaluateRadixSortAnswer(q4, 3).isCorrect, true);
    assert.equal(evaluateRadixSortAnswer(q4, "2").isCorrect, false);
  });

  it("grades numeric digit frequency question correctly (Q7)", () => {
    const q7 = RADIX_SORT_QUESTIONS.find((q) => q.id === 7);
    assert.ok(q7);

    assert.equal(evaluateRadixSortAnswer(q7, "2").isCorrect, true);
    assert.equal(evaluateRadixSortAnswer(q7, "0").isCorrect, false);
  });

  it("grades pass 1 trace MCQ question correctly (Q8)", () => {
    const q8 = RADIX_SORT_QUESTIONS.find((q) => q.id === 8);
    assert.ok(q8);

    assert.equal(evaluateRadixSortAnswer(q8, "A").isCorrect, true);
    assert.equal(evaluateRadixSortAnswer(q8, "B").isCorrect, false);
  });

  it("grades time complexity question correctly (Q9)", () => {
    const q9 = RADIX_SORT_QUESTIONS.find((q) => q.id === 9);
    assert.ok(q9);

    assert.equal(evaluateRadixSortAnswer(q9, "A").isCorrect, true);
    assert.equal(evaluateRadixSortAnswer(q9, "B").isCorrect, false);
  });

  it("handles empty and invalid answers deterministically", () => {
    const q1 = RADIX_SORT_QUESTIONS[0];
    const emptyRes = evaluateRadixSortAnswer(q1, "");
    assert.equal(emptyRes.isCorrect, false);
    assert.match(emptyRes.feedback, /please/i);

    const spaceRes = evaluateRadixSortAnswer(q1, "   ");
    assert.equal(spaceRes.isCorrect, false);
    assert.match(spaceRes.feedback, /please/i);
  });
});

describe("Radix Sort Practice - Progress & Scoring", () => {
  const total = RADIX_SORT_QUESTIONS.length;

  it("calculates progress for unattempted practice", () => {
    const progress = calculateRadixSortProgress({}, total);
    assert.equal(progress.attemptedCount, 0);
    assert.equal(progress.correctCount, 0);
    assert.equal(progress.percentage, 0);
  });

  it("calculates progress for partially answered practice", () => {
    const stats = {
      1: { attempted: true, answeredCorrectly: true },
      2: { attempted: true, answeredCorrectly: false },
      3: { attempted: true, answeredCorrectly: true }
    };
    const progress = calculateRadixSortProgress(stats, total);
    assert.equal(progress.attemptedCount, 3);
    assert.equal(progress.correctCount, 2);
    assert.equal(progress.percentage, Math.round((2 / total) * 100));
  });

  it("calculates progress for 100% correct completion", () => {
    const stats = {};
    for (let i = 1; i <= total; i++) {
      stats[i] = { attempted: true, answeredCorrectly: true };
    }
    const progress = calculateRadixSortProgress(stats, total);
    assert.equal(progress.attemptedCount, total);
    assert.equal(progress.correctCount, total);
    assert.equal(progress.percentage, 100);
  });
});
