import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  generateSelectionSortTrace,
  validateSelectionSortInput
} from "../frontend/src/algorithms/selectionSort.js";
import { selectionSortContent } from "../frontend/src/algorithms/selectionSortData.js";
import { SUPPORTED_LANGUAGES } from "../frontend/src/utils/languagePreferences.js";

describe("Selection Sort - Input Validation", () => {
  it("validates comma-separated string input", () => {
    const res = validateSelectionSortInput("64, 25, 12, 22, 11");
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [64, 25, 12, 22, 11]);
  });

  it("validates array with negative numbers and duplicates", () => {
    const res = validateSelectionSortInput("-3, 5, -8, 2, 0, -1, 5");
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [-3, 5, -8, 2, 0, -1, 5]);
  });

  it("validates numeric array input directly", () => {
    const res = validateSelectionSortInput([10, -5, 20]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [10, -5, 20]);
  });

  it("handles empty array input safely", () => {
    const res = validateSelectionSortInput([]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, []);
  });

  it("fails on empty or whitespace string input", () => {
    assert.equal(validateSelectionSortInput("").valid, false);
    assert.equal(validateSelectionSortInput("   ").valid, false);
    assert.equal(validateSelectionSortInput(null).valid, false);
    assert.equal(validateSelectionSortInput(undefined).valid, false);
  });

  it("fails when array contains non-numeric tokens", () => {
    const res = validateSelectionSortInput("64, 25, apple, 11");
    assert.equal(res.valid, false);
    assert.match(res.error, /not a valid number/i);
  });
});

describe("Selection Sort - Trace Generation & Edge Cases", () => {
  it("handles empty array gracefully", () => {
    const trace = generateSelectionSortTrace([]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "empty");
    assert.equal(trace[0].finished, true);
    assert.equal(trace[0].comparisonsCount, 0);
    assert.equal(trace[0].swapsCount, 0);
  });

  it("handles single-element array (trivially sorted)", () => {
    const trace = generateSelectionSortTrace([42]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "complete");
    assert.equal(trace[0].finished, true);
    assert.deepEqual(trace[0].array, [42]);
    assert.equal(trace[0].comparisonsCount, 0);
    assert.equal(trace[0].swapsCount, 0);
  });

  it("sorts standard scrambled array correctly", () => {
    const initial = [64, 25, 12, 22, 11];
    const trace = generateSelectionSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [11, 12, 22, 25, 64]);
    assert.equal(lastStep.sortedIndices.length, 5);
  });

  it("verifies Best Case O(n²) comparisons even on already sorted arrays (n(n - 1)/2 comparisons)", () => {
    const sortedArray = [10, 20, 30, 40, 50];
    const n = sortedArray.length;
    const expectedComparisons = (n * (n - 1)) / 2; // 10
    const trace = generateSelectionSortTrace(sortedArray);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [10, 20, 30, 40, 50]);
    assert.equal(lastStep.comparisonsCount, expectedComparisons, "Comparisons count must always be n(n - 1)/2");
    // Swaps should be 0 because minIdx === i at every pass
    assert.equal(lastStep.swapsCount, 0, "Already sorted array needs 0 swaps");
  });

  it("verifies Worst Case O(n²) on reverse-sorted arrays", () => {
    const reverseArray = [50, 40, 30, 20, 10];
    const n = reverseArray.length;
    const expectedComparisons = (n * (n - 1)) / 2; // 10
    const trace = generateSelectionSortTrace(reverseArray);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [10, 20, 30, 40, 50]);
    assert.equal(lastStep.comparisonsCount, expectedComparisons);
    assert.ok(lastStep.swapsCount <= n - 1, "Swaps count should be bounded by n - 1");
  });

  it("sorts array containing negative numbers correctly", () => {
    const withNegatives = [-3, 5, -8, 2, 0, -1];
    const trace = generateSelectionSortTrace(withNegatives);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [-8, -3, -1, 0, 2, 5]);
  });

  it("sorts array with duplicate values and demonstrates non-stability behavior", () => {
    const withDuplicates = [4, 2, 4, 1, 3];
    const trace = generateSelectionSortTrace(withDuplicates);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 3, 4, 4]);

    // Counterexample verification: in [4, 4, 1], 1 is swapped with index 0
    const counterTrace = generateSelectionSortTrace([4, 4, 1]);
    const pass1Swap = counterTrace.find((s) => s.phase === "swap" && s.pass === 0);
    assert.ok(pass1Swap, "Must have swap in pass 1");
    assert.equal(pass1Swap.swapFrom, 0);
    assert.equal(pass1Swap.swapTo, 2);
    // Element at index 0 (the first 4) was swapped all the way to index 2, jumping over the second 4!
    assert.deepEqual(pass1Swap.array, [1, 4, 4]);
  });

  it("traces all sequential phases accurately", () => {
    const trace = generateSelectionSortTrace([3, 1, 2]);
    const phases = trace.map((s) => s.phase);

    assert.ok(phases.includes("initial"));
    assert.ok(phases.includes("start_pass"));
    assert.ok(phases.includes("compare"));
    assert.ok(phases.includes("update_min"));
    assert.ok(phases.includes("swap"));
    assert.ok(phases.includes("pass_complete"));
    assert.ok(phases.includes("complete"));
  });

  it("verifies swap count is strictly bounded by n - 1", () => {
    const scrambled = [64, 25, 12, 22, 11, 90, 8];
    const n = scrambled.length;
    const trace = generateSelectionSortTrace(scrambled);
    const lastStep = trace[trace.length - 1];

    assert.ok(lastStep.swapsCount <= n - 1, `Swaps (${lastStep.swapsCount}) must not exceed n - 1 (${n - 1})`);
  });
});

describe("Selection Sort - Multilingual Schema & Line Synchronization", () => {
  it("provides complete C, Java, and Python implementations", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const impl = selectionSortContent.implementations[lang];
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
      { step: { phase: "start_pass" }, expected: { c: 3, java: 3, python: 3 } },
      { step: { phase: "compare" }, expected: { c: 5, java: 5, python: 5 } },
      { step: { phase: "update_min" }, expected: { c: 6, java: 6, python: 6 } },
      { step: { phase: "swap" }, expected: { c: 10, java: 10, python: 8 } },
      { step: { phase: "pass_complete" }, expected: { c: 12, java: 12, python: 2 } },
      { step: { phase: "complete", finished: true }, expected: { c: 13, java: 13, python: 8 } }
    ];

    for (const { step, expected } of testPhases) {
      assert.equal(
        selectionSortContent.implementations.c.mapStepToLine(step),
        expected.c,
        `C line mismatch for ${step.phase}`
      );
      assert.equal(
        selectionSortContent.implementations.java.mapStepToLine(step),
        expected.java,
        `Java line mismatch for ${step.phase}`
      );
      assert.equal(
        selectionSortContent.implementations.python.mapStepToLine(step),
        expected.python,
        `Python line mismatch for ${step.phase}`
      );
    }
  });
});
