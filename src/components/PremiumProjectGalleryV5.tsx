"use client"

import {AnimatePresence, motion} from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Expand,
  Grid2x2,
  Image as ImageIcon,
  LayoutGrid,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Sparkles,
  X,
} from "lucide-react"
import {useEffect, useMemo, useState} from "react"
import type {PointerEvent} from "react"

type GalleryImage = {
  _key?: string
  url: string
  altEn?: string | null
  altFa?: string | null
}

type Props = {
  images: GalleryImage[]
  title: string
  lang: "fa" | "en"
}

type GalleryMode = "showcase" | "wall"

function fa(value: string) {
  return decodeURIComponent(value)
}

function clampIndex(index: number, length: number) {
  if (length === 0) return 0
  if (index < 0) return length - 1
  if (index >= length) return 0
  return index
}

function uniqueImages(images: GalleryImage[]) {
  const map = new Map<string, GalleryImage>()

  for (const image of images) {
    if (!image?.url) continue
    if (!map.has(image.url)) map.set(image.url, image)
  }

  return Array.from(map.values())
}

function optimizedImage(url: string, width: number, quality = 78) {
  if (!url) return ""
  if (!url.includes("cdn.sanity.io/images/")) return url

  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}auto=format&fit=max&w=${width}&q=${quality}`
}

export default function PremiumProjectGalleryV5({images, title, lang}: Props) {
  const isFa = lang === "fa"
  const shouldReduceMotion = false
  

  const copy = {
    eyebrow: isFa ? fa("%DA%AF%D8%A7%D9%84%D8%B1%DB%8C") : "Gallery",
    visualSystem: isFa ? fa("%D8%B3%DB%8C%D8%B3%D8%AA%D9%85%20%D8%A8%D8%B5%D8%B1%DB%8C") : "Visual System",
    description: isFa
      ? fa("%D8%A7%DB%8C%D9%86%20%D8%A8%D8%AE%D8%B4%20%D8%A8%D8%A7%20%D8%AD%D9%81%D8%B8%20%D8%B7%D8%B1%D8%A7%D8%AD%DB%8C%20%D9%84%D9%88%DA%A9%D8%B3%D8%8C%20%D8%A8%D8%B1%D8%A7%DB%8C%20%D9%86%D9%85%D8%A7%DB%8C%D8%B4%20%D8%B1%D9%88%D8%A7%D9%86%D8%8C%20%D8%B3%D8%B1%DB%8C%D8%B9%20%D9%88%20%D8%A8%D9%87%DB%8C%D9%86%D9%87%20%D8%B1%D9%88%DB%8C%20%D9%85%D9%88%D8%A8%D8%A7%DB%8C%D9%84%D8%8C%20%D8%AA%D8%A8%D9%84%D8%AA%20%D9%88%20%D8%AF%D8%B3%DA%A9%D8%AA%D8%A7%D9%BE%20%D8%A2%D9%85%D8%A7%D8%AF%D9%87%20%D8%B4%D8%AF%D9%87%20%D8%A7%D8%B3%D8%AA.")
      : "This section keeps the luxury design intact while optimizing the experience for smooth, fast, and reliable performance across mobile, tablet, and desktop.",
    showcase: isFa ? fa("%D9%86%D9%85%D8%A7%DB%8C%D8%B4%DA%AF%D8%A7%D9%87%DB%8C") : "Showcase",
    wall: isFa ? fa("%D8%AF%DB%8C%D9%88%D8%A7%D8%B1%20%D8%AA%D8%B5%D8%A7%D9%88%DB%8C%D8%B1") : "Image Wall",
    viewing: isFa ? fa("%D8%AF%D8%B1%20%D8%AD%D8%A7%D9%84%20%D9%85%D8%B4%D8%A7%D9%87%D8%AF%D9%87") : "Viewing",
    previous: isFa ? fa("%D9%82%D8%A8%D9%84%DB%8C") : "Previous",
    next: isFa ? fa("%D8%A8%D8%B9%D8%AF%DB%8C") : "Next",
    viewAll: isFa ? fa("%D9%85%D8%B4%D8%A7%D9%87%D8%AF%D9%87%20%D9%87%D9%85%D9%87%20%D8%AA%D8%B5%D8%A7%D9%88%DB%8C%D8%B1") : "View All Images",
    close: isFa ? fa("%D8%A8%D8%B3%D8%AA%D9%86") : "Close",
    empty: isFa ? fa("%D8%A8%D8%B1%D8%A7%DB%8C%20%D8%A7%DB%8C%D9%86%20%D9%BE%D8%B1%D9%88%DA%98%D9%87%20%D9%87%D9%86%D9%88%D8%B2%20%D8%AA%D8%B5%D9%88%DB%8C%D8%B1%DB%8C%20%D8%AF%D8%B1%20%DA%AF%D8%A7%D9%84%D8%B1%DB%8C%20%D9%88%D8%AC%D9%88%D8%AF%20%D9%86%D8%AF%D8%A7%D8%B1%D8%AF.") : "No gallery images found for this project.",
    galleryItemLabel: isFa ? fa("%D8%AA%D8%B5%D9%88%DB%8C%D8%B1%20%D9%BE%D9%88%D8%B1%D8%AA%D9%81%D9%88%D9%84%DB%8C%D9%88%DB%8C") : "Portfolio image",
    frame: isFa ? fa("%D9%81%D8%B1%DB%8C%D9%85") : "Frame",
    autoplay: isFa ? fa("%D9%86%D9%85%D8%A7%DB%8C%D8%B4%20%D8%AE%D9%88%D8%AF%DA%A9%D8%A7%D8%B1") : "Autoplay",
    pause: isFa ? fa("%D8%AA%D9%88%D9%82%D9%81") : "Pause",
    play: isFa ? fa("%D9%BE%D8%AE%D8%B4") : "Play",
    total: isFa ? fa("%D8%AA%D8%B9%D8%AF%D8%A7%D8%AF") : "Total",
    collection: isFa ? fa("%DA%A9%D8%A7%D9%84%DA%A9%D8%B4%D9%86") : "Collection",
  }

  const gallery = useMemo(() => uniqueImages(images), [images])

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mode, setMode] = useState<GalleryMode>("showcase")
  const [showAll, setShowAll] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [dragStartX, setDragStartX] = useState<number | null>(null)

  const current = gallery[selectedIndex]
  const displayTitle = isFa ? copy.visualSystem : title || copy.visualSystem

  const getAlt = (image: GalleryImage | undefined, index: number) => {
    if (!image) return displayTitle
    if (!isFa && image.altEn && image.altEn.trim()) return image.altEn
    return `${copy.galleryItemLabel} ${displayTitle} ${index + 1}`
  }

  const progressNumber = gallery.length ? ((selectedIndex + 1) / gallery.length) * 100 : 0

  const sidePreviewIndexes = useMemo(() => {
    if (!gallery.length) return []

    return Array.from(
      new Set([
        clampIndex(selectedIndex - 2, gallery.length),
        clampIndex(selectedIndex - 1, gallery.length),
        clampIndex(selectedIndex + 1, gallery.length),
        clampIndex(selectedIndex + 2, gallery.length),
      ])
    ).filter((index) => index !== selectedIndex)
  }, [gallery.length, selectedIndex])

  const goTo = (index: number) => {
    setSelectedIndex(clampIndex(index, gallery.length))
    setIsZoomed(false)
  }

  const goPrev = () => {
    setSelectedIndex((prev) => clampIndex(prev - 1, gallery.length))
    setIsZoomed(false)
  }

  const goNext = () => {
    setSelectedIndex((prev) => clampIndex(prev + 1, gallery.length))
    setIsZoomed(false)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    setDragStartX(event.clientX)
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX === null) return

    const distance = event.clientX - dragStartX

    if (Math.abs(distance) > 52) {
      if (distance > 0) {
        isFa ? goNext() : goPrev()
      } else {
        isFa ? goPrev() : goNext()
      }
    }

    setDragStartX(null)
  }

  useEffect(() => {
    setSelectedIndex(0)
    setIsZoomed(false)
    setIsAutoPlaying(false)
  }, [gallery.length, title, lang])

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) setIsAutoPlaying(false)
    }

    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => document.removeEventListener("visibilitychange", onVisibilityChange)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || showAll || lightboxOpen || !gallery.length) return

    const timer = window.setInterval(() => {
      setSelectedIndex((prev) => clampIndex(prev + 1, gallery.length))
    }, 3400)

    return () => window.clearInterval(timer)
  }, [isAutoPlaying, showAll, lightboxOpen, gallery.length])

  useEffect(() => {
    const rail = document.getElementById("gallery-perf-rail")
    const thumb = document.getElementById(`gallery-perf-thumb-${selectedIndex}`)

    if (!rail || !thumb) return

    const railRect = rail.getBoundingClientRect()
    const thumbRect = thumb.getBoundingClientRect()
    const delta = thumbRect.left - railRect.left - railRect.width / 2 + thumbRect.width / 2

    rail.scrollTo({left: rail.scrollLeft + delta, behavior: "smooth"})
  }, [selectedIndex])

  useEffect(() => {
    if (!gallery.length) return

    ;[selectedIndex, selectedIndex + 1, selectedIndex - 1]
      .filter((index) => index >= 0 && index < gallery.length)
      .forEach((index) => {
        const image = new Image()
        image.src = optimizedImage(gallery[index].url, 1600, 86)
      })
  }, [selectedIndex, gallery])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!gallery.length) return

      if (event.key === "Escape") {
        setShowAll(false)
        setLightboxOpen(false)
        setIsZoomed(false)
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault()
        isFa ? goNext() : goPrev()
      }

      if (event.key === "ArrowRight") {
        event.preventDefault()
        isFa ? goPrev() : goNext()
      }

      if (event.key.toLowerCase() === "z") setIsZoomed((value) => !value)

      if (event.key === " ") {
        event.preventDefault()
        setIsAutoPlaying((value) => !value)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  })

  if (!gallery.length || !current) {
    return (
      <section className="mt-20" dir={isFa ? "rtl" : "ltr"}>
        <div className="rounded-[32px] border border-white/10 bg-[#0b0b0b] p-8 text-center text-[#9f9f9f]">
          {copy.empty}
        </div>
      </section>
    )
  }

  const activeLarge = optimizedImage(current.url, 1700, 86)
  const activeLightbox = optimizedImage(current.url, 2400, 90)
  const activeBackdrop = optimizedImage(current.url, 900, 50)

  return (
    <>
      <section className="mt-20 md:mt-28 [content-visibility:auto] [contain-intrinsic-size:1200px]" dir={isFa ? "rtl" : "ltr"}>
        <div className="relative overflow-hidden rounded-[36px] border border-[#2f2619] bg-[#040404] p-3 shadow-[0_50px_150px_rgba(0,0,0,0.72)] md:rounded-[48px] md:p-7">
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            <img src={activeBackdrop} alt="" className="h-full w-full scale-125 object-cover opacity-[0.13] blur-3xl will-change-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(201,164,106,0.17),transparent_32%),radial-gradient(circle_at_86%_18%,rgba(255,255,255,0.055),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_22%,transparent_75%,rgba(201,164,106,0.055)),#040404]/95" />
          </div>

          <div className="relative z-10 mb-5 grid gap-5 rounded-[30px] border border-white/10 bg-black/42 p-4 backdrop-blur-xl md:mb-7 md:rounded-[40px] md:p-8 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div className={isFa ? "text-right" : "text-left"}>
              <div className={`flex flex-wrap items-center gap-3 ${isFa ? "justify-end" : ""}`}>
                <span className="inline-flex rounded-full border border-[#4a3a23] bg-[#0b0b0b] px-5 py-2 text-[12px] font-semibold text-[#d2ab6e]">
                  {copy.eyebrow}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0b0b0b] px-4 py-2 text-[11px] font-semibold text-[#9a9a9a]">
                  <ImageIcon size={13} />
                  {copy.total}: {gallery.length}
                </span>
              </div>

              <h2 className={`mt-6 text-white ${isFa ? "text-4xl leading-[1.15] md:text-5xl" : "text-5xl leading-[0.92] md:text-7xl"} font-semibold tracking-[-0.078em]`}>
                {displayTitle}
              </h2>

              <p className="mt-5 max-w-4xl text-sm leading-8 text-[#a8a8a8] md:text-base md:leading-9">
                {copy.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 rounded-[2rem] border border-white/10 bg-[#050505]/80 p-2">
              <button
                type="button"
                onClick={() => setMode("showcase")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                  mode === "showcase" ? "bg-[#c9a46a] text-[#080808]" : "text-[#d8d8d8] hover:text-[#c9a46a]"
                }`}
              >
                <Sparkles size={15} />
                {copy.showcase}
              </button>

              <button
                type="button"
                onClick={() => setMode("wall")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                  mode === "wall" ? "bg-[#c9a46a] text-[#080808]" : "text-[#d8d8d8] hover:text-[#c9a46a]"
                }`}
              >
                <LayoutGrid size={15} />
                {copy.wall}
              </button>

              <button
                type="button"
                onClick={() => setIsAutoPlaying((value) => !value)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                  isAutoPlaying
                    ? "bg-white text-[#080808]"
                    : "border border-white/10 text-[#d8d8d8] hover:border-[#c9a46a]/50 hover:text-[#c9a46a]"
                }`}
              >
                {isAutoPlaying ? <Pause size={15} /> : <Play size={15} />}
                {isAutoPlaying ? copy.pause : copy.autoplay}
              </button>
            </div>
          </div>

          {mode === "showcase" ? (
            <div className="relative z-10 grid gap-5 2xl:grid-cols-[240px_minmax(0,1fr)_360px]">
              <div className="hidden rounded-[34px] border border-white/10 bg-black/36 p-4 backdrop-blur-xl 2xl:block">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#d2ab6e]">{copy.collection}</span>
                  <span className="text-xs text-[#8e8e8e]">{gallery.length}</span>
                </div>

                <div className="space-y-4">
                  {sidePreviewIndexes.map((index) => {
                    const image = gallery[index]
                    if (!image) return null

                    return (
                      <button
                        key={`${image.url}-side-${index}`}
                        type="button"
                        onClick={() => goTo(index)}
                        className="group w-full overflow-hidden rounded-[24px] border border-white/10 bg-[#070707] p-2 text-left transition hover:border-[#c9a46a]"
                      >
                        <div className="aspect-[4/5] overflow-hidden rounded-[18px] bg-black">
                          <img
                            src={optimizedImage(image.url, 360, 68)}
                            alt={getAlt(image, index)}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]"
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between px-1">
                          <span className="text-xs text-[#8e8e8e]">{copy.frame}</span>
                          <span className="text-sm font-bold text-[#d2ab6e]">
                            {(index + 1).toString().padStart(2, "0")}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-[#060606]/92 p-3 shadow-[0_38px_120px_rgba(0,0,0,0.6)] md:rounded-[40px] md:p-5">
                <div className="overflow-hidden rounded-[26px] border border-white/10 bg-[#030303] md:rounded-[34px]">
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 md:px-5 md:py-5">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#c9a46a]" />
                      <span className="h-3 w-3 rounded-full bg-white/25" />
                      <span className="h-3 w-3 rounded-full bg-white/15" />
                    </div>

                    <div className={`flex items-center gap-2 text-[11px] font-semibold ${isFa ? "" : "tracking-[0.28em]"} text-[#d2ab6e]`}>
                      <Sparkles size={13} />
                      <span>{copy.viewing}</span>
                    </div>
                  </div>

                  <div
                    className="relative overflow-hidden"
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={() => setDragStartX(null)}
                  >
                    <div className="pointer-events-none absolute inset-0 hidden md:block">
                      <img src={activeBackdrop} alt="" className="h-full w-full scale-110 object-cover opacity-[0.18] blur-3xl will-change-transform" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,164,106,0.11),transparent_42%),#030303]/90" />
                    </div>

                    <div className="relative flex min-h-[430px] select-none items-center justify-center overflow-hidden p-4 md:min-h-[760px] md:p-10">
                      <button
                        type="button"
                        onClick={goPrev}
                        className="absolute left-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-black/62 text-white/90 backdrop-blur transition hover:border-[#c9a46a]/50 hover:text-[#c9a46a] md:left-4 md:h-14 md:w-14"
                      >
                        <ArrowLeft size={22} />
                      </button>

                      <button
                        type="button"
                        onClick={goNext}
                        className="absolute right-3 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-black/62 text-white/90 backdrop-blur transition hover:border-[#c9a46a]/50 hover:text-[#c9a46a] md:right-4 md:h-14 md:w-14"
                      >
                        <ArrowRight size={22} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setLightboxOpen(true)}
                        className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/50 text-white/80 backdrop-blur transition hover:border-[#c9a46a]/50 hover:text-[#c9a46a] md:right-4 md:top-4 md:h-12 md:w-12"
                      >
                        <Expand size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowAll(true)}
                        className="absolute left-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/50 text-white/80 backdrop-blur transition hover:border-[#c9a46a]/50 hover:text-[#c9a46a] md:left-4 md:top-4 md:h-12 md:w-12"
                      >
                        <Grid2x2 size={18} />
                      </button>

                      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
                        <div
                          className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-black/60 text-center backdrop-blur md:h-20 md:w-20"
                          style={{
                            background: `conic-gradient(#c9a46a ${progressNumber * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                          }}
                        >
                          <div className="grid h-[54px] w-[54px] place-items-center rounded-full bg-[#050505] text-[10px] font-bold text-[#d2ab6e] md:h-[68px] md:w-[68px] md:text-xs">
                            {selectedIndex + 1}/{gallery.length}
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10 flex h-full w-full items-center justify-center">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={current.url}
                            src={activeLarge}
                            srcSet={`${optimizedImage(current.url, 820, 78)} 820w, ${optimizedImage(current.url, 1280, 84)} 1280w, ${optimizedImage(current.url, 1700, 86)} 1700w`}
                            sizes="(max-width: 768px) 92vw, (max-width: 1440px) 72vw, 1180px"
                            alt={getAlt(current, selectedIndex)}
                            initial={{opacity: 0, scale: 0.945, y: 38, filter: "blur(18px)"}}
                            animate={{opacity: 1, scale: 1, y: 0, filter: "blur(0px)"}}
                            exit={{opacity: 0, scale: 0.985, y: -22, filter: "blur(14px)"}}
                            transition={{duration: 0.56, ease: [0.22, 1, 0.36, 1]}}
                            onClick={() => setLightboxOpen(true)}
                            className="max-h-[400px] w-auto max-w-full cursor-zoom-in rounded-[26px] object-contain shadow-[0_52px_150px_rgba(0,0,0,0.82)] will-change-transform md:max-h-[725px] md:rounded-[36px]"
                            draggable={false}
                            loading="eager"
                            decoding="async"
                          />
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-[28px] border border-white/10 bg-[#060606] p-3 md:mt-5 md:rounded-[32px] md:p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-[#9a9a9a]">
                      <Grid2x2 size={13} />
                      <span>{copy.collection}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAll(true)}
                      className="inline-flex items-center rounded-full border border-[#3a2e1e] bg-[#0d0d0d] px-4 py-2 text-xs text-[#d2ab6e] transition hover:border-[#c9a46a] hover:bg-[#111111] md:px-5 md:text-sm"
                    >
                      {copy.viewAll}
                    </button>
                  </div>

                  <div id="gallery-perf-rail" className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex min-w-max gap-3">
                      {gallery.map((image, index) => {
                        const active = index === selectedIndex

                        return (
                          <button
                            id={`gallery-perf-thumb-${index}`}
                            key={image._key ?? image.url ?? index}
                            type="button"
                            onClick={() => goTo(index)}
                            className={`group relative flex h-[104px] w-[136px] shrink-0 overflow-hidden rounded-[22px] border bg-[#080808] transition md:h-[134px] md:w-[176px] md:rounded-[28px] ${
                              active
                                ? "border-[#c9a46a] shadow-[0_0_0_1px_rgba(201,164,106,0.25),0_20px_50px_rgba(201,164,106,0.14)]"
                                : "border-white/10 opacity-72 hover:border-white/20 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={optimizedImage(image.url, 380, 68)}
                              alt={getAlt(image, index)}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                              draggable={false}
                              loading={Math.abs(index - selectedIndex) <= 3 ? "eager" : "lazy"}
                              decoding="async"
                            />

                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent px-3 pb-3 pt-6">
                              <span className="text-sm font-semibold text-white/95">
                                {(index + 1).toString().padStart(2, "0")}
                              </span>
                              {active && <span className="h-2.5 w-2.5 rounded-full bg-[#d2ab6e]" />}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <aside className="rounded-[32px] border border-white/10 bg-[#080808]/90 p-4 shadow-[0_44px_120px_rgba(0,0,0,0.6)] md:rounded-[40px] md:p-5 xl:sticky xl:top-28 xl:h-[fit-content]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex rounded-full border border-[#3a2e1e] bg-[#0b0b0b] px-5 py-2 text-[12px] font-semibold text-[#d2ab6e]">
                    {copy.frame}
                  </span>

                  <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#5a4728] text-[#d2ab6e]">
                    <ImageIcon size={20} />
                  </div>
                </div>

                <div className={isFa ? "text-right" : "text-left"}>
                  <h3 className="mt-8 text-6xl font-semibold leading-[0.85] tracking-[-0.08em] text-white md:text-7xl">
                    {(selectedIndex + 1).toString().padStart(2, "0")}
                  </h3>

                  <p className="mt-6 text-sm leading-8 text-[#d6d6d6]">
                    {getAlt(current, selectedIndex)}
                  </p>
                </div>

                <div className="mt-8 rounded-[28px] border border-white/10 bg-black/36 p-5 md:rounded-[32px]">
                  <div className="flex items-center justify-between text-sm text-[#d8d8d8]">
                    <span className="text-[#8e8e8e]">{copy.viewing}</span>
                    <span className="font-semibold text-[#d2ab6e]">
                      {selectedIndex + 1}/{gallery.length}
                    </span>
                  </div>

                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-[#d2ab6e]" style={{width: `${progressNumber}%`}} />
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={goPrev}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-[#f1f1f1] transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e] md:text-base"
                    >
                      <ArrowLeft size={18} />
                      {copy.previous}
                    </button>

                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm text-[#f1f1f1] transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e] md:text-base"
                    >
                      {copy.next}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="relative z-10 rounded-[32px] border border-white/10 bg-[#060606]/90 p-3 md:rounded-[40px] md:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#d2ab6e]">
                  <LayoutGrid size={18} />
                  <span className="font-semibold">{copy.wall}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAll(true)}
                  className="rounded-full border border-[#3a2e1e] px-5 py-2 text-sm text-[#d2ab6e] transition hover:border-[#c9a46a]"
                >
                  {copy.viewAll}
                </button>
              </div>

              <div className="columns-1 gap-4 space-y-4 md:columns-2 xl:columns-3">
                {gallery.map((image, index) => (
                  <button
                    key={image._key ?? image.url ?? index}
                    type="button"
                    onClick={() => {
                      goTo(index)
                      setLightboxOpen(true)
                    }}
                    className="group mb-4 w-full break-inside-avoid overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0b] p-3 text-left transition hover:border-[#c9a46a] md:rounded-[34px]"
                  >
                    <img
                      src={optimizedImage(image.url, 980, 80)}
                      alt={getAlt(image, index)}
                      className="w-full rounded-[22px] object-contain transition duration-500 group-hover:scale-[1.018] md:rounded-[26px]"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />

                    <div className="mt-3 flex items-center justify-between px-1">
                      <span className="text-xs font-semibold text-[#8d8d8d]">{copy.frame}</span>
                      <span className="text-sm font-bold text-[#c9a46a]">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {showAll && (
          <motion.div className="fixed inset-0 z-[120] bg-black/86 backdrop-blur-md" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-6 md:px-6">
              <div className="mb-5 flex items-center justify-between rounded-[24px] border border-white/10 bg-[#0b0b0b] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-[#5a4728] px-4 py-2 text-sm text-[#d2ab6e]">{copy.viewAll}</span>
                  <span className="text-sm text-[#9d9d9d]">{gallery.length} images</span>
                </div>

                <button type="button" onClick={() => setShowAll(false)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-white/90 transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e]">
                  <X size={18} />
                  {copy.close}
                </button>
              </div>

              <div className="grid flex-1 grid-cols-2 gap-4 overflow-y-auto md:grid-cols-3 xl:grid-cols-4">
                {gallery.map((image, index) => (
                  <button
                    key={image._key ?? image.url ?? index}
                    type="button"
                    onClick={() => {
                      goTo(index)
                      setShowAll(false)
                      setLightboxOpen(true)
                    }}
                    className={`group overflow-hidden rounded-[28px] border bg-[#0b0b0b] text-left transition ${
                      index === selectedIndex ? "border-[#c9a46a]" : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-black">
                      <img src={optimizedImage(image.url, 720, 76)} alt={getAlt(image, index)} className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-[1.03]" draggable={false} loading="lazy" decoding="async" />
                    </div>

                    <div className="flex items-center justify-between px-4 py-4">
                      <span className="text-base font-semibold text-white">{(index + 1).toString().padStart(2, "0")}</span>
                      <span className="text-xs text-[#a4a4a4]">{copy.frame}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-[130] bg-black/94 p-4 backdrop-blur-lg md:p-8"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={() => {
              setLightboxOpen(false)
              setIsZoomed(false)
            }}
          >
            <div className="relative mx-auto flex h-full max-w-7xl items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[#050505] md:rounded-[36px]" onClick={(event) => event.stopPropagation()}>
              <div className="pointer-events-none absolute inset-0 hidden md:block">
                <img src={activeBackdrop} alt="" className="h-full w-full scale-110 object-cover opacity-[0.14] blur-3xl will-change-transform" />
                <div className="absolute inset-0 bg-[#050505]/86" />
              </div>

              <button type="button" onClick={() => { setLightboxOpen(false); setIsZoomed(false) }} className="absolute right-4 top-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/60 text-white transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e] md:right-5 md:top-5 md:h-12 md:w-12">
                <X size={20} />
              </button>

              <button type="button" onClick={() => setIsZoomed((value) => !value)} className="absolute left-4 top-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/60 text-white transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e] md:left-5 md:top-5 md:h-12 md:w-12">
                {isZoomed ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>

              <button type="button" onClick={goPrev} className="absolute left-4 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/60 text-white transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e] md:left-5 md:h-14 md:w-14">
                <ArrowLeft size={22} />
              </button>

              <button type="button" onClick={goNext} className="absolute right-4 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/60 text-white transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e] md:right-5 md:h-14 md:w-14">
                <ArrowRight size={22} />
              </button>

              <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-5 py-3 text-sm font-semibold text-[#d2ab6e] backdrop-blur md:bottom-5">
                {selectedIndex + 1} / {gallery.length}
              </div>

              <motion.img
                key={`lightbox-${current.url}`}
                src={activeLightbox}
                srcSet={`${optimizedImage(current.url, 1200, 84)} 1200w, ${optimizedImage(current.url, 1800, 88)} 1800w, ${optimizedImage(current.url, 2400, 90)} 2400w`}
                sizes="100vw"
                alt={getAlt(current, selectedIndex)}
                initial={{opacity: 0, scale: 0.94, y: 22, filter: "blur(18px)"}}
                animate={{opacity: 1, scale: isZoomed ? 1.35 : 1, y: 0, filter: "blur(0px)"}}
                exit={{opacity: 0, scale: 0.96, y: -12, filter: "blur(8px)"}}
                transition={{duration: 0.38, ease: [0.22, 1, 0.36, 1]}}
                className={`relative z-20 max-h-[88vh] max-w-[88vw] object-contain shadow-[0_40px_140px_rgba(0,0,0,0.75)] ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                onClick={() => setIsZoomed((value) => !value)}
                draggable={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}