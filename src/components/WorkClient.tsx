"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, delay: 0.2, ease: smoothEase }}
        className="mt-10 flex flex-wrap gap-3"
      >
        {categories.map((category) => {
          const isActive = category.id === activeCategory;

          return (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-[#c9a46a] bg-[#c9a46a] text-[#090909]"
                  : "border-[#2a2a2a] text-[#a8a8a8] hover:border-[#c9a46a] hover:text-[#f2f2f2]"
              }`}
            >
              {category.label[lang]}
            </motion.button>
          );
        })}
      </motion.div>

      <motion.div
        layout
        className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ scale: 0.96, opacity: 0, y: 18 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 18 }}
              transition={{ duration: 0.45, ease: smoothEase }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}