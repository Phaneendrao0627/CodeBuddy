import { useState } from "react";
import ConceptPage from "./ConceptPage";
import AlgorithmEntryAnimation from "./components/AlgorithmEntryAnimation";
import {
  hasSeenEntryAnimation,
  markEntryAnimationSeen,
} from "./utils/entryAnimationTracker";
import "./index.css";

function App() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isAnimatingEntry, setIsAnimatingEntry] = useState(false);

  const topics = {
    "Arrays": [
      "Array Basics",
      "Array Traversal",
      "Insertion in Array",
      "Deletion in Array",
      "Searching in Array",
      "Two Pointer Technique",
      "Sliding Window",
    ],

    "Sorting": [
      "Bubble Sort",
      "Selection Sort",
      "Insertion Sort",
      "Merge Sort",
      "Quick Sort",
      "Heap Sort",
      "Counting Sort",
      "Radix Sort",
    ],

    "Searching": [
      "Linear Search",
      "Binary Search",
      "Jump Search",
      "Binary Search Variations",
    ],

    "Linked Lists": [
      "Singly Linked List",
      "Doubly Linked List",
      "Circular Linked List",
      "Insertion in Linked List",
      "Deletion in Linked List",
      "Reverse Linked List",
    ],

    "Stack": [
      "Stack",
      "Stack using Array",
      "Stack using Linked List",
      "Balanced Parentheses",
      "Infix to Postfix",
      "Postfix Evaluation",
    ],

    "Queue": [
      "Queue",
      "Queue using Array",
      "Queue using Linked List",
      "Circular Queue",
      "Priority Queue",
      "Deque",
    ],

    "Recursion": [
      "Introduction to Recursion",
      "Factorial",
      "Fibonacci",
      "Tower of Hanoi",
      "Backtracking",
    ],

    "Trees": [
      "Binary Tree",
      "Binary Search Tree",
      "Tree Traversals",
      "Preorder Traversal",
      "Inorder Traversal",
      "Postorder Traversal",
      "Level Order Traversal",
      "Tree Height",
    ],

    "Heaps": [
      "Min Heap",
      "Max Heap",
      "Heapify",
      "Heap Sort",
      "Priority Queue using Heap",
    ],

    "Graphs": [
      "Graph Basics",
      "BFS",
      "DFS",
      "Dijkstra's Algorithm",
      "Bellman-Ford Algorithm",
      "Floyd-Warshall Algorithm",
      "Topological Sort",
    ],

    "Hashing": [
      "Hash Tables",
      "Hash Functions",
      "Collision Handling",
      "HashMap",
      "HashSet",
    ],

    "Greedy Algorithms": [
      "Greedy Approach",
      "Activity Selection",
      "Fractional Knapsack",
      "Huffman Coding",
    ],

    "Dynamic Programming": [
      "Introduction to DP",
      "Memoization",
      "Tabulation",
      "0/1 Knapsack",
      "Longest Common Subsequence",
      "Longest Increasing Subsequence",
    ],
  };

  function handleSelectTopic(topic) {
    setSelectedTopic(topic);
    if (!hasSeenEntryAnimation(topic)) {
      setIsAnimatingEntry(true);
    } else {
      setIsAnimatingEntry(false);
    }
  }

  function handleAnimationComplete() {
    if (selectedTopic) {
      markEntryAnimationSeen(selectedTopic);
    }
    setIsAnimatingEntry(false);
  }

  if (selectedTopic) {
    if (isAnimatingEntry) {
      return (
        <AlgorithmEntryAnimation
          algorithmName={selectedTopic}
          onComplete={handleAnimationComplete}
        />
      );
    }
    return (
      <ConceptPage
        topic={selectedTopic}
        onBack={() => {
          setSelectedTopic(null);
          setIsAnimatingEntry(false);
        }}
      />
    );
  }

  return (
    <div className="app">

      <header className="header">
        <div>
          <div className="logo">CodeBuddy</div>

          <div className="tagline">
            AI-powered DSA learning
          </div>
        </div>
      </header>


      <main className="main">

        <aside className="sidebar">

          <h2>DSA Topics</h2>

          {Object.entries(topics).map(
            ([category, topicList]) => (
              <div
                className="category"
                key={category}
              >

                <button
                  className="topic-category"
                >
                  <span className="category-left">

                    <span className="arrow">
                      ▸
                    </span>

                    <span>
                      {category}
                    </span>

                  </span>
                </button>


                <div className="concepts">

                  {topicList.map(
                    (topic) => (
                      <button
                        key={topic}
                        className="concept-button"
                        onClick={() => handleSelectTopic(topic)}
                      >
                        {topic}
                      </button>
                    )
                  )}

                </div>

              </div>
            )
          )}

        </aside>


        <section className="chat">

          <div className="breadcrumb">
            DSA LEARNING
          </div>


          <h1>
            Learn Data Structures & Algorithms
          </h1>


          <p>
            Select a topic from the sidebar and let
            CodeBuddy teach you step-by-step.
          </p>


          <div className="welcome-card">

            <h2>
              👋 Welcome to CodeBuddy
            </h2>

            <p>
              Your AI-powered DSA tutor.
              Choose any concept from the sidebar
              to start learning.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;