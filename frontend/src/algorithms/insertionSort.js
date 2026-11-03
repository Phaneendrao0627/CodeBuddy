/**
 * Deterministic, language-independent trace engine and input validator for Insertion Sort.
 * Ascending sort supporting custom arrays, duplicates, negative numbers, and edge cases.
 */

/**
 * Validates user-provided array input for Insertion Sort.
 * Supports comma-separated strings (e.g. "8, 4, 1, 5, 9, 2" or "5, -2, 3, -2") or existing number arrays.
 */
export function validateInsertionSortInput(rawArray) {
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
        error: "Array elements must be valid numbers (e.g. 8, -4, 2)."
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
 * Generates an immutable, step-by-step trace of Insertion Sort.
 * Differentiates clearly between:
 * - Sorted portion of the array
 * - Current key selection
 * - Comparison with previous elements
 * - Shifting elements one position to the right
 * - Key insertion into its correct position
 * - Sorted prefix expansion
 */
export function generateInsertionSortTrace(initialNumbers) {
  if (!Array.isArray(initialNumbers) || initialNumbers.length === 0) {
    return [
      {
        stepIndex: 0,
        array: [],
        phase: "empty",
        pass: 0,
        key: null,
        keySourceIndex: null,
        compareIndex: null,
        shiftFrom: null,
        shiftTo: null,
        insertIndex: null,
        sortedIndices: [],
        comparisonsCount: 0,
        shiftsCount: 0,
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
        key: null,
        keySourceIndex: null,
        compareIndex: null,
        shiftFrom: null,
        shiftTo: null,
        insertIndex: null,
        sortedIndices: [0],
        comparisonsCount: 0,
        shiftsCount: 0,
        message: `Single element [${initialNumbers[0]}] is trivially sorted.`,
        finished: true
      }
    ];
  }

  const steps = [];
  let stepIndex = 0;
  let comparisonsCount = 0;
  let shiftsCount = 0;

  // Working copy of array
  const currentArray = [...initialNumbers];

  // Initial Step: Index 0 is trivially sorted
  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    phase: "initial",
    pass: 0,
    key: null,
    keySourceIndex: null,
    compareIndex: null,
    shiftFrom: null,
    shiftTo: null,
    insertIndex: null,
    sortedIndices: [0],
    comparisonsCount: 0,
    shiftsCount: 0,
    message: `Initial state: Index 0 (value ${currentArray[0]}) forms the initial sorted prefix. Starting Insertion Sort from index 1.`,
    finished: false
  });

  // Outer loop: iterate from 1 to n - 1
  for (let i = 1; i < n; i++) {
    const key = currentArray[i];
    const sortedIndicesBeforePass = Array.from({ length: i }, (_, k) => k);

    // Step: Select Key
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "select_key",
      pass: i,
      key,
      keySourceIndex: i,
      compareIndex: null,
      shiftFrom: null,
      shiftTo: null,
      insertIndex: null,
      sortedIndices: sortedIndicesBeforePass,
      comparisonsCount,
      shiftsCount,
      message: `Pass ${i}: Pick key = ${key} at index ${i} to insert into sorted prefix [0..${i - 1}].`,
      finished: false
    });

    let j = i - 1;

    // Inner loop: compare backward through sorted prefix
    while (j >= 0) {
      comparisonsCount++;
      const comparedVal = currentArray[j];
      const isGreater = comparedVal > key;

      if (isGreater) {
        // Comparison Step (TRUE: item greater than key)
        steps.push({
          stepIndex: stepIndex++,
          array: [...currentArray],
          phase: "compare",
          pass: i,
          key,
          keySourceIndex: i,
          compareIndex: j,
          shiftFrom: null,
          shiftTo: null,
          insertIndex: null,
          sortedIndices: sortedIndicesBeforePass,
          comparisonsCount,
          shiftsCount,
          message: `Compare: numbers[${j}] (${comparedVal}) > key (${key}) is TRUE. Must shift ${comparedVal} right to index ${j + 1}.`,
          finished: false
        });

        // Perform shift
        currentArray[j + 1] = currentArray[j];
        shiftsCount++;

        // Shift Step
        steps.push({
          stepIndex: stepIndex++,
          array: [...currentArray],
          phase: "shift",
          pass: i,
          key,
          keySourceIndex: i,
          compareIndex: j,
          shiftFrom: j,
          shiftTo: j + 1,
          insertIndex: null,
          sortedIndices: sortedIndicesBeforePass,
          comparisonsCount,
          shiftsCount,
          message: `Shift: Moved ${comparedVal} from index ${j} to index ${j + 1}.`,
          finished: false
        });

        j--;
      } else {
        // Comparison Step (FALSE: item <= key, correct insertion spot found)
        steps.push({
          stepIndex: stepIndex++,
          array: [...currentArray],
          phase: "compare",
          pass: i,
          key,
          keySourceIndex: i,
          compareIndex: j,
          shiftFrom: null,
          shiftTo: null,
          insertIndex: null,
          sortedIndices: sortedIndicesBeforePass,
          comparisonsCount,
          shiftsCount,
          message: `Compare: numbers[${j}] (${comparedVal}) > key (${key}) is FALSE. Found insertion slot at index ${j + 1}.`,
          finished: false
        });
        break;
      }
    }

    // Insert key into slot j + 1
    currentArray[j + 1] = key;
    const insertSlot = j + 1;

    // Step: Insert Key
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "insert",
      pass: i,
      key,
      keySourceIndex: i,
      compareIndex: null,
      shiftFrom: null,
      shiftTo: null,
      insertIndex: insertSlot,
      sortedIndices: sortedIndicesBeforePass,
      comparisonsCount,
      shiftsCount,
      message: `Insert: Placed key (${key}) into slot [${insertSlot}].`,
      finished: false
    });

    // Step: Pass Complete (Sorted prefix now extends to index i)
    const sortedIndicesAfterPass = Array.from({ length: i + 1 }, (_, k) => k);
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "pass_complete",
      pass: i,
      key,
      keySourceIndex: i,
      compareIndex: null,
      shiftFrom: null,
      shiftTo: null,
      insertIndex: insertSlot,
      sortedIndices: sortedIndicesAfterPass,
      comparisonsCount,
      shiftsCount,
      message: `Pass ${i} complete. Sorted prefix expanded to [0..${i}]: [${currentArray.slice(0, i + 1).join(", ")}].`,
      finished: false
    });
  }

  // Final Step: Complete
  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    phase: "complete",
    pass: n - 1,
    key: null,
    keySourceIndex: null,
    compareIndex: null,
    shiftFrom: null,
    shiftTo: null,
    insertIndex: null,
    sortedIndices: Array.from({ length: n }, (_, k) => k),
    comparisonsCount,
    shiftsCount,
    message: `🎉 Insertion Sort complete! Array fully sorted in ${comparisonsCount} comparisons and ${shiftsCount} shifts.`,
    finished: true
  });

  return steps;
}
