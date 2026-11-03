/**
 * Curated educational reference content for Merge Sort.
 * Provides complete, idiomatic implementations and line-by-line explanations for C, Java, and Python.
 */

export const mergeSortContent = {
  concept: "Merge Sort is a classic, highly efficient, comparison-based sorting algorithm based on the Divide and Conquer algorithmic paradigm. It recursively divides the input array into two equal halves until each subarray contains only a single element (or is empty), which is trivially sorted. It then repeatedly merges pairs of sorted subarrays back together in sorted order to produce the final fully sorted array.",

  intuition: "Imagine you are holding two separate stacks of playing cards, each already sorted from lowest to highest. To combine them into one sorted stack, you don't need to inspect all cards: you simply look at the top card of each stack, take the smaller one, and place it facedown on your output pile. You repeat this comparison until both stacks are empty. Merge Sort achieves its power by reducing any unsorted array down to single-element stacks (which are already sorted), and then applying this fast two-finger merge process all the way up.",

  real_world_example: "1. Merging two sorted customer contact lists into a single alphabetical directory.\n2. External sorting in databases: when datasets of hundreds of gigabytes exceed available RAM, database engines partition the data into RAM-sized chunks, sort them, and perform an external multi-way merge sort from disk.\n3. Combining two individually sorted leaderboards from different gaming regions into a global leaderboard.\n4. E-commerce catalogs merging pre-sorted product feeds from multiple fulfillment centers.",

  algorithm: [
    "1. Base Case: If the subarray has 1 or 0 elements (i.e. left >= right), it is already sorted. Return immediately.",
    "2. Divide: Compute the midpoint index mid = left + (right - left) / 2 to prevent integer overflow.",
    "3. Conquer (Recursive Calls):",
    "   a. Recursively sort the left half: mergeSort(numbers, left, mid).",
    "   b. Recursively sort the right half: mergeSort(numbers, mid + 1, right).",
    "4. Combine (Merge Step):",
    "   a. Create temporary copies of the left subarray [left..mid] and right subarray [mid+1..right].",
    "   b. Maintain two pointers i (for left) and j (for right), and k = left (for main array).",
    "   c. While both subarrays have unexamined elements, compare leftArr[i] with rightArr[j].",
    "   d. If leftArr[i] <= rightArr[j], place leftArr[i] at numbers[k] and increment i (the <= maintains STABILITY).",
    "   e. Otherwise, place rightArr[j] at numbers[k] and increment j.",
    "   f. Increment k after each placement.",
    "   g. Copy any remaining elements from either subarray into numbers[k..right].",
    "5. Subarray numbers[left..right] is now fully sorted."
  ],

  pseudocode: `function mergeSort(numbers, left, right):
    if left >= right:
        return // Base case: 0 or 1 element is sorted

    mid = left + (right - left) / 2
    mergeSort(numbers, left, mid)
    mergeSort(numbers, mid + 1, right)
    merge(numbers, left, mid, right)

function merge(numbers, left, mid, right):
    create leftArr from numbers[left..mid]
    create rightArr from numbers[mid+1..right]
    
    i = 0, j = 0, k = left
    while i < length(leftArr) and j < length(rightArr):
        if leftArr[i] <= rightArr[j]: // <= preserves stability
            numbers[k] = leftArr[i]
            i = i + 1
        else:
            numbers[k] = rightArr[j]
            j = j + 1
        k = k + 1
        
    copy remaining elements of leftArr to numbers[k..]
    copy remaining elements of rightArr to numbers[k..]`,

  implementations: {
    c: {
      language: "c",
      label: "C",
      code: `#include <stdio.h>
#include <stdlib.h>

/**
 * Merges two sorted subarrays numbers[left..mid] and numbers[mid+1..right].
 * Uses temporary buffers to perform the two-pointer merge.
 */
void merge(int numbers[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    // Allocate temporary arrays for left and right subarrays
    int leftArr[n1];
    int rightArr[n2];

    for (int i = 0; i < n1; i++) {
        leftArr[i] = numbers[left + i];
    }
    for (int j = 0; j < n2; j++) {
        rightArr[j] = numbers[mid + 1 + j];
    }

    int i = 0, j = 0, k = left;

    // Merge temp arrays back into numbers[left..right]
    while (i < n1 && j < n2) {
        if (leftArr[i] <= rightArr[j]) { // <= ensures stability
            numbers[k++] = leftArr[i++];
        } else {
            numbers[k++] = rightArr[j++];
        }
    }

    // Copy any remaining elements of leftArr[]
    while (i < n1) {
        numbers[k++] = leftArr[i++];
    }

    // Copy any remaining elements of rightArr[]
    while (j < n2) {
        numbers[k++] = rightArr[j++];
    }
}

/**
 * Recursive Merge Sort function.
 */
void mergeSort(int numbers[], int left, int right) {
    if (left >= right) {
        return; // Base case: subarray of size 0 or 1
    }

    int mid = left + (right - left) / 2;
    mergeSort(numbers, left, mid);      // Sort left half
    mergeSort(numbers, mid + 1, right); // Sort right half
    merge(numbers, left, mid, right);   // Merge sorted halves
}

int main(void) {
    int numbers[] = {38, 27, 43, 3, 9, 82, 10};
    int size = sizeof(numbers) / sizeof(numbers[0]);

    mergeSort(numbers, 0, size - 1);

    printf("Sorted array: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    return 0;
}`,
      code_explanation: "1. `mergeSort(int numbers[], int left, int right)` takes the array and bounding indices.\n2. `if (left >= right) return;` establishes the base case for single elements or empty ranges.\n3. `int mid = left + (right - left) / 2;` safely calculates the midpoint avoiding integer overflow.\n4. Recursive calls `mergeSort(numbers, left, mid)` and `mergeSort(numbers, mid + 1, right)` sort the two halves.\n5. `merge(numbers, left, mid, right)` combines the two sorted halves into temporary buffers `leftArr` and `rightArr`.\n6. The two-pointer loop compares `leftArr[i]` and `rightArr[j]`. Using `<= ` ensures duplicate keys retain their initial relative order (stability).\n7. Two subsequent `while` loops copy any remaining elements from either subarray back into the primary array.",
      codeLines: [
        { line: 1, text: "void mergeSort(int numbers[], int left, int right) {" },
        { line: 2, text: "    if (left >= right) return; // Base case: 0 or 1 element" },
        { line: 3, text: "    int mid = left + (right - left) / 2;" },
        { line: 4, text: "    mergeSort(numbers, left, mid);" },
        { line: 5, text: "    mergeSort(numbers, mid + 1, right);" },
        { line: 6, text: "    merge(numbers, left, mid, right);" },
        { line: 7, text: "}" },
        { line: 8, text: "void merge(int numbers[], int left, int mid, int right) {" },
        { line: 9, text: "    while (i < n1 && j < n2) {" },
        { line: 10, text: "        if (leftArr[i] <= rightArr[j]) numbers[k++] = leftArr[i++];" },
        { line: 11, text: "        else numbers[k++] = rightArr[j++];" },
        { line: 12, text: "    }" },
        { line: 13, text: "    while (i < n1) numbers[k++] = leftArr[i++];" },
        { line: 14, text: "    while (j < n2) numbers[k++] = rightArr[j++];" },
        { line: 15, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 7;
        if (step.phase === "split") return 3;
        if (step.phase === "base_case") return 2;
        if (step.phase === "merge_start") return 8;
        if (step.phase === "compare") return 10;
        if (step.phase === "copy_left") return 10;
        if (step.phase === "copy_right") return 11;
        if (step.phase === "copy_remaining") return 13;
        if (step.phase === "merge_complete") return 6;
        return 1;
      }
    },

    java: {
      language: "java",
      label: "Java",
      code: `public class MergeSort {
    /**
     * Merges two sorted subarrays numbers[left..mid] and numbers[mid+1..right].
     */
    public static void merge(int[] numbers, int left, int mid, int right) {
        int n1 = mid - left + 1;
        int n2 = right - mid;

        int[] leftArr = new int[n1];
        int[] rightArr = new int[n2];

        for (int i = 0; i < n1; i++) {
            leftArr[i] = numbers[left + i];
        }
        for (int j = 0; j < n2; j++) {
            rightArr[j] = numbers[mid + 1 + j];
        }

        int i = 0, j = 0, k = left;

        // Two-pointer merge
        while (i < n1 && j < n2) {
            if (leftArr[i] <= rightArr[j]) { // <= preserves stability
                numbers[k++] = leftArr[i++];
            } else {
                numbers[k++] = rightArr[j++];
            }
        }

        // Copy remaining elements
        while (i < n1) {
            numbers[k++] = leftArr[i++];
        }
        while (j < n2) {
            numbers[k++] = rightArr[j++];
        }
    }

    /**
     * Recursive Merge Sort.
     */
    public static void mergeSort(int[] numbers, int left, int right) {
        if (left >= right) {
            return; // Base case
        }

        int mid = left + (right - left) / 2;
        mergeSort(numbers, left, mid);
        mergeSort(numbers, mid + 1, right);
        merge(numbers, left, mid, right);
    }

    public static void main(String[] args) {
        int[] numbers = {38, 27, 43, 3, 9, 82, 10};
        mergeSort(numbers, 0, numbers.length - 1);

        System.out.print("Sorted array: ");
        for (int num : numbers) {
            System.out.print(num + " ");
        }
        System.out.println();
    }
}`,
      code_explanation: "1. `mergeSort(int[] numbers, int left, int right)` defines the recursive range on the array.\n2. `if (left >= right) return;` acts as the base case, stopping when subarrays are of length 1 or 0.\n3. `int mid = left + (right - left) / 2;` computes the midpoint.\n4. Two recursive invocations divide each half down to leaf nodes.\n5. `merge(...)` creates two auxiliary arrays `leftArr` and `rightArr` representing the sorted halves.\n6. Pointers `i` and `j` walk through `leftArr` and `rightArr`, placing the smaller into index `k` of `numbers`.\n7. The `<=` test guarantees stable sorting by prioritizing equal items from `leftArr`.\n8. Residual loops empty any remaining items in either subarray.",
      codeLines: [
        { line: 1, text: "public static void mergeSort(int[] numbers, int left, int right) {" },
        { line: 2, text: "    if (left >= right) return; // Base case: 0 or 1 element" },
        { line: 3, text: "    int mid = left + (right - left) / 2;" },
        { line: 4, text: "    mergeSort(numbers, left, mid);" },
        { line: 5, text: "    mergeSort(numbers, mid + 1, right);" },
        { line: 6, text: "    merge(numbers, left, mid, right);" },
        { line: 7, text: "}" },
        { line: 8, text: "public static void merge(int[] numbers, int left, int mid, int right) {" },
        { line: 9, text: "    while (i < n1 && j < n2) {" },
        { line: 10, text: "        if (leftArr[i] <= rightArr[j]) numbers[k++] = leftArr[i++];" },
        { line: 11, text: "        else numbers[k++] = rightArr[j++];" },
        { line: 12, text: "    }" },
        { line: 13, text: "    while (i < n1) numbers[k++] = leftArr[i++];" },
        { line: 14, text: "    while (j < n2) numbers[k++] = rightArr[j++];" },
        { line: 15, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 7;
        if (step.phase === "split") return 3;
        if (step.phase === "base_case") return 2;
        if (step.phase === "merge_start") return 8;
        if (step.phase === "compare") return 10;
        if (step.phase === "copy_left") return 10;
        if (step.phase === "copy_right") return 11;
        if (step.phase === "copy_remaining") return 13;
        if (step.phase === "merge_complete") return 6;
        return 1;
      }
    },

    python: {
      language: "python",
      label: "Python",
      code: `def merge(numbers: list[int], left: int, mid: int, right: int) -> None:
    """
    Merges two sorted subarrays numbers[left..mid] and numbers[mid+1..right].
    """
    left_arr = numbers[left:mid + 1]
    right_arr = numbers[mid + 1:right + 1]

    i = j = 0
    k = left

    # Merge temporary lists back into numbers[left..right]
    while i < len(left_arr) and j < len(right_arr):
        if left_arr[i] <= right_arr[j]:  # <= preserves stability
            numbers[k] = left_arr[i]
            i += 1
        else:
            numbers[k] = right_arr[j]
            j += 1
        k += 1

    # Copy remaining elements from left_arr, if any
    while i < len(left_arr):
        numbers[k] = left_arr[i]
        i += 1
        k += 1

    # Copy remaining elements from right_arr, if any
    while j < len(right_arr):
        numbers[k] = right_arr[j]
        j += 1
        k += 1


def merge_sort(numbers: list[int], left: int, right: int) -> None:
    """
    Sorts numbers[left..right] in ascending order using recursive Merge Sort.
    """
    if left >= right:
        return  # Base case: 0 or 1 element is already sorted

    mid = left + (right - left) // 2
    merge_sort(numbers, left, mid)
    merge_sort(numbers, mid + 1, right)
    merge(numbers, left, mid, right)


if __name__ == "__main__":
    numbers = [38, 27, 43, 3, 9, 82, 10]
    merge_sort(numbers, 0, len(numbers) - 1)
    print("Sorted array:", numbers)`,
      code_explanation: "1. `merge_sort(numbers, left, right)` recursively sorts list slices in-place between indices `left` and `right`.\n2. `if left >= right: return` checks for 0 or 1 elements (base case).\n3. `mid = left + (right - left) // 2` uses integer floor division to divide the segment.\n4. Recursive calls sort `numbers[left:mid + 1]` and `numbers[mid + 1:right + 1]`.\n5. `merge(...)` slices copies into `left_arr` and `right_arr`.\n6. The `while` loop compares `left_arr[i]` and `right_arr[j]`, taking the smaller element. The `<=` ensures equal values keep their original relative positions.\n7. Residual while loops copy leftover elements to slot `k`.",
      codeLines: [
        { line: 1, text: "def merge_sort(numbers: list[int], left: int, right: int) -> None:" },
        { line: 2, text: "    if left >= right: return  # Base case" },
        { line: 3, text: "    mid = left + (right - left) // 2" },
        { line: 4, text: "    merge_sort(numbers, left, mid)" },
        { line: 5, text: "    merge_sort(numbers, mid + 1, right)" },
        { line: 6, text: "    merge(numbers, left, mid, right)" },
        { line: 7, text: "def merge(numbers: list[int], left: int, mid: int, right: int) -> None:" },
        { line: 8, text: "    while i < len(left_arr) and j < len(right_arr):" },
        { line: 9, text: "        if left_arr[i] <= right_arr[j]: numbers[k] = left_arr[i]; i += 1" },
        { line: 10, text: "        else: numbers[k] = right_arr[j]; j += 1" },
        { line: 11, text: "        k += 1" },
        { line: 12, text: "    while i < len(left_arr): numbers[k] = left_arr[i]; i += 1; k += 1" },
        { line: 13, text: "    while j < len(right_arr): numbers[k] = right_arr[j]; j += 1; k += 1" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.finished || step.phase === "complete") return 6;
        if (step.phase === "split") return 3;
        if (step.phase === "base_case") return 2;
        if (step.phase === "merge_start") return 7;
        if (step.phase === "compare") return 9;
        if (step.phase === "copy_left") return 9;
        if (step.phase === "copy_right") return 10;
        if (step.phase === "copy_remaining") return 12;
        if (step.phase === "merge_complete") return 6;
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
    worst: "O(n log n)",
    space: "O(n)"
  },

  complexity_explanation: {
    time: "At every recursive step, the array of size n is halved into two subarrays of size n/2, resulting in a recursion tree of height log₂(n). At each of these log₂(n) levels, merging all elements requires O(n) total comparisons and copy operations. Hence, total time is O(n × log₂ n) = O(n log n) in all cases (best, average, and worst). Unlike Quick Sort or Insertion Sort, Merge Sort's execution structure is independent of input order.",
    space: "Standard array-based Merge Sort requires O(n) auxiliary space to hold temporary subarrays during the merge operation. Although the recursion stack takes O(log n) frames, the dominant memory cost is the O(n) array buffers."
  },

  properties: {
    stability: "Stable — Merge Sort preserves the original relative order of duplicate elements because the merge condition uses leftArr[i] <= rightArr[j], always giving precedence to the element originating from the left subarray when values are equal.",
    in_place: "Not In-Place — Standard Merge Sort requires O(n) auxiliary memory to temporarily store elements while merging, rather than rearranging items exclusively within the original array."
  },

  advantages: [
    "Guaranteed O(n log n) time complexity in all cases (best, average, and worst). Never suffers from quadratic O(n²) worst-case degradation.",
    "Stable sort: Preserves the relative order of identical elements, critical when sorting multi-attribute records (e.g. sorting by name, then by grade).",
    "Ideal for external sorting: Easily merges datasets too massive to fit entirely in main memory (RAM) by streaming from disk.",
    "Optimal for linked lists: Can be implemented on linked lists with O(1) auxiliary space and without random access."
  ],

  disadvantages: [
    "Requires O(n) auxiliary memory space, making it unsuitable for strictly memory-constrained embedded environments.",
    "Higher constant factor overhead on very small arrays (n ≤ 20) compared to cache-friendly algorithms like Insertion Sort.",
    "Does not take advantage of partially sorted arrays (always performs O(n log n) operations regardless of initial sortedness)."
  ],

  common_mistakes: [
    "Using '<' instead of '<=' during the merge comparison. This causes elements from the right subarray to be chosen first on ties, destroying the algorithm's stability.",
    "Integer overflow when calculating the midpoint as (left + right) / 2 for large arrays. The safe form is left + (right - left) / 2.",
    "Off-by-one errors in recursion boundaries, such as calling mergeSort(numbers, left, mid - 1) instead of mergeSort(numbers, left, mid).",
    "Forgetting the residual copy loops after the primary merge loop finishes, causing leftover elements from one subarray to be omitted."
  ],

  practice: "Trace Merge Sort on [38, 27, 43, 3, 9, 82, 10] and observe how recursive splitting divides down to individual items before merging back up."
};
