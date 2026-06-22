import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden border-b border-[#2a2a2a] bg-[#090909] px-6 pt-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#c9a46a]">
            Designing meaning. Visualizing ideas.
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-[#f2f2f2] md:text-7xl lg:text-8xl">
            Graphic Designer & Visual Creator
          </h1>

          <p className="mt-8 max-w-xl text-base leading-7 text-[#a8a8a8] md:text-lg">
            I design visual identities, thumbnails, banners, advertising visuals,
            and digital graphics with a focus on atmosphere, clarity, and premium
            presentation.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/work"
              className="inline-flex items-center gap-3 bg-[#c9a46a] px-7 py-4 text-sm font-semibold text-[#090909] transition hover:bg-[#f2d18a]"
            >
              View Portfolio
              <ArrowUpRight size={18} />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-[#2a2a2a] px-7 py-4 text-sm font-semibold text-[#f2f2f2] transition hover:border-[#c9a46a]"
            >
              Contact
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[420px] rounded-2xl border border-[#2a2a2a] bg-[#141414] p-4">
          <div className="flex h-full items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] text-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[#c9a46a]">
                Featured Visual
              </p>
              <h2 className="mt-4 text-3xl font-semibold text-[#f2f2f2]">
                Portfolio Cover
              </h2>
              <p className="mt-3 text-sm text-[#a8a8a8]">
                Add your artwork image later.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}