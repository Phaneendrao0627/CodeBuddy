/**
 * Deterministic, language-independent trace engine and input validator for Selection Sort.
 * Ascending sort supporting custom arrays, duplicates, negative numbers, and edge cases.
 */

/**
 * Validates user-provided array input for Selection Sort.
 * Supports comma-separated strings (e.g. "64, 25, 12, 22, 11" or "-3, 5, -8, 2, 0") or existing number arrays.
 */
export function validateSelectionSortInput(rawArray) {
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
        error: "Array elements must be valid numbers (e.g. 64, -12, 22)."
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
 * Generates an immutable, step-by-step trace of Selection Sort.
 * Differentiates clearly between:
 * - Current slot being filled (index i)
 * - Candidate minimum index (minIdx) and value
 * - Current element being compared (index j)
 * - Swapping the found minimum into slot i
 * - Growing sorted prefix [0..i] and shrinking unsorted suffix [i+1..n-1]
 * - Comparison and swap counts
 */
export function generateSelectionSortTrace(initialNumbers) {
  if (!Array.isArray(initialNumbers) || initialNumbers.length === 0) {
    return [
      {
        stepIndex: 0,
        array: [],
        phase: "empty",
        pass: 0,
        targetIndex: null,
        minIdx: null,
        compareIndex: null,
        swapFrom: null,
        swapTo: null,
        sortedIndices: [],
        comparisonsCount: 0,
        swapsCount: 0,
        message: "Empty array. No sorting needed.",
        finished: true
      }
    ];
  }

  const n = initialNumbers.length;

  if (n === 1) {
    return [
      {
        stepIndex: 0,
        array: [...initialNumbers],
        phase: "complete",
        pass: 0,
        targetIndex: 0,
        minIdx: 0,
        compareIndex: null,
        swapFrom: null,
        swapTo: null,
        sortedIndices: [0],
        comparisonsCount: 0,
        swapsCount: 0,
        message: `Single element [${initialNumbers[0]}] is trivially sorted.`,
        finished: true
      }
    ];
  }

  const steps = [];
  let stepIndex = 0;
  let comparisonsCount = 0;
  let swapsCount = 0;

  // Working copy of array
  const currentArray = [...initialNumbers];

  // Initial Step
  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    phase: "initial",
    pass: 0,
    targetIndex: 0,
    minIdx: 0,
    compareIndex: null,
    swapFrom: null,
    swapTo: null,
    sortedIndices: [],
    comparisonsCount: 0,
    swapsCount: 0,
    message: `Initial state: Starting Selection Sort on [${currentArray.join(", ")}]. Entire array is unsorted.`,
    finished: false
  });

  // Outer loop: populate indices 0 to n - 2
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    const sortedIndicesBeforePass = Array.from({ length: i }, (_, k) => k);

    // Step: Start pass and initialize minIdx
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "start_pass",
      pass: i,
      targetIndex: i,
      minIdx: i,
      compareIndex: null,
      swapFrom: null,
      swapTo: null,
      sortedIndices: sortedIndicesBeforePass,
      comparisonsCount,
      swapsCount,
      message: `Pass ${i + 1}: Finding minimum element for slot [${i}] in unsorted range [${i}..${n - 1}]. Initial candidate is numbers[${i}] = ${currentArray[i]}.`,
      finished: false
    });

    // Inner loop: scan remaining unsorted elements [i+1..n-1]
    for (let j = i + 1; j < n; j++) {
      comparisonsCount++;
      const isSmaller = currentArray[j] < currentArray[minIdx];

      // Comparison Step
      steps.push({
        stepIndex: stepIndex++,
        array: [...currentArray],
        phase: "compare",
        pass: i,
        targetIndex: i,
        minIdx,
        compareIndex: j,
        swapFrom: null,
        swapTo: null,
        sortedIndices: sortedIndicesBeforePass,
        comparisonsCount,
        swapsCount,
        message: `Compare: Is numbers[${j}] (${currentArray[j]}) < numbers[${minIdx}] (${currentArray[minIdx]})? ${isSmaller ? "YES" : "NO"}.`,
        finished: false
      });

      if (isSmaller) {
        minIdx = j;
        // Update Min Step
        steps.push({
          stepIndex: stepIndex++,
          array: [...currentArray],
          phase: "update_min",
          pass: i,
          targetIndex: i,
          minIdx,
          compareIndex: j,
          swapFrom: null,
          swapTo: null,
          sortedIndices: sortedIndicesBeforePass,
          comparisonsCount,
          swapsCount,
          message: `New minimum found! Updated candidate minIdx to [${minIdx}] (value ${currentArray[minIdx]}).`,
          finished: false
        });
      }
    }

    // Swap Step (if minIdx != i, perform swap; otherwise report no swap needed)
    if (minIdx !== i) {
      const valA = currentArray[i];
      const valB = currentArray[minIdx];
      currentArray[i] = valB;
      currentArray[minIdx] = valA;
      swapsCount++;

      steps.push({
        stepIndex: stepIndex++,
        array: [...currentArray],
        phase: "swap",
        pass: i,
        targetIndex: i,
        minIdx,
        compareIndex: null,
        swapFrom: i,
        swapTo: minIdx,
        sortedIndices: sortedIndicesBeforePass,
        comparisonsCount,
        swapsCount,
        message: `Swap: Placed minimum value ${valB} into slot [${i}] by swapping with numbers[${minIdx}] (${valA}).`,
        finished: false
      });
    } else {
      steps.push({
        stepIndex: stepIndex++,
        array: [...currentArray],
        phase: "swap",
        pass: i,
        targetIndex: i,
        minIdx,
        compareIndex: null,
        swapFrom: i,
        swapTo: i,
        sortedIndices: sortedIndicesBeforePass,
        comparisonsCount,
        swapsCount,
        message: `No swap needed: numbers[${i}] (${currentArray[i]}) is already the minimum for this pass.`,
        finished: false
      });
    }

    // Pass Complete Step: sorted prefix now includes slot i
    const sortedIndicesAfterPass = Array.from({ length: i + 1 }, (_, k) => k);
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "pass_complete",
      pass: i,
      targetIndex: i,
      minIdx,
      compareIndex: null,
      swapFrom: null,
      swapTo: null,
      sortedIndices: sortedIndicesAfterPass,
      comparisonsCount,
      swapsCount,
      message: `Pass ${i + 1} complete. Slot [${i}] locked at ${currentArray[i]}. Sorted prefix is now [0..${i}]: [${currentArray.slice(0, i + 1).join(", ")}].`,
      finished: false
    });
  }

  // Final Step: Complete
  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    phase: "complete",
    pass: n - 1,
    targetIndex: null,
    minIdx: null,
    compareIndex: null,
    swapFrom: null,
    swapTo: null,
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    comparisonsCount,
    swapsCount,
    message: `🎉 Selection Sort complete! Array fully sorted in ${comparisonsCount} comparisons and ${swapsCount} swap${swapsCount === 1 ? "" : "s"}.`,
    finished: true
  });

  return steps;
}
