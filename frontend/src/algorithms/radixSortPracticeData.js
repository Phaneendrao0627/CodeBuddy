/**
 * Comprehensive Radix Sort practice questions.
 * Progresses from Beginner to Advanced covering:
 * 1. Radix Sort fundamentals (non-comparison, digit by digit)
 * 2. LSD vs MSD definition and direction
 * 3. Digit extraction formula
 * 4. Number of passes calculation from maximum value
 * 5. Role and choice of Counting Sort as subroutine
 * 6. Critical requirement of stability across passes
 * 7. Digit frequency count calculation on ones place
 * 8. Trace question: state after pass 1
 * 9. Time complexity O(d * (n + b))
 * 10. Auxiliary space and non-in-place nature
 * 11. Limitations (negative numbers, floats, large d)
 */

export const RADIX_SORT_QUESTIONS = [
  {
    id: 1,
    type: "radix_sort_fundamentals",
    difficulty: "Beginner",
    title: "1. What is Radix Sort?",
    question:
      "Which of the following statements best describes the core mechanism of Radix Sort?",
    array: null,
    target: null,
    inputType: "multiple_choice",
    options: [
      {
        id: "A",
        text: "It is a non-comparison algorithm that sorts numbers digit by digit (from least to most significant) using a stable sub-routine like Counting Sort."
      },
      {
        id: "B",
        text: "It is a comparison-based algorithm that divides the array around a pivot element and sorts subarrays recursively."
      },
      {
        id: "C",
        text: "It builds a binary max heap and iteratively extracts the root element to the end of the array."
      },
      {
        id: "D",
        text: "It compares adjacent elements and swaps them until the array is completely in ascending order."
      }
    ],
    correctAnswer: "A",
    hint: "Radix Sort never compares two numbers directly (A > B). Instead, it groups numbers into buckets based on individual digits.",
    explanation:
      "Radix Sort is a non-comparison integer sorting algorithm. Rather than comparing two numbers against each other, it processes each element digit by digit, grouping them into buckets (0 through 9 in base 10) using a stable intermediate sort. This allows it to achieve linear O(d × (n + b)) runtime, sidestepping the Ω(n log n) comparison barrier."
  },
  {
    id: 2,
    type: "lsd_vs_msd",
    difficulty: "Beginner",
    title: "2. LSD vs. MSD Radix Sort",
    question:
      "What does 'LSD' stand for in LSD Radix Sort, and in which direction does it process the digits of a number?",
    array: null,
    target: null,
    inputType: "multiple_choice",
    options: [
      {
        id: "A",
        text: "Least Significant Digit; it processes digits starting from the ones place (rightmost) moving leftward toward the highest place value."
      },
      {
        id: "B",
        text: "Largest Significant Digit; it starts at the largest number in the array and sorts downward."
      },
      {
        id: "C",
        text: "Most Significant Digit; it processes digits starting from the highest place value (leftmost) and moves toward the ones place."
      },
      {
        id: "D",
        text: "Linear Sequential Distribution; it sorts digits in random order using hashing."
      }
    ],
    correctAnswer: "A",
    hint: "Think about the smallest place value in a number like 842. The digit '2' is the ones place.",
    explanation:
      "LSD stands for Least Significant Digit. In LSD Radix Sort, numbers are sorted starting at the least significant position (the 1s place), then the 10s place, then the 100s place, and so forth. By utilizing a stable sort at each step, previous digit order is preserved as higher place values are resolved."
  },
  {
    id: 3,
    type: "digit_extraction_formula",
    difficulty: "Beginner",
    title: "3. Extracting the Target Digit",
    question:
      "In base 10, the digit at position 'exp' (where exp = 1 for ones, 10 for tens, 100 for hundreds) is calculated using the formula: floor(number / exp) % 10. What is the tens digit (exp = 10) of the number 842?",
    array: [842],
    target: null,
    inputType: "number",
    placeholder: "Enter the tens digit (0-9)",
    correctAnswer: 4,
    hint: "Calculate floor(842 / 10) = 84, then find 84 % 10.",
    explanation:
      "Using the formula: floor(842 / 10) = 84. Next, 84 % 10 = 4. Therefore, the digit at the tens position (exp = 10) is 4. In 842, 2 is the ones digit, 4 is the tens digit, and 8 is the hundreds digit."
  },
  {
    id: 4,
    type: "total_passes_calculation",
    difficulty: "Beginner",
    title: "4. Number of Digit Passes Required",
    question:
      "Given the array [170, 45, 75, 90, 802, 24, 2, 66], what is the total number of digit passes (d) that Radix Sort must perform to fully sort the array?",
    array: [170, 45, 75, 90, 802, 24, 2, 66],
    target: null,
    inputType: "number",
    placeholder: "Enter the total number of passes",
    correctAnswer: 3,
    hint: "Find the maximum number in the array. How many digits does that number contain?",
    explanation:
      "The maximum element in the array is 802. Because 802 has 3 digits (hundreds, tens, and ones), Radix Sort must execute exactly 3 passes: Pass 1 for the 1s place (exp = 1), Pass 2 for the 10s place (exp = 10), and Pass 3 for the 100s place (exp = 100). Formula: d = floor(log10(802)) + 1 = 3."
  },
  {
    id: 5,
    type: "counting_sort_subroutine",
    difficulty: "Intermediate",
    title: "5. Role of Counting Sort",
    question:
      "Why is Counting Sort universally chosen as the intermediate sorting algorithm for each digit pass in Radix Sort?",
    array: null,
    target: null,
    inputType: "multiple_choice",
    options: [
      {
        id: "A",
        text: "Because digits belong to a small fixed range (0 to 9 in base 10), allowing Counting Sort to run in linear O(n + 10) time while guaranteeing stability."
      },
      {
        id: "B",
        text: "Because Counting Sort is an in-place sort that requires zero auxiliary memory."
      },
      {
        id: "C",
        text: "Because Counting Sort is faster than all other algorithms when sorting negative floating-point numbers."
      },
      {
        id: "D",
        text: "Because Counting Sort compares all pairs of elements in O(1) time."
      }
    ],
    correctAnswer: "A",
    hint: "The base b is just 10 (digits 0..9). When the range k = 10 is tiny and fixed, what is Counting Sort's runtime?",
    explanation:
      "Counting Sort is ideal for each digit pass because the range of values is small and fixed: base b = 10 has only digits 0 through 9. Counting Sort runs in O(n + b) = O(n + 10) time, which is strictly linear in n. Furthermore, Counting Sort can be easily implemented to be perfectly stable, which is an absolute requirement for Radix Sort."
  },
  {
    id: 6,
    type: "stability_requirement",
    difficulty: "Intermediate",
    title: "6. Why Stability is Mandatory",
    question:
      "What would happen if an unstable sorting algorithm (like standard Quick Sort or Heap Sort) were used for each digit pass in LSD Radix Sort?",
    array: null,
    target: null,
    inputType: "multiple_choice",
    options: [
      {
        id: "A",
        text: "The sort would fail to produce a sorted array, because ties on the current digit would scramble the relative order established by previous (less significant) digits."
      },
      {
        id: "B",
        text: "The sort would still succeed, but it would take O(n²) time instead of linear time."
      },
      {
        id: "C",
        text: "The sort would only work if all numbers had an odd number of digits."
      },
      {
        id: "D",
        text: "Nothing would change; stability is merely an optional aesthetic property in Radix Sort."
      }
    ],
    correctAnswer: "A",
    hint: "Imagine 170 and 070. Both have '7' in the tens place. If pass 2 scrambles their order, the order from the ones place is lost.",
    explanation:
      "Stability is an absolute mathematical requirement for LSD Radix Sort. When two numbers share the same digit at the current place value (for example, 170 and 075 both have tens digit 7), their relative order must remain dictated by their ones digits (0 < 5). An unstable sort would reorder them arbitrarily, wiping out the work of earlier passes and leaving the array unsorted."
  },
  {
    id: 7,
    type: "digit_frequency_count",
    difficulty: "Intermediate",
    title: "7. Calculating Digit Frequencies",
    question:
      "In the array [170, 45, 75, 90, 802, 24, 2, 66], during Pass 1 (ones digit, exp = 1), how many elements have their ones digit equal to 5?",
    array: [170, 45, 75, 90, 802, 24, 2, 66],
    target: 5,
    inputType: "number",
    placeholder: "Enter the count of elements with ones digit 5",
    correctAnswer: 2,
    hint: "Inspect the last digit of each number: 170(0), 45(5), 75(5), 90(0), 802(2), 24(4), 2(2), 66(6).",
    explanation:
      "Scanning the ones digits (num % 10): 170 has 0, 45 has 5, 75 has 5, 90 has 0, 802 has 2, 24 has 4, 2 has 2, 66 has 6. The numbers 45 and 75 both end in 5, so count[5] = 2."
  },
  {
    id: 8,
    type: "trace_pass_1",
    difficulty: "Intermediate",
    title: "8. Trace: Result After Pass 1",
    question:
      "Given the input array [170, 45, 75, 90, 802, 24, 2, 66], what will be the exact contents of the array after completing Pass 1 (sorting by the ones place)?",
    array: [170, 45, 75, 90, 802, 24, 2, 66],
    target: null,
    inputType: "multiple_choice",
    options: [
      {
        id: "A",
        text: "[170, 90, 802, 2, 24, 45, 75, 66]"
      },
      {
        id: "B",
        text: "[90, 170, 2, 802, 24, 75, 45, 66]"
      },
      {
        id: "C",
        text: "[2, 24, 45, 66, 75, 90, 170, 802]"
      },
      {
        id: "D",
        text: "[802, 170, 90, 75, 66, 45, 24, 2]"
      }
    ],
    correctAnswer: "A",
    hint: "Sort strictly by the last digit: 0s first (170 then 90), 2s next (802 then 2), 4 next (24), 5s next (45 then 75), 6 next (66).",
    explanation:
      "Grouping by ones digit while maintaining stable input order:\n• Digit 0: 170, 90 (170 was before 90)\n• Digit 2: 802, 2 (802 was before 2)\n• Digit 4: 24\n• Digit 5: 45, 75 (45 was before 75)\n• Digit 6: 66\nCombining in bucket order yields: [170, 90, 802, 2, 24, 45, 75, 66]."
  },
  {
    id: 9,
    type: "time_complexity_analysis",
    difficulty: "Advanced",
    title: "9. Time Complexity of Radix Sort",
    question:
      "What is the overall time complexity of LSD Radix Sort on an array of n numbers with d digits in base b?",
    array: null,
    target: null,
    inputType: "multiple_choice",
    options: [
      {
        id: "A",
        text: "O(d × (n + b)) in all cases (best, average, and worst)"
      },
      {
        id: "B",
        text: "O(n log n) average case, O(n²) worst case"
      },
      {
        id: "C",
        text: "O(n × d²) best case, O(n³)"
      },
      {
        id: "D",
        text: "O(n log b) in best case, O(d × n log n) in worst case"
      }
    ],
    correctAnswer: "A",
    hint: "Each digit pass uses counting sort taking O(n + b) time. How many digit passes are executed?",
    explanation:
      "Radix Sort executes exactly d passes. In each pass, Counting Sort takes O(n + b) time (O(n) to iterate the elements plus O(b) to process the count array). Multiplying d passes by O(n + b) gives O(d × (n + b)). When d and b are fixed constants (like 32-bit integers in base 10), the algorithm runs in linear O(n) time."
  },
  {
    id: 10,
    type: "space_and_properties",
    difficulty: "Advanced",
    title: "10. Auxiliary Space & In-Place Property",
    question:
      "Is LSD Radix Sort an in-place sorting algorithm, and what is its auxiliary space complexity?",
    array: null,
    target: null,
    inputType: "multiple_choice",
    options: [
      {
        id: "A",
        text: "It is NOT in-place; its auxiliary space is O(n + b) because it requires an output buffer of size n and a count array of size b."
      },
      {
        id: "B",
        text: "It IS in-place; it requires only O(1) auxiliary space because it swaps elements directly in the array."
      },
      {
        id: "C",
        text: "It is NOT in-place; its auxiliary space is O(d × n) because it keeps copies of all previous passes."
      },
      {
        id: "D",
        text: "It IS in-place; only O(log n) call stack space is used."
      }
    ],
    correctAnswer: "A",
    hint: "To maintain stability during counting sort, where do elements get placed before copying back to the original array?",
    explanation:
      "Radix Sort is NOT an in-place sort. In order to preserve stability during each digit pass, elements are placed into a temporary auxiliary output array of size n, and a count array of size b is allocated. Hence, auxiliary space complexity is O(n + b)."
  },
  {
    id: 11,
    type: "limitations_and_edge_cases",
    difficulty: "Advanced",
    title: "11. Limitations of Standard Radix Sort",
    question:
      "Why is standard LSD Radix Sort restricted to non-negative integers or fixed-length discrete keys, and what happens if a large outlier (e.g. 1 000 000 000) is present?",
    array: null,
    target: null,
    inputType: "multiple_choice",
    options: [
      {
        id: "A",
        text: "Negative numbers produce negative modulo digits that cannot index a count array; an outlier with many digits inflates d, forcing all numbers to undergo many extra passes."
      },
      {
        id: "B",
        text: "Radix Sort crashes when duplicate elements exist in the input."
      },
      {
        id: "C",
        text: "Large numbers cause buffer overflows in the count array because count size depends on the number of elements."
      },
      {
        id: "D",
        text: "Standard Radix Sort can only sort prime numbers; composites fail the digit extraction test."
      }
    ],
    correctAnswer: "A",
    hint: "What is -45 % 10 in C or Java? And what happens to d = floor(log10(max)) + 1 when max is 10^9?",
    explanation:
      "Standard Radix Sort relies on non-negative integer modulo arithmetic; negative values yield negative digits that cannot directly index into count[0..9]. Furthermore, because the number of passes d depends on the maximum value, a single large outlier (like 1,000,000,000 having 10 digits) forces 10 full-array passes on every single element, even if all other numbers are single-digit integers."
  }
];
