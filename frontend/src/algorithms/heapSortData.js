/**
 * Curated educational reference content for Heap Sort.
 * Follows strict pedagogical order:
 * 1. Intuition
 * 2. Real-world example
 * 3. Visual walkthrough
 * 4. Core concepts (Max Heap, root, parent, children, array representation)
 * 5. Algorithm steps
 * 6. Pseudocode
 * 7. C, Java, and Python implementations
 * 8. Line-by-line code explanation
 * 9. Time and space complexity
 * 10. Advantages, disadvantages, and edge cases
 * 11. Practice questions and viva questions
 */

export const heapSortContent = {
  concept: "Heap Sort is an efficient, comparison-based, in-place sorting algorithm that uses a Binary Heap data structure. It first transforms the unsorted array into a Max Heap so the largest number is always at the root. Then, it repeatedly moves the maximum number to the end of the array, shrinks the active heap, and restores the heap property until every number is in sorted order.",

  prerequisites: "Basic knowledge of arrays, binary trees, recursion or loops, and zero-based array indexing.",

  // 1. Intuition
  intuition: "Think of Heap Sort like running a tournament where the prize goes to the champion one by one. First, you organize all players into a pyramid where every parent is stronger than their children (a Max Heap). The ultimate champion naturally sits at the very top (the root). You take that champion, award them the 1st place spot at the end of the lineup, and bring in the next contender to the top. You quickly reshuffle just that branch so the new leader emerges at the top, and repeat! Because the heap keeps the next biggest item ready in logarithmic time, you get a sorted lineup without checking every pair from scratch.",

  // 2. Real-world example
  real_world_example: "1. Hospital Emergency Room Triage: Patients are placed in a priority line where the most critical patient is always treated next (the root). Once that patient is admitted, the triage board reorganizes so the next most urgent case moves to the top.\n2. Sports Championship Podium: In an elimination bracket, the best athlete rises to the top to claim gold. Once gold is awarded, the remaining finalists compete for silver and bronze.\n3. Operating System Process Scheduler: Priority queues in OS kernels use heaps to pick the highest-priority task to run on the CPU next.\n4. Moving Top Sellers to the Front: An e-commerce dashboard showing the top-ranked products in real time.",

  // 3. Visual walkthrough
  visualization: "Given array: [4, 10, 3, 5, 1]\n\nStep 1 (Build Max Heap):\n- View array as a complete binary tree: 4 is root; 10, 3 are its children; 5, 1 are children of 10.\n- Non-leaf nodes start at index 1 (value 10). Node 10 is greater than children 5 and 1 -> OK.\n- Check root at index 0 (value 4). Children are 10 and 3. Largest child is 10.\n- Swap 4 with 10. Now array is [10, 4, 3, 5, 1].\n- Fix affected subtree at index 1: 4 is smaller than left child 5. Swap 4 and 5.\n- Max Heap complete: [10, 5, 3, 4, 1]. Notice root 10 is the maximum element!\n\nStep 2 (Extract Max & Sort):\n- Swap root (10) with last item (1) -> [1, 5, 3, 4 | 10]. 10 is now permanently sorted at the end!\n- Heapify root (1) in reduced heap of size 4: 1 swaps with larger child 5 -> [5, 4, 3, 1 | 10].\n- Swap root (5) with last item (1) -> [1, 4, 3 | 5, 10]. 5 is now permanently sorted!\n- Heapify root (1) in reduced heap of size 3: 1 swaps with 4 -> [4, 1, 3 | 5, 10].\n- Swap root (4) with last item (3) -> [3, 1 | 4, 5, 10]. 4 is now permanently sorted!\n- Heapify root (3) in reduced heap of size 2: 3 is greater than 1 -> OK.\n- Swap root (3) with last item (1) -> [1 | 3, 4, 5, 10].\n- Result: [1, 3, 4, 5, 10] is fully sorted in ascending order!",

  visual_walkthrough: "Given array: [4, 10, 3, 5, 1]\n\nStep 1 (Build Max Heap):\n- View array as a complete binary tree: 4 is root; 10, 3 are its children; 5, 1 are children of 10.\n- Non-leaf nodes start at index 1 (value 10). Node 10 is greater than children 5 and 1 -> OK.\n- Check root at index 0 (value 4). Children are 10 and 3. Largest child is 10.\n- Swap 4 with 10. Now array is [10, 4, 3, 5, 1].\n- Fix affected subtree at index 1: 4 is smaller than left child 5. Swap 4 and 5.\n- Max Heap complete: [10, 5, 3, 4, 1]. Notice root 10 is the maximum element!\n\nStep 2 (Extract Max & Sort):\n- Swap root (10) with last item (1) -> [1, 5, 3, 4 | 10]. 10 is now permanently sorted at the end!\n- Heapify root (1) in reduced heap of size 4: 1 swaps with larger child 5 -> [5, 4, 3, 1 | 10].\n- Swap root (5) with last item (1) -> [1, 4, 3 | 5, 10]. 5 is now permanently sorted!\n- Heapify root (1) in reduced heap of size 3: 1 swaps with 4 -> [4, 1, 3 | 5, 10].\n- Swap root (4) with last item (3) -> [3, 1 | 4, 5, 10]. 4 is now permanently sorted!\n- Heapify root (3) in reduced heap of size 2: 3 is greater than 1 -> OK.\n- Swap root (3) with last item (1) -> [1 | 3, 4, 5, 10].\n- Result: [1, 3, 4, 5, 10] is fully sorted in ascending order!",

  // 4. Core concepts
  core_concepts: [
    "Complete Binary Tree: A binary tree where all levels are completely filled except possibly the last level, which is filled from left to right. This structure allows us to store the tree in a standard 1D array without pointers.",
    "Array Representation Formulas (0-based indexing): For any element stored at index i:",
    "  • Parent Index: floor((i - 1) / 2)",
    "  • Left Child Index: 2 * i + 1",
    "  • Right Child Index: 2 * i + 2",
    "Max Heap Property: In a Max Heap, for every node i other than the root, the value of the node is less than or equal to the value of its parent: numbers[parent] >= numbers[i]. Therefore, the maximum element is always at the root (index 0).",
    "Heapify (Sift Down): An operation that takes a node that may violate the heap property and pushes it downward by repeatedly swapping it with its largest child until the heap property is satisfied.",
    "Last Non-Leaf Node: In an array of size n, all leaf nodes reside from index floor(n / 2) to n - 1. The last non-leaf node is at index floor(n / 2) - 1."
  ],

  // 5. Algorithm steps
  algorithm: [
    "1. Base Check: If the array has 0 or 1 element, it is already sorted. Return immediately.",
    "2. Build Max Heap: Start from the last non-leaf node at index (size / 2 - 1) and work backwards to index 0. For each node, call heapify() to push smaller numbers down so the largest numbers rise to the top.",
    "3. Extract and Swap: Loop from the end of the array (index size - 1) down to index 1:",
    "   a. Swap numbers[0] (the maximum number in the active heap) with numbers[i] (the current end of the active heap).",
    "   b. Now numbers[i] is permanently in its sorted position.",
    "   c. Reduce the active heap size by 1.",
    "   d. Call heapify(numbers, i, 0) on the new root to restore the Max Heap property for the remaining items.",
    "4. Finalization: Once the loop reaches index 1, the single remaining element at index 0 is already the smallest element, and the entire array is sorted in ascending order."
  ],

  // 6. Pseudocode
  pseudocode: `function heapSort(numbers):
    size = length of numbers

    // Step 1: Build initial max heap
    for i from (size / 2 - 1) down to 0:
        heapify(numbers, size, i)

    // Step 2: One by one extract the maximum element
    for i from (size - 1) down to 1:
        // Move current largest number to the end
        swap(numbers[0], numbers[i])

        // Restore max heap on reduced heap of size i
        heapify(numbers, i, 0)

function heapify(numbers, heap_size, root_index):
    largest = root_index
    left = 2 * root_index + 1
    right = 2 * root_index + 2

    // Check if left child is larger than root
    if left < heap_size and numbers[left] > numbers[largest]:
        largest = left

    // Check if right child is larger than current largest
    if right < heap_size and numbers[right] > numbers[largest]:
        largest = right

    // If largest is not the root, swap and fix lower branch
    if largest != root_index:
        swap(numbers[root_index], numbers[largest])
        heapify(numbers, heap_size, largest)`,

  // 7. C, Java, and Python implementations
  implementations: {
    c: {
      language: "c",
      label: "C",
      code: `#include <stdio.h>

// Swap two numbers using pointers
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

// Ensure the subtree rooted at index i satisfies the max heap property
void heapify(int numbers[], int heap_size, int root_index) {
    int largest = root_index;          // Start by assuming the root is the largest
    int left = 2 * root_index + 1;      // Position of left child
    int right = 2 * root_index + 2;     // Position of right child

    // Check if the left child is larger than the current largest
    if (left < heap_size && numbers[left] > numbers[largest]) {
        largest = left;
    }

    // Check if the right child is larger than the current largest
    if (right < heap_size && numbers[right] > numbers[largest]) {
        largest = right;
    }

    // If the largest is not the root, swap and continue fixing the heap
    if (largest != root_index) {
        swap(&numbers[root_index], &numbers[largest]);
        // Recursively fix the affected sub-heap
        heapify(numbers, heap_size, largest);
    }
}

// Main function to sort an array using Heap Sort
void heap_sort(int numbers[], int size) {
    // Step 1: Build the max heap from the unsorted array
    for (int i = size / 2 - 1; i >= 0; i--) {
        heapify(numbers, size, i);
    }

    // Step 2: One by one, extract the largest element and move it to the end
    for (int i = size - 1; i > 0; i--) {
        // Move the current largest number (at root) to the end of the array
        swap(&numbers[0], &numbers[i]);

        // Fix the reduced heap for the remaining elements
        heapify(numbers, i, 0);
    }
}

// Backward-compatible camelCase wrapper
void heapSort(int numbers[], int size) {
    heap_sort(numbers, size);
}

int main(void) {
    int numbers[] = {38, 27, 43, 3, 9, 82, 10};
    int size = sizeof(numbers) / sizeof(numbers[0]);

    heap_sort(numbers, size);

    printf("Sorted array: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    return 0;
}`,
      code_explanation: "1. `swap(int *a, int *b)`: Exchanging values using pointers without allocating extra memory.\n2. `heapify(numbers, heap_size, root_index)`: Compares the parent node with its left child (`2*i+1`) and right child (`2*i+2`).\n3. If a child has a larger value than the parent, `largest` is updated to that child's index.\n4. `if (largest != root_index)`: Swaps the parent with the larger child and recursively calls `heapify` down that branch to ensure the max heap property is maintained.\n5. `heap_sort(numbers, size)`: First builds the Max Heap by calling `heapify` from `size / 2 - 1` down to 0.\n6. The second loop swaps the root (`numbers[0]`, the largest element) with `numbers[i]` at the end of the active heap, locking it into place.\n7. `heapify(numbers, i, 0)` is called on the remaining `i` elements to bring the next largest number to index 0.",
      codeLines: [
        { line: 1, text: "void heapify(int numbers[], int heap_size, int root_index) {" },
        { line: 2, text: "    int largest = root_index;" },
        { line: 3, text: "    int left = 2 * root_index + 1, right = 2 * root_index + 2;" },
        { line: 4, text: "    if (left < heap_size && numbers[left] > numbers[largest]) largest = left;" },
        { line: 5, text: "    if (right < heap_size && numbers[right] > numbers[largest]) largest = right;" },
        { line: 6, text: "    if (largest != root_index) {" },
        { line: 7, text: "        swap(&numbers[root_index], &numbers[largest]); // Swap parent with larger child" },
        { line: 8, text: "        heapify(numbers, heap_size, largest); // Recursively fix affected branch" },
        { line: 9, text: "    }" },
        { line: 10, text: "}" },
        { line: 11, text: "void heap_sort(int numbers[], int size) {" },
        { line: 12, text: "    for (int i = size / 2 - 1; i >= 0; i--) {" },
        { line: 13, text: "        heapify(numbers, size, i); // Step 1: Build initial max heap" },
        { line: 14, text: "    }" },
        { line: 15, text: "    for (int i = size - 1; i > 0; i--) {" },
        { line: 16, text: "        swap(&numbers[0], &numbers[i]); // Move largest number to the end" },
        { line: 17, text: "        heapify(numbers, i, 0); // Step 2: Fix reduced heap" },
        { line: 18, text: "    }" },
        { line: 19, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 19;
        if (step.phase === "build_heap_start") return 12;
        if (step.phase === "heapify_compare") return 4;
        if (step.phase === "heapify_swap") return 7;
        if (step.phase === "build_heap_complete") return 14;
        if (step.phase === "extract_max") return 16;
        if (step.phase === "element_sorted") return 16;
        if (step.phase === "heapify_down_compare") return 4;
        if (step.phase === "heapify_down_swap") return 7;
        return 11;
      }
    },

    java: {
      language: "java",
      label: "Java",
      code: `public class HeapSort {
    // Swap two elements in the array
    private static void swap(int[] numbers, int i, int j) {
        int temp = numbers[i];
        numbers[i] = numbers[j];
        numbers[j] = temp;
    }

    // Fix the heap so the largest element is at the root
    public static void heapify(int[] numbers, int heapSize, int rootIndex) {
        int largest = rootIndex;          // Start with the root as largest
        int left = 2 * rootIndex + 1;      // Left child index
        int right = 2 * rootIndex + 2;     // Right child index

        // Compare left child with the current largest
        if (left < heapSize && numbers[left] > numbers[largest]) {
            largest = left;
        }

        // Compare right child with the current largest
        if (right < heapSize && numbers[right] > numbers[largest]) {
            largest = right;
        }

        // If the largest is not the root, swap and fix the lower branch
        if (largest != rootIndex) {
            swap(numbers, rootIndex, largest);
            heapify(numbers, heapSize, largest);
        }
    }

    // Main sort method
    public static void heapSort(int[] numbers) {
        int size = numbers.length;

        // Step 1: Build the initial max heap
        for (int i = size / 2 - 1; i >= 0; i--) {
            heapify(numbers, size, i);
        }

        // Step 2: Move the largest number to the end and fix the heap
        for (int i = size - 1; i > 0; i--) {
            swap(numbers, 0, i);           // Move maximum to sorted section
            heapify(numbers, i, 0);        // Restore heap property for remaining items
        }
    }

    public static void main(String[] args) {
        int[] numbers = {38, 27, 43, 3, 9, 82, 10};
        heapSort(numbers);

        System.out.print("Sorted array: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}`,
      code_explanation: "1. `heapify(int[] numbers, int heapSize, int rootIndex)`: Identifies the largest value among parent, left child (`2*root+1`), and right child (`2*root+2`).\n2. If a child has a higher value, `largest` is assigned to that child's index.\n3. `swap(numbers, rootIndex, largest)`: Exchanges the parent with the larger child, followed by a recursive call to fix lower descendants.\n4. `heapSort(int[] numbers)`: First loop constructs the Max Heap by processing nodes from `size / 2 - 1` down to 0.\n5. Second loop iteratively extracts the root (`numbers[0]`) to slot `i`, and calls `heapify` on root with the remaining `i` elements.",
      codeLines: [
        { line: 1, text: "public static void heapify(int[] numbers, int heapSize, int rootIndex) {" },
        { line: 2, text: "    int largest = rootIndex;" },
        { line: 3, text: "    int left = 2 * rootIndex + 1, right = 2 * rootIndex + 2;" },
        { line: 4, text: "    if (left < heapSize && numbers[left] > numbers[largest]) largest = left;" },
        { line: 5, text: "    if (right < heapSize && numbers[right] > numbers[largest]) largest = right;" },
        { line: 6, text: "    if (largest != rootIndex) {" },
        { line: 7, text: "        swap(numbers, rootIndex, largest); // Swap parent with larger child" },
        { line: 8, text: "        heapify(numbers, heapSize, largest); // Recursively fix affected branch" },
        { line: 9, text: "    }" },
        { line: 10, text: "}" },
        { line: 11, text: "public static void heapSort(int[] numbers) {" },
        { line: 12, text: "    for (int i = numbers.length / 2 - 1; i >= 0; i--) {" },
        { line: 13, text: "        heapify(numbers, numbers.length, i); // Step 1: Build initial max heap" },
        { line: 14, text: "    }" },
        { line: 15, text: "    for (int i = numbers.length - 1; i > 0; i--) {" },
        { line: 16, text: "        swap(numbers, 0, i); // Move largest number to the end" },
        { line: 17, text: "        heapify(numbers, i, 0); // Step 2: Fix reduced heap" },
        { line: 18, text: "    }" },
        { line: 19, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 19;
        if (step.phase === "build_heap_start") return 12;
        if (step.phase === "heapify_compare") return 4;
        if (step.phase === "heapify_swap") return 7;
        if (step.phase === "build_heap_complete") return 14;
        if (step.phase === "extract_max") return 16;
        if (step.phase === "element_sorted") return 16;
        if (step.phase === "heapify_down_compare") return 4;
        if (step.phase === "heapify_down_swap") return 7;
        return 11;
      }
    },

    python: {
      language: "python",
      label: "Python",
      code: `def heapify(numbers: list[int], heap_size: int, root_index: int) -> None:
    """
    Ensures the subtree rooted at root_index satisfies the max heap property.
    """
    largest = root_index           # Assume root is the largest initially
    left = 2 * root_index + 1       # Left child index
    right = 2 * root_index + 2      # Right child index

    # Check if left child is larger than root
    if left < heap_size and numbers[left] > numbers[largest]:
        largest = left

    # Check if right child is larger than current largest
    if right < heap_size and numbers[right] > numbers[largest]:
        largest = right

    # If largest is not the root, swap and continue fixing the heap
    if largest != root_index:
        numbers[root_index], numbers[largest] = numbers[largest], numbers[root_index]
        heapify(numbers, heap_size, largest)


def heap_sort(numbers: list[int]) -> None:
    """
    Sorts a list of numbers in ascending order using Heap Sort.
    """
    size = len(numbers)

    # Step 1: Build max heap from the unsorted list
    for i in range(size // 2 - 1, -1, -1):
        heapify(numbers, size, i)

    # Step 2: Move the largest number to the end and fix the heap
    for i in range(size - 1, 0, -1):
        numbers[0], numbers[i] = numbers[i], numbers[0]  # Swap root with end
        heapify(numbers, i, 0)                           # Restore max heap


if __name__ == "__main__":
    numbers = [38, 27, 43, 3, 9, 82, 10]
    heap_sort(numbers)
    print("Sorted array:", numbers)`,
      code_explanation: "1. `heapify(numbers, heap_size, root_index)`: Calculates child indices `2*root+1` and `2*root+2`.\n2. Determines the index holding the maximum element among parent and available children.\n3. Swaps `numbers[root_index]` with `numbers[largest]` if a child is greater, then recurses into the modified branch.\n4. `heap_sort(numbers)`: Iterates backward with `range(size // 2 - 1, -1, -1)` to build the Max Heap in O(n) time.\n5. The second loop swaps the maximum item `numbers[0]` to `numbers[i]` and calls `heapify` on the remaining `i` elements.",
      codeLines: [
        { line: 1, text: "def heapify(numbers: list[int], heap_size: int, root_index: int) -> None:" },
        { line: 2, text: "    largest = root_index" },
        { line: 3, text: "    left = 2 * root_index + 1; right = 2 * root_index + 2" },
        { line: 4, text: "    if left < heap_size and numbers[left] > numbers[largest]: largest = left" },
        { line: 5, text: "    if right < heap_size and numbers[right] > numbers[largest]: largest = right" },
        { line: 6, text: "    if largest != root_index:" },
        { line: 7, text: "        numbers[root_index], numbers[largest] = numbers[largest], numbers[root_index] # Swap" },
        { line: 8, text: "        heapify(numbers, heap_size, largest) # Fix lower branch" },
        { line: 9, text: "def heap_sort(numbers: list[int]) -> None:" },
        { line: 10, text: "    size = len(numbers)" },
        { line: 11, text: "    for i in range(size // 2 - 1, -1, -1):" },
        { line: 12, text: "        heapify(numbers, size, i)  # Step 1: Build max heap" },
        { line: 13, text: "    for i in range(size - 1, 0, -1):" },
        { line: 14, text: "        numbers[0], numbers[i] = numbers[i], numbers[0]  # Move largest number to the end" },
        { line: 15, text: "        heapify(numbers, i, 0)  # Step 2: Fix reduced heap" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 15;
        if (step.phase === "build_heap_start") return 11;
        if (step.phase === "heapify_compare") return 4;
        if (step.phase === "heapify_swap") return 7;
        if (step.phase === "build_heap_complete") return 12;
        if (step.phase === "extract_max") return 14;
        if (step.phase === "element_sorted") return 14;
        if (step.phase === "heapify_down_compare") return 4;
        if (step.phase === "heapify_down_swap") return 7;
        return 9;
      }
    }
  },

  // Backward-compatible getters
  get code() {
    return this.implementations.java.code;
  },
  get code_explanation() {
    return this.implementations.java.code_explanation;
  },

  // 9. Time and space complexity
  complexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n log n)",
    space: "O(1)"
  },

  complexity_explanation: {
    time: "Best Case O(n log n): Even when the array is already sorted, building the heap takes O(n) and extracting all n elements takes (n - 1) × O(log n) = O(n log n) operations.\n\nAverage Case O(n log n): On arbitrary inputs, building the heap is O(n), and each extraction takes O(log n) sift-down steps, totaling O(n log n).\n\nWorst Case O(n log n): Unlike Quick Sort which degrades to O(n²) on worst-case inputs, Heap Sort is strictly bounded by O(n log n) in all cases because the binary heap height never exceeds floor(log₂ n).",
    space: "O(1) auxiliary space: Heap Sort sorts in-place directly within the input array using parent-child math, without allocating additional array buffers (unlike Merge Sort's O(n) space). Iterative heapify uses O(1) stack frames, while standard recursive heapify uses O(log n) call stack space."
  },

  properties: {
    stability: "Not Stable — Swapping the root with the last element of the heap can change the original relative order of duplicate elements.",
    in_place: "In-Place — Rearranges numbers directly within the existing array without allocating extra auxiliary buffers."
  },

  // 10. Advantages, disadvantages, and edge cases
  advantages: [
    "Guaranteed O(n log n) time: Runs in O(n log n) worst-case time, completely avoiding Quick Sort's O(n²) worst-case degradation.",
    "In-place sorting: Requires only O(1) auxiliary space, making it much more memory-efficient than Merge Sort.",
    "Excellent for real-time systems: Predictable performance without risk of pathological worst-case slowdowns."
  ],

  disadvantages: [
    "Not stable: Relative order of duplicate elements is not preserved.",
    "Lower cache locality: Because parent and child elements are separated by large index jumps (2*i + 1, 2*i + 2), it exhibits more CPU cache misses than Quick Sort on modern architectures.",
    "Higher constant factor: Slightly slower in practice than a well-tuned Quick Sort on average random data."
  ],

  edge_cases: [
    "Already sorted array: Requires full O(n log n) time because building the heap reverses partial order and extractions still run.",
    "Reverse sorted array: An already reverse-sorted array is very close to a Max Heap, so building the heap is fast, but sorting still takes O(n log n).",
    "All identical elements: Runs efficiently without errors, satisfying the max heap condition at every step.",
    "Single element array [42]: Handled immediately without comparisons or swaps.",
    "Negative numbers and zeros: Handled correctly through standard numerical comparison."
  ],

  // 11. Practice questions and viva questions
  practice: "Trace Heap Sort on [38, 27, 43, 3, 9, 82, 10]: first write out the initial array as a binary tree, show the Max Heap after Phase 1, and trace the first two extractions.",

  viva_questions: [
    {
      question: "Why is Heap Sort not a stable sort?",
      answer: "During extraction, the root element is swapped with the last element in the active heap across long index distances. If duplicate values exist, their relative order is often flipped during these long-range swaps."
    },
    {
      question: "Why does building a Max Heap take O(n) time instead of O(n log n)?",
      answer: "Nodes near the bottom of the tree (leaves and near-leaves) have very short sift-down paths (height 0 or 1), while only the root has height log(n). Summing (nodes at height h) × h across all levels yields a convergent mathematical series that evaluates to O(n)."
    },
    {
      question: "How does Heap Sort compare to Quick Sort and Merge Sort?",
      answer: "Quick Sort is faster in practice due to cache locality but has O(n²) worst-case time. Merge Sort guarantees O(n log n) and is stable, but requires O(n) extra memory. Heap Sort guarantees O(n log n) in-place with O(1) auxiliary memory, combining Quick Sort's space efficiency with Merge Sort's time guarantee."
    },
    {
      question: "How are parent and child indices calculated in a 0-based array?",
      answer: "For node at index i: Parent = floor((i - 1) / 2), Left Child = 2 * i + 1, Right Child = 2 * i + 2."
    },
    {
      question: "What is the difference between Max Heap and Min Heap?",
      answer: "In a Max Heap, every parent is greater than or equal to its children (root is maximum). In a Min Heap, every parent is less than or equal to its children (root is minimum). Heap Sort for ascending order uses a Max Heap."
    }
  ]
};
