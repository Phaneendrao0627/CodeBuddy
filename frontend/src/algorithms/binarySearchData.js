/**
 * Fixed educational reference content for Binary Search.
 * Ensures verified, consistent explanations, steps, and Java code.
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
  code: `public class BinarySearch {
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
  code_explanation: "1. Two pointers (low and high) define the current active window.\n2. mid is computed using low + (high - low) / 2 to avoid standard (low + high) integer overflow.\n3. If numbers[mid] matches target, the index is returned immediately.\n4. If numbers[mid] < target, we move low to mid + 1, eliminating the left half.\n5. If numbers[mid] > target, we move high to mid - 1, eliminating the right half.\n6. If low exceeds high, the search space is exhausted and -1 is returned.",
  complexity: {
    best: "O(1)",
    average: "O(log n)",
    worst: "O(log n)",
    space: "O(1)"
  },
  common_mistakes: [
    "Computing mid as (low + high) / 2, which risks integer overflow for very large arrays in fixed-width types.",
    "Using loop condition while (low < high) instead of while (low <= high), which skips checking the single-element case when low == high.",
    "Updating low = mid instead of low = mid + 1, or high = mid instead of high = mid - 1, causing infinite loops.",
    "Applying Binary Search on an unsorted or improperly ordered array."
  ],
  practice: "Given a sorted array of integers that may contain duplicate values, write an algorithm to find the FIRST occurrence (lower bound) of a target value."
};
