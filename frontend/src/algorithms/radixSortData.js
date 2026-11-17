/**
 * Curated educational reference content for Radix Sort.
 * Follows strict pedagogical order:
 * 1. Concept
 * 2. Intuition
 * 3. Real-world example
 * 4. Visual walkthrough
 * 5. Core concepts (LSD vs MSD, Radix/Base, Digit Extraction, Stability, Number of Passes)
 * 6. Algorithm steps
 * 7. Pseudocode
 * 8. C, Java, and Python implementations
 * 9. Time and space complexity
 * 10. Advantages, disadvantages, and edge cases
 * 11. Practice questions and viva questions
 */

export const radixSortContent = {
  concept: "Radix Sort is an efficient, non-comparison-based sorting algorithm for integers and keys that can be expressed as fixed-length digit sequences. Rather than comparing two numbers directly, it sorts numbers digit by digit, from the Least Significant Digit (LSD) up to the Most Significant Digit (MSD), using a stable sub-routine such as Counting Sort on each position. Because each digit is an integer within a fixed base b (such as decimal base 10 with digits 0 through 9), each pass runs in linear O(n + b) time. Repeating this across d digits gives an overall time complexity of O(d × (n + b)), outperforming O(n log n) comparison-based sorts when the digit count d is small relative to the number of elements n.",

  // 1. Intuition
  intuition: "Think about how mail is sorted by postal ZIP code or how punch cards were historically sorted. If you have a stack of 3-digit numbers like 170, 045, 075, 090, 802, 024, 002, 066: first, sort everyone into 10 bins based only on their last (ones) digit. Collect the bins in order. Next, sort that entire stack by their middle (tens) digit. Finally, sort the stack by their first (hundreds) digit. As long as each step is stable (meaning ties preserve the order established by earlier digits), the entire stack ends up completely sorted! You never once had to compare whether 170 is larger than 045.",

  // 2. Real-world example
  real_world_example: "1. Postal and Courier Sorting: Sorting mail by postal code digit by digit. First, packages are separated into 10 regional bins by the last digit of the ZIP code, then re-binned by the second-to-last digit, all the way to the first digit, yielding perfectly ordered delivery routes.\n2. Library Call Numbers: Organizing books by Dewey Decimal or Library of Congress numeric prefixes, grouping books section by section from specific sub-categories up to broad discipline shelves.\n3. Punch-Card Tabulating Machines: Herman Hollerith's mechanical card sorters for the 1890 US Census sorted physical cards into 10 pockets column by column (digit by digit), inventing the original physical LSD Radix Sort.\n4. Date Sorting: Sorting timestamps (YYYY-MM-DD) by first sorting days (01..31), then months (01..12), then years (YYYY) — exactly LSD sorting across multi-field composite keys.",

  // 3. Visual walkthrough
  visualization: `Given array: [170, 45, 75, 90, 802, 24, 2, 66]
Maximum number is 802 (3 digits: ones, tens, hundreds). Total passes = 3.

Pass 1 — Sort by ONES digit (exp = 1):
  Elements with ones digit highlighted:
  17[0] → digit 0
  04[5] → digit 5
  07[5] → digit 5
  09[0] → digit 0
  80[2] → digit 2
  02[4] → digit 4
  00[2] → digit 2
  06[6] → digit 6

  Count array for digits 0..9:
  Digit: 0  1  2  3  4  5  6  7  8  9
  Count: 2  0  2  0  1  2  1  0  0  0

  Stable output placement (right-to-left):
  Result after Pass 1: [170, 90, 802, 2, 24, 45, 75, 66]
  (Notice numbers ending in 0 come first, then 2, 4, 5, 6. 170 stayed before 90!).

Pass 2 — Sort by TENS digit (exp = 10):
  Elements with tens digit highlighted:
  1[7]0 → digit 7
  0[9]0 → digit 9
  8[0]2 → digit 0
  0[0]2 → digit 0
  0[2]4 → digit 2
  0[4]5 → digit 4
  0[7]5 → digit 7
  0[6]6 → digit 6

  Count array for digits 0..9:
  Digit: 0  1  2  3  4  5  6  7  8  9
  Count: 2  0  1  0  1  0  1  2  0  1

  Stable output placement (right-to-left):
  Result after Pass 2: [802, 2, 24, 45, 66, 170, 75, 90]
  (Tens digits are now 0, 0, 2, 4, 6, 7, 7, 9. 802 remained before 2!).

Pass 3 — Sort by HUNDREDS digit (exp = 100):
  Elements with hundreds digit highlighted:
  [8]02 → digit 8
  [0]02 → digit 0
  [0]24 → digit 0
  [0]45 → digit 0
  [0]66 → digit 0
  [1]70 → digit 1
  [0]75 → digit 0
  [0]90 → digit 0

  Count array for digits 0..9:
  Digit: 0  1  2  3  4  5  6  7  8  9
  Count: 6  1  0  0  0  0  0  0  1  0

  Stable output placement (right-to-left):
  Result after Pass 3: [2, 24, 45, 66, 75, 90, 170, 802]  ✓

Array is now fully sorted in 3 linear passes without any pairwise comparisons!`,

  // 4. Core concepts
  core_concepts: [
    "LSD vs MSD: Least Significant Digit (LSD) starts at the ones digit and works leftward toward the highest place value. Most Significant Digit (MSD) starts at the highest digit and recursively sorts buckets. LSD is the industry standard for fixed-radix integers because it sorts iteratively in-place without deep recursion.",
    "Radix / Base (b = 10): The base defines the number of unique digit symbols. In base 10 (decimal), digits range from 0 to 9, so the count array always has a fixed size of 10. For binary or byte-level sorting, base 256 (8 bits per digit) is often used for maximum CPU cache efficiency.",
    "Digit Extraction Formula: For any non-negative integer x and digit position exp (1 for ones, 10 for tens, 100 for hundreds), the digit is computed in O(1) via: digit = floor(x / exp) % 10. Numbers with fewer digits naturally yield 0 for higher positions (e.g., 42 at exp=100 gives floor(42/100) % 10 = 0).",
    "Why Stability is Mandatory: LSD Radix Sort completely relies on stable digit passes. When sorting by the tens place, two numbers with the same tens digit (e.g., 170 and 75, both having tens digit 7) must keep their relative order from the ones pass (where 0 < 5). An unstable sub-sort would destroy the order achieved by earlier digits, producing an unsorted array.",
    "Number of Passes (d): The total number of passes equals the number of digits in the maximum element: d = floor(log10(max_val)) + 1. If max = 802, d = 3 passes. When d is fixed or bounded, Radix Sort runs in linear O(n) time."
  ],

  // 5. Algorithm steps
  algorithm: [
    "1. Input Validation: Verify the input contains non-negative integers. Return immediately if the array has 0 or 1 element.",
    "2. Find Maximum: Scan the array once to find the maximum element (max_val). This determines how many digit places exist (d = floor(log10(max_val)) + 1).",
    "3. Initialize Exponent: Set exp = 1 (representing the 1s place).",
    "4. Stable Counting Pass: Run counting sort on the current digit position exp:\n   a. Initialize a count array of size 10 to zeros.\n   b. Count frequencies: for each num, increment count[floor(num / exp) % 10].\n   c. Build cumulative prefix sums: count[i] += count[i - 1] for i from 1 to 9.\n   d. Place into output (right-to-left): walk the input backward from n - 1 down to 0, decrement count[digit], and assign output[count[digit]] = num.\n   e. Copy output back to the original array.",
    "5. Advance Exponent: Multiply exp by 10 (moving to 10s, 100s, 1000s, etc.).",
    "6. Loop Condition: Repeat steps 4 and 5 while floor(max_val / exp) > 0.",
    "7. Completion: When exp exceeds max_val, the array is fully sorted in ascending order."
  ],

  // 6. Pseudocode
  pseudocode: `function radixSort(numbers):
    n = length of numbers
    if n <= 1: return

    // Step 1: Find the maximum value
    max_val = max(numbers)

    // Step 2: Perform counting sort for every digit position
    exp = 1  // 1s, 10s, 100s, ...
    while floor(max_val / exp) > 0:
        countingSortByDigit(numbers, n, exp)
        exp = exp * 10

function countingSortByDigit(numbers, n, exp):
    count = array of 10 zeros
    output = array of size n

    // 1. Tally digit frequencies
    for i from 0 to n - 1:
        digit = floor(numbers[i] / exp) % 10
        count[digit] += 1

    // 2. Accumulate prefix sums
    for d from 1 to 9:
        count[d] += count[d - 1]

    // 3. Place elements right-to-left for stability
    for i from n - 1 down to 0:
        digit = floor(numbers[i] / exp) % 10
        count[digit] -= 1
        output[count[digit]] = numbers[i]

    // 4. Copy back to original array
    for i from 0 to n - 1:
        numbers[i] = output[i]`,

  // 7. C, Java, and Python implementations
  implementations: {
    c: {
      language: "c",
      label: "C",
      code: `#include <stdio.h>
#include <stdlib.h>

// Helper: Find the maximum value in an array
int get_max(int numbers[], int size) {
    int max_val = numbers[0];
    for (int i = 1; i < size; i++) {
        if (numbers[i] > max_val) {
            max_val = numbers[i];
        }
    }
    return max_val;
}

// Stable counting sort by specific digit place (exp = 1, 10, 100, ...)
void count_sort_by_digit(int numbers[], int size, int exp) {
    int output[size];
    int count[10] = {0};

    // Step 1: Count digit frequencies (base 10)
    for (int i = 0; i < size; i++) {
        int digit = (numbers[i] / exp) % 10;
        count[digit]++;
    }

    // Step 2: Build cumulative counts
    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // Step 3: Place elements right-to-left to preserve stability
    for (int i = size - 1; i >= 0; i--) {
        int digit = (numbers[i] / exp) % 10;
        output[count[digit] - 1] = numbers[i];
        count[digit]--;
    }

    // Step 4: Copy sorted output back to numbers array
    for (int i = 0; i < size; i++) {
        numbers[i] = output[i];
    }
}

// Main LSD Radix Sort function
void radix_sort(int numbers[], int size) {
    if (size <= 1) return;

    // Find the maximum number to determine digit count
    int max_val = get_max(numbers, size);

    // Apply counting sort for each digit position: 1s, 10s, 100s, ...
    for (int exp = 1; max_val / exp > 0; exp *= 10) {
        count_sort_by_digit(numbers, size, exp);
    }
}

// Backward-compatible camelCase wrapper
void radixSort(int numbers[], int size) {
    radix_sort(numbers, size);
}

int main(void) {
    int numbers[] = {170, 45, 75, 90, 802, 24, 2, 66};
    int size = sizeof(numbers) / sizeof(numbers[0]);

    radix_sort(numbers, size);

    printf("Sorted array: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\\n");
    return 0;
}`,
      code_explanation: "1. `get_max(numbers, size)`: Scans the array once in O(n) time to identify the largest number, which dictates the number of passes.\n2. `count_sort_by_digit(numbers, size, exp)`: Sub-routine sorting elements by their digit at place `exp` (1s, 10s, 100s).\n3. `int digit = (numbers[i] / exp) % 10`: Extracts the single digit at position `exp` in base 10.\n4. `count[10]`: Fixed 10-bucket frequency array for digits 0 through 9.\n5. Right-to-left placement (`for (int i = size - 1; i >= 0; i--)`): Crucial for stability — ensures that equal digits keep their existing relative ordering.\n6. `for (int exp = 1; max_val / exp > 0; exp *= 10)`: Advances through each digit position until all digits in `max_val` are processed.",
      codeLines: [
        { line: 1, text: "void radix_sort(int numbers[], int size) {" },
        { line: 2, text: "    int max_val = get_max(numbers, size); // Find maximum element" },
        { line: 3, text: "    for (int exp = 1; max_val / exp > 0; exp *= 10) {" },
        { line: 4, text: "        // --- Stable counting sort by digit place exp ---" },
        { line: 5, text: "        int count[10] = {0}, output[size];" },
        { line: 6, text: "        for (int i = 0; i < size; i++) count[(numbers[i] / exp) % 10]++;" },
        { line: 7, text: "        for (int i = 1; i < 10; i++) count[i] += count[i - 1];" },
        { line: 8, text: "        for (int i = size - 1; i >= 0; i--) {" },
        { line: 9, text: "            int digit = (numbers[i] / exp) % 10;" },
        { line: 10, text: "            output[--count[digit]] = numbers[i]; // Stable placement" },
        { line: 11, text: "        }" },
        { line: 12, text: "        for (int i = 0; i < size; i++) numbers[i] = output[i]; // Copy back" },
        { line: 13, text: "    }" },
        { line: 14, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "empty") return null;
        if (step.phase === "initial") return 1;
        if (step.phase === "find_max") return 2;
        if (step.phase === "pass_start") return 3;
        if (step.phase === "counting" || step.phase === "counting_complete") return 6;
        if (step.phase === "cumulative") return 7;
        if (step.phase === "placing") return 10;
        if (step.phase === "copyback" || step.phase === "pass_complete") return 12;
        if (step.finished || step.phase === "complete") return 14;
        return 1;
      }
    },

    java: {
      language: "java",
      label: "Java",
      code: `import java.util.Arrays;

public class RadixSort {
    // Helper: Find the maximum value in the array
    private static int getMax(int[] numbers) {
        int max = numbers[0];
        for (int num : numbers) {
            if (num > max) {
                max = num;
            }
        }
        return max;
    }

    // Stable counting sort by specific digit place (exp = 1, 10, 100, ...)
    private static void countSortByDigit(int[] numbers, int exp) {
        int n = numbers.length;
        int[] output = new int[n];
        int[] count = new int[10]; // Digits 0 through 9

        // Step 1: Count digit frequencies
        for (int i = 0; i < n; i++) {
            int digit = (numbers[i] / exp) % 10;
            count[digit]++;
        }

        // Step 2: Build cumulative counts
        for (int i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        // Step 3: Place elements right-to-left for stability
        for (int i = n - 1; i >= 0; i--) {
            int digit = (numbers[i] / exp) % 10;
            output[count[digit] - 1] = numbers[i];
            count[digit]--;
        }

        // Step 4: Copy sorted output back to numbers array
        System.arraycopy(output, 0, numbers, 0, n);
    }

    // Main LSD Radix Sort method
    public static void radixSort(int[] numbers) {
        if (numbers == null || numbers.length <= 1) return;

        // Find the maximum value to determine number of digits
        int max = getMax(numbers);

        // Apply counting sort for each digit position: 1s, 10s, 100s, ...
        for (int exp = 1; max / exp > 0; exp *= 10) {
            countSortByDigit(numbers, exp);
        }
    }

    public static void main(String[] args) {
        int[] numbers = {170, 45, 75, 90, 802, 24, 2, 66};
        radixSort(numbers);
        System.out.println("Sorted array: " + Arrays.toString(numbers));
    }
}`,
      code_explanation: "1. `getMax(numbers)`: Finds the maximum element in O(n) time to determine total digit count.\n2. `countSortByDigit(numbers, exp)`: Stably sorts elements based on the digit at position `exp`.\n3. `int digit = (numbers[i] / exp) % 10`: Extracts the digit (0..9) at position `exp`.\n4. `int[] count = new int[10]`: Base 10 digit frequencies.\n5. Right-to-left traversal preserves relative order of duplicate digits, keeping the algorithm stable across passes.\n6. `System.arraycopy(...)`: Efficiently transfers the stable output buffer back to the original array.\n7. `for (int exp = 1; max / exp > 0; exp *= 10)`: Loops until all digit places have been processed.",
      codeLines: [
        { line: 1, text: "public static void radixSort(int[] numbers) {" },
        { line: 2, text: "    int max = getMax(numbers); // Find maximum number" },
        { line: 3, text: "    for (int exp = 1; max / exp > 0; exp *= 10) {" },
        { line: 4, text: "        // --- Stable counting sort by digit place exp ---" },
        { line: 5, text: "        int[] count = new int[10], output = new int[numbers.length];" },
        { line: 6, text: "        for (int num : numbers) count[(num / exp) % 10]++;" },
        { line: 7, text: "        for (int i = 1; i < 10; i++) count[i] += count[i - 1];" },
        { line: 8, text: "        for (int i = numbers.length - 1; i >= 0; i--) {" },
        { line: 9, text: "            int digit = (numbers[i] / exp) % 10;" },
        { line: 10, text: "            output[--count[digit]] = numbers[i]; // Stable placement" },
        { line: 11, text: "        }" },
        { line: 12, text: "        System.arraycopy(output, 0, numbers, 0, numbers.length);" },
        { line: 13, text: "    }" },
        { line: 14, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "empty") return null;
        if (step.phase === "initial") return 1;
        if (step.phase === "find_max") return 2;
        if (step.phase === "pass_start") return 3;
        if (step.phase === "counting" || step.phase === "counting_complete") return 6;
        if (step.phase === "cumulative") return 7;
        if (step.phase === "placing") return 10;
        if (step.phase === "copyback" || step.phase === "pass_complete") return 12;
        if (step.finished || step.phase === "complete") return 14;
        return 1;
      }
    },

    python: {
      language: "python",
      label: "Python",
      code: `def count_sort_by_digit(numbers: list[int], exp: int) -> None:
    """Stably sorts numbers by the digit at position exp (1, 10, 100, ...)."""
    n = len(numbers)
    output = [0] * n
    count = [0] * 10  # Base 10 digit frequencies

    # Step 1: Count digit frequencies
    for num in numbers:
        digit = (num // exp) % 10
        count[digit] += 1

    # Step 2: Build cumulative counts
    for i in range(1, 10):
        count[i] += count[i - 1]

    # Step 3: Place elements right-to-left for stability
    for i in range(n - 1, -1, -1):
        num = numbers[i]
        digit = (num // exp) % 10
        count[digit] -= 1
        output[count[digit]] = num

    # Step 4: Copy sorted output back to numbers array
    numbers[:] = output


def radix_sort(numbers: list[int]) -> list[int]:
    """Sorts a list of non-negative integers using LSD Radix Sort."""
    if not numbers or len(numbers) <= 1:
        return numbers

    # Find the maximum value to determine number of digits
    max_val = max(numbers)

    # Process each digit place: 1s, 10s, 100s, ...
    exp = 1
    while max_val // exp > 0:
        count_sort_by_digit(numbers, exp)
        exp *= 10

    return numbers


if __name__ == "__main__":
    numbers = [170, 45, 75, 90, 802, 24, 2, 66]
    radix_sort(numbers)
    print("Sorted array:", numbers)`,
      code_explanation: "1. `max(numbers)`: Finds maximum value in O(n) time.\n2. `(num // exp) % 10`: Extracts the digit at position `exp` using integer division and modulo 10.\n3. `count = [0] * 10`: Bucket counts for decimal digits 0 to 9.\n4. `range(n - 1, -1, -1)`: Traverses the list backward, placing duplicates in decreasing output indices to guarantee stability.\n5. `numbers[:] = output`: In-place slice assignment updates the caller's list.\n6. `while max_val // exp > 0`: Runs exactly d passes, where d is the number of digits in `max_val`.",
      codeLines: [
        { line: 1, text: "def radix_sort(numbers: list[int]) -> list[int]:" },
        { line: 2, text: "    max_val = max(numbers); exp = 1" },
        { line: 3, text: "    while max_val // exp > 0:" },
        { line: 4, text: "        count = [0] * 10; output = [0] * len(numbers)" },
        { line: 5, text: "        for num in numbers: count[(num // exp) % 10] += 1" },
        { line: 6, text: "        for i in range(1, 10): count[i] += count[i - 1]" },
        { line: 7, text: "        for num in reversed(numbers):" },
        { line: 8, text: "            digit = (num // exp) % 10" },
        { line: 9, text: "            count[digit] -= 1; output[count[digit]] = num" },
        { line: 10, text: "        numbers[:] = output; exp *= 10" },
        { line: 11, text: "    return numbers" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "empty") return null;
        if (step.phase === "initial") return 1;
        if (step.phase === "find_max") return 2;
        if (step.phase === "pass_start") return 3;
        if (step.phase === "counting" || step.phase === "counting_complete") return 5;
        if (step.phase === "cumulative") return 6;
        if (step.phase === "placing") return 9;
        if (step.phase === "copyback" || step.phase === "pass_complete") return 10;
        if (step.finished || step.phase === "complete") return 11;
        return 1;
      }
    }
  },

  // 9. Time and space complexity
  complexity: {
    best: "O(d × (n + b))",
    average: "O(d × (n + b))",
    worst: "O(d × (n + b))",
    space: "O(n + b)"
  },

  complexity_explanation: {
    time: "Time Complexity is O(d × (n + b)) in all cases (Best, Average, Worst):\n• d is the number of digits in the largest number (d = floor(log_b(max)) + 1).\n• n is the number of elements in the array.\n• b is the numerical base (b = 10 for standard decimal numbers).\n\nEach digit pass uses Counting Sort, which takes O(n + b) time (O(n) to inspect elements + O(b) to process the count buckets). Repeating this for all d digit places yields O(d × (n + b)). When d is constant (e.g. 32-bit integers with a fixed number of digits), Radix Sort runs in linear O(n) time, beating comparison sorts like Quick Sort and Merge Sort (O(n log n)).",
    space: "Auxiliary Space is O(n + b):\n• O(n) space is required for the output placement array buffer to store elements during each digit pass.\n• O(b) space is required for the digit frequency count array (size 10 for decimal numbers).\n• Radix Sort is therefore not an in-place sort, as it requires extra buffer memory proportional to array size and radix base."
  },

  properties: {
    stability: "Stable — The right-to-left placement pass guarantees that equal digits preserve their relative input order from prior passes.",
    in_place: "Not In-Place — Requires an auxiliary output array of size n and a count array of size b (10)."
  },

  // 10. Advantages, disadvantages, and edge cases
  advantages: [
    "Linear time performance: Runs in O(d × (n + b)) which reduces to linear O(n) time when the key length d is bounded, outperforming Ω(n log n) comparison-based sorts.",
    "Completely non-comparison: Avoids costly element-to-element comparisons; works purely via arithmetic digit extraction and bucket indexing.",
    "Guaranteed stability: Preserves the original relative order of duplicate elements, making it ideal for multi-key sorting (such as sorting by last name, then first name).",
    "Predictable runtime: Execution steps depend solely on digit count and array size, completely avoiding pathological worst-case slowdowns like Quick Sort's O(n²)."
  ],

  disadvantages: [
    "Auxiliary memory overhead: Requires extra memory for both the output array (size n) and the frequency array (size b).",
    "Restricted key formats: Only directly supports fixed-radix keys (non-negative integers, fixed-length strings). Sorting floating-point numbers or negative integers requires complex sign-bit transformations.",
    "Cache locality and constant factors: High constant overhead due to repeated full-array passes; for small datasets or large d, a well-tuned Quick Sort is often faster in practice."
  ],

  edge_cases: [
    "Single element array [42]: Handled immediately as already sorted.",
    "Numbers with varying digit lengths (e.g., [2, 45, 802]): Numbers with fewer digits naturally evaluate to 0 for higher place values, sorting correctly without manual string padding.",
    "Array containing zeros [0, 5, 20]: Zeros are handled naturally at index 0 of the count array.",
    "All identical elements [77, 77, 77]: Correctly processed through all digit passes with stable placement.",
    "Very large maximum element: A large outlier (e.g. one 9-digit number with 1-digit numbers) increases the total passes d for all elements, adding overhead."
  ],

  // 11. Practice questions and viva questions
  practice: "Trace LSD Radix Sort on [170, 45, 75, 90, 802, 24, 2, 66]: write down the output array after Pass 1 (ones place), Pass 2 (tens place), and Pass 3 (hundreds place).",

  viva_questions: [
    {
      question: "Why is Radix Sort able to sort in O(n) time, beating the Ω(n log n) lower bound?",
      answer: "The Ω(n log n) lower bound applies strictly to comparison-based sorting algorithms (which use binary decision trees based on comparisons). Radix Sort is non-comparison-based: it inspects individual digits directly and uses counting/addressing, allowing linear time O(d × (n + b))."
    },
    {
      question: "What is the difference between LSD Radix Sort and MSD Radix Sort?",
      answer: "LSD (Least Significant Digit) processes keys from right to left (ones to highest place) iteratively across the entire array using stable counting sort. MSD (Most Significant Digit) processes from left to right and recursively divides keys into sub-buckets, which requires recursion and handling variable-sized partitions."
    },
    {
      question: "Why MUST the intermediate sorting algorithm in LSD Radix Sort be stable?",
      answer: "If the intermediate pass were not stable, ties on the current digit would reorder elements arbitrarily, destroying the sorted ordering established by previous (less significant) digits. Stability guarantees that elements with identical current digits remain ordered according to their earlier digits."
    },
    {
      question: "How does Radix Sort extract the digit at position exp?",
      answer: "Using integer arithmetic: digit = floor(number / exp) % 10. For example, to get the tens digit of 842: floor(842 / 10) = 84, and 84 % 10 = 4."
    },
    {
      question: "Why does Radix Sort require non-negative integers in its standard form?",
      answer: "Negative numbers produce negative digits when evaluated with modulo arithmetic (e.g. -45 % 10 = -5), which cannot be used as non-negative array indices in the count array. Supporting negative numbers requires either separating them into positive/negative lists or offsetting all numbers by the absolute minimum."
    }
  ],

  // Backward-compatible getters
  get code() {
    return this.implementations.java.code;
  },
  get code_explanation() {
    return this.implementations.java.code_explanation;
  }
};
