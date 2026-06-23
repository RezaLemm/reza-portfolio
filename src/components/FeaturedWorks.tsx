import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";

export default function FeaturedWorks() {
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <section className="border-b border-[#2a2a2a] bg-[#090909] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c9a46a]">
              Featured Works
            </p>

            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.03em] text-[#f2f2f2] md:text-6xl">
              Selected visual projects
            </h2>
          </div>

          <Link
            href="/work"
            className="inline-flex items-center gap-3 text-sm font-semibold text-[#c9a46a] transition hover:text-[#f2f2f2]"
          >
            View Canvas
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}