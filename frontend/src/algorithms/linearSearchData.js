/**
 * Curated educational reference content for Linear Search.
 * Provides complete, idiomatic implementations and explanations for C, Java, and Python.
 */
export const linearSearchContent = {
  concept: "Linear Search (also known as Sequential Search) is the simplest searching algorithm. It inspects every element in a list one by one, from the very first element to the last, until either the target value is found or the entire list has been checked.",
  intuition: "Imagine looking for a specific key on an unsorted ring of keys. You try the first key. If it doesn't fit, you try the second, then the third, sequentially until one opens the lock or you have tried them all. You do not need the keys to be organized in any particular order.",
  real_world_example: "Scanning an unsorted paper grocery receipt for a specific item, flipping through an unindexed deck of business cards, or searching an unsorted array of sensor readings.",
  visualization: "Array: [14, 27, 8, 42, 19, 35, 50], Target: 42\nStep 1: Check index 0 -> numbers[0] is 14 != 42 (keep going)\nStep 2: Check index 1 -> numbers[1] is 27 != 42 (keep going)\nStep 3: Check index 2 -> numbers[2] is 8  != 42 (keep going)\nStep 4: Check index 3 -> numbers[3] is 42 == 42 -> Target found at index 3!",
  algorithm: [
    "1. Start from the very first element of the array at index i = 0.",
    "2. Compare the current element numbers[i] with the target value.",
    "3. If numbers[i] == target, immediately terminate the search and return index i.",
    "4. If numbers[i] != target, advance the index pointer i = i + 1.",
    "5. Repeat steps 2 through 4 until either a match is found or the end of the array is reached.",
    "6. If the loop completes without finding a match, return -1 to signal that the target is absent."
  ],
  pseudocode: `function linearSearch(numbers, target):
    for i from 0 to length(numbers) - 1:
        if numbers[i] == target:
            return i    // Target found

    return -1           // Target not found`,

  implementations: {
    c: {
      language: "c",
      label: "C",
      code: `#include <stdio.h>

/**
 * Searches for target in an integer array using Linear Search.
 * Accepts the array, its explicit size, and the target value.
 * Returns 0-based index if found, or -1 if absent.
 */
int linearSearch(const int numbers[], int size, int target) {
    for (int i = 0; i < size; i++) {
        if (numbers[i] == target) {
            return i; // Target found at index i
        }
    }
    return -1; // Target not found after full scan
}

int main(void) {
    int numbers[] = {14, 27, 8, 42, 19, 35, 50};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    int target = 42;
    int result = linearSearch(numbers, size, target);

    if (result != -1) {
        printf("Target found at index: %d\\n", result);
    } else {
        printf("Target not found\\n");
    }
    return 0;
}`,
      code_explanation: "1. In C, `size` must be explicitly passed as the second argument because array parameters decay to pointers and cannot provide their length.\n2. The `for` loop initializes loop counter `i = 0` and increments `i++` as long as `i < size`.\n3. In each iteration, `if (numbers[i] == target)` compares the current element to the target value.\n4. If a match is found, `return i;` exits immediately with the zero-based index.\n5. If the entire array of size elements is checked without a match, execution falls through the loop and returns `-1`.",
      codeLines: [
        { line: 1, text: "int linearSearch(const int numbers[], int size, int target) {" },
        { line: 2, text: "    for (int i = 0; i < size; i++) {" },
        { line: 3, text: "        if (numbers[i] == target) {" },
        { line: 4, text: "            return i; // Found target at index i" },
        { line: 5, text: "        }" },
        { line: 6, text: "    }" },
        { line: 7, text: "    return -1; // Target not found after full scan" },
        { line: 8, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "initial") return 2;
        if (step.phase === "comparing") return 3;
        if (step.phase === "found") return 4;
        if (step.phase === "not_found") return 7;
        return 2;
      }
    },

    java: {
      language: "java",
      label: "Java",
      code: `public class LinearSearch {
    /**
     * Searches for target in an integer array using Linear Search.
     * Returns 0-based index if found, or -1 if absent.
     */
    public static int linearSearch(int[] numbers, int target) {
        for (int i = 0; i < numbers.length; i++) {
            if (numbers[i] == target) {
                return i; // Target found at index i
            }
        }
        return -1; // Target not found after full scan
    }

    public static void main(String[] args) {
        int[] numbers = {14, 27, 8, 42, 19, 35, 50};
        int target = 42;
        int result = linearSearch(numbers, target);

        if (result != -1) {
            System.out.println("Target found at index: " + result);
        } else {
            System.out.println("Target not found");
        }
    }
}`,
      code_explanation: "1. The method takes an integer array `numbers` and the `target` value to locate.\n2. A `for` loop iterates from `i = 0` up to `numbers.length - 1`.\n3. Inside the loop, `if (numbers[i] == target)` checks whether the current element matches the target.\n4. If true, `return i;` immediately terminates the method and returns the zero-based index.\n5. If the loop completes without finding the target, the final line returns `-1`, signaling absence.",
      codeLines: [
        { line: 1, text: "public static int linearSearch(int[] numbers, int target) {" },
        { line: 2, text: "    for (int i = 0; i < numbers.length; i++) {" },
        { line: 3, text: "        if (numbers[i] == target) {" },
        { line: 4, text: "            return i; // Found target at index i" },
        { line: 5, text: "        }" },
        { line: 6, text: "    }" },
        { line: 7, text: "    return -1; // Target not found after full scan" },
        { line: 8, text: "}" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "initial") return 2;
        if (step.phase === "comparing") return 3;
        if (step.phase === "found") return 4;
        if (step.phase === "not_found") return 7;
        return 2;
      }
    },

    python: {
      language: "python",
      label: "Python",
      code: `def linear_search(numbers: list[int], target: int) -> int:
    """
    Searches for target in a list using Linear Search.
    Returns 0-based index if found, or -1 if absent.
    """
    for i in range(len(numbers)):
        if numbers[i] == target:
            return i  # Target found at index i
    return -1  # Target not found after full scan


if __name__ == "__main__":
    numbers = [14, 27, 8, 42, 19, 35, 50]
    target = 42
    result = linear_search(numbers, target)

    if result != -1:
        print(f"Target found at index: {result}")
    else:
        print("Target not found")`,
      code_explanation: "1. The function uses `for i in range(len(numbers)):` to sequentially inspect each 0-based index.\n2. In each iteration, `if numbers[i] == target:` compares the current value with target.\n3. As soon as a match is detected, `return i` immediately returns the index.\n4. If all items in `numbers` are examined without finding a match, the loop exits naturally and returns `-1`.",
      codeLines: [
        { line: 1, text: "def linear_search(numbers: list[int], target: int) -> int:" },
        { line: 2, text: "    for i in range(len(numbers)):" },
        { line: 3, text: "        if numbers[i] == target:" },
        { line: 4, text: "            return i  # Found target at index i" },
        { line: 5, text: "    return -1  # Target not found after full scan" }
      ],
      mapStepToLine(step) {
        if (!step) return null;
        if (step.phase === "initial") return 2;
        if (step.phase === "comparing") return 3;
        if (step.phase === "found") return 4;
        if (step.phase === "not_found") return 5;
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
    best: "O(1)",
    average: "O(n)",
    worst: "O(n)",
    space: "O(1)"
  },
  common_mistakes: [
    "Assuming the array must be sorted. Linear Search works on both sorted and unsorted collections.",
    "Accidentally placing `return -1;` inside the loop body, causing the search to terminate after examining only the first element.",
    "Off-by-one errors in loop conditions (`i <= numbers.length` in Java/C will cause an IndexOutOfBounds error).",
    "Assuming Linear Search returns all matching indices when duplicates exist; standard implementation terminates at the FIRST match."
  ],
  practice: "Given an unsorted array of employee IDs, determine whether employee ID 104 exists and count how many comparisons were performed."
};
