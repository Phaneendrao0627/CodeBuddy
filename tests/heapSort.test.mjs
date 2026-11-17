import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  generateHeapSortTrace,
  validateHeapSortInput
} from "../frontend/src/algorithms/heapSort.js";
import { heapSortContent } from "../frontend/src/algorithms/heapSortData.js";
import { SUPPORTED_LANGUAGES } from "../frontend/src/utils/languagePreferences.js";

describe("Heap Sort - Input Validation", () => {
  it("validates comma-separated string input", () => {
    const res = validateHeapSortInput("38, 27, 43, 3, 9, 82, 10");
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [38, 27, 43, 3, 9, 82, 10]);
  });

  it("validates array with negative numbers and duplicates", () => {
    const res = validateHeapSortInput("-4, 7, -1, 0, 9, -6, 7");
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [-4, 7, -1, 0, 9, -6, 7]);
  });

  it("validates numeric array input directly", () => {
    const res = validateHeapSortInput([15, -3, 42]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [15, -3, 42]);
  });

  it("handles empty array input safely", () => {
    const res = validateHeapSortInput([]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, []);
  });

  it("fails on empty or whitespace string input", () => {
    assert.equal(validateHeapSortInput("").valid, false);
    assert.equal(validateHeapSortInput("   ").valid, false);
    assert.equal(validateHeapSortInput(null).valid, false);
    assert.equal(validateHeapSortInput(undefined).valid, false);
  });

  it("fails when string contains non-numeric tokens", () => {
    const res = validateHeapSortInput("38, 27, banana, 10");
    assert.equal(res.valid, false);
    assert.match(res.error, /not a valid number/i);
  });

  it("fails when array contains non-numeric elements", () => {
    const res = validateHeapSortInput([38, 27, "banana", 10]);
    assert.equal(res.valid, false);
    assert.match(res.error, /must be valid numbers/i);
  });
});

describe("Heap Sort - Trace Generation & Edge Cases", () => {
  it("handles empty array gracefully", () => {
    const trace = generateHeapSortTrace([]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "empty");
    assert.equal(trace[0].finished, true);
    assert.equal(trace[0].heapSize, 0);
    assert.equal(trace[0].comparisonsCount, 0);
    assert.equal(trace[0].swapsCount, 0);
    assert.deepEqual(trace[0].array, []);
    assert.equal(trace[0].parentIndex, null);
    assert.equal(trace[0].leftChildIndex, null);
    assert.equal(trace[0].rightChildIndex, null);
  });

  it("handles single-element array (trivially sorted)", () => {
    const trace = generateHeapSortTrace([42]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "complete");
    assert.equal(trace[0].finished, true);
    assert.deepEqual(trace[0].array, [42]);
    assert.equal(trace[0].heapSize, 1);
    assert.deepEqual(trace[0].sortedIndices, [0]);
    assert.equal(trace[0].comparisonsCount, 0);
    assert.equal(trace[0].swapsCount, 0);
  });

  it("sorts standard scrambled array correctly", () => {
    const initial = [38, 27, 43, 3, 9, 82, 10];
    const trace = generateHeapSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [3, 9, 10, 27, 38, 43, 82]);
    assert.ok(lastStep.comparisonsCount > 0, "Must track comparisons");
    assert.ok(lastStep.swapsCount > 0, "Must track swaps");
  });

  it("sorts power-of-2 symmetric array accurately", () => {
    const initial = [8, 4, 5, 7, 1, 3, 6, 2];
    const trace = generateHeapSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("sorts already sorted array correctly", () => {
    const initial = [10, 20, 30, 40, 50, 60];
    const trace = generateHeapSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [10, 20, 30, 40, 50, 60]);
  });

  it("sorts reverse sorted array correctly", () => {
    const initial = [60, 50, 40, 30, 20, 10];
    const trace = generateHeapSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [10, 20, 30, 40, 50, 60]);
  });

  it("sorts array with duplicates correctly", () => {
    const initial = [5, 2, 5, 1, 8, 2];
    const trace = generateHeapSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 2, 5, 5, 8]);
  });

  it("sorts negative numbers and zero correctly", () => {
    const initial = [-4, 7, -1, 0, 9, -6];
    const trace = generateHeapSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [-6, -4, -1, 0, 7, 9]);
  });

  it("verifies required trace step schema properties", () => {
    const trace = generateHeapSortTrace([38, 27, 43, 3, 9, 82, 10]);

    const requiredKeys = [
      "stepIndex",
      "array",
      "heapSize",
      "phase",
      "parentIndex",
      "leftChildIndex",
      "rightChildIndex",
      "largestIndex",
      "swapIndices",
      "sortedIndices",
      "activeIndices",
      "comparisonsCount",
      "swapsCount",
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
      assert.equal(step.stepIndex, i, "Step index must match sequence");
      assert.ok(Array.isArray(step.array), `Step ${i} array must be an array`);
      assert.ok(typeof step.heapSize === "number", `Step ${i} heapSize must be a number`);
      assert.ok(typeof step.phase === "string", `Step ${i} phase must be a string`);
      assert.ok(typeof step.comparisonsCount === "number", `Step ${i} comparisonsCount must be a number`);
      assert.ok(typeof step.swapsCount === "number", `Step ${i} swapsCount must be a number`);
      assert.ok(Array.isArray(step.activeIndices), `Step ${i} activeIndices must be an array`);
      assert.ok(Array.isArray(step.sortedIndices), `Step ${i} sortedIndices must be an array`);
      assert.ok(typeof step.message === "string", `Step ${i} message must be a string`);
      assert.ok(typeof step.finished === "boolean", `Step ${i} finished must be a boolean`);
    }
  });

  it("verifies trace snapshots are completely immutable and independent", () => {
    const trace = generateHeapSortTrace([5, 4, 3, 2, 1]);
    const originalStep0 = [...trace[0].array];

    // Mutate step 0 array
    trace[0].array[0] = 9999;

    // Verify step 1 array was not mutated
    assert.notEqual(trace[1].array[0], 9999);
    // Restore step 0 for purity
    trace[0].array[0] = originalStep0[0];
  });

  it("verifies Max Heap property after build_heap_complete step", () => {
    const initial = [38, 27, 43, 3, 9, 82, 10];
    const trace = generateHeapSortTrace(initial);

    const buildCompleteStep = trace.find((s) => s.phase === "build_heap_complete");
    assert.ok(buildCompleteStep, "Trace must include build_heap_complete phase");
    assert.equal(buildCompleteStep.heapSize, initial.length);

    const arr = buildCompleteStep.array;
    const n = arr.length;

    // Verify Max Heap condition for all internal nodes
    for (let i = 0; i <= Math.floor(n / 2) - 1; i++) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      if (left < n) {
        assert.ok(
          arr[i] >= arr[left],
          `Max heap violation at index ${i} (${arr[i]}) vs left child ${left} (${arr[left]})`
        );
      }
      if (right < n) {
        assert.ok(
          arr[i] >= arr[right],
          `Max heap violation at index ${i} (${arr[i]}) vs right child ${right} (${arr[right]})`
        );
      }
    }
  });
});

describe("Heap Sort - Learning Content & Multilingual Schema", () => {
  it("provides comprehensive beginner-friendly educational content following strict sequence", () => {
    assert.ok(heapSortContent.concept && heapSortContent.concept.length > 50);
    assert.ok(heapSortContent.intuition && heapSortContent.intuition.length > 50);
    assert.ok(heapSortContent.real_world_example && heapSortContent.real_world_example.length > 30);
    assert.ok(heapSortContent.visualization && heapSortContent.visualization.length > 50);
    assert.ok(Array.isArray(heapSortContent.core_concepts) && heapSortContent.core_concepts.length >= 4);
    assert.ok(Array.isArray(heapSortContent.algorithm) && heapSortContent.algorithm.length >= 5);
    assert.ok(heapSortContent.pseudocode && heapSortContent.pseudocode.length > 50);
    assert.ok(Array.isArray(heapSortContent.advantages) && heapSortContent.advantages.length >= 2);
    assert.ok(Array.isArray(heapSortContent.disadvantages) && heapSortContent.disadvantages.length >= 2);
    assert.ok(Array.isArray(heapSortContent.edge_cases) && heapSortContent.edge_cases.length >= 3);
    assert.ok(heapSortContent.practice && heapSortContent.practice.length > 20);
    assert.ok(Array.isArray(heapSortContent.viva_questions) && heapSortContent.viva_questions.length >= 3);
  });

  it("provides accurate complexity and properties definitions", () => {
    assert.equal(heapSortContent.complexity.best, "O(n log n)");
    assert.equal(heapSortContent.complexity.average, "O(n log n)");
    assert.equal(heapSortContent.complexity.worst, "O(n log n)");
    assert.equal(heapSortContent.complexity.space, "O(1)");

    assert.ok(heapSortContent.complexity_explanation.time.includes("O(n log n)"));
    assert.ok(heapSortContent.complexity_explanation.space.includes("O(1)"));

    assert.match(heapSortContent.properties.stability, /Not Stable/i);
    assert.match(heapSortContent.properties.in_place, /In-Place/i);
  });

  it("provides complete C, Java, and Python implementations adhering to schema", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const impl = heapSortContent.implementations[lang];
      assert.ok(impl, `Missing ${lang} implementation`);
      assert.equal(impl.language, lang);
      assert.ok(impl.code && impl.code.length > 50, `${lang} code must not be empty`);
      assert.ok(impl.code_explanation && impl.code_explanation.length > 30, `${lang} explanation must not be empty`);
      assert.ok(Array.isArray(impl.codeLines) && impl.codeLines.length >= 5, `${lang} codeLines must have >= 5 entries`);
      assert.equal(typeof impl.mapStepToLine, "function", `${lang} mapStepToLine must be a function`);
    }

    // Top-level backward compatibility getters
    assert.equal(heapSortContent.code, heapSortContent.implementations.java.code);
    assert.equal(heapSortContent.code_explanation, heapSortContent.implementations.java.code_explanation);
  });

  it("synchronizes all trace phases with C, Java, and Python code lines", () => {
    const buildStartStep = { phase: "build_heap_start" };
    const heapifyCompareStep = { phase: "heapify_compare" };
    const heapifySwapStep = { phase: "heapify_swap" };
    const buildCompleteStep = { phase: "build_heap_complete" };
    const extractMaxStep = { phase: "extract_max" };
    const elementSortedStep = { phase: "element_sorted" };
    const heapifyDownCompareStep = { phase: "heapify_down_compare" };
    const heapifyDownSwapStep = { phase: "heapify_down_swap" };
    const completeStep = { phase: "complete", finished: true };

    // C line mapping
    assert.equal(heapSortContent.implementations.c.mapStepToLine(buildStartStep), 12);
    assert.equal(heapSortContent.implementations.c.mapStepToLine(heapifyCompareStep), 4);
    assert.equal(heapSortContent.implementations.c.mapStepToLine(heapifySwapStep), 7);
    assert.equal(heapSortContent.implementations.c.mapStepToLine(buildCompleteStep), 14);
    assert.equal(heapSortContent.implementations.c.mapStepToLine(extractMaxStep), 16);
    assert.equal(heapSortContent.implementations.c.mapStepToLine(elementSortedStep), 16);
    assert.equal(heapSortContent.implementations.c.mapStepToLine(heapifyDownCompareStep), 4);
    assert.equal(heapSortContent.implementations.c.mapStepToLine(heapifyDownSwapStep), 7);
    assert.equal(heapSortContent.implementations.c.mapStepToLine(completeStep), 19);

    // Java line mapping
    assert.equal(heapSortContent.implementations.java.mapStepToLine(buildStartStep), 12);
    assert.equal(heapSortContent.implementations.java.mapStepToLine(heapifyCompareStep), 4);
    assert.equal(heapSortContent.implementations.java.mapStepToLine(heapifySwapStep), 7);
    assert.equal(heapSortContent.implementations.java.mapStepToLine(buildCompleteStep), 14);
    assert.equal(heapSortContent.implementations.java.mapStepToLine(extractMaxStep), 16);
    assert.equal(heapSortContent.implementations.java.mapStepToLine(elementSortedStep), 16);
    assert.equal(heapSortContent.implementations.java.mapStepToLine(heapifyDownCompareStep), 4);
    assert.equal(heapSortContent.implementations.java.mapStepToLine(heapifyDownSwapStep), 7);
    assert.equal(heapSortContent.implementations.java.mapStepToLine(completeStep), 19);

    // Python line mapping
    assert.equal(heapSortContent.implementations.python.mapStepToLine(buildStartStep), 11);
    assert.equal(heapSortContent.implementations.python.mapStepToLine(heapifyCompareStep), 4);
    assert.equal(heapSortContent.implementations.python.mapStepToLine(heapifySwapStep), 7);
    assert.equal(heapSortContent.implementations.python.mapStepToLine(buildCompleteStep), 12);
    assert.equal(heapSortContent.implementations.python.mapStepToLine(extractMaxStep), 14);
    assert.equal(heapSortContent.implementations.python.mapStepToLine(elementSortedStep), 14);
    assert.equal(heapSortContent.implementations.python.mapStepToLine(heapifyDownCompareStep), 4);
    assert.equal(heapSortContent.implementations.python.mapStepToLine(heapifyDownSwapStep), 7);
    assert.equal(heapSortContent.implementations.python.mapStepToLine(completeStep), 15);
  });
});
