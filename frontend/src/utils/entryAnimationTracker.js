/**
 * Tracks which algorithms have already had their entry animation shown in the current session.
 * Prevents redundant delays when revisiting algorithms.
 */

const STORAGE_PREFIX = "codebuddy_seen_entry_";

export function hasSeenEntryAnimation(topic) {
  if (typeof window === "undefined" || !window.sessionStorage || !topic) {
    return false;
  }
  try {
    return window.sessionStorage.getItem(STORAGE_PREFIX + topic) === "true";
  } catch {
    return false;
  }
}

export function markEntryAnimationSeen(topic) {
  if (typeof window === "undefined" || !window.sessionStorage || !topic) {
    return;
  }
  try {
    window.sessionStorage.setItem(STORAGE_PREFIX + topic, "true");
  } catch {
    // ignore
  }
}
