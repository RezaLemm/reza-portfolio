import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-[#090909] px-6 pt-32">
      <section className="mx-auto max-w-7xl pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c9a46a]">
          Portfolio
        </p>

        <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-[#f2f2f2] md:text-7xl">
          All works
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-[#a8a8a8]">
          A collection of brand identities, packaging systems, thumbnails,
          banners, advertising visuals, social media designs, and AI-assisted
          artworks.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </main>
  );
}