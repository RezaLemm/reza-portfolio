"use client";

import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { categories, projects } from "@/data/projects";

export default function WorkClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-[#c9a46a] bg-[#c9a46a] text-[#090909]"
                  : "border-[#2a2a2a] text-[#a8a8a8] hover:border-[#c9a46a] hover:text-[#f2f2f2]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}