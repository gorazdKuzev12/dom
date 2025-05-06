"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import en from "../translations/en.json";
import mk from "../translations/mk.json";
import sq from "../translations/sq.json";

const translations = {
  en,
  mk,
  sq,
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const router = useRouter();
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    // Get the locale from URL or localStorage
    const savedLocale = localStorage.getItem("locale") || "en";
    setLocale(savedLocale);
  }, []);

  const changeLanguage = (newLocale) => {
    if (!translations[newLocale]) return;

    localStorage.setItem("locale", newLocale);
    setLocale(newLocale);

    // Update URL to reflect language change (optional)
    const currentPath = window.location.pathname;
    const basePath = currentPath.split("/").slice(2).join("/");
    router.push(`/${newLocale}/${basePath}`);
  };

  const t = (key) => {
    return translations[locale]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
