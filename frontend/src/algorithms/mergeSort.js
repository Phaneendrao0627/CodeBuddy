/**
 * Deterministic, language-independent trace engine and input validator for Merge Sort.
 * Follows authentic recursive divide-and-conquer execution with accurate two-pointer merge tracking.
 */

/**
 * Validates user-provided array input for Merge Sort.
 * Supports comma-separated strings or arrays of numbers.
 */
export function validateMergeSortInput(rawArray) {
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
 * Generates an immutable, step-by-step trace of Merge Sort.
 * Trace events:
 * - "initial": starting array
 * - "split": dividing range [left..right] at mid
 * - "base_case": single-element subarray trivially sorted
 * - "merge_start": initializing merge of [left..mid] and [mid+1..right]
 * - "compare": comparing leftArr[i] vs rightArr[j]
 * - "copy_left": writing leftArr[i] to slot numbers[k]
 * - "copy_right": writing rightArr[j] to slot numbers[k]
 * - "copy_remaining": writing leftover elements from leftArr or rightArr
 * - "merge_complete": subarray [left..right] merged and sorted
 * - "complete": entire array fully sorted
 */
export function generateMergeSortTrace(initialNumbers) {
  if (!Array.isArray(initialNumbers) || initialNumbers.length === 0) {
    return [
      {
        stepIndex: 0,
        array: [],
        phase: "empty",
        depth: 0,
        left: 0,
        mid: null,
        right: 0,
        leftSubarray: [],
        rightSubarray: [],
        leftPointer: null,
        rightPointer: null,
        targetIndex: null,
        activeIndices: [],
        comparisonsCount: 0,
        writesCount: 0,
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
        depth: 0,
        left: 0,
        mid: 0,
        right: 0,
        leftSubarray: [],
        rightSubarray: [],
        leftPointer: null,
        rightPointer: null,
        targetIndex: 0,
        activeIndices: [0],
        comparisonsCount: 0,
        writesCount: 0,
        message: `Single element [${initialNumbers[0]}] is trivially sorted.`,
        finished: true
      }
    ];
  }

  const steps = [];
  let stepIndex = 0;
  let comparisonsCount = 0;
  let writesCount = 0;

  const currentArray = [...initialNumbers];

  // Initial Step
  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    phase: "initial",
    depth: 0,
    left: 0,
    mid: null,
    right: n - 1,
    leftSubarray: [],
    rightSubarray: [],
    leftPointer: null,
    rightPointer: null,
    targetIndex: null,
    activeIndices: makeRange(0, n - 1),
    comparisonsCount: 0,
    writesCount: 0,
    message: `Initial state: Starting Merge Sort on [${currentArray.join(", ")}]. Range [0..${n - 1}].`,
    finished: false
  });

  function merge(left, mid, right, depth) {
    const leftArr = currentArray.slice(left, mid + 1);
    const rightArr = currentArray.slice(mid + 1, right + 1);

    // Merge Start Step
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "merge_start",
      depth,
      left,
      mid,
      right,
      leftSubarray: [...leftArr],
      rightSubarray: [...rightArr],
      leftPointer: 0,
      rightPointer: 0,
      targetIndex: left,
      activeIndices: makeRange(left, right),
      comparisonsCount,
      writesCount,
      message: `Combine: Merging sorted left [${leftArr.join(", ")}] and sorted right [${rightArr.join(", ")}] into range [${left}..${right}].`,
      finished: false
    });

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      comparisonsCount++;
      const valL = leftArr[i];
      const valR = rightArr[j];
      const pickLeft = valL <= valR; // <= maintains stability

      // Compare Step
      steps.push({
        stepIndex: stepIndex++,
        array: [...currentArray],
        phase: "compare",
        depth,
        left,
        mid,
        right,
        leftSubarray: [...leftArr],
        rightSubarray: [...rightArr],
        leftPointer: i,
        rightPointer: j,
        targetIndex: k,
        activeIndices: makeRange(left, right),
        comparisonsCount,
        writesCount,
        message: `Compare: left[${i}] (${valL}) vs right[${j}] (${valR}). ${valL} ${pickLeft ? "<=" : ">"} ${valR} -> Choose ${pickLeft ? `left (${valL})` : `right (${valR})`}.`,
        finished: false
      });

      if (pickLeft) {
        currentArray[k] = valL;
        writesCount++;

        steps.push({
          stepIndex: stepIndex++,
          array: [...currentArray],
          phase: "copy_left",
          depth,
          left,
          mid,
          right,
          leftSubarray: [...leftArr],
          rightSubarray: [...rightArr],
          leftPointer: i,
          rightPointer: j,
          targetIndex: k,
          activeIndices: makeRange(left, right),
          comparisonsCount,
          writesCount,
          message: `Placed ${valL} from left subarray into numbers[${k}].`,
          finished: false
        });
        i++;
      } else {
        currentArray[k] = valR;
        writesCount++;

        steps.push({
          stepIndex: stepIndex++,
          array: [...currentArray],
          phase: "copy_right",
          depth,
          left,
          mid,
          right,
          leftSubarray: [...leftArr],
          rightSubarray: [...rightArr],
          leftPointer: i,
          rightPointer: j,
          targetIndex: k,
          activeIndices: makeRange(left, right),
          comparisonsCount,
          writesCount,
          message: `Placed ${valR} from right subarray into numbers[${k}].`,
          finished: false
        });
        j++;
      }
      k++;
    }

    // Residual elements from leftArr
    while (i < leftArr.length) {
      const valL = leftArr[i];
      currentArray[k] = valL;
      writesCount++;

      steps.push({
        stepIndex: stepIndex++,
        array: [...currentArray],
        phase: "copy_remaining",
        depth,
        left,
        mid,
        right,
        leftSubarray: [...leftArr],
        rightSubarray: [...rightArr],
        leftPointer: i,
        rightPointer: j,
        targetIndex: k,
        activeIndices: makeRange(left, right),
        comparisonsCount,
        writesCount,
        message: `Copying remaining left element ${valL} into numbers[${k}].`,
        finished: false
      });
      i++;
      k++;
    }

    // Residual elements from rightArr
    while (j < rightArr.length) {
      const valR = rightArr[j];
      currentArray[k] = valR;
      writesCount++;

      steps.push({
        stepIndex: stepIndex++,
        array: [...currentArray],
        phase: "copy_remaining",
        depth,
        left,
        mid,
        right,
        leftSubarray: [...leftArr],
        rightSubarray: [...rightArr],
        leftPointer: i,
        rightPointer: j,
        targetIndex: k,
        activeIndices: makeRange(left, right),
        comparisonsCount,
        writesCount,
        message: `Copying remaining right element ${valR} into numbers[${k}].`,
        finished: false
      });
      j++;
      k++;
    }

    // Merge Complete Step for this range
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "merge_complete",
      depth,
      left,
      mid,
      right,
      leftSubarray: [...leftArr],
      rightSubarray: [...rightArr],
      leftPointer: null,
      rightPointer: null,
      targetIndex: null,
      activeIndices: makeRange(left, right),
      comparisonsCount,
      writesCount,
      message: `Merged range [${left}..${right}]: [${currentArray.slice(left, right + 1).join(", ")}] is now sorted.`,
      finished: false
    });
  }

  function mergeSortRec(left, right, depth) {
    if (left >= right) {
      if (left === right) {
        steps.push({
          stepIndex: stepIndex++,
          array: [...currentArray],
          phase: "base_case",
          depth,
          left,
          mid: left,
          right,
          leftSubarray: [currentArray[left]],
          rightSubarray: [],
          leftPointer: null,
          rightPointer: null,
          targetIndex: left,
          activeIndices: [left],
          comparisonsCount,
          writesCount,
          message: `Base case reached: Subarray [${left}..${right}] has 1 element (${currentArray[left]}), which is trivially sorted.`,
          finished: false
        });
      }
      return;
    }

    const mid = left + Math.floor((right - left) / 2);

    // Split Step
    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      phase: "split",
      depth,
      left,
      mid,
      right,
      leftSubarray: currentArray.slice(left, mid + 1),
      rightSubarray: currentArray.slice(mid + 1, right + 1),
      leftPointer: null,
      rightPointer: null,
      targetIndex: null,
      activeIndices: makeRange(left, right),
      comparisonsCount,
      writesCount,
      message: `Divide: Splitting [${left}..${right}] at mid = ${mid} into left [${left}..${mid}] and right [${mid + 1}..${right}].`,
      finished: false
    });

    mergeSortRec(left, mid, depth + 1);
    mergeSortRec(mid + 1, right, depth + 1);
    merge(left, mid, right, depth);
  }

  mergeSortRec(0, n - 1, 0);

  // Final Complete Step
  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    phase: "complete",
    depth: 0,
    left: 0,
    mid: null,
    right: n - 1,
    leftSubarray: [],
    rightSubarray: [],
    leftPointer: null,
    rightPointer: null,
    targetIndex: null,
    activeIndices: makeRange(0, n - 1),
    comparisonsCount,
    writesCount,
    message: `🎉 Merge Sort complete! Array fully sorted in ${comparisonsCount} comparisons and ${writesCount} element writes.`,
    finished: true
  });

  return steps;
}
