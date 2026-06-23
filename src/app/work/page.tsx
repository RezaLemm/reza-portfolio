"use client";

import { motion } from "framer-motion";
import WorkClient from "@/components/WorkClient";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/components/LanguageProvider";
import { revealUp, staggerContainer } from "@/lib/motion";

export default function WorkPage() {
  const { t, lang } = useLanguage();
  const isFa = lang === "fa";

  return (
    <PageTransition>
      <main className="min-h-screen px-5 pt-32 md:px-6">
        <section className="mx-auto max-w-7xl pb-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className={isFa ? "text-right" : "text-left"}
          >
            <motion.p
              variants={revealUp}
              className="text-xs font-bold uppercase tracking-[0.35em] text-[#c9a46a]"
            >
              {t.canvas.eyebrow}
            </motion.p>

            <motion.h1
              variants={revealUp}
              className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-[#f2f2f2] md:text-7xl"
            >
              {t.canvas.title}
            </motion.h1>

            <motion.p
              variants={revealUp}
              className="mt-6 max-w-2xl text-base leading-8 text-[#a8a8a8]"
            >
              {t.canvas.description}
            </motion.p>
          </motion.div>

          <WorkClient />
        </section>
      </main>
    </PageTransition>
  );
}