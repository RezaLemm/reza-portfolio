"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { useLanguage } from "@/components/LanguageProvider";
import { projects } from "@/data/projects";

const smoothEase = [0.22, 1, 0.36, 1] as const;

export default function FeaturedWorks() {
  const { t, lang } = useLanguage();
  const isFa = lang === "fa";
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <section className="relative overflow-hidden border-b border-[#2a2a2a] px-5 py-24 md:px-6">
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ y: 22, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: smoothEase }}
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

          <Link
            href="/work"
            className="inline-flex items-center gap-3 text-sm font-bold text-[#c9a46a] transition hover:translate-x-1 hover:text-[#f2f2f2]"
          >
            {t.featured.link}
            <ArrowUpRight size={18} />
          </Link>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{
                duration: 0.5,
                delay: index * 0.07,
                ease: smoothEase,
              }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}