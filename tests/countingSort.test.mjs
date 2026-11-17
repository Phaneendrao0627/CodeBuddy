import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  generateCountingSortTrace,
  validateCountingSortInput
} from "../frontend/src/algorithms/countingSort.js";
import { countingSortContent } from "../frontend/src/algorithms/countingSortData.js";
import { SUPPORTED_LANGUAGES } from "../frontend/src/utils/languagePreferences.js";

describe("Counting Sort - Input Validation", () => {
  it("validates comma-separated string input", () => {
    const res = validateCountingSortInput("4, 2, 2, 8, 3, 3, 1");
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [4, 2, 2, 8, 3, 3, 1]);
  });

  it("validates array with negative numbers and duplicates", () => {
    const res = validateCountingSortInput("-4, 7, -1, 0, 9, -6, 7");
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [-4, 7, -1, 0, 9, -6, 7]);
  });

  it("validates numeric array input directly", () => {
    const res = validateCountingSortInput([15, -3, 42]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [15, -3, 42]);
  });

  it("handles empty array input safely", () => {
    const res = validateCountingSortInput([]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, []);
  });

  it("fails on empty or whitespace string input", () => {
    assert.equal(validateCountingSortInput("").valid, false);
    assert.equal(validateCountingSortInput("   ").valid, false);
    assert.equal(validateCountingSortInput(null).valid, false);
    assert.equal(validateCountingSortInput(undefined).valid, false);
  });

  it("fails when string contains non-numeric tokens", () => {
    const res = validateCountingSortInput("4, 2, banana, 8");
    assert.equal(res.valid, false);
    assert.match(res.error, /not a valid number/i);
  });

  it("fails when array contains non-numeric elements", () => {
    const res = validateCountingSortInput([4, 2, "banana", 8]);
    assert.equal(res.valid, false);
    assert.match(res.error, /must be valid numbers/i);
  });
});

describe("Counting Sort - Trace Generation & Edge Cases", () => {
  it("handles empty array gracefully", () => {
    const trace = generateCountingSortTrace([]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "empty");
    assert.equal(trace[0].finished, true);
    assert.deepEqual(trace[0].array, []);
    assert.equal(trace[0].countArray, null);
    assert.equal(trace[0].outputArray, null);
  });

  it("handles single-element array (trivially sorted)", () => {
    const trace = generateCountingSortTrace([7]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "complete");
    assert.equal(trace[0].finished, true);
    assert.deepEqual(trace[0].array, [7]);
    assert.deepEqual(trace[0].sortedIndices, [0]);
  });

  it("sorts standard mixed array [4, 2, 2, 8, 3, 3, 1] correctly", () => {
    const initial = [4, 2, 2, 8, 3, 3, 1];
    const trace = generateCountingSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 2, 3, 3, 4, 8]);
  });

  it("sorts already sorted array correctly", () => {
    const initial = [1, 2, 3, 4, 5];
    const trace = generateCountingSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 3, 4, 5]);
  });

  it("sorts reverse sorted array correctly", () => {
    const initial = [5, 4, 3, 2, 1];
    const trace = generateCountingSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 3, 4, 5]);
  });

  it("sorts array with duplicates correctly", () => {
    const initial = [5, 2, 5, 1, 8, 2];
    const trace = generateCountingSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [1, 2, 2, 5, 5, 8]);
  });

  it("sorts negative numbers correctly", () => {
    const initial = [-4, 7, -1, 0, 9, -6];
    const trace = generateCountingSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [-6, -4, -1, 0, 7, 9]);
  });

  it("verifies all required trace step schema properties", () => {
    const trace = generateCountingSortTrace([4, 2, 2, 8, 3, 3, 1]);

    const requiredKeys = [
      "stepIndex",
      "array",
      "phase",
      "countArray",
      "outputArray",
      "minVal",
      "maxVal",
      "countingIndex",
      "cumulativeIndex",
      "placingIndex",
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
    const trace = generateCountingSortTrace([5, 4, 3, 2, 1]);
    const originalStep0 = [...trace[0].array];

    // Mutate step 0 array
    trace[0].array[0] = 9999;

    // Verify step 1 array was not mutated
    assert.notEqual(trace[1].array[0], 9999);
    // Restore step 0 for purity
    trace[0].array[0] = originalStep0[0];
  });

  it("verifies the trace includes all essential phases", () => {
    const trace = generateCountingSortTrace([4, 2, 2, 8, 3, 3, 1]);
    const phases = trace.map((s) => s.phase);

    assert.ok(phases.includes("initial"), "Trace should include initial phase");
    assert.ok(phases.includes("find_min_max"), "Trace should include find_min_max phase");
    assert.ok(phases.includes("counting"), "Trace should include counting phase");
    assert.ok(phases.includes("cumulative"), "Trace should include cumulative phase");
    assert.ok(phases.includes("placing"), "Trace should include placing phase");
    assert.ok(phases.includes("copyback"), "Trace should include copyback phase");
    assert.ok(phases.includes("complete"), "Trace should include complete phase");
  });
});

describe("Counting Sort - Learning Content & Multilingual Schema", () => {
  it("provides comprehensive educational content following strict sequence", () => {
    assert.ok(countingSortContent.concept && countingSortContent.concept.length > 50);
    assert.ok(countingSortContent.intuition && countingSortContent.intuition.length > 50);
    assert.ok(countingSortContent.real_world_example && countingSortContent.real_world_example.length > 30);
    assert.ok(countingSortContent.visualization && countingSortContent.visualization.length > 50);
    assert.ok(Array.isArray(countingSortContent.core_concepts) && countingSortContent.core_concepts.length >= 4);
    assert.ok(Array.isArray(countingSortContent.algorithm) && countingSortContent.algorithm.length >= 4);
    assert.ok(countingSortContent.pseudocode && countingSortContent.pseudocode.length > 50);
    assert.ok(Array.isArray(countingSortContent.advantages) && countingSortContent.advantages.length >= 2);
    assert.ok(Array.isArray(countingSortContent.disadvantages) && countingSortContent.disadvantages.length >= 2);
    assert.ok(Array.isArray(countingSortContent.edge_cases) && countingSortContent.edge_cases.length >= 3);
    assert.ok(countingSortContent.practice && countingSortContent.practice.length > 20);
    assert.ok(Array.isArray(countingSortContent.viva_questions) && countingSortContent.viva_questions.length >= 4);
  });

  it("provides accurate complexity and properties definitions", () => {
    assert.equal(countingSortContent.complexity.best, "O(n + k)");
    assert.equal(countingSortContent.complexity.average, "O(n + k)");
    assert.equal(countingSortContent.complexity.worst, "O(n + k)");
    assert.equal(countingSortContent.complexity.space, "O(n + k)");

    assert.ok(countingSortContent.complexity_explanation.time.includes("O(n + k)"));
    assert.ok(countingSortContent.complexity_explanation.space.includes("O(n + k)"));

    assert.match(countingSortContent.properties.stability, /Stable/i);
    assert.match(countingSortContent.properties.in_place, /Not In-Place/i);
  });

  it("provides complete C, Java, and Python implementations adhering to schema", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const impl = countingSortContent.implementations[lang];
      assert.ok(impl, `Missing ${lang} implementation`);
      assert.equal(impl.language, lang);
      assert.ok(impl.code && impl.code.length > 50, `${lang} code must not be empty`);
      assert.ok(impl.code_explanation && impl.code_explanation.length > 30, `${lang} explanation must not be empty`);
      assert.ok(Array.isArray(impl.codeLines) && impl.codeLines.length >= 5, `${lang} codeLines must have >= 5 entries`);
      assert.equal(typeof impl.mapStepToLine, "function", `${lang} mapStepToLine must be a function`);
    }

    // Top-level backward compatibility getters
    assert.equal(countingSortContent.code, countingSortContent.implementations.java.code);
    assert.equal(countingSortContent.code_explanation, countingSortContent.implementations.java.code_explanation);
  });

  it("synchronizes all trace phases with C, Java, and Python code lines", () => {
    const emptyStep = { phase: "empty" };
    const initialStep = { phase: "initial" };
    const findMinMaxStep = { phase: "find_min_max" };
    const countingStep = { phase: "counting" };
    const cumulativeStep = { phase: "cumulative" };
    const placingStep = { phase: "placing" };
    const copybackStep = { phase: "copyback" };
    const completeStep = { phase: "complete", finished: true };

    // C line mapping
    assert.equal(countingSortContent.implementations.c.mapStepToLine(emptyStep), null);
    assert.equal(countingSortContent.implementations.c.mapStepToLine(initialStep), 1);
    assert.equal(countingSortContent.implementations.c.mapStepToLine(findMinMaxStep), 3);
    assert.equal(countingSortContent.implementations.c.mapStepToLine(countingStep), 7);
    assert.equal(countingSortContent.implementations.c.mapStepToLine(cumulativeStep), 10);
    assert.equal(countingSortContent.implementations.c.mapStepToLine(placingStep), 14);
    assert.equal(countingSortContent.implementations.c.mapStepToLine(copybackStep), 16);
    assert.equal(countingSortContent.implementations.c.mapStepToLine(completeStep), 18);

    // Java line mapping
    assert.equal(countingSortContent.implementations.java.mapStepToLine(emptyStep), null);
    assert.equal(countingSortContent.implementations.java.mapStepToLine(initialStep), 1);
    assert.equal(countingSortContent.implementations.java.mapStepToLine(findMinMaxStep), 3);
    assert.equal(countingSortContent.implementations.java.mapStepToLine(countingStep), 7);
    assert.equal(countingSortContent.implementations.java.mapStepToLine(cumulativeStep), 10);
    assert.equal(countingSortContent.implementations.java.mapStepToLine(placingStep), 14);
    assert.equal(countingSortContent.implementations.java.mapStepToLine(copybackStep), 16);
    assert.equal(countingSortContent.implementations.java.mapStepToLine(completeStep), 17);

    // Python line mapping
    assert.equal(countingSortContent.implementations.python.mapStepToLine(emptyStep), null);
    assert.equal(countingSortContent.implementations.python.mapStepToLine(initialStep), 1);
    assert.equal(countingSortContent.implementations.python.mapStepToLine(findMinMaxStep), 2);
    assert.equal(countingSortContent.implementations.python.mapStepToLine(countingStep), 6);
    assert.equal(countingSortContent.implementations.python.mapStepToLine(cumulativeStep), 8);
    assert.equal(countingSortContent.implementations.python.mapStepToLine(placingStep), 12);
    assert.equal(countingSortContent.implementations.python.mapStepToLine(copybackStep), 13);
    assert.equal(countingSortContent.implementations.python.mapStepToLine(completeStep), 14);
  });
});
