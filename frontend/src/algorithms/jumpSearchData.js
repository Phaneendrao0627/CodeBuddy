/**
 * Curated educational reference content for Jump Search.
 * Provides complete, idiomatic implementations and explanations for C, Java, and Python.
 */
export const jumpSearchContent = {
  concept: "Jump Search (also known as Block Search) is an efficient searching algorithm for sorted arrays. Instead of checking every item sequentially (like Linear Search) or halving the interval repeatedly (like Binary Search), Jump Search skips ahead by a fixed block size m = floor(sqrt(n)). Once it finds a block boundary whose value is greater than or equal to the target, it performs a linear search backwards within that specific block to pinpoint the target.",
  intuition: "Imagine searching for a chapter in an encyclopedia volume. Instead of flipping page by page from the start, you skip ahead by 10 pages at a time. As soon as you overshoot the chapter you want, you flip back page by page through the previous 10-page chunk. Skipping in blocks drastically reduces the number of pages you have to inspect.",
  real_world_example: "Locating a chapter in a 500-page book by checking every 20th page (pages 20, 40, 60, ...), finding a house number on an evenly spaced street by checking street corner numbers before walking down the block, or locating a record in a sorted disk file organized into fixed blocks.",
  prerequisites: "Prerequisite: The array MUST be sorted in ascending order. If the array is unsorted, block boundaries cannot guarantee that the target is contained within the current or previous block, causing the algorithm to skip over the target and fail.",
  visualization: "Array: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144], n = 13, Target: 55\nJump size m = floor(sqrt(13)) = 3\nJump 1: Check index 2 (value = 1) -> 1 < 55 (keep jumping)\nJump 2: Check index 5 (value = 5) -> 5 < 55 (keep jumping)\nJump 3: Check index 8 (value = 21) -> 21 < 55 (keep jumping)\nJump 4: Check index 11 (value = 89) -> 89 >= 55 (Target must be in block [8 to 11]!)\nLinear Scan inside block [8 to 11]:\n  Check index 8: 21 != 55\n  Check index 9: 34 != 55\n  Check index 10: 55 == 55 -> Target found at index 10!",
  algorithm: [
    "1. Verify that the array is sorted in ascending order. If length n == 0, return -1.",
    "2. Calculate the optimal jump block size: m = floor(sqrt(n)).",
    "3. Initialize prev = 0 (start of block) and step = m (end boundary of block).",
    "4. Block Jumping Phase: While numbers[min(step, n) - 1] < target:",
    "   a. Set prev = step.",
    "   b. Advance step = step + m.",
    "   c. If prev >= n, the target exceeds all elements; return -1.",
    "5. Linear Scan Phase: The target, if present, must lie in the block [prev, min(step, n) - 1].",
    "   a. While numbers[prev] < target, increment prev by 1.",
    "   b. If prev == min(step, n), the target is not in this block; return -1.",
    "6. Check if numbers[prev] == target. If true, return prev. Otherwise, return -1."
  ],
  pseudocode: `function jumpSearch(numbers, target):
    n = length(numbers)
    if n == 0:
        return -1

    m = floor(sqrt(n))
    prev = 0
    step = m

    // Block Jumping Phase
    while numbers[min(step, n) - 1] < target:
        prev = step
        step = step + m
        if prev >= n:
            return -1

    // Linear Scan Phase
    while numbers[prev] < target:
        prev = prev + 1
        if prev == min(step, n):
            return -1

    if numbers[prev] == target:
        return prev

    return -1`,

  implementations: {
    c: {
      language: "c",
      label: "C",
      code: `#include <math.h>
#include <stdio.h>

/**
 * Searches for target in a sorted integer array using Jump Search.
 * In C, array size must be passed explicitly.
 * Returns 0-based index if found, or -1 if absent.
 */
int jumpSearch(const int numbers[], int size, int target) {
    if (size <= 0) return -1;

    // Optimal jump step size: floor(sqrt(n))
    int step = (int)floor(sqrt(size));
    int prev = 0;

    // Block Jumping Phase: jump forward while boundary element < target
    while (numbers[(step < size ? step : size) - 1] < target) {
        prev = step;
        step += (int)floor(sqrt(size));
        if (prev >= size) {
            return -1; // Target exceeds all elements
        }
    }

    // Linear Scan Phase: scan forward inside block [prev, min(step, size) - 1]
    int limit = step < size ? step : size;
    while (numbers[prev] < target) {
        prev++;
        if (prev == limit) {
            return -1; // Target not found in block
        }
    }

    // Equality Check: check if element at prev matches target
    if (numbers[prev] == target) {
        return prev; // Target found
    }

    return -1; // Target not found
}

int main(void) {
    int numbers[] = {0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    int target = 55;
    int result = jumpSearch(numbers, size, target);

    if (result != -1) {
        printf("Target found at index: %d\\n", result);
    } else {
        printf("Target not found\\n");
    }
    return 0;
}`,
      code_explanation: "1. `size` is explicitly passed as C arrays decay to pointers and cannot self-report length.\n2. `int step = (int)floor(sqrt(size));` computes the optimal block size m using `<math.h>`.\n3. The block jumping `while` loop checks the boundary element `numbers[min(step, size) - 1]`. While it is less than target, `prev` updates to `step` and `step` advances by `sqrt(size)`.\n4. If `prev >= size`, the target is greater than all elements and `-1` is returned.\n5. Once the candidate block is bounded, the linear scan `while (numbers[prev] < target)` walks forward index by index.\n6. If `prev` reaches `limit`, the target is absent from the block.\n7. Finally, `if (numbers[prev] == target)` returns the matching index, or returns `-1` if absent.",
      codeLines: [
        { line: 1, text: "int step = (int)floor(sqrt(size)), prev = 0;" },
        { line: 2, text: "while (numbers[(step < size ? step : size) - 1] < target) {" },
        { line: 3, text: "    prev = step;" },
        { line: 4, text: "    step += (int)floor(sqrt(size));" },
        { line: 5, text: "    if (prev >= size) return -1;" },
        { line: 6, text: "}" },
        { line: 7, text: "while (numbers[prev] < target) {" },
        { line: 8, text: "    prev++;" },
        { line: 9, text: "    if (prev == (step < size ? step : size)) return -1;" },
        { line: 10, text: "}" },
        { line: 11, text: "if (numbers[prev] == target) return prev;" },
        { line: 12, text: "return -1;" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "initial") return 1;
        if (step.phase === "block_jump") return 2;
        if (step.phase === "block_found") return 6;
        if (step.phase === "linear_scan") return 7;
        if (step.phase === "found") return 11;
        if (step.phase === "not_found") return 12;
        return 1;
      }
    },

    java: {
      language: "java",
      label: "Java",
      code: `public class JumpSearch {
    /**
     * Searches for target in a sorted integer array using Jump Search.
     * Returns 0-based index if found, or -1 if absent.
     */
    public static int jumpSearch(int[] numbers, int target) {
        int n = numbers.length;
        if (n == 0) return -1;

        // Optimal jump step size: floor(sqrt(n))
        int step = (int) Math.floor(Math.sqrt(n));
        int prev = 0;

        // Block Jumping Phase: jump forward while boundary element < target
        while (numbers[Math.min(step, n) - 1] < target) {
            prev = step;
            step += (int) Math.floor(Math.sqrt(n));
            if (prev >= n) {
                return -1; // Target exceeds all elements
            }
        }

        // Linear Scan Phase: scan forward inside block [prev, min(step, n) - 1]
        while (numbers[prev] < target) {
            prev++;
            if (prev == Math.min(step, n)) {
                return -1; // Target not found in block
            }
        }

        // Equality Check: check if element at prev matches target
        if (numbers[prev] == target) {
            return prev; // Target found
        }

        return -1; // Target not found
    }

    public static void main(String[] args) {
        int[] numbers = {0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144};
        int target = 55;
        int result = jumpSearch(numbers, target);

        if (result != -1) {
            System.out.println("Target found at index: " + result);
        } else {
            System.out.println("Target not found");
        }
    }
}`,
      code_explanation: "1. `int n = numbers.length;` retrieves the array length; empty arrays immediately return `-1`.\n2. `int step = (int) Math.floor(Math.sqrt(n));` computes the optimal jump step m.\n3. The block jumping loop examines `numbers[Math.min(step, n) - 1] < target`. `Math.min` prevents indexing beyond array bounds in the final block.\n4. When a block boundary meets or exceeds the target, jumping ceases.\n5. The linear scan iterates from `prev` up to the block boundary `Math.min(step, n)`.\n6. If `numbers[prev] == target`, returns the matching index (and returns the first occurrence when duplicates exist).\n7. If no match is found, returns `-1`.",
      codeLines: [
        { line: 1, text: "int step = (int) Math.floor(Math.sqrt(n)), prev = 0;" },
        { line: 2, text: "while (numbers[Math.min(step, n) - 1] < target) {" },
        { line: 3, text: "    prev = step;" },
        { line: 4, text: "    step += (int) Math.floor(Math.sqrt(n));" },
        { line: 5, text: "    if (prev >= n) return -1;" },
        { line: 6, text: "}" },
        { line: 7, text: "while (numbers[prev] < target) {" },
        { line: 8, text: "    prev++;" },
        { line: 9, text: "    if (prev == Math.min(step, n)) return -1;" },
        { line: 10, text: "}" },
        { line: 11, text: "if (numbers[prev] == target) return prev;" },
        { line: 12, text: "return -1;" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "initial") return 1;
        if (step.phase === "block_jump") return 2;
        if (step.phase === "block_found") return 6;
        if (step.phase === "linear_scan") return 7;
        if (step.phase === "found") return 11;
        if (step.phase === "not_found") return 12;
        return 1;
      }
    },

    python: {
      language: "python",
      label: "Python",
      code: `import math

def jump_search(numbers: list[int], target: int) -> int:
    """
    Searches for target in a sorted list using Jump Search.
    Returns 0-based index if found, or -1 if absent.
    """
    n = len(numbers)
    if n == 0:
        return -1

    # Optimal jump step size: floor(sqrt(n))
    step = int(math.floor(math.sqrt(n)))
    prev = 0

    # Block Jumping Phase: jump forward while boundary element < target
    while numbers[min(step, n) - 1] < target:
        prev = step
        step += int(math.floor(math.sqrt(n)))
        if prev >= n:
            return -1  # Target exceeds all elements

    # Linear Scan Phase: scan forward inside block [prev, min(step, n) - 1]
    while numbers[prev] < target:
        prev += 1
        if prev == min(step, n):
            return -1  # Target not found in block

    # Equality Check: check if element at prev matches target
    if numbers[prev] == target:
        return prev  # Target found

    return -1  # Target not found


if __name__ == "__main__":
    numbers = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
    target = 55
    result = jump_search(numbers, target)

    if result != -1:
        print(f"Target found at index: {result}")
    else:
        print("Target not found")`,
      code_explanation: "1. `n = len(numbers)` checks list length; returns `-1` immediately if empty.\n2. `int(math.floor(math.sqrt(n)))` computes the block jump step using standard Python math library functions.\n3. `while numbers[min(step, n) - 1] < target:` steps forward block by block. `min(step, n)` guards against `IndexError` on the trailing block.\n4. Once the target is bounded, `while numbers[prev] < target:` scans within the identified slice.\n5. If `numbers[prev] == target`, returns the matching index.\n6. If the block boundary is crossed without a match, returns `-1`.",
      codeLines: [
        { line: 1, text: "step = int(math.floor(math.sqrt(n))), prev = 0" },
        { line: 2, text: "while numbers[min(step, n) - 1] < target:" },
        { line: 3, text: "    prev = step" },
        { line: 4, text: "    step += int(math.floor(math.sqrt(n)))" },
        { line: 5, text: "    if prev >= n: return -1" },
        { line: 6, text: "while numbers[prev] < target:" },
        { line: 7, text: "    prev += 1" },
        { line: 8, text: "    if prev == min(step, n): return -1" },
        { line: 9, text: "if numbers[prev] == target: return prev" },
        { line: 10, text: "return -1" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "initial") return 1;
        if (step.phase === "block_jump") return 2;
        if (step.phase === "block_found") return 5;
        if (step.phase === "linear_scan") return 6;
        if (step.phase === "found") return 9;
        if (step.phase === "not_found") return 10;
        return 1;
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
    best: "O(1)",
    average: "O(√n)",
    worst: "O(√n)",
    space: "O(1)"
  },
  advantages: [
    "Significantly faster than Linear Search (O(√n) vs O(n)).",
    "Requires only jumping forward and a backward linear pass; unlike Binary Search, it does not need bidirectional random access. This makes Jump Search ideal for systems where jumping backwards is expensive or slow (e.g. forward-only file streams or tape drives).",
    "Simpler to implement and debug than complex tree structures or interpolated lookups."
  ],
  disadvantages: [
    "Slower than Binary Search (O(√n) vs O(log n)) for large in-memory arrays.",
    "Strictly requires the array to be sorted beforehand."
  ],
  common_mistakes: [
    "Applying Jump Search to an unsorted array, which invalidates the block boundary property.",
    "Using a fixed step size like m = 10 instead of m = floor(sqrt(n)), which fails to achieve optimal O(√n) complexity for arbitrary array sizes.",
    "IndexOutOfBounds errors when checking numbers[step - 1] in the last block without using min(step, n).",
    "Forgetting that if prev >= n during block jumping, the target is definitely absent."
  ],
  practice: "Given a sorted array of 16 elements, calculate the optimal jump size m, trace which indices are checked when searching for 42, and count the total comparisons."
};
