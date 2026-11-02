/**
 * Comprehensive Linear Search practice questions.
 * Progresses from Beginner to Intermediate with required coverage:
 * 1. Find target index.
 * 2. Target at first position (best case).
 * 3. Target at last position (worst case).
 * 4. Number of comparisons.
 * 5. Predict the next index.
 * 6. Handle duplicate elements.
 * 7. Determine what happens when target is absent.
 */

export const LINEAR_SEARCH_QUESTIONS = [
  {
    id: 1,
    type: "find_index",
    difficulty: "Beginner",
    title: "1. Basic Lookup: Find Target Index",
    question: "In the unsorted array below, at which 0-based index will Linear Search find the target 33?",
    array: [18, 42, 7, 33, 91, 12],
    target: 33,
    inputType: "number",
    placeholder: "Enter index number (e.g. 0, 1, 2...)",
    correctAnswer: 3,
    hint: "Linear search checks index 0 (18), index 1 (42), index 2 (7), index 3 (33)...",
    explanation: "Linear Search examines elements from left to right. At index 3, numbers[3] is 33, which equals the target. The search returns index 3."
  },
  {
    id: 2,
    type: "first_position",
    difficulty: "Beginner",
    title: "2. Best Case: Target at First Position",
    question: "The target 64 is located at index 0. How many comparisons will Linear Search make, and what is this time complexity?",
    array: [64, 25, 12, 22, 11],
    target: 64,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "1 comparison — Best-case time complexity O(1)" },
      { id: "B", text: "5 comparisons — Worst-case time complexity O(n)" },
      { id: "C", text: "3 comparisons — Average-case time complexity O(n/2)" },
      { id: "D", text: "0 comparisons — Constant time O(0)" }
    ],
    correctAnswer: "A",
    hint: "The loop starts at index i = 0. Does it need to check any subsequent elements?",
    explanation: "On the very first iteration (i = 0), numbers[0] == 64 evaluates to true. The function returns 0 immediately, requiring only 1 comparison. This is the best-case time complexity O(1)."
  },
  {
    id: 3,
    type: "last_position",
    difficulty: "Beginner",
    title: "3. Worst Case: Target at Last Position",
    question: "For this 8-element array with target 72 located at the very last position, how many element comparisons must Linear Search perform?",
    array: [9, 14, 27, 36, 45, 54, 63, 72],
    target: 72,
    inputType: "number",
    placeholder: "Enter number of comparisons (e.g. 1, 2, 3...)",
    correctAnswer: 8,
    hint: "Linear Search checks every index from 0 to 7 before finally finding the match at index 7.",
    explanation: "Because target 72 is at the last index (index 7 of 8 elements), the algorithm must check indices 0, 1, 2, 3, 4, 5, 6, and 7—a total of 8 comparisons (equal to array length n). This is worst-case O(n)."
  },
  {
    id: 4,
    type: "comparisons_count",
    difficulty: "Intermediate",
    title: "4. Count Total Comparisons",
    question: "How many comparisons does Linear Search make before locating target 88 in this array?",
    array: [5, 23, 17, 88, 42, 61, 99],
    target: 88,
    inputType: "number",
    placeholder: "Enter number of comparisons",
    correctAnswer: 4,
    hint: "Count each inspected element: (1) 5, (2) 23, (3) 17, (4) 88...",
    explanation: "Linear Search checks: (1) 5 != 88, (2) 23 != 88, (3) 17 != 88, (4) 88 == 88. That is exactly 4 comparisons."
  },
  {
    id: 5,
    type: "predict_next",
    difficulty: "Intermediate",
    title: "5. Predict the Next Inspected Index",
    question: "Linear Search is currently inspecting index 2 (numbers[2] = 50), which does not match target 20. What is the next index that will be inspected?",
    array: [30, 10, 50, 40, 20],
    target: 20,
    activePointers: { current: 2 },
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Index 3 (i + 1)" },
      { id: "B", text: "Index 4 (jump to end)" },
      { id: "C", text: "Index 1 (step back)" },
      { id: "D", text: "Index 0 (restart loop)" }
    ],
    correctAnswer: "A",
    hint: "Linear search increments the loop counter by 1 sequentially after each mismatch.",
    explanation: "Linear Search increments the index counter `i++` by 1 after each non-matching comparison, sequentially progressing from index 2 to index 3."
  },
  {
    id: 6,
    type: "duplicate_elements",
    difficulty: "Intermediate",
    title: "6. Handling Duplicate Values",
    question: "Target 9 appears multiple times in this array (at indices 1, 3, and 5). Which index will standard left-to-right Linear Search return?",
    array: [4, 9, 15, 9, 23, 9, 31],
    target: 9,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Index 1 (the first occurrence)" },
      { id: "B", text: "Index 5 (the last occurrence)" },
      { id: "C", text: "An array of all indices: [1, 3, 5]" },
      { id: "D", text: "Index 3 (the middle occurrence)" }
    ],
    correctAnswer: "A",
    hint: "Standard Linear Search executes 'return i;' the moment numbers[i] == target evaluates to true.",
    explanation: "Standard Linear Search terminates on the very first match it encounters. Since index 1 contains 9, the function returns 1 immediately and does not inspect the remaining elements."
  },
  {
    id: 7,
    type: "target_absent",
    difficulty: "Intermediate",
    title: "7. Target Absent Behavior",
    question: "When target 99 is not present in an array of size n = 4, how many comparisons are performed and what is the return value?",
    array: [12, 34, 56, 78],
    target: 99,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "4 comparisons (all elements), returns -1" },
      { id: "B", text: "2 comparisons (half the elements), returns -1" },
      { id: "C", text: "4 comparisons, returns 0" },
      { id: "D", text: "0 comparisons, throws an exception" }
    ],
    correctAnswer: "A",
    hint: "In an unsorted array, can the algorithm stop early if the target is absent?",
    explanation: "Because the array is unsorted, Linear Search cannot eliminate any elements without checking them. It must inspect all n = 4 elements before concluding the target is missing, then returns -1."
  }
];
