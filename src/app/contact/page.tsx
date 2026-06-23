"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { useLanguage } from "@/components/LanguageProvider";
import { cardReveal, revealUp, staggerContainer } from "@/lib/motion";

export default function ContactPage() {
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
              {t.contact.eyebrow}
            </motion.p>

            <motion.h1
              variants={revealUp}
              className={`mt-5 max-w-4xl text-balance font-semibold tracking-[-0.045em] text-[#f2f2f2] ${
                isFa
                  ? "text-4xl leading-[1.18] md:text-6xl"
                  : "text-5xl leading-[0.98] md:text-7xl"
              }`}
            >
              {t.contact.title}
            </motion.h1>

            <motion.p
              variants={revealUp}
              className="mt-8 max-w-3xl text-base leading-8 text-[#a8a8a8] md:text-lg"
            >
              {t.contact.description}
            </motion.p>
          </motion.div>

          <motion.div
            variants={cardReveal}
            initial="hidden"
            animate="show"
            className="premium-card rounded-3xl p-6 md:p-8"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#c9a46a]/40 text-[#c9a46a]">
              <Mail size={22} />
            </div>

            <p
              className={`mt-6 text-sm leading-7 text-[#a8a8a8] ${
                isFa ? "text-right" : "text-left"
              }`}
            >
              {t.contact.note}
            </p>

            <motion.a
              href="mailto:Rezajobmm@gmail.com"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="font-brand mt-8 inline-flex w-full items-center justify-center gap-3 border border-[#c9a46a] px-7 py-4 text-sm font-bold text-[#c9a46a] transition hover:bg-[#c9a46a] hover:text-[#090909]"
            >
              {t.contact.button}
              <ArrowUpRight size={18} />
            </motion.a>
          </motion.div>
        </section>
      </main>
    </PageTransition>
  );
}