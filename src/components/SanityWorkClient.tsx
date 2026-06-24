"use client"

import Link from "next/link"
import {useMemo, useState} from "react"
import {motion} from "framer-motion"
import {ArrowUpRight} from "lucide-react"
import PageTransition from "@/components/PageTransition"
import {useLanguage} from "@/components/LanguageProvider"
import {cardReveal, revealUp, staggerContainer} from "@/lib/motion"
import type {SanityCategory, SanityProject} from "@/types/sanity"

type Lang = "en" | "fa"
type AnyText = string | number | boolean | {en?: unknown; fa?: unknown; titleEn?: unknown; titleFa?: unknown} | null | undefined

type SanityWorkClientProps = {
  projects: SanityProject[]
  categories: SanityCategory[]
}

function safeText(value: AnyText, lang: Lang): string {
  if (value === null || value === undefined) return ""
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") return String(value)

  if (typeof value === "object") {
    const primary = lang === "fa" ? value.fa ?? value.titleFa : value.en ?? value.titleEn
    const fallback = lang === "fa" ? value.en ?? value.titleEn : value.fa ?? value.titleFa

    if (typeof primary === "string") return primary
    if (typeof fallback === "string") return fallback
  }

  return ""
}

function getProjectTitle(project: SanityProject, lang: Lang) {
  return safeText(project.titleEn, lang) || safeText(project.titleFa, lang) || "Untitled"
}

function getProjectDescription(project: SanityProject, lang: Lang) {
  return lang === "fa"
    ? safeText(project.shortDescriptionFa, lang) || safeText(project.shortDescriptionEn, lang)
    : safeText(project.shortDescriptionEn, lang) || safeText(project.shortDescriptionFa, lang)
}

function getCategoryTitle(category: SanityCategory | null | undefined, lang: Lang) {
  if (!category) return lang === "fa" ? "بدون دسته‌بندی" : "Uncategorized"

  return lang === "fa"
    ? safeText(category.titleFa, lang) || safeText(category.titleEn, lang)
    : safeText(category.titleEn, lang) || safeText(category.titleFa, lang)
}

function getImageAlt(project: SanityProject, lang: Lang) {
  return lang === "fa"
    ? safeText(project.coverImage?.altFa, lang) || getProjectTitle(project, lang)
    : safeText(project.coverImage?.altEn, lang) || getProjectTitle(project, lang)
}

function SanityProjectCard({project}: {project: SanityProject}) {
  const {lang, t} = useLanguage()
  const isFa = lang === "fa"
  const imageUrl = project.coverImage?.asset?.url
  const slug = project.slug?.current

  return (
    <Link
      href={slug ? `/work/${slug}` : "/work"}
      className="magnetic-glow group block h-full overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#111111]/82 backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:border-[#c9a46a]/70"
      dir={isFa ? "rtl" : "ltr"}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`)
        event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`)
      }}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#101010]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={getImageAlt(project, lang)}
            className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2b2b2b,transparent_60%)] transition duration-500 group-hover:scale-110" />
            <div className="absolute h-40 w-40 rounded-full bg-[#c9a46a]/[0.045] blur-2xl" />
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/35 to-transparent" />

        <div className="relative z-10 px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.38em] text-[#c9a46a]">
            {getCategoryTitle(project.category, lang)}
          </p>

          <h3
            className={`mt-5 text-3xl font-bold tracking-[-0.04em] text-[#f2f2f2] ${
              isFa ? "leading-[1.25]" : "font-brand leading-tight"
            }`}
          >
            {getProjectTitle(project, lang)}
          </h3>
        </div>
      </div>

      <div className={isFa ? "p-6 text-right" : "p-6 text-left"}>
        <div className={`mb-5 flex items-center justify-between gap-4 ${isFa ? "flex-row-reverse" : ""}`}>
          <span className="rounded-full border border-[#2a2a2a] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#a8a8a8]">
            {project.type === "quick-work" ? t.projectType.quickWork : t.projectType.caseStudy}
          </span>

          <ArrowUpRight
            size={18}
            className="text-[#a8a8a8] transition group-hover:rotate-45 group-hover:text-[#c9a46a]"
          />
        </div>

        <p className="min-h-16 text-sm leading-7 text-[#a8a8a8]">
          {getProjectDescription(project, lang)}
        </p>

        <div className={`mt-6 flex flex-wrap gap-2 ${isFa ? "justify-end" : "justify-start"}`}>
          {(project.tools || []).map((tool, index) => (
            <span
              key={`${safeText(tool as AnyText, lang)}-${index}`}
              className="font-brand rounded-full bg-[#090909] px-3 py-1 text-xs text-[#a8a8a8]"
            >
              {safeText(tool as AnyText, lang)}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default function SanityWorkClient({projects, categories}: SanityWorkClientProps) {
  const {t, lang} = useLanguage()
  const isFa = lang === "fa"
  const [activeCategory, setActiveCategory] = useState("all")

  const visibleProjects = useMemo(() => {
    if (activeCategory === "all") return projects
    return projects.filter((project) => project.category?.slug?.current === activeCategory)
  }, [activeCategory, projects])

  return (
    <PageTransition>
      <main className="min-h-screen px-5 pt-32 md:px-6">
        <section className="mx-auto max-w-7xl pb-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className={isFa ? "text-right" : "text-left"}
          >
            <motion.p
              variants={revealUp}
              className="text-xs font-bold uppercase tracking-[0.35em] text-[#c9a46a]"
            >
              {safeText(t.canvas.eyebrow, lang)}
            </motion.p>

            <motion.h1
              variants={revealUp}
              className="mt-4 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-[#f2f2f2] md:text-7xl"
            >
              {safeText(t.canvas.title, lang)}
            </motion.h1>

            <motion.p
              variants={revealUp}
              className="mt-6 max-w-2xl text-base leading-8 text-[#a8a8a8]"
            >
              {safeText(t.canvas.description, lang)}
            </motion.p>
          </motion.div>

          <div className={`mt-12 flex flex-wrap gap-3 ${isFa ? "justify-end" : "justify-start"}`}>
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full border px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] transition ${
                activeCategory === "all"
                  ? "border-[#c9a46a] bg-[#c9a46a] text-[#090909]"
                  : "border-[#2a2a2a] text-[#a8a8a8] hover:border-[#c9a46a] hover:text-[#c9a46a]"
              }`}
            >
              {safeText(t.common.all, lang)}
            </button>

            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category.slug.current)}
                className={`rounded-full border px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] transition ${
                  activeCategory === category.slug.current
                    ? "border-[#c9a46a] bg-[#c9a46a] text-[#090909]"
                    : "border-[#2a2a2a] text-[#a8a8a8] hover:border-[#c9a46a] hover:text-[#c9a46a]"
                }`}
              >
                {getCategoryTitle(category, lang)}
              </button>
            ))}
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {visibleProjects.map((project) => (
              <motion.div key={project._id} variants={cardReveal}>
                <SanityProjectCard project={project} />
              </motion.div>
            ))}
          </motion.div>

          {visibleProjects.length === 0 && (
            <div className={`mt-16 rounded-3xl border border-[#2a2a2a] bg-[#111111]/70 p-8 ${isFa ? "text-right" : "text-left"}`}>
              <p className="text-sm leading-7 text-[#a8a8a8]">
                {isFa
                  ? "فعلاً پروژه‌ای در این دسته‌بندی منتشر نشده است."
                  : "No published projects are available in this category yet."}
              </p>
            </div>
          )}
        </section>
      </main>
    </PageTransition>
  )
}
