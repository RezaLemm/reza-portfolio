import WorkClient from "@/components/WorkClient";

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-[#090909] px-6 pt-32">
      <section className="mx-auto max-w-7xl pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c9a46a]">
          Canvas
        </p>

        <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-[#f2f2f2] md:text-7xl">
          Visual archive
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-[#a8a8a8]">
          A curated archive of visual experiments, AI artworks, thumbnails,
          banners, and creative studies.
        </p>

        <WorkClient />
      </section>
    </main>
  );
}