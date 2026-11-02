/**
 * Pure, deterministic Linear Search trace generator and validator.
 * 
 * Linear Search scans elements sequentially from left to right.
 * Unlike Binary Search, it does NOT require the array to be sorted.
 */

/**
 * Validates array and target inputs for Linear Search.
 * 
 * @param {string|number[]} rawArray - Comma-separated string or array of numbers.
 * @param {string|number} rawTarget - Target search value.
 * @returns {{ valid: boolean, numbers?: number[], target?: number, error?: string }}
 */
export function validateLinearSearchInput(rawArray, rawTarget) {
  // 1. Validate target
  if (rawTarget === undefined || rawTarget === null || String(rawTarget).trim() === "") {
    return {
      valid: false,
      error: "Please enter a target number to search for."
    };
  }

  const target = Number(rawTarget);
  if (!Number.isFinite(target)) {
    return {
      valid: false,
      error: `Target value "${rawTarget}" is not a valid number.`
    };
  }

  // 2. Validate array existence
  if (rawArray === undefined || rawArray === null) {
    return {
      valid: false,
      error: "Please enter a comma-separated list of numbers."
    };
  }

  let numbers = [];

  if (typeof rawArray === "string") {
    const trimmed = rawArray.trim();
    if (trimmed.length === 0) {
      return {
        valid: false,
        error: "Array cannot be empty. Please enter comma-separated numbers."
      };
    }

    const tokens = trimmed.split(",").map((token) => token.trim());
    if (tokens.length === 0 || (tokens.length === 1 && tokens[0] === "")) {
      return {
        valid: false,
        error: "Array cannot be empty. Please enter comma-separated numbers."
      };
    }

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token === "") {
        return {
          valid: false,
          error: `Empty value found at position ${i + 1}. Check for consecutive commas.`
        };
      }
      const num = Number(token);
      if (!Number.isFinite(num)) {
        return {
          valid: false,
          error: `Element "${token}" at position ${i + 1} is not a valid number.`
        };
      }
      numbers.push(num);
    }
  } else if (Array.isArray(rawArray)) {
    if (rawArray.length === 0) {
      return {
        valid: false,
        error: "Array cannot be empty."
      };
    }

    for (let i = 0; i < rawArray.length; i++) {
      const num = Number(rawArray[i]);
      if (!Number.isFinite(num)) {
        return {
          valid: false,
          error: `Element "${rawArray[i]}" at index ${i} is not a valid number.`
        };
      }
      numbers.push(num);
    }
  } else {
    return {
      valid: false,
      error: "Array input must be a comma-separated string or an array of numbers."
    };
  }

  // Note: Linear Search works on ANY array (sorted or unsorted). No sort check needed.

  return {
    valid: true,
    numbers,
    target,
    error: null
  };
}

/**
 * Generates an immutable, step-by-step execution trace for Linear Search.
 * 
 * Each step contains:
 * - stepIndex: 0-based sequence counter
 * - phase: 'initial' | 'comparing' | 'found' | 'not_found'
 * - currentIndex: index currently inspected (or null)
 * - comparedValue: numbers[currentIndex] (or null)
 * - target: number to locate
 * - comparisonResult: string describing match or mismatch
 * - action: explanation of what happens next
 * - checkedIndices: indices already inspected before or including this step
 * - uncheckedIndices: indices yet to be inspected
 * - found: boolean
 * - foundIndex: number or -1
 * - finished: boolean
 * - codeLine: active Java reference line number
 * 
 * @param {number[]} numbers - Numbers array (can be unsorted)
 * @param {number} target - Number to locate
 * @returns {Array<object>} trace steps
 */
export function generateLinearSearchTrace(numbers, target) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return [];
  }

  const steps = [];
  let stepIndex = 0;
  const n = numbers.length;

  // Step 0: Initial State before loop begins
  steps.push({
    stepIndex: stepIndex++,
    phase: "initial",
    currentIndex: null,
    comparedValue: null,
    target,
    comparisonResult: "Initial state before scanning.",
    action: `Ready to search for target ${target} sequentially from index 0 across all ${n} elements.`,
    checkedIndices: [],
    uncheckedIndices: numbers.map((_, idx) => idx),
    found: false,
    foundIndex: -1,
    finished: false,
    codeLine: 2 // for (int i = 0; i < numbers.length; i++)
  });

  let found = false;

  for (let i = 0; i < n; i++) {
    const comparedValue = numbers[i];
    const checkedBefore = [];
    for (let k = 0; k < i; k++) {
      checkedBefore.push(k);
    }
    const uncheckedAfter = [];
    for (let k = i + 1; k < n; k++) {
      uncheckedAfter.push(k);
    }

    if (comparedValue === target) {
      found = true;

      steps.push({
        stepIndex: stepIndex++,
        phase: "found",
        currentIndex: i,
        comparedValue,
        target,
        comparisonResult: `numbers[${i}] (${comparedValue}) == target (${target})`,
        action: `Target ${target} matches element at index ${i}! Search terminates immediately with success.`,
        checkedIndices: [...checkedBefore, i],
        uncheckedIndices: uncheckedAfter,
        found: true,
        foundIndex: i,
        finished: true,
        codeLine: 4 // return i;
      });
      break;
    } else {
      steps.push({
        stepIndex: stepIndex++,
        phase: "comparing",
        currentIndex: i,
        comparedValue,
        target,
        comparisonResult: `numbers[${i}] (${comparedValue}) != target (${target})`,
        action: i < n - 1
          ? `Index ${i} (${comparedValue}) is not the target (${target}). Advancing to index ${i + 1}.`
          : `Index ${i} (${comparedValue}) is not the target (${target}). End of array reached.`,
        checkedIndices: [...checkedBefore, i],
        uncheckedIndices: uncheckedAfter,
        found: false,
        foundIndex: -1,
        finished: false,
        codeLine: 3 // if (numbers[i] == target)
      });
    }
  }

  // If target was not found after checking all elements
  if (!found) {
    steps.push({
      stepIndex: stepIndex++,
      phase: "not_found",
      currentIndex: null,
      comparedValue: null,
      target,
      comparisonResult: `Entire array checked (${n} comparisons). Target ${target} not found.`,
      action: `Exhausted all ${n} elements without finding target ${target}. Returning -1.`,
      checkedIndices: numbers.map((_, idx) => idx),
      uncheckedIndices: [],
      found: false,
      foundIndex: -1,
      finished: true,
      codeLine: 7 // return -1;
    });
  }

  return steps;
}
