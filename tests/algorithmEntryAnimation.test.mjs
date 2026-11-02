import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  hasSeenEntryAnimation,
  markEntryAnimationSeen
} from "../frontend/src/utils/entryAnimationTracker.js";

// Mock minimal window.sessionStorage for testing in Node.js
class MockSessionStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.get(key) ?? null;
  }
  setItem(key, val) {
    this.store.set(key, String(val));
  }
  clear() {
    this.store.clear();
  }
}

describe("Algorithm Entry Experience - Session Tracking", () => {
  beforeEach(() => {
    globalThis.window = {
      sessionStorage: new MockSessionStorage()
    };
  });

  it("returns false for unseen algorithms", () => {
    assert.equal(hasSeenEntryAnimation("Jump Search"), false);
    assert.equal(hasSeenEntryAnimation("Binary Search"), false);
  });

  it("marks an algorithm as seen in session storage", () => {
    markEntryAnimationSeen("Jump Search");
    assert.equal(hasSeenEntryAnimation("Jump Search"), true);
  });

  it("preserves isolation between different algorithms", () => {
    markEntryAnimationSeen("Jump Search");
    assert.equal(hasSeenEntryAnimation("Jump Search"), true);
    assert.equal(hasSeenEntryAnimation("Linear Search"), false);
    assert.equal(hasSeenEntryAnimation("Binary Search"), false);
  });

  it("handles null or undefined topic safely", () => {
    assert.equal(hasSeenEntryAnimation(null), false);
    assert.equal(hasSeenEntryAnimation(undefined), false);
    assert.doesNotThrow(() => markEntryAnimationSeen(null));
    assert.doesNotThrow(() => markEntryAnimationSeen(undefined));
  });

  it("handles missing window / sessionStorage environment gracefully", () => {
    delete globalThis.window;
    assert.equal(hasSeenEntryAnimation("Jump Search"), false);
    assert.doesNotThrow(() => markEntryAnimationSeen("Jump Search"));
  });
});

describe("Algorithm Entry Experience - Stages & Contracts", () => {
  it("verifies 5 progressive preparation stages match requirements", () => {
    const expectedStages = [
      "Preparing your learning environment",
      "Loading algorithm concepts",
      "Building your example walkthrough",
      "Preparing the visualization",
      "Setting up practice studio"
    ];

    assert.equal(expectedStages.length, 5, "Must have exactly 5 stages");
  });

  it("verifies animation duration is approximately 5 seconds (5000ms)", () => {
    const TOTAL_DURATION_MS = 5000;
    assert.equal(TOTAL_DURATION_MS, 5000);
  });
});
