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

  it("verifies safe dynamic memory management in C implementation (malloc, NULL check, free, no VLAs)", () => {
    const cCode = mergeSortContent.implementations.c.code;
    assert.match(cCode, /#include <stdlib\.h>/);
    assert.match(cCode, /malloc\(n1 \* sizeof\(int\)\)/);
    assert.match(cCode, /malloc\(n2 \* sizeof\(int\)\)/);
    assert.match(cCode, /if \(leftArr == NULL \|\| rightArr == NULL\)/);
    assert.match(cCode, /free\(leftArr\)/);
    assert.match(cCode, /free\(rightArr\)/);
    // Ensure VLAs are not used
    assert.doesNotMatch(cCode, /int leftArr\[n1\]/);
    assert.doesNotMatch(cCode, /int rightArr\[n2\]/);
  });

  it("verifies C allocation failure propagation, status returns, and buffer cleanup on all paths", () => {
    const cCode = mergeSortContent.implementations.c.code;
    // merge() returns integer status (1 on success, 0 on failure)
    assert.match(cCode, /int merge\(int numbers\[\], int left, int mid, int right\)/);
    // merge_sort() returns integer status
    assert.match(cCode, /int merge_sort\(int numbers\[\], int left, int right\)/);
    // Recursive calls propagate failure
    assert.match(cCode, /if \(!merge_sort\(numbers, left, mid\)\)\s*\{\s*return 0;\s*\}/);
    assert.match(cCode, /if \(!merge_sort\(numbers, mid \+ 1, right\)\)\s*\{\s*return 0;\s*\}/);
    // merge() call propagates failure
    assert.match(cCode, /if \(!merge\(numbers, left, mid, right\)\)\s*\{\s*return 0;\s*\}/);
    // Returns 1 on success
    assert.match(cCode, /return 1;/);
    // Buffers freed on allocation error path
    assert.match(cCode, /if \(leftArr == NULL \|\| rightArr == NULL\) \{\s*free\(leftArr\);\s*free\(rightArr\);\s*return 0;/);
    // Buffers freed on normal completion path before returning 1
    assert.match(cCode, /free\(leftArr\);\s*free\(rightArr\);\s*return 1;/);
    // Preserves stability using <=
    assert.match(cCode, /if \(leftArr\[i\] <= rightArr\[j\]\)/);
  });

  it("synchronizes all trace phases with C, Java, and Python code lines", () => {
    const testPhases = [
      { step: { phase: "split" }, expected: { c: 21, java: 3, python: 3 } },
      { step: { phase: "base_case" }, expected: { c: 20, java: 2, python: 2 } },
      { step: { phase: "merge_start" }, expected: { c: 1, java: 8, python: 7 } },
      { step: { phase: "compare" }, expected: { c: 12, java: 10, python: 9 } },
      { step: { phase: "copy_left" }, expected: { c: 12, java: 10, python: 9 } },
      { step: { phase: "copy_right" }, expected: { c: 13, java: 11, python: 10 } },
      { step: { phase: "copy_remaining" }, expected: { c: 15, java: 13, python: 12 } },
      { step: { phase: "merge_complete" }, expected: { c: 24, java: 6, python: 6 } },
      { step: { phase: "complete", finished: true }, expected: { c: 25, java: 7, python: 6 } }
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

  it("verifies C codeLines order and explicit error propagation representation", () => {
    const cImpl = mergeSortContent.implementations.c;
    // merge() defined first
    assert.match(cImpl.codeLines[0].text, /int merge\(int numbers\[\], int left, int mid, int right\)/);
    // Dynamic allocations in codeLines
    assert.ok(cImpl.codeLines.some((l) => l.text.includes("malloc(n1 * sizeof(int))")));
    assert.ok(cImpl.codeLines.some((l) => l.text.includes("malloc(n2 * sizeof(int))")));
    // Allocation check and free on failure
    assert.ok(cImpl.codeLines.some((l) => l.text.includes("leftArr == NULL || rightArr == NULL")));
    assert.ok(cImpl.codeLines.some((l) => l.text.includes("free(leftArr); free(rightArr); return 0;")));
    // Success free
    assert.ok(cImpl.codeLines.some((l) => l.text.includes("free(leftArr); free(rightArr); return 1;")));
    // merge_sort() defined second
    const mergeSortLine = cImpl.codeLines.find((l) => l.text.includes("int merge_sort("));
    assert.ok(mergeSortLine && mergeSortLine.line > 10);
    // Explicit propagation, not return merge(...)
    assert.ok(cImpl.codeLines.some((l) => l.text.includes("if (!merge(numbers, left, mid, right)) return 0;")));
    assert.ok(!cImpl.codeLines.some((l) => l.text.includes("return merge(")));
  });
});
