/**
 * Curated educational reference content for Bubble Sort.
 * Provides complete, idiomatic implementations and explanations for C, Java, and Python.
 */
export const bubbleSortContent = {
  concept: "Bubble Sort is a straightforward comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Pass by pass, the largest unsorted elements 'bubble up' to their correct positions at the end of the array.",
  intuition: "Think of carbonated bubbles rising to the top of a glass of soda. Larger bubbles rise faster than smaller ones. In an array, during each pass, the largest remaining value gets compared against its neighbors and swapped step-by-step until it settles at the far right end.",
  real_world_example: "Arranging playing cards in a hand by repeatedly swapping adjacent cards, or organizing student exam papers in ascending order of score by comparing pairs.",
  visualization: "Array: [5, 3, 8, 4, 2]\nPass 1: Compare (5, 3) -> swap -> [3, 5, 8, 4, 2]\n        Compare (5, 8) -> ok   -> [3, 5, 8, 4, 2]\n        Compare (8, 4) -> swap -> [3, 5, 4, 8, 2]\n        Compare (8, 2) -> swap -> [3, 5, 4, 2, 8] (8 is in its final position)\nPass 2: Compare pairs -> [3, 4, 2, 5, 8] (5 is in place)\nPass 3: Compare pairs -> [3, 2, 4, 5, 8] (4 is in place)\nPass 4: Compare pairs -> [2, 3, 4, 5, 8] (Sorted!)",
  algorithm: [
    "1. Loop i from 0 to n - 2 (representing the number of passes).",
    "2. Maintain a boolean flag `swapped = false` to detect if the array is already sorted.",
    "3. Loop j from 0 to n - i - 2 (comparing adjacent pairs in the unsorted prefix).",
    "4. If numbers[j] > numbers[j + 1], swap numbers[j] and numbers[j + 1], and set `swapped = true`.",
    "5. After inner loop completes, if `swapped` is still false, terminate early as the array is fully sorted.",
    "6. Repeat until all passes are completed."
  ],
  pseudocode: `function bubbleSort(numbers):
    n = length(numbers)
    for i from 0 to n - 2:
        swapped = false
        for j from 0 to n - i - 2:
            if numbers[j] > numbers[j + 1]:
                swap(numbers[j], numbers[j + 1])
                swapped = true
        if not swapped:
            break`,

  implementations: {
    c: {
      language: "c",
      label: "C",
      code: `#include <stdbool.h>
#include <stdio.h>

/**
 * Sorts an array of integers in ascending order using Bubble Sort.
 * In C, size must be passed explicitly.
 */
void bubbleSort(int numbers[], int size) {
    for (int i = 0; i < size - 1; i++) {
        bool swapped = false;

        for (int j = 0; j < size - i - 1; j++) {
            if (numbers[j] > numbers[j + 1]) {
                // Swap adjacent elements
                int temp = numbers[j];
                numbers[j] = numbers[j + 1];
                numbers[j + 1] = temp;
                swapped = true;
            }
        }

        // Optimization: stop if no swaps occurred in this pass
        if (!swapped) {
            break;
        }
    }
}

int main(void) {
    int numbers[] = {5, 3, 8, 4, 2};
    int size = sizeof(numbers) / sizeof(numbers[0]);

    bubbleSort(numbers, size);

    printf("Sorted array: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    return 0;
}`,
      code_explanation: "1. The function takes `int numbers[]` and explicit `int size` because C does not track array sizes at runtime.\n2. The outer loop runs `size - 1` times for passes.\n3. `bool swapped = false;` tracks whether any elements were moved during this pass.\n4. The inner loop compares `numbers[j]` and `numbers[j + 1]` up to `size - i - 1`, skipping already sorted suffix elements.\n5. If out of order, elements are swapped using a standard temporary variable `temp`.\n6. If `!swapped` at the end of a pass, the array is already sorted, enabling an early exit in O(n) best-case time.",
      codeLines: [
        { line: 1, text: "for (int i = 0; i < size - 1; i++) {" },
        { line: 2, text: "    for (int j = 0; j < size - i - 1; j++) {" },
        { line: 3, text: "        if (numbers[j] > numbers[j + 1]) {" },
        { line: 4, text: "            int temp = numbers[j];" },
        { line: 5, text: "            numbers[j] = numbers[j + 1];" },
        { line: 6, text: "            numbers[j + 1] = temp; // Swap" },
        { line: 7, text: "        }" },
        { line: 8, text: "    }" },
        { line: 9, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished) return 9;
        if (step.swapped) return 6;
        if (step.comparing) return 3;
        return 1;
      }
    },

    java: {
      language: "java",
      label: "Java",
      code: `public class BubbleSort {
    /**
     * Sorts an array of integers in ascending order using Bubble Sort.
     */
    public static void bubbleSort(int[] numbers) {
        int n = numbers.length;

        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;

            for (int j = 0; j < n - i - 1; j++) {
                if (numbers[j] > numbers[j + 1]) {
                    // Swap adjacent elements
                    int temp = numbers[j];
                    numbers[j] = numbers[j + 1];
                    numbers[j + 1] = temp;
                    swapped = true;
                }
            }

            // Early exit if array is already sorted
            if (!swapped) {
                break;
            }
        }
    }

    public static void main(String[] args) {
        int[] numbers = {5, 3, 8, 4, 2};
        bubbleSort(numbers);

        System.out.print("Sorted array: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}`,
      code_explanation: "1. `n = numbers.length` retrieves the total count of elements.\n2. The outer loop runs up to `n - 1` passes.\n3. The inner loop compares adjacent elements `numbers[j]` and `numbers[j + 1]`.\n4. When `numbers[j] > numbers[j + 1]`, a temporary variable `temp` facilitates the in-place swap.\n5. The boolean `swapped` flag enables early termination if the array becomes sorted before all passes finish.",
      codeLines: [
        { line: 1, text: "for (int i = 0; i < numbers.length - 1; i++) {" },
        { line: 2, text: "    for (int j = 0; j < numbers.length - i - 1; j++) {" },
        { line: 3, text: "        if (numbers[j] > numbers[j + 1]) {" },
        { line: 4, text: "            int temp = numbers[j];" },
        { line: 5, text: "            numbers[j] = numbers[j + 1];" },
        { line: 6, text: "            numbers[j + 1] = temp; // Swap" },
        { line: 7, text: "        }" },
        { line: 8, text: "    }" },
        { line: 9, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished) return 9;
        if (step.swapped) return 6;
        if (step.comparing) return 3;
        return 1;
      }
    },

    python: {
      language: "python",
      label: "Python",
      code: `def bubble_sort(numbers: list[int]) -> None:
    """
    Sorts a list of integers in ascending order using Bubble Sort in-place.
    """
    n = len(numbers)

    for i in range(n - 1):
        swapped = False

        for j in range(n - i - 1):
            if numbers[j] > numbers[j + 1]:
                # Idiomatic Python simultaneous assignment swap
                numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]
                swapped = True

        if not swapped:
            break  # Array is already sorted


if __name__ == "__main__":
    numbers = [5, 3, 8, 4, 2]
    bubble_sort(numbers)
    print("Sorted array:", numbers)`,
      code_explanation: "1. `n = len(numbers)` computes the length of the list.\n2. The outer loop `for i in range(n - 1):` controls the pass count.\n3. The inner loop `for j in range(n - i - 1):` iterates across remaining unsorted adjacent pairs.\n4. If `numbers[j] > numbers[j + 1]`, Python's idiomatic tuple unpacking `numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]` swaps them in a single expressive line without temporary variables.\n5. If `not swapped`, the list is sorted and the algorithm terminates immediately.",
      codeLines: [
        { line: 1, text: "n = len(numbers)" },
        { line: 2, text: "for i in range(n - 1):" },
        { line: 3, text: "    for j in range(n - i - 1):" },
        { line: 4, text: "        if numbers[j] > numbers[j + 1]:" },
        { line: 5, text: "            numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]  # Swap" },
        { line: 6, text: "    if not swapped: break" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished) return 6;
        if (step.swapped) return 5;
        if (step.comparing) return 4;
        return 2;
      }
    }
  },

  // Backward-compatible defaults (pointing to Java)
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
  common_mistakes: [
    "Not including the `swapped` optimization flag, which forces O(n²) comparisons even on an already-sorted array.",
    "Iterating the inner loop all the way to `n - 2` on every pass instead of `n - i - 2`, re-checking already sorted elements.",
    "Off-by-one errors comparing `numbers[j]` and `numbers[j + 1]` where `j + 1` exceeds array bounds.",
    "Using `<` instead of `>` for ascending sort comparison."
  ],
  practice: "Trace Bubble Sort on array [4, 3, 2, 1] and calculate the total number of swaps required to sort it."
};
