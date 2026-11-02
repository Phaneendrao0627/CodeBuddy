import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateLinearSearchInput,
  generateLinearSearchTrace
} from "../frontend/src/algorithms/linearSearch.js";

describe("Linear Search - Input Validation", () => {
  it("validates unsorted comma-separated string input without requiring sorted order", () => {
    const result = validateLinearSearchInput("14, 27, 8, 42, 19, 35, 50", "42");
    assert.equal(result.valid, true);
    assert.deepEqual(result.numbers, [14, 27, 8, 42, 19, 35, 50]);
    assert.equal(result.target, 42);
    assert.equal(result.error, null);
  });

  it("validates array with duplicate and negative elements", () => {
    const result = validateLinearSearchInput([-5, 12, 0, -5, 8], -5);
    assert.equal(result.valid, true);
    assert.deepEqual(result.numbers, [-5, 12, 0, -5, 8]);
    assert.equal(result.target, -5);
  });

  it("fails on empty string input", () => {
    const result = validateLinearSearchInput("", "5");
    assert.equal(result.valid, false);
    assert.match(result.error, /cannot be empty/i);
  });

  it("fails on empty array input", () => {
    const result = validateLinearSearchInput([], 10);
    assert.equal(result.valid, false);
    assert.match(result.error, /cannot be empty/i);
  });

  it("fails when target is missing or whitespace", () => {
    const result1 = validateLinearSearchInput("14, 27, 8", "");
    assert.equal(result1.valid, false);
    assert.match(result1.error, /target number/i);

    const result2 = validateLinearSearchInput("14, 27, 8", null);
    assert.equal(result2.valid, false);
    assert.match(result2.error, /target number/i);
  });

  it("fails when target is not a valid number", () => {
    const result = validateLinearSearchInput("14, 27, 8", "xyz");
    assert.equal(result.valid, false);
    assert.match(result.error, /not a valid number/i);
  });

  it("fails when array elements contain non-numeric tokens", () => {
    const result = validateLinearSearchInput("14, 27, abc, 42", "42");
    assert.equal(result.valid, false);
    assert.match(result.error, /not a valid number/i);
  });
});

describe("Linear Search - Trace Generation", () => {
  it("finds target in middle of unsorted array", () => {
    const numbers = [14, 27, 8, 42, 19, 35, 50];
    const target = 42;
    const trace = generateLinearSearchTrace(numbers, target);

    assert.ok(trace.length >= 2, "Trace should have multiple steps");

    // Initial step check
    assert.equal(trace[0].phase, "initial");
    assert.equal(trace[0].currentIndex, null);

    // Final step check (found at index 3)
    const finalStep = trace[trace.length - 1];
    assert.equal(finalStep.phase, "found");
    assert.equal(finalStep.found, true);
    assert.equal(finalStep.foundIndex, 3);
    assert.equal(finalStep.comparedValue, 42);
    assert.equal(finalStep.finished, true);

    // Verify all steps have required fields
    for (const step of trace) {
      assert.ok("phase" in step);
      assert.ok("comparisonResult" in step);
      assert.ok("action" in step);
      assert.ok("checkedIndices" in step);
      assert.ok("uncheckedIndices" in step);
    }
  });

  it("finds target at the first position (best case: index 0)", () => {
    const numbers = [99, 12, 58, 3, 77];
    const target = 99;
    const trace = generateLinearSearchTrace(numbers, target);

    // Step 0: initial, Step 1: found at index 0
    assert.equal(trace.length, 2);
    const finalStep = trace[1];
    assert.equal(finalStep.phase, "found");
    assert.equal(finalStep.found, true);
    assert.equal(finalStep.foundIndex, 0);
    assert.equal(finalStep.finished, true);
  });

  it("finds target at the last position (worst case: index n - 1)", () => {
    const numbers = [15, 23, 4, 88, 62];
    const target = 62;
    const trace = generateLinearSearchTrace(numbers, target);

    // Total steps: initial + 4 mismatches + 1 match = 6 steps
    assert.equal(trace.length, 6);
    const finalStep = trace[trace.length - 1];
    assert.equal(finalStep.phase, "found");
    assert.equal(finalStep.found, true);
    assert.equal(finalStep.foundIndex, 4);
    assert.equal(finalStep.finished, true);
  });

  it("correctly identifies target absent after inspecting all elements", () => {
    const numbers = [5, 12, 33, 48, 71];
    const target = 25;
    const trace = generateLinearSearchTrace(numbers, target);

    // Total steps: initial + 5 mismatches + 1 not_found = 7 steps
    assert.equal(trace.length, 7);
    const finalStep = trace[trace.length - 1];
    assert.equal(finalStep.phase, "not_found");
    assert.equal(finalStep.found, false);
    assert.equal(finalStep.foundIndex, -1);
    assert.equal(finalStep.finished, true);
    assert.match(finalStep.action, /Returning -1/);
  });

  it("returns the first occurrence when duplicate values are present", () => {
    const numbers = [10, 20, 30, 20, 50];
    const target = 20;
    const trace = generateLinearSearchTrace(numbers, target);

    const finalStep = trace[trace.length - 1];
    assert.equal(finalStep.phase, "found");
    assert.equal(finalStep.found, true);
    assert.equal(finalStep.foundIndex, 1); // Finds first 20 at index 1, not index 3
  });

  it("handles one element array when target is found", () => {
    const numbers = [7];
    const target = 7;
    const trace = generateLinearSearchTrace(numbers, target);

    assert.equal(trace.length, 2);
    const finalStep = trace[1];
    assert.equal(finalStep.phase, "found");
    assert.equal(finalStep.found, true);
    assert.equal(finalStep.foundIndex, 0);
  });

  it("handles one element array when target is missing", () => {
    const numbers = [7];
    const target = 99;
    const trace = generateLinearSearchTrace(numbers, target);

    assert.equal(trace.length, 3); // initial + index 0 mismatch + not_found
    const finalStep = trace[2];
    assert.equal(finalStep.phase, "not_found");
    assert.equal(finalStep.found, false);
    assert.equal(finalStep.foundIndex, -1);
  });

  it("returns empty trace for empty array", () => {
    const trace = generateLinearSearchTrace([], 10);
    assert.deepEqual(trace, []);
  });
});
