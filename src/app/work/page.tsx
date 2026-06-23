"use client";

import { motion } from "framer-motion";
import WorkClient from "@/components/WorkClient";
import { useLanguage } from "@/components/LanguageProvider";

const smoothEase = [0.22, 1, 0.36, 1] as const;

export default function WorkPage() {
  const { t, lang } = useLanguage();
  const isFa = lang === "fa";

  return (
    <main className="min-h-screen bg-[#090909] px-5 pt-32 md:px-6">
      <section className="mx-auto max-w-7xl pb-24">
        <motion.div
          initial={{ y: 28, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.85, ease: smoothEase }}
          className={isFa ? "text-right" : "text-left"}
        >
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#c9a46a]">
            {t.canvas.eyebrow}
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-[#f2f2f2] md:text-7xl">
            {t.canvas.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#a8a8a8]">
            {t.canvas.description}
          </p>
        </motion.div>

        <WorkClient />
      </section>
    </main>
  );
}