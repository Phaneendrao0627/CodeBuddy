/**
 * Comprehensive Quick Sort practice questions.
 * Progresses from Beginner to Challenging covering:
 * 1. Quick Sort algorithmic paradigm & in-place comparison
 * 2. Lomuto last-element pivot selection
 * 3. Initial partition boundary pointer i
 * 4. First swap during partition traversal
 * 5. Final pivot index after partitioning
 * 6. Recursive subarray boundaries excluding pivot
 * 7. Best-case time complexity O(n log n)
 * 8. Average-case time complexity O(n log n)
 * 9. Worst-case O(n²) trigger on sorted/reverse-sorted inputs
 * 10. Auxiliary space & non-stability properties
 */

export const QUICK_SORT_QUESTIONS = [
  {
    id: 1,
    type: "concept_fundamentals",
    difficulty: "Beginner",
    title: "1. Quick Sort Algorithmic Paradigm",
    question: "Which algorithmic paradigm does Quick Sort follow, and what is its primary difference from Merge Sort regarding memory?",
    array: [38, 27, 43, 3, 9, 82, 10],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Divide and Conquer; Quick Sort sorts in-place with O(log n) auxiliary stack space, whereas Merge Sort requires O(n) auxiliary array memory." },
      { id: "B", text: "Greedy approach; Quick Sort selects the globally smallest element first." },
      { id: "C", text: "Dynamic Programming; Quick Sort stores solved subproblems in a lookup table." },
      { id: "D", text: "Linear Scan; Quick Sort never uses recursion." }
    ],
    correctAnswer: "A",
    hint: "Both algorithms divide the problem into subproblems, but one creates temporary array buffers while the other rearranges elements in-place.",
    explanation: "Quick Sort is a Divide and Conquer algorithm that rearranges elements in-place around a pivot. Unlike Merge Sort which allocates O(n) auxiliary buffers for merging, Quick Sort requires only O(log n) call-stack space on average."
  },
  {
    id: 2,
    type: "pivot_selection",
    difficulty: "Beginner",
    title: "2. Lomuto Pivot Selection",
    question: "In the standard Lomuto partition scheme for subarray [low..high] = [38, 27, 43, 3, 9, 82, 10] spanning indices 0 to 6, which element is selected as the pivot?",
    array: [38, 27, 43, 3, 9, 82, 10],
    target: null,
    inputType: "number",
    placeholder: "Enter pivot value",
    correctAnswer: 10,
    hint: "The Lomuto partition scheme consistently selects the last element of the current subarray (numbers[high]).",
    explanation: "In the Lomuto partition scheme, the pivot is always chosen as the last element of the subarray, numbers[high]. Here, high = 6, so numbers[6] = 10 is the pivot."
  },
  {
    id: 3,
    type: "lomuto_boundary",
    difficulty: "Beginner",
    title: "3. Initial Partition Boundary",
    question: "When partitioning subarray [low..high] with low = 0 and high = 6 using Lomuto partition, what is the initial value of the partition boundary pointer i before the scanning loop starts?",
    array: [38, 27, 43, 3, 9, 82, 10],
    target: null,
    inputType: "number",
    placeholder: "Enter initial value of pointer i",
    correctAnswer: -1,
    hint: "Pointer i marks the last element known to be <= pivot. Before examining any elements, what index immediately precedes low?",
    explanation: "Lomuto partition initializes pointer i to low - 1. For low = 0, i = -1, indicating that no elements have yet been verified to be smaller than or equal to the pivot."
  },
  {
    id: 4,
    type: "partition_trace_first_swap",
    difficulty: "Intermediate",
    title: "4. First Swap in Lomuto Partition",
    question: "During Lomuto partitioning of [38, 27, 43, 3, 9, 82, 10] with pivot 10, scanner j scans indices 0, 1, 2, 3... At which scan index j does the first element swap occur?",
    array: [38, 27, 43, 3, 9, 82, 10],
    target: null,
    inputType: "number",
    placeholder: "Enter scan index j where first swap occurs",
    correctAnswer: 3,
    hint: "Check each element from left to right against pivot 10: 38 <= 10 (No), 27 <= 10 (No), 43 <= 10 (No), 3 <= 10 (Yes!). At which index is 3 located?",
    explanation: "At j = 0 (38), j = 1 (27), and j = 2 (43), the elements are > 10. At j = 3, numbers[3] = 3 <= 10. Pointer i increments from -1 to 0, and numbers[0] (38) is swapped with numbers[3] (3)."
  },
  {
    id: 5,
    type: "final_pivot_index",
    difficulty: "Intermediate",
    title: "5. Final Pivot Index After Partitioning",
    question: "For array [38, 27, 43, 3, 9, 82, 10], what is the final index of pivot 10 after the first complete Lomuto partition pass?",
    array: [38, 27, 43, 3, 9, 82, 10],
    target: null,
    inputType: "number",
    placeholder: "Enter final pivot index",
    correctAnswer: 2,
    hint: "Count how many elements in the array are <= 10 (namely 3 and 9). The pivot is placed immediately after them.",
    explanation: "Elements smaller than or equal to 10 are 3 and 9 (2 elements). Thus, pointer i ends at index 1. The pivot 10 is placed at index i + 1 = 2, yielding [3, 9, 10, 38, 27, 82, 43]."
  },
  {
    id: 6,
    type: "recursive_calls",
    difficulty: "Intermediate",
    title: "6. Recursive Subarray Boundaries",
    question: "After pivot element 10 is placed at index 2 for the range [0..6], which two subarray ranges are recursively sorted next?",
    array: [3, 9, 10, 38, 27, 82, 43],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "[0..1] and [3..6] (the pivot index 2 is excluded from both subproblems)" },
      { id: "B", text: "[0..2] and [2..6] (the pivot is included in both subproblems)" },
      { id: "C", text: "[0..1] and [2..6] (the pivot is included in the right subproblem)" },
      { id: "D", text: "[0..3] and [4..6] (the midpoint is used instead of the pivot)" }
    ],
    correctAnswer: "A",
    hint: "The pivot is already in its permanent, finalized sorted position. Should it be included in future recursive calls?",
    explanation: "Because the pivot at index pi = 2 is already in its finalized position, Quick Sort recurses on [low..pi - 1] = [0..1] and [pi + 1..high] = [3..6]. Including the pivot in recursive calls would lead to infinite recursion."
  },
  {
    id: 7,
    type: "best_case_complexity",
    difficulty: "Intermediate",
    title: "7. Best-Case Time Complexity",
    question: "What is the best-case time complexity of Quick Sort, and under what condition does it occur?",
    array: [8, 4, 12, 2, 6, 10, 14],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "O(n log n), when the pivot divides the subarray into two equal or near-equal halves at every recursive step" },
      { id: "B", text: "O(n), when the array is already sorted" },
      { id: "C", text: "O(1), when the first element equals the last element" },
      { id: "D", text: "O(n²), when the recursion depth is maximal" }
    ],
    correctAnswer: "A",
    hint: "When partitions are perfectly balanced, the recursion tree height is log₂(n), and each level takes O(n) total partitioning work.",
    explanation: "Best-case time complexity O(n log n) occurs when the chosen pivot always splits the subarray into two equal halves. This results in a recursion tree of height log₂(n), with O(n) work per level."
  },
  {
    id: 8,
    type: "average_case_complexity",
    difficulty: "Intermediate",
    title: "8. Average-Case Time Complexity",
    question: "What is the average-case time complexity of Quick Sort on random permutations of n elements?",
    array: [14, 7, 3, 12, 9, 11, 5],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "O(n log n)" },
      { id: "B", text: "O(n²)" },
      { id: "C", text: "O(n)" },
      { id: "D", text: "O(log n)" }
    ],
    correctAnswer: "A",
    hint: "Even with imperfect splits (e.g. 90-10 or 75-25 splits), the depth of the recursion tree remains proportional to log n.",
    explanation: "On average, random inputs yield reasonably balanced partitions. Even an unbalanced 90-to-10 split results in an O(log n) tree depth. The average-case time complexity is O(n log n), typically with a very small constant factor."
  },
  {
    id: 9,
    type: "worst_case_complexity",
    difficulty: "Challenging",
    title: "9. Worst-Case Trigger for Last-Element Lomuto Pivot",
    question: "What is the worst-case time complexity of Quick Sort using the last-element Lomuto partition scheme, and which input triggers it?",
    array: [1, 2, 3, 4, 5, 6],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "O(n²), triggered when the array is already sorted or reverse-sorted" },
      { id: "B", text: "O(n log n), triggered when all elements are distinct" },
      { id: "C", text: "O(n), triggered on arrays with random orders" },
      { id: "D", text: "O(log n), triggered when the array contains negative numbers" }
    ],
    correctAnswer: "A",
    hint: "If the last element is always the largest (or smallest), how many elements are in the other partition at each step?",
    explanation: "With the last-element pivot, an already-sorted array causes the pivot to always be the maximum element. The left partition has size n - 1 and the right is empty. This degrades the recursion tree to height n, requiring (n - 1) + (n - 2) + ... + 1 = n(n - 1) / 2 comparisons, which is O(n²)."
  },
  {
    id: 10,
    type: "stability_and_space",
    difficulty: "Challenging",
    title: "10. Auxiliary Space & Stability Properties",
    question: "Is Quick Sort a stable sorting algorithm, and what is its auxiliary space complexity?",
    array: [5, 2, 5, 1, 8, 2],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Not stable; auxiliary space is O(log n) on average for the recursion call stack" },
      { id: "B", text: "Stable; auxiliary space is O(n) for temporary arrays" },
      { id: "C", text: "Stable; auxiliary space is O(1) because it does not use recursion" },
      { id: "D", text: "Not stable; auxiliary space is O(n²) due to data duplication" }
    ],
    correctAnswer: "A",
    hint: "Consider what happens to identical elements when swapped across large distances, and what consumes memory during recursion.",
    explanation: "Quick Sort is NOT stable because partitioning swaps elements across distant indices, potentially reversing the original order of duplicate keys. Its auxiliary memory is strictly O(log n) on average (O(n) worst case) to hold recursion call stack frames, as sorting happens in-place."
  }
];
