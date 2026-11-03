import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  generateInsertionSortTrace,
  validateInsertionSortInput
} from "../frontend/src/algorithms/insertionSort.js";
import { insertionSortContent } from "../frontend/src/algorithms/insertionSortData.js";
import { SUPPORTED_LANGUAGES } from "../frontend/src/utils/languagePreferences.js";

describe("Insertion Sort - Input Validation", () => {
  it("validates comma-separated string input", () => {
    const res = validateInsertionSortInput("8, 4, 1, 5, 9, 2");
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [8, 4, 1, 5, 9, 2]);
  });

  it("validates array with negative numbers and duplicates", () => {
    const res = validateInsertionSortInput("5, -2, 3, -2, 8, 1");
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [5, -2, 3, -2, 8, 1]);
  });

  it("validates numeric array input directly", () => {
    const res = validateInsertionSortInput([10, -5, 20]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [10, -5, 20]);
  });

  it("handles empty array input safely", () => {
    const res = validateInsertionSortInput([]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, []);
  });

  it("fails on empty or whitespace string input", () => {
    assert.equal(validateInsertionSortInput("").valid, false);
    assert.equal(validateInsertionSortInput("   ").valid, false);
    assert.equal(validateInsertionSortInput(null).valid, false);
    assert.equal(validateInsertionSortInput(undefined).valid, false);
  });

  it("fails when array contains non-numeric tokens", () => {
    const res = validateInsertionSortInput("8, 4, apple, 5");
    assert.equal(res.valid, false);
    assert.match(res.error, /not a valid number/i);
  });
});

describe("Insertion Sort - Trace Generation & Edge Cases", () => {
  it("handles empty array gracefully", () => {
    const trace = generateInsertionSortTrace([]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "empty");
    assert.equal(trace[0].finished, true);
    assert.equal(trace[0].comparisonsCount, 0);
    assert.equal(trace[0].shiftsCount, 0);
  });

  it("handles single-element array (trivially sorted)", () => {
    const trace = generateInsertionSortTrace([42]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "complete");
    assert.equal(trace[0].finished, true);
    assert.deepEqual(trace[0].array, [42]);
    assert.equal(trace[0].comparisonsCount, 0);
    assert.equal(trace[0].shiftsCount, 0);
  });

  it("sorts standard scrambled array correctly", () => {
    const initial = [8, 4, 1, 5, 9, 2];
    const trace = generateInsertionSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 4, 5, 8, 9]);
    assert.equal(lastStep.sortedIndices.length, 6);
  });

  it("verifies Best Case O(n) on already sorted arrays (n - 1 comparisons, 0 shifts)", () => {
    const sortedArray = [1, 2, 3, 4, 5, 6];
    const n = sortedArray.length;
    const trace = generateInsertionSortTrace(sortedArray);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 3, 4, 5, 6]);
    assert.equal(lastStep.comparisonsCount, n - 1, "Best case should have exactly n - 1 comparisons");
    assert.equal(lastStep.shiftsCount, 0, "Best case should have exactly 0 shifts");
  });

  it("verifies Worst Case O(n²) on reverse-sorted arrays (n(n - 1)/2 comparisons and shifts)", () => {
    const reverseArray = [5, 4, 3, 2, 1];
    const n = reverseArray.length;
    const expectedComparisons = (n * (n - 1)) / 2; // 10
    const expectedShifts = (n * (n - 1)) / 2; // 10

    const trace = generateInsertionSortTrace(reverseArray);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 3, 4, 5]);
    assert.equal(lastStep.comparisonsCount, expectedComparisons, "Worst case comparisons count match");
    assert.equal(lastStep.shiftsCount, expectedShifts, "Worst case shifts count match");
  });

  it("sorts array containing negative numbers correctly", () => {
    const withNegatives = [3, -5, 0, 7, -1];
    const trace = generateInsertionSortTrace(withNegatives);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [-5, -1, 0, 3, 7]);
  });

  it("sorts array with duplicate values and verifies stability", () => {
    // Array with duplicates
    const withDuplicates = [5, 2, 5, 1, 5];
    const trace = generateInsertionSortTrace(withDuplicates);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 5, 5, 5]);

    // Verify stability: during comparison when numbers[j] === key (5 === 5),
    // numbers[j] > key is false, so it does NOT shift.
    const duplicateCompares = trace.filter(
      (s) => s.phase === "compare" && s.key === 5 && s.array[s.compareIndex] === 5
    );
    assert.ok(duplicateCompares.length > 0, "Should compare equal elements");
    for (const step of duplicateCompares) {
      assert.match(step.message, /FALSE/i, "Equal element comparison must evaluate to false to maintain stability");
    }
  });

  it("traces all sequential phases accurately", () => {
    const trace = generateInsertionSortTrace([3, 1, 2]);
    const phases = trace.map((s) => s.phase);

    assert.ok(phases.includes("initial"));
    assert.ok(phases.includes("select_key"));
    assert.ok(phases.includes("compare"));
    assert.ok(phases.includes("shift"));
    assert.ok(phases.includes("insert"));
    assert.ok(phases.includes("pass_complete"));
    assert.ok(phases.includes("complete"));
  });
});

describe("Insertion Sort - Multilingual Schema & Line Synchronization", () => {
  it("provides complete C, Java, and Python implementations", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const impl = insertionSortContent.implementations[lang];
      assert.ok(impl, `Missing ${lang} implementation`);
      assert.equal(impl.language, lang);
      assert.ok(impl.code && impl.code.length > 60);
      assert.ok(impl.code_explanation && impl.code_explanation.length > 30);
      assert.ok(Array.isArray(impl.codeLines) && impl.codeLines.length >= 8);
      assert.equal(typeof impl.mapStepToLine, "function");
    }
  });

  it("synchronizes all trace phases with C, Java, and Python code lines", () => {
    const testPhases = [
      { step: { phase: "select_key" }, expected: { c: 3, java: 3, python: 3 } },
      { step: { phase: "compare" }, expected: { c: 5, java: 5, python: 5 } },
      { step: { phase: "shift" }, expected: { c: 6, java: 6, python: 6 } },
      { step: { phase: "insert" }, expected: { c: 9, java: 9, python: 8 } },
      { step: { phase: "pass_complete" }, expected: { c: 10, java: 10, python: 2 } },
      { step: { phase: "complete", finished: true }, expected: { c: 11, java: 11, python: 8 } }
    ];

    for (const { step, expected } of testPhases) {
      assert.equal(
        insertionSortContent.implementations.c.mapStepToLine(step),
        expected.c,
        `C line mismatch for ${step.phase}`
      );
      assert.equal(
        insertionSortContent.implementations.java.mapStepToLine(step),
        expected.java,
        `Java line mismatch for ${step.phase}`
      );
      assert.equal(
        insertionSortContent.implementations.python.mapStepToLine(step),
        expected.python,
        `Python line mismatch for ${step.phase}`
      );
    }
  });
});
