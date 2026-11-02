/**
 * Comprehensive Jump Search practice questions.
 * Progresses from Beginner to Challenging with diverse question types:
 * - jump_size: Optimal block size calculation m = floor(sqrt(n))
 * - first_boundary: First inspected boundary index
 * - candidate_block: Identifying the active linear scan window
 * - comparisons_count: Tracing jumps and linear comparisons
 * - duplicate_elements: Behavior on duplicate values (first occurrence)
 * - target_absent: Termination when target exceeds array bounds
 * - complexity_worst_case: Algorithmic optimality of floor(sqrt(n))
 */

export const JUMP_SEARCH_QUESTIONS = [
  {
    id: 1,
    type: "jump_size",
    difficulty: "Beginner",
    title: "1. Optimal Jump Block Size",
    question: "For a sorted array of length n = 16, what is the optimal jump step size m computed as m = ⌊√n⌋?",
    array: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32],
    target: null,
    inputType: "number",
    placeholder: "Enter jump size m (e.g. 1, 2, 3...)",
    correctAnswer: 4,
    hint: "Calculate the square root of 16: √16 = 4. ⌊4⌋ = 4.",
    explanation: "For an array of length n = 16, optimal jump size m = ⌊√16⌋ = 4. This mathematically balances jumping forward by blocks of 4 with a maximum of 3 comparisons inside the candidate block."
  },
  {
    id: 2,
    type: "first_boundary",
    difficulty: "Beginner",
    title: "2. First Block Boundary Check",
    question: "In this 9-element array with jump step size m = 3, which 0-based array index is checked in the very FIRST block jump?",
    array: [5, 10, 15, 20, 25, 30, 35, 40, 45],
    target: 30,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Index 2 (value 15)" },
      { id: "B", text: "Index 3 (value 20)" },
      { id: "C", text: "Index 0 (value 5)" },
      { id: "D", text: "Index 1 (value 10)" }
    ],
    correctAnswer: "A",
    hint: "Jump Search checks the end of each block of size m = 3. In 0-based indexing, the end of the first block is index m - 1.",
    explanation: "With m = 3, the first block spans indices 0, 1, and 2. Jump Search tests the boundary at index min(step, n) - 1 = 3 - 1 = 2 (numbers[2] = 15). Since 15 < 30, it jumps to the next block."
  },
  {
    id: 3,
    type: "candidate_block",
    difficulty: "Beginner",
    title: "3. Identifying the Candidate Block",
    question: "We are searching for target 23 in this 16-element array (m = 4). Block boundaries checked: index 3 (value 7 < 23), index 7 (value 15 < 23), and index 11 (value 23 >= 23). Which index range defines the candidate block for the backward linear scan?",
    array: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31],
    target: 23,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Indices [8 to 11]" },
      { id: "B", text: "Indices [0 to 3]" },
      { id: "C", text: "Indices [4 to 7]" },
      { id: "D", text: "Indices [12 to 15]" }
    ],
    correctAnswer: "A",
    hint: "Since boundary index 7 was < 23, but boundary index 11 was >= 23, the target must reside between index 7 + 1 = 8 and index 11.",
    explanation: "Because numbers[7] < 23 and numbers[11] >= 23 in a sorted array, the target must reside in the block [prev..min(step, n) - 1] = [8..11]."
  },
  {
    id: 4,
    type: "comparisons_count",
    difficulty: "Intermediate",
    title: "4. Total Comparison Count",
    question: "How many total comparisons does Jump Search perform to find target 50 in this 9-element array (jump step m = 3)?",
    array: [10, 20, 30, 40, 50, 60, 70, 80, 90],
    target: 50,
    inputType: "number",
    placeholder: "Enter total comparisons",
    correctAnswer: 4,
    hint: "Count block boundary comparisons (index 2: 30 < 50; index 5: 60 >= 50) + linear scan comparisons (index 3: 40 < 50; index 4: 50 == 50).",
    explanation: "1. Block jump 1: compares numbers[2] (30) < 50 (1 comparison).\n2. Block jump 2: compares numbers[5] (60) >= 50 (1 comparison, block [3..5] found).\n3. Linear scan: compares numbers[3] (40) < 50 (1 comparison).\n4. Linear scan: compares numbers[4] (50) == 50 (1 comparison, match!).\nTotal comparisons = 1 + 1 + 1 + 1 = 4."
  },
  {
    id: 5,
    type: "duplicate_elements",
    difficulty: "Intermediate",
    title: "5. Handling Duplicate Values",
    question: "In the sorted array below, target 12 appears at indices 2, 3, and 4. With m = 3, which index does standard Jump Search return?",
    array: [3, 7, 12, 12, 12, 18, 25, 30, 36],
    target: 12,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Index 2 (the first occurrence)" },
      { id: "B", text: "Index 3 (the middle occurrence)" },
      { id: "C", text: "Index 4 (the last occurrence)" },
      { id: "D", text: "Jump Search fails on duplicate values" }
    ],
    correctAnswer: "A",
    hint: "First block boundary is index 2 (value 12 >= 12). Linear scan begins at prev = 0 and tests index 0, index 1, and index 2.",
    explanation: "Jump Search checks boundary index 2 where numbers[2] = 12 >= 12. It stops jumping and scans the block [0..2]. The scan checks numbers[0]=3, numbers[1]=7, numbers[2]=12 == 12, successfully returning index 2 (the first occurrence)."
  },
  {
    id: 6,
    type: "target_absent",
    difficulty: "Intermediate",
    title: "6. Target Greater Than All Elements",
    question: "When searching for target 25 (which exceeds the maximum element 16), how does Jump Search conclude that the target is absent?",
    array: [2, 4, 6, 8, 10, 12, 14, 16],
    target: 25,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "The prev pointer reaches or exceeds array length n during block jumping, returning -1" },
      { id: "B", text: "It wraps around to index 0 and re-scans the array" },
      { id: "C", text: "It falls back to a full Linear Search of the entire array" },
      { id: "D", text: "It throws an IndexOutOfBoundsException" }
    ],
    correctAnswer: "A",
    hint: "During the while loop, step keeps increasing. When prev exceeds or equals n without encountering a boundary >= target, no elements remain.",
    explanation: "If target exceeds all elements, the block jumping loop advances past the last element until prev >= n. At this point, the search terminates immediately and returns -1."
  },
  {
    id: 7,
    type: "complexity_worst_case",
    difficulty: "Challenging",
    title: "7. Why Jump Size m = ⌊√n⌋ is Optimal",
    question: "Why is the optimal jump step size chosen as m = ⌊√n⌋ rather than an arbitrary constant step like m = 10?",
    array: [1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "It balances the number of block jumps (n/m) and linear comparisons (m - 1), minimizing the worst-case sum to O(√n)" },
      { id: "B", text: "Square root is the only operation that guarantees no integer overflow" },
      { id: "C", text: "Because Jump Search space complexity requires O(√n) memory" },
      { id: "D", text: "Because √n ensures the array will always be split into exactly 2 blocks" }
    ],
    correctAnswer: "A",
    hint: "Total worst-case operations: (n/m) + (m - 1). Taking the derivative with respect to m and setting to 0 gives m = √n.",
    explanation: "Worst-case comparisons equal (n/m) block jumps plus (m - 1) linear scan steps. Differentiating f(m) = n/m + m with respect to m yields -n/m² + 1 = 0, which gives m = √n. This guarantees optimal O(√n) worst-case time complexity."
  }
];
