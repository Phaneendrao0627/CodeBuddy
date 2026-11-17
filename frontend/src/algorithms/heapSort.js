/**
 * Deterministic, language-independent trace engine and input validator for Heap Sort.
 * Follows authentic Max-Heap construction and iterative extraction with accurate sift-down tracking.
 */

/**
 * Validates user-provided array input for Heap Sort.
 * Supports comma-separated strings (e.g. "38, 27, 43, 3, 9, 82, 10") or numeric arrays.
 */
export function validateHeapSortInput(rawArray) {
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
 * Helper generating an array of inclusive numbers [0..k-1].
 */
function makeRange(start, end) {
  if (start > end) return [];
  const res = [];
  for (let i = start; i <= end; i++) res.push(i);
  return res;
}

/**
 * Generates an immutable, step-by-step trace of Heap Sort using a standard Max-Heap.
 *
 * Trace phases:
 * - "empty": input array is empty
 * - "initial": starting array before sorting
 * - "build_heap_start": beginning bottom-up max heap construction
 * - "heapify_compare": comparing parent node with left and right children
 * - "heapify_swap": swapping parent node with the larger child during build-heap
 * - "build_heap_complete": max heap successfully constructed
 * - "extract_max": swapping the root (current maximum) to the end of the active heap
 * - "element_sorted": element placed at the end is finalized in sorted order
 * - "heapify_down_compare": comparing root with children during reduced-heap sift down
 * - "heapify_down_swap": swapping parent with larger child during sift down
 * - "complete": entire array fully sorted
 *
 * Each step contains:
 * - stepIndex (number)
 * - array (number[])
 * - heapSize (number) - elements [0..heapSize-1] belong to the active heap
 * - phase (string)
 * - parentIndex (number | null)
 * - leftChildIndex (number | null)
 * - rightChildIndex (number | null)
 * - largestIndex (number | null)
 * - swapIndices ([number, number] | null)
 * - sortedIndices (number[])
 * - activeIndices (number[])
 * - comparisonsCount (number)
 * - swapsCount (number)
 * - message (string)
 * - finished (boolean)
 */
export function generateHeapSortTrace(initialNumbers) {
  if (!Array.isArray(initialNumbers) || initialNumbers.length === 0) {
    return [
      {
        stepIndex: 0,
        array: [],
        heapSize: 0,
        phase: "empty",
        parentIndex: null,
        leftChildIndex: null,
        rightChildIndex: null,
        largestIndex: null,
        swapIndices: null,
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

  if (n === 1) {
    return [
      {
        stepIndex: 0,
        array: [...initialNumbers],
        heapSize: 1,
        phase: "complete",
        parentIndex: 0,
        leftChildIndex: null,
        rightChildIndex: null,
        largestIndex: 0,
        swapIndices: null,
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
  const currentArray = [...initialNumbers];
  let stepIndex = 0;
  let comparisonsCount = 0;
  let swapsCount = 0;
  const sortedIndices = [];

  // Step 0: Initial state
  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    heapSize: n,
    phase: "initial",
    parentIndex: null,
    leftChildIndex: null,
    rightChildIndex: null,
    largestIndex: null,
    swapIndices: null,
    sortedIndices: [],
    activeIndices: makeRange(0, n - 1),
    comparisonsCount,
    swapsCount,
    message: `Initial array with ${n} elements. Preparing to build Max Heap.`,
    finished: false
  });

  // Helper for sift-down / heapify operation
  function siftDown(heapSize, rootIdx, isBuildPhase) {
    let currRoot = rootIdx;

    while (currRoot < heapSize) {
      let largest = currRoot;
      const left = 2 * currRoot + 1;
      const right = 2 * currRoot + 2;

      const activeNodes = [currRoot];
      if (left < heapSize) activeNodes.push(left);
      if (right < heapSize) activeNodes.push(right);

      // Comparison for left child
      if (left < heapSize) {
        comparisonsCount++;
        if (currentArray[left] > currentArray[largest]) {
          largest = left;
        }
      }

      // Comparison for right child
      if (right < heapSize) {
        comparisonsCount++;
        if (currentArray[right] > currentArray[largest]) {
          largest = right;
        }
      }

      const comparePhase = isBuildPhase ? "heapify_compare" : "heapify_down_compare";

      let compareMsg = `Inspect node [${currRoot}] = ${currentArray[currRoot]}`;
      if (left < heapSize && right < heapSize) {
        compareMsg += ` with left child [${left}] = ${currentArray[left]} and right child [${right}] = ${currentArray[right]}.`;
      } else if (left < heapSize) {
        compareMsg += ` with left child [${left}] = ${currentArray[left]} (no right child).`;
      } else {
        compareMsg += ` (leaf node with no children).`;
      }

      if (largest !== currRoot) {
        compareMsg += ` Larger child is [${largest}] = ${currentArray[largest]} > [${currRoot}] = ${currentArray[currRoot]}.`;
      } else {
        compareMsg += ` Node [${currRoot}] satisfies the max heap property.`;
      }

      steps.push({
        stepIndex: stepIndex++,
        array: [...currentArray],
        heapSize,
        phase: comparePhase,
        parentIndex: currRoot,
        leftChildIndex: left < heapSize ? left : null,
        rightChildIndex: right < heapSize ? right : null,
        largestIndex: largest,
        swapIndices: null,
        sortedIndices: [...sortedIndices],
        activeIndices: activeNodes,
        comparisonsCount,
        swapsCount,
        message: compareMsg,
        finished: false
      });

      if (largest !== currRoot) {
        swapsCount++;
        const swapPhase = isBuildPhase ? "heapify_swap" : "heapify_down_swap";
        const valParent = currentArray[currRoot];
        const valChild = currentArray[largest];

        // Swap in array
        currentArray[currRoot] = valChild;
        currentArray[largest] = valParent;

        steps.push({
          stepIndex: stepIndex++,
          array: [...currentArray],
          heapSize,
          phase: swapPhase,
          parentIndex: currRoot,
          leftChildIndex: left < heapSize ? left : null,
          rightChildIndex: right < heapSize ? right : null,
          largestIndex: largest,
          swapIndices: [currRoot, largest],
          sortedIndices: [...sortedIndices],
          activeIndices: [currRoot, largest],
          comparisonsCount,
          swapsCount,
          message: `Swap: Moving larger child ${valChild} up to index ${currRoot} and ${valParent} down to index ${largest}.`,
          finished: false
        });

        // Continue fixing heap downwards
        currRoot = largest;
      } else {
        break;
      }
    }
  }

  // Phase 1: Build Max Heap
  const firstNonLeaf = Math.floor(n / 2) - 1;
  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    heapSize: n,
    phase: "build_heap_start",
    parentIndex: firstNonLeaf,
    leftChildIndex: null,
    rightChildIndex: null,
    largestIndex: null,
    swapIndices: null,
    sortedIndices: [],
    activeIndices: makeRange(0, n - 1),
    comparisonsCount,
    swapsCount,
    message: `Phase 1: Build Max Heap. Bottom-up heapify begins at last non-leaf node [${firstNonLeaf}] down to root [0].`,
    finished: false
  });

  for (let i = firstNonLeaf; i >= 0; i--) {
    siftDown(n, i, true);
  }

  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    heapSize: n,
    phase: "build_heap_complete",
    parentIndex: 0,
    leftChildIndex: 1 < n ? 1 : null,
    rightChildIndex: 2 < n ? 2 : null,
    largestIndex: 0,
    swapIndices: null,
    sortedIndices: [],
    activeIndices: [0],
    comparisonsCount,
    swapsCount,
    message: `Max Heap built! The root at index [0] holds the maximum value: ${currentArray[0]}.`,
    finished: false
  });

  // Phase 2: Extract Maximum & Sort
  for (let i = n - 1; i > 0; i--) {
    const maxVal = currentArray[0];
    const endVal = currentArray[i];

    swapsCount++;
    // Swap root with last element of active heap
    currentArray[0] = endVal;
    currentArray[i] = maxVal;

    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      heapSize: i + 1,
      phase: "extract_max",
      parentIndex: 0,
      leftChildIndex: null,
      rightChildIndex: null,
      largestIndex: i,
      swapIndices: [0, i],
      sortedIndices: [...sortedIndices],
      activeIndices: [0, i],
      comparisonsCount,
      swapsCount,
      message: `Extract Max: Swap root (max value ${maxVal}) with element ${endVal} at index [${i}].`,
      finished: false
    });

    sortedIndices.unshift(i);

    steps.push({
      stepIndex: stepIndex++,
      array: [...currentArray],
      heapSize: i,
      phase: "element_sorted",
      parentIndex: null,
      leftChildIndex: null,
      rightChildIndex: null,
      largestIndex: null,
      swapIndices: null,
      sortedIndices: [...sortedIndices],
      activeIndices: [i],
      comparisonsCount,
      swapsCount,
      message: `Element ${maxVal} at index [${i}] is now locked into its final sorted position. Active heap size is now ${i}.`,
      finished: false
    });

    // Re-heapify root down through reduced heap of size i
    siftDown(i, 0, false);
  }

  // Index 0 is the last remaining element and is automatically sorted
  sortedIndices.unshift(0);

  // Phase 3: Complete
  steps.push({
    stepIndex: stepIndex++,
    array: [...currentArray],
    heapSize: 0,
    phase: "complete",
    parentIndex: null,
    leftChildIndex: null,
    rightChildIndex: null,
    largestIndex: null,
    swapIndices: null,
    sortedIndices: makeRange(0, n - 1),
    activeIndices: makeRange(0, n - 1),
    comparisonsCount,
    swapsCount,
    message: `🎉 Heap Sort complete! Array fully sorted in ${comparisonsCount} comparisons and ${swapsCount} element swaps.`,
    finished: true
  });

  return steps;
}
