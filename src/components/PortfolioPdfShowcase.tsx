"use client"

import {useEffect, useMemo, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Download,
  FileText,
  Grid3X3,
  Maximize2,
  MousePointer2,
  Pause,
  Play,
  Sparkles,
  Timer,
  X,
} from "lucide-react"
import {cardReveal} from "@/lib/motion"
import {useLanguage} from "@/components/LanguageProvider"
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

export default function PortfolioPdfShowcase({
  project,
}: {
  project: SanityProject
}) {
  const {lang} = useLanguage()
  const isFa = lang === "fa"
  const title = projectTitle(project, lang)
  const pdfUrl = project.portfolioPdf?.asset?.url

  const pages = useMemo(() => {
    return (project.pdfPages || []).filter((page) => Boolean(page.asset?.url))
  }, [project.pdfPages])

  const [activeIndex, setActiveIndex] = useState(0)
  const [showAllPages, setShowAllPages] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [dragStartX, setDragStartX] = useState<number | null>(null)

  const pageCount = pages.length
  const activePage = pages[activeIndex]
  const activeUrl = imageUrl(activePage)

  const canGoPrev = activeIndex > 0
  const canGoNext = activeIndex < pageCount - 1

  const label = {
    magazine: isFa
      ? fa("%D9%85%D8%AC%D9%84%D9%87%20%D8%AF%DB%8C%D8%AC%DB%8C%D8%AA%D8%A7%D9%84%20%D9%BE%D8%B1%D9%88%DA%98%D9%87")
      : "Digital project magazine",
    description: isFa
      ? fa("%D9%BE%D9%88%D8%B1%D8%AA%D9%81%D9%88%D9%84%DB%8C%D9%88%DB%8C%20%DA%A9%D8%A7%D9%85%D9%84%20%D9%BE%D8%B1%D9%88%DA%98%D9%87%20%D8%A8%D9%87%20%D8%B4%DA%A9%D9%84%20%DB%8C%DA%A9%20%D8%AA%D8%AC%D8%B1%D8%A8%D9%87%20%D8%B3%DB%8C%D9%86%D9%85%D8%A7%DB%8C%DB%8C%D8%8C%20%D8%B3%D8%B1%DB%8C%D8%B9%20%D9%88%20%D8%AA%D8%B5%D9%88%DB%8C%D8%B1%DB%8C%20%D9%86%D9%85%D8%A7%DB%8C%D8%B4%20%D8%AF%D8%A7%D8%AF%D9%87%20%D9%85%DB%8C%E2%80%8C%D8%B4%D9%88%D8%AF.")
      : `The full ${title} portfolio is presented as a cinematic, fast, image-based reading experience with a premium editorial feel.`,
    page: isFa ? fa("%D8%B5%D9%81%D8%AD%D9%87") : "Page",
    prev: isFa ? fa("%D9%82%D8%A8%D9%84%DB%8C") : "Prev",
    next: isFa ? fa("%D8%A8%D8%B9%D8%AF%DB%8C") : "Next",
    allPages: isFa ? fa("%D9%85%D8%B4%D8%A7%D9%87%D8%AF%D9%87%20%D9%87%D9%85%D9%87%20%D8%B5%D9%81%D8%AD%D8%A7%D8%AA") : "View all pages",
    fullscreen: isFa ? fa("%D9%85%D8%B4%D8%A7%D9%87%D8%AF%D9%87%20PDF%20%D8%AA%D9%85%D8%A7%D9%85%E2%80%8C%D8%B5%D9%81%D8%AD%D9%87") : "Open fullscreen PDF",
    download: isFa ? fa("%D8%AF%D8%A7%D9%86%D9%84%D9%88%D8%AF%20PDF") : "Download PDF",
    stage: isFa ? fa("%D8%A7%D8%B3%D8%AA%DB%8C%D8%AC%20%D9%85%D8%AC%D9%84%D9%87") : "Magazine stage",
    all: isFa ? fa("%D9%87%D9%85%D9%87%20%D8%B5%D9%81%D8%AD%D8%A7%D8%AA") : "All pages",
    play: isFa ? fa("%D8%A7%D8%AC%D8%B1%D8%A7%DB%8C%20%D9%BE%D8%B1%D8%B2%D9%86%D8%AA%DB%8C%D8%B4%D9%86") : "Play presentation",
    pause: isFa ? fa("%D8%AA%D9%88%D9%82%D9%81%20%D9%BE%D8%B1%D8%B2%D9%86%D8%AA%DB%8C%D8%B4%D9%86") : "Pause presentation",
    clickHint: isFa ? fa("%D8%A8%D8%B1%D8%A7%DB%8C%20%D9%86%D9%85%D8%A7%DB%8C%D8%B4%20%D8%AA%D9%85%D8%A7%D9%85%E2%80%8C%D8%B5%D9%81%D8%AD%D9%87%20%DA%A9%D9%84%DB%8C%DA%A9%20%DA%A9%D9%86%DB%8C%D8%AF") : "Click page to focus",
    noPages: isFa
      ? fa("%D9%87%D9%86%D9%88%D8%B2%20%D8%AA%D8%B5%D8%A7%D9%88%DB%8C%D8%B1%20%D8%B5%D9%81%D8%AD%D8%A7%D8%AA%20PDF%20%D8%A8%D8%B1%D8%A7%DB%8C%20%D8%A7%DB%8C%D9%86%20%D9%BE%D8%B1%D9%88%DA%98%D9%87%20%D8%AF%D8%B1%20%D8%AF%D8%B3%D8%AA%D8%B1%D8%B3%20%D9%86%DB%8C%D8%B3%D8%AA.")
      : "PDF page images have not been uploaded for this project yet.",
  }

  const goPrev = () => {
    if (!canGoPrev) return
    setActiveIndex((current) => Math.max(current - 1, 0))
  }

  const goNext = () => {
    if (!canGoNext) return
    setActiveIndex((current) => Math.min(current + 1, pageCount - 1))
  }

  const goToPage = (index: number) => {
    setActiveIndex(index)
    setShowAllPages(false)
    setIsPlaying(false)
  }

  const handlePointerDown = (event: React.PointerEvent) => {
    setDragStartX(event.clientX)
  }

  const handlePointerUp = (event: React.PointerEvent) => {
    if (dragStartX === null) return

    const distance = event.clientX - dragStartX

    if (Math.abs(distance) > 52) {
      if (distance > 0) {
        isFa ? goNext() : goPrev()
      } else {
        isFa ? goPrev() : goNext()
      }

      setIsPlaying(false)
    }

    setDragStartX(null)
  }

  useEffect(() => {
    if (activeIndex > pageCount - 1) {
      setActiveIndex(0)
    }
  }, [activeIndex, pageCount])

  useEffect(() => {
    if (pageCount === 0) return

    const preloadIndexes = [
      activeIndex,
      activeIndex + 1,
      activeIndex - 1,
    ].filter((index) => index >= 0 && index < pageCount)

    preloadIndexes.forEach((index) => {
      const url = imageUrl(pages[index])
      if (!url) return

      const img = new Image()
      img.src = url
    })
  }, [activeIndex, pageCount, pages])

  useEffect(() => {
    if (!isPlaying || pageCount <= 1) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= pageCount - 1) return 0
        return current + 1
      })
    }, 3600)

    return () => window.clearInterval(interval)
  }, [isPlaying, pageCount])

  useEffect(() => {
    const rail = document.getElementById("portfolio-thumb-rail")
    const activeThumb = document.getElementById(`portfolio-page-thumb-${activeIndex}`)

    if (!rail || !activeThumb) return

    const railRect = rail.getBoundingClientRect()
    const thumbRect = activeThumb.getBoundingClientRect()

    const delta =
      thumbRect.left -
      railRect.left -
      railRect.width / 2 +
      thumbRect.width / 2

    rail.scrollTo({
      left: rail.scrollLeft + delta,
      behavior: "smooth",
    })
  }, [activeIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowAllPages(false)
        setFocusMode(false)
        setIsPlaying(false)
      }

      if (event.key === " ") {
        event.preventDefault()
        setIsPlaying((current) => !current)
      }

      if (event.key === "ArrowLeft") {
        isFa ? goNext() : goPrev()
      }

      if (event.key === "ArrowRight") {
        isFa ? goPrev() : goNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeIndex, pageCount, isFa])

  if (!pdfUrl && pageCount === 0) return null

  return (
    <motion.section
      variants={cardReveal}
      initial="hidden"
      whileInView="show"
      viewport={{once: true, amount: 0.12}}
      className="mt-24 overflow-x-hidden"
      dir={isFa ? "rtl" : "ltr"}
    >
      <div className="relative max-w-full overflow-hidden rounded-[2.35rem] border border-[#2a2a2a] bg-[#070707] p-4 shadow-[0_60px_160px_rgba(0,0,0,0.78)] md:p-6">
        {activeUrl && (
          <div className="pointer-events-none absolute inset-0 opacity-[0.25]">
            <img
              src={activeUrl}
              alt=""
              loading="eager"
              decoding="async"
              className="h-full w-full scale-110 object-cover blur-3xl"
            />
            <div className="absolute inset-0 bg-[#050505]/76" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_0%,rgba(201,164,106,0.18),transparent_34%),radial-gradient(circle_at_85%_6%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.045),transparent_22%)]" />
        <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a46a]/90 to-transparent" />

        <div className="relative z-10 grid max-w-full gap-6 xl:grid-cols-[0.33fr_0.67fr]">
          <aside className="relative overflow-hidden rounded-[1.9rem] border border-[#2a2a2a] bg-[#161616]/88 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl md:p-8 xl:min-h-[780px]">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_28%),radial-gradient(circle_at_10%_0%,rgba(201,164,106,0.16),transparent_32%)]" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className={`flex items-center gap-3 ${isFa ? "justify-end" : "justify-start"}`}>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#c9a46a]/50 bg-[#c9a46a]/10 text-[#c9a46a] shadow-[0_16px_50px_rgba(201,164,106,0.12)]">
                    <FileText size={21} />
                  </span>

                  <span className="rounded-full border border-[#2a2a2a] bg-[#0d0d0d]/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-[#c9a46a]">
                    PDF Portfolio
                  </span>
                </div>

                <h2 className="mt-10 text-5xl font-semibold leading-[0.9] tracking-[-0.065em] text-[#f2f2f2] md:text-6xl">
                  {label.magazine}
                </h2>

                <p className="mt-7 max-w-xl text-sm leading-8 text-[#a8a8a8] md:text-base">
                  {label.description}
                </p>

                <div className="mt-10 rounded-[1.6rem] border border-[#2a2a2a] bg-[#090909]/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  <div className={`flex items-center justify-between gap-4 ${isFa ? "flex-row-reverse" : ""}`}>
                    <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#727272]">
                      {label.page}
                    </span>

                    <span className="font-brand text-sm font-bold text-[#c9a46a]" dir="ltr">
                      {pageCount > 0 ? `${activeIndex + 1} / ${pageCount}` : "... / ..."}
                    </span>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#1a1a1a]">
                    <motion.div
                      className="h-full rounded-full bg-[#c9a46a]"
                      animate={{
                        width: pageCount > 0 ? `${((activeIndex + 1) / pageCount) * 100}%` : "0%",
                      }}
                      transition={{duration: 0.45, ease: [0.22, 1, 0.36, 1]}}
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={goPrev}
                      disabled={!canGoPrev}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2a2a2a] px-4 py-3 text-sm font-bold text-[#f2f2f2] transition hover:border-[#c9a46a] hover:text-[#c9a46a] disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      {isFa ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                      {label.prev}
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      disabled={!canGoNext}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2a2a2a] px-4 py-3 text-sm font-bold text-[#f2f2f2] transition hover:border-[#c9a46a] hover:text-[#c9a46a] disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      {label.next}
                      {isFa ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPlaying((current) => !current)}
                    disabled={pageCount <= 1}
                    className={`mt-3 inline-flex w-full items-center justify-center gap-3 rounded-full border px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] transition disabled:cursor-not-allowed disabled:opacity-35 ${
                      isPlaying
                        ? "border-[#c9a46a] bg-[#c9a46a] text-[#090909]"
                        : "border-[#2a2a2a] text-[#f2f2f2] hover:border-[#c9a46a] hover:text-[#c9a46a]"
                    }`}
                  >
                    {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                    {isPlaying ? label.pause : label.play}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAllPages(true)}
                    disabled={pageCount === 0}
                    className="mt-3 inline-flex w-full items-center justify-center gap-3 rounded-full border border-[#2a2a2a] px-4 py-3 text-xs font-bold uppercase tracking-[0.24em] text-[#a8a8a8] transition hover:border-[#c9a46a] hover:text-[#c9a46a] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <Grid3X3 size={15} />
                    {label.allPages}
                  </button>
                </div>
              </div>

              <div className="mt-10 grid gap-3">
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center justify-center gap-3 rounded-full border border-[#c9a46a] bg-[#c9a46a] px-6 py-4 text-sm font-bold text-[#090909] transition hover:scale-[1.01]"
                  >
                    <Maximize2 size={17} />
                    {label.fullscreen}
                    <ArrowUpRight size={17} className="transition group-hover:rotate-45" />
                  </a>
                )}

                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    download
                    className="inline-flex items-center justify-center gap-3 rounded-full border border-[#2a2a2a] px-6 py-4 text-sm font-bold text-[#f2f2f2] transition hover:border-[#c9a46a] hover:text-[#c9a46a]"
                  >
                    <Download size={17} />
                    {label.download}
                  </a>
                )}
              </div>
            </div>
          </aside>

          <div className="relative min-w-0 overflow-hidden rounded-[1.95rem] border border-[#2a2a2a] bg-[#030303] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:p-6" dir="ltr">
            <div className="mb-5 flex items-center justify-between rounded-2xl border border-[#2a2a2a] bg-[#111111]/82 px-4 py-3 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#c9a46a]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#545454]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#2a2a2a]" />
              </div>

              <div className="flex items-center gap-4">
                {isPlaying && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a46a]/35 bg-[#c9a46a]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a46a]">
                    <Timer size={12} />
                    Live
                  </span>
                )}

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#d8d8d8]">
                  <Sparkles size={14} className="text-[#c9a46a]" />
                  {label.stage}
                </div>
              </div>
            </div>

            <div className="relative max-w-full overflow-hidden rounded-[1.65rem] border border-[#2a2a2a] bg-[#080808] p-4 md:p-7">
              {activeUrl ? (
                <>
                  <div className="pointer-events-none absolute inset-0 opacity-[0.28]">
                    <img
                      src={activeUrl}
                      alt=""
                      loading="eager"
                      decoding="async"
                      className="h-full w-full scale-110 object-cover blur-3xl"
                    />
                    <div className="absolute inset-0 bg-[#080808]/78" />
                  </div>

                  <button
                    type="button"
                    onClick={isFa ? goNext : goPrev}
                    disabled={isFa ? !canGoNext : !canGoPrev}
                    className="absolute left-5 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-[#2a2a2a] bg-[#080808]/80 text-[#f2f2f2] shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl transition hover:border-[#c9a46a] hover:text-[#c9a46a] disabled:opacity-25"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={isFa ? goPrev : goNext}
                    disabled={isFa ? !canGoPrev : !canGoNext}
                    className="absolute right-5 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-[#2a2a2a] bg-[#080808]/80 text-[#f2f2f2] shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl transition hover:border-[#c9a46a] hover:text-[#c9a46a] disabled:opacity-25"
                  >
                    <ArrowRight size={20} />
                  </button>

                  <div className="relative z-10 flex min-h-[610px] w-full max-w-full items-center justify-center overflow-hidden md:min-h-[660px]">
                    <div className="pointer-events-none absolute left-6 top-6 z-20 hidden rounded-full border border-[#2a2a2a] bg-[#080808]/72 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a8a8a8] backdrop-blur-xl md:flex">
                      {label.clickHint}
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeUrl}
                        initial={{opacity: 0, y: 24, scale: 0.965, filter: "blur(10px)"}}
                        animate={{opacity: 1, y: 0, scale: 1, filter: "blur(0px)"}}
                        exit={{opacity: 0, y: -18, scale: 0.985, filter: "blur(8px)"}}
                        transition={{duration: 0.42, ease: [0.22, 1, 0.36, 1]}}
                        className="relative flex h-full w-full max-w-full items-center justify-center"
                      >
                        <div className="pointer-events-none absolute -inset-5 rounded-[1.8rem] bg-[#c9a46a]/10 blur-3xl" />

                        <div className="group relative flex w-full max-w-full touch-pan-y select-none items-center justify-center overflow-hidden"
                          onPointerDown={handlePointerDown}
                          onPointerUp={handlePointerUp}
                          onPointerCancel={() => setDragStartX(null)}>
                          <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-[#2a2a2a] bg-[#080808]/82 px-4 py-2 font-brand text-xs font-bold text-[#c9a46a] backdrop-blur-xl" dir="ltr">
                            {activeIndex + 1} / {pageCount}
                          </div>

                          <img
                            src={activeUrl}
                            loading="eager"
                            decoding="async"
                            onClick={() => {
                              setFocusMode(true)
                              setIsPlaying(false)
                            }}
                            alt={
                              isFa
                                ? activePage?.altFa || `${title} page ${activeIndex + 1}`
                                : activePage?.altEn || `${title} page ${activeIndex + 1}`
                            }
                            className="relative max-h-[640px] max-w-full cursor-zoom-in rounded-[1.25rem] object-contain shadow-[0_35px_100px_rgba(0,0,0,0.62)] transition duration-500 group-hover:scale-[1.012]"
                          />

                          <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#080808]/82 px-4 py-2 text-xs font-bold text-[#d8d8d8] opacity-0 backdrop-blur-xl transition duration-300 group-hover:opacity-100">
                            <MousePointer2 size={14} className="text-[#c9a46a]" />
                            {label.clickHint}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="relative z-10 grid min-h-[520px] place-items-center text-center text-sm leading-8 text-[#cfcfcf]">
                  {label.noPages}
                </div>
              )}
            </div>

            {pageCount > 0 && (
              <div className="mt-5 rounded-[1.4rem] border border-[#2a2a2a] bg-[#080808]/90 p-3">
                <div id="portfolio-thumb-rail" className="flex max-w-full gap-3 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" dir="ltr">
                  {pages.map((page, pageIndex) => {
                    const url = imageUrl(page)
                    const isActive = pageIndex === activeIndex

                    return (
                      <button
                        id={`portfolio-page-thumb-${pageIndex}`}
                        key={`${url}-${pageIndex}`}
                        type="button"
                        onClick={() => {
                          setActiveIndex(pageIndex)
                          setIsPlaying(false)
                        }}
                        className={`relative h-24 min-w-[150px] overflow-hidden rounded-2xl border bg-[#111111] transition ${
                          isActive
                            ? "border-[#c9a46a] shadow-[0_0_0_1px_rgba(201,164,106,0.35),0_18px_50px_rgba(201,164,106,0.12)]"
                            : "border-[#2a2a2a] opacity-62 hover:border-[#c9a46a]/60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={url}
                          alt=""
                          loading={Math.abs(pageIndex - activeIndex) <= 2 ? "eager" : "lazy"}
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/85 via-transparent to-transparent" />
                        <span className="absolute bottom-2 left-3 right-3 text-center font-brand text-xs font-bold text-[#c9a46a]" dir="ltr">
                          {String(pageIndex + 1).padStart(2, "0")}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAllPages && (
          <motion.div
            className="fixed inset-0 z-[80] overflow-y-auto bg-[#050505]/88 p-4 backdrop-blur-2xl md:p-8"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            dir={isFa ? "rtl" : "ltr"}
          >
            <div className="mx-auto max-w-7xl">
              <div className="sticky top-4 z-20 mb-6 flex items-center justify-between rounded-3xl border border-[#2a2a2a] bg-[#0b0b0b]/92 p-4 backdrop-blur-xl">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#c9a46a]">
                    {label.all}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-[#f2f2f2]">
                    {title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllPages(false)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#2a2a2a] text-[#f2f2f2] transition hover:border-[#c9a46a] hover:text-[#c9a46a]"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {pages.map((page, pageIndex) => {
                  const url = imageUrl(page)

                  return (
                    <button
                      key={`${url}-grid-${pageIndex}`}
                      type="button"
                      onClick={() => goToPage(pageIndex)}
                      className="group overflow-hidden rounded-[1.5rem] border border-[#2a2a2a] bg-[#111111] p-3 text-left transition hover:border-[#c9a46a]"
                    >
                      <div className="overflow-hidden rounded-[1.1rem] bg-[#050505]">
                        <img
                          src={url}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.02]"
                        />
                      </div>

                      <div className="mt-3 flex items-center justify-between px-1">
                        <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#727272]">
                          {label.page}
                        </span>
                        <span className="font-brand text-sm font-bold text-[#c9a46a]" dir="ltr">
                          {String(pageIndex + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {focusMode && activeUrl && (
          <motion.div
            className="fixed inset-0 z-[90] bg-[#030303]/94 p-4 backdrop-blur-2xl md:p-8"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            dir="ltr"
          >
            <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[2rem] border border-[#2a2a2a] bg-[#050505]">
              <div className="pointer-events-none absolute inset-0 opacity-[0.3]">
                <img src={activeUrl} alt="" loading="eager" decoding="async" className="h-full w-full scale-110 object-cover blur-3xl" />
                <div className="absolute inset-0 bg-[#030303]/76" />
              </div>

              <button
                type="button"
                onClick={() => setFocusMode(false)}
                className="absolute right-6 top-6 z-30 grid h-12 w-12 place-items-center rounded-full border border-[#2a2a2a] bg-[#080808]/85 text-[#f2f2f2] backdrop-blur-xl transition hover:border-[#c9a46a] hover:text-[#c9a46a]"
              >
                <X size={20} />
              </button>

              <button
                type="button"
                onClick={isFa ? goNext : goPrev}
                disabled={isFa ? !canGoNext : !canGoPrev}
                className="absolute left-6 top-1/2 z-30 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-[#2a2a2a] bg-[#080808]/85 text-[#f2f2f2] backdrop-blur-xl transition hover:border-[#c9a46a] hover:text-[#c9a46a] disabled:opacity-25"
              >
                <ArrowLeft size={22} />
              </button>

              <button
                type="button"
                onClick={isFa ? goPrev : goNext}
                disabled={isFa ? !canGoPrev : !canGoNext}
                className="absolute right-6 top-1/2 z-30 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-[#2a2a2a] bg-[#080808]/85 text-[#f2f2f2] backdrop-blur-xl transition hover:border-[#c9a46a] hover:text-[#c9a46a] disabled:opacity-25"
              >
                <ArrowRight size={22} />
              </button>

              <div className="absolute left-6 top-6 z-30 rounded-full border border-[#2a2a2a] bg-[#080808]/85 px-5 py-3 font-brand text-sm font-bold text-[#c9a46a] backdrop-blur-xl" dir="ltr">
                {activeIndex + 1} / {pageCount}
              </div>

              <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#2a2a2a] bg-[#080808]/85 px-4 py-3 backdrop-blur-xl">
                <button
                  type="button"
                  onClick={isFa ? goNext : goPrev}
                  disabled={isFa ? !canGoNext : !canGoPrev}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#2a2a2a] text-[#f2f2f2] transition hover:border-[#c9a46a] hover:text-[#c9a46a] disabled:opacity-30"
                >
                  <ArrowLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying((current) => !current)}
                  className={`grid h-10 w-10 place-items-center rounded-full border transition ${
                    isPlaying
                      ? "border-[#c9a46a] bg-[#c9a46a] text-[#090909]"
                      : "border-[#2a2a2a] text-[#f2f2f2] hover:border-[#c9a46a] hover:text-[#c9a46a]"
                  }`}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                <button
                  type="button"
                  onClick={isFa ? goPrev : goNext}
                  disabled={isFa ? !canGoPrev : !canGoNext}
                  className="grid h-10 w-10 place-items-center rounded-full border border-[#2a2a2a] text-[#f2f2f2] transition hover:border-[#c9a46a] hover:text-[#c9a46a] disabled:opacity-30"
                >
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="absolute bottom-24 left-1/2 z-30 hidden max-w-[72vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-full border border-[#2a2a2a] bg-[#080808]/72 p-2 backdrop-blur-xl [scrollbar-width:none] md:flex [&::-webkit-scrollbar]:hidden">
                {pages.map((page, pageIndex) => {
                  const url = imageUrl(page)
                  const isActive = pageIndex === activeIndex

                  return (
                    <button
                      key={`focus-thumb-${url}-${pageIndex}`}
                      type="button"
                      onClick={() => {
                        setActiveIndex(pageIndex)
                        setIsPlaying(false)
                      }}
                      className={`relative h-12 w-20 shrink-0 overflow-hidden rounded-xl border transition ${
                        isActive
                          ? "border-[#c9a46a] opacity-100"
                          : "border-[#2a2a2a] opacity-55 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={url}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )
                })}
              </div>

              <motion.img
                key={`focus-${activeUrl}`}
                src={activeUrl}
                alt=""
                initial={{opacity: 0, scale: 0.94, y: 28, filter: "blur(12px)"}}
                animate={{opacity: 1, scale: 1, y: 0, filter: "blur(0px)"}}
                exit={{opacity: 0, scale: 0.96, y: -18, filter: "blur(10px)"}}
                transition={{duration: 0.42, ease: [0.22, 1, 0.36, 1]}}
                className="relative z-20 max-h-[88vh] max-w-[92vw] rounded-[1.35rem] object-contain shadow-[0_50px_160px_rgba(0,0,0,0.85)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}