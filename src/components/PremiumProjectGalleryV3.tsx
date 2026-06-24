"use client"

import {AnimatePresence, motion} from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Expand,
  Grid2x2,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
  Sparkles,
  X,
} from "lucide-react"
import {useEffect, useMemo, useState} from "react"

type GalleryImage = {
  _key?: string
  url: string
  altEn?: string | null
  altFa?: string | null
}

type PremiumProjectGalleryV3Props = {
  images: GalleryImage[]
  title: string
  lang: "fa" | "en"
}

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
    if (!map.has(image.url)) {
      map.set(image.url, image)
    }
  }

  return Array.from(map.values())
}

export default function PremiumProjectGalleryV3({
  images,
  title,
  lang,
}: PremiumProjectGalleryV3Props) {
  const isFa = lang === "fa"

  const copy = {
    eyebrow: isFa ? fa("%DA%AF%D8%A7%D9%84%D8%B1%DB%8C") : "Gallery",
    title: isFa ? fa("%D8%B3%DB%8C%D8%B3%D8%AA%D9%85%20%D8%A8%D8%B5%D8%B1%DB%8C") : "Visual System",
    description: isFa
      ? fa("%D9%85%D9%86%D8%AA%D8%AE%D8%A8%DB%8C%20%D8%A7%D8%B2%20%D8%AE%D8%B1%D9%88%D8%AC%DB%8C%E2%80%8C%D9%87%D8%A7%DB%8C%20%D8%A8%D8%B5%D8%B1%DB%8C%20%D9%BE%D8%B1%D9%88%DA%98%D9%87%20%D8%AF%D8%B1%20%DB%8C%DA%A9%20%DA%AF%D8%A7%D9%84%D8%B1%DB%8C%20%D8%B3%DB%8C%D9%86%D9%85%D8%A7%DB%8C%DB%8C%D8%8C%20%D9%85%D8%B1%D8%AA%D8%A8%20%D9%88%20%D9%BE%D8%B1%DB%8C%D9%85%DB%8C%D9%88%D9%85%20%D9%86%D9%85%D8%A7%DB%8C%D8%B4%20%D8%AF%D8%A7%D8%AF%D9%87%20%D9%85%DB%8C%E2%80%8C%D8%B4%D9%88%D8%AF.")
      : "A curated selection of the project’s strongest visual outputs is presented in an immersive, editorial, premium gallery experience.",
    selectedPreview: isFa ? fa("%D9%86%D9%85%D8%A7%DB%8C%D8%B4%20%D9%85%D9%86%D8%AA%D8%AE%D8%A8") : "Selected Preview",
    viewing: isFa ? fa("%D8%AF%D8%B1%20%D8%AD%D8%A7%D9%84%20%D9%85%D8%B4%D8%A7%D9%87%D8%AF%D9%87") : "Viewing",
    previous: isFa ? fa("%D9%82%D8%A8%D9%84%DB%8C") : "Previous",
    next: isFa ? fa("%D8%A8%D8%B9%D8%AF%DB%8C") : "Next",
    contactSheet: isFa ? fa("%D9%86%D9%88%D8%A7%D8%B1%20%D8%AA%D8%B5%D8%A7%D9%88%DB%8C%D8%B1") : "Contact Sheet",
    viewAll: isFa ? fa("%D9%85%D8%B4%D8%A7%D9%87%D8%AF%D9%87%20%D9%87%D9%85%D9%87%20%D8%AA%D8%B5%D8%A7%D9%88%DB%8C%D8%B1") : "View All Images",
    openLarge: isFa ? fa("%D9%86%D9%85%D8%A7%DB%8C%D8%B4%20%D8%A8%D8%B2%D8%B1%DA%AF") : "Open Fullscreen",
    close: isFa ? fa("%D8%A8%D8%B3%D8%AA%D9%86") : "Close",
    empty: isFa ? fa("%D8%A8%D8%B1%D8%A7%DB%8C%20%D8%A7%DB%8C%D9%86%20%D9%BE%D8%B1%D9%88%DA%98%D9%87%20%D9%87%D9%86%D9%88%D8%B2%20%D8%AA%D8%B5%D9%88%DB%8C%D8%B1%DB%8C%20%D8%AF%D8%B1%20%DA%AF%D8%A7%D9%84%D8%B1%DB%8C%20%D9%88%D8%AC%D9%88%D8%AF%20%D9%86%D8%AF%D8%A7%D8%B1%D8%AF.") : "No gallery images found for this project.",
    galleryItemLabel: isFa ? fa("%D8%AA%D8%B5%D9%88%DB%8C%D8%B1%20%D9%BE%D9%88%D8%B1%D8%AA%D9%81%D9%88%D9%84%DB%8C%D9%88%DB%8C") : "Portfolio image",
    selected: isFa ? fa("%D8%A7%D9%86%D8%AA%D8%AE%D8%A7%D8%A8%E2%80%8C%D8%B4%D8%AF%D9%87") : "Selected",
    immersive: isFa ? fa("%D8%AD%D8%A7%D9%84%D8%AA%20%D8%BA%D9%88%D8%B1%D9%87%E2%80%8C%D9%88%D8%B1") : "Immersive View",
    zoom: isFa ? fa("%D8%B2%D9%88%D9%85") : "Zoom",
    total: isFa ? fa("%D8%AA%D8%B9%D8%AF%D8%A7%D8%AF%20%D8%AA%D8%B5%D8%A7%D9%88%DB%8C%D8%B1") : "Total Images",
  }

  const gallery = useMemo(() => uniqueImages(images), [images])

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [dragStartX, setDragStartX] = useState<number | null>(null)

  const current = gallery[selectedIndex]

  const displayTitle = isFa ? copy.title : title || copy.title

  const getAlt = (image: GalleryImage, index: number) => {
    if (!isFa && image.altEn && image.altEn.trim()) return image.altEn
    return `${copy.galleryItemLabel} ${displayTitle} ${index + 1}`
  }

  const progress = gallery.length
    ? `${(((selectedIndex + 1) / gallery.length) * 100).toFixed(2)}%`
    : "0%"

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
    }

    setDragStartX(null)
  }

  useEffect(() => {
    setSelectedIndex(0)
    setIsZoomed(false)
  }, [gallery.length, title, lang])

  useEffect(() => {
    const rail = document.getElementById("gallery-v4-rail")
    const thumb = document.getElementById(`gallery-v4-thumb-${selectedIndex}`)

    if (!rail || !thumb) return

    const railRect = rail.getBoundingClientRect()
    const thumbRect = thumb.getBoundingClientRect()

    const delta =
      thumbRect.left -
      railRect.left -
      railRect.width / 2 +
      thumbRect.width / 2

    rail.scrollTo({
      left: rail.scrollLeft + delta,
      behavior: "smooth",
    })
  }, [selectedIndex])

  useEffect(() => {
    if (!gallery.length) return

    ;[selectedIndex, selectedIndex + 1, selectedIndex - 1]
      .filter((index) => index >= 0 && index < gallery.length)
      .forEach((index) => {
        const image = new Image()
        image.src = gallery[index].url
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

      if (event.key.toLowerCase() === "z") {
        setIsZoomed((value) => !value)
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

  return (
    <>
      <section
        className="mt-20 grid gap-6 xl:grid-cols-[minmax(0,1.48fr)_370px]"
        dir={isFa ? "rtl" : "ltr"}
      >
        <div className="rounded-[36px] border border-[#2a2115] bg-[radial-gradient(circle_at_top,rgba(201,164,106,0.09),transparent_34%),#060606] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_45px_120px_rgba(0,0,0,0.62)] md:p-5">
          <div className="overflow-hidden rounded-[30px] border border-white/8 bg-[#050505]">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#c9a46a]" />
                <span className="h-3 w-3 rounded-full bg-white/25" />
                <span className="h-3 w-3 rounded-full bg-white/15" />
              </div>

              <div
                className={`flex items-center gap-2 text-[11px] font-semibold ${
                  isFa ? "tracking-normal" : "tracking-[0.28em]"
                } text-[#d2ab6e]`}
              >
                <Sparkles size={13} />
                <span>{copy.selectedPreview}</span>
              </div>
            </div>

            <div className="p-4 md:p-5">
              <div
                className="relative overflow-hidden rounded-[30px] border border-white/8 bg-[#030303] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => setDragStartX(null)}
              >
                <div className="pointer-events-none absolute inset-0">
                  <img
                    src={current.url}
                    alt=""
                    className="h-full w-full scale-110 object-cover opacity-[0.16] blur-3xl"
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,164,106,0.08),transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,0.015),transparent),#030303]/90" />
                </div>

                <div className="relative flex min-h-[460px] select-none items-center justify-center p-6 md:min-h-[690px] md:p-10">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute left-4 top-1/2 z-20 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-black/55 text-white/90 backdrop-blur transition hover:border-[#c9a46a]/50 hover:text-[#c9a46a]"
                    aria-label={copy.previous}
                  >
                    <ArrowLeft size={22} />
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute right-4 top-1/2 z-20 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-white/12 bg-black/55 text-white/90 backdrop-blur transition hover:border-[#c9a46a]/50 hover:text-[#c9a46a]"
                    aria-label={copy.next}
                  >
                    <ArrowRight size={22} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="absolute right-4 top-4 z-20 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/45 text-white/80 backdrop-blur transition hover:border-[#c9a46a]/50 hover:text-[#c9a46a]"
                    aria-label={copy.openLarge}
                  >
                    <Expand size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="absolute left-4 top-4 z-20 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/45 text-white/80 backdrop-blur transition hover:border-[#c9a46a]/50 hover:text-[#c9a46a]"
                    aria-label={copy.viewAll}
                  >
                    <Grid2x2 size={18} />
                  </button>

                  <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs font-semibold text-[#d2ab6e] backdrop-blur">
                    {selectedIndex + 1} / {gallery.length}
                  </div>

                  <div className="flex h-full w-full items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={current.url}
                        src={current.url}
                        alt={getAlt(current, selectedIndex)}
                        initial={{opacity: 0, scale: 0.975, y: 18, filter: "blur(10px)"}}
                        animate={{opacity: 1, scale: 1, y: 0, filter: "blur(0px)"}}
                        exit={{opacity: 0, scale: 0.99, y: -12, filter: "blur(8px)"}}
                        transition={{duration: 0.42, ease: [0.22, 1, 0.36, 1]}}
                        onClick={() => setLightboxOpen(true)}
                        className="max-h-[660px] w-auto max-w-full cursor-zoom-in rounded-[28px] object-contain shadow-[0_38px_110px_rgba(0,0,0,0.68)]"
                        draggable={false}
                        loading="eager"
                        decoding="async"
                      />
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[28px] border border-white/8 bg-[#060606] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-[#9a9a9a]">
                    <Grid2x2 size={13} />
                    <span className={isFa ? "" : "tracking-[0.22em]"}>
                      {copy.contactSheet}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className={`inline-flex items-center rounded-full border border-[#3a2e1e] bg-[#0d0d0d] px-5 py-2 text-sm text-[#d2ab6e] transition hover:border-[#c9a46a] hover:bg-[#111111] ${
                      isFa ? "gap-2" : "gap-2 tracking-[0.16em]"
                    }`}
                  >
                    {copy.viewAll}
                  </button>
                </div>

                <div id="gallery-v4-rail" className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex min-w-max gap-3">
                    {gallery.map((image, index) => {
                      const active = index === selectedIndex

                      return (
                        <button
                          id={`gallery-v4-thumb-${index}`}
                          key={image._key ?? image.url ?? index}
                          type="button"
                          onClick={() => goTo(index)}
                          className={`group relative flex h-[122px] w-[154px] shrink-0 overflow-hidden rounded-[22px] border bg-[#080808] transition ${
                            active
                              ? "border-[#c9a46a] shadow-[0_0_0_1px_rgba(201,164,106,0.25),0_14px_34px_rgba(201,164,106,0.08)]"
                              : "border-white/8 opacity-75 hover:border-white/18 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={image.url}
                            alt={getAlt(image, index)}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                            draggable={false}
                            loading={Math.abs(index - selectedIndex) <= 3 ? "eager" : "lazy"}
                            decoding="async"
                          />

                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/88 to-transparent px-3 pb-3 pt-6">
                            <span className="text-sm font-semibold text-white/95">
                              {(index + 1).toString().padStart(2, "0")}
                            </span>

                            {active && (
                              <span className="h-2.5 w-2.5 rounded-full bg-[#d2ab6e]" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[36px] border border-[#2a2115] bg-[radial-gradient(circle_at_top,rgba(201,164,106,0.12),transparent_30%),#0b0b0b] p-5 shadow-[0_40px_100px_rgba(0,0,0,0.55)] xl:sticky xl:top-28 xl:h-[fit-content]">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex rounded-full border border-[#3a2e1e] bg-[#0b0b0b] px-5 py-2 text-[12px] font-semibold text-[#d2ab6e] ${
                isFa ? "" : "tracking-[0.24em]"
              }`}
            >
              {copy.eyebrow}
            </span>

            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[#5a4728] text-[#d2ab6e]">
              <ImageIcon size={20} />
            </div>
          </div>

          <div className={isFa ? "text-right" : "text-left"}>
            <h2
              className={`mt-8 text-[#f5f5f5] ${
                isFa
                  ? "text-5xl font-semibold leading-[1.12] tracking-[-0.03em]"
                  : "text-6xl font-semibold leading-[0.95] tracking-[-0.05em]"
              }`}
            >
              {displayTitle}
            </h2>

            <p className="mt-8 text-base leading-9 text-[#a8a8a8]">
              {copy.description}
            </p>
          </div>

          <div className="mt-10 rounded-[28px] border border-white/8 bg-[#080808] p-5">
            <div className="flex items-center justify-between text-sm text-[#d8d8d8]">
              <span className="text-[#8e8e8e]">{copy.viewing}</span>
              <span className="font-semibold text-[#d2ab6e]">
                {selectedIndex + 1}/{gallery.length}
              </span>
            </div>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/6">
              <div
                className="h-full rounded-full bg-[#d2ab6e]"
                style={{width: progress}}
              />
            </div>

            <p className="mt-6 text-sm leading-8 text-[#d6d6d6]">
              {getAlt(current, selectedIndex)}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-base text-[#f1f1f1] transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e]"
              >
                <ArrowLeft size={18} />
                {copy.previous}
              </button>

              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-base text-[#f1f1f1] transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e]"
              >
                {copy.next}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="mt-6 max-h-[460px] space-y-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
            {gallery.map((image, index) => {
              const active = index === selectedIndex

              return (
                <button
                  key={image._key ?? image.url ?? index}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`flex w-full items-center gap-4 rounded-[24px] border p-3 text-left transition ${
                    active
                      ? "border-[#c9a46a] bg-[#0f0f0f]"
                      : "border-white/8 bg-[#080808] hover:border-white/16"
                  } ${isFa ? "flex-row-reverse text-right" : ""}`}
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[18px] border border-white/8 bg-black">
                    <img
                      src={image.url}
                      alt={getAlt(image, index)}
                      className="h-full w-full object-cover"
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className={`flex items-center justify-between gap-3 ${isFa ? "flex-row-reverse" : ""}`}>
                      <span className="text-2xl font-semibold text-white">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>

                      {active && (
                        <span
                          className={`rounded-full border border-[#5a4728] bg-[#16110a] px-3 py-1 text-[10px] font-semibold text-[#d2ab6e] ${
                            isFa ? "" : "tracking-[0.18em]"
                          }`}
                        >
                          {copy.selected}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs leading-6 text-[#ababab]">
                      {getAlt(image, index)}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>
      </section>

      <AnimatePresence>
        {showAll && (
          <motion.div
            className="fixed inset-0 z-[120] bg-black/82 backdrop-blur-md"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
          >
            <div className="mx-auto flex h-full max-w-7xl flex-col px-4 py-6 md:px-6">
              <div className="mb-5 flex items-center justify-between rounded-[24px] border border-white/10 bg-[#0b0b0b] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-[#5a4728] px-4 py-2 text-sm text-[#d2ab6e]">
                    {copy.viewAll}
                  </span>
                  <span className="text-sm text-[#9d9d9d]">
                    {gallery.length} images
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAll(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-white/90 transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e]"
                >
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
                    className={`group overflow-hidden rounded-[26px] border bg-[#0b0b0b] text-left transition ${
                      index === selectedIndex
                        ? "border-[#c9a46a]"
                        : "border-white/8 hover:border-white/16"
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-black">
                      <img
                        src={image.url}
                        alt={getAlt(image, index)}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="flex items-center justify-between px-4 py-4">
                      <span className="text-base font-semibold text-white">
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <span className="text-xs text-[#a4a4a4]">
                        {getAlt(image, index)}
                      </span>
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
            className="fixed inset-0 z-[130] bg-black/92 p-4 backdrop-blur-lg md:p-8"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={() => {
              setLightboxOpen(false)
              setIsZoomed(false)
            }}
          >
            <div
              className="relative mx-auto flex h-full max-w-7xl items-center justify-center overflow-hidden rounded-[32px] border border-white/10 bg-[#050505]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="pointer-events-none absolute inset-0">
                <img
                  src={current.url}
                  alt=""
                  className="h-full w-full scale-110 object-cover opacity-[0.12] blur-3xl"
                />
                <div className="absolute inset-0 bg-[#050505]/86" />
              </div>

              <button
                type="button"
                onClick={() => {
                  setLightboxOpen(false)
                  setIsZoomed(false)
                }}
                className="absolute right-5 top-5 z-30 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/60 text-white transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e]"
              >
                <X size={20} />
              </button>

              <button
                type="button"
                onClick={() => setIsZoomed((value) => !value)}
                className="absolute left-5 top-5 z-30 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-black/60 text-white transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e]"
              >
                {isZoomed ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>

              <button
                type="button"
                onClick={goPrev}
                className="absolute left-5 top-1/2 z-30 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/60 text-white transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e]"
              >
                <ArrowLeft size={22} />
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-5 top-1/2 z-30 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/60 text-white transition hover:border-[#c9a46a]/50 hover:text-[#d2ab6e]"
              >
                <ArrowRight size={22} />
              </button>

              <div className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full border border-white/10 bg-black/60 px-5 py-3 text-sm font-semibold text-[#d2ab6e] backdrop-blur">
                {selectedIndex + 1} / {gallery.length}
              </div>

              <motion.img
                key={`lightbox-${current.url}`}
                src={current.url}
                alt={getAlt(current, selectedIndex)}
                initial={{opacity: 0, scale: 0.94, y: 22, filter: "blur(12px)"}}
                animate={{
                  opacity: 1,
                  scale: isZoomed ? 1.35 : 1,
                  y: 0,
                  filter: "blur(0px)",
                }}
                exit={{opacity: 0, scale: 0.96, y: -12, filter: "blur(8px)"}}
                transition={{duration: 0.38, ease: [0.22, 1, 0.36, 1]}}
                className={`relative z-20 max-h-[88vh] max-w-[88vw] object-contain shadow-[0_40px_140px_rgba(0,0,0,0.75)] ${
                  isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
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