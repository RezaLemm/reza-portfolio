"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Project } from "@/data/projects";
import { getCategoryLabel } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const { t, lang } = useLanguage();
  const isFa = lang === "fa";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="h-full"
    >
      <Link
        href={`/work/${project.slug}`}
        className="magnetic-glow group block h-full overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#111111] transition duration-300 hover:border-[#c9a46a]/70"
        dir={isFa ? "rtl" : "ltr"}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();

          event.currentTarget.style.setProperty(
            "--x",
            `${event.clientX - rect.left}px`,
          );

          event.currentTarget.style.setProperty(
            "--y",
            `${event.clientY - rect.top}px`,
          );
        }}
      >
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#101010]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2b2b2b,transparent_60%)] transition duration-500 group-hover:scale-110" />

          <div className="absolute inset-x-10 top-10 h-px bg-gradient-to-r from-transparent via-[#c9a46a]/45 to-transparent opacity-0 transition group-hover:opacity-100" />

          <motion.div
            animate={{ opacity: [0.25, 0.55, 0.25] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-40 w-40 rounded-full bg-[#c9a46a]/[0.04] blur-2xl"
          />

          <div className="relative z-10 px-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-[#c9a46a]">
              {getCategoryLabel(project.categoryId, lang)}
            </p>

            <h3
              className={`mt-5 text-3xl font-bold tracking-[-0.04em] text-[#f2f2f2] ${
                isFa ? "leading-[1.25]" : "font-brand leading-tight"
              }`}
            >
              {project.title[lang]}
            </h3>
          </div>
        </div>

        <div className={isFa ? "p-6 text-right" : "p-6 text-left"}>
          <div
            className={`mb-5 flex items-center justify-between gap-4 ${
              isFa ? "flex-row-reverse" : ""
            }`}
          >
            <span className="rounded-full border border-[#2a2a2a] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#a8a8a8]">
              {project.type === "case-study"
                ? t.projectType.caseStudy
                : t.projectType.quickWork}
            </span>

            <motion.span
              whileHover={{ rotate: 45 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
            >
              <ArrowUpRight
                size={18}
                className="text-[#a8a8a8] transition group-hover:text-[#c9a46a]"
              />
            </motion.span>
          </div>

          <p className="min-h-16 text-sm leading-7 text-[#a8a8a8]">
            {project.description[lang]}
          </p>

          <div
            className={`mt-6 flex flex-wrap gap-2 ${
              isFa ? "justify-end" : "justify-start"
            }`}
          >
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="font-brand rounded-full bg-[#090909] px-3 py-1 text-xs text-[#a8a8a8]"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}