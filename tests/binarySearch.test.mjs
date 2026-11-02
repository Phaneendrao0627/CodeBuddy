import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateBinarySearchInput,
  generateBinarySearchTrace,
  sortArrayAscending
} from "../frontend/src/algorithms/binarySearch.js";

describe("Binary Search - Input Validation", () => {
  it("validates valid sorted comma-separated string input", () => {
    const result = validateBinarySearchInput("2, 5, 8, 12, 16, 23", "12");
    assert.equal(result.valid, true);
    assert.deepEqual(result.numbers, [2, 5, 8, 12, 16, 23]);
    assert.equal(result.target, 12);
    assert.equal(result.error, null);
  });

  it("validates array with duplicate sorted elements", () => {
    const result = validateBinarySearchInput([1, 2, 2, 4, 5], 2);
    assert.equal(result.valid, true);
    assert.deepEqual(result.numbers, [1, 2, 2, 4, 5]);
    assert.equal(result.target, 2);
  });

  it("fails on empty string input", () => {
    const result = validateBinarySearchInput("", "5");
    assert.equal(result.valid, false);
    assert.match(result.error, /cannot be empty/i);
  });

  it("fails on empty array input", () => {
    const result = validateBinarySearchInput([], 10);
    assert.equal(result.valid, false);
    assert.match(result.error, /cannot be empty/i);
  });

  it("fails when target is missing or whitespace", () => {
    const result1 = validateBinarySearchInput("1, 2, 3", "");
    assert.equal(result1.valid, false);
    assert.match(result1.error, /target number/i);

    const result2 = validateBinarySearchInput("1, 2, 3", null);
    assert.equal(result2.valid, false);
    assert.match(result2.error, /target number/i);
  });

  it("fails when target is not a number", () => {
    const result = validateBinarySearchInput("1, 2, 3", "abc");
    assert.equal(result.valid, false);
    assert.match(result.error, /not a valid number/i);
  });

  it("fails when array elements contain non-numbers", () => {
    const result = validateBinarySearchInput("1, 2, foo, 4", "2");
    assert.equal(result.valid, false);
    assert.match(result.error, /not a valid number/i);
  });

  it("fails when array is unsorted and reports out-of-order elements without modifying user data", () => {
    const result = validateBinarySearchInput("5, 2, 8, 1", "2");
    assert.equal(result.valid, false);
    assert.equal(result.isUnsorted, true);
    assert.match(result.error, /Array is not sorted: 5 appears before 2/);
    assert.deepEqual(result.numbers, [5, 2, 8, 1]);
  });

  it("sortArrayAscending helper produces correctly sorted array", () => {
    const sorted = sortArrayAscending([5, 2, 8, 1]);
    assert.deepEqual(sorted, [1, 2, 5, 8]);
  });
});

describe("Binary Search - Trace Generation", () => {
  it("finds target in middle of multi-element array", () => {
    const numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
    const target = 23;
    const trace = generateBinarySearchTrace(numbers, target);

    assert.ok(trace.length >= 2, "Trace should have multiple steps");

    // Initial step check
    assert.equal(trace[0].phase, "initial");
    assert.equal(trace[0].low, 0);
    assert.equal(trace[0].high, 9);
    assert.equal(trace[0].mid, null);

    // Final step check
    const finalStep = trace[trace.length - 1];
    assert.equal(finalStep.phase, "found");
    assert.equal(finalStep.found, true);
    assert.equal(finalStep.foundIndex, 5);
    assert.equal(finalStep.comparedValue, 23);
    assert.equal(finalStep.finished, true);

    // Verify all steps have required fields
    for (const step of trace) {
      assert.ok("low" in step);
      assert.ok("high" in step);
      assert.ok("mid" in step);
      assert.ok("comparedValue" in step);
      assert.ok("comparisonResult" in step);
      assert.ok("action" in step);
    }
  });

  it("finds target at the beginning (index 0)", () => {
    const numbers = [10, 20, 30, 40, 50];
    const target = 10;
    const trace = generateBinarySearchTrace(numbers, target);
    const finalStep = trace[trace.length - 1];

    assert.equal(finalStep.found, true);
    assert.equal(finalStep.foundIndex, 0);
    assert.equal(finalStep.finished, true);
  });

  it("finds target at the end (last index)", () => {
    const numbers = [10, 20, 30, 40, 50];
    const target = 50;
    const trace = generateBinarySearchTrace(numbers, target);
    const finalStep = trace[trace.length - 1];

    assert.equal(finalStep.found, true);
    assert.equal(finalStep.foundIndex, 4);
    assert.equal(finalStep.finished, true);
  });

  it("correctly identifies target missing (smaller than min)", () => {
    const numbers = [10, 20, 30, 40];
    const target = 5;
    const trace = generateBinarySearchTrace(numbers, target);
    const finalStep = trace[trace.length - 1];

    assert.equal(finalStep.phase, "not_found");
    assert.equal(finalStep.found, false);
    assert.equal(finalStep.foundIndex, -1);
    assert.equal(finalStep.finished, true);
    assert.match(finalStep.action, /does not exist/);
  });

  it("correctly identifies target missing (larger than max)", () => {
    const numbers = [10, 20, 30, 40];
    const target = 100;
    const trace = generateBinarySearchTrace(numbers, target);
    const finalStep = trace[trace.length - 1];

    assert.equal(finalStep.phase, "not_found");
    assert.equal(finalStep.found, false);
    assert.equal(finalStep.foundIndex, -1);
    assert.equal(finalStep.finished, true);
  });

  it("correctly identifies target missing between existing elements", () => {
    const numbers = [1, 3, 5, 7, 9, 11];
    const target = 6;
    const trace = generateBinarySearchTrace(numbers, target);
    const finalStep = trace[trace.length - 1];

    assert.equal(finalStep.phase, "not_found");
    assert.equal(finalStep.found, false);
    assert.equal(finalStep.foundIndex, -1);
    assert.equal(finalStep.finished, true);
  });

  it("handles one element array when target is found", () => {
    const numbers = [42];
    const target = 42;
    const trace = generateBinarySearchTrace(numbers, target);
    const finalStep = trace[trace.length - 1];

    assert.equal(finalStep.phase, "found");
    assert.equal(finalStep.found, true);
    assert.equal(finalStep.foundIndex, 0);
    assert.equal(finalStep.low, 0);
    assert.equal(finalStep.high, 0);
    assert.equal(finalStep.mid, 0);
  });

  it("handles one element array when target is missing", () => {
    const numbers = [42];
    const target = 7;
    const trace = generateBinarySearchTrace(numbers, target);
    const finalStep = trace[trace.length - 1];

    assert.equal(finalStep.phase, "not_found");
    assert.equal(finalStep.found, false);
    assert.equal(finalStep.foundIndex, -1);
  });

  it("returns empty trace for empty array", () => {
    const trace = generateBinarySearchTrace([], 10);
    assert.deepEqual(trace, []);
  });
});
