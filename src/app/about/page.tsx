"use client";

import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/components/LanguageProvider";
import { cardReveal, revealUp, staggerContainer } from "@/lib/motion";

export default function AboutPage() {
  const { t, lang } = useLanguage();
  const isFa = lang === "fa";

  return (
    <PageTransition>
      <main className="min-h-screen px-5 pt-32 md:px-6">
        <section className="mx-auto grid max-w-7xl gap-10 pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
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
              {t.about.eyebrow}
            </motion.p>

            <motion.h1
              variants={revealUp}
              className={`mt-5 max-w-4xl text-balance font-semibold tracking-[-0.045em] text-[#f2f2f2] ${
                isFa
                  ? "text-4xl leading-[1.18] md:text-6xl"
                  : "text-5xl leading-[0.98] md:text-7xl"
              }`}
            >
              {t.about.title}
            </motion.h1>

            <motion.p
              variants={revealUp}
              className="mt-8 max-w-3xl text-base leading-8 text-[#a8a8a8] md:text-lg"
            >
              {t.about.description}
            </motion.p>
          </motion.div>

          <motion.div
            variants={cardReveal}
            initial="hidden"
            animate="show"
            className="premium-card rounded-3xl p-6 md:p-8"
          >
            <p className="font-brand text-xs font-bold uppercase tracking-[0.35em] text-[#c9a46a]">
              LEMM Studio
            </p>

            <h2
              className={`mt-5 text-3xl font-bold text-[#f2f2f2] ${
                isFa ? "text-right" : "font-brand"
              }`}
            >
              {t.about.cardTitle}
            </h2>

            <p
              className={`mt-4 text-sm leading-7 text-[#a8a8a8] ${
                isFa ? "text-right" : "text-left"
              }`}
            >
              {t.about.cardDescription}
            </p>

            <div className="mt-8 grid gap-3">
              {[t.about.itemOne, t.about.itemTwo, t.about.itemThree].map(
                (item) => (
                  <div
                    key={item}
                    className={`rounded-2xl border border-[#2a2a2a] bg-[#090909]/80 px-4 py-4 text-sm font-semibold text-[#f2f2f2] transition hover:border-[#c9a46a] ${
                      isFa ? "text-right" : "text-left"
                    }`}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </motion.div>
        </section>
      </main>
    </PageTransition>
  );
}