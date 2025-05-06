"use client";

import { useTranslation } from "../../../app/context/languageContext";
export default function LanguageSwitcher() {
  const { locale, changeLanguage } = useTranslation();

  return (
    <div className="language-switcher">
      <button
        className={locale === "en" ? "active" : ""}
        onClick={() => changeLanguage("en")}
      >
        English
      </button>
      <button
        className={locale === "mk" ? "active" : ""}
        onClick={() => changeLanguage("mk")}
      >
        Македонски
      </button>
      <button
        className={locale === "sq" ? "active" : ""}
        onClick={() => changeLanguage("sq")}
      >
        Shqip
      </button>
    </div>
  );
}
