import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  generateRadixSortTrace,
  validateRadixSortInput
} from "../frontend/src/algorithms/radixSort.js";
import { radixSortContent } from "../frontend/src/algorithms/radixSortData.js";
import { SUPPORTED_LANGUAGES } from "../frontend/src/utils/languagePreferences.js";

describe("Radix Sort - Input Validation", () => {
  it("validates comma-separated string input", () => {
    const res = validateRadixSortInput("170, 45, 75, 90, 802, 24, 2, 66");
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [170, 45, 75, 90, 802, 24, 2, 66]);
  });

  it("validates numeric array input directly", () => {
    const res = validateRadixSortInput([15, 0, 42]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, [15, 0, 42]);
  });

  it("handles empty array input safely", () => {
    const res = validateRadixSortInput([]);
    assert.equal(res.valid, true);
    assert.deepEqual(res.numbers, []);
  });

  it("fails on empty or whitespace string input", () => {
    assert.equal(validateRadixSortInput("").valid, false);
    assert.equal(validateRadixSortInput("   ").valid, false);
    assert.equal(validateRadixSortInput(null).valid, false);
    assert.equal(validateRadixSortInput(undefined).valid, false);
  });

  it("fails when string contains non-numeric tokens", () => {
    const res = validateRadixSortInput("170, 45, apple, 90");
    assert.equal(res.valid, false);
    assert.match(res.error, /not a valid number/i);
  });

  it("fails on negative numbers with a clear message", () => {
    const res = validateRadixSortInput("170, -45, 75");
    assert.equal(res.valid, false);
    assert.match(res.error, /negative/i);

    const arrRes = validateRadixSortInput([170, -5, 75]);
    assert.equal(arrRes.valid, false);
    assert.match(arrRes.error, /negative/i);
  });

  it("fails on decimal numbers with a clear message", () => {
    const res = validateRadixSortInput("170, 45.5, 75");
    assert.equal(res.valid, false);
    assert.match(res.error, /decimal|whole integer/i);

    const arrRes = validateRadixSortInput([170, 3.14, 75]);
    assert.equal(arrRes.valid, false);
    assert.match(arrRes.error, /decimal|whole integer/i);
  });
});

describe("Radix Sort - Trace Generation & Edge Cases", () => {
  it("handles empty array gracefully", () => {
    const trace = generateRadixSortTrace([]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "empty");
    assert.equal(trace[0].finished, true);
    assert.deepEqual(trace[0].array, []);
  });

  it("handles single-element array (trivially sorted)", () => {
    const trace = generateRadixSortTrace([42]);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "complete");
    assert.equal(trace[0].finished, true);
    assert.deepEqual(trace[0].array, [42]);
    assert.deepEqual(trace[0].sortedIndices, [0]);
  });

  it("sorts standard mixed-digit array [170, 45, 75, 90, 802, 24, 2, 66] correctly", () => {
    const initial = [170, 45, 75, 90, 802, 24, 2, 66];
    const trace = generateRadixSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [2, 24, 45, 66, 75, 90, 170, 802]);
  });

  it("sorts same-digit-length numbers correctly", () => {
    const initial = [329, 457, 657, 839, 436, 720, 355];
    const trace = generateRadixSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [329, 355, 436, 457, 657, 720, 839]);
  });

  it("sorts already sorted array correctly", () => {
    const initial = [2, 24, 45, 66, 75, 90, 170, 802];
    const trace = generateRadixSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [2, 24, 45, 66, 75, 90, 170, 802]);
  });

  it("sorts reverse sorted array correctly", () => {
    const initial = [802, 170, 90, 75, 66, 45, 24, 2];
    const trace = generateRadixSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [2, 24, 45, 66, 75, 90, 170, 802]);
  });

  it("sorts array with duplicates and zero correctly", () => {
    const initial = [0, 42, 17, 42, 0, 90, 17];
    const trace = generateRadixSortTrace(initial);
    const lastStep = trace[trace.length - 1];

    assert.equal(lastStep.finished, true);
    assert.deepEqual(lastStep.array, [0, 0, 17, 17, 42, 42, 90]);
  });

  it("verifies all required trace step schema properties", () => {
    const trace = generateRadixSortTrace([170, 45, 75, 90, 802, 24, 2, 66]);

    const requiredKeys = [
      "stepIndex",
      "array",
      "phase",
      "exp",
      "digitPlace",
      "maxVal",
      "countArray",
      "outputArray",
      "activeElementIndex",
      "activeDigit",
      "placingIndex",
      "outputIndex",
      "sortedIndices",
      "activeIndices",
      "passNumber",
      "totalPasses",
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
    const trace = generateRadixSortTrace([50, 40, 30, 20, 10]);
    const originalStep0 = [...trace[0].array];

    // Mutate step 0 array
    trace[0].array[0] = 9999;

    // Verify step 1 array was not mutated
    assert.notEqual(trace[1].array[0], 9999);
    // Restore step 0 for purity
    trace[0].array[0] = originalStep0[0];
  });

  it("verifies the trace includes all essential phases", () => {
    const trace = generateRadixSortTrace([170, 45, 75, 90, 802, 24, 2, 66]);
    const phases = trace.map((s) => s.phase);

    assert.ok(phases.includes("initial"), "Trace should include initial phase");
    assert.ok(phases.includes("find_max"), "Trace should include find_max phase");
    assert.ok(phases.includes("pass_start"), "Trace should include pass_start phase");
    assert.ok(phases.includes("counting"), "Trace should include counting phase");
    assert.ok(phases.includes("counting_complete"), "Trace should include counting_complete phase");
    assert.ok(phases.includes("cumulative"), "Trace should include cumulative phase");
    assert.ok(phases.includes("placing"), "Trace should include placing phase");
    assert.ok(phases.includes("copyback"), "Trace should include copyback phase");
    assert.ok(phases.includes("complete"), "Trace should include complete phase");
  });
});

describe("Radix Sort - Learning Content & Multilingual Schema", () => {
  it("provides comprehensive educational content following strict sequence", () => {
    assert.ok(radixSortContent.concept && radixSortContent.concept.length > 50);
    assert.ok(radixSortContent.intuition && radixSortContent.intuition.length > 50);
    assert.ok(radixSortContent.real_world_example && radixSortContent.real_world_example.length > 30);
    assert.ok(radixSortContent.visualization && radixSortContent.visualization.length > 50);
    assert.ok(Array.isArray(radixSortContent.core_concepts) && radixSortContent.core_concepts.length >= 4);
    assert.ok(Array.isArray(radixSortContent.algorithm) && radixSortContent.algorithm.length >= 4);
    assert.ok(radixSortContent.pseudocode && radixSortContent.pseudocode.length > 50);
    assert.ok(Array.isArray(radixSortContent.advantages) && radixSortContent.advantages.length >= 2);
    assert.ok(Array.isArray(radixSortContent.disadvantages) && radixSortContent.disadvantages.length >= 2);
    assert.ok(Array.isArray(radixSortContent.edge_cases) && radixSortContent.edge_cases.length >= 3);
    assert.ok(radixSortContent.practice && radixSortContent.practice.length > 20);
    assert.ok(Array.isArray(radixSortContent.viva_questions) && radixSortContent.viva_questions.length >= 4);
  });

  it("provides accurate complexity and properties definitions", () => {
    assert.equal(radixSortContent.complexity.best, "O(d × (n + b))");
    assert.equal(radixSortContent.complexity.average, "O(d × (n + b))");
    assert.equal(radixSortContent.complexity.worst, "O(d × (n + b))");
    assert.equal(radixSortContent.complexity.space, "O(n + b)");

    assert.ok(radixSortContent.complexity_explanation.time.includes("O(d × (n + b))"));
    assert.ok(radixSortContent.complexity_explanation.space.includes("O(n + b)"));

    assert.match(radixSortContent.properties.stability, /Stable/i);
    assert.match(radixSortContent.properties.in_place, /Not In-Place/i);
  });

  it("provides complete C, Java, and Python implementations adhering to schema", () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      const impl = radixSortContent.implementations[lang];
      assert.ok(impl, `Missing ${lang} implementation`);
      assert.equal(impl.language, lang);
      assert.ok(impl.code && impl.code.length > 50, `${lang} code must not be empty`);
      assert.ok(impl.code_explanation && impl.code_explanation.length > 30, `${lang} explanation must not be empty`);
      assert.ok(Array.isArray(impl.codeLines) && impl.codeLines.length >= 5, `${lang} codeLines must have >= 5 entries`);
      assert.equal(typeof impl.mapStepToLine, "function", `${lang} mapStepToLine must be a function`);
    }

    // Top-level backward compatibility getters
    assert.equal(radixSortContent.code, radixSortContent.implementations.java.code);
    assert.equal(radixSortContent.code_explanation, radixSortContent.implementations.java.code_explanation);
  });

  it("synchronizes all trace phases with C, Java, and Python code lines", () => {
    const emptyStep = { phase: "empty" };
    const initialStep = { phase: "initial" };
    const findMaxStep = { phase: "find_max" };
    const passStartStep = { phase: "pass_start" };
    const countingStep = { phase: "counting" };
    const cumulativeStep = { phase: "cumulative" };
    const placingStep = { phase: "placing" };
    const copybackStep = { phase: "copyback" };
    const completeStep = { phase: "complete", finished: true };

    // C line mapping
    assert.equal(radixSortContent.implementations.c.mapStepToLine(emptyStep), null);
    assert.equal(radixSortContent.implementations.c.mapStepToLine(initialStep), 1);
    assert.equal(radixSortContent.implementations.c.mapStepToLine(findMaxStep), 2);
    assert.equal(radixSortContent.implementations.c.mapStepToLine(passStartStep), 3);
    assert.equal(radixSortContent.implementations.c.mapStepToLine(countingStep), 6);
    assert.equal(radixSortContent.implementations.c.mapStepToLine(cumulativeStep), 7);
    assert.equal(radixSortContent.implementations.c.mapStepToLine(placingStep), 10);
    assert.equal(radixSortContent.implementations.c.mapStepToLine(copybackStep), 12);
    assert.equal(radixSortContent.implementations.c.mapStepToLine(completeStep), 14);

    // Java line mapping
    assert.equal(radixSortContent.implementations.java.mapStepToLine(emptyStep), null);
    assert.equal(radixSortContent.implementations.java.mapStepToLine(initialStep), 1);
    assert.equal(radixSortContent.implementations.java.mapStepToLine(findMaxStep), 2);
    assert.equal(radixSortContent.implementations.java.mapStepToLine(passStartStep), 3);
    assert.equal(radixSortContent.implementations.java.mapStepToLine(countingStep), 6);
    assert.equal(radixSortContent.implementations.java.mapStepToLine(cumulativeStep), 7);
    assert.equal(radixSortContent.implementations.java.mapStepToLine(placingStep), 10);
    assert.equal(radixSortContent.implementations.java.mapStepToLine(copybackStep), 12);
    assert.equal(radixSortContent.implementations.java.mapStepToLine(completeStep), 14);

    // Python line mapping
    assert.equal(radixSortContent.implementations.python.mapStepToLine(emptyStep), null);
    assert.equal(radixSortContent.implementations.python.mapStepToLine(initialStep), 1);
    assert.equal(radixSortContent.implementations.python.mapStepToLine(findMaxStep), 2);
    assert.equal(radixSortContent.implementations.python.mapStepToLine(passStartStep), 3);
    assert.equal(radixSortContent.implementations.python.mapStepToLine(countingStep), 5);
    assert.equal(radixSortContent.implementations.python.mapStepToLine(cumulativeStep), 6);
    assert.equal(radixSortContent.implementations.python.mapStepToLine(placingStep), 9);
    assert.equal(radixSortContent.implementations.python.mapStepToLine(copybackStep), 10);
    assert.equal(radixSortContent.implementations.python.mapStepToLine(completeStep), 11);
  });
});
