/**
 * Pure, deterministic Binary Search trace generator and validator.
 * 
 * Provides verifiable, step-by-step state snapshots for interactive visualizers.
 */

/**
 * Validates array and target inputs for Binary Search.
 * 
 * @param {string|number[]} rawArray - Comma-separated string or array of numbers.
 * @param {string|number} rawTarget - Target search value.
 * @returns {{ valid: boolean, numbers?: number[], target?: number, error?: string, isUnsorted?: boolean }}
 */
export function validateBinarySearchInput(rawArray, rawTarget) {
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

  // 3. Verify sorted order (non-decreasing)
  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] > numbers[i + 1]) {
      return {
        valid: false,
        isUnsorted: true,
        numbers,
        target,
        error: `Array is not sorted: ${numbers[i]} appears before ${numbers[i + 1]} at indices ${i} and ${i + 1}. Binary Search requires an array sorted in ascending order.`
      };
    }
  }

  return {
    valid: true,
    numbers,
    target,
    error: null,
    isUnsorted: false
  };
}

/**
 * Returns a new array sorted in ascending order.
 * 
 * @param {number[]} numbers 
 * @returns {number[]}
 */
export function sortArrayAscending(numbers) {
  return [...numbers].sort((a, b) => a - b);
}

/**
 * Generates an immutable, step-by-step execution trace for Binary Search.
 * 
 * Each step contains:
 * - stepIndex: 0-based sequence counter
 * - phase: 'initial' | 'comparing' | 'found' | 'not_found'
 * - low: current left pointer index
 * - high: current right pointer index
 * - mid: current midpoint index (or null if outside search)
 * - comparedValue: numbers[mid] (or null)
 * - target: the search target
 * - comparisonResult: explanation of the comparison (e.g. "numbers[mid] == target")
 * - action: what happens next
 * - eliminatedIndices: indices discarded up to this step
 * - activeRange: [low, high]
 * - found: boolean
 * - foundIndex: number or -1
 * - finished: boolean
 * - codeLine: active Java reference line number
 * 
 * @param {number[]} numbers - Sorted numbers array
 * @param {number} target - Number to locate
 * @returns {Array<object>} trace steps
 */
export function generateBinarySearchTrace(numbers, target) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return [];
  }

  const steps = [];
  let low = 0;
  let high = numbers.length - 1;
  let stepIndex = 0;

  // Step 0: Initial State before first comparison
  steps.push({
    stepIndex: stepIndex++,
    phase: "initial",
    low,
    high,
    mid: null,
    comparedValue: null,
    target,
    comparisonResult: "Initial search range initialized.",
    action: `Ready to search for target ${target} across indices 0 to ${high}.`,
    eliminatedIndices: [],
    activeRange: [low, high],
    found: false,
    foundIndex: -1,
    finished: false,
    codeLine: 2 // int low = 0, high = numbers.length - 1
  });

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    const comparedValue = numbers[mid];

    // Compute eliminated indices up to this point
    const eliminated = [];
    for (let i = 0; i < numbers.length; i++) {
      if (i < low || i > high) {
        eliminated.push(i);
      }
    }

    if (comparedValue === target) {
      // Target found at mid!
      const finalEliminated = [];
      for (let i = 0; i < numbers.length; i++) {
        if (i !== mid) {
          finalEliminated.push(i);
        }
      }

      steps.push({
        stepIndex: stepIndex++,
        phase: "found",
        low,
        high,
        mid,
        comparedValue,
        target,
        comparisonResult: `numbers[${mid}] (${comparedValue}) == target (${target})`,
        action: `Target ${target} found at index ${mid}! The search terminates successfully.`,
        eliminatedIndices: finalEliminated,
        activeRange: [mid, mid],
        found: true,
        foundIndex: mid,
        finished: true,
        codeLine: 8 // return mid;
      });
      break;
    } else if (comparedValue < target) {
      // Target is in the right half
      steps.push({
        stepIndex: stepIndex++,
        phase: "comparing",
        low,
        high,
        mid,
        comparedValue,
        target,
        comparisonResult: `numbers[${mid}] (${comparedValue}) < target (${target})`,
        action: `Since ${target} > ${comparedValue}, discard left half (indices ${low} to ${mid}). Set low = mid + 1 (${mid + 1}).`,
        eliminatedIndices: eliminated,
        activeRange: [low, high],
        found: false,
        foundIndex: -1,
        finished: false,
        codeLine: 10 // low = mid + 1;
      });

      low = mid + 1;
    } else {
      // Target is in the left half (comparedValue > target)
      steps.push({
        stepIndex: stepIndex++,
        phase: "comparing",
        low,
        high,
        mid,
        comparedValue,
        target,
        comparisonResult: `numbers[${mid}] (${comparedValue}) > target (${target})`,
        action: `Since ${target} < ${comparedValue}, discard right half (indices ${mid} to ${high}). Set high = mid - 1 (${mid - 1}).`,
        eliminatedIndices: eliminated,
        activeRange: [low, high],
        found: false,
        foundIndex: -1,
        finished: false,
        codeLine: 12 // high = mid - 1;
      });

      high = mid - 1;
    }
  }

  // If low > high without finding target: Final Not Found Step
  const lastStep = steps[steps.length - 1];
  if (!lastStep || !lastStep.found) {
    const allIndices = numbers.map((_, idx) => idx);
    steps.push({
      stepIndex: stepIndex++,
      phase: "not_found",
      low,
      high,
      mid: null,
      comparedValue: null,
      target,
      comparisonResult: `low (${low}) > high (${high})`,
      action: `Search range is empty (low > high). Target ${target} does not exist in the array.`,
      eliminatedIndices: allIndices,
      activeRange: [],
      found: false,
      foundIndex: -1,
      finished: true,
      codeLine: 16 // return -1;
    });
  }

  return steps;
}
