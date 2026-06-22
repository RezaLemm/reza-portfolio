import Image from "next/image";
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
      className="group block overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#141414]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/80 via-transparent to-transparent" />
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.25em] text-[#c9a46a]">
            {project.category}
          </p>
          <ArrowUpRight
            size={18}
            className="text-[#a8a8a8] transition group-hover:text-[#c9a46a]"
          />
        </div>

        <h3 className="text-2xl font-semibold text-[#f2f2f2]">
          {project.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#a8a8a8]">
          {project.description}
        </p>
      </div>
    </Link>
  );
}