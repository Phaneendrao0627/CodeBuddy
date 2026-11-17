import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { COUNTING_SORT_QUESTIONS } from "../frontend/src/algorithms/countingSortPracticeData.js";
import {
  evaluateCountingSortAnswer,
  calculateCountingSortProgress
} from "../frontend/src/algorithms/countingSortPractice.js";

describe("Counting Sort Practice - Question Bank Integrity", () => {
  it("contains at least 10 structured questions progressing in difficulty", () => {
    assert.ok(
      Array.isArray(COUNTING_SORT_QUESTIONS),
      "Questions must be exported as an array"
    );
    assert.ok(
      COUNTING_SORT_QUESTIONS.length >= 10,
      `Expected at least 10 questions, found ${COUNTING_SORT_QUESTIONS.length}`
    );

    const difficulties = COUNTING_SORT_QUESTIONS.map((q) => q.difficulty);
    assert.ok(difficulties.includes("Beginner"), "Must include Beginner questions");
    assert.ok(difficulties.includes("Intermediate"), "Must include Intermediate questions");
    assert.ok(difficulties.includes("Advanced"), "Must include Advanced questions");
  });

  it("covers required topics: non-comparison definition, min/max, count array size, occurrences, cumulative counts, right-to-left stability, complexity, and limitations", () => {
    const types = COUNTING_SORT_QUESTIONS.map((q) => q.type);
    assert.ok(types.includes("counting_sort_definition"));
    assert.ok(types.includes("find_min_max"));
    assert.ok(types.includes("count_array_size"));
    assert.ok(types.includes("count_occurrences_2"));
    assert.ok(types.includes("cumulative_count_purpose"));
    assert.ok(types.includes("cumulative_count_value"));
    assert.ok(types.includes("right_to_left_stability"));
    assert.ok(types.includes("complexity_analysis"));
    assert.ok(types.includes("stability_property"));
    assert.ok(types.includes("when_not_to_use"));
  });

  it("verifies all questions have required fields", () => {
    for (const q of COUNTING_SORT_QUESTIONS) {
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

describe("Counting Sort Practice - Deterministic Grading", () => {
  it("grades multiple-choice definition question correctly (Q1)", () => {
    const q1 = COUNTING_SORT_QUESTIONS.find((q) => q.id === 1);
    assert.ok(q1);

    const correctRes = evaluateCountingSortAnswer(q1, "A");
    assert.equal(correctRes.isCorrect, true);
    assert.match(correctRes.feedback, /correct/i);

    // Case insensitivity
    const lowerRes = evaluateCountingSortAnswer(q1, "a");
    assert.equal(lowerRes.isCorrect, true);

    const incorrectRes = evaluateCountingSortAnswer(q1, "B");
    assert.equal(incorrectRes.isCorrect, false);
    assert.match(incorrectRes.feedback, /try again/i);
    assert.ok(incorrectRes.correctAnswerDisplay.length > 0);
  });

  it("grades min/max identification question correctly (Q2)", () => {
    const q2 = COUNTING_SORT_QUESTIONS.find((q) => q.id === 2);
    assert.ok(q2);

    assert.equal(evaluateCountingSortAnswer(q2, "A").isCorrect, true);
    assert.equal(evaluateCountingSortAnswer(q2, "B").isCorrect, false);
  });

  it("grades numeric count array size question correctly (Q3)", () => {
    const q3 = COUNTING_SORT_QUESTIONS.find((q) => q.id === 3);
    assert.ok(q3);

    assert.equal(evaluateCountingSortAnswer(q3, "8").isCorrect, true);
    assert.equal(evaluateCountingSortAnswer(q3, 8).isCorrect, true);
    assert.equal(evaluateCountingSortAnswer(q3, "5").isCorrect, false);
  });

  it("grades numeric count of value 2 question correctly (Q4)", () => {
    const q4 = COUNTING_SORT_QUESTIONS.find((q) => q.id === 4);
    assert.ok(q4);

    assert.equal(evaluateCountingSortAnswer(q4, "2").isCorrect, true);
    assert.equal(evaluateCountingSortAnswer(q4, "0").isCorrect, false);
  });

  it("grades numeric cumulative count[2] question correctly (Q7)", () => {
    const q7 = COUNTING_SORT_QUESTIONS.find((q) => q.id === 7);
    assert.ok(q7);

    assert.equal(evaluateCountingSortAnswer(q7, "5").isCorrect, true);
    assert.equal(evaluateCountingSortAnswer(q7, "2").isCorrect, false);
  });

  it("grades stability multiple-choice question correctly (Q8)", () => {
    const q8 = COUNTING_SORT_QUESTIONS.find((q) => q.id === 8);
    assert.ok(q8);

    assert.equal(evaluateCountingSortAnswer(q8, "A").isCorrect, true);
    assert.equal(evaluateCountingSortAnswer(q8, "C").isCorrect, false);
  });

  it("grades complexity question correctly (Q9)", () => {
    const q9 = COUNTING_SORT_QUESTIONS.find((q) => q.id === 9);
    assert.ok(q9);

    assert.equal(evaluateCountingSortAnswer(q9, "A").isCorrect, true);
    assert.equal(evaluateCountingSortAnswer(q9, "B").isCorrect, false);
  });

  it("handles empty and invalid answers deterministically", () => {
    const q1 = COUNTING_SORT_QUESTIONS[0];
    const emptyRes = evaluateCountingSortAnswer(q1, "");
    assert.equal(emptyRes.isCorrect, false);
    assert.match(emptyRes.feedback, /please/i);

    const spaceRes = evaluateCountingSortAnswer(q1, "   ");
    assert.equal(spaceRes.isCorrect, false);
    assert.match(spaceRes.feedback, /please/i);
  });
});

describe("Counting Sort Practice - Progress & Scoring", () => {
  const total = COUNTING_SORT_QUESTIONS.length;

  it("calculates progress for unattempted practice", () => {
    const progress = calculateCountingSortProgress({}, total);
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
    const progress = calculateCountingSortProgress(stats, total);
    assert.equal(progress.attemptedCount, 3);
    assert.equal(progress.correctCount, 2);
    assert.equal(progress.percentage, Math.round((2 / total) * 100));
  });

  it("calculates progress for 100% correct completion", () => {
    const stats = {};
    for (let i = 1; i <= total; i++) {
      stats[i] = { attempted: true, answeredCorrectly: true };
    }
    const progress = calculateCountingSortProgress(stats, total);
    assert.equal(progress.attemptedCount, total);
    assert.equal(progress.correctCount, total);
    assert.equal(progress.percentage, 100);
  });
});
