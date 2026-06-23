"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { useLanguage } from "@/components/LanguageProvider";
import { categories, projects } from "@/data/projects";

const smoothEase = [0.22, 1, 0.36, 1] as const;

export default function WorkClient() {
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projects;

    return projects.filter((project) => project.categoryId === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.12, ease: smoothEase }}
        className="mt-10 flex flex-wrap gap-3"
      >
        {categories.map((category) => {
          const isActive = category.id === activeCategory;

          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition hover:-translate-y-1 ${
                isActive
                  ? "border-[#c9a46a] bg-[#c9a46a] text-[#090909]"
                  : "border-[#2a2a2a] text-[#a8a8a8] hover:border-[#c9a46a] hover:text-[#f2f2f2]"
              }`}
            >
              {category.label[lang]}
            </button>
          );
        })}
      </motion.div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.42,
              delay: index * 0.04,
              ease: smoothEase,
            }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </div>
    </>
  );
}