/**
 * Comprehensive Insertion Sort practice questions.
 * Progresses from Beginner to Challenging with diverse question types:
 * - key_selection: First key picked for insertion
 * - first_pass: Array state after pass 1
 * - element_shifting: Number of shifts for a given key
 * - pass_result: Array configuration after completing pass 2
 * - comparison_count: Best-case comparison count on already-sorted array
 * - worst_case_shifts: Total shifts on reverse-sorted array
 * - stability_property: Mathematical reason for stability
 */

export const INSERTION_SORT_QUESTIONS = [
  {
    id: 1,
    type: "key_selection",
    difficulty: "Beginner",
    title: "1. First Key Selection",
    question: "In Insertion Sort, what is the value of the very first key selected to be inserted into the sorted portion for the array [9, 4, 7, 2, 8]?",
    array: [9, 4, 7, 2, 8],
    target: null,
    inputType: "number",
    placeholder: "Enter the key value",
    correctAnswer: 4,
    hint: "The element at index 0 (value 9) is considered trivially sorted on its own. The outer loop begins at index 1.",
    explanation: "Insertion Sort begins its outer loop at index i = 1. Since numbers[1] = 4, the value 4 is stored as the first key to be inserted into the sorted prefix [9]."
  },
  {
    id: 2,
    type: "first_pass",
    difficulty: "Beginner",
    title: "2. Array State After Pass 1",
    question: "For the array [9, 4, 7, 2, 8], what will be the exact array configuration after completing Pass 1 (inserting key 4)?",
    array: [9, 4, 7, 2, 8],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "[4, 9, 7, 2, 8]" },
      { id: "B", text: "[9, 4, 7, 2, 8]" },
      { id: "C", text: "[2, 4, 7, 8, 9]" },
      { id: "D", text: "[4, 7, 9, 2, 8]" }
    ],
    correctAnswer: "A",
    hint: "Key 4 is compared with 9. Since 9 > 4, 9 shifts right to index 1, and 4 is placed at index 0.",
    explanation: "In Pass 1, key 4 is compared with numbers[0] = 9. Because 9 > 4, 9 shifts to index 1. Key 4 is placed at index 0, producing [4, 9, 7, 2, 8] with sorted prefix [4, 9]."
  },
  {
    id: 3,
    type: "element_shifting",
    difficulty: "Beginner",
    title: "3. Number of Shifts",
    question: "During Pass 3 on the array [4, 7, 9, 2, 8], key = 2 is being inserted into the sorted prefix [4, 7, 9]. How many elements must shift right to make room for 2?",
    array: [4, 7, 9, 2, 8],
    target: null,
    inputType: "number",
    placeholder: "Enter number of shifts",
    correctAnswer: 3,
    hint: "Count how many elements in the sorted prefix [4, 7, 9] are strictly greater than 2.",
    explanation: "All three elements in the sorted prefix (9, 7, and 4) are strictly greater than 2. Therefore, 9 shifts to index 3, 7 shifts to index 2, and 4 shifts to index 1, resulting in 3 total shifts."
  },
  {
    id: 4,
    type: "pass_result",
    difficulty: "Intermediate",
    title: "4. Array State After Pass 2",
    question: "Given the initial array [8, 3, 5, 1, 4], what is the array order after completing Pass 2 (i = 2, where key = 5 is inserted)?",
    array: [8, 3, 5, 1, 4],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "[3, 5, 8, 1, 4]" },
      { id: "B", text: "[3, 8, 5, 1, 4]" },
      { id: "C", text: "[1, 3, 5, 8, 4]" },
      { id: "D", text: "[5, 3, 8, 1, 4]" }
    ],
    correctAnswer: "A",
    hint: "Pass 1 inserts 3 into [8] -> [3, 8, 5, 1, 4]. Pass 2 inserts 5 into [3, 8].",
    explanation: "After Pass 1 (i = 1), key 3 is inserted before 8 -> [3, 8, 5, 1, 4]. In Pass 2 (i = 2), key 5 is compared with 8 (8 shifts right) and 3 (3 <= 5, stops), so 5 is placed between 3 and 8 -> [3, 5, 8, 1, 4]."
  },
  {
    id: 5,
    type: "comparison_count",
    difficulty: "Intermediate",
    title: "5. Best-Case Comparisons",
    question: "When sorting an already-sorted array of n = 6 elements [10, 20, 30, 40, 50, 60], what is the total number of comparisons performed by Insertion Sort?",
    array: [10, 20, 30, 40, 50, 60],
    target: null,
    inputType: "number",
    placeholder: "Enter total comparisons",
    correctAnswer: 5,
    hint: "For each of the n - 1 keys (i = 1 to 5), the while loop checks numbers[i - 1] > key exactly once, immediately evaluates to false, and does not shift.",
    explanation: "In an already sorted array of length n, each of the n - 1 keys is compared exactly once with its immediate predecessor (numbers[i - 1] > key is false). Hence, total comparisons = n - 1 = 6 - 1 = 5, achieving O(n) linear best-case time."
  },
  {
    id: 6,
    type: "worst_case_shifts",
    difficulty: "Intermediate",
    title: "6. Worst-Case Shift Count",
    question: "For a reverse-sorted array of n = 5 elements [5, 4, 3, 2, 1], what is the total number of element shifts needed to sort it in ascending order?",
    array: [5, 4, 3, 2, 1],
    target: null,
    inputType: "number",
    placeholder: "Enter total shifts",
    correctAnswer: 10,
    hint: "In reverse order, pass i shifts i elements. Compute the sum: 1 + 2 + 3 + 4.",
    explanation: "For a reverse-sorted array: Pass 1 (key 4) shifts 1 element; Pass 2 (key 3) shifts 2 elements; Pass 3 (key 2) shifts 3 elements; Pass 4 (key 1) shifts 4 elements. Total shifts = 1 + 2 + 3 + 4 = 10 (or n(n - 1)/2 = 5 × 4 / 2 = 10)."
  },
  {
    id: 7,
    type: "stability_property",
    difficulty: "Challenging",
    title: "7. Why Insertion Sort is Stable",
    question: "Why does standard Insertion Sort preserve the relative order of duplicate elements (making it a STABLE sort)?",
    array: [5, 2, 5, 1, 8],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Because the while loop condition uses strict inequality (numbers[j] > key), so equal elements never shift past each other" },
      { id: "B", text: "Because it uses O(1) auxiliary space" },
      { id: "C", text: "Because its best-case time complexity is linear O(n)" },
      { id: "D", text: "Because it scans the array from right to left" }
    ],
    correctAnswer: "A",
    hint: "Look at the condition `while (j >= 0 && numbers[j] > key)`. When numbers[j] == key, does the shift happen?",
    explanation: "Because the comparison condition `numbers[j] > key` is strictly greater than, when an element equal to the key is encountered, the condition evaluates to false. The while loop stops immediately, and the key is placed directly after the equal element, preserving stability."
  }
];
