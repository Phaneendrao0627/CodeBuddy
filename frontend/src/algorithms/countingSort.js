/**
 * Deterministic, language-independent trace engine and input validator for Counting Sort.
 * Implements stable Counting Sort with min/max offset to support negative numbers.
 */

/**
 * Validates user-provided array input for Counting Sort.
 * Supports comma-separated strings (e.g. "4, 2, 2, 8, 3, 3, 1") or numeric arrays.
 */
export function validateCountingSortInput(rawArray) {
  if (rawArray === null || rawArray === undefined) {
    return {
      valid: false,
      error: "Please enter a comma-separated list of numbers."
    };
  }

  if (Array.isArray(rawArray)) {
    if (rawArray.length === 0) {
      return { valid: true, numbers: [] };
    }
    const hasInvalid = rawArray.some((x) => typeof x !== "number" || Number.isNaN(x));
    if (hasInvalid) {
      return {
        valid: false,
        error: "Array elements must be valid numbers (e.g. 4, -2, 8)."
      };
    }
    return { valid: true, numbers: [...rawArray] };
  }

  const trimmed = String(rawArray).trim();
  if (!trimmed) {
    return {
      valid: false,
      error: "Please enter a comma-separated list of numbers."
    };
  }

  const tokens = trimmed
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  if (tokens.length === 0) {
    return {
      valid: false,
      error: "Please enter at least one number."
    };
  }

  const numbers = [];
  for (let i = 0; i < tokens.length; i++) {
    const num = Number(tokens[i]);
    if (Number.isNaN(num)) {
      return {
        valid: false,
        error: `Token "${tokens[i]}" at position ${i + 1} is not a valid number.`
      };
    }
    numbers.push(num);
  }

  return {
    valid: true,
    numbers
  };
}

/**
 * Helper: build an inclusive integer range [start..end].
 */
function makeRange(start, end) {
  if (start > end) return [];
  const res = [];
  for (let i = start; i <= end; i++) res.push(i);
  return res;
}

/**
 * Generates an immutable, step-by-step trace of Counting Sort.
 *
 * Trace phases:
 * - "empty"       : input array is empty
 * - "initial"     : starting array before sorting
 * - "find_min_max": after scanning for min and max values
 * - "counting"    : one step per element counted into the count array
 * - "cumulative"  : one step per index in count array being accumulated
 * - "placing"     : one step per element placed into output (right-to-left)
 * - "copyback"    : output array copied back to main array
 * - "complete"    : entire array fully sorted
 *
 * Each step contains all required fields (see brief).
 */
export function generateCountingSortTrace(initialNumbers) {
  // --- Empty array ---
  if (!Array.isArray(initialNumbers) || initialNumbers.length === 0) {
    return [
      {
        stepIndex: 0,
        array: [],
        phase: "empty",
        countArray: null,
        outputArray: null,
        minVal: null,
        maxVal: null,
        countingIndex: null,
        cumulativeIndex: null,
        placingIndex: null,
        sortedIndices: [],
        activeIndices: [],
        comparisonsCount: 0,
        swapsCount: 0,
        message: "Empty array. No sorting needed.",
        finished: true
      }
    ];
  }

  const n = initialNumbers.length;

  // --- Single element ---
  if (n === 1) {
    return [
      {
        stepIndex: 0,
        array: [...initialNumbers],
        phase: "complete",
        countArray: null,
        outputArray: null,
        minVal: initialNumbers[0],
        maxVal: initialNumbers[0],
        countingIndex: null,
        cumulativeIndex: null,
        placingIndex: null,
        sortedIndices: [0],
        activeIndices: [0],
        comparisonsCount: 0,
        swapsCount: 0,
        message: `Single element [${initialNumbers[0]}] is trivially sorted.`,
        finished: true
      }
    ];
  }

  const steps = [];
  const mainArray = [...initialNumbers]; // current state of main array
  let stepIndex = 0;

  // --- Phase: initial ---
  steps.push({
    stepIndex: stepIndex++,
    array: [...mainArray],
    phase: "initial",
    countArray: null,
    outputArray: null,
    minVal: null,
    maxVal: null,
    countingIndex: null,
    cumulativeIndex: null,
    placingIndex: null,
    sortedIndices: [],
    activeIndices: makeRange(0, n - 1),
    comparisonsCount: 0,
    swapsCount: 0,
    message: `Initial array with ${n} elements. Counting Sort will count occurrences of each value.`,
    finished: false
  });

  // --- Find min and max ---
  let minVal = mainArray[0];
  let maxVal = mainArray[0];
  for (let i = 1; i < n; i++) {
    if (mainArray[i] < minVal) minVal = mainArray[i];
    if (mainArray[i] > maxVal) maxVal = mainArray[i];
  }

  const range = maxVal - minVal + 1;

  // --- Phase: find_min_max ---
  steps.push({
    stepIndex: stepIndex++,
    array: [...mainArray],
    phase: "find_min_max",
    countArray: null,
    outputArray: null,
    minVal,
    maxVal,
    countingIndex: null,
    cumulativeIndex: null,
    placingIndex: null,
    sortedIndices: [],
    activeIndices: makeRange(0, n - 1),
    comparisonsCount: 0,
    swapsCount: 0,
    message: `Scanned all elements. Min = ${minVal}, Max = ${maxVal}. Count array size = ${range} (range = max − min + 1 = ${maxVal} − ${minVal} + 1).`,
    finished: false
  });

  // --- Phase: counting ---
  // Build count array step-by-step
  const countArray = new Array(range).fill(0);

  for (let i = 0; i < n; i++) {
    const num = mainArray[i];
    countArray[num - minVal]++;

    steps.push({
      stepIndex: stepIndex++,
      array: [...mainArray],
      phase: "counting",
      countArray: [...countArray],
      outputArray: null,
      minVal,
      maxVal,
      countingIndex: i,
      cumulativeIndex: null,
      placingIndex: null,
      sortedIndices: [],
      activeIndices: [i],
      comparisonsCount: 0,
      swapsCount: 0,
      message: `Counting element at index [${i}] = ${num}. count[${num} − ${minVal}] = count[${num - minVal}] is now ${countArray[num - minVal]}.`,
      finished: false
    });
  }

  // --- Phase: cumulative ---
  for (let i = 1; i < range; i++) {
    countArray[i] += countArray[i - 1];

    steps.push({
      stepIndex: stepIndex++,
      array: [...mainArray],
      phase: "cumulative",
      countArray: [...countArray],
      outputArray: null,
      minVal,
      maxVal,
      countingIndex: null,
      cumulativeIndex: i,
      placingIndex: null,
      sortedIndices: [],
      activeIndices: [],
      comparisonsCount: 0,
      swapsCount: 0,
      message: `Cumulative count at index [${i}]: count[${i}] += count[${i - 1}] → count[${i}] = ${countArray[i]}. This tells us where values ${minVal + i} and below will end up.`,
      finished: false
    });
  }

  // --- Phase: placing (right-to-left for stability) ---
  const outputArray = new Array(n).fill(null);

  for (let i = n - 1; i >= 0; i--) {
    const num = mainArray[i];
    const outputPos = --countArray[num - minVal];
    outputArray[outputPos] = num;

    steps.push({
      stepIndex: stepIndex++,
      array: [...mainArray],
      phase: "placing",
      countArray: [...countArray],
      outputArray: [...outputArray],
      minVal,
      maxVal,
      countingIndex: null,
      cumulativeIndex: null,
      placingIndex: i,
      sortedIndices: [],
      activeIndices: [i],
      comparisonsCount: 0,
      swapsCount: 0,
      message: `Placing element at index [${i}] = ${num} into output at position [${outputPos}]. count[${num - minVal}] decremented to ${countArray[num - minVal]}.`,
      finished: false
    });
  }

  // --- Phase: copyback ---
  // Copy output back to main array
  for (let i = 0; i < n; i++) {
    mainArray[i] = outputArray[i];
  }

  steps.push({
    stepIndex: stepIndex++,
    array: [...mainArray],
    phase: "copyback",
    countArray: null,
    outputArray: [...outputArray],
    minVal,
    maxVal,
    countingIndex: null,
    cumulativeIndex: null,
    placingIndex: null,
    sortedIndices: [],
    activeIndices: makeRange(0, n - 1),
    comparisonsCount: 0,
    swapsCount: 0,
    message: `Copying sorted output array back into the original array. All ${n} elements are now in their correct positions.`,
    finished: false
  });

  // --- Phase: complete ---
  steps.push({
    stepIndex: stepIndex++,
    array: [...mainArray],
    phase: "complete",
    countArray: null,
    outputArray: null,
    minVal,
    maxVal,
    countingIndex: null,
    cumulativeIndex: null,
    placingIndex: null,
    sortedIndices: makeRange(0, n - 1),
    activeIndices: makeRange(0, n - 1),
    comparisonsCount: 0,
    swapsCount: 0,
    message: `🎉 Counting Sort complete! Array fully sorted in O(n + k) time with no comparisons between elements.`,
    finished: true
  });

  return steps;
}
