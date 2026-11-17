import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  evaluateHeapSortAnswer,
  calculateHeapSortProgress
} from "../frontend/src/algorithms/heapSortPractice.js";
import { HEAP_SORT_QUESTIONS } from "../frontend/src/algorithms/heapSortPracticeData.js";

describe("Heap Sort Practice - Question Bank Integrity", () => {
  it("contains at least 10 structured questions progressing in difficulty", () => {
    assert.ok(HEAP_SORT_QUESTIONS.length >= 10, "Should have at least 10 questions");

    const hasBeginner = HEAP_SORT_QUESTIONS.some((q) => q.difficulty === "Beginner");
    const hasIntermediate = HEAP_SORT_QUESTIONS.some((q) => q.difficulty === "Intermediate");
    const hasAdvanced = HEAP_SORT_QUESTIONS.some((q) => q.difficulty === "Advanced" || q.difficulty === "Challenging");

    assert.equal(hasBeginner, true, "Should have beginner questions");
    assert.equal(hasIntermediate, true, "Should have intermediate questions");
    assert.equal(hasAdvanced, true, "Should have advanced questions");
  });

  it("covers required topics: max heap definition, tree relationships, index calculation, largest element position, build heap, starting node, next swap, extraction, complexity, properties", () => {
    const types = HEAP_SORT_QUESTIONS.map((q) => q.type);
    assert.ok(types.includes("max_heap_definition"), "Must include max_heap_definition question");
    assert.ok(types.includes("tree_relationships"), "Must include tree_relationships question");
    assert.ok(types.includes("index_calculation"), "Must include index_calculation question");
    assert.ok(types.includes("largest_element_position"), "Must include largest_element_position question");
    assert.ok(types.includes("build_max_heap"), "Must include build_max_heap question");
    assert.ok(types.includes("last_non_leaf_node"), "Must include last_non_leaf_node question");
    assert.ok(types.includes("identify_next_swap"), "Must include identify_next_swap question");
    assert.ok(types.includes("trace_extraction"), "Must include trace_extraction question");
    assert.ok(types.includes("complexity_analysis"), "Must include complexity_analysis question");
    assert.ok(types.includes("properties_stability"), "Must include properties_stability question");
  });

  it("verifies all questions have required fields (id, question, hint, explanation, correctAnswer, array)", () => {
    for (const q of HEAP_SORT_QUESTIONS) {
      assert.ok(q.id, `Question missing id`);
      assert.ok(q.question, `Question ${q.id} missing question text`);
      assert.ok(q.hint, `Question ${q.id} missing hint`);
      assert.ok(q.explanation, `Question ${q.id} missing explanation`);
      assert.ok(q.correctAnswer !== undefined, `Question ${q.id} missing correctAnswer`);
      assert.ok(Array.isArray(q.array), `Question ${q.id} missing array`);
    }
  });
});

describe("Heap Sort Practice - Deterministic Grading", () => {
  const q1 = HEAP_SORT_QUESTIONS.find((q) => q.id === 1); // max_heap_definition: "A"
  const q2 = HEAP_SORT_QUESTIONS.find((q) => q.id === 2); // tree_relationships: "A"
  const q3 = HEAP_SORT_QUESTIONS.find((q) => q.id === 3); // left child index: 7
  const q4 = HEAP_SORT_QUESTIONS.find((q) => q.id === 4); // root index: 0
  const q5 = HEAP_SORT_QUESTIONS.find((q) => q.id === 5); // build max heap result: "A"
  const q6 = HEAP_SORT_QUESTIONS.find((q) => q.id === 6); // last non-leaf index: 2
  const q7 = HEAP_SORT_QUESTIONS.find((q) => q.id === 7); // swap with largest child: 40
  const q8 = HEAP_SORT_QUESTIONS.find((q) => q.id === 8); // target extraction index: 5
  const q9 = HEAP_SORT_QUESTIONS.find((q) => q.id === 9); // complexity: "A"
  const q10 = HEAP_SORT_QUESTIONS.find((q) => q.id === 10); // stability: "A"

  it("grades multiple-choice max heap definition question correctly", () => {
    const resCorrect = evaluateHeapSortAnswer(q1, "A");
    assert.equal(resCorrect.isCorrect, true);
    assert.match(resCorrect.feedback, /Correct/i);

    const resLower = evaluateHeapSortAnswer(q1, "a");
    assert.equal(resLower.isCorrect, true);

    const resWrong = evaluateHeapSortAnswer(q1, "B");
    assert.equal(resWrong.isCorrect, false);
    assert.match(resWrong.feedback, /Incorrect/i);
  });

  it("grades tree relationships question correctly", () => {
    const resCorrect = evaluateHeapSortAnswer(q2, "A");
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateHeapSortAnswer(q2, "C");
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades numeric child index calculation question correctly", () => {
    const resCorrect = evaluateHeapSortAnswer(q3, 7);
    assert.equal(resCorrect.isCorrect, true);

    const resStr = evaluateHeapSortAnswer(q3, "7");
    assert.equal(resStr.isCorrect, true);

    const resWrong = evaluateHeapSortAnswer(q3, 6);
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades numeric root index question correctly", () => {
    const resCorrect = evaluateHeapSortAnswer(q4, 0);
    assert.equal(resCorrect.isCorrect, true);

    const resStr = evaluateHeapSortAnswer(q4, "0");
    assert.equal(resStr.isCorrect, true);

    const resWrong = evaluateHeapSortAnswer(q4, 1);
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades build max heap result question correctly", () => {
    const resCorrect = evaluateHeapSortAnswer(q5, "A");
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateHeapSortAnswer(q5, "B");
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades last non-leaf node index question correctly", () => {
    const resCorrect = evaluateHeapSortAnswer(q6, 2);
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateHeapSortAnswer(q6, 3);
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades next swap element question correctly", () => {
    const resCorrect = evaluateHeapSortAnswer(q7, 40);
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateHeapSortAnswer(q7, 30);
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades extraction swap index question correctly", () => {
    const resCorrect = evaluateHeapSortAnswer(q8, 5);
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateHeapSortAnswer(q8, 0);
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades time & space complexity question correctly", () => {
    const resCorrect = evaluateHeapSortAnswer(q9, "A");
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateHeapSortAnswer(q9, "B");
    assert.equal(resWrong.isCorrect, false);
  });

  it("grades stability question correctly", () => {
    const resCorrect = evaluateHeapSortAnswer(q10, "A");
    assert.equal(resCorrect.isCorrect, true);

    const resWrong = evaluateHeapSortAnswer(q10, "B");
    assert.equal(resWrong.isCorrect, false);
  });

  it("handles empty and invalid answers deterministically", () => {
    const resEmpty = evaluateHeapSortAnswer(q1, "");
    assert.equal(resEmpty.isCorrect, false);
    assert.match(resEmpty.feedback, /Please select or enter an answer/i);

    const resNull = evaluateHeapSortAnswer(q3, null);
    assert.equal(resNull.isCorrect, false);

    const resNaN = evaluateHeapSortAnswer(q3, "not-a-number");
    assert.equal(resNaN.isCorrect, false);
    assert.match(resNaN.feedback, /valid numeric value/i);
  });
});

describe("Heap Sort Practice - Progress & Scoring", () => {
  it("calculates progress for unattempted practice", () => {
    const progress = calculateHeapSortProgress({}, 10);
    assert.equal(progress.attemptedCount, 0);
    assert.equal(progress.correctCount, 0);
    assert.equal(progress.totalQuestions, 10);
    assert.equal(progress.percentage, 0);
  });

  it("calculates progress for partially answered practice", () => {
    const stats = {
      1: { answeredCorrectly: true },
      2: { answeredCorrectly: false },
      3: { answeredCorrectly: true }
    };
    const progress = calculateHeapSortProgress(stats, 10);
    assert.equal(progress.attemptedCount, 3);
    assert.equal(progress.correctCount, 2);
    assert.equal(progress.totalQuestions, 10);
    assert.equal(progress.percentage, 67);
  });

  it("calculates progress for 100% correct completion", () => {
    const stats = {};
    for (let i = 1; i <= 10; i++) {
      stats[i] = { answeredCorrectly: true };
    }
    const progress = calculateHeapSortProgress(stats, 10);
    assert.equal(progress.attemptedCount, 10);
    assert.equal(progress.correctCount, 10);
    assert.equal(progress.percentage, 100);
  });
});
