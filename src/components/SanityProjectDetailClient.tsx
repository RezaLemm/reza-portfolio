"use client"

import {motion} from "framer-motion"
import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  Calendar,
  CheckCircle2,
  Layers3,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react"

import {useLanguage} from "@/components/LanguageProvider"
import PortfolioPdfShowcase from "@/components/PortfolioPdfShowcase"
import PremiumProjectGalleryV5 from "@/components/PremiumProjectGalleryV5"
import type {SanityImage, SanityProject} from "@/types/sanity"

type Lang = "en" | "fa"

type AnyText =
  | string
  | number
  | boolean
  | {en?: unknown; fa?: unknown; titleEn?: unknown; titleFa?: unknown}
  | null
  | undefined

function fa(value: string) {
  return decodeURIComponent(value)
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

function imageUrl(image?: SanityImage) {
  return image?.asset?.url || ""
}

function projectTitle(project: SanityProject, lang: Lang) {
  return lang === "fa"
    ? safeText(project.titleFa, lang) || safeText(project.titleEn, lang)
    : safeText(project.titleEn, lang) || safeText(project.titleFa, lang)
}

function pickText(en?: string, faText?: string, lang?: Lang) {
  return lang === "fa" ? faText || en || "" : en || faText || ""
}

export default function SanityProjectDetailClient({
  project,
}: {
  project: SanityProject
}) {
  const {lang} = useLanguage()
  const isFa = lang === "fa"

  const title = projectTitle(project, lang)
  const category = isFa
    ? safeText(project.category?.titleFa, lang) || safeText(project.category?.titleEn, lang)
    : safeText(project.category?.titleEn, lang) || safeText(project.category?.titleFa, lang)

  const role = isFa
    ? safeText(project.roleFa, lang) || safeText(project.roleEn, lang)
    : safeText(project.roleEn, lang) || safeText(project.roleFa, lang)

  const shortDescription = isFa
    ? safeText(project.shortDescriptionFa, lang) || safeText(project.shortDescriptionEn, lang)
    : safeText(project.shortDescriptionEn, lang) || safeText(project.shortDescriptionFa, lang)

  const overview = isFa
    ? safeText(project.overviewFa, lang) || safeText(project.overviewEn, lang)
    : safeText(project.overviewEn, lang) || safeText(project.overviewFa, lang)

  const challenge = isFa
    ? safeText(project.challengeFa, lang) || safeText(project.challengeEn, lang)
    : safeText(project.challengeEn, lang) || safeText(project.challengeFa, lang)

  const solution = isFa
    ? safeText(project.solutionFa, lang) || safeText(project.solutionEn, lang)
    : safeText(project.solutionEn, lang) || safeText(project.solutionFa, lang)

  const cover = imageUrl(project.coverImage)
  const gallery = (project.gallery || []).filter((item) => Boolean(item.asset?.url))
  const featuredGallery = gallery

  const galleryItems = featuredGallery
    .map((image, index) => ({
      src: imageUrl(image),
      alt: isFa
        ? safeText(image.altFa, lang) || safeText(image.altEn, lang) || `${title} ${index + 1}`
        : safeText(image.altEn, lang) || safeText(image.altFa, lang) || `${title} ${index + 1}`,
    }))
    .filter((item) => Boolean(item.src))
  const tools = project.tools || []
  const deliverables = project.deliverables || []

  const label = {
    caseStudy: isFa ? fa("%DA%A9%DB%8C%D8%B3%20%D8%A7%D8%B3%D8%AA%D8%A7%D8%AF%DB%8C") : "Case Study",
    projectOverview: isFa ? fa("%D9%85%D8%B9%D8%B1%D9%81%DB%8C%20%D9%BE%D8%B1%D9%88%DA%98%D9%87") : "Project Overview",
    challenge: isFa ? fa("%DA%86%D8%A7%D9%84%D8%B4") : "Challenge",
    solution: isFa ? fa("%D8%B1%D8%A7%D9%87%E2%80%8C%D8%AD%D9%84") : "Solution",
    designSystem: isFa ? fa("%D8%B3%DB%8C%D8%B3%D8%AA%D9%85%20%D8%A8%D8%B5%D8%B1%DB%8C") : "Visual System",
    deliverables: isFa ? fa("%D8%AE%D8%B1%D9%88%D8%AC%DB%8C%E2%80%8C%D9%87%D8%A7") : "Deliverables",
    tools: isFa ? fa("%D8%A7%D8%A8%D8%B2%D8%A7%D8%B1%D9%87%D8%A7") : "Tools",
    year: isFa ? fa("%D8%B3%D8%A7%D9%84") : "Year",
    role: isFa ? fa("%D9%86%D9%82%D8%B4") : "Role",
    category: isFa ? fa("%D8%AF%D8%B3%D8%AA%D9%87") : "Category",
    fullMagazine: isFa ? fa("%D9%85%D8%AC%D9%84%D9%87%20%DA%A9%D8%A7%D9%85%D9%84%20%D9%BE%D8%B1%D9%88%DA%98%D9%87") : "Full Project Magazine",
    scroll: isFa ? fa("%D9%85%D8%B4%D8%A7%D9%87%D8%AF%D9%87%20%D9%BE%D8%B1%D9%88%DA%98%D9%87") : "Explore Project",
  }

  const statCards = [
    {
      label: label.category,
      value: category,
      icon: Layers3,
    },
    {
      label: label.year,
      value: project.year || "ط·آ·ط¢آ·ط·آ¢ط¢آ·ط·آ·ط¢آ¢ط·آ¢ط¢آ·ط·آ·ط¢آ·ط·آ¢ط¢آ¢ط·آ·ط¢آ¢ط·آ¢ط¢آ£ط·آ·ط¢آ·ط·آ¢ط¢آ·ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ·ط·آ¢ط¢آ¢ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ·ط·آ¢ط¢آ·ط·آ·ط¢آ¢ط·آ¢ط¢آ£ط·آ·ط¢آ·ط·آ¢ط¢آ¢ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ·ط·آ¢ط¢آ£ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ£ط·آ¢ط¢آ¢ط·آ£ط¢آ¢ط£آ¢أ¢â‚¬ع‘ط¢آ¬ط·آ¹أ¢â‚¬ع©ط·آ·ط¢آ¢ط·آ¢ط¢آ¬ط·آ·ط¢آ·ط·آ¢ط¢آ¹ط·آ£ط¢آ¢ط£آ¢أ¢â‚¬ع‘ط¢آ¬ط·آ¹ط¢آ©ط·آ·ط¢آ·ط·آ¢ط¢آ·ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ·ط·آ¢ط¢آ¢ط·آ·ط¢آ¢ط·آ¢ط¢آ¬ط·آ·ط¢آ·ط·آ¢ط¢آ·ط·آ·ط¢آ¢ط·آ¢ط¢آ£ط·آ·ط¢آ·ط·آ¢ط¢آ¢ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ·ط·آ¢ط¢آ£ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ£ط·آ¢ط¢آ¢ط·آ£ط¢آ¢ط£آ¢أ¢â€ڑآ¬ط¹â€کط·آ¢ط¢آ¬ط·آ·ط¢آ¹ط£آ¢أ¢â€ڑآ¬ط¹آ©ط·آ·ط¢آ·ط·آ¢ط¢آ¢ط·آ·ط¢آ¢ط·آ¢ط¢آ¬ط·آ·ط¢آ·ط·آ¢ط¢آ£ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ£ط·آ¢ط¢آ¢ط·آ£ط¢آ¢ط£آ¢أ¢â‚¬ع‘ط¢آ¬ط·آ¹أ¢â‚¬ع©ط·آ·ط¢آ¢ط·آ¢ط¢آ¬ط·آ·ط¢آ·ط·آ¢ط¢آ¥ط·آ£ط¢آ¢ط£آ¢أ¢â‚¬ع‘ط¢آ¬ط£آ¢أ¢â‚¬â€چط¢آ¢",
      icon: Calendar,
    },
    {
      label: label.role,
      value: role,
      icon: BriefcaseBusiness,
    },
  ].filter((item) => item.value && item.value !== "ط·آ·ط¢آ·ط·آ¢ط¢آ·ط·آ·ط¢آ¢ط·آ¢ط¢آ·ط·آ·ط¢آ·ط·آ¢ط¢آ¢ط·آ·ط¢آ¢ط·آ¢ط¢آ£ط·آ·ط¢آ·ط·آ¢ط¢آ·ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ·ط·آ¢ط¢آ¢ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ·ط·آ¢ط¢آ·ط·آ·ط¢آ¢ط·آ¢ط¢آ£ط·آ·ط¢آ·ط·آ¢ط¢آ¢ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ·ط·آ¢ط¢آ£ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ£ط·آ¢ط¢آ¢ط·آ£ط¢آ¢ط£آ¢أ¢â‚¬ع‘ط¢آ¬ط·آ¹أ¢â‚¬ع©ط·آ·ط¢آ¢ط·آ¢ط¢آ¬ط·آ·ط¢آ·ط·آ¢ط¢آ¹ط·آ£ط¢آ¢ط£آ¢أ¢â‚¬ع‘ط¢آ¬ط·آ¹ط¢آ©ط·آ·ط¢آ·ط·آ¢ط¢آ·ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ·ط·آ¢ط¢آ¢ط·آ·ط¢آ¢ط·آ¢ط¢آ¬ط·آ·ط¢آ·ط·آ¢ط¢آ·ط·آ·ط¢آ¢ط·آ¢ط¢آ£ط·آ·ط¢آ·ط·آ¢ط¢آ¢ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ·ط·آ¢ط¢آ£ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ£ط·آ¢ط¢آ¢ط·آ£ط¢آ¢ط£آ¢أ¢â€ڑآ¬ط¹â€کط·آ¢ط¢آ¬ط·آ·ط¢آ¹ط£آ¢أ¢â€ڑآ¬ط¹آ©ط·آ·ط¢آ·ط·آ¢ط¢آ¢ط·آ·ط¢آ¢ط·آ¢ط¢آ¬ط·آ·ط¢آ·ط·آ¢ط¢آ£ط·آ·ط¢آ¢ط·آ¢ط¢آ¢ط·آ·ط¢آ£ط·آ¢ط¢آ¢ط·آ£ط¢آ¢ط£آ¢أ¢â‚¬ع‘ط¢آ¬ط·آ¹أ¢â‚¬ع©ط·آ·ط¢آ¢ط·آ¢ط¢آ¬ط·آ·ط¢آ·ط·آ¢ط¢آ¥ط·آ£ط¢آ¢ط£آ¢أ¢â‚¬ع‘ط¢آ¬ط£آ¢أ¢â‚¬â€چط¢آ¢")

  return (
    <main
      className="relative overflow-hidden bg-[#060606] text-[#f2f2f2]"
      dir={isFa ? "rtl" : "ltr"}
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(201,164,106,0.10),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.055),transparent_28%)]" />

      <section className="relative min-h-screen overflow-hidden px-5 pb-16 pt-32 md:px-8 lg:px-12">
        {cover && (
          <div className="pointer-events-none absolute inset-0 opacity-28">
            <img
              src={cover}
              alt=""
              className="h-full w-full scale-110 object-cover blur-3xl"
            />
            <div className="absolute inset-0 bg-[#060606]/78" />
          </div>
        )}

        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <motion.div
            initial={{opacity: 0, y: 28}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.7, ease: [0.22, 1, 0.36, 1]}}
            className="relative z-10"
          >
            <div className={`flex flex-wrap items-center gap-3 ${isFa ? "justify-end" : ""}`}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a46a]/35 bg-[#c9a46a]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#c9a46a]">
                <Sparkles size={14} />
                {label.caseStudy}
              </span>

              {category && (
                <span className="rounded-full border border-[#2a2a2a] bg-[#101010]/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#a8a8a8]">
                  {category}
                </span>
              )}
            </div>

            <h1 className="mt-8 max-w-4xl text-6xl font-semibold leading-[0.86] tracking-[-0.075em] text-white md:text-8xl lg:text-9xl">
              {title}
            </h1>

            {shortDescription && (
              <p className="mt-8 max-w-2xl text-base leading-9 text-[#b7b7b7] md:text-lg">
                {shortDescription}
              </p>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              {statCards.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.label}
                    className="min-w-[160px] rounded-[1.4rem] border border-[#2a2a2a] bg-[#111111]/82 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] backdrop-blur-xl"
                  >
                    <div className={`flex items-center gap-2 ${isFa ? "justify-end" : ""}`}>
                      <Icon size={16} className="text-[#c9a46a]" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#727272]">
                        {item.label}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-bold text-[#f2f2f2]">
                      {item.value}
                    </p>
                  </div>
                )
              })}
            </div>

            <a
              href="#case-study-content"
              className="mt-10 inline-flex items-center gap-3 rounded-full border border-[#c9a46a] bg-[#c9a46a] px-6 py-4 text-sm font-bold text-[#090909] transition hover:scale-[1.01]"
            >
              {label.scroll}
              <ArrowUpRight size={17} />
            </a>
          </motion.div>

          <motion.div
            initial={{opacity: 0, y: 36, scale: 0.96}}
            animate={{opacity: 1, y: 0, scale: 1}}
            transition={{duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.08}}
            className="relative z-10"
          >
            <div className="relative overflow-hidden rounded-[2.2rem] border border-[#2a2a2a] bg-[#0b0b0b] p-4 shadow-[0_50px_150px_rgba(0,0,0,0.75)]">
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-[#2a2a2a] bg-[#111111]/90 px-4 py-3">
                <div className={`flex items-center gap-2 ${isFa ? "flex-row-reverse" : ""}`}>
                  <span className="h-2.5 w-2.5 rounded-full bg-[#c9a46a]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#545454]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2a2a2a]" />
                </div>

                <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#c9a46a]">
                  LEMM Studio
                </span>
              </div>

              <div className="relative overflow-hidden rounded-[1.6rem] bg-[#050505]">
                {cover ? (
                  <img
                    src={cover}
                    alt={safeText(project.coverImage?.altEn, lang) || title}
                    className="h-[560px] w-full object-contain p-3"
                  />
                ) : (
                  <div className="grid h-[560px] place-items-center text-[#727272]">
                    {title}
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.045),transparent_14%,transparent_86%,rgba(255,255,255,0.035))]" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="case-study-content"
        className="relative px-5 py-12 md:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-3">
            <motion.article
              initial={{opacity: 0, y: 24}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.2}}
              transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1]}}
              className="rounded-[2rem] border border-[#2a2a2a] bg-[#111111]/78 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] backdrop-blur-xl md:p-8"
            >
              <div className={`flex items-center gap-3 ${isFa ? "justify-end" : ""}`}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#c9a46a]/40 bg-[#c9a46a]/10 text-[#c9a46a]">
                  <Award size={18} />
                </span>
                <h2 className="text-xl font-semibold text-white">
                  {label.projectOverview}
                </h2>
              </div>

              <p className="mt-6 text-sm leading-8 text-[#b7b7b7]">
                {overview || shortDescription || title}
              </p>
            </motion.article>

            <motion.article
              initial={{opacity: 0, y: 24}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.2}}
              transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05}}
              className="rounded-[2rem] border border-[#2a2a2a] bg-[#111111]/78 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] backdrop-blur-xl md:p-8"
            >
              <div className={`flex items-center gap-3 ${isFa ? "justify-end" : ""}`}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#c9a46a]/40 bg-[#c9a46a]/10 text-[#c9a46a]">
                  <Target size={18} />
                </span>
                <h2 className="text-xl font-semibold text-white">
                  {label.challenge}
                </h2>
              </div>

              <p className="mt-6 text-sm leading-8 text-[#b7b7b7]">
                {challenge || shortDescription || title}
              </p>
            </motion.article>

            <motion.article
              initial={{opacity: 0, y: 24}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.2}}
              transition={{duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1}}
              className="rounded-[2rem] border border-[#2a2a2a] bg-[#111111]/78 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.045)] backdrop-blur-xl md:p-8"
            >
              <div className={`flex items-center gap-3 ${isFa ? "justify-end" : ""}`}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[#c9a46a]/40 bg-[#c9a46a]/10 text-[#c9a46a]">
                  <CheckCircle2 size={18} />
                </span>
                <h2 className="text-xl font-semibold text-white">
                  {label.solution}
                </h2>
              </div>

              <p className="mt-6 text-sm leading-8 text-[#b7b7b7]">
                {solution || overview || shortDescription || title}
              </p>
            </motion.article>
          </div>

          {(deliverables.length > 0 || tools.length > 0) && (
            <section className="mt-8 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
              {deliverables.length > 0 && (
                <div className="rounded-[2rem] border border-[#2a2a2a] bg-[#0d0d0d]/82 p-6 md:p-8">
                  <div className={`flex items-center gap-3 ${isFa ? "justify-end" : ""}`}>
                    <Layers3 size={20} className="text-[#c9a46a]" />
                    <h2 className="text-2xl font-semibold text-white">
                      {label.deliverables}
                    </h2>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {deliverables.map((item, index) => {
                      const text = isFa
                        ? safeText(item.titleFa, lang) || safeText(item.titleEn, lang)
                        : safeText(item.titleEn, lang) || safeText(item.titleFa, lang)

                      return (
                        <div
                          key={`${item._key || text}-${index}`}
                          className="rounded-2xl border border-[#2a2a2a] bg-[#111111]/80 p-4 text-sm font-bold text-[#f2f2f2]"
                        >
                          {text}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {tools.length > 0 && (
                <div className="rounded-[2rem] border border-[#2a2a2a] bg-[#0d0d0d]/82 p-6 md:p-8">
                  <div className={`flex items-center gap-3 ${isFa ? "justify-end" : ""}`}>
                    <Wrench size={20} className="text-[#c9a46a]" />
                    <h2 className="text-2xl font-semibold text-white">
                      {label.tools}
                    </h2>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-full border border-[#2a2a2a] bg-[#111111]/80 px-4 py-2 text-sm font-bold text-[#d8d8d8]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {galleryItems.length > 0 && (
            <PremiumProjectGalleryV5
              images={galleryItems.map((item, index) => ({
                _key: `${project.slug?.current ?? "project"}-${index}`,
                url: item.src,
                altEn: item.alt,
                altFa: item.alt,
              }))}
              title={isFa ? "ط³غŒط³طھظ… ط¨طµط±غŒ" : "Visual System"}
              lang={isFa ? "fa" : "en"}
            />
          )}

          <section className="mt-14">
            <div className={`mb-6 ${isFa ? "text-right" : "text-left"}`}>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#c9a46a]">
                PDF Portfolio
              </p>
              <h2 className="mt-2 text-4xl font-semibold tracking-[-0.055em] text-white md:text-6xl">
                {label.fullMagazine}
              </h2>
            </div>

            <PortfolioPdfShowcase project={project} />
          </section>
        </div>
      </section>
    </main>
  )
}