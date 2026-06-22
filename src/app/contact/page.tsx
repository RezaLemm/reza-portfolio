export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#090909] px-6 pt-32">
      <section className="mx-auto max-w-4xl pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#c9a46a]">
          Contact
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] text-[#f2f2f2] md:text-7xl">
          Let’s work together.
        </h1>

        <p className="mt-8 text-lg leading-8 text-[#a8a8a8]">
          For design projects, collaborations, or portfolio inquiries, contact me
          by email.
        </p>

        <a
          href="mailto:Rezajobmm@gmail.com"
          className="mt-10 inline-block border border-[#c9a46a] px-7 py-4 text-sm font-semibold text-[#c9a46a] transition hover:bg-[#c9a46a] hover:text-[#090909]"
        >
          Rezajobmm@gmail.com
        </a>
      </section>
    </main>
  );
}