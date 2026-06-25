"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageToggle() {
  const { lang, toggleLang, t } = useLanguage();
  const nextLang = lang === "en" ? "fa" : "en";

  return (
    <motion.button
      data-language-toggle
      data-target-lang={nextLang}
      data-next-lang={nextLang}
      onClick={toggleLang}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="font-brand rounded-full border border-[#2a2a2a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a46a] transition hover:border-[#c9a46a] hover:bg-[#c9a46a] hover:text-[#090909]"
      aria-label="Switch language"
    >
      {lang === "en" ? "FA" : t.language.switchTo}
    </motion.button>
  );
}