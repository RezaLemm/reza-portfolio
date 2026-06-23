"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.68, ease: smoothEase },
  },
};

export default function Hero() {
  const { t, lang } = useLanguage();
  const isFa = lang === "fa";

  return (
    <section className="relative min-h-screen overflow-hidden border-b border-[#2a2a2a] px-5 pt-28 md:px-6 md:pt-36">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 pb-20 lg:grid-cols-2 lg:gap-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={`order-1 ${
            isFa ? "lg:col-start-2 text-right" : "lg:col-start-1 text-left"
          }`}
        >
          <motion.p
            variants={fadeUp}
            className="mb-5 text-xs font-bold uppercase tracking-[0.32em] text-[#c9a46a] md:mb-7"
          >
            {t.hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className={`text-balance font-semibold tracking-[-0.055em] text-[#f2f2f2] ${
              isFa
                ? "text-4xl leading-[1.12] sm:text-5xl md:text-6xl xl:text-7xl"
                : "text-5xl leading-[0.92] sm:text-6xl md:text-7xl xl:text-8xl"
            }`}
          >
            <span className="font-brand">{t.hero.titleTop}</span>
            <br />
            <span className={isFa ? "font-fa-body font-bold" : "font-brand"}>
              {t.hero.titleBottom}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className={`mt-7 max-w-xl text-base leading-8 text-[#a8a8a8] md:text-lg ${
              isFa ? "mr-0 lg:mr-auto" : ""
            }`}
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className={`mt-9 flex flex-wrap gap-4 ${
              isFa ? "justify-start lg:justify-end" : "justify-start"
            }`}
          >
            <motion.div
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              <Link
                href="/work"
                className="inline-flex min-h-12 items-center gap-3 bg-[#c9a46a] px-7 py-4 text-sm font-bold text-[#090909] transition hover:bg-[#f2d18a]"
              >
                {t.hero.primaryButton}
                <ArrowUpRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center gap-3 border border-[#2a2a2a] px-7 py-4 text-sm font-bold text-[#f2f2f2] transition hover:border-[#c9a46a] hover:text-[#c9a46a]"
              >
                {t.hero.secondaryButton}
                <ArrowUpRight size={18} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className={`mt-12 grid max-w-xl grid-cols-3 gap-3 ${
              isFa ? "mr-0 lg:mr-auto" : ""
            }`}
          >
            {[t.hero.statOne, t.hero.statTwo, t.hero.statThree].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#2a2a2a] bg-[#111111]/60 px-4 py-4 text-center backdrop-blur-md transition hover:-translate-y-1 hover:border-[#c9a46a]/60"
              >
                <p className="text-xs font-semibold text-[#a8a8a8]">{item}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 28, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.18, ease: smoothEase }}
          className={`order-2 ${
            isFa ? "lg:col-start-1" : "lg:col-start-2"
          }`}
        >
          <div className="premium-card slow-float relative min-h-[360px] rounded-3xl p-4 sm:min-h-[430px]">
            <div className="relative flex h-full min-h-[330px] items-center justify-center overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#0d0d0d]/80 p-8 sm:min-h-[400px]">
              <div className="slow-spin absolute h-72 w-72 rounded-full border border-[#c9a46a]/10" />
              <div className="soft-pulse absolute h-52 w-52 rounded-full bg-[#c9a46a]/10 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2c2c2c,transparent_58%)]" />
              <div className="shimmer-line absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-[#c9a46a]/50 to-transparent" />

              <div className="relative z-10 max-w-md text-center">
                <p className="font-brand text-xs font-semibold uppercase tracking-[0.42em] text-[#c9a46a]">
                  LEMM Studio
                </p>

                <h2
                  className={`mt-5 text-3xl font-bold text-[#f2f2f2] md:text-4xl ${
                    isFa ? "font-fa-body" : "font-brand"
                  }`}
                >
                  {t.hero.visualTitle}
                </h2>

                <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-[#a8a8a8]">
                  {t.hero.visualDescription}
                </p>
              </div>

              <div className="soft-pulse absolute bottom-6 left-6 h-16 w-16 rounded-full border border-[#c9a46a]/30" />
              <div className="slow-float absolute right-8 top-8 h-3 w-3 rounded-full bg-[#c9a46a]" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}