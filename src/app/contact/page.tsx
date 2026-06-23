"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
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

export default function ContactPage() {
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
            {t.contact.eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className={`mt-5 max-w-4xl text-balance font-semibold tracking-[-0.045em] text-[#f2f2f2] ${
              isFa
                ? "text-4xl leading-[1.18] md:text-6xl"
                : "text-5xl leading-[0.98] md:text-7xl"
            }`}
          >
            {t.contact.title}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-3xl text-base leading-8 text-[#a8a8a8] md:text-lg"
          >
            {t.contact.description}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.97, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.2, ease: smoothEase }}
          whileHover={{ y: -6 }}
          className="premium-card rounded-3xl p-6 md:p-8"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="grid h-14 w-14 place-items-center rounded-2xl border border-[#c9a46a]/40 text-[#c9a46a]"
          >
            <Mail size={22} />
          </motion.div>

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
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="font-brand mt-8 inline-flex w-full items-center justify-center gap-3 border border-[#c9a46a] px-7 py-4 text-sm font-bold text-[#c9a46a] transition hover:bg-[#c9a46a] hover:text-[#090909]"
          >
            {t.contact.button}
            <ArrowUpRight size={18} />
          </motion.a>
        </motion.div>
      </section>
    </main>
  );
}