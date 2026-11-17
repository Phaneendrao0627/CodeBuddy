import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  generateQuickSortTrace,
  validateQuickSortInput
} from "../frontend/src/algorithms/quickSort.js";
import { quickSortContent } from "../frontend/src/algorithms/quickSortData.js";
import { SUPPORTED_LANGUAGES } from "../frontend/src/utils/languagePreferences.js";

describe("Quick Sort - Input Validation", () => {
  it("validates comma-separated string input", () => {
    const res = validateQuickSortInput("38, 27, 43, 3, 9, 82, 10");
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [38, 27, 43, 3, 9, 82, 10]);
  });

  it("validates array with negative numbers and duplicates", () => {
    const res = validateQuickSortInput("-4, 7, -1, 0, 9, -6, 7");
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [-4, 7, -1, 0, 9, -6, 7]);
  });

  it("validates numeric array input directly", () => {
    const res = validateQuickSortInput([15, -3, 42]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [15, -3, 42]);
  });

  it("handles empty array input safely", () => {
    const res = validateQuickSortInput([]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, []);
  });

  it("fails on empty or whitespace string input", () => {
    assert.equal(validateQuickSortInput("").valid, false);
    assert.equal(validateQuickSortInput("   ").valid, false);
    assert.equal(validateQuickSortInput(null).valid, false);
    assert.equal(validateQuickSortInput(undefined).valid, false);
  });

  it("fails when string contains non-numeric tokens", () => {
    const res = validateQuickSortInput("38, 27, banana, 10");
    assert.equal(res.valid, false);
    assert.match(res.error, /not a valid number/i);
  });

  it("fails when array contains non-numeric elements", () => {
    const res = validateQuickSortInput([38, 27, "banana", 10]);
    assert.equal(res.valid, false);
    assert.match(res.error, /must be valid numbers/i);
  });
});

describe("Quick Sort - Trace Generation & Edge Cases", () => {
  it("handles empty array gracefully", () => {
    const trace = generateQuickSortTrace([]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "empty");
    assert.equal(trace[0].finished, true);
    assert.equal(trace[0].comparisonsCount, 0);
    assert.equal(trace[0].swapsCount, 0);
    assert.deepEqual(trace[0].array, []);
    assert.equal(trace[0].pivotIndex, null);
    assert.equal(trace[0].scanIndex, null);
    assert.equal(trace[0].boundaryIndex, null);
  });

  it("handles single-element array (trivially sorted)", () => {
    const trace = generateQuickSortTrace([42]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "complete");
    assert.equal(trace[0].finished, true);
    assert.deepEqual(trace[0].array, [42]);
    assert.equal(trace[0].comparisonsCount, 0);
    assert.equal(trace[0].swapsCount, 0);
    assert.equal(trace[0].left, 0);
    assert.equal(trace[0].right, 0);
  });

  it("sorts standard scrambled array correctly", () => {
    const initial = [38, 27, 43, 3, 9, 82, 10];
    const trace = generateQuickSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [3, 9, 10, 27, 38, 43, 82]);
    assert.ok(lastStep.comparisonsCount > 0, "Must track comparisons");
    assert.ok(lastStep.swapsCount > 0, "Must track swaps");
  });

  it("sorts power-of-2 symmetric array accurately", () => {
    const initial = [8, 4, 5, 7, 1, 3, 6, 2];
    const trace = generateQuickSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("sorts already-sorted array and reverse-sorted array correctly", () => {
    const sorted = [1, 2, 3, 4, 5];
    const traceSorted = generateQuickSortTrace(sorted);
    assert.equal(traceSorted[traceSorted.length - 1].finished, true);
    assert.deepEqual(traceSorted[traceSorted.length - 1].array, [1, 2, 3, 4, 5]);

    const reverse = [5, 4, 3, 2, 1];
    const traceReverse = generateQuickSortTrace(reverse);
    assert.equal(traceReverse[traceReverse.length - 1].finished, true);
    assert.deepEqual(traceReverse[traceReverse.length - 1].array, [1, 2, 3, 4, 5]);
  });

  it("sorts array containing negative numbers correctly", () => {
    const withNegatives = [-4, 7, -1, 0, 9, -6];
    const trace = generateQuickSortTrace(withNegatives);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [-6, -4, -1, 0, 7, 9]);
  });

  it("sorts array with duplicates correctly", () => {
    const withDuplicates = [5, 2, 5, 1, 2];
    const trace = generateQuickSortTrace(withDuplicates);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 2, 5, 5]);
  });

  it("traces all sequential phases accurately", () => {
    const trace = generateQuickSortTrace([38, 27, 43, 3, 9, 82, 10]);
    const phases = new Set(trace.map((s) => s.phase));

    assert.ok(phases.has("initial"), "Missing initial phase");
    assert.ok(phases.has("pivot_selected"), "Missing pivot_selected phase");
    assert.ok(phases.has("compare"), "Missing compare phase");
    assert.ok(phases.has("swap"), "Missing swap phase");
    assert.ok(phases.has("pivot_placed"), "Missing pivot_placed phase");
    assert.ok(phases.has("partition_complete"), "Missing partition_complete phase");
    assert.ok(phases.has("recursion"), "Missing recursion phase");
    assert.ok(phases.has("base_case"), "Missing base_case phase");
    assert.ok(phases.has("complete"), "Missing complete phase");
  });

  it("guarantees every step contains all 14 required contract properties", () => {
    const trace = generateQuickSortTrace([38, 27, 43, 3, 9, 82, 10]);
    const requiredKeys = [
      "stepIndex",
      "array",
      "phase",
      "comparisonsCount",
      "swapsCount",
      "activeIndices",
      "pivotIndex",
      "scanIndex",
      "boundaryIndex",
      "left",
      "right",
      "depth",
      "message",
      "finished"
    ];

    for (let i = 0; i < trace.length; i++) {
      const step = trace[i];
      for (const key of requiredKeys) {
        assert.ok(
          key in step,
          `Step ${i} (phase: ${step.phase}) is missing required key "${key}"`
        );
      }
      assert.equal(step.stepIndex, i, `Step index must match sequence`);
      assert.ok(Array.isArray(step.array), `Step ${i} array must be an array`);
      assert.ok(typeof step.phase === "string", `Step ${i} phase must be a string`);
      assert.ok(typeof step.comparisonsCount === "number", `Step ${i} comparisonsCount must be a number`);
      assert.ok(typeof step.swapsCount === "number", `Step ${i} swapsCount must be a number`);
      assert.ok(Array.isArray(step.activeIndices), `Step ${i} activeIndices must be an array`);
      assert.ok(typeof step.left === "number", `Step ${i} left must be a number`);
      assert.ok(typeof step.right === "number", `Step ${i} right must be a number`);
      assert.ok(typeof step.depth === "number", `Step ${i} depth must be a number`);
      assert.ok(typeof step.message === "string", `Step ${i} message must be a string`);
      assert.ok(typeof step.finished === "boolean", `Step ${i} finished must be a boolean`);
    }
  });

  it("verifies trace snapshots are completely immutable and independent", () => {
    const trace = generateQuickSortTrace([5, 4, 3, 2, 1]);
    const originalStep0 = [...trace[0].array];

    // Mutate step 0 array
    trace[0].array[0] = 9999;

    // Verify step 1 array was not mutated
    assert.notEqual(trace[1].array[0], 9999);
    // Restore step 0 for purity
    trace[0].array[0] = originalStep0[0];
  });

  it("verifies Lomuto partition behavior on first partition pass", () => {
    const trace = generateQuickSortTrace([38, 27, 43, 3, 9, 82, 10]);

    // Check first pivot selected is the last element (10 at index 6)
    const firstPivotStep = trace.find((s) => s.phase === "pivot_selected");
    assert.ok(firstPivotStep);
    assert.equal(firstPivotStep.pivotIndex, 6);
    assert.equal(firstPivotStep.array[firstPivotStep.pivotIndex], 10);
    assert.equal(firstPivotStep.left, 0);
    assert.equal(firstPivotStep.right, 6);

    // Check first partition_complete step
    const firstPartitionComplete = trace.find((s) => s.phase === "partition_complete");
    assert.ok(firstPartitionComplete);
    // In [38, 27, 43, 3, 9, 82, 10], elements <= 10 are 3 and 9 (2 elements),
    // so pivot 10 must land at index 2
    assert.equal(firstPartitionComplete.pivotIndex, 2);
    assert.equal(firstPartitionComplete.array[2], 10);

    // All elements before index 2 must be <= 10
    for (let k = 0; k < 2; k++) {
      assert.ok(
        firstPartitionComplete.array[k] <= 10,
        `Element at ${k} (${firstPartitionComplete.array[k]}) must be <= pivot (10)`
      );
    }

    // All elements after index 2 must be >= 10
    for (let k = 3; k <= 6; k++) {
      assert.ok(
        firstPartitionComplete.array[k] >= 10,
        `Element at ${k} (${firstPartitionComplete.array[k]}) must be >= pivot (10)`
      );
    }
  });
});

describe("Quick Sort - Learning Content & Multilingual Schema", () => {
  it("provides comprehensive beginner-friendly educational content", () => {
    assert.ok(quickSortContent.concept && quickSortContent.concept.length > 50);
    assert.ok(quickSortContent.intuition && quickSortContent.intuition.length > 50);
    assert.ok(quickSortContent.real_world_example && quickSortContent.real_world_example.length > 30);
    assert.ok(Array.isArray(quickSortContent.algorithm) && quickSortContent.algorithm.length >= 5);
    assert.ok(quickSortContent.pseudocode && quickSortContent.pseudocode.length > 50);
    assert.ok(Array.isArray(quickSortContent.advantages) && quickSortContent.advantages.length >= 2);
    assert.ok(Array.isArray(quickSortContent.disadvantages) && quickSortContent.disadvantages.length >= 2);
    assert.ok(Array.isArray(quickSortContent.common_mistakes) && quickSortContent.common_mistakes.length >= 2);
    assert.ok(Array.isArray(quickSortContent.edge_cases) && quickSortContent.edge_cases.length >= 3);
  });

  it("provides accurate complexity and properties definitions", () => {
    assert.equal(quickSortContent.complexity.best, "O(n log n)");
    assert.equal(quickSortContent.complexity.average, "O(n log n)");
    assert.equal(quickSortContent.complexity.worst, "O(n²)");
    assert.equal(quickSortContent.complexity.space, "O(log n)");

    assert.ok(quickSortContent.complexity_explanation.time.includes("O(n²)"));
    assert.ok(quickSortContent.complexity_explanation.space.includes("O(log n)"));

    assert.match(quickSortContent.properties.stability, /Not Stable/i);
    assert.match(quickSortContent.properties.in_place, /In-Place/i);
  });

  it("provides complete C, Java, and Python implementations adhering to schema", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const impl = quickSortContent.implementations[lang];
      assert.ok(impl, `Missing ${lang} implementation`);
      assert.equal(impl.language, lang);
      assert.ok(impl.code && impl.code.length > 50, `${lang} code must not be empty`);
      assert.ok(impl.code_explanation && impl.code_explanation.length > 30, `${lang} explanation must not be empty`);
      assert.ok(Array.isArray(impl.codeLines) && impl.codeLines.length >= 5, `${lang} codeLines must have >= 5 entries`);
      assert.equal(typeof impl.mapStepToLine, "function", `${lang} mapStepToLine must be a function`);
    }

    // Top-level backward compatibility getters
    assert.equal(quickSortContent.code, quickSortContent.implementations.java.code);
    assert.equal(quickSortContent.code_explanation, quickSortContent.implementations.java.code_explanation);
  });

  it("synchronizes all trace phases with C, Java, and Python code lines", () => {
    const baseCaseStep = { phase: "base_case" };
    const pivotSelectedStep = { phase: "pivot_selected" };
    const compareStep = { phase: "compare" };
    const swapStep = { phase: "swap" };
    const pivotPlacedStep = { phase: "pivot_placed" };
    const partitionCompleteStep = { phase: "partition_complete" };
    const recursionStep = { phase: "recursion" };
    const completeStep = { phase: "complete", finished: true };

    // C line mapping
    assert.equal(quickSortContent.implementations.c.mapStepToLine(baseCaseStep), 2);
    assert.equal(quickSortContent.implementations.c.mapStepToLine(pivotSelectedStep), 8);
    assert.equal(quickSortContent.implementations.c.mapStepToLine(compareStep), 11);
    assert.equal(quickSortContent.implementations.c.mapStepToLine(swapStep), 13);
    assert.equal(quickSortContent.implementations.c.mapStepToLine(pivotPlacedStep), 16);
    assert.equal(quickSortContent.implementations.c.mapStepToLine(partitionCompleteStep), 17);
    assert.equal(quickSortContent.implementations.c.mapStepToLine(recursionStep), 3);
    assert.equal(quickSortContent.implementations.c.mapStepToLine(completeStep), 6);

    // Java line mapping
    assert.equal(quickSortContent.implementations.java.mapStepToLine(baseCaseStep), 2);
    assert.equal(quickSortContent.implementations.java.mapStepToLine(pivotSelectedStep), 8);
    assert.equal(quickSortContent.implementations.java.mapStepToLine(compareStep), 11);
    assert.equal(quickSortContent.implementations.java.mapStepToLine(swapStep), 13);
    assert.equal(quickSortContent.implementations.java.mapStepToLine(pivotPlacedStep), 16);
    assert.equal(quickSortContent.implementations.java.mapStepToLine(partitionCompleteStep), 17);
    assert.equal(quickSortContent.implementations.java.mapStepToLine(recursionStep), 3);
    assert.equal(quickSortContent.implementations.java.mapStepToLine(completeStep), 6);

    // Python line mapping
    assert.equal(quickSortContent.implementations.python.mapStepToLine(baseCaseStep), 2);
    assert.equal(quickSortContent.implementations.python.mapStepToLine(pivotSelectedStep), 7);
    assert.equal(quickSortContent.implementations.python.mapStepToLine(compareStep), 10);
    assert.equal(quickSortContent.implementations.python.mapStepToLine(swapStep), 12);
    assert.equal(quickSortContent.implementations.python.mapStepToLine(pivotPlacedStep), 13);
    assert.equal(quickSortContent.implementations.python.mapStepToLine(partitionCompleteStep), 14);
    assert.equal(quickSortContent.implementations.python.mapStepToLine(recursionStep), 3);
    assert.equal(quickSortContent.implementations.python.mapStepToLine(completeStep), 5);
  });
});
