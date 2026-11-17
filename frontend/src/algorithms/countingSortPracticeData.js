/**
 * Comprehensive Counting Sort practice questions.
 * Progresses from Beginner to Advanced covering:
 * 1. What is Counting Sort? (not comparison-based)
 * 2. Identify min and max in [4,2,2,8,3,3,1]
 * 3. Size of count array (k = max - min + 1 = 8)
 * 4. Count of value 2 in [4,2,2,8,3,3,1]
 * 5. Count of value 3 in [4,2,2,8,3,3,1]
 * 6. What is a cumulative count array used for?
 * 7. Cumulative count[2] value after prefix-sum pass
 * 8. Why iterate right-to-left during placement? (stability)
 * 9. Time and space complexity: O(n + k)
 * 10. Is Counting Sort stable?
 * 11. When should you NOT use Counting Sort?
 */

export const COUNTING_SORT_QUESTIONS = [
  {
    id: 1,
    type: "counting_sort_definition",
    difficulty: "Beginner",
    title: "1. What is Counting Sort?",
    question:
      "Which of the following best describes Counting Sort and its key distinction from algorithms like Merge Sort or Quick Sort?",
    array: null,
    target: null,
    inputType: "multiple_choice",
    options: [
      {
        id: "A",
        text: "Counting Sort is a non-comparison-based sorting algorithm. It counts the occurrences of each distinct value and uses those counts to place elements directly into their sorted positions."
      },
      {
        id: "B",
        text: "Counting Sort is a comparison-based algorithm that repeatedly compares adjacent pairs and swaps them until the array is sorted (like Bubble Sort)."
      },
      {
        id: "C",
        text: "Counting Sort works by selecting a pivot element and partitioning the array into two halves around it, then recursively sorting each half."
      },
      {
        id: "D",
        text: "Counting Sort is a divide-and-conquer algorithm that splits the array in half, sorts each half, and merges them back together."
      }
    ],
    correctAnswer: "A",
    hint: "Counting Sort never directly compares two elements. Instead, it leverages the values themselves as indices into an auxiliary array.",
    explanation:
      "Counting Sort is a non-comparison-based (integer) sorting algorithm. Rather than comparing elements against each other, it creates an auxiliary 'count' array where each index represents a value and each cell stores how many times that value appears in the input. Because it bypasses comparisons entirely, it can achieve O(n + k) time — faster than the O(n log n) lower bound that applies to all comparison-based sorts — provided the value range k is not too large."
  },
  {
    id: 2,
    type: "find_min_max",
    difficulty: "Beginner",
    title: "2. Identify Min and Max",
    question:
      "For the array [4, 2, 2, 8, 3, 3, 1], what are the minimum and maximum values? These determine the range (k) of the count array.",
    array: [4, 2, 2, 8, 3, 3, 1],
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "min = 1, max = 8" },
      { id: "B", text: "min = 2, max = 8" },
      { id: "C", text: "min = 1, max = 4" },
      { id: "D", text: "min = 0, max = 8" }
    ],
    correctAnswer: "A",
    hint: "Scan through every element once to find the smallest and largest values.",
    explanation:
      "Scanning [4, 2, 2, 8, 3, 3, 1] element by element: the smallest value encountered is 1 and the largest is 8. These two values define the range of the count array: the array must cover every integer from min (1) all the way up to max (8), giving a range k = max − min + 1 = 8."
  },
  {
    id: 3,
    type: "count_array_size",
    difficulty: "Beginner",
    title: "3. Size of the Count Array",
    question:
      "For the array [4, 2, 2, 8, 3, 3, 1], the minimum value is 1 and the maximum value is 8. Using the formula k = max − min + 1, what is the required size of the count array?",
    array: [4, 2, 2, 8, 3, 3, 1],
    target: null,
    inputType: "number",
    placeholder: "Enter the size of the count array",
    correctAnswer: 8,
    hint: "k = max − min + 1 = 8 − 1 + 1. Count every integer from min to max inclusive.",
    explanation:
      "The count array must have one slot for every integer in the range [min, max] inclusive. With min = 1 and max = 8, the number of distinct values that could appear is 8 − 1 + 1 = 8. So the count array has 8 cells, indexed 0 through 7, where index i corresponds to the value (min + i). For example, index 0 → value 1, index 1 → value 2, …, index 7 → value 8."
  },
  {
    id: 4,
    type: "count_occurrences_2",
    difficulty: "Beginner",
    title: "4. Count Occurrences of a Value",
    question:
      "After scanning [4, 2, 2, 8, 3, 3, 1] and tallying each element into the count array (using the offset min = 1), how many times does the value 2 appear?",
    array: [4, 2, 2, 8, 3, 3, 1],
    target: 2,
    inputType: "number",
    placeholder: "Enter the count for value 2",
    correctAnswer: 2,
    hint: "Walk through the array and count every element equal to 2.",
    explanation:
      "Iterating through [4, 2, 2, 8, 3, 3, 1]: the value 2 appears at index 1 and index 2 — a total of 2 times. In the count array (offset by min = 1), this is stored at index 2 − 1 = 1, so count[1] = 2."
  },
  {
    id: 5,
    type: "count_occurrences_3",
    difficulty: "Intermediate",
    title: "5. Count Occurrences of Another Value",
    question:
      "After scanning [4, 2, 2, 8, 3, 3, 1] into the count array (min = 1 offset), how many times does the value 3 appear?",
    array: [4, 2, 2, 8, 3, 3, 1],
    target: 3,
    inputType: "number",
    placeholder: "Enter the count for value 3",
    correctAnswer: 2,
    hint: "Walk through the array and count every element equal to 3.",
    explanation:
      "Iterating through [4, 2, 2, 8, 3, 3, 1]: the value 3 appears at index 4 and index 5 — a total of 2 times. In the count array (offset by min = 1), this is stored at index 3 − 1 = 2, so count[2] = 2. The full count array (before prefix sum) is [1, 2, 2, 1, 0, 0, 0, 1], representing values 1 through 8 respectively."
  },
  {
    id: 6,
    type: "cumulative_count_purpose",
    difficulty: "Intermediate",
    title: "6. Purpose of the Cumulative Count Array",
    question:
      "After counting element frequencies, Counting Sort transforms the count array into a cumulative (prefix-sum) array. What is the purpose of this transformation?",
    array: null,
    target: null,
    inputType: "multiple_choice",
    options: [
      {
        id: "A",
        text: "Each cumulative count[i] tells us the last position (1-based) in the output array where a value equal to (min + i) should be placed, enabling direct O(1) placement of each element."
      },
      {
        id: "B",
        text: "It sorts the count array itself so that counts appear in ascending order."
      },
      {
        id: "C",
        text: "It compresses the count array to remove zero entries and save memory."
      },
      {
        id: "D",
        text: "It converts element values into binary so the hardware can compare them faster."
      }
    ],
    correctAnswer: "A",
    hint: "After the prefix-sum pass, count[i] holds the total number of elements whose value is ≤ (min + i). This directly gives you the final 1-based index of that value in the sorted output.",
    explanation:
      "The prefix-sum (cumulative) pass transforms count[i] so that it equals the number of elements with value ≤ (min + i). This value is precisely the 1-based position of the last occurrence of (min + i) in the final sorted output. During the placement phase, each element is placed at output[--count[element − min]], and the count is decremented so the next duplicate lands one position earlier — which also ensures stability."
  },
  {
    id: 7,
    type: "cumulative_count_value",
    difficulty: "Intermediate",
    title: "7. Trace the Cumulative Count",
    question:
      "For [4, 2, 2, 8, 3, 3, 1] with min = 1, the raw count array (indices 0–7 representing values 1–8) is [1, 2, 2, 1, 0, 0, 0, 1]. After the prefix-sum pass (count[i] += count[i-1] for i = 1 to 7), what is the value of count[2]?",
    array: [4, 2, 2, 8, 3, 3, 1],
    target: null,
    inputType: "number",
    placeholder: "Enter the value of count[2] after prefix-sum",
    correctAnswer: 5,
    hint: "count[0]=1, count[1]=count[1]+count[0]=2+1=3, count[2]=count[2]+count[1]=2+3=5.",
    explanation:
      "Starting with the raw count array [1, 2, 2, 1, 0, 0, 0, 1]:\n• count[0] stays 1 (1 element ≤ value 1).\n• count[1] = 2 + 1 = 3 (3 elements ≤ value 2: one '1' and two '2's).\n• count[2] = 2 + 3 = 5 (5 elements ≤ value 3: one '1', two '2's, and two '3's).\nSo count[2] = 5. The full cumulative array is [1, 3, 5, 6, 6, 6, 6, 7]."
  },
  {
    id: 8,
    type: "right_to_left_stability",
    difficulty: "Intermediate",
    title: "8. Why Iterate Right-to-Left During Placement?",
    question:
      "During the output-placement phase of Counting Sort, elements are placed by iterating the input array from right to left (last element first). Why is this direction chosen?",
    array: null,
    target: null,
    inputType: "multiple_choice",
    options: [
      {
        id: "A",
        text: "To preserve stability: elements that appear later in the input (higher original index) are placed at higher positions among duplicates, so their relative order from the input is maintained in the output."
      },
      {
        id: "B",
        text: "To reduce the number of writes — iterating backwards always requires fewer memory accesses than iterating forwards."
      },
      {
        id: "C",
        text: "Because the cumulative count array is built right-to-left, so the placement pass must also go right-to-left to match it."
      },
      {
        id: "D",
        text: "To handle negative numbers correctly — a left-to-right pass would produce wrong results for arrays containing negative values."
      }
    ],
    correctAnswer: "A",
    hint: "Stability means equal elements appear in the same relative order in the output as they did in the input. Think about which element among duplicates should land at the rightmost available slot.",
    explanation:
      "Counting Sort is designed to be a stable sort. When two elements have the same value, the one that appeared later (further right) in the original input should also appear later (further right) in the sorted output. By iterating the input right-to-left and using `output[--count[val − min]] = val`, the last occurrence of a duplicate is placed first at the highest available index for that value. Earlier (further-left) occurrences then fill the lower indices in order, preserving the original relative order of equal elements."
  },
  {
    id: 9,
    type: "complexity_analysis",
    difficulty: "Advanced",
    title: "9. Time and Space Complexity",
    question:
      "What are the time complexity and auxiliary space complexity of Counting Sort, where n is the number of input elements and k is the range (max − min + 1)?",
    array: null,
    target: null,
    inputType: "multiple_choice",
    options: [
      { id: "A", text: "Time: O(n + k); Space: O(n + k)" },
      { id: "B", text: "Time: O(n log n); Space: O(1)" },
      { id: "C", text: "Time: O(n²); Space: O(n)" },
      { id: "D", text: "Time: O(n + k); Space: O(1)" }
    ],
    correctAnswer: "A",
    hint: "Counting Sort performs three linear passes: one to count (O(n)), one to prefix-sum (O(k)), and one to place (O(n)). It also allocates a count array of size k and an output array of size n.",
    explanation:
      "Counting Sort uses three passes:\n1. Count pass: O(n) — iterate over all n input elements.\n2. Prefix-sum pass: O(k) — iterate over all k cells of the count array.\n3. Placement pass: O(n) — iterate over n input elements again to build the output.\n\nTotal time: O(n + k).\n\nAuxiliary space: O(k) for the count array plus O(n) for the output array = O(n + k).\n\nThis beats the O(n log n) comparison-sort barrier, but only when k is reasonably small compared to n. If k ≫ n (e.g., sorting 10 numbers in the range 0–10⁹), the algorithm becomes wasteful."
  },
  {
    id: 10,
    type: "stability_property",
    difficulty: "Advanced",
    title: "10. Is Counting Sort Stable?",
    question:
      "Is Counting Sort a stable sorting algorithm, and what property of the algorithm guarantees (or breaks) stability?",
    array: null,
    target: null,
    inputType: "multiple_choice",
    options: [
      {
        id: "A",
        text: "Yes — the right-to-left placement pass ensures that among equal elements, the one appearing later in the input is placed at a higher index in the output, preserving the original relative order."
      },
      {
        id: "B",
        text: "No — the prefix-sum step reorders equal elements arbitrarily, so their original relative order is lost."
      },
      {
        id: "C",
        text: "Yes — but only when the input array is already partially sorted before Counting Sort is applied."
      },
      {
        id: "D",
        text: "No — Counting Sort is inherently unstable because it uses an auxiliary array."
      }
    ],
    correctAnswer: "A",
    hint: "Trace through two equal elements and observe which output index each one receives when you iterate from right to left.",
    explanation:
      "Counting Sort IS stable when implemented with the standard right-to-left placement pass. Consider two elements with equal value v at positions i < j in the input. During the right-to-left pass, element at position j is encountered first; it is placed at output[--count[v − min]], say position p. When element at position i is encountered next, it is placed at output[--count[v − min]] = position p − 1. Because i < j and i's element lands at p−1 < p = j's element's position, the relative order is preserved. Stability is important when Counting Sort is used as a subroutine in Radix Sort."
  },
  {
    id: 11,
    type: "when_not_to_use",
    difficulty: "Advanced",
    title: "11. When Should You NOT Use Counting Sort?",
    question:
      "Counting Sort is very efficient in the right context, but it has clear limitations. In which of the following scenarios would Counting Sort be a poor choice?",
    array: null,
    target: null,
    inputType: "multiple_choice",
    options: [
      {
        id: "A",
        text: "Sorting an array of 1 000 student exam scores where each score is an integer in [0, 100] — k = 101 is tiny compared to n = 1 000."
      },
      {
        id: "B",
        text: "Sorting an array of 1 000 floating-point temperatures ranging from −273.15 to 5 000.75, where values are not integers and the continuous range is astronomically large."
      },
      {
        id: "C",
        text: "Sorting an array of 10 000 age values where every age is an integer in [0, 150] — k = 151 is negligible."
      },
      {
        id: "D",
        text: "Sorting an array of 500 000 integers each in the range [1, 1 000] — k = 1 000 is small relative to n = 500 000."
      }
    ],
    correctAnswer: "B",
    hint: "Counting Sort requires allocating an array of size k = max − min + 1. What happens when values are non-integers or when the range spans millions of distinct values?",
    explanation:
      "Counting Sort requires a count array of size k = max − min + 1, and that k must be an integer range. It breaks down in two key scenarios:\n\n1. Non-integer values (floats, strings): You cannot use a floating-point number as an array index. Counting Sort fundamentally requires integer keys.\n\n2. Very large range k: If k ≫ n (e.g., k = 10⁹ for 1 000 elements), allocating and zeroing a count array of size k wastes O(k) time and memory even if most entries remain zero. In that case, comparison-based algorithms like Merge Sort or Quick Sort (O(n log n)) are far more practical.\n\nIn option B, the values are floats with a continuous range — both failure conditions apply, making Counting Sort completely unsuitable."
  }
];
