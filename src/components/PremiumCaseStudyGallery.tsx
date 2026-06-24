"use client"

import {AnimatePresence, motion} from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Grid2x2,
  Images,
  Sparkles,
  X,
} from "lucide-react"
import {useEffect, useMemo, useState} from "react"

type GalleryItem = {
  src: string
  alt: string
}

type Props = {
  title: string
  eyebrow?: string
  description?: string
  items: GalleryItem[]
  isFa?: boolean
}

function dedupeItems(items: GalleryItem[]) {
  const map = new Map<string, GalleryItem>()

  for (const item of items) {
    if (!item?.src) continue
    if (!map.has(item.src)) {
      map.set(item.src, item)
    }
  }

  return Array.from(map.values())
}

export default function PremiumCaseStudyGallery({
  title,
  eyebrow = "Gallery",
  description,
  items,
  isFa = false,
}: Props) {
  const safeItems = useMemo(
    () => dedupeItems(items.filter((item) => item?.src)),
    [items]
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [isGridOpen, setIsGridOpen] = useState(false)

  const activeItem = safeItems[activeIndex] ?? safeItems[0]

  useEffect(() => {
    if (!safeItems.length) return
    if (activeIndex > safeItems.length - 1) {
      setActiveIndex(0)
    }
  }, [activeIndex, safeItems.length])

  useEffect(() => {
    const thumbA = document.getElementById(`gallery-main-thumb-${activeIndex}`)
    const thumbB = document.getElementById(`gallery-side-thumb-${activeIndex}`)

    thumbA?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })

    thumbB?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    })
  }, [activeIndex])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false)
        setIsGridOpen(false)
      }

      if (event.key === "ArrowRight") {
        if (isFa) {
          handlePrev()
        } else {
          handleNext()
        }
      }

      if (event.key === "ArrowLeft") {
        if (isFa) {
          handleNext()
        } else {
          handlePrev()
        }
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  })

  if (!safeItems.length) return null

  const copy = {
    gallery: isFa ? "گالری" : "Gallery",
    selectedPreview: isFa ? "نمایش منتخب" : "Selected Preview",
    contactSheet: isFa ? "نوار تصاویر" : "Contact Sheet",
    visualSystem: isFa ? "سیستم بصری" : "Visual System",
    viewing: isFa ? "در حال مشاهده" : "Viewing",
    previous: isFa ? "قبلی" : "Previous",
    next: isFa ? "بعدی" : "Next",
    openFullscreen: isFa ? "نمایش بزرگ" : "Open Fullscreen",
    viewAllImages: isFa ? "مشاهده همه تصاویر" : "View All Images",
    allImages: isFa ? "همه تصاویر" : "All Images",
    close: isFa ? "بستن" : "Close",
    selected: isFa ? "انتخاب شده" : "Selected",
  }

  function handlePrev() {
    setActiveIndex((prev) => (prev === 0 ? safeItems.length - 1 : prev - 1))
  }

  function handleNext() {
    setActiveIndex((prev) => (prev === safeItems.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <section className="mt-16">
        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[2rem] border border-[#1f1f1f] bg-[#080808] p-4 shadow-[0_25px_100px_rgba(0,0,0,0.5)]">
            <div
              className={`flex items-center justify-between rounded-[1.25rem] border border-[#1b1b1b] bg-[#0b0b0b] px-4 py-4 ${
                isFa ? "flex-row-reverse" : ""
              }`}
            >
              <div className={`flex items-center gap-2 ${isFa ? "flex-row-reverse" : ""}`}>
                <span className="h-2.5 w-2.5 rounded-full bg-[#c9a46a]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#5a5a5a]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#2e2e2e]" />
              </div>

              <div
                className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.26em] text-[#c9a46a] ${
                  isFa ? "flex-row-reverse" : ""
                }`}
              >
                <Expand size={14} />
                {copy.selectedPreview}
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-[1.7rem] border border-[#1a1a1a] bg-[#060606]">
              <div className="relative flex min-h-[540px] items-center justify-center overflow-hidden p-4 md:min-h-[620px] md:p-8 xl:min-h-[720px]">
                <div className="pointer-events-none absolute inset-0">
                  <img
                    src={activeItem.src}
                    alt=""
                    className="h-full w-full scale-110 object-cover opacity-12 blur-3xl"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,164,106,0.06),transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.01),transparent),#060606]" />
                </div>

                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 z-20 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-[#2c2c2c] bg-[#0b0b0b]/86 text-white transition hover:border-[#c9a46a] hover:text-[#c9a46a]"
                  aria-label={copy.previous}
                >
                  <ChevronLeft size={22} />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 z-20 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-[#2c2c2c] bg-[#0b0b0b]/86 text-white transition hover:border-[#c9a46a] hover:text-[#c9a46a]"
                  aria-label={copy.next}
                >
                  <ChevronRight size={22} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(true)}
                  className={`absolute top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-[#2c2c2c] bg-[#0b0b0b]/86 text-white transition hover:border-[#c9a46a] hover:text-[#c9a46a] ${
                    isFa ? "left-4" : "right-4"
                  }`}
                  aria-label={copy.openFullscreen}
                >
                  <Expand size={17} />
                </button>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem.src}
                    initial={{opacity: 0, scale: 0.985, y: 18}}
                    animate={{opacity: 1, scale: 1, y: 0}}
                    exit={{opacity: 0, scale: 0.99, y: -12}}
                    transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
                    className="relative z-10 flex h-full w-full items-center justify-center"
                  >
                    <img
                      src={activeItem.src}
                      alt={activeItem.alt}
                      onClick={() => setIsLightboxOpen(true)}
                      className="max-h-[440px] w-auto max-w-full cursor-zoom-in rounded-[1.3rem] object-contain shadow-[0_30px_100px_rgba(0,0,0,0.65)] md:max-h-[540px] xl:max-h-[620px]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4 rounded-[1.5rem] border border-[#1a1a1a] bg-[#090909] p-4">
              <div
                className={`mb-3 flex items-center justify-between ${
                  isFa ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#7f7f7f] ${
                    isFa ? "flex-row-reverse" : ""
                  }`}
                >
                  <Grid2x2 size={14} />
                  {copy.contactSheet}
                </div>

                <button
                  type="button"
                  onClick={() => setIsGridOpen(true)}
                  className="rounded-full border border-[#2a2a2a] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#c9a46a] transition hover:border-[#c9a46a]"
                >
                  {copy.viewAllImages}
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {safeItems.map((item, index) => {
                  const isActive = index === activeIndex

                  return (
                    <button
                      id={`gallery-main-thumb-${index}`}
                      key={`${item.src}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`group relative h-[98px] min-w-[132px] overflow-hidden rounded-[1rem] border bg-[#0d0d0d] transition ${
                        isActive
                          ? "border-[#c9a46a] shadow-[0_0_0_1px_rgba(201,164,106,0.3)]"
                          : "border-[#1f1f1f] hover:border-[#444]"
                      }`}
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="h-full w-full object-contain p-2 transition duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />

                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/85 to-transparent px-2 py-1.5 text-[11px] font-bold text-white">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        {isActive ? <span className="text-[#c9a46a]">●</span> : null}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[#1f1f1f] bg-[radial-gradient(circle_at_top,rgba(201,164,106,0.09),transparent_32%),#101010] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
            <div
              className={`flex items-center justify-between ${
                isFa ? "flex-row-reverse" : ""
              }`}
            >
              <span className="rounded-full border border-[#2a2a2a] bg-[#0b0b0b] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#c9a46a]">
                {eyebrow}
              </span>

              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#c9a46a]/45 bg-[#c9a46a]/8 text-[#c9a46a]">
                <Images size={18} />
              </div>
            </div>

            <h2 className="mt-6 text-5xl font-semibold leading-[0.9] tracking-[-0.07em] text-white">
              {title}
            </h2>

            <p className="mt-6 text-base leading-9 text-[#a3a3a3]">
              {description}
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-[#232323] bg-[#0b0b0b]/92 p-5">
              <div
                className={`flex items-center justify-between ${
                  isFa ? "flex-row-reverse" : ""
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#7f7f7f]">
                  {copy.viewing}
                </span>

                <span className="text-lg font-bold text-[#c9a46a]">
                  {activeIndex + 1}/{safeItems.length}
                </span>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#171717]">
                <div
                  className="h-full rounded-full bg-[#c9a46a] transition-all duration-300"
                  style={{
                    width: `${((activeIndex + 1) / safeItems.length) * 100}%`,
                  }}
                />
              </div>

              <p className="mt-5 text-sm leading-7 text-[#d6d6d6]">
                {activeItem.alt}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2d2d2d] px-4 py-3 text-sm font-bold text-white transition hover:border-[#c9a46a] hover:text-[#c9a46a]"
                >
                  <ChevronLeft size={16} />
                  {copy.previous}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#2d2d2d] px-4 py-3 text-sm font-bold text-white transition hover:border-[#c9a46a] hover:text-[#c9a46a]"
                >
                  {copy.next}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="mt-5 max-h-[440px] space-y-3 overflow-y-auto pr-1">
              {safeItems.map((item, index) => {
                const isActive = index === activeIndex

                return (
                  <button
                    id={`gallery-side-thumb-${index}`}
                    key={`${item.src}-side-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`group flex w-full items-center gap-3 rounded-[1.2rem] border p-2 text-left transition ${
                      isActive
                        ? "border-[#c9a46a] bg-[#0d0d0d]"
                        : "border-[#202020] bg-[#0b0b0b] hover:border-[#404040]"
                    } ${isFa ? "flex-row-reverse text-right" : ""}`}
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[1rem] border border-[#1f1f1f] bg-[#090909]">
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="h-full w-full object-contain p-1.5"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div
                        className={`flex items-center justify-between gap-2 ${
                          isFa ? "flex-row-reverse" : ""
                        }`}
                      >
                        <span className="text-sm font-bold text-white">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {isActive ? (
                          <span className="rounded-full border border-[#c9a46a]/30 bg-[#c9a46a]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a46a]">
                            {copy.selected}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#9f9f9f]">
                        {item.alt}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </aside>
        </div>
      </section>

      <AnimatePresence>
        {isGridOpen ? (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 z-[110] overflow-y-auto bg-black/88 p-4 backdrop-blur-xl md:p-8"
          >
            <div className="mx-auto max-w-7xl">
              <div
                className={`sticky top-4 z-20 mb-6 flex items-center justify-between rounded-[1.5rem] border border-[#252525] bg-[#0b0b0b]/92 px-5 py-4 ${
                  isFa ? "flex-row-reverse" : ""
                }`}
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#c9a46a]">
                    {copy.allImages}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">
                    {title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGridOpen(false)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#2a2a2a] text-white transition hover:border-[#c9a46a] hover:text-[#c9a46a]"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {safeItems.map((item, index) => (
                  <button
                    key={`${item.src}-grid-${index}`}
                    type="button"
                    onClick={() => {
                      setActiveIndex(index)
                      setIsGridOpen(false)
                      setIsLightboxOpen(true)
                    }}
                    className="group overflow-hidden rounded-[1.5rem] border border-[#232323] bg-[#0d0d0d] p-3 text-left transition hover:border-[#c9a46a]"
                  >
                    <div className="overflow-hidden rounded-[1rem] bg-[#090909]">
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="h-[320px] w-full object-contain transition duration-500 group-hover:scale-[1.025]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#8d8d8d]">
                        {copy.gallery}
                      </span>
                      <span className="text-sm font-bold text-[#c9a46a]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isLightboxOpen ? (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            className="fixed inset-0 z-[120] bg-black/94 backdrop-blur-md"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="absolute inset-0 p-4 md:p-8">
              <div
                className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-[2rem] border border-[#262626] bg-[#090909]"
                onClick={(event) => event.stopPropagation()}
              >
                <div
                  className={`flex items-center justify-between border-b border-[#1d1d1d] px-5 py-4 ${
                    isFa ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#c9a46a] ${
                      isFa ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Sparkles size={14} />
                    {copy.openFullscreen}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(false)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-[#2a2a2a] text-white transition hover:border-[#c9a46a] hover:text-[#c9a46a]"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="relative flex-1 bg-[#050505] p-4 md:p-8">
                  <div className="flex h-full items-center justify-center">
                    <img
                      src={activeItem.src}
                      alt={activeItem.alt}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-[#343434] bg-[#0b0b0b]/88 text-white transition hover:border-[#c9a46a] hover:text-[#c9a46a]"
                  >
                    <ChevronLeft size={22} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-[#343434] bg-[#0b0b0b]/88 text-white transition hover:border-[#c9a46a] hover:text-[#c9a46a]"
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}