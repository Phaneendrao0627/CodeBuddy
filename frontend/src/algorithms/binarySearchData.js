/**
 * Curated educational reference content for Binary Search.
 * Provides complete, idiomatic implementations and explanations for C, Java, and Python.
 */
export const binarySearchContent = {
  concept: "Binary Search is an efficient divide-and-conquer algorithm used to find the index of a target element within a sorted array. Instead of checking every item sequentially, it compares the target with the middle element and halves the remaining search interval at each step.",
  intuition: "Think of looking up a name in a printed telephone directory. You open the book at the approximate middle. If the name you are seeking comes alphabetically after the middle page, you ignore the entire first half and open to the middle of the second half. You repeat this halving process until you locate the name.",
  real_world_example: "Finding a contact in an alphabetically sorted contact list, searching for a word in a dictionary, or database B-Tree index lookups which partition sorted blocks on disk.",
  visualization: "Array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], Target: 23\nStep 1: low = 0, high = 9, mid = 4 (value = 16). 23 > 16 -> search right half [23, 38, 56, 72, 91]\nStep 2: low = 5, high = 9, mid = 7 (value = 56). 23 < 56 -> search left half [23, 38]\nStep 3: low = 5, high = 6, mid = 5 (value = 23). 23 == 23 -> Target found at index 5!",
  algorithm: [
    "1. Initialize low = 0 and high = numbers.length - 1.",
    "2. While low <= high:",
    "   a. Compute mid = low + (high - low) / 2 to prevent overflow.",
    "   b. If numbers[mid] == target, return mid (target found).",
    "   c. If numbers[mid] < target, set low = mid + 1 (search right half).",
    "   d. If numbers[mid] > target, set high = mid - 1 (search left half).",
    "3. If low > high, return -1 (target does not exist in array)."
  ],
  pseudocode: `function binarySearch(numbers, target):
    low = 0
    high = length(numbers) - 1

    while low <= high:
        mid = low + (high - low) / 2

        if numbers[mid] == target:
            return mid
        else if numbers[mid] < target:
            low = mid + 1
        else:
            high = mid - 1

    return -1`,

  implementations: {
    c: {
      language: "c",
      label: "C",
      code: `#include <stdio.h>

/**
 * Searches for target in a sorted integer array using Binary Search.
 * In C, array size must be passed explicitly as arrays decay to pointers.
 * Returns 0-based index if found, or -1 if absent.
 */
int binarySearch(const int numbers[], int size, int target) {
    int low = 0;
    int high = size - 1;

    while (low <= high) {
        // Safe midpoint calculation avoiding integer overflow
        int mid = low + (high - low) / 2;

        if (numbers[mid] == target) {
            return mid; // Target found
        } else if (numbers[mid] < target) {
            low = mid + 1; // Discard left half
        } else {
            high = mid - 1; // Discard right half
        }
    }

    return -1; // Target not found
}

int main(void) {
    int numbers[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    int target = 23;
    int result = binarySearch(numbers, size, target);

    if (result != -1) {
        printf("Target found at index: %d\\n", result);
    } else {
        printf("Target not found\\n");
    }
    return 0;
}`,
      code_explanation: "1. The function accepts `const int numbers[]`, array `size`, and `target`. In C, arrays decay to pointers when passed into functions, so the length cannot be queried inside the function and must be supplied by the caller.\n2. `low` is initialized to 0 and `high` to `size - 1`.\n3. The `while (low <= high)` loop continues as long as there is at least one candidate element.\n4. `int mid = low + (high - low) / 2` calculates the midpoint safely without integer overflow risk.\n5. If `numbers[mid] == target`, `mid` is returned immediately.\n6. If `numbers[mid] < target`, the target must reside in the upper partition, so `low = mid + 1`.\n7. Otherwise, `high = mid - 1` restricts the search to the lower partition.\n8. If `low > high`, the loop terminates and `-1` is returned to indicate absence.",
      codeLines: [
        { line: 1, text: "int low = 0, high = size - 1;" },
        { line: 2, text: "while (low <= high) {" },
        { line: 3, text: "    int mid = low + (high - low) / 2;" },
        { line: 4, text: "    if (numbers[mid] == target)" },
        { line: 5, text: "        return mid; // Found!" },
        { line: 6, text: "    else if (numbers[mid] < target)" },
        { line: 7, text: "        low = mid + 1; // Search right half" },
        { line: 8, text: "    else" },
        { line: 9, text: "        high = mid - 1; // Search left half" },
        { line: 10, text: "}" },
        { line: 11, text: "return -1; // Not found" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "initial") return 1;
        if (step.phase === "found") return 5;
        if (step.phase === "not_found") return 11;
        if (step.phase === "comparing") {
          return step.comparedValue < step.target ? 7 : 9;
        }
        return 3;
      }
    },

    java: {
      language: "java",
      label: "Java",
      code: `public class BinarySearch {
    /**
     * Searches for target in a sorted integer array using Binary Search.
     * Returns 0-based index if found, or -1 if absent.
     */
    public static int binarySearch(int[] numbers, int target) {
        int low = 0;
        int high = numbers.length - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;

            if (numbers[mid] == target) {
                return mid; // Target found at index mid
            } else if (numbers[mid] < target) {
                low = mid + 1; // Discard left half
            } else {
                high = mid - 1; // Discard right half
            }
        }

        return -1; // Target not found
    }

    public static void main(String[] args) {
        int[] numbers = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        int target = 23;
        int result = binarySearch(numbers, target);

        if (result != -1) {
            System.out.println("Target found at index: " + result);
        } else {
            System.out.println("Target not found");
        }
    }
}`,
      code_explanation: "1. Two pointers (`low` and `high`) bound the active search window, initialized to `0` and `numbers.length - 1`.\n2. `mid` is computed using `low + (high - low) / 2` to prevent 32-bit signed integer overflow.\n3. If `numbers[mid]` matches `target`, the index `mid` is returned immediately.\n4. If `numbers[mid] < target`, we move `low` to `mid + 1`, eliminating the left half of the array.\n5. If `numbers[mid] > target`, we move `high` to `mid - 1`, eliminating the right half.\n6. If `low` exceeds `high`, the search window is empty and `-1` is returned.",
      codeLines: [
        { line: 1, text: "int low = 0, high = numbers.length - 1;" },
        { line: 2, text: "while (low <= high) {" },
        { line: 3, text: "    int mid = low + (high - low) / 2;" },
        { line: 4, text: "    if (numbers[mid] == target)" },
        { line: 5, text: "        return mid; // Found!" },
        { line: 6, text: "    else if (numbers[mid] < target)" },
        { line: 7, text: "        low = mid + 1; // Search right half" },
        { line: 8, text: "    else" },
        { line: 9, text: "        high = mid - 1; // Search left half" },
        { line: 10, text: "}" },
        { line: 11, text: "return -1; // Not found" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "initial") return 1;
        if (step.phase === "found") return 5;
        if (step.phase === "not_found") return 11;
        if (step.phase === "comparing") {
          return step.comparedValue < step.target ? 7 : 9;
        }
        return 3;
      }
    },

    python: {
      language: "python",
      label: "Python",
      code: `def binary_search(numbers: list[int], target: int) -> int:
    """
    Searches for target in a sorted list using Binary Search.
    Returns 0-based index if found, or -1 if absent.
    """
    low = 0
    high = len(numbers) - 1

    while low <= high:
        # Python handles arbitrarily large integers, so standard midpoint is safe
        mid = (low + high) // 2

        if numbers[mid] == target:
            return mid  # Target found
        elif numbers[mid] < target:
            low = mid + 1  # Discard left half
        else:
            high = mid - 1  # Discard right half

    return -1  # Target not found


if __name__ == "__main__":
    numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
    target = 23
    result = binary_search(numbers, target)

    if result != -1:
        print(f"Target found at index: {result}")
    else:
        print("Target not found")`,
      code_explanation: "1. `low` is set to 0 and `high` to `len(numbers) - 1`.\n2. In Python, integers have arbitrary precision, so `(low + high) // 2` uses integer floor division without overflow risk.\n3. The loop condition `while low <= high:` ensures every single-element window is checked.\n4. If `numbers[mid] == target`, returns the matching index `mid`.\n5. If `numbers[mid] < target`, the target is greater, so `low = mid + 1` shifts focus to the right partition.\n6. If `numbers[mid] > target`, `high = mid - 1` shifts focus to the left partition.\n7. If the loop completes without finding `target`, returns `-1`.",
      codeLines: [
        { line: 1, text: "low = 0" },
        { line: 2, text: "high = len(numbers) - 1" },
        { line: 3, text: "while low <= high:" },
        { line: 4, text: "    mid = (low + high) // 2" },
        { line: 5, text: "    if numbers[mid] == target:" },
        { line: 6, text: "        return mid  # Found!" },
        { line: 7, text: "    elif numbers[mid] < target:" },
        { line: 8, text: "        low = mid + 1  # Search right half" },
        { line: 9, text: "    else:" },
        { line: 10, text: "        high = mid - 1  # Search left half" },
        { line: 11, text: "return -1  # Not found" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "initial") return 1;
        if (step.phase === "found") return 6;
        if (step.phase === "not_found") return 11;
        if (step.phase === "comparing") {
          return step.comparedValue < step.target ? 8 : 10;
        }
        return 4;
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
    average: "O(log n)",
    worst: "O(log n)",
    space: "O(1)"
  },
  common_mistakes: [
    "Computing mid as (low + high) / 2 in fixed-width languages (C, Java), which risks integer overflow for very large arrays.",
    "Using loop condition while (low < high) instead of while (low <= high), which skips checking the single-element case when low == high.",
    "Updating low = mid instead of low = mid + 1, or high = mid instead of high = mid - 1, causing infinite loops.",
    "Applying Binary Search on an unsorted or improperly ordered array."
  ],
  practice: "Given a sorted array of integers that may contain duplicate values, write an algorithm to find the FIRST occurrence (lower bound) of a target value."
};
