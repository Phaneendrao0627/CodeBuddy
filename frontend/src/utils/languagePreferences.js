import { useEffect, useState } from "react";

export const SUPPORTED_LANGUAGES = ["c", "java", "python"];

export const LANGUAGE_LABELS = {
  c: "C",
  java: "Java",
  python: "Python"
};

export const DEFAULT_LANGUAGE = "java";

export const STORAGE_KEY = "codebuddy_preferred_language";
export const LANGUAGE_CHANGE_EVENT = "codebuddy_language_change";

/**
 * Reads preferred programming language from localStorage.
 * Falls back to DEFAULT_LANGUAGE ('java').
 */
export function getPreferredLanguage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return DEFAULT_LANGUAGE;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved.toLowerCase())) {
      return saved.toLowerCase();
    }
  } catch {
    // ignore storage access errors
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Persists preferred programming language to localStorage
 * and notifies all listeners across the window.
 */
export function setPreferredLanguage(language) {
  if (!language) return;
  const normalized = language.toLowerCase();
  if (!SUPPORTED_LANGUAGES.includes(normalized)) return;

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, normalized);
    } catch {
      // ignore storage access errors
    }

    try {
      window.dispatchEvent(
        new CustomEvent(LANGUAGE_CHANGE_EVENT, { detail: { language: normalized } })
      );
    } catch {
      // ignore event dispatch errors
    }
  }
}

/**
 * React hook to read and update preferred language with live synchronization.
 */
export function useLanguagePreference() {
  const [language, setLanguageState] = useState(() => getPreferredLanguage());

  const setLanguage = (newLang) => {
    if (!newLang) return;
    const normalized = newLang.toLowerCase();
    if (!SUPPORTED_LANGUAGES.includes(normalized)) return;
    setPreferredLanguage(normalized);
    setLanguageState(normalized);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    function handleCustomEvent(e) {
      if (e.detail && e.detail.language) {
        setLanguageState(e.detail.language);
      }
    }

    function handleStorageEvent(e) {
      if (e.key === STORAGE_KEY && e.newValue) {
        const normalized = e.newValue.toLowerCase();
        if (SUPPORTED_LANGUAGES.includes(normalized)) {
          setLanguageState(normalized);
        }
      }
    }

    window.addEventListener(LANGUAGE_CHANGE_EVENT, handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  return [language, setLanguage];
}
