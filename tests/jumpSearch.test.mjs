import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  calculateJumpStep,
  generateJumpSearchTrace,
  sortArrayAscending,
  validateJumpSearchInput
} from "../frontend/src/algorithms/jumpSearch.js";
import { jumpSearchContent } from "../frontend/src/algorithms/jumpSearchData.js";
import { SUPPORTED_LANGUAGES } from "../frontend/src/utils/languagePreferences.js";

describe("Jump Search - Input Validation & Step Calculation", () => {
  it("calculates correct jump step size m = floor(sqrt(n))", () => {
    assert.equal(calculateJumpStep(0), 1);
    assert.equal(calculateJumpStep(1), 1);
    assert.equal(calculateJumpStep(4), 2);
    assert.equal(calculateJumpStep(9), 3);
    assert.equal(calculateJumpStep(13), 3);
    assert.equal(calculateJumpStep(16), 4);
    assert.equal(calculateJumpStep(25), 5);
    assert.equal(calculateJumpStep(100), 10);
  });

  it("validates sorted comma-separated string input", () => {
    const result = validateJumpSearchInput("0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89", "55");
    assert.equal(result.valid, true);
    assert.deepEqual(result.numbers, [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]);
    assert.equal(result.target, 55);
    assert.equal(result.error, null);
    assert.equal(result.isUnsorted, false);
  });

  it("rejects unsorted input and flags isUnsorted", () => {
    const result = validateJumpSearchInput("10, 50, 20, 60", "20");
    assert.equal(result.valid, false);
    assert.equal(result.isUnsorted, true);
    assert.match(result.error, /requires a sorted array/i);
  });

  it("sortArrayAscending correctly sorts arrays", () => {
    assert.deepEqual(sortArrayAscending([50, 10, 40, 20, 30]), [10, 20, 30, 40, 50]);
  });

  it("fails on empty array input", () => {
    const res1 = validateJumpSearchInput("", "10");
    assert.equal(res1.valid, false);
    assert.match(res1.error, /cannot be empty/i);

    const res2 = validateJumpSearchInput([], 10);
    assert.equal(res2.valid, false);
  });

  it("fails when target is missing or non-numeric", () => {
    const res1 = validateJumpSearchInput("10, 20, 30", "");
    assert.equal(res1.valid, false);

    const res2 = validateJumpSearchInput("10, 20, 30", "abc");
    assert.equal(res2.valid, false);
  });

  it("fails when array contains non-numeric tokens", () => {
    const res = validateJumpSearchInput("10, 20, xyz, 40", "20");
    assert.equal(res.valid, false);
    assert.match(res.error, /not a valid number/i);
  });
});

describe("Jump Search - Deterministic Trace Generation", () => {
  const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

  it("finds target in middle of array through block jumps and linear scan", () => {
    const trace = generateJumpSearchTrace(fib, 55);
    assert.ok(trace.length >= 3);

    // Initial step
    assert.equal(trace[0].phase, "initial");
    assert.equal(trace[0].jumpSize, 3); // sqrt(13) = 3

    // Final step should be found
    const lastStep = trace[trace.length - 1];
    assert.equal(lastStep.phase, "found");
    assert.equal(lastStep.found, true);
    assert.equal(lastStep.foundIndex, 10);
    assert.equal(lastStep.finished, true);

    // Should include both block jumps and linear scan
    const hasBlockJump = trace.some((s) => s.phase === "block_jump");
    const hasBlockFound = trace.some((s) => s.phase === "block_found");
    const hasLinearScan = trace.some((s) => s.phase === "linear_scan" || s.phase === "found");
    assert.equal(hasBlockJump, true);
    assert.equal(hasBlockFound, true);
    assert.equal(hasLinearScan, true);
  });

  it("finds target at first position (index 0, best case O(1))", () => {
    const numbers = [2, 4, 6, 8, 10, 12, 14, 16];
    const trace = generateJumpSearchTrace(numbers, 2);

    const lastStep = trace[trace.length - 1];
    assert.equal(lastStep.phase, "found");
    assert.equal(lastStep.foundIndex, 0);
    assert.equal(lastStep.finished, true);
  });

  it("finds target at last position (worst case)", () => {
    const numbers = [2, 4, 6, 8, 10, 12, 14, 16];
    const trace = generateJumpSearchTrace(numbers, 16);

    const lastStep = trace[trace.length - 1];
    assert.equal(lastStep.phase, "found");
    assert.equal(lastStep.foundIndex, 7);
  });

  it("handles target smaller than smallest element", () => {
    const numbers = [10, 20, 30, 40, 50];
    const trace = generateJumpSearchTrace(numbers, 5);

    const lastStep = trace[trace.length - 1];
    assert.equal(lastStep.phase, "not_found");
    assert.equal(lastStep.found, false);
    assert.equal(lastStep.foundIndex, -1);
  });

  it("handles target greater than largest element", () => {
    const numbers = [10, 20, 30, 40, 50];
    const trace = generateJumpSearchTrace(numbers, 999);

    const lastStep = trace[trace.length - 1];
    assert.equal(lastStep.phase, "not_found");
    assert.equal(lastStep.found, false);
    assert.equal(lastStep.foundIndex, -1);
  });

  it("handles missing target inside range", () => {
    const numbers = [10, 20, 30, 40, 50];
    const trace = generateJumpSearchTrace(numbers, 25);

    const lastStep = trace[trace.length - 1];
    assert.equal(lastStep.phase, "not_found");
    assert.equal(lastStep.found, false);
  });

  it("returns the FIRST occurrence when duplicate elements exist", () => {
    const numbers = [2, 5, 5, 5, 12, 18, 24, 30];
    const trace = generateJumpSearchTrace(numbers, 5);

    const lastStep = trace[trace.length - 1];
    assert.equal(lastStep.phase, "found");
    assert.equal(lastStep.foundIndex, 1); // First occurrence is at index 1
  });

  it("handles single-element array when target matches", () => {
    const trace = generateJumpSearchTrace([42], 42);
    const lastStep = trace[trace.length - 1];
    assert.equal(lastStep.phase, "found");
    assert.equal(lastStep.foundIndex, 0);
  });

  it("handles single-element array when target is missing", () => {
    const trace = generateJumpSearchTrace([42], 99);
    const lastStep = trace[trace.length - 1];
    assert.equal(lastStep.phase, "not_found");
    assert.equal(lastStep.foundIndex, -1);
  });

  it("handles empty array gracefully", () => {
    const trace = generateJumpSearchTrace([], 10);
    assert.equal(trace.length, 1);
    assert.equal(trace[0].phase, "not_found");
    assert.equal(trace[0].foundIndex, -1);
  });
});

describe("Jump Search - Multilingual Schema & Line Synchronization", () => {
  it("provides complete C, Java, and Python implementations", () => {
    assert.ok(jumpSearchContent.implementations);
    for (const lang of SUPPORTED_LANGUAGES) {
      const impl = jumpSearchContent.implementations[lang];
      assert.ok(impl, `Missing ${lang} implementation`);
      assert.ok(impl.code.length > 50, `${lang} code must not be empty`);
      assert.ok(impl.code_explanation.length > 30, `${lang} explanation must not be empty`);
      assert.ok(impl.codeLines.length >= 8, `${lang} must have codeLines`);
      assert.equal(typeof impl.mapStepToLine, "function");
    }
  });

  it("synchronizes all trace phases with C, Java, and Python code lines", () => {
    const trace = generateJumpSearchTrace([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144], 55);

    for (const step of trace) {
      for (const lang of SUPPORTED_LANGUAGES) {
        const impl = jumpSearchContent.implementations[lang];
        const line = impl.mapStepToLine(step);
        assert.ok(typeof line === "number", `Line should be a number for ${lang} at ${step.phase}`);
        assert.ok(line >= 1 && line <= impl.codeLines.length, `Line ${line} out of range for ${lang}`);
      }
    }
  });
});
