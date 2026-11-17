/**
 * Curated educational reference content for Counting Sort.
 * Follows strict pedagogical order:
 * 1. Concept
 * 2. Intuition
 * 3. Real-world example
 * 4. Visual walkthrough
 * 5. Core concepts (frequency array, range, cumulative counts, output placement, stability)
 * 6. Algorithm steps
 * 7. Pseudocode
 * 8. C, Java, and Python implementations
 * 9. Time and space complexity
 * 10. Advantages, disadvantages, and edge cases
 * 11. Practice questions and viva questions
 */

export const countingSortContent = {
  concept: "Counting Sort is a non-comparison-based, integer sorting algorithm that works by tallying how many times each distinct value appears in the input array. It then uses those tallies — accumulated into a cumulative prefix-sum array — to calculate the exact final position of every element, placing each one directly into an output buffer. Because it never compares elements against each other, it sidesteps the Ω(n log n) lower bound that applies to all comparison-based sorts and achieves a linear O(n + k) time complexity, where n is the number of elements and k is the range of values (max − min + 1). Counting Sort is particularly powerful when k is small relative to n, and it is the foundational building block of Radix Sort.",

  // 1. Intuition
  intuition: "Instead of comparing elements, Counting Sort counts how many times each value appears. Imagine you have a row of numbered buckets, one for each possible value. You walk through the array and drop each element into its matching bucket. Once every element is in a bucket, you just pour the buckets back out in order — smallest bucket first — and you have a sorted array. No swaps, no comparisons, just counting and placing.",

  // 2. Real-world example
  real_world_example: "Imagine a teacher who has just graded 30 students' short quizzes, where every mark is an integer from 0 to 10. Rather than sorting 30 mark-slips by repeated comparisons, the teacher places 11 labeled trays on a desk (one per possible mark: 0, 1, 2, …, 10) and drops each slip into the appropriate tray. At the end, the teacher picks up each tray in order — tray 0 first, then tray 1, and so on — and stacks the slips. The result is a fully sorted list of marks in a single pass. This is exactly how Counting Sort works: the 'trays' are the count array indices, the 'slips' are the input values, and the 'stacking' is the output placement step.",

  // 3. Visual walkthrough
  visualization: `Given array: [4, 2, 2, 8, 3, 3, 1]
  min = 1, max = 8, range k = 8 (indices 0..7 represent values 1..8)

Step 1 — Original array:
  Index:  0   1   2   3   4   5   6
  Value: [4,  2,  2,  8,  3,  3,  1]

Step 2 — Count occurrences (count[v - min]++):
  Value:        1   2   3   4   5   6   7   8
  Count index:  0   1   2   3   4   5   6   7
  Count array: [1,  2,  2,  1,  0,  0,  0,  1]

  Explanation:
    - 1 appears 1 time  → count[0] = 1
    - 2 appears 2 times → count[1] = 2
    - 3 appears 2 times → count[2] = 2
    - 4 appears 1 time  → count[3] = 1
    - 8 appears 1 time  → count[7] = 1

Step 3 — Build cumulative counts (count[i] += count[i-1]):
  Value:              1   2   3   4   5   6   7   8
  Count index:        0   1   2   3   4   5   6   7
  Cumulative count:  [1,  3,  5,  6,  6,  6,  6,  7]

  Explanation: count[i] now holds the number of elements ≤ (i + min).
  This tells us the last valid output index for each value.

Step 4 — Place into output array (right-to-left for stability):
  Walk the original array from right to left: [4, 2, 2, 8, 3, 3, 1]

  i=6: value=1 → idx = --count[0] = 0  → output[0] = 1   count[0]=0
  i=5: value=3 → idx = --count[2] = 4  → output[4] = 3   count[2]=4
  i=4: value=3 → idx = --count[2] = 3  → output[3] = 3   count[2]=3  (duplicate placed before first)
  i=3: value=8 → idx = --count[7] = 6  → output[6] = 8   count[7]=6
  i=2: value=2 → idx = --count[1] = 2  → output[2] = 2   count[1]=2
  i=1: value=2 → idx = --count[1] = 1  → output[1] = 2   count[1]=1  (duplicate placed before first)
  i=0: value=4 → idx = --count[3] = 5  → output[5] = 4   count[3]=5

Step 5 — Final sorted array (copy output back):
  Index:  0   1   2   3   4   5   6
  Value: [1,  2,  2,  3,  3,  4,  8]  ✓`,

  // 4. Core concepts
  core_concepts: [
    "Frequency Array (Count Array): An auxiliary array of size k (the range of input values) where each index i stores how many times the value (i + min) appears in the input. This is the central data structure of Counting Sort — it converts the sorting problem into a counting problem.",
    "Range k = max − min + 1: By offsetting values by min (using count[value − min] instead of count[value]), Counting Sort handles negative numbers and avoids allocating a count array starting from 0 when all values are large. The range k determines both the size of the count array and the O(k) part of the complexity.",
    "Cumulative Counts (Prefix Sum): After counting, a second pass converts the count array into a prefix-sum array: count[i] += count[i − 1]. Now count[i] holds the number of elements whose value is ≤ (i + min), which is exactly one more than the last valid output index for that value. Using --count[v − min] before placement gives the correct 0-based index.",
    "Output Placement (Right-to-Left Pass): Iterating the input array from right to left and decrementing the cumulative count before each placement ensures that elements with equal values are placed from right to left in the output — preserving their original left-to-right order and making the sort stable.",
    "Stable Sorting Property: Counting Sort is inherently stable because the right-to-left output placement pass ensures that among duplicate values, the element that appeared later in the input (rightmost) is placed at the higher index in the output, maintaining the original relative order of all equal elements."
  ],

  // 5. Algorithm steps
  algorithm: [
    "1. Base Check: If the array is empty or has one element, return immediately — no sorting needed.",
    "2. Find Range: Scan the array once to find min_val and max_val. Compute range k = max_val − min_val + 1. This determines the size of the count array.",
    "3. Count Occurrences: Create a count array of size k, initialized to zero. For every element v in the input, increment count[v − min_val]. After this pass, count[i] = number of times the value (i + min_val) appears.",
    "4. Build Cumulative Counts: Iterate count from index 1 to k − 1, setting count[i] += count[i − 1]. Now count[i] holds the total number of elements with value ≤ (i + min_val), which equals the index one past the last correct position for that value.",
    "5. Place Elements into Output (right-to-left): Create an output array of size n. Walk the input from right to left (i = n − 1 down to 0). For each element v: decrement count[v − min_val] by 1, then set output[count[v − min_val]] = v. This right-to-left traversal preserves stability for duplicate elements.",
    "6. Copy Back: Copy every element of output into the original array. The array is now sorted in ascending order."
  ],

  // 6. Pseudocode
  pseudocode: `function countingSort(numbers):
    n = length of numbers
    if n <= 1: return

    // Step 1: Find the value range
    min_val = min(numbers)
    max_val = max(numbers)
    k = max_val - min_val + 1

    // Step 2: Count occurrences
    count = array of k zeros
    for each v in numbers:
        count[v - min_val] += 1

    // Step 3: Build cumulative counts
    for i from 1 to k - 1:
        count[i] += count[i - 1]

    // Step 4: Place elements into output (right-to-left for stability)
    output = array of n zeros
    for i from n - 1 down to 0:
        v = numbers[i]
        count[v - min_val] -= 1
        output[count[v - min_val]] = v

    // Step 5: Copy sorted output back to original array
    for i from 0 to n - 1:
        numbers[i] = output[i]`,

  // 7. C, Java, and Python implementations
  implementations: {
    c: {
      language: "c",
      label: "C",
      code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void counting_sort(int numbers[], int size) {
    if (size <= 0) return;

    /* Find the minimum and maximum values */
    int min_val = numbers[0], max_val = numbers[0];
    for (int i = 1; i < size; i++) {
        if (numbers[i] < min_val) min_val = numbers[i];
        if (numbers[i] > max_val) max_val = numbers[i];
    }

    /* Allocate the count array of size (max - min + 1) */
    int range = max_val - min_val + 1;
    int *count = (int *)calloc(range, sizeof(int));
    if (!count) return;  /* Allocation failure */

    /* Step 1: Count occurrences of each value */
    for (int i = 0; i < size; i++) {
        count[numbers[i] - min_val]++;
    }

    /* Step 2: Convert counts into cumulative counts */
    for (int i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }

    /* Step 3: Place each element into the output array (right-to-left for stability) */
    int *output = (int *)malloc(size * sizeof(int));
    if (!output) { free(count); return; }

    for (int i = size - 1; i >= 0; i--) {
        output[--count[numbers[i] - min_val]] = numbers[i];
    }

    /* Step 4: Copy sorted output back into the original array */
    memcpy(numbers, output, size * sizeof(int));

    free(count);
    free(output);
}

int main(void) {
    int numbers[] = {4, 2, 2, 8, 3, 3, 1};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    counting_sort(numbers, size);
    printf("Sorted: ");
    for (int i = 0; i < size; i++) printf("%d ", numbers[i]);
    printf("\\n");
    return 0;
}`,
      code_explanation: `1. \`min_val\` / \`max_val\` scan: A single pass finds the value range so the count array is sized precisely — avoiding wasted memory when values don't start at 0.
2. \`calloc(range, sizeof(int))\`: Allocates the count array zero-initialized. Using calloc instead of malloc + memset is both shorter and safer.
3. Count loop — \`count[numbers[i] - min_val]++\`: The offset \`- min_val\` maps any integer range to indices 0..range-1, so negative values and large values are both handled correctly.
4. Cumulative loop — \`count[i] += count[i - 1]\`: Converts raw frequencies into prefix sums. After this, count[i] tells us the last+1 output index for value (i + min_val).
5. Placement loop (right-to-left) — \`output[--count[numbers[i] - min_val]] = numbers[i]\`: Pre-decrement gives the correct 0-based position. Traversing from right to left ensures that duplicate elements keep their original relative order (stability).
6. \`memcpy(numbers, output, size * sizeof(int))\`: Copies the sorted buffer back into the caller's array in one efficient block transfer.
7. \`free(count); free(output);\`: Releases both heap allocations to prevent memory leaks.`,
      codeLines: [
        { line: 1,  text: "void counting_sort(int numbers[], int size) {" },
        { line: 2,  text: "    int min_val = numbers[0], max_val = numbers[0];" },
        { line: 3,  text: "    for (int i = 1; i < size; i++) { /* find min & max */ }" },
        { line: 4,  text: "    int range = max_val - min_val + 1;" },
        { line: 5,  text: "    int *count = (int *)calloc(range, sizeof(int));" },
        { line: 6,  text: "    for (int i = 0; i < size; i++) {" },
        { line: 7,  text: "        count[numbers[i] - min_val]++;  // Step 1: count occurrences" },
        { line: 8,  text: "    }" },
        { line: 9,  text: "    for (int i = 1; i < range; i++) {" },
        { line: 10, text: "        count[i] += count[i - 1];  // Step 2: cumulative counts" },
        { line: 11, text: "    }" },
        { line: 12, text: "    int *output = (int *)malloc(size * sizeof(int));" },
        { line: 13, text: "    for (int i = size - 1; i >= 0; i--) {" },
        { line: 14, text: "        output[--count[numbers[i] - min_val]] = numbers[i];  // Step 3: place" },
        { line: 15, text: "    }" },
        { line: 16, text: "    memcpy(numbers, output, size * sizeof(int));  // Step 4: copy back" },
        { line: 17, text: "    free(count); free(output);" },
        { line: 18, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "empty") return null;
        if (step.phase === "initial") return 1;
        if (step.phase === "find_min_max") return 3;
        if (step.phase === "counting") return 7;
        if (step.phase === "cumulative") return 10;
        if (step.phase === "placing") return 14;
        if (step.phase === "copyback") return 16;
        if (step.finished || step.phase === "complete") return 18;
        return 1;
      }
    },

    java: {
      language: "java",
      label: "Java",
      code: `import java.util.Arrays;

public class CountingSort {
    public static void countingSort(int[] numbers) {
        if (numbers == null || numbers.length == 0) return;

        // Find min and max values
        int min = numbers[0], max = numbers[0];
        for (int num : numbers) {
            if (num < min) min = num;
            if (num > max) max = num;
        }

        // Create a count array for the range [min..max]
        int range = max - min + 1;
        int[] count = new int[range];

        // Step 1: Count occurrences
        for (int num : numbers) {
            count[num - min]++;
        }

        // Step 2: Build cumulative counts
        for (int i = 1; i < range; i++) {
            count[i] += count[i - 1];
        }

        // Step 3: Place elements into output (right-to-left for stability)
        int[] output = new int[numbers.length];
        for (int i = numbers.length - 1; i >= 0; i--) {
            output[--count[numbers[i] - min]] = numbers[i];
        }

        // Step 4: Copy sorted result back
        System.arraycopy(output, 0, numbers, 0, numbers.length);
    }

    public static void main(String[] args) {
        int[] numbers = {4, 2, 2, 8, 3, 3, 1};
        countingSort(numbers);
        System.out.println("Sorted: " + Arrays.toString(numbers));
    }
}`,
      code_explanation: `1. Null/empty guard: Protects against NullPointerException and skips trivially sorted arrays immediately.
2. min / max scan (enhanced for-each loop): Java's for-each iterates cleanly without an index variable. After the loop, min and max define the value range.
3. \`int[] count = new int[range]\`: Java initializes arrays to zero by default, so no explicit zeroing is needed.
4. Count loop — \`count[num - min]++\`: The offset by min maps values to 0-based indices in the count array, correctly handling arrays that start above 0.
5. Cumulative loop — \`count[i] += count[i - 1]\`: Converts frequencies to prefix sums; count[i] now equals the number of elements with value ≤ (i + min).
6. Placement loop (right-to-left) — \`output[--count[numbers[i] - min]] = numbers[i]\`: Pre-decrement gives the correct 0-based position. Right-to-left traversal maintains the original relative order of duplicates (stability).
7. \`System.arraycopy(output, 0, numbers, 0, numbers.length)\`: Native array copy is faster than a manual loop and copies the entire sorted buffer back in one call.`,
      codeLines: [
        { line: 1,  text: "public static void countingSort(int[] numbers) {" },
        { line: 2,  text: "    int min = numbers[0], max = numbers[0];" },
        { line: 3,  text: "    for (int num : numbers) { /* find min & max */ }" },
        { line: 4,  text: "    int range = max - min + 1;" },
        { line: 5,  text: "    int[] count = new int[range];" },
        { line: 6,  text: "    for (int num : numbers) {" },
        { line: 7,  text: "        count[num - min]++;  // Step 1: count occurrences" },
        { line: 8,  text: "    }" },
        { line: 9,  text: "    for (int i = 1; i < range; i++) {" },
        { line: 10, text: "        count[i] += count[i - 1];  // Step 2: cumulative counts" },
        { line: 11, text: "    }" },
        { line: 12, text: "    int[] output = new int[numbers.length];" },
        { line: 13, text: "    for (int i = numbers.length - 1; i >= 0; i--) {" },
        { line: 14, text: "        output[--count[numbers[i] - min]] = numbers[i];  // Step 3: place" },
        { line: 15, text: "    }" },
        { line: 16, text: "    System.arraycopy(output, 0, numbers, 0, numbers.length);  // Step 4: copy back" },
        { line: 17, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "empty") return null;
        if (step.phase === "initial") return 1;
        if (step.phase === "find_min_max") return 3;
        if (step.phase === "counting") return 7;
        if (step.phase === "cumulative") return 10;
        if (step.phase === "placing") return 14;
        if (step.phase === "copyback") return 16;
        if (step.finished || step.phase === "complete") return 17;
        return 1;
      }
    },

    python: {
      language: "python",
      label: "Python",
      code: `def counting_sort(numbers: list[int]) -> list[int]:
    """Sort a list of integers using Counting Sort."""
    if not numbers:
        return numbers

    min_val = min(numbers)
    max_val = max(numbers)
    range_size = max_val - min_val + 1

    # Step 1: Count occurrences of each value
    count = [0] * range_size
    for num in numbers:
        count[num - min_val] += 1

    # Step 2: Build cumulative counts
    for i in range(1, range_size):
        count[i] += count[i - 1]

    # Step 3: Place elements into output (right-to-left for stability)
    output = [0] * len(numbers)
    for num in reversed(numbers):
        count[num - min_val] -= 1
        output[count[num - min_val]] = num

    # Step 4: Copy back
    numbers[:] = output
    return numbers

if __name__ == "__main__":
    numbers = [4, 2, 2, 8, 3, 3, 1]
    counting_sort(numbers)
    print("Sorted:", numbers)`,
      code_explanation: `1. \`if not numbers\`: Pythonic empty-list guard — falsy check covers both None and [].
2. \`min(numbers)\` / \`max(numbers)\`: Built-in functions scan in O(n); no manual loop needed.
3. \`count = [0] * range_size\`: Creates a zero-filled list of length k = max − min + 1.
4. Count loop — \`count[num - min_val] += 1\`: Offsets each value by min_val to map any integer range to 0-based indices.
5. Cumulative loop — \`count[i] += count[i - 1]\`: Converts raw frequencies into prefix sums in-place.
6. \`for num in reversed(numbers)\`: Python's reversed() iterates from the last element to the first without creating a copy, preserving stability by processing later duplicates first.
7. Placement — \`count[num - min_val] -= 1\` then \`output[count[...]] = num\`: Decrement before indexing gives the correct 0-based position (equivalent to C's pre-decrement \`--count[...]\`).
8. \`numbers[:] = output\`: Slice assignment modifies the list in-place so the caller sees the sorted result, while still returning the list for convenience.`,
      codeLines: [
        { line: 1,  text: "def counting_sort(numbers: list[int]) -> list[int]:" },
        { line: 2,  text: "    min_val = min(numbers); max_val = max(numbers)" },
        { line: 3,  text: "    range_size = max_val - min_val + 1" },
        { line: 4,  text: "    count = [0] * range_size" },
        { line: 5,  text: "    for num in numbers:" },
        { line: 6,  text: "        count[num - min_val] += 1  # Step 1: count occurrences" },
        { line: 7,  text: "    for i in range(1, range_size):" },
        { line: 8,  text: "        count[i] += count[i - 1]  # Step 2: cumulative counts" },
        { line: 9,  text: "    output = [0] * len(numbers)" },
        { line: 10, text: "    for num in reversed(numbers):  # Step 3: place (right-to-left)" },
        { line: 11, text: "        count[num - min_val] -= 1" },
        { line: 12, text: "        output[count[num - min_val]] = num" },
        { line: 13, text: "    numbers[:] = output  # Step 4: copy back" },
        { line: 14, text: "    return numbers" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "empty") return null;
        if (step.phase === "initial") return 1;
        if (step.phase === "find_min_max") return 2;
        if (step.phase === "counting") return 6;
        if (step.phase === "cumulative") return 8;
        if (step.phase === "placing") return 12;
        if (step.phase === "copyback") return 13;
        if (step.finished || step.phase === "complete") return 14;
        return 1;
      }
    }
  },

  // Backward-compatible getters
  get code() { return this.implementations.java.code; },
  get code_explanation() { return this.implementations.java.code_explanation; },

  // 8. Time and space complexity
  complexity: {
    best: "O(n + k)",
    average: "O(n + k)",
    worst: "O(n + k)",
    space: "O(n + k)"
  },

  complexity_explanation: {
    time: "All Cases O(n + k): Counting Sort makes exactly four passes over linear-sized structures. Pass 1 (find min/max): O(n). Pass 2 (count occurrences): O(n). Pass 3 (build cumulative counts): O(k). Pass 4 (place into output): O(n). Pass 5 (copy back): O(n). Total = O(n) + O(k) = O(n + k), where n is the number of elements and k = max − min + 1 is the value range. There are no comparisons and no branching based on element relationships, so there is no best/average/worst distinction — the runtime is always O(n + k) regardless of input order.",
    space: "O(n + k) auxiliary space: Two extra arrays are allocated — the count/cumulative array of size k (O(k)) and the output array of size n (O(n)). Unlike in-place sorts such as Heap Sort, Counting Sort cannot rearrange elements without this output buffer (the output buffer is what enables stability). If k is very large relative to n, the memory cost can exceed that of comparison-based alternatives."
  },

  properties: {
    stability: "Stable — By traversing the input right-to-left during the placement phase and using a pre-decrement on the cumulative count, equal elements maintain their original left-to-right relative order in the output array.",
    in_place: "Not In-Place — Counting Sort requires two auxiliary arrays: a count/prefix-sum array of size k and an output array of size n, giving O(n + k) extra space. It cannot sort purely within the input array."
  },

  // 9. Advantages, disadvantages, and edge cases
  advantages: [
    "Linear time O(n + k): When k = O(n) — that is, the value range is proportional to the number of elements — Counting Sort runs in O(n), which is faster than any comparison-based sort's Ω(n log n) lower bound.",
    "Stable sort: The right-to-left placement pass preserves the original relative order of duplicate elements, making Counting Sort safe as a sub-routine in stable Radix Sort.",
    "Simple and predictable: No recursion, no pivot selection, no random access patterns — just linear scans and direct indexed writes. The algorithm is easy to implement correctly and its performance is fully predictable.",
    "Great for dense integer ranges: When sorting exam scores (0–100), ages (0–120), or pixel intensities (0–255), k is constant and the algorithm is essentially O(n)."
  ],

  disadvantages: [
    "Limited to integer (or discrete) values only: Counting Sort requires values that can serve as array indices after offsetting. It cannot directly sort floating-point numbers, strings, or objects without mapping them to integers first.",
    "Impractical for large ranges (large k): If the value range k is much larger than n — for example, sorting 10 numbers drawn from 0 to 1,000,000 — the count array wastes enormous memory and the O(k) initialization dominates the runtime.",
    "Requires O(n + k) extra space: Unlike in-place sorts (Heap Sort, Quick Sort), Counting Sort always needs an output buffer of size n plus a count array of size k, which can be prohibitive in memory-constrained environments.",
    "Not a general-purpose sort: Because it cannot handle arbitrary comparable types, Counting Sort is unsuitable as a drop-in replacement for comparison-based sorts in generic libraries."
  ],

  edge_cases: [
    "All elements identical, e.g. [5, 5, 5, 5]: count[0] = 4; after cumulation, all placements go to indices 3, 2, 1, 0 in reverse order. Output is [5, 5, 5, 5] — correct and stable.",
    "Already sorted array [1, 2, 3, 4, 5]: Counting Sort performs all passes identically to any other input — no short-circuit exists. Result is correct in O(n + k) time.",
    "Reverse sorted array [8, 3, 3, 2, 2, 1]: Again, all passes run fully. The placement step correctly positions every element regardless of input order.",
    "Single element array [42]: Base check passes (length = 1 ≤ 1); min = max = 42; range = 1; count = [1]; cumulative = [1]; output = [42]. Correct with no meaningful work.",
    "Array with negative numbers, e.g. [-3, -1, 0, 2]: min = -3, range = 6. The offset (-3) maps values to indices 0–5. All arithmetic works correctly; no special-casing needed.",
    "Array with one duplicate pair [3, 1, 3]: count[0]=1 (value 1), count[2]=2 (value 3). After cumulation: [1, 1, 3]. Placement right-to-left: i=2 → value=3 → output[1]=3; i=1 → value=1 → output[0]=1; i=0 → value=3 → output[2]=3. Wait — placement gives [1, 3, 3] — correct and stable."
  ],

  // 10. Practice question
  practice: "Trace Counting Sort on [5, 3, 1, 3, 2, 5, 2, 1]: (a) Write out the count array after the counting pass. (b) Write the cumulative count array. (c) Show the output array state after each placement step of the right-to-left pass, noting the index used each time. (d) Confirm the final sorted order and explain why the two 3s appear in the same relative order as in the input.",

  // 11. Viva questions
  viva_questions: [
    {
      question: "Why is Counting Sort not a comparison-based sort, and why does that matter?",
      answer: "Counting Sort never directly compares two input elements against each other. Instead, it uses element values as array indices to count occurrences. Because it avoids comparisons, it is not subject to the Ω(n log n) information-theoretic lower bound that applies to all comparison-based sorts, allowing it to run in O(n + k) linear time when k is small."
    },
    {
      question: "Why do we traverse the input from right to left during the placement step?",
      answer: "Traversing right-to-left ensures that equal elements are placed in reverse order of processing — the rightmost duplicate in the input gets placed last (at the highest available index among equals), and the leftmost duplicate gets placed first (at the lowest available index). This maintains the original relative order of duplicates, making Counting Sort stable."
    },
    {
      question: "What happens when k (the range) is much larger than n (the number of elements)?",
      answer: "The algorithm degrades: the count array of size k takes O(k) space and O(k) time to initialize and traverse in the cumulative pass. If k >> n (e.g., 10 elements with values up to 10⁶), Counting Sort becomes far slower and more memory-hungry than O(n log n) comparison sorts, making it impractical for sparse value distributions."
    },
    {
      question: "How does Counting Sort handle negative numbers?",
      answer: "By offsetting every element by min_val before using it as an index: count[value − min_val]. This maps the actual value range [min_val, max_val] to the zero-based index range [0, k−1]. No special handling of negative values is needed beyond this offset, which is computed once at the start."
    },
    {
      question: "Can Counting Sort sort floating-point numbers? Why or why not?",
      answer: "No. Counting Sort requires element values to be non-negative integers (after offsetting) because they must serve as valid array indices. Floating-point numbers have an effectively infinite range of distinct values between any two bounds and cannot directly serve as integer indices without lossy rounding or a mapping step that changes the problem."
    },
    {
      question: "What is the role of the cumulative count array?",
      answer: "After the counting pass, count[i] holds how many times value (i + min) appears. The cumulative (prefix-sum) pass converts this into count[i] = number of elements with value ≤ (i + min). This tells us: before placing the next element of value v, decrement count[v−min] to get the correct 0-based output index. Without this prefix sum, we would not know where in the output array to place each element."
    },
    {
      question: "How does Counting Sort relate to Radix Sort?",
      answer: "Radix Sort uses Counting Sort as its stable sub-routine. Radix Sort processes digits from the least significant to the most significant, applying a stable Counting Sort on each digit position. Because Counting Sort is stable, the relative order established by earlier digit passes is preserved when later digit passes are applied, eventually producing a fully sorted result."
    }
  ]
};
