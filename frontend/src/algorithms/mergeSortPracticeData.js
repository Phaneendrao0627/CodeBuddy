/**
 * Comprehensive Merge Sort practice questions.
 * Progresses from Beginner to Challenging covering:
 * 1. Midpoint calculation & divide step
 * 2. Base case of recursion
 * 3. Merge pointer comparison & selection
 * 4. Merging two sorted subarrays into one
 * 5. Time complexity O(n log n) in all cases
 * 6. Auxiliary space complexity O(n)
 * 7. Stability & the '<=' comparison condition
 */

export const MERGE_SORT_QUESTIONS = [
  {
    id: 1,
    type: "midpoint_calculation",
    difficulty: "Beginner",
    title: "1. Midpoint Calculation & Divide Step",
    question: "For an array of 7 elements with left index 0 and right index 6, what is the midpoint index (mid) calculated using the safe integer formula mid = left + (right - left) / 2?",
    array: [38, 27, 43, 3, 9, 82, 10],
    target: null,
    inputType: "number",
    placeholder: "Enter midpoint index",
    correctAnswer: 3,
    hint: "Calculate: 0 + Math.floor((6 - 0) / 2).",
    explanation: "With left = 0 and right = 6, mid = 0 + (6 - 0) / 2 = 3. The left subarray spans indices [0..3] (4 elements) and the right subarray spans indices [4..6] (3 elements)."
  },
  {
    id: 2,
    type: "base_case",
    difficulty: "Beginner",
    title: "2. Base Case of Recursion",
    question: "When does the recursive mergeSort(numbers, left, right) call hit its base case and stop dividing?",
    array: [42],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "When left >= right (the subarray contains 1 or 0 elements)" },
      { id: "B", text: "When the midpoint mid equals 0" },
      { id: "C", text: "When the first and last elements are equal" },
      { id: "D", text: "When the array contains fewer than 10 elements" }
    ],
    correctAnswer: "A",
    hint: "A subarray of length 1 or 0 is already sorted by definition. What index condition represents this?",
    explanation: "When left >= right, the subarray contains either a single element (left == right) or is empty (left > right). It is trivially sorted, so recursion terminates immediately."
  },
  {
    id: 3,
    type: "merge_comparison",
    difficulty: "Intermediate",
    title: "3. First Merge Selection",
    question: "When merging sorted left subarray [27, 38] and sorted right subarray [3, 43], which element is selected first to be placed into the merged output?",
    array: [27, 38, 3, 43],
    target: null,
    inputType: "number",
    placeholder: "Enter selected element",
    correctAnswer: 3,
    hint: "Compare the first elements of both sorted subarrays: leftArr[0] = 27 vs rightArr[0] = 3. Which one is smaller?",
    explanation: "In the first comparison, leftArr[0] (27) is compared with rightArr[0] (3). Since 3 < 27, 3 is chosen and written to slot 0 of the merged array, and the right pointer j advances."
  },
  {
    id: 4,
    type: "merge_result",
    difficulty: "Intermediate",
    title: "4. Result of Merging Two Subarrays",
    question: "If the left sorted subarray is [9, 82] and the right sorted subarray is [10], what is the final merged array after the merge operation completes?",
    array: [9, 82, 10],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "[9, 10, 82]" },
      { id: "B", text: "[10, 9, 82]" },
      { id: "C", text: "[9, 82, 10]" },
      { id: "D", text: "[82, 10, 9]" }
    ],
    correctAnswer: "A",
    hint: "Step 1: compare 9 vs 10 -> pick 9. Step 2: compare 82 vs 10 -> pick 10. Copy remaining 82 from left.",
    explanation: "First, 9 is compared with 10 (9 is picked). Then 82 is compared with 10 (10 is picked). Finally, the remaining element 82 from the left subarray is copied over, yielding [9, 10, 82]."
  },
  {
    id: 5,
    type: "time_complexity",
    difficulty: "Intermediate",
    title: "5. Time Complexity in All Cases",
    question: "What is the time complexity of Merge Sort in the best case, average case, and worst case?",
    array: [1, 2, 3, 4, 5, 6, 7, 8],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Best: O(n log n), Average: O(n log n), Worst: O(n log n)" },
      { id: "B", text: "Best: O(n), Average: O(n log n), Worst: O(n²)" },
      { id: "C", text: "Best: O(n log n), Average: O(n log n), Worst: O(n²)" },
      { id: "D", text: "Best: O(1), Average: O(n), Worst: O(n log n)" }
    ],
    correctAnswer: "A",
    hint: "Does Merge Sort ever skip dividing the array or merging elements, even if the array is already sorted?",
    explanation: "Merge Sort always divides the array into log₂(n) levels, and at each level merges all n elements in O(n) total time. Therefore, it is guaranteed O(n log n) in all cases (best, average, and worst)."
  },
  {
    id: 6,
    type: "space_complexity",
    difficulty: "Challenging",
    title: "6. Auxiliary Space Complexity",
    question: "What is the auxiliary space complexity of standard array-based Merge Sort, and why?",
    array: [50, 20, 40, 10, 30],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "O(n) because temporary buffers are needed to store and merge subarrays" },
      { id: "B", text: "O(1) because elements are swapped entirely in-place within the original array" },
      { id: "C", text: "O(n²) because each recursive call duplicates the entire array" },
      { id: "D", text: "O(log n) because only the recursion stack requires memory" }
    ],
    correctAnswer: "A",
    hint: "During the merge step, where are elements copied before being written back into the original array?",
    explanation: "Standard Merge Sort requires O(n) auxiliary memory to hold temporary arrays (leftArr and rightArr) during the merge operation. Although the recursion stack takes O(log n) frames, the dominant memory cost is O(n)."
  },
  {
    id: 7,
    type: "stability_property",
    difficulty: "Challenging",
    title: "7. Stability & Comparison Operator",
    question: "Why is standard Merge Sort a STABLE sort, and what code condition is required to maintain this property?",
    array: [5, 2, 5, 1],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "It is stable because the merge condition uses leftArr[i] <= rightArr[j], selecting the left duplicate first" },
      { id: "B", text: "It is stable because it divides the array into powers of 2" },
      { id: "C", text: "It is stable only when the array size is an even number" },
      { id: "D", text: "It is not stable because elements from different subarrays are compared" }
    ],
    correctAnswer: "A",
    hint: "When leftArr[i] == rightArr[j], which element should be chosen first to preserve original relative order?",
    explanation: "When equal elements appear in both subarrays, using '<=' ensures that the element from the left subarray is chosen first. Because the left subarray originally appeared before the right subarray, their original relative order is preserved, making Merge Sort stable."
  }
];
