"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { useLanguage } from "@/components/LanguageProvider";
import { projects } from "@/data/projects";

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

export default function FeaturedWorks() {
  const { t, lang } = useLanguage();
  const isFa = lang === "fa";
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <section className="relative overflow-hidden border-b border-[#2a2a2a] bg-[#090909] px-5 py-24 md:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-20 h-96 w-96 rounded-full bg-[#c9a46a]/[0.045] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className={`flex flex-col justify-between gap-8 md:flex-row md:items-end ${
            isFa ? "text-right md:flex-row-reverse" : "text-left"
          }`}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#c9a46a]">
              {t.featured.eyebrow}
            </p>

            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.04em] text-[#f2f2f2] md:text-6xl">
              {t.featured.title}
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#a8a8a8]">
              {t.featured.description}
            </p>
          </div>

          <motion.div whileHover={{ x: isFa ? -5 : 5 }}>
            <Link
              href="/work"
              className="inline-flex items-center gap-3 text-sm font-bold text-[#c9a46a] transition hover:text-[#f2f2f2]"
            >
              {t.featured.link}
              <ArrowUpRight size={18} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.15,
              },
            },
          }}
          className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {featuredProjects.map((project) => (
            <motion.div key={project.id} variants={fadeUp}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}