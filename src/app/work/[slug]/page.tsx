import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#090909] px-6 pt-32">
      <article className="mx-auto max-w-7xl pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c9a46a]">
          {project.category}
        </p>

        <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-[#f2f2f2] md:text-7xl">
          {project.title}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-[#a8a8a8]">
          {project.description}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="rounded-full border border-[#2a2a2a] px-4 py-2 text-sm text-[#a8a8a8]"
            >
              {tool}
            </span>
          ))}
        </div>

        <div className="relative mt-14 aspect-[16/9] overflow-hidden rounded-3xl border border-[#2a2a2a]">
          <Image
            src={project.cover}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <section className="mt-16 grid gap-8 border-t border-[#2a2a2a] pt-12 md:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#c9a46a]">
              Type
            </p>
            <p className="mt-3 text-[#f2f2f2]">
              {project.type === "case-study" ? "Case Study" : "Quick Work"}
            </p>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#c9a46a]">
              Category
            </p>
            <p className="mt-3 text-[#f2f2f2]">{project.category}</p>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#c9a46a]">
              Tools
            </p>
            <p className="mt-3 text-[#f2f2f2]">{project.tools.join(", ")}</p>
          </div>
        </section>
      </article>
    </main>
  );
}
