/**
 * Comprehensive Selection Sort practice questions.
 * Progresses from Beginner to Challenging covering:
 * 1. Selecting the first minimum
 * 2. Tracking the minimum during comparisons
 * 3. Array state after a pass
 * 4. Swap counts
 * 5. Best/average/worst complexity (O(n²))
 * 6. In-place property and O(1) space
 * 7. Stability and why ordinary Selection Sort is NOT stable
 */

export const SELECTION_SORT_QUESTIONS = [
  {
    id: 1,
    type: "first_minimum",
    difficulty: "Beginner",
    title: "1. Finding the First Minimum",
    question: "In Selection Sort, what is the value of the overall minimum element found in the first pass across array [64, 25, 12, 22, 11] to be swapped into index 0?",
    array: [64, 25, 12, 22, 11],
    target: null,
    inputType: "number",
    placeholder: "Enter minimum value",
    correctAnswer: 11,
    hint: "Scan through the entire array [64, 25, 12, 22, 11] to identify the smallest value.",
    explanation: "In Pass 1 (i = 0), Selection Sort scans the entire array starting with candidate 64. It updates min_idx to 25, then 12, and finally to 11 at index 4. The value 11 is the minimum found."
  },
  {
    id: 2,
    type: "track_minimum",
    difficulty: "Beginner",
    title: "2. Tracking Candidate Minimum Index",
    question: "In Pass 1 on the array [64, 25, 12, 22, 11], candidate min_idx starts at 0 (value 64). How many times does min_idx actually get updated (reassigned) as j scans from index 1 to 4?",
    array: [64, 25, 12, 22, 11],
    target: null,
    inputType: "number",
    placeholder: "Enter number of updates",
    correctAnswer: 2,
    hint: "Trace the comparisons starting with min_idx = 0 (value 64): 12 replaces the minimum (update 1), and 11 replaces 12 (update 2).",
    explanation: "Starting with min_idx = 0 (value 64):\n- 25 does not replace 64.\n- 12 replaces 64 — update 1.\n- 22 does not replace 12.\n- 11 replaces 12 — update 2.\nTherefore, min_idx is updated exactly 2 times during Pass 1."
  },
  {
    id: 3,
    type: "pass_state",
    difficulty: "Intermediate",
    title: "3. Array State After Pass 1",
    question: "For the array [64, 25, 12, 22, 11], what is the exact array configuration after completing Pass 1 (swapping the minimum into index 0)?",
    array: [64, 25, 12, 22, 11],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "[11, 25, 12, 22, 64]" },
      { id: "B", text: "[11, 12, 22, 25, 64]" },
      { id: "C", text: "[25, 12, 22, 11, 64]" },
      { id: "D", text: "[12, 25, 64, 22, 11]" }
    ],
    correctAnswer: "A",
    hint: "In Pass 1, the minimum element 11 at index 4 swaps directly with the element at index 0 (64). All other elements stay in their positions.",
    explanation: "The minimum element in the entire array is 11 at index 4. It swaps directly with numbers[0] (64). The array becomes [11, 25, 12, 22, 64], establishing the sorted prefix [11]."
  },
  {
    id: 4,
    type: "swap_count",
    difficulty: "Intermediate",
    title: "4. Total Number of Swaps",
    question: "How many actual swaps are executed when Selection Sort (with the optimization `if (min_idx != i)`) sorts the array [3, 1, 4, 2] in ascending order?",
    array: [3, 1, 4, 2],
    target: null,
    inputType: "number",
    placeholder: "Enter number of swaps",
    correctAnswer: 3,
    hint: "Pass 1: min is 1 (swaps with 3) -> [1, 3, 4, 2]. Pass 2: min in [3, 4, 2] is 2 (swaps with 3) -> [1, 2, 4, 3]. Pass 3: min in [4, 3] is 3 (swaps with 4) -> [1, 2, 3, 4].",
    explanation: "Pass 1: min is 1 at index 1, swaps with numbers[0]=3 -> [1, 3, 4, 2] (swap 1). Pass 2: min in [3, 4, 2] is 2 at index 3, swaps with numbers[1]=3 -> [1, 2, 4, 3] (swap 2). Pass 3: min in [4, 3] is 3 at index 3, swaps with numbers[2]=4 -> [1, 2, 3, 4] (swap 3). Total swaps = 3."
  },
  {
    id: 5,
    type: "time_complexity",
    difficulty: "Intermediate",
    title: "5. Time Complexity Across All Cases",
    question: "What is the time complexity of Selection Sort in the best case, average case, and worst case?",
    array: [1, 2, 3, 4, 5],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Best: O(n), Average: O(n²), Worst: O(n²)" },
      { id: "B", text: "Best: O(n²), Average: O(n²), Worst: O(n²)" },
      { id: "C", text: "Best: O(n log n), Average: O(n²), Worst: O(n²)" },
      { id: "D", text: "Best: O(1), Average: O(n), Worst: O(n²)" }
    ],
    correctAnswer: "B",
    hint: "Does Selection Sort ever exit its inner loop early when an array is already sorted?",
    explanation: "Selection Sort always runs its inner comparison loop for all remaining elements to confirm no smaller value exists. The number of comparisons is always n(n - 1)/2 = O(n²) in the best, average, and worst cases."
  },
  {
    id: 6,
    type: "in_place_space",
    difficulty: "Challenging",
    title: "6. In-Place Sorting & Auxiliary Space",
    question: "Selection Sort is an IN-PLACE sorting algorithm. What does this mean, and what is its auxiliary space complexity?",
    array: [45, 12, 85, 32, 89],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "It sorts without modifying the input array, using O(n) auxiliary memory" },
      { id: "B", text: "It sorts by swapping elements within the original array, using O(1) auxiliary space" },
      { id: "C", text: "It creates a new sorted list, requiring O(log n) stack memory" },
      { id: "D", text: "It runs in O(n) time and requires O(n²) additional space" }
    ],
    correctAnswer: "B",
    hint: "In-place means the algorithm modifies the array directly without allocating extra buffers, using only a constant number of scalar variables (i, j, min_idx, temp).",
    explanation: "Selection Sort is an in-place algorithm because it rearranges elements directly within the existing array without creating a copy, requiring only O(1) auxiliary variables."
  },
  {
    id: 7,
    type: "stability_property",
    difficulty: "Challenging",
    title: "7. Stability & Counterexample",
    question: "Why is standard Selection Sort generally NOT a stable sorting algorithm?",
    array: [4, 4, 1],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Because long-distance swaps can jump an element over an identical element, reversing their initial relative order" },
      { id: "B", text: "Because its time complexity is O(n²) instead of O(n log n)" },
      { id: "C", text: "Because it uses O(1) auxiliary space rather than a separate output buffer" },
      { id: "D", text: "Because it compares elements in descending order instead of ascending order" }
    ],
    correctAnswer: "A",
    hint: "Consider the array [4a, 4b, 1]. In Pass 1, 1 is the minimum. With which element does 1 swap, and where does 4a end up relative to 4b?",
    explanation: "In [4a, 4b, 1], the minimum element 1 at index 2 swaps with numbers[0] (4a). The resulting array is [1, 4b, 4a]. The relative order of duplicate elements 4a and 4b is reversed, demonstrating that standard Selection Sort is not stable."
  }
];
