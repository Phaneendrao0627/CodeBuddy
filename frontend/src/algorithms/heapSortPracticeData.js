/**
 * Comprehensive Heap Sort practice questions.
 * Progresses from Beginner to Advanced covering:
 * 1. Max Heap definition & parent-child rule
 * 2. Tree relationships (root, parent, children)
 * 3. Array indexing formulas (parent, left child, right child)
 * 4. Finding the largest element at root index 0
 * 5. Building a Max Heap from an array
 * 6. Starting index for the bottom-up build-heap phase
 * 7. Identifying the next swap during sift-down (heapify)
 * 8. Extraction step swapping root with the end of the heap
 * 9. Guaranteed O(n log n) time and O(1) space complexity
 * 10. Non-stability and in-place properties
 * 11. O(n) mathematical analysis of build-heap
 */

export const HEAP_SORT_QUESTIONS = [
  {
    id: 1,
    type: "max_heap_definition",
    difficulty: "Beginner",
    title: "1. What is a Max Heap?",
    question: "In a binary Max Heap, what relationship must hold between every parent node and its child nodes?",
    array: [45, 30, 25, 15, 10, 20],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Every parent node's value must be greater than or equal to the values of its children (parent >= children)." },
      { id: "B", text: "Every parent node's value must be strictly smaller than the values of its children (parent < children)." },
      { id: "C", text: "The left child must be smaller than the parent, and the right child must be greater (Binary Search Tree property)." },
      { id: "D", text: "All nodes at the same tree level must have identical values." }
    ],
    correctAnswer: "A",
    hint: "Think about why the maximum number always rises to the top (the root).",
    explanation: "In a Max Heap, every parent node is greater than or equal to both of its children. Because this rule holds recursively throughout the tree, the largest element in the entire collection is guaranteed to be at the root (index 0)."
  },
  {
    id: 2,
    type: "tree_relationships",
    difficulty: "Beginner",
    title: "2. Identify Root, Parent, and Children",
    question: "Given the array representation of a heap [50, 30, 40, 10, 20, 35, 25], which element is the root of the tree, and what are its direct left and right children?",
    array: [50, 30, 40, 10, 20, 35, 25],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Root is 50; Left child is 30; Right child is 40." },
      { id: "B", text: "Root is 25; Left child is 35; Right child is 20." },
      { id: "C", text: "Root is 50; Left child is 10; Right child is 20." },
      { id: "D", text: "Root is 40; Left child is 30; Right child is 50." }
    ],
    correctAnswer: "A",
    hint: "In a 0-based array, the root is at index 0. Its left child is at index 2*0 + 1 = 1, and its right child is at index 2*0 + 2 = 2.",
    explanation: "The root of the binary heap is stored at index 0 (value 50). Its left child is at index 2*0 + 1 = 1 (value 30), and its right child is at index 2*0 + 2 = 2 (value 40)."
  },
  {
    id: 3,
    type: "index_calculation",
    difficulty: "Beginner",
    title: "3. Calculate Parent and Child Indices",
    question: "In a 0-based array representation of a binary heap, what is the index of the left child of an element located at index i = 3?",
    array: [100, 80, 90, 70, 60, 85, 75, 40, 50],
    target: null,
    inputType: "number",
    placeholder: "Enter the index of the left child",
    correctAnswer: 7,
    hint: "Use the formula for the left child: 2 * i + 1. For i = 3, calculate 2 * 3 + 1.",
    explanation: "For any node at index i in a 0-based binary heap array, its left child is located at index 2 * i + 1. Substituting i = 3 gives 2 * 3 + 1 = 7. (For confirmation, the value at index 7 is 40)."
  },
  {
    id: 4,
    type: "largest_element_position",
    difficulty: "Beginner",
    title: "4. Identify the Largest Element",
    question: "In any valid Max Heap stored in a 0-based array numbers[0..n-1], at which index is the globally largest element always located?",
    array: [95, 60, 75, 40, 55, 65, 70],
    target: null,
    inputType: "number",
    placeholder: "Enter the index of the largest element",
    correctAnswer: 0,
    hint: "The root node of a Max Heap is always the top of the pyramid. What is the array index of the root?",
    explanation: "By definition, the root of a Max Heap is greater than or equal to all of its descendants. In a 0-based array, the root is always stored at index 0, so numbers[0] is guaranteed to be the largest element."
  },
  {
    id: 5,
    type: "build_max_heap",
    difficulty: "Intermediate",
    title: "5. Build a Max Heap from an Array",
    question: "Given the unsorted array [4, 10, 3, 5, 1], what is the resulting array order after the complete Build Max Heap phase finishes?",
    array: [4, 10, 3, 5, 1],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "[10, 5, 3, 4, 1]" },
      { id: "B", text: "[10, 5, 4, 3, 1]" },
      { id: "C", text: "[1, 3, 4, 5, 10]" },
      { id: "D", text: "[4, 10, 5, 3, 1]" }
    ],
    correctAnswer: "A",
    hint: "Non-leaf nodes start at index 1 (value 10) and then index 0 (value 4). Sift down 4: it swaps with 10, then swaps with 5.",
    explanation: "The array has size 5. Non-leaf nodes are at index 1 and 0. Node at index 1 (10) already satisfies the heap property with children 5 and 1. At index 0 (4), 4 is compared with children 10 and 3. 10 is larger, so 4 swaps with 10 giving [10, 4, 3, 5, 1]. Next, 4 at index 1 is compared with children 5 and 1. 5 is larger, so 4 swaps with 5, resulting in [10, 5, 3, 4, 1]."
  },
  {
    id: 6,
    type: "last_non_leaf_node",
    difficulty: "Intermediate",
    title: "6. Trace Heap Construction Starting Node",
    question: "During the Build Max Heap phase on an array of n = 7 elements ([12, 11, 13, 5, 6, 7, 1]), at which non-leaf node index does the bottom-up heapify loop start?",
    array: [12, 11, 13, 5, 6, 7, 1],
    target: null,
    inputType: "number",
    placeholder: "Enter the starting index for build heap",
    correctAnswer: 2,
    hint: "The formula for the last non-leaf node in an array of size n is floor(n / 2) - 1. For n = 7, calculate floor(7 / 2) - 1.",
    explanation: "In an array of length n = 7, leaves reside from index floor(7 / 2) = 3 to 6. The last non-leaf node is at index floor(n / 2) - 1 = floor(7 / 2) - 1 = 3 - 1 = 2 (which holds value 13 with children 7 and 1)."
  },
  {
    id: 7,
    type: "identify_next_swap",
    difficulty: "Intermediate",
    title: "7. Identify the Next Swap during Heapify",
    question: "Subtree root at index 0 has value 15. Its left child at index 1 has value 40, and its right child at index 2 has value 30. During heapify, which element will swap with 15?",
    array: [15, 40, 30, 10, 20],
    target: null,
    inputType: "number",
    placeholder: "Enter the value that will swap with 15",
    correctAnswer: 40,
    hint: "In a Max Heap, a parent that is smaller than its children must swap with the LARGEST of its children.",
    explanation: "The children of index 0 are 40 (index 1) and 30 (index 2). Since 40 > 30 and 40 > 15, the larger child is 40. Therefore, 15 swaps with 40 to ensure the local subtree satisfies the max heap property."
  },
  {
    id: 8,
    type: "trace_extraction",
    difficulty: "Intermediate",
    title: "8. Trace Extraction of the Maximum",
    question: "You have built the Max Heap [80, 50, 70, 30, 20, 10]. In the first extraction step of Heap Sort, with which index is the root (80) swapped to move the maximum to the end?",
    array: [80, 50, 70, 30, 20, 10],
    target: null,
    inputType: "number",
    placeholder: "Enter the target swap index",
    correctAnswer: 5,
    hint: "The maximum element is at index 0 and needs to be placed at the very end of the current active heap (length 6).",
    explanation: "The array has size 6 (indices 0 to 5). Heap Sort moves the maximum element (80 at index 0) to the last position of the active heap by swapping numbers[0] with numbers[5] (10). Index 5 is then locked in sorted order, and the active heap shrinks to indices 0..4."
  },
  {
    id: 9,
    type: "complexity_analysis",
    difficulty: "Advanced",
    title: "9. Time and Space Complexity Analysis",
    question: "What is the time complexity of Heap Sort in the worst case, and what is its auxiliary space complexity for standard in-place sorting?",
    array: [64, 34, 25, 12, 22, 11, 90],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Worst-case Time: O(n log n); Auxiliary Space: O(1)" },
      { id: "B", text: "Worst-case Time: O(n²); Auxiliary Space: O(1)" },
      { id: "C", text: "Worst-case Time: O(n log n); Auxiliary Space: O(n)" },
      { id: "D", text: "Worst-case Time: O(n); Auxiliary Space: O(log n)" }
    ],
    correctAnswer: "A",
    hint: "Unlike Quick Sort, Heap Sort has a guaranteed worst-case time bound of O(n log n) and sorts directly within the array without allocating extra array memory.",
    explanation: "Heap Sort guarantees O(n log n) running time in all cases (best, average, and worst) because a binary tree of n elements has height floor(log₂ n), and at most n extractions of O(log n) each are performed. It is an in-place sort requiring only O(1) auxiliary memory."
  },
  {
    id: 10,
    type: "properties_stability",
    difficulty: "Advanced",
    title: "10. Heap Sort Properties & Stability",
    question: "Is Heap Sort considered a stable sorting algorithm, and why?",
    array: [5, 2, 5, 1, 8, 2],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "No; swapping root elements to the end of the array across long index distances can alter the relative order of identical elements." },
      { id: "B", text: "Yes; elements with equal values always remain in their original input order." },
      { id: "C", text: "Yes; because the heap structure preserves insertion order." },
      { id: "D", text: "No; only algorithms with O(n²) complexity can be stable." }
    ],
    correctAnswer: "A",
    hint: "Consider what happens when duplicate elements are swapped across the entire tree during root extraction.",
    explanation: "Heap Sort is NOT a stable sort. When the maximum element is swapped with the last element of the heap, or when elements are sifted down, elements with equal values can be reordered relative to their initial positions in the input array."
  },
  {
    id: 11,
    type: "build_heap_complexity",
    difficulty: "Advanced",
    title: "11. Build Heap Time Complexity",
    question: "Why does the initial Build Max Heap phase take O(n) time rather than O(n log n)?",
    array: [16, 4, 10, 14, 7, 9, 3, 2, 8, 1],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Most nodes reside near the bottom of the tree with very small heights (0 or 1), so the sum of (nodes at height h) * h forms a convergent series bounded by O(n)." },
      { id: "B", text: "Because heapify is only called once for the entire array." },
      { id: "C", text: "Because elements are already pre-sorted before heapifying." },
      { id: "D", text: "Building the heap actually takes O(n log n), not O(n)." }
    ],
    correctAnswer: "A",
    hint: "Half of the nodes in a binary tree are leaves at height 0, a quarter are at height 1, and only the root is at height log(n).",
    explanation: "In a binary heap, n/2 nodes are leaves requiring 0 swaps, n/4 nodes are at height 1 requiring at most 1 swap, etc. Summing n/2^(h+1) * h for h = 0 to log(n) yields a mathematically convergent series n * sum(h / 2^h) = O(n)."
  }
];
