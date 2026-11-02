/**
 * Deterministic Jump Search trace engine and input validator.
 * Generates an immutable, step-by-step trace of block jumps and subsequent linear scans.
 */

/**
 * Validates user-provided input for Jump Search.
 * Ensures the array is non-empty, contains valid numbers, and is strictly sorted in ascending order.
 */
export function validateJumpSearchInput(rawArray, rawTarget) {
  if (rawArray === undefined || rawArray === null || (typeof rawArray === "string" && rawArray.trim() === "")) {
    return {
      valid: false,
      numbers: [],
      target: null,
      error: "Array cannot be empty. Please enter comma-separated numbers."
    };
  }

  let numbers = [];
  if (Array.isArray(rawArray)) {
    numbers = rawArray.slice();
  } else if (typeof rawArray === "string") {
    const tokens = rawArray.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    if (tokens.length === 0) {
      return {
        valid: false,
        numbers: [],
        target: null,
        error: "Array cannot be empty. Please enter comma-separated numbers."
      };
    }
    for (const token of tokens) {
      const num = Number(token);
      if (Number.isNaN(num)) {
        return {
          valid: false,
          numbers: [],
          target: null,
          error: `"${token}" is not a valid number. All elements must be valid numbers.`
        };
      }
      numbers.push(num);
    }
  }

  if (numbers.length === 0) {
    return {
      valid: false,
      numbers: [],
      target: null,
      error: "Array cannot be empty."
    };
  }

  if (rawTarget === undefined || rawTarget === null || (typeof rawTarget === "string" && rawTarget.trim() === "")) {
    return {
      valid: false,
      numbers,
      target: null,
      error: "Target number cannot be empty. Please enter a target number."
    };
  }

  const target = Number(rawTarget);
  if (Number.isNaN(target)) {
    return {
      valid: false,
      numbers,
      target: null,
      error: `Target "${rawTarget}" is not a valid number.`
    };
  }

  // Validate sorted order
  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] > numbers[i + 1]) {
      return {
        valid: false,
        numbers,
        target,
        isUnsorted: true,
        error: `Jump Search requires a sorted array. Element ${numbers[i]} at index ${i} is greater than ${numbers[i + 1]} at index ${i + 1}.`
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
 */
export function sortArrayAscending(numbers) {
  return [...numbers].sort((a, b) => a - b);
}

/**
 * Computes optimal jump size m = floor(sqrt(n))
 */
export function calculateJumpStep(n) {
  if (n <= 0) return 1;
  return Math.max(1, Math.floor(Math.sqrt(n)));
}

/**
 * Generates an immutable, deterministic execution trace for Jump Search.
 */
export function generateJumpSearchTrace(numbers, target) {
  if (!numbers || numbers.length === 0) {
    return [
      {
        stepIndex: 0,
        phase: "not_found",
        jumpSize: 0,
        prev: 0,
        step: 0,
        blockStart: 0,
        blockEnd: 0,
        currentIndex: null,
        comparedValue: null,
        target: target ?? 0,
        comparisonResult: "Empty array",
        action: "Array is empty. Returning -1.",
        skippedIndices: [],
        activeBlockIndices: [],
        checkedIndices: [],
        found: false,
        foundIndex: -1,
        finished: true,
        comparisonsCount: 0
      }
    ];
  }

  const n = numbers.length;
  const jumpSize = calculateJumpStep(n);
  const steps = [];
  let stepIndex = 0;
  let comparisonsCount = 0;

  // Step 0: Initial State
  steps.push({
    stepIndex: stepIndex++,
    phase: "initial",
    jumpSize,
    prev: 0,
    step: jumpSize,
    blockStart: 0,
    blockEnd: Math.min(jumpSize, n) - 1,
    currentIndex: null,
    comparedValue: null,
    target,
    comparisonResult: "Ready to search",
    action: `Calculated optimal jump size m = ⌊√${n}⌋ = ${jumpSize}. Preparing to inspect block boundaries.`,
    skippedIndices: [],
    activeBlockIndices: Array.from({ length: Math.min(jumpSize, n) }, (_, i) => i),
    checkedIndices: [],
    found: false,
    foundIndex: -1,
    finished: false,
    comparisonsCount: 0
  });

  let prev = 0;
  let step = jumpSize;
  const skippedIndices = [];
  let reachedEndOfArray = false;

  // Phase 1: Block Jumping
  while (true) {
    const boundaryIndex = Math.min(step, n) - 1;
    const boundaryValue = numbers[boundaryIndex];
    comparisonsCount++;

    const currentBlockIndices = [];
    for (let i = prev; i <= boundaryIndex; i++) {
      currentBlockIndices.push(i);
    }

    if (boundaryValue < target) {
      // Step: Target is greater than block boundary, jump to next block
      steps.push({
        stepIndex: stepIndex++,
        phase: "block_jump",
        jumpSize,
        prev,
        step,
        blockStart: prev,
        blockEnd: boundaryIndex,
        currentIndex: boundaryIndex,
        comparedValue: boundaryValue,
        target,
        comparisonResult: `numbers[${boundaryIndex}] (${boundaryValue}) < target (${target})`,
        action: `Boundary element at index ${boundaryIndex} (${boundaryValue}) is less than ${target}. Skipping block [${prev}..${boundaryIndex}] and jumping ahead by ${jumpSize}.`,
        skippedIndices: [...skippedIndices, ...currentBlockIndices],
        activeBlockIndices: currentBlockIndices,
        checkedIndices: [boundaryIndex],
        found: false,
        foundIndex: -1,
        finished: false,
        comparisonsCount
      });

      // Mark current block indices as skipped
      for (const idx of currentBlockIndices) {
        skippedIndices.push(idx);
      }

      prev = step;
      step += jumpSize;

      if (prev >= n) {
        reachedEndOfArray = true;
        break;
      }
    } else {
      // Step: Boundary element is >= target, target must be inside this block!
      steps.push({
        stepIndex: stepIndex++,
        phase: "block_found",
        jumpSize,
        prev,
        step,
        blockStart: prev,
        blockEnd: boundaryIndex,
        currentIndex: boundaryIndex,
        comparedValue: boundaryValue,
        target,
        comparisonResult: `numbers[${boundaryIndex}] (${boundaryValue}) >= target (${target})`,
        action: `Boundary element at index ${boundaryIndex} (${boundaryValue}) >= target ${target}. Target must lie in block [${prev}..${boundaryIndex}]. Transitioning to backward linear scan.`,
        skippedIndices: [...skippedIndices],
        activeBlockIndices: currentBlockIndices,
        checkedIndices: [boundaryIndex],
        found: false,
        foundIndex: -1,
        finished: false,
        comparisonsCount
      });
      break;
    }
  }

  if (reachedEndOfArray) {
    steps.push({
      stepIndex: stepIndex++,
      phase: "not_found",
      jumpSize,
      prev,
      step,
      blockStart: prev,
      blockEnd: n - 1,
      currentIndex: null,
      comparedValue: null,
      target,
      comparisonResult: `prev (${prev}) >= n (${n})`,
      action: `Exceeded array bounds without finding a boundary >= ${target}. Target is greater than all elements. Returning -1.`,
      skippedIndices: Array.from({ length: n }, (_, i) => i),
      activeBlockIndices: [],
      checkedIndices: [],
      found: false,
      foundIndex: -1,
      finished: true,
      comparisonsCount
    });
    return steps;
  }

  // Phase 2: Linear Scan inside block [prev, min(step, n) - 1]
  const limit = Math.min(step, n);
  const activeBlockIndices = [];
  for (let i = prev; i < limit; i++) {
    activeBlockIndices.push(i);
  }
  const linearChecked = [];
  let found = false;
  let curr = prev;

  while (curr < limit) {
    const val = numbers[curr];
    comparisonsCount++;
    linearChecked.push(curr);

    if (val === target) {
      found = true;
      steps.push({
        stepIndex: stepIndex++,
        phase: "found",
        jumpSize,
        prev,
        step,
        blockStart: prev,
        blockEnd: limit - 1,
        currentIndex: curr,
        comparedValue: val,
        target,
        comparisonResult: `numbers[${curr}] (${val}) == target (${target})`,
        action: `Target ${target} found at index ${curr}! Linear scan completes successfully.`,
        skippedIndices: [...skippedIndices],
        activeBlockIndices,
        checkedIndices: [...linearChecked],
        found: true,
        foundIndex: curr,
        finished: true,
        comparisonsCount
      });
      break;
    } else if (val > target) {
      // Since array is sorted, if numbers[curr] > target, target cannot exist
      steps.push({
        stepIndex: stepIndex++,
        phase: "not_found",
        jumpSize,
        prev,
        step,
        blockStart: prev,
        blockEnd: limit - 1,
        currentIndex: curr,
        comparedValue: val,
        target,
        comparisonResult: `numbers[${curr}] (${val}) > target (${target})`,
        action: `numbers[${curr}] (${val}) is greater than target ${target} in sorted array. Target does not exist in block. Returning -1.`,
        skippedIndices: [...skippedIndices],
        activeBlockIndices,
        checkedIndices: [...linearChecked],
        found: false,
        foundIndex: -1,
        finished: true,
        comparisonsCount
      });
      return steps;
    } else {
      // val < target, keep scanning linearly
      steps.push({
        stepIndex: stepIndex++,
        phase: "linear_scan",
        jumpSize,
        prev,
        step,
        blockStart: prev,
        blockEnd: limit - 1,
        currentIndex: curr,
        comparedValue: val,
        target,
        comparisonResult: `numbers[${curr}] (${val}) < target (${target})`,
        action: `Checking index ${curr}: value ${val} != ${target}. Advancing linear scan pointer.`,
        skippedIndices: [...skippedIndices],
        activeBlockIndices,
        checkedIndices: [...linearChecked],
        found: false,
        foundIndex: -1,
        finished: false,
        comparisonsCount
      });
    }

    curr++;
  }

  if (!found) {
    steps.push({
      stepIndex: stepIndex++,
      phase: "not_found",
      jumpSize,
      prev,
      step,
      blockStart: prev,
      blockEnd: limit - 1,
      currentIndex: null,
      comparedValue: null,
      target,
      comparisonResult: `curr reached limit ${limit}`,
      action: `Exhausted linear scan of block [${prev}..${limit - 1}] without finding target ${target}. Target is absent. Returning -1.`,
      skippedIndices: [...skippedIndices],
      activeBlockIndices,
      checkedIndices: [...linearChecked],
      found: false,
      foundIndex: -1,
      finished: true,
      comparisonsCount
    });
  }

  return steps;
}
