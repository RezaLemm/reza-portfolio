"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="rounded-full border border-[#2a2a2a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a46a] transition hover:border-[#c9a46a] hover:bg-[#c9a46a] hover:text-[#090909]"
      aria-label="Switch language"
    >
      {lang === "en" ? "FA" : "EN"}
    </button>
  );
}