import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function FeaturedWorks() {
  const featured = projects.filter((project) => project.featured);

  return (
    <section className="border-b border-[#2a2a2a] bg-[#090909] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c9a46a]">
              Featured Works
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-[#f2f2f2]">
              Selected visual projects
            </h2>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}