/**
 * Deterministic, language-independent trace engine and input validator for Radix Sort.
 * Implements LSD (Least Significant Digit first) Radix Sort with a stable counting-sort digit pass.
 * Supports non-negative integers (0, positive integers, varying digit lengths, duplicates).
 */

/**
 * Validates user-provided array input for Radix Sort.
 * Rejects negative numbers and non-integers with beginner-friendly explanations.
 */
export function validateRadixSortInput(rawArray) {
  if (rawArray === null || rawArray === undefined) {
    return {
      valid: false,
      error: "Please enter a comma-separated list of non-negative integers."
    };
  }

  let numbers = [];

  if (Array.isArray(rawArray)) {
    if (rawArray.length === 0) {
      return { valid: true, numbers: [] };
    }
    for (let i = 0; i < rawArray.length; i++) {
      const x = rawArray[i];
      if (typeof x !== "number" || Number.isNaN(x)) {
        return {
          valid: false,
          error: "Array elements must be valid numbers (e.g. 170, 45, 75)."
        };
      }
      if (!Number.isInteger(x)) {
        return {
          valid: false,
          error: `Element "${x}" at position ${i + 1} is a decimal. Radix Sort requires whole integers.`
        };
      }
      if (x < 0) {
        return {
          valid: false,
          error: `Negative number "${x}" found at position ${i + 1}. Standard Radix Sort requires non-negative integers (≥ 0).`
        };
      }
      numbers.push(x);
    }
    return { valid: true, numbers };
  }

  const trimmed = String(rawArray).trim();
  if (!trimmed) {
    return {
      valid: false,
      error: "Please enter a comma-separated list of non-negative integers."
    };
  }

  const tokens = trimmed
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  if (tokens.length === 0) {
    return {
      valid: false,
      error: "Please enter at least one non-negative integer."
    };
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const num = Number(token);

    if (Number.isNaN(num)) {
      return {
        valid: false,
        error: `Token "${token}" at position ${i + 1} is not a valid number.`
      };
    }
    if (!Number.isInteger(num)) {
      return {
        valid: false,
        error: `Token "${token}" at position ${i + 1} is a decimal. Radix Sort requires whole integers.`
      };
    }
    if (num < 0) {
      return {
        valid: false,
        error: `Negative number "${token}" at position ${i + 1} is not allowed. Standard Radix Sort requires non-negative integers (≥ 0).`
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
 * Helper to describe the digit place in human terms.
 */
function getDigitPlaceName(exp) {
  if (exp === 1) return "Ones (1s)";
  if (exp === 10) return "Tens (10s)";
  if (exp === 100) return "Hundreds (100s)";
  if (exp === 1000) return "Thousands (1,000s)";
  if (exp === 10000) return "Ten-Thousands (10,000s)";
  return `10^${Math.round(Math.log10(exp))} Place`;
}

/**
 * Extracts the digit at position `exp` (1, 10, 100, etc.) for a non-negative integer.
 */
function getDigit(num, exp) {
  return Math.floor(num / exp) % 10;
}

/**
 * Generates an immutable, step-by-step trace of LSD Radix Sort.
 *
 * Trace phases:
 * - "empty": empty array input
 * - "initial": starting array before sorting
 * - "find_max": maximum number identified, determining total digit passes
 * - "pass_start": beginning a new digit pass for place `exp`
 * - "counting": tallying the digit of an element into countArray[digit]
 * - "counting_complete": raw digit frequencies ready for prefix sum
 * - "cumulative": computing cumulative prefix counts for digits 0..9
 * - "placing": placing an element into outputArray right-to-left
 * - "copyback": copying outputArray back to the main array
 * - "pass_complete": array now sorted according to significant digits up to exp
 * - "complete": all digit passes complete, array fully sorted
 */
export function generateRadixSortTrace(initialNumbers) {
  if (!Array.isArray(initialNumbers) || initialNumbers.length === 0) {
    return [
      {
        stepIndex: 0,
        array: [],
        phase: "empty",
        exp: null,
        digitPlace: null,
        maxVal: null,
        countArray: null,
        outputArray: null,
        activeElementIndex: null,
        activeDigit: null,
        placingIndex: null,
        outputIndex: null,
        sortedIndices: [],
        activeIndices: [],
        passNumber: 0,
        totalPasses: 0,
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
        exp: 1,
        digitPlace: "Ones (1s)",
        maxVal: initialNumbers[0],
        countArray: null,
        outputArray: [...initialNumbers],
        activeElementIndex: 0,
        activeDigit: initialNumbers[0] % 10,
        placingIndex: null,
        outputIndex: 0,
        sortedIndices: [0],
        activeIndices: [0],
        passNumber: 1,
        totalPasses: 1,
        comparisonsCount: 0,
        swapsCount: 0,
        message: `Single element [${initialNumbers[0]}] is trivially sorted.`,
        finished: true
      }
    ];
  }

  const steps = [];
  let stepIndex = 0;
  const currentArray = [...initialNumbers];

  // Step 0: Initial state
  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    phase: "initial",
    exp: null,
    digitPlace: null,
    maxVal: null,
    countArray: null,
    outputArray: null,
    activeElementIndex: null,
    activeDigit: null,
    placingIndex: null,
    outputIndex: null,
    sortedIndices: [],
    activeIndices: [],
    passNumber: 0,
    totalPasses: 0,
    comparisonsCount: 0,
    swapsCount: 0,
    message: `Initial state: Starting LSD Radix Sort on [${currentArray.join(", ")}].`,
    finished: false
  });

  // Find max value to determine digit passes
  let maxVal = currentArray[0];
  for (let i = 1; i < n; i++) {
    if (currentArray[i] > maxVal) {
      maxVal = currentArray[i];
    }
  }

  // Calculate total passes needed
  let totalPasses = 1;
  let tempMax = maxVal;
  while (Math.floor(tempMax / 10) > 0) {
    totalPasses++;
    tempMax = Math.floor(tempMax / 10);
  }

  // Step 1: Max value found
  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    phase: "find_max",
    exp: null,
    digitPlace: null,
    maxVal,
    countArray: null,
    outputArray: null,
    activeElementIndex: null,
    activeDigit: null,
    placingIndex: null,
    outputIndex: null,
    sortedIndices: [],
    activeIndices: [],
    passNumber: 0,
    totalPasses,
    comparisonsCount: 0,
    swapsCount: 0,
    message: `Found maximum value ${maxVal}. It has ${totalPasses} digit(s), so Radix Sort will perform ${totalPasses} digit pass(es).`,
    finished: false
  });

  let passNumber = 1;

  // Run counting sort for each digit place exp: 1, 10, 100, ...
  for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10, passNumber++) {
    const digitPlaceName = getDigitPlaceName(exp);

    // Pass start step
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "pass_start",
      exp,
      digitPlace: digitPlaceName,
      maxVal,
      countArray: new Array(10).fill(0),
      outputArray: new Array(n).fill(null),
      activeElementIndex: null,
      activeDigit: null,
      placingIndex: null,
      outputIndex: null,
      sortedIndices: [],
      activeIndices: [],
      passNumber,
      totalPasses,
      comparisonsCount: 0,
      swapsCount: 0,
      message: `Pass ${passNumber} of ${totalPasses}: Sorting by the ${digitPlaceName} (exp = ${exp}). Initializing digit count array for base 10 (digits 0..9).`,
      finished: false
    });

    // 1. Count occurrences of each digit
    const count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) {
      const val = currentArray[i];
      const digit = getDigit(val, exp);
      count[digit]++;

      steps.push({
        stepIndex: stepIndex++,
        array: [...currentArray],
        phase: "counting",
        exp,
        digitPlace: digitPlaceName,
        maxVal,
        countArray: [...count],
        outputArray: new Array(n).fill(null),
        activeElementIndex: i,
        activeDigit: digit,
        placingIndex: null,
        outputIndex: null,
        sortedIndices: [],
        activeIndices: [i],
        passNumber,
        totalPasses,
        comparisonsCount: 0,
        swapsCount: 0,
        message: `Inspecting array[${i}] = ${val}. The ${digitPlaceName} digit is ${digit}. Incrementing count[${digit}] to ${count[digit]}.`,
        finished: false
      });
    }

    // Counting complete step
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "counting_complete",
      exp,
      digitPlace: digitPlaceName,
      maxVal,
      countArray: [...count],
      outputArray: new Array(n).fill(null),
      activeElementIndex: null,
      activeDigit: null,
      placingIndex: null,
      outputIndex: null,
      sortedIndices: [],
      activeIndices: [],
      passNumber,
      totalPasses,
      comparisonsCount: 0,
      swapsCount: 0,
      message: `Frequency counting complete for ${digitPlaceName}. Raw digit counts: [${count.join(", ")}].`,
      finished: false
    });

    // 2. Build cumulative counts: count[i] += count[i - 1]
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "cumulative",
      exp,
      digitPlace: digitPlaceName,
      maxVal,
      countArray: [...count],
      outputArray: new Array(n).fill(null),
      activeElementIndex: null,
      activeDigit: null,
      placingIndex: null,
      outputIndex: null,
      sortedIndices: [],
      activeIndices: [],
      passNumber,
      totalPasses,
      comparisonsCount: 0,
      swapsCount: 0,
      message: `Cumulative counts built for ${digitPlaceName}: [${count.join(", ")}]. count[d] now indicates the last output position for digit d.`,
      finished: false
    });

    // 3. Build output array right-to-left for stability
    const output = new Array(n).fill(null);

    for (let i = n - 1; i >= 0; i--) {
      const val = currentArray[i];
      const digit = getDigit(val, exp);
      count[digit]--;
      const targetIndex = count[digit];
      output[targetIndex] = val;

      steps.push({
        stepIndex: stepIndex++,
        array: [...currentArray],
        phase: "placing",
        exp,
        digitPlace: digitPlaceName,
        maxVal,
        countArray: [...count],
        outputArray: [...output],
        activeElementIndex: i,
        activeDigit: digit,
        placingIndex: i,
        outputIndex: targetIndex,
        sortedIndices: [],
        activeIndices: [i],
        passNumber,
        totalPasses,
        comparisonsCount: 0,
        swapsCount: 0,
        message: `Placing array[${i}] = ${val} (digit ${digit}) into output[${targetIndex}]. Decremented count[${digit}] to ${count[digit]}.`,
        finished: false
      });
    }

    // 4. Copy output back to currentArray
    for (let i = 0; i < n; i++) {
      currentArray[i] = output[i];
    }

    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "copyback",
      exp,
      digitPlace: digitPlaceName,
      maxVal,
      countArray: [...count],
      outputArray: [...output],
      activeElementIndex: null,
      activeDigit: null,
      placingIndex: null,
      outputIndex: null,
      sortedIndices: [],
      activeIndices: [],
      passNumber,
      totalPasses,
      comparisonsCount: 0,
      swapsCount: 0,
      message: `Copied stable output array back to main array for ${digitPlaceName}. Current state: [${currentArray.join(", ")}].`,
      finished: false
    });

    const isFinalPass = passNumber === totalPasses;

    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: isFinalPass ? "complete" : "pass_complete",
      exp,
      digitPlace: digitPlaceName,
      maxVal,
      countArray: [...count],
      outputArray: [...output],
      activeElementIndex: null,
      activeDigit: null,
      placingIndex: null,
      outputIndex: null,
      sortedIndices: isFinalPass ? currentArray.map((_, idx) => idx) : [],
      activeIndices: [],
      passNumber,
      totalPasses,
      comparisonsCount: 0,
      swapsCount: 0,
      message: isFinalPass
        ? `🎉 Radix Sort complete! Array fully sorted in ${totalPasses} digit pass(es): [${currentArray.join(", ")}].`
        : `Completed pass ${passNumber} (${digitPlaceName}). Array is now stably sorted up to the ${digitPlaceName}.`,
      finished: isFinalPass
    });
  }

  // Ensure last step marked as finished
  if (steps.length > 0 && !steps[steps.length - 1].finished) {
    const last = steps[steps.length - 1];
    last.finished = true;
    last.phase = "complete";
    last.sortedIndices = currentArray.map((_, idx) => idx);
  }

  return steps;
}
