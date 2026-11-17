/**
 * Curated educational reference content for Quick Sort.
 * Provides complete, idiomatic implementations and line-by-line explanations for C, Java, and Python.
 */

export const quickSortContent = {
  concept: "Quick Sort is a highly efficient, comparison-based, in-place sorting algorithm that follows the Divide and Conquer algorithmic paradigm. It selects a benchmark element called the 'pivot', partitions the array so that all elements smaller than or equal to the pivot move to its left and all elements greater move to its right, and then recursively applies the same procedure to the resulting subarrays until the entire collection is sorted.",

  prerequisites: "Understanding recursion, array indexing, and two-pointer traversal techniques.",

  intuition: "Imagine organizing a crowd of students by height for a class photo. You pick one student to serve as the benchmark (the pivot). You ask everyone shorter than or the same height as the benchmark to step to the left, and everyone taller to step to the right. The benchmark student is now standing in their exact final position in the lineup! You don't need to re-check them; you simply repeat the same process independently for the group on the left and the group on the right.",

  real_world_example: "1. Organizing physical files: Picking a reference date or letter (pivot) and splitting paperwork into 'before' and 'after' piles before sorting each pile individually.\n2. Library book classification: Dividing books into sections based on a midpoint Dewey Decimal category.\n3. Standard library sorting: Languages like C (qsort) and C++ (std::sort, via introsort) employ Quick Sort variants for general-purpose in-memory sorting due to cache locality and speed.\n4. Sports tournaments: Seeded playoff brackets partitioning competitors into upper and lower flights around a benchmark cutoff.",

  algorithm: [
    "1. Base Case: If the subarray has 1 or 0 elements (low >= high), it is already sorted. Return immediately.",
    "2. Choose a Pivot: Select a reference element from the subarray. In the Lomuto partition scheme, the last element numbers[high] is chosen as the pivot.",
    "3. Lomuto Partitioning Step:",
    "   a. Initialize a boundary pointer i = low - 1. The pointer i tracks the end of the partition containing elements <= pivot.",
    "   b. Scan with pointer j from low to high - 1.",
    "   c. For each element, compare numbers[j] with pivot.",
    "   d. If numbers[j] <= pivot, expand the boundary (i = i + 1) and swap numbers[i] with numbers[j].",
    "   e. If numbers[j] > pivot, simply continue scanning (j advances).",
    "4. Place the Pivot in Final Position:",
    "   a. Swap numbers[i + 1] with numbers[high] (the pivot).",
    "   b. The pivot is now at index pi = i + 1, with all elements to its left <= pivot and all elements to its right >= pivot.",
    "5. Divide & Conquer (Recursive Calls):",
    "   a. Recursively sort the left partition: quickSort(numbers, low, pi - 1).",
    "   b. Recursively sort the right partition: quickSort(numbers, pi + 1, high).",
    "6. Completion: Once all recursive calls unwind, the entire array is fully sorted."
  ],

  pseudocode: `function quickSort(numbers, low, high):
    if low < high:
        // Partition array and get pivot's final index
        pi = partition(numbers, low, high)

        // Recursively sort elements before and after pivot
        quickSort(numbers, low, pi - 1)
        quickSort(numbers, pi + 1, high)

function partition(numbers, low, high):
    pivot = numbers[high] // Lomuto scheme selects last element
    i = low - 1           // Boundary of elements <= pivot

    for j from low to high - 1:
        if numbers[j] <= pivot:
            i = i + 1
            swap(numbers[i], numbers[j])

    // Place pivot into its correct sorted position
    swap(numbers[i + 1], numbers[high])
    return i + 1`,

  implementations: {
    c: {
      language: "c",
      label: "C",
      code: `#include <stdio.h>

/**
 * Helper function to swap two integers via pointers.
 */
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

/**
 * Lomuto partition scheme with last element as pivot.
 * Rearranges numbers[low..high] so elements <= pivot are on the left,
 * and elements > pivot are on the right. Returns final pivot index.
 */
int partition(int numbers[], int low, int high) {
    int pivot = numbers[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (numbers[j] <= pivot) {
            i++;
            swap(&numbers[i], &numbers[j]);
        }
    }
    swap(&numbers[i + 1], &numbers[high]);
    return i + 1;
}

/**
 * Recursive Quick Sort function.
 * Divides array around pivot index returned by partition.
 */
void quick_sort(int numbers[], int low, int high) {
    if (low < high) {
        int pi = partition(numbers, low, high);
        quick_sort(numbers, low, pi - 1);
        quick_sort(numbers, pi + 1, high);
    }
}

/**
 * Backward-compatible wrapper with explicit array size.
 */
void quickSort(int numbers[], int size) {
    if (size > 1) {
        quick_sort(numbers, 0, size - 1);
    }
}

int main(void) {
    int numbers[] = {38, 27, 43, 3, 9, 82, 10};
    int size = sizeof(numbers) / sizeof(numbers[0]);

    quickSort(numbers, size);

    printf("Sorted array: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    return 0;
}`,
      code_explanation: "1. `void swap(int *a, int *b)`: Swaps two integer values using pointer dereferencing.\n2. `int partition(int numbers[], int low, int high)`: Chooses `numbers[high]` as pivot and initializes partition boundary `i = low - 1`.\n3. Lomuto loop: `j` scans from `low` to `high - 1`. Whenever `numbers[j] <= pivot`, boundary `i` increments and `numbers[i]` is swapped with `numbers[j]`.\n4. Pivot placement: `swap(&numbers[i + 1], &numbers[high])` places the pivot in its finalized position and returns index `i + 1`.\n5. `void quick_sort(...)`: Evaluates base case `low < high`, partitions the segment, and recurses on `[low..pi - 1]` and `[pi + 1..high]`.\n6. `void quickSort(numbers, size)`: Public wrapper accepting explicit array size to handle C array decay safely.",
      codeLines: [
        { line: 1, text: "void quick_sort(int numbers[], int low, int high) {" },
        { line: 2, text: "    if (low >= high) return; // Base case: 0 or 1 element" },
        { line: 3, text: "    int pi = partition(numbers, low, high);" },
        { line: 4, text: "    quick_sort(numbers, low, pi - 1);" },
        { line: 5, text: "    quick_sort(numbers, pi + 1, high);" },
        { line: 6, text: "}" },
        { line: 7, text: "int partition(int numbers[], int low, int high) {" },
        { line: 8, text: "    int pivot = numbers[high];" },
        { line: 9, text: "    int i = low - 1;" },
        { line: 10, text: "    for (int j = low; j < high; j++) {" },
        { line: 11, text: "        if (numbers[j] <= pivot) {" },
        { line: 12, text: "            i++;" },
        { line: 13, text: "            swap(&numbers[i], &numbers[j]);" },
        { line: 14, text: "        }" },
        { line: 15, text: "    }" },
        { line: 16, text: "    swap(&numbers[i + 1], &numbers[high]);" },
        { line: 17, text: "    return i + 1;" },
        { line: 18, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 6;
        if (step.phase === "base_case") return 2;
        if (step.phase === "pivot_selected") return 8;
        if (step.phase === "compare") return 11;
        if (step.phase === "swap") return 13;
        if (step.phase === "pivot_placed") return 16;
        if (step.phase === "partition_complete") return 17;
        if (step.phase === "recursion") return 3;
        return 1;
      }
    },

    java: {
      language: "java",
      label: "Java",
      code: `public class QuickSort {
    /**
     * Helper method to swap two array elements.
     */
    private static void swap(int[] numbers, int i, int j) {
        int temp = numbers[i];
        numbers[i] = numbers[j];
        numbers[j] = temp;
    }

    /**
     * Lomuto partition scheme using the last element as pivot.
     * Places pivot in correct position and returns its index.
     */
    public static int partition(int[] numbers, int low, int high) {
        int pivot = numbers[high];
        int i = low - 1;

        for (int j = low; j < high; j++) {
            if (numbers[j] <= pivot) {
                i++;
                swap(numbers, i, j);
            }
        }
        swap(numbers, i + 1, high);
        return i + 1;
    }

    /**
     * Recursive Quick Sort function.
     */
    public static void quickSort(int[] numbers, int low, int high) {
        if (low < high) {
            int pi = partition(numbers, low, high);
            quickSort(numbers, low, pi - 1);
            quickSort(numbers, pi + 1, high);
        }
    }

    public static void main(String[] args) {
        int[] numbers = {38, 27, 43, 3, 9, 82, 10};
        quickSort(numbers, 0, numbers.length - 1);

        System.out.print("Sorted array: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}`,
      code_explanation: "1. `public class QuickSort`: Enclosing class providing static Quick Sort methods.\n2. `swap(int[] numbers, int i, int j)`: Utility method swapping values at two array indices.\n3. `int partition(...)`: Uses Lomuto partition with `pivot = numbers[high]`. Pointers `i` (boundary) and `j` (scanner) place items `<= pivot` to the left.\n4. Pivot placement: `swap(numbers, i + 1, high)` puts the pivot into its final location and returns `i + 1`.\n5. `void quickSort(numbers, low, high)`: Recursively sorts `[low..pi - 1]` and `[pi + 1..high]` when `low < high`.",
      codeLines: [
        { line: 1, text: "public static void quickSort(int[] numbers, int low, int high) {" },
        { line: 2, text: "    if (low >= high) return; // Base case: 0 or 1 element" },
        { line: 3, text: "    int pi = partition(numbers, low, high);" },
        { line: 4, text: "    quickSort(numbers, low, pi - 1);" },
        { line: 5, text: "    quickSort(numbers, pi + 1, high);" },
        { line: 6, text: "}" },
        { line: 7, text: "public static int partition(int[] numbers, int low, int high) {" },
        { line: 8, text: "    int pivot = numbers[high];" },
        { line: 9, text: "    int i = low - 1;" },
        { line: 10, text: "    for (int j = low; j < high; j++) {" },
        { line: 11, text: "        if (numbers[j] <= pivot) {" },
        { line: 12, text: "            i++;" },
        { line: 13, text: "            swap(numbers, i, j);" },
        { line: 14, text: "        }" },
        { line: 15, text: "    }" },
        { line: 16, text: "    swap(numbers, i + 1, high);" },
        { line: 17, text: "    return i + 1;" },
        { line: 18, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 6;
        if (step.phase === "base_case") return 2;
        if (step.phase === "pivot_selected") return 8;
        if (step.phase === "compare") return 11;
        if (step.phase === "swap") return 13;
        if (step.phase === "pivot_placed") return 16;
        if (step.phase === "partition_complete") return 17;
        if (step.phase === "recursion") return 3;
        return 1;
      }
    },

    python: {
      language: "python",
      label: "Python",
      code: `def partition(numbers: list[int], low: int, high: int) -> int:
    """
    Lomuto partition scheme using numbers[high] as pivot.
    Places elements <= pivot on left and returns the pivot's final index.
    """
    pivot = numbers[high]
    i = low - 1

    for j in range(low, high):
        if numbers[j] <= pivot:
            i += 1
            numbers[i], numbers[j] = numbers[j], numbers[i]

    numbers[i + 1], numbers[high] = numbers[high], numbers[i + 1]
    return i + 1


def quick_sort(numbers: list[int], low: int, high: int) -> None:
    """
    Sorts numbers[low..high] in ascending order using recursive Quick Sort.
    """
    if low < high:
        pi = partition(numbers, low, high)
        quick_sort(numbers, low, pi - 1)
        quick_sort(numbers, pi + 1, high)


if __name__ == "__main__":
    numbers = [38, 27, 43, 3, 9, 82, 10]
    quick_sort(numbers, 0, len(numbers) - 1)
    print("Sorted array:", numbers)`,
      code_explanation: "1. `partition(numbers, low, high)`: Partitions the sublist in-place using `numbers[high]` as pivot.\n2. In-place swapping: Uses Python tuple unpacking `numbers[i], numbers[j] = numbers[j], numbers[i]` for efficient swaps without temporary variables.\n3. Pivot placement: `numbers[i + 1], numbers[high] = numbers[high], numbers[i + 1]` positions the pivot at index `i + 1`.\n4. `quick_sort(numbers, low, high)`: Recursively divides and sorts list slices in-place between indices `low` and `high`.\n5. Base case: When `low >= high`, recursion halts automatically as the segment contains 1 or 0 elements.",
      codeLines: [
        { line: 1, text: "def quick_sort(numbers: list[int], low: int, high: int) -> None:" },
        { line: 2, text: "    if low >= high: return  # Base case: 0 or 1 element" },
        { line: 3, text: "    pi = partition(numbers, low, high)" },
        { line: 4, text: "    quick_sort(numbers, low, pi - 1)" },
        { line: 5, text: "    quick_sort(numbers, pi + 1, high)" },
        { line: 6, text: "def partition(numbers: list[int], low: int, high: int) -> int:" },
        { line: 7, text: "    pivot = numbers[high]" },
        { line: 8, text: "    i = low - 1" },
        { line: 9, text: "    for j in range(low, high):" },
        { line: 10, text: "        if numbers[j] <= pivot:" },
        { line: 11, text: "            i += 1" },
        { line: 12, text: "            numbers[i], numbers[j] = numbers[j], numbers[i]" },
        { line: 13, text: "    numbers[i + 1], numbers[high] = numbers[high], numbers[i + 1]" },
        { line: 14, text: "    return i + 1" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 5;
        if (step.phase === "base_case") return 2;
        if (step.phase === "pivot_selected") return 7;
        if (step.phase === "compare") return 10;
        if (step.phase === "swap") return 12;
        if (step.phase === "pivot_placed") return 13;
        if (step.phase === "partition_complete") return 14;
        if (step.phase === "recursion") return 3;
        return 1;
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

  complexity: {
    best: "O(n log n)",
    average: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)"
  },

  complexity_explanation: {
    time: "Best Case O(n log n): Occurs when the chosen pivot divides the array into roughly equal halves at every recursive level, yielding a balanced recursion tree of height log₂(n) with O(n) partitioning work per level.\n\nAverage Case O(n log n): In practice, random or varied inputs yield reasonably balanced partitions, maintaining O(n log n) average running time with small constant factors.\n\nWorst Case O(n²): Occurs when the pivot is consistently the smallest or largest element in the subarray. With the last-element Lomuto partition scheme, already sorted arrays ([1, 2, 3, 4, 5]) and reverse-sorted arrays ([5, 4, 3, 2, 1]) trigger worst-case O(n²) time because partitions reduce by only 1 element per recursive level (n levels × O(n) work).",
    space: "Auxiliary space is O(log n) on average due to call stack frames in a balanced recursion tree. In the worst case (unbalanced partitions on sorted/reverse-sorted input), call stack depth can reach O(n). Quick Sort is an in-place sort because elements are rearranged directly inside the original array without allocating auxiliary array buffers like Merge Sort."
  },

  properties: {
    stability: "Not Stable — Quick Sort is not stable because long-range swaps performed during partitioning (and when placing the pivot) can alter the original relative order of duplicate elements.",
    in_place: "In-Place — Rearranges elements directly within the input array without allocating extra array memory (only requiring O(log n) call stack space)."
  },

  advantages: [
    "Fast in practice: High cache locality and low constant factor overhead make it faster than Merge Sort or Heap Sort for typical in-memory datasets.",
    "In-place sorting: Requires no auxiliary array allocation (unlike Merge Sort which requires O(n) extra memory).",
    "Tail-call optimizable: Can be optimized to guarantee at most O(log n) auxiliary stack space by recursing on the smaller partition first."
  ],

  disadvantages: [
    "Worst-case O(n²) time complexity: Performance degrades quadratically on already sorted or reverse-sorted arrays when using a naive last-element pivot.",
    "Unstable: Does not preserve the relative ordering of identical keys.",
    "Recursive stack overhead: Can trigger stack overflow on extremely large worst-case inputs unless random pivots, median-of-three, or tail-call recursion optimizations are applied."
  ],

  common_mistakes: [
    "Including the pivot in recursive calls: Calling quickSort(low, pi) instead of quickSort(low, pi - 1) causes infinite recursion.",
    "Assuming Quick Sort is always O(n log n): Forgetting that a naive last-element pivot produces O(n²) worst-case time on sorted or reverse-sorted inputs.",
    "Off-by-one errors with Lomuto boundary pointer: Initializing i = low instead of low - 1 leads to missed elements or incorrect swap targets.",
    "Assuming Quick Sort is stable: Swapping elements across long distances can disrupt the order of duplicate keys."
  ],

  edge_cases: [
    "Already sorted array: Causes worst-case O(n²) behavior with last-element Lomuto pivot.",
    "Reverse sorted array: Also leads to worst-case O(n²) time degradation.",
    "Array with all identical elements: Every element equals the pivot, causing maximally unbalanced Lomuto partitioning.",
    "Single-element array [42]: Hits the base case immediately without performing any comparisons or swaps.",
    "Negative numbers and zeroes: Handled correctly as standard comparison values."
  ],

  practice: "Trace Quick Sort on [38, 27, 43, 3, 9, 82, 10] using Lomuto partition with last-element pivot 10, and identify the pivot's final index and the resulting left and right subarrays."
};
