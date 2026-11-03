import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { binarySearchContent } from "../frontend/src/algorithms/binarySearchData.js";
import { linearSearchContent } from "../frontend/src/algorithms/linearSearchData.js";
import { bubbleSortContent } from "../frontend/src/algorithms/bubbleSortData.js";
import { jumpSearchContent } from "../frontend/src/algorithms/jumpSearchData.js";
import { insertionSortContent } from "../frontend/src/algorithms/insertionSortData.js";
import { selectionSortContent } from "../frontend/src/algorithms/selectionSortData.js";
import { generateBinarySearchTrace } from "../frontend/src/algorithms/binarySearch.js";
import { generateLinearSearchTrace } from "../frontend/src/algorithms/linearSearch.js";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_LABELS,
  STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  getPreferredLanguage,
  setPreferredLanguage
} from "../frontend/src/utils/languagePreferences.js";

const ALGORITHMS = [
  { name: "Binary Search", data: binarySearchContent },
  { name: "Linear Search", data: linearSearchContent },
  { name: "Bubble Sort", data: bubbleSortContent },
  { name: "Jump Search", data: jumpSearchContent },
  { name: "Insertion Sort", data: insertionSortContent },
  { name: "Selection Sort", data: selectionSortContent }
];

describe("Multilingual Architecture - Algorithm Schema Verification", () => {
  it("verifies all supported algorithms provide C, Java, and Python implementations", () => {
    for (const { name, data } of ALGORITHMS) {
      assert.ok(data.implementations, `${name} must have implementations dictionary`);
      for (const lang of SUPPORTED_LANGUAGES) {
        const impl = data.implementations[lang];
        assert.ok(impl, `${name} missing ${lang} implementation`);
        assert.equal(impl.language, lang);
        assert.equal(impl.label, LANGUAGE_LABELS[lang]);
        assert.ok(impl.code && impl.code.length > 50, `${name} [${lang}] code must not be empty`);
        assert.ok(
          impl.code_explanation && impl.code_explanation.length > 30,
          `${name} [${lang}] code_explanation must not be empty`
        );
        assert.ok(
          Array.isArray(impl.codeLines) && impl.codeLines.length >= 5,
          `${name} [${lang}] must have valid codeLines array`
        );
        assert.equal(
          typeof impl.mapStepToLine,
          "function",
          `${name} [${lang}] must have mapStepToLine function`
        );
      }
    }
  });

  it("verifies backward compatibility getters for existing code and explanations", () => {
    for (const { name, data } of ALGORITHMS) {
      assert.ok(data.code, `${name} must support top-level data.code getter`);
      assert.ok(
        data.code_explanation,
        `${name} must support top-level data.code_explanation getter`
      );
      assert.equal(data.code, data.implementations.java.code);
    }
  });

  it("verifies idiomatic C conventions (explicit size argument and pointer decay handling)", () => {
    assert.match(binarySearchContent.implementations.c.code, /size/);
    assert.match(binarySearchContent.implementations.c.code, /#include <stdio.h>/);
    assert.match(linearSearchContent.implementations.c.code, /int size/);
    assert.match(bubbleSortContent.implementations.c.code, /int size/);
  });

  it("verifies idiomatic Python conventions (type hints and floor division)", () => {
    assert.match(binarySearchContent.implementations.python.code, /\/\/ 2/);
    assert.match(binarySearchContent.implementations.python.code, /def binary_search/);
    assert.match(linearSearchContent.implementations.python.code, /def linear_search/);
    assert.match(bubbleSortContent.implementations.python.code, /def bubble_sort/);
  });

  it("verifies idiomatic Java conventions (class structure and typed arrays)", () => {
    assert.match(binarySearchContent.implementations.java.code, /public class BinarySearch/);
    assert.match(linearSearchContent.implementations.java.code, /public class LinearSearch/);
    assert.match(bubbleSortContent.implementations.java.code, /public class BubbleSort/);
  });
});

describe("Multilingual Visualizer - Trace to Code Line Synchronization", () => {
  it("synchronizes Binary Search steps with C, Java, and Python line numbers", () => {
    const trace = generateBinarySearchTrace([2, 5, 8, 12, 16, 23, 38], 23);

    for (const step of trace) {
      for (const lang of SUPPORTED_LANGUAGES) {
        const impl = binarySearchContent.implementations[lang];
        const line = impl.mapStepToLine(step);
        assert.ok(typeof line === "number", `Line should be a number for ${lang} at phase ${step.phase}`);
        assert.ok(line >= 1 && line <= impl.codeLines.length, `Line ${line} out of range for ${lang}`);
      }
    }
  });

  it("synchronizes Binary Search target missing step across all languages", () => {
    const trace = generateBinarySearchTrace([10, 20, 30], 99);
    const finalStep = trace[trace.length - 1];
    assert.equal(finalStep.phase, "not_found");

    assert.equal(binarySearchContent.implementations.c.mapStepToLine(finalStep), 11);
    assert.equal(binarySearchContent.implementations.java.mapStepToLine(finalStep), 11);
    assert.equal(binarySearchContent.implementations.python.mapStepToLine(finalStep), 11);
  });

  it("synchronizes Linear Search steps across C, Java, and Python", () => {
    const trace = generateLinearSearchTrace([14, 27, 8, 42], 42);

    for (const step of trace) {
      for (const lang of SUPPORTED_LANGUAGES) {
        const impl = linearSearchContent.implementations[lang];
        const line = impl.mapStepToLine(step);
        assert.ok(typeof line === "number");
        assert.ok(line >= 1 && line <= impl.codeLines.length);
      }
    }

    const matchStep = trace.find((s) => s.phase === "found");
    assert.equal(linearSearchContent.implementations.c.mapStepToLine(matchStep), 4);
    assert.equal(linearSearchContent.implementations.java.mapStepToLine(matchStep), 4);
    assert.equal(linearSearchContent.implementations.python.mapStepToLine(matchStep), 4);
  });

  it("synchronizes Bubble Sort state changes across C, Java, and Python", () => {
    const initialStep = { comparing: false, swapped: false, finished: false };
    const compareStep = { comparing: true, swapped: false, finished: false };
    const swapStep = { comparing: true, swapped: true, finished: false };
    const finishStep = { comparing: false, swapped: false, finished: true };

    // C
    assert.equal(bubbleSortContent.implementations.c.mapStepToLine(initialStep), 1);
    assert.equal(bubbleSortContent.implementations.c.mapStepToLine(compareStep), 3);
    assert.equal(bubbleSortContent.implementations.c.mapStepToLine(swapStep), 6);
    assert.equal(bubbleSortContent.implementations.c.mapStepToLine(finishStep), 9);

    // Java
    assert.equal(bubbleSortContent.implementations.java.mapStepToLine(initialStep), 1);
    assert.equal(bubbleSortContent.implementations.java.mapStepToLine(compareStep), 3);
    assert.equal(bubbleSortContent.implementations.java.mapStepToLine(swapStep), 6);
    assert.equal(bubbleSortContent.implementations.java.mapStepToLine(finishStep), 9);

    // Python
    assert.equal(bubbleSortContent.implementations.python.mapStepToLine(initialStep), 2);
    assert.equal(bubbleSortContent.implementations.python.mapStepToLine(compareStep), 4);
    assert.equal(bubbleSortContent.implementations.python.mapStepToLine(swapStep), 5);
    assert.equal(bubbleSortContent.implementations.python.mapStepToLine(finishStep), 6);
  });

  it("synchronizes Insertion Sort phases across C, Java, and Python", () => {
    const keyStep = { phase: "select_key" };
    const compareStep = { phase: "compare" };
    const shiftStep = { phase: "shift" };
    const insertStep = { phase: "insert" };
    const completeStep = { phase: "complete", finished: true };

    // C
    assert.equal(insertionSortContent.implementations.c.mapStepToLine(keyStep), 3);
    assert.equal(insertionSortContent.implementations.c.mapStepToLine(compareStep), 5);
    assert.equal(insertionSortContent.implementations.c.mapStepToLine(shiftStep), 6);
    assert.equal(insertionSortContent.implementations.c.mapStepToLine(insertStep), 9);
    assert.equal(insertionSortContent.implementations.c.mapStepToLine(completeStep), 11);

    // Java
    assert.equal(insertionSortContent.implementations.java.mapStepToLine(keyStep), 3);
    assert.equal(insertionSortContent.implementations.java.mapStepToLine(compareStep), 5);
    assert.equal(insertionSortContent.implementations.java.mapStepToLine(shiftStep), 6);
    assert.equal(insertionSortContent.implementations.java.mapStepToLine(insertStep), 9);
    assert.equal(insertionSortContent.implementations.java.mapStepToLine(completeStep), 11);

    // Python
    assert.equal(insertionSortContent.implementations.python.mapStepToLine(keyStep), 3);
    assert.equal(insertionSortContent.implementations.python.mapStepToLine(compareStep), 5);
    assert.equal(insertionSortContent.implementations.python.mapStepToLine(shiftStep), 6);
    assert.equal(insertionSortContent.implementations.python.mapStepToLine(insertStep), 8);
    assert.equal(insertionSortContent.implementations.python.mapStepToLine(completeStep), 8);
  });

  it("synchronizes Selection Sort phases across C, Java, and Python", () => {
    const startPassStep = { phase: "start_pass" };
    const compareStep = { phase: "compare" };
    const updateMinStep = { phase: "update_min" };
    const swapStep = { phase: "swap" };
    const passCompleteStep = { phase: "pass_complete" };
    const completeStep = { phase: "complete", finished: true };

    // C
    assert.equal(selectionSortContent.implementations.c.mapStepToLine(startPassStep), 3);
    assert.equal(selectionSortContent.implementations.c.mapStepToLine(compareStep), 5);
    assert.equal(selectionSortContent.implementations.c.mapStepToLine(updateMinStep), 6);
    assert.equal(selectionSortContent.implementations.c.mapStepToLine(swapStep), 10);
    assert.equal(selectionSortContent.implementations.c.mapStepToLine(passCompleteStep), 12);
    assert.equal(selectionSortContent.implementations.c.mapStepToLine(completeStep), 13);

    // Java
    assert.equal(selectionSortContent.implementations.java.mapStepToLine(startPassStep), 3);
    assert.equal(selectionSortContent.implementations.java.mapStepToLine(compareStep), 5);
    assert.equal(selectionSortContent.implementations.java.mapStepToLine(updateMinStep), 6);
    assert.equal(selectionSortContent.implementations.java.mapStepToLine(swapStep), 10);
    assert.equal(selectionSortContent.implementations.java.mapStepToLine(passCompleteStep), 12);
    assert.equal(selectionSortContent.implementations.java.mapStepToLine(completeStep), 13);

    // Python
    assert.equal(selectionSortContent.implementations.python.mapStepToLine(startPassStep), 3);
    assert.equal(selectionSortContent.implementations.python.mapStepToLine(compareStep), 5);
    assert.equal(selectionSortContent.implementations.python.mapStepToLine(updateMinStep), 6);
    assert.equal(selectionSortContent.implementations.python.mapStepToLine(swapStep), 8);
    assert.equal(selectionSortContent.implementations.python.mapStepToLine(passCompleteStep), 2);
    assert.equal(selectionSortContent.implementations.python.mapStepToLine(completeStep), 8);
  });
});

describe("Multilingual Preferences - Storage & Defaults", () => {
  it("defaults to Java when no preference is saved", () => {
    assert.equal(DEFAULT_LANGUAGE, "java");
  });

  it("validates supported languages constant", () => {
    assert.deepEqual(SUPPORTED_LANGUAGES, ["c", "java", "python"]);
  });

  it("reads and writes preferred language using mock storage", () => {
    const storageMap = new Map();
    globalThis.window = {
      localStorage: {
        getItem: (key) => storageMap.get(key) || null,
        setItem: (key, val) => storageMap.set(key, String(val))
      },
      dispatchEvent: () => true
    };

    assert.equal(getPreferredLanguage(), "java");

    setPreferredLanguage("python");
    assert.equal(storageMap.get(STORAGE_KEY), "python");
    assert.equal(getPreferredLanguage(), "python");

    setPreferredLanguage("c");
    assert.equal(storageMap.get(STORAGE_KEY), "c");
    assert.equal(getPreferredLanguage(), "c");

    // Invalid language is ignored
    setPreferredLanguage("unsupported_lang");
    assert.equal(getPreferredLanguage(), "c");

    delete globalThis.window;
  });
});
