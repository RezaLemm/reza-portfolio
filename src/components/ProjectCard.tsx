import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#141414] transition hover:border-[#c9a46a]/70"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#101010]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2a2a2a,transparent_55%)]" />

        <div className="relative z-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#c9a46a]">
            {project.category}
          </p>
          <h3 className="mt-4 px-6 text-3xl font-semibold tracking-[-0.04em] text-[#f2f2f2]">
            {project.title}
          </h3>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="rounded-full border border-[#2a2a2a] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#a8a8a8]">
            {project.type === "case-study" ? "Case Study" : "Quick Work"}
          </span>

          <ArrowUpRight
            size={18}
            className="text-[#a8a8a8] transition group-hover:text-[#c9a46a]"
          />
        </div>

        <p className="text-sm leading-6 text-[#a8a8a8]">
          {project.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full bg-[#090909] px-3 py-1 text-xs text-[#a8a8a8]"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}