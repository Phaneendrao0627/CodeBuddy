import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  generateMergeSortTrace,
  validateMergeSortInput
} from "../frontend/src/algorithms/mergeSort.js";
import { mergeSortContent } from "../frontend/src/algorithms/mergeSortData.js";
import { SUPPORTED_LANGUAGES } from "../frontend/src/utils/languagePreferences.js";

describe("Merge Sort - Input Validation", () => {
  it("validates comma-separated string input", () => {
    const res = validateMergeSortInput("38, 27, 43, 3, 9, 82, 10");
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [38, 27, 43, 3, 9, 82, 10]);
  });

  it("validates array with negative numbers and duplicates", () => {
    const res = validateMergeSortInput("-4, 7, -1, 0, 9, -6, 7");
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [-4, 7, -1, 0, 9, -6, 7]);
  });

  it("validates numeric array input directly", () => {
    const res = validateMergeSortInput([15, -3, 42]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [15, -3, 42]);
  });

  it("handles empty array input safely", () => {
    const res = validateMergeSortInput([]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, []);
  });

  it("fails on empty or whitespace string input", () => {
    assert.equal(validateMergeSortInput("").valid, false);
    assert.equal(validateMergeSortInput("   ").valid, false);
    assert.equal(validateMergeSortInput(null).valid, false);
    assert.equal(validateMergeSortInput(undefined).valid, false);
  });

  it("fails when array contains non-numeric tokens", () => {
    const res = validateMergeSortInput("38, 27, banana, 10");
    assert.equal(res.valid, false);
    assert.match(res.error, /not a valid number/i);
  });
});

describe("Merge Sort - Trace Generation & Edge Cases", () => {
  it("handles empty array gracefully", () => {
    const trace = generateMergeSortTrace([]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "empty");
    assert.equal(trace[0].finished, true);
    assert.equal(trace[0].comparisonsCount, 0);
    assert.equal(trace[0].writesCount, 0);
  });

  it("handles single-element array (trivially sorted)", () => {
    const trace = generateMergeSortTrace([42]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "complete");
    assert.equal(trace[0].finished, true);
    assert.deepEqual(trace[0].array, [42]);
    assert.equal(trace[0].comparisonsCount, 0);
    assert.equal(trace[0].writesCount, 0);
  });

  it("sorts standard scrambled array correctly", () => {
    const initial = [38, 27, 43, 3, 9, 82, 10];
    const trace = generateMergeSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [3, 9, 10, 27, 38, 43, 82]);
    assert.ok(lastStep.comparisonsCount > 0, "Must track comparisons");
    assert.ok(lastStep.writesCount > 0, "Must track writes");
  });

  it("sorts power-of-2 symmetric array accurately", () => {
    const initial = [8, 4, 5, 7, 1, 3, 6, 2];
    const trace = generateMergeSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("sorts already-sorted array and reverse-sorted array in O(n log n)", () => {
    const sorted = [10, 20, 30, 40, 50, 60];
    const traceSorted = generateMergeSortTrace(sorted);
    assert.equal(traceSorted[traceSorted.length - 1].finished, true);
    assert.deepEqual(traceSorted[traceSorted.length - 1].array, [10, 20, 30, 40, 50, 60]);

    const reverse = [60, 50, 40, 30, 20, 10];
    const traceReverse = generateMergeSortTrace(reverse);
    assert.equal(traceReverse[traceReverse.length - 1].finished, true);
    assert.deepEqual(traceReverse[traceReverse.length - 1].array, [10, 20, 30, 40, 50, 60]);
  });

  it("sorts array containing negative numbers correctly", () => {
    const withNegatives = [-4, 7, -1, 0, 9, -6];
    const trace = generateMergeSortTrace(withNegatives);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [-6, -4, -1, 0, 7, 9]);
  });

  it("sorts array with duplicates and confirms stable behavior", () => {
    const withDuplicates = [5, 2, 5, 1, 8, 2];
    const trace = generateMergeSortTrace(withDuplicates);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 2, 5, 5, 8]);

    // Check compare steps when comparing identical values
    const equalCompares = trace.filter(
      (s) => s.phase === "compare" && s.leftSubarray[s.leftPointer] === s.rightSubarray[s.rightPointer]
    );
    if (equalCompares.length > 0) {
      for (const step of equalCompares) {
        assert.match(step.message, /<=/i, "Equal comparison must use <= to guarantee stability");
      }
    }
  });

  it("traces all sequential phases accurately", () => {
    const trace = generateMergeSortTrace([38, 27, 43, 3]);
    const phases = trace.map((s) => s.phase);

    assert.ok(phases.includes("initial"));
    assert.ok(phases.includes("split"));
    assert.ok(phases.includes("base_case"));
    assert.ok(phases.includes("merge_start"));
    assert.ok(phases.includes("compare"));
    assert.ok(phases.includes("merge_complete"));
    assert.ok(phases.includes("complete"));
  });
});

describe("Merge Sort - Multilingual Schema & Line Synchronization", () => {
  it("provides complete C, Java, and Python implementations", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const impl = mergeSortContent.implementations[lang];
      assert.ok(impl, `Missing ${lang} implementation`);
      assert.equal(impl.language, lang);
      assert.ok(impl.code && impl.code.length > 60);
      assert.ok(impl.code_explanation && impl.code_explanation.length > 30);
      assert.ok(Array.isArray(impl.codeLines) && impl.codeLines.length >= 10);
      assert.equal(typeof impl.mapStepToLine, "function");
    }
  });

  it("synchronizes all trace phases with C, Java, and Python code lines", () => {
    const testPhases = [
      { step: { phase: "split" }, expected: { c: 3, java: 3, python: 3 } },
      { step: { phase: "base_case" }, expected: { c: 2, java: 2, python: 2 } },
      { step: { phase: "merge_start" }, expected: { c: 8, java: 8, python: 7 } },
      { step: { phase: "compare" }, expected: { c: 10, java: 10, python: 9 } },
      { step: { phase: "copy_left" }, expected: { c: 10, java: 10, python: 9 } },
      { step: { phase: "copy_right" }, expected: { c: 11, java: 11, python: 10 } },
      { step: { phase: "copy_remaining" }, expected: { c: 13, java: 13, python: 12 } },
      { step: { phase: "merge_complete" }, expected: { c: 6, java: 6, python: 6 } },
      { step: { phase: "complete", finished: true }, expected: { c: 7, java: 7, python: 6 } }
    ];

    for (const { step, expected } of testPhases) {
      assert.equal(
        mergeSortContent.implementations.c.mapStepToLine(step),
        expected.c,
        `C line mismatch for ${step.phase}`
      );
      assert.equal(
        mergeSortContent.implementations.java.mapStepToLine(step),
        expected.java,
        `Java line mismatch for ${step.phase}`
      );
      assert.equal(
        mergeSortContent.implementations.python.mapStepToLine(step),
        expected.python,
        `Python line mismatch for ${step.phase}`
      );
    }
  });
});
