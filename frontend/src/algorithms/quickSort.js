/**
 * Deterministic, language-independent trace engine and input validator for Quick Sort.
 * Implements the Lomuto partition scheme with the last element chosen as pivot.
 */

/**
 * Validates user-provided array input for Quick Sort.
 * Supports comma-separated strings (e.g. "38, 27, 43, 3, 9, 82, 10") or numeric arrays.
 */
export function validateQuickSortInput(rawArray) {
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
        error: "Array elements must be valid numbers (e.g. 38, -5, 27)."
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
 * Helper generating inclusive range array [start..end].
 */
function makeRange(start, end) {
  if (start > end) return [];
  const res = [];
  for (let i = start; i <= end; i++) res.push(i);
  return res;
}

/**
 * Generates an immutable, step-by-step trace of Quick Sort using the Lomuto partition scheme.
 * Pivot selection: last element of current subarray (numbers[right]).
 *
 * Trace phases:
 * - "initial": starting array before sorting
 * - "empty": empty input array
 * - "pivot_selected": pivot chosen at index right
 * - "compare": comparing numbers[j] with pivot
 * - "swap": incrementing partition boundary i and swapping numbers[i] with numbers[j] (when i !== j)
 * - "pivot_placed": swapping pivot from right into its finalized slot i + 1
 * - "partition_complete": partitioning finished for range [left..right]
 * - "recursion": preparing recursive calls on left and right subarrays
 * - "base_case": subarray has 1 or 0 elements and is trivially sorted
 * - "complete": entire array fully sorted
 *
 * Each step contains:
 * - stepIndex (number)
 * - array (number[])
 * - phase (string)
 * - comparisonsCount (number)
 * - swapsCount (number)
 * - activeIndices (number[])
 * - pivotIndex (number | null)
 * - scanIndex (number | null)
 * - boundaryIndex (number | null)
 * - left (number)
 * - right (number)
 * - depth (number)
 * - message (string)
 * - finished (boolean)
 */
export function generateQuickSortTrace(initialNumbers) {
  if (!Array.isArray(initialNumbers) || initialNumbers.length === 0) {
    return [
      {
        stepIndex: 0,
        array: [],
        phase: "empty",
        comparisonsCount: 0,
        swapsCount: 0,
        activeIndices: [],
        pivotIndex: null,
        scanIndex: null,
        boundaryIndex: null,
        left: 0,
        right: 0,
        depth: 0,
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
        comparisonsCount: 0,
        swapsCount: 0,
        activeIndices: [0],
        pivotIndex: 0,
        scanIndex: null,
        boundaryIndex: 0,
        left: 0,
        right: 0,
        depth: 0,
        message: `Single element [${initialNumbers[0]}] is trivially sorted.`,
        finished: true
      }
    ];
  }

  const steps = [];
  let stepIndex = 0;
  let comparisonsCount = 0;
  let swapsCount = 0;

  const currentArray = [...initialNumbers];

  // Initial Step
  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    phase: "initial",
    comparisonsCount: 0,
    swapsCount: 0,
    activeIndices: makeRange(0, n - 1),
    pivotIndex: null,
    scanIndex: null,
    boundaryIndex: null,
    left: 0,
    right: n - 1,
    depth: 0,
    message: `Initial state: Starting Quick Sort on [${currentArray.join(", ")}]. Range [0..${n - 1}].`,
    finished: false
  });

  function quickSortRec(left, right, depth) {
    if (left >= right) {
      if (left === right) {
        steps.push({
          stepIndex: stepIndex++,
          array: [...currentArray],
          phase: "base_case",
          comparisonsCount,
          swapsCount,
          activeIndices: [left],
          pivotIndex: left,
          scanIndex: null,
          boundaryIndex: left,
          left,
          right,
          depth,
          message: `Base case reached: Subarray [${left}..${right}] has 1 element (${currentArray[left]}), which is trivially sorted.`,
          finished: false
        });
      }
      return;
    }

    // Lomuto Partition: Last element is chosen as pivot
    const pivotIndex = right;
    const pivotValue = currentArray[pivotIndex];

    // Phase: pivot_selected
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "pivot_selected",
      comparisonsCount,
      swapsCount,
      activeIndices: makeRange(left, right),
      pivotIndex,
      scanIndex: null,
      boundaryIndex: left - 1,
      left,
      right,
      depth,
      message: `Pivot selected: numbers[${pivotIndex}] = ${pivotValue}. Partitioning subarray [${left}..${right}].`,
      finished: false
    });

    let i = left - 1;

    for (let j = left; j < right; j++) {
      comparisonsCount++;
      const isSmallerOrEqual = currentArray[j] <= pivotValue;

      // Phase: compare
      steps.push({
        stepIndex: stepIndex++,
        array: [...currentArray],
        phase: "compare",
        comparisonsCount,
        swapsCount,
        activeIndices: makeRange(left, right),
        pivotIndex,
        scanIndex: j,
        boundaryIndex: i,
        left,
        right,
        depth,
        message: `Compare: numbers[${j}] (${currentArray[j]}) <= pivot (${pivotValue})? ${
          isSmallerOrEqual
            ? `Yes (${currentArray[j]} <= ${pivotValue})`
            : `No (${currentArray[j]} > ${pivotValue})`
        }.`,
        finished: false
      });

      if (isSmallerOrEqual) {
        i++;
        if (i !== j) {
          const temp = currentArray[i];
          currentArray[i] = currentArray[j];
          currentArray[j] = temp;
          swapsCount++;

          // Phase: swap
          steps.push({
            stepIndex: stepIndex++,
            array: [...currentArray],
            phase: "swap",
            comparisonsCount,
            swapsCount,
            activeIndices: makeRange(left, right),
            pivotIndex,
            scanIndex: j,
            boundaryIndex: i,
            left,
            right,
            depth,
            message: `Swap: numbers[${j}] (${currentArray[i]}) <= pivot (${pivotValue}). Incremented boundary i to ${i} and swapped numbers[${i}] with numbers[${j}].`,
            finished: false
          });
        }
      }
    }

    // Place pivot into its correct partition slot: i + 1
    const pivotDest = i + 1;
    const pivotSwapped = pivotDest !== right;

    if (pivotSwapped) {
      const temp = currentArray[pivotDest];
      currentArray[pivotDest] = currentArray[right];
      currentArray[right] = temp;
      swapsCount++;
    }

    // Phase: pivot_placed
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "pivot_placed",
      comparisonsCount,
      swapsCount,
      activeIndices: makeRange(left, right),
      pivotIndex: pivotDest,
      scanIndex: null,
      boundaryIndex: pivotDest,
      left,
      right,
      depth,
      message: pivotSwapped
        ? `Place pivot: Swapped pivot ${pivotValue} at [${right}] with numbers[${pivotDest}] (${currentArray[right]}). Pivot is now in its finalized position [${pivotDest}].`
        : `Place pivot: Pivot ${pivotValue} is already in its finalized position [${pivotDest}].`,
      finished: false
    });

    // Phase: partition_complete
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "partition_complete",
      comparisonsCount,
      swapsCount,
      activeIndices: makeRange(left, right),
      pivotIndex: pivotDest,
      scanIndex: null,
      boundaryIndex: pivotDest,
      left,
      right,
      depth,
      message: `Partition complete for range [${left}..${right}]. Pivot ${pivotValue} is fixed at [${pivotDest}]. Left partition: [${left}..${pivotDest - 1}], Right partition: [${pivotDest + 1}..${right}].`,
      finished: false
    });

    // Phase: recursion
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "recursion",
      comparisonsCount,
      swapsCount,
      activeIndices: makeRange(left, right),
      pivotIndex: pivotDest,
      scanIndex: null,
      boundaryIndex: pivotDest,
      left,
      right,
      depth,
      message: `Recursive divide: Splitting at pivot index ${pivotDest}. Recursively sorting left partition [${left}..${pivotDest - 1}] and right partition [${pivotDest + 1}..${right}].`,
      finished: false
    });

    // Recurse left
    quickSortRec(left, pivotDest - 1, depth + 1);
    // Recurse right
    quickSortRec(pivotDest + 1, right, depth + 1);
  }

  quickSortRec(0, n - 1, 0);

  // Final Complete Step
  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    phase: "complete",
    comparisonsCount,
    swapsCount,
    activeIndices: makeRange(0, n - 1),
    pivotIndex: null,
    scanIndex: null,
    boundaryIndex: null,
    left: 0,
    right: n - 1,
    depth: 0,
    message: `🎉 Quick Sort complete! Array fully sorted in ${comparisonsCount} comparisons and ${swapsCount} swaps.`,
    finished: true
  });

  return steps;
}
