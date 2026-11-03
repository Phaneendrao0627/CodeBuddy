/**
 * Curated educational reference content for Selection Sort.
 * Provides complete, idiomatic implementations and line-by-line explanations for C, Java, and Python.
 */

export const selectionSortContent = {
  concept: "Selection Sort is an in-place, comparison-based sorting algorithm. It divides the array into two parts: a sorted prefix on the left (initially empty) and an unsorted suffix on the right. In each pass, it systematically scans the entire unsorted suffix to locate the minimum element, and then swaps it into the first position of that unsorted suffix. This grows the sorted prefix by one element each round until the entire array is sorted.",

  intuition: "Think of arranging people in a line from shortest to tallest. In the first round, you walk the entire line to identify the shortest person and swap them to the front (position 0). In the next round, you ignore the first person (who is already in their permanent spot) and search the remaining people for the next shortest, swapping them into position 1. You repeat this process until everyone is standing in sorted order.",

  real_world_example: "1. Organizing school students by height for a class photo by repeatedly picking the shortest remaining student and placing them next in line.\n2. Sorting exam papers alphabetically by finding the student whose name comes first from the unorganized stack, placing it on the sorted pile, and repeating.\n3. Selecting the cheapest item from a product inventory to place into a clearance rack.\n4. Ranking sports competitors by score when reviewing an unsorted leaderboard.",

  algorithm: [
    "1. Loop variable i from index 0 to n - 2 (representing the index where the minimum should be placed):",
    "   a. Assume the current index is the minimum: set min_idx = i.",
    "   b. Loop variable j from i + 1 to n - 1 (the remaining unsorted elements):",
    "      i. Compare numbers[j] with numbers[min_idx].",
    "      ii. If numbers[j] < numbers[min_idx], update min_idx = j.",
    "   c. If min_idx != i, swap numbers[i] and numbers[min_idx].",
    "2. The sorted prefix has now expanded from [0..i - 1] to [0..i].",
    "3. Repeat until i reaches n - 2. The final element at index n - 1 is automatically in its correct position.",
    "4. The entire array is now sorted in ascending order."
  ],

  pseudocode: `function selectionSort(numbers):
    n = length(numbers)
    for i from 0 to n - 2:
        min_idx = i
        
        // Find the index of the minimum element in unsorted suffix
        for j from i + 1 to n - 1:
            if numbers[j] < numbers[min_idx]:
                min_idx = j
                
        // Swap found minimum into position i
        if min_idx != i:
            swap(numbers[i], numbers[min_idx])`,

  implementations: {
    c: {
      language: "c",
      label: "C",
      code: `#include <stdio.h>

/**
 * Sorts an array of integers in ascending order using Selection Sort.
 * In C, array size must be passed explicitly because array parameters decay to pointers.
 */
void selectionSort(int numbers[], int size) {
    for (int i = 0; i < size - 1; i++) {
        int min_idx = i;

        // Find the minimum element in unsorted subarray [i+1..size-1]
        for (int j = i + 1; j < size; j++) {
            if (numbers[j] < numbers[min_idx]) {
                min_idx = j;
            }
        }

        // Swap the found minimum element with the first element of unsorted subarray
        if (min_idx != i) {
            int temp = numbers[i];
            numbers[i] = numbers[min_idx];
            numbers[min_idx] = temp;
        }
    }
}

int main(void) {
    int numbers[] = {64, 25, 12, 22, 11};
    int size = sizeof(numbers) / sizeof(numbers[0]);

    selectionSort(numbers, size);

    printf("Sorted array: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    return 0;
}`,
      code_explanation: "1. `void selectionSort(int numbers[], int size)` takes an integer array and its explicit length `size`.\n2. The outer loop `for (int i = 0; i < size - 1; i++)` sets the target position for the minimum element.\n3. `int min_idx = i;` initializes the minimum index to the start of the unsorted segment.\n4. The inner loop `for (int j = i + 1; j < size; j++)` scans all remaining elements to find the true minimum.\n5. If `numbers[j] < numbers[min_idx]`, `min_idx = j` captures the new lowest index.\n6. `if (min_idx != i)` avoids redundant self-swaps, swapping `numbers[i]` and `numbers[min_idx]` using a temporary variable `temp`.",
      codeLines: [
        { line: 1, text: "void selectionSort(int numbers[], int size) {" },
        { line: 2, text: "    for (int i = 0; i < size - 1; i++) {" },
        { line: 3, text: "        int min_idx = i;" },
        { line: 4, text: "        for (int j = i + 1; j < size; j++) {" },
        { line: 5, text: "            if (numbers[j] < numbers[min_idx]) {" },
        { line: 6, text: "                min_idx = j;" },
        { line: 7, text: "            }" },
        { line: 8, text: "        }" },
        { line: 9, text: "        if (min_idx != i) {" },
        { line: 10, text: "            int temp = numbers[i]; numbers[i] = numbers[min_idx]; numbers[min_idx] = temp; // Swap" },
        { line: 11, text: "        }" },
        { line: 12, text: "    }" },
        { line: 13, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 13;
        if (step.phase === "pass_complete") return 12;
        if (step.phase === "swap") return 10;
        if (step.phase === "update_min") return 6;
        if (step.phase === "compare") return 5;
        if (step.phase === "start_pass") return 3;
        return 2;
      }
    },

    java: {
      language: "java",
      label: "Java",
      code: `public class SelectionSort {
    /**
     * Sorts an array of integers in ascending order using Selection Sort.
     */
    public static void selectionSort(int[] numbers) {
        int n = numbers.length;

        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;

            // Find the minimum element in unsorted subarray [i+1..n-1]
            for (int j = i + 1; j < n; j++) {
                if (numbers[j] < numbers[minIdx]) {
                    minIdx = j;
                }
            }

            // Swap found minimum with the first unsorted element
            if (minIdx != i) {
                int temp = numbers[i];
                numbers[i] = numbers[minIdx];
                numbers[minIdx] = temp;
            }
        }
    }

    public static void main(String[] args) {
        int[] numbers = {64, 25, 12, 22, 11};
        selectionSort(numbers);

        System.out.print("Sorted array: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}`,
      code_explanation: "1. `public static void selectionSort(int[] numbers)` sorts the integer array in-place.\n2. `int n = numbers.length;` reads the array length property.\n3. The outer loop `i` iterates from `0` to `n - 2`, as the final item will automatically be in place.\n4. `int minIdx = i;` tracks the index of the lowest value found in the current pass.\n5. The inner loop `j` runs from `i + 1` to `n - 1`, comparing `numbers[j] < numbers[minIdx]`.\n6. If a smaller element is found, `minIdx` is updated.\n7. When `minIdx != i`, an in-place swap moves the discovered minimum to index `i`.",
      codeLines: [
        { line: 1, text: "public static void selectionSort(int[] numbers) {" },
        { line: 2, text: "    for (int i = 0; i < numbers.length - 1; i++) {" },
        { line: 3, text: "        int minIdx = i;" },
        { line: 4, text: "        for (int j = i + 1; j < numbers.length; j++) {" },
        { line: 5, text: "            if (numbers[j] < numbers[minIdx]) {" },
        { line: 6, text: "                minIdx = j;" },
        { line: 7, text: "            }" },
        { line: 8, text: "        }" },
        { line: 9, text: "        if (minIdx != i) {" },
        { line: 10, text: "            int temp = numbers[i]; numbers[i] = numbers[minIdx]; numbers[minIdx] = temp; // Swap" },
        { line: 11, text: "        }" },
        { line: 12, text: "    }" },
        { line: 13, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 13;
        if (step.phase === "pass_complete") return 12;
        if (step.phase === "swap") return 10;
        if (step.phase === "update_min") return 6;
        if (step.phase === "compare") return 5;
        if (step.phase === "start_pass") return 3;
        return 2;
      }
    },

    python: {
      language: "python",
      label: "Python",
      code: `def selection_sort(numbers: list[int]) -> None:
    """
    Sorts a list of integers in ascending order using Selection Sort in-place.
    """
    n = len(numbers)

    for i in range(n - 1):
        min_idx = i

        # Find the minimum element in unsorted suffix [i+1..n-1]
        for j in range(i + 1, n):
            if numbers[j] < numbers[min_idx]:
                min_idx = j

        # Swap found minimum with first unsorted element
        if min_idx != i:
            numbers[i], numbers[min_idx] = numbers[min_idx], numbers[i]


if __name__ == "__main__":
    numbers = [64, 25, 12, 22, 11]
    selection_sort(numbers)
    print("Sorted array:", numbers)`,
      code_explanation: "1. `def selection_sort(numbers: list[int]) -> None:` takes a list of integers and sorts it in-place.\n2. `n = len(numbers)` computes list size.\n3. The outer loop `for i in range(n - 1):` controls the position currently being populated.\n4. `min_idx = i` initializes the index of the candidate minimum.\n5. The inner loop `for j in range(i + 1, n):` inspects every subsequent element in the unsorted suffix.\n6. When `numbers[j] < numbers[min_idx]`, `min_idx` is reassigned to `j`.\n7. `numbers[i], numbers[min_idx] = numbers[min_idx], numbers[i]` performs an idiomatic Python simultaneous assignment swap.",
      codeLines: [
        { line: 1, text: "def selection_sort(numbers: list[int]) -> None:" },
        { line: 2, text: "    for i in range(len(numbers) - 1):" },
        { line: 3, text: "        min_idx = i" },
        { line: 4, text: "        for j in range(i + 1, len(numbers)):" },
        { line: 5, text: "            if numbers[j] < numbers[min_idx]:" },
        { line: 6, text: "                min_idx = j" },
        { line: 7, text: "        if min_idx != i:" },
        { line: 8, text: "            numbers[i], numbers[min_idx] = numbers[min_idx], numbers[i]  # Swap" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 8;
        if (step.phase === "pass_complete") return 2;
        if (step.phase === "swap") return 8;
        if (step.phase === "update_min") return 6;
        if (step.phase === "compare") return 5;
        if (step.phase === "start_pass") return 3;
        return 2;
      }
    }
  },

  // Backward-compatible getters for legacy consumers
  get code() {
    return this.implementations.java.code;
  },
  get code_explanation() {
    return this.implementations.java.code_explanation;
  },

  complexity: {
    best: "O(n²)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)"
  },

  properties: {
    stability: "NOT Stable — Standard Selection Sort can alter the relative order of duplicate elements during swaps. For example, in [4a, 4b, 1], swapping 1 with index 0 (4a) yields [1, 4b, 4a], inverting the original order of 4a and 4b.",
    in_place: "In-place — Modifies the original array directly without allocating extra array buffers, requiring only O(1) auxiliary variables (i, j, min_idx, temp)."
  },

  advantages: [
    "Simple, intuitive logic that is very straightforward to understand and code.",
    "Minimum number of swaps: Performs at most n - 1 swaps total (O(n) writes). Highly valuable when writing to memory is far more expensive than reading (e.g. flash memory / EEPROM with limited write cycles).",
    "In-place sorting algorithm: Uses O(1) auxiliary space.",
    "Performs reliably well on very small arrays (n ≤ 30)."
  ],

  disadvantages: [
    "Quadratic O(n²) time complexity in all cases (best, average, and worst). It always inspects all remaining elements even if the array is already sorted.",
    "Not a stable sort: Standard Selection Sort does not preserve the original relative order of duplicate keys.",
    "Poor scalability: Unusable for large datasets compared to O(n log n) algorithms like Merge Sort, Quick Sort, and Heap Sort."
  ],

  common_mistakes: [
    "Starting the inner loop at j = i instead of j = i + 1, resulting in redundant self-comparisons.",
    "Comparing numbers[j] with numbers[i] instead of numbers[min_idx], causing the algorithm to miss smaller elements found earlier in the pass.",
    "Assuming Selection Sort is stable. Swapping across intermediate elements can jump equal keys past each other.",
    "Confusing Selection Sort with Insertion Sort: Selection Sort looks ahead to find the minimum and swaps; Insertion Sort shifts elements to insert the current key into the sorted prefix."
  ],

  practice: "Trace Selection Sort on array [64, 25, 12, 22, 11] and determine the sequence of elements swapped in each pass."
};
