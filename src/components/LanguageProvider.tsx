"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { dictionary, type Dictionary, type Lang } from "@/lib/i18n";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const LANG_STORAGE_KEY = "lemm-studio-lang";

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    let savedLang: string | null = null;

    try {
      savedLang = window.localStorage.getItem(LANG_STORAGE_KEY);
    } catch {
      savedLang = null;
    }

    if (savedLang === "fa" || savedLang === "en") {
      setLang(savedLang);
    }

    window.requestAnimationFrame(() => {
      document.documentElement.classList.add("lang-hydrated");
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
    document.documentElement.dataset.lang = lang;

    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
      document.cookie = `${LANG_STORAGE_KEY}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore storage errors
    }
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang((current) => (current === "en" ? "fa" : "en")),
      t: dictionary[lang],
    }),
    [lang],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
