import {
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  useLanguagePreference
} from "../utils/languagePreferences";

function LanguageSelector({
  language: controlledLanguage,
  onSelectLanguage,
  size = "normal",
  className = ""
}) {
  const [preferredLang, setPreferredLang] = useLanguagePreference();

  const activeLanguage = controlledLanguage || preferredLang;

  function handleSelect(lang) {
    if (onSelectLanguage) {
      onSelectLanguage(lang);
    }
    // Always persist to preference store so other views stay in sync
    setPreferredLang(lang);
  }

  return (
    <div
      className={`language-selector-group size-${size} ${className}`}
      role="group"
      aria-label="Select programming language"
    >
      <span className="lang-selector-label">Language:</span>
      <div className="lang-pill-row">
        {SUPPORTED_LANGUAGES.map((langKey) => {
          const isActive = activeLanguage === langKey;
          return (
            <button
              key={langKey}
              type="button"
              className={`lang-pill-btn ${isActive ? "active" : ""}`}
              onClick={() => handleSelect(langKey)}
              aria-pressed={isActive}
            >
              {langKey === "c" && <span className="lang-icon">©️</span>}
              {langKey === "java" && <span className="lang-icon">☕</span>}
              {langKey === "python" && <span className="lang-icon">🐍</span>}
              <span className="lang-text">{LANGUAGE_LABELS[langKey]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LanguageSelector;
