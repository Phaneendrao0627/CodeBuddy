/**
 * Curated educational reference content for Insertion Sort.
 * Provides complete, idiomatic implementations and line-by-line explanations for C, Java, and Python.
 */

export const insertionSortContent = {
  concept: "Insertion Sort is a comparison-based sorting algorithm that builds the final sorted array one element at a time. It divides the array into a sorted prefix and an unsorted suffix. Iterating from left to right, it picks the next element (the 'key') from the unsorted part and shifts greater elements in the sorted prefix to make room, inserting the key into its correct relative position.",

  intuition: "Think of sorting playing cards in your hand. When dealt cards one by one, you hold the cards you already picked up in sorted order. When you pick up a new card (the key), you scan backward through your hand from right to left, sliding larger cards to the right until you find the exact spot where the new card fits, and slip it in.",

  real_world_example: "1. Arranging a hand of playing cards as each card is dealt.\n2. Filing incoming patient physical records alphabetically into a pre-sorted filing cabinet.\n3. Organizing dollar bills in a cash register drawer by denomination.\n4. Updating a live leaderboard where each newly finished runner is inserted into their rank position.",

  algorithm: [
    "1. Consider the element at index 0 as trivially sorted on its own.",
    "2. Iterate variable i from index 1 to n - 1 (the outer loop):",
    "   a. Store the current element in a variable: key = numbers[i].",
    "   b. Initialize j = i - 1 (the rightmost index of the sorted prefix).",
    "   c. While j >= 0 and numbers[j] > key:",
    "      i. Shift numbers[j] one position to the right: numbers[j + 1] = numbers[j].",
    "      ii. Decrement j = j - 1.",
    "   d. Place the key into its correct insertion position: numbers[j + 1] = key.",
    "3. The sorted prefix has now expanded from [0..i - 1] to [0..i].",
    "4. Repeat until i reaches n - 1. The entire array is now sorted in ascending order."
  ],

  pseudocode: `function insertionSort(numbers):
    n = length(numbers)
    for i from 1 to n - 1:
        key = numbers[i]
        j = i - 1
        
        // Shift elements greater than key to the right
        while j >= 0 and numbers[j] > key:
            numbers[j + 1] = numbers[j]
            j = j - 1
            
        // Place key into its sorted slot
        numbers[j + 1] = key`,

  implementations: {
    c: {
      language: "c",
      label: "C",
      code: `#include <stdio.h>

/**
 * Sorts an array of integers in ascending order using Insertion Sort.
 * In C, array size must be passed explicitly because array parameters decay to pointers.
 */
void insertionSort(int numbers[], int size) {
    for (int i = 1; i < size; i++) {
        int key = numbers[i];
        int j = i - 1;

        // Shift elements of numbers[0..i-1] that are greater than key
        // to one position ahead of their current position
        while (j >= 0 && numbers[j] > key) {
            numbers[j + 1] = numbers[j];
            j = j - 1;
        }

        // Insert key at its sorted position
        numbers[j + 1] = key;
    }
}

int main(void) {
    int numbers[] = {8, 4, 1, 5, 9, 2};
    int size = sizeof(numbers) / sizeof(numbers[0]);

    insertionSort(numbers, size);

    printf("Sorted array: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    return 0;
}`,
      code_explanation: "1. `void insertionSort(int numbers[], int size)` accepts an integer array and its explicit size, since C does not store array length metadata.\n2. The outer loop `for (int i = 1; i < size; i++)` advances through unsorted elements starting at index 1.\n3. `int key = numbers[i];` extracts the element to be inserted into the sorted subarray.\n4. `int j = i - 1;` initializes the comparison pointer at the end of the sorted prefix.\n5. `while (j >= 0 && numbers[j] > key)` checks bounds first to prevent negative index memory corruption, then checks if the prefix item is strictly greater than the key.\n6. `numbers[j + 1] = numbers[j]; j = j - 1;` shifts the larger element one slot to the right.\n7. `numbers[j + 1] = key;` inserts the stored key into the vacated slot.",
      codeLines: [
        { line: 1, text: "void insertionSort(int numbers[], int size) {" },
        { line: 2, text: "    for (int i = 1; i < size; i++) {" },
        { line: 3, text: "        int key = numbers[i];" },
        { line: 4, text: "        int j = i - 1;" },
        { line: 5, text: "        while (j >= 0 && numbers[j] > key) {" },
        { line: 6, text: "            numbers[j + 1] = numbers[j]; // Shift right" },
        { line: 7, text: "            j = j - 1;" },
        { line: 8, text: "        }" },
        { line: 9, text: "        numbers[j + 1] = key; // Insert key" },
        { line: 10, text: "    }" },
        { line: 11, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 11;
        if (step.phase === "pass_complete") return 10;
        if (step.phase === "insert") return 9;
        if (step.phase === "shift") return 6;
        if (step.phase === "compare") return 5;
        if (step.phase === "select_key") return 3;
        return 2;
      }
    },

    java: {
      language: "java",
      label: "Java",
      code: `public class InsertionSort {
    /**
     * Sorts an array of integers in ascending order using Insertion Sort.
     */
    public static void insertionSort(int[] numbers) {
        int n = numbers.length;

        for (int i = 1; i < n; i++) {
            int key = numbers[i];
            int j = i - 1;

            // Shift elements of numbers[0..i-1] that are greater than key
            while (j >= 0 && numbers[j] > key) {
                numbers[j + 1] = numbers[j];
                j--;
            }

            // Insert key into its correct relative position
            numbers[j + 1] = key;
        }
    }

    public static void main(String[] args) {
        int[] numbers = {8, 4, 1, 5, 9, 2};
        insertionSort(numbers);

        System.out.print("Sorted array: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}`,
      code_explanation: "1. `public static void insertionSort(int[] numbers)` sorts the provided array in-place.\n2. `int n = numbers.length;` retrieves the element count directly from the array object.\n3. The outer loop starts at `i = 1`, because a single-element prefix `[0..0]` is trivially sorted.\n4. `int key = numbers[i];` stores the current item to be inserted.\n5. The while loop condition `j >= 0 && numbers[j] > key` ensures both boundary safety and strict stability (equal elements will not shift).\n6. `numbers[j + 1] = numbers[j]; j--;` shifts elements rightward.\n7. `numbers[j + 1] = key;` places the key into the correct spot.",
      codeLines: [
        { line: 1, text: "public static void insertionSort(int[] numbers) {" },
        { line: 2, text: "    for (int i = 1; i < numbers.length; i++) {" },
        { line: 3, text: "        int key = numbers[i];" },
        { line: 4, text: "        int j = i - 1;" },
        { line: 5, text: "        while (j >= 0 && numbers[j] > key) {" },
        { line: 6, text: "            numbers[j + 1] = numbers[j]; // Shift right" },
        { line: 7, text: "            j--;" },
        { line: 8, text: "        }" },
        { line: 9, text: "        numbers[j + 1] = key; // Insert key" },
        { line: 10, text: "    }" },
        { line: 11, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 11;
        if (step.phase === "pass_complete") return 10;
        if (step.phase === "insert") return 9;
        if (step.phase === "shift") return 6;
        if (step.phase === "compare") return 5;
        if (step.phase === "select_key") return 3;
        return 2;
      }
    },

    python: {
      language: "python",
      label: "Python",
      code: `def insertion_sort(numbers: list[int]) -> None:
    """
    Sorts a list of integers in ascending order using Insertion Sort in-place.
    """
    n = len(numbers)

    for i in range(1, n):
        key = numbers[i]
        j = i - 1

        # Shift elements of numbers[0..i-1] that are greater than key
        while j >= 0 and numbers[j] > key:
            numbers[j + 1] = numbers[j]
            j -= 1

        # Insert key into its correct position
        numbers[j + 1] = key


if __name__ == "__main__":
    numbers = [8, 4, 1, 5, 9, 2]
    insertion_sort(numbers)
    print("Sorted array:", numbers)`,
      code_explanation: "1. `def insertion_sort(numbers: list[int]) -> None:` takes a mutable integer list and sorts it in-place.\n2. `n = len(numbers)` calculates list length.\n3. `for i in range(1, n):` loops through each unsorted key from index 1 upward.\n4. `key = numbers[i]` saves the element currently being inserted.\n5. `while j >= 0 and numbers[j] > key:` scans backward through the sorted slice, checking index bounds and value.\n6. `numbers[j + 1] = numbers[j]` shifts larger elements rightward.\n7. `numbers[j + 1] = key` places the key into the correct spot.",
      codeLines: [
        { line: 1, text: "def insertion_sort(numbers: list[int]) -> None:" },
        { line: 2, text: "    for i in range(1, len(numbers)):" },
        { line: 3, text: "        key = numbers[i]" },
        { line: 4, text: "        j = i - 1" },
        { line: 5, text: "        while j >= 0 and numbers[j] > key:" },
        { line: 6, text: "            numbers[j + 1] = numbers[j]  # Shift right" },
        { line: 7, text: "            j -= 1" },
        { line: 8, text: "        numbers[j + 1] = key  # Insert key" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 8;
        if (step.phase === "pass_complete") return 2;
        if (step.phase === "insert") return 8;
        if (step.phase === "shift") return 6;
        if (step.phase === "compare") return 5;
        if (step.phase === "select_key") return 3;
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
    best: "O(n)",
    average: "O(n²)",
    worst: "O(n²)",
    space: "O(1)"
  },

  properties: {
    stability: "Stable — equal elements are never swapped past each other because the comparison numbers[j] > key is strict.",
    in_place: "In-place — sorts within the input array requiring only O(1) auxiliary variables (key, i, j)."
  },

  advantages: [
    "Simple, intuitive implementation that is easy to understand and code.",
    "Adaptive: Performs in O(n) linear time on already-sorted or nearly-sorted data.",
    "Stable sorting algorithm: Preserves the original relative order of duplicate elements.",
    "In-place sorting: Requires only O(1) auxiliary memory.",
    "Online algorithm: Can sort a live continuous stream of data as items arrive one by one.",
    "Very fast and low-overhead for small arrays (n ≤ 50); commonly used as the base case in hybrid algorithms like Timsort and Introsort."
  ],

  disadvantages: [
    "Quadratic O(n²) time complexity for average and worst cases makes it inefficient on large datasets compared to O(n log n) algorithms like Merge Sort, Quick Sort, and Heap Sort.",
    "Performs numerous array shift/write operations when inputs are in reverse or highly scrambled order."
  ],

  common_mistakes: [
    "Starting the outer loop at i = 0 instead of i = 1, which causes j = -1 on the first iteration.",
    "Using numbers[j] >= key instead of numbers[j] > key in the while loop, which destroys stability by unnecessarily shifting equal values.",
    "Checking numbers[j] > key before checking j >= 0, causing index out-of-bounds errors in languages like C/C++ or Java.",
    "Overwriting numbers[j + 1] with key before the shift loop completes, which corrupts array data.",
    "Confusing Insertion Sort with Selection Sort: Selection Sort searches the unsorted portion for the minimum and swaps; Insertion Sort shifts elements to insert the current key into the sorted prefix."
  ],

  practice: "Trace Insertion Sort on array [9, 4, 7, 2, 8] and count the number of comparisons and shifts in each pass."
};
