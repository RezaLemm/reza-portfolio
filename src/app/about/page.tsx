"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { y: 28, opacity: 0, filter: "blur(8px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: smoothEase },
  },
};

export default function AboutPage() {
  const { t, lang } = useLanguage();
  const isFa = lang === "fa";

  return (
    <main className="min-h-screen bg-[#090909] px-5 pt-32 md:px-6">
      <section className="mx-auto grid max-w-7xl gap-10 pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <motion.div
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
          initial="hidden"
          animate="show"
          className={isFa ? "text-right" : "text-left"}
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-bold uppercase tracking-[0.35em] text-[#c9a46a]"
          >
            {t.about.eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className={`mt-5 max-w-4xl text-balance font-semibold tracking-[-0.045em] text-[#f2f2f2] ${
              isFa
                ? "text-4xl leading-[1.18] md:text-6xl"
                : "text-5xl leading-[0.98] md:text-7xl"
            }`}
          >
            {t.about.title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-3xl text-base leading-8 text-[#a8a8a8] md:text-lg"
          >
            {t.about.description}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.97, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.2, ease: smoothEase }}
          whileHover={{ y: -6 }}
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
              (item, index) => (
                <motion.div
                  key={item}
                  initial={{ x: isFa ? 18 : -18, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: 0.55 + index * 0.12,
                    duration: 0.55,
                    ease: smoothEase,
                  }}
                  whileHover={{ x: isFa ? -4 : 4, borderColor: "#c9a46a" }}
                  className={`rounded-2xl border border-[#2a2a2a] bg-[#090909] px-4 py-4 text-sm font-semibold text-[#f2f2f2] ${
                    isFa ? "text-right" : "text-left"
                  }`}
                >
                  {item}
                </motion.div>
              ),
            )}
          </div>
        </motion.div>
      </section>
    </main>
  );
}