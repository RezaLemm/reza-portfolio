"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageToggle() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <motion.button
      onClick={toggleLang}
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="font-brand rounded-full border border-[#2a2a2a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a46a] transition hover:border-[#c9a46a] hover:bg-[#c9a46a] hover:text-[#090909]"
      aria-label="Switch language"
    >
      {lang === "en" ? "FA" : t.language.switchTo}
    </motion.button>
  );
}