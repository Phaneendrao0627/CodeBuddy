/**
 * Comprehensive Binary Search practice questions.
 * Progresses from Beginner to Intermediate with various question types:
 * - find_index: Locate target index or recognize target not found (-1).
 * - predict_mid: Compute middle index using low + (high - low) / 2.
 * - next_pointer: Determine whether low or high moves, and to what value.
 * - comparisons_count: Trace iterations to find an element.
 * - conceptual: Loop invariant and edge cases (e.g. while low <= high).
 */

export const BINARY_SEARCH_QUESTIONS = [
  {
    id: 1,
    type: "find_index",
    difficulty: "Beginner",
    title: "1. Basic Lookup: Find Element Index",
    question: "What is the 0-based return index of Binary Search when searching for target 19 in this sorted array?",
    array: [3, 7, 11, 15, 19, 23, 27],
    target: 19,
    inputType: "number",
    placeholder: "Enter index number (e.g. 0, 1, 2...)",
    correctAnswer: 4,
    hint: "Notice that array[0] = 3, array[1] = 7, array[2] = 11, array[3] = 15, array[4] = 19.",
    explanation: "In the 0-indexed array [3, 7, 11, 15, 19, 23, 27], the target value 19 is located at index 4 (numbers[4] == 19). Binary Search returns 4."
  },
  {
    id: 2,
    type: "predict_mid",
    difficulty: "Beginner",
    title: "2. Midpoint Calculation",
    question: "In the first iteration on an array of length 6, with low = 0 and high = 5, what is the mid index computed using integer division: mid = low + (high - low) / 2?",
    array: [4, 8, 15, 16, 23, 42],
    target: 23,
    activePointers: { low: 0, high: 5 },
    inputType: "number",
    placeholder: "Enter mid index",
    correctAnswer: 2,
    hint: "Calculate 0 + (5 - 0) / 2 = 5 / 2. Integer division truncates the decimal part (2.5 -> 2).",
    explanation: "mid = 0 + (5 - 0) / 2 = 0 + 2 = 2. The element at index 2 is 15."
  },
  {
    id: 3,
    type: "next_pointer",
    difficulty: "Beginner",
    title: "3. Pointer Movement Direction",
    question: "We are searching for target 14. At the current step, mid = 3 where numbers[3] = 8. Since numbers[mid] < target (8 < 14), which pointer should move next and to what value?",
    array: [2, 4, 6, 8, 10, 12, 14, 16],
    target: 14,
    activePointers: { low: 0, high: 7, mid: 3 },
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "low = mid + 1 (low becomes 4)" },
      { id: "B", text: "high = mid - 1 (high becomes 2)" },
      { id: "C", text: "low = mid (low becomes 3)" },
      { id: "D", text: "high = mid (high becomes 3)" }
    ],
    correctAnswer: "A",
    hint: "Since the target (14) is strictly greater than numbers[mid] (8), the target must be in the right half.",
    explanation: "Because target (14) is greater than numbers[mid] (8), all elements from index 0 through 3 are too small. We eliminate the left half by advancing low = mid + 1 = 4."
  },
  {
    id: 4,
    type: "find_index",
    difficulty: "Beginner",
    title: "4. Target Missing Return Value",
    question: "Target 12 does not exist in this array. What standard value does Binary Search return when a target is not found in the array?",
    array: [5, 10, 15, 20, 25, 30],
    target: 12,
    inputType: "number",
    placeholder: "Enter return value (e.g. -1, 0...)",
    correctAnswer: -1,
    hint: "0 is a valid array index (numbers[0] = 5). Standard search algorithms return a negative integer to signal absence.",
    explanation: "Standard Binary Search returns -1 to indicate that the target was not found, since array indices in Java, Python, and C++ are non-negative."
  },
  {
    id: 5,
    type: "predict_mid",
    difficulty: "Intermediate",
    title: "5. Second Iteration Mid & Value",
    question: "In the 2nd iteration, the active search interval has contracted to low = 0 and high = 3. What is the new mid index and what element is inspected?",
    array: [10, 25, 32, 45, 58, 63, 77, 89, 94],
    target: 32,
    activePointers: { low: 0, high: 3 },
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "mid = 1, compared element is 25" },
      { id: "B", text: "mid = 2, compared element is 32" },
      { id: "C", text: "mid = 0, compared element is 10" },
      { id: "D", text: "mid = 1, compared element is 32" }
    ],
    correctAnswer: "A",
    hint: "mid = 0 + (3 - 0) / 2 = 1. Look at array index 1.",
    explanation: "mid = 0 + (3 - 0) / 2 = 0 + 1 = 1. The element at numbers[1] is 25. Next, 32 will be compared with 25."
  },
  {
    id: 6,
    type: "comparisons_count",
    difficulty: "Intermediate",
    title: "6. Trace Comparison Steps",
    question: "How many iterations of the while loop (comparison steps) does Binary Search take to find target 11 in this 8-element array?",
    array: [1, 3, 5, 7, 9, 11, 13, 15],
    target: 11,
    inputType: "number",
    placeholder: "Enter number of steps (e.g. 1, 2, 3...)",
    correctAnswer: 2,
    hint: "Step 1: low=0, high=7, mid=3 (value=7). Since 11 > 7, low=4. Now trace Step 2: low=4, high=7, mid=?",
    explanation: "Step 1: low = 0, high = 7 -> mid = 3 (numbers[3] = 7). 11 > 7 -> low = 4.\nStep 2: low = 4, high = 7 -> mid = 5 (numbers[5] = 11). 11 == 11 -> Target found!\nTotal comparisons: 2."
  },
  {
    id: 7,
    type: "conceptual",
    difficulty: "Intermediate",
    title: "7. Loop Termination Invariant",
    question: "Why must Binary Search use the condition while (low <= high) instead of while (low < high)?",
    array: [42],
    target: 42,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "To check the single remaining element when low == high, otherwise 1-element ranges are missed." },
      { id: "B", text: "Because low < high would cause an infinite loop whenever the target is at index 0." },
      { id: "C", text: "To allow the array to be traversed from right to left." },
      { id: "D", text: "It has no effect and both conditions are completely interchangeable." }
    ],
    correctAnswer: "A",
    hint: "Consider searching in a 1-element array like [42] where low = 0 and high = 0. What happens if the loop requires low < high?",
    explanation: "When low == high, the search range contains exactly one element that has not yet been inspected. If we used while (low < high), the loop would exit before testing this last candidate, incorrectly claiming the target is not found."
  }
];
