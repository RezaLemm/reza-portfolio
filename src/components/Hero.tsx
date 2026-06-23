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
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
};

const fadeUp = {
  hidden: { y: 28, opacity: 0, filter: "blur(8px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: smoothEase },
  },
};

export default function Hero() {
  const { t, lang } = useLanguage();
  const isFa = lang === "fa";

  return (
    <section className="relative min-h-screen overflow-hidden border-b border-[#2a2a2a] bg-[#090909] px-5 pt-28 md:px-6 md:pt-36">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.45, 0.7, 0.45],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[#c9a46a]/10 blur-[120px]"
        />

        <motion.div
          animate={{
            x: [0, 24, 0],
            y: [0, -18, 0],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-white/[0.035] blur-[120px]"
        />

        <div className="noise-overlay" />
      </div>

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
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
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
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
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
              <motion.div
                key={item}
                whileHover={{ y: -5, borderColor: "rgba(201,164,106,0.7)" }}
                transition={{ type: "spring", stiffness: 240, damping: 18 }}
                className="rounded-2xl border border-[#2a2a2a] bg-[#111111]/70 px-4 py-4 text-center"
              >
                <p className="text-xs font-semibold text-[#a8a8a8]">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 34, opacity: 0, scale: 0.96, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.05, delay: 0.25, ease: smoothEase }}
          className={`order-2 ${
            isFa ? "lg:col-start-1" : "lg:col-start-2"
          }`}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="premium-card relative min-h-[360px] rounded-3xl p-4 sm:min-h-[430px]"
          >
            <div className="relative flex h-full min-h-[330px] items-center justify-center overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#0d0d0d] p-8 sm:min-h-[400px]">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute h-72 w-72 rounded-full border border-[#c9a46a]/10"
              />

              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-52 w-52 rounded-full bg-[#c9a46a]/10 blur-3xl"
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2c2c2c,transparent_58%)]" />
              <div className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-[#c9a46a]/50 to-transparent" />

              <div className="relative z-10 max-w-md text-center">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.7, ease: smoothEase }}
                  className="font-brand text-xs font-semibold uppercase tracking-[0.42em] text-[#c9a46a]"
                >
                  LEMM Studio
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.75, ease: smoothEase }}
                  className={`mt-5 text-3xl font-bold text-[#f2f2f2] md:text-4xl ${
                    isFa ? "font-fa-body" : "font-brand"
                  }`}
                >
                  {t.hero.visualTitle}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.05, duration: 0.75, ease: smoothEase }}
                  className="mx-auto mt-5 max-w-sm text-sm leading-7 text-[#a8a8a8]"
                >
                  {t.hero.visualDescription}
                </motion.p>
              </div>

              <motion.div
                animate={{ scale: [1, 1.16, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 left-6 h-16 w-16 rounded-full border border-[#c9a46a]/30"
              />

              <motion.div
                animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-8 top-8 h-3 w-3 rounded-full bg-[#c9a46a]"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}