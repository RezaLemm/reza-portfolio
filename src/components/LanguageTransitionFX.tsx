"use client"

import {AnimatePresence, motion, useReducedMotion} from "framer-motion"
import {ReactNode, useEffect, useRef, useState} from "react"

type TargetLang = "fa" | "en"

type LanguageEvent = CustomEvent<{
  lang?: TargetLang
  language?: TargetLang
  locale?: TargetLang
}>

declare global {
  interface Window {
    lemmLanguageTransition?: (lang: TargetLang) => void
  }
}

const easePremium: [number, number, number, number] = [0.2, 1, 0.24, 1]
const easeSoft: [number, number, number, number] = [0.25, 1, 0.35, 1]

function normalize(value: string | null | undefined) {
  return String(value || "").toLowerCase().trim()
}

function hasFaSignal(value: string | null | undefined) {
  const text = normalize(value)

  return (
    text === "fa" ||
    text === "fa-ir" ||
    text === "farsi" ||
    text === "persian" ||
    text === "rtl" ||
    text.includes("\u0641\u0627\u0631\u0633\u06cc") ||
    text.includes("\u067e\u0627\u0631\u0633\u06cc") ||
    text.includes("/fa") ||
    text.includes("lang=fa") ||
    text.includes("locale=fa") ||
    text.includes("language=fa")
  )
}

function hasEnSignal(value: string | null | undefined) {
  const text = normalize(value)

  return (
    text === "en" ||
    text === "eng" ||
    text === "english" ||
    text === "en-us" ||
    text === "en-gb" ||
    text === "ltr" ||
    text.includes("/en") ||
    text.includes("lang=en") ||
    text.includes("locale=en") ||
    text.includes("language=en")
  )
}

function getCurrentLang(): TargetLang {
  if (typeof window === "undefined" || typeof document === "undefined") return "fa"

  const path = window.location.pathname.toLowerCase()

  if (path === "/fa" || path.startsWith("/fa/")) return "fa"
  if (path === "/en" || path.startsWith("/en/")) return "en"

  try {
    const values = [
      window.localStorage.getItem("lang"),
      window.localStorage.getItem("language"),
      window.localStorage.getItem("locale"),
      window.localStorage.getItem("i18nextLng"),
      window.localStorage.getItem("NEXT_LOCALE"),
    ]

    for (const value of values) {
      if (hasFaSignal(value)) return "fa"
      if (hasEnSignal(value)) return "en"
    }
  } catch {
    // localStorage may be unavailable in some runtimes
  }

  const htmlLang = document.documentElement.getAttribute("lang")
  const htmlDir = document.documentElement.getAttribute("dir")
  const bodyLang = document.body?.getAttribute("lang")
  const bodyDir = document.body?.getAttribute("dir")

  if (hasFaSignal(htmlLang) || hasFaSignal(htmlDir) || hasFaSignal(bodyLang) || hasFaSignal(bodyDir)) return "fa"
  if (hasEnSignal(htmlLang) || hasEnSignal(htmlDir) || hasEnSignal(bodyLang) || hasEnSignal(bodyDir)) return "en"

  return "fa"
}

function detectLanguageTarget(target: EventTarget | null): TargetLang | null {
  if (!(target instanceof Element)) return null

  const element = target.closest(
    "[data-lang], [data-language], [data-locale], [data-target-lang], [data-next-lang], [data-language-switch], [data-language-toggle], button, [role='button'], a"
  )

  if (!element) return null

  const visibleValues = [
    element.textContent,
    element.getAttribute("aria-label"),
    element.getAttribute("title"),
  ]

  for (const value of visibleValues) {
    const text = normalize(value)

    if (text === "en" || text === "eng" || text === "english") return "en"
    if (
      text === "fa" ||
      text === "\u0641\u0627\u0631\u0633\u06cc" ||
      text === "\u067e\u0627\u0631\u0633\u06cc" ||
      text === "farsi" ||
      text === "persian"
    ) {
      return "fa"
    }
  }

  const dataValues = [
    element.getAttribute("data-target-lang"),
    element.getAttribute("data-next-lang"),
    element.getAttribute("href"),
    element.getAttribute("data-lang"),
    element.getAttribute("data-language"),
    element.getAttribute("data-locale"),
  ]

  for (const value of dataValues) {
    if (hasEnSignal(value)) return "en"
    if (hasFaSignal(value)) return "fa"
  }

  const joined = [...visibleValues, ...dataValues].filter(Boolean).join(" ")
  const hasFa = hasFaSignal(joined)
  const hasEn = hasEnSignal(joined)

  if (hasEn && !hasFa) return "en"
  if (hasFa && !hasEn) return "fa"

  const isLanguageToggle =
    element.hasAttribute("data-language-switch") ||
    element.hasAttribute("data-language-toggle") ||
    element.hasAttribute("data-lang") ||
    element.hasAttribute("data-language") ||
    element.hasAttribute("data-locale") ||
    element.hasAttribute("data-target-lang") ||
    element.hasAttribute("data-next-lang") ||
    (hasFa && hasEn)

  if (isLanguageToggle) {
    return getCurrentLang() === "fa" ? "en" : "fa"
  }

  return null
}

type LanguageTransitionFXProps = {
  children?: ReactNode
}

export function LanguageTransitionFX({children}: LanguageTransitionFXProps) {
  const reduceMotion = useReducedMotion()
  const currentLangRef = useRef<TargetLang>("fa")
  const clickedLangRef = useRef<TargetLang | null>(null)
  const clickedLangTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPlayRef = useRef(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const [targetLang, setTargetLang] = useState<TargetLang>("fa")

  const isFa = targetLang === "fa"
  const title = isFa ? "\u0641\u0627\u0631\u0633\u06cc" : "ENGLISH"
  const subtitle = isFa ? "\u062f\u0631 \u062d\u0627\u0644 \u062a\u063a\u06cc\u06cc\u0631 \u0632\u0628\u0627\u0646" : "SWITCHING LANGUAGE"

  const sweepInitial = isFa ? "170vw" : "-170vw"
  const sweepAnimate = isFa ? "-170vw" : "170vw"
  const titleVisualY = isFa ? "translate3d(0,-0.34em,0)" : "translate3d(0,-0.16em,0)"

  const rememberClickedLang = (lang: TargetLang | null) => {
    if (!lang) return

    clickedLangRef.current = lang

    if (clickedLangTimerRef.current) clearTimeout(clickedLangTimerRef.current)

    clickedLangTimerRef.current = setTimeout(() => {
      clickedLangRef.current = null
    }, 1000)
  }

  const consumeClickedLang = () => {
    const lang = clickedLangRef.current
    clickedLangRef.current = null

    if (clickedLangTimerRef.current) {
      clearTimeout(clickedLangTimerRef.current)
      clickedLangTimerRef.current = null
    }

    return lang
  }

  const play = (lang: TargetLang, force = false) => {
    if (reduceMotion) return

    const now = Date.now()

    if (!force && now - lastPlayRef.current < 820) return

    lastPlayRef.current = now
    currentLangRef.current = lang
    setTargetLang(lang)
    setIsPlaying(true)

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)

    hideTimerRef.current = setTimeout(() => {
      setIsPlaying(false)
    }, 1480)
  }

  useEffect(() => {
    currentLangRef.current = getCurrentLang()
    setTargetLang(currentLangRef.current)

    window.lemmLanguageTransition = (lang: TargetLang) => {
      const clickedLang = consumeClickedLang()
      play(clickedLang || lang, true)
    }

    return () => {
      delete window.lemmLanguageTransition

      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      if (clickedLangTimerRef.current) clearTimeout(clickedLangTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const onIntent = (event: Event) => {
      const clickedLang = consumeClickedLang()

      if (clickedLang) {
        play(clickedLang, true)
        return
      }

      const languageEvent = event as LanguageEvent
      const lang =
        languageEvent.detail?.lang ||
        languageEvent.detail?.language ||
        languageEvent.detail?.locale

      if (!lang) return
      play(lang, true)
    }

    const onPointerDown = (event: PointerEvent) => {
      rememberClickedLang(detectLanguageTarget(event.target))
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return
      rememberClickedLang(detectLanguageTarget(event.target))
    }

    const onClick = (event: MouseEvent) => {
      const lang = consumeClickedLang() || detectLanguageTarget(event.target)
      if (!lang) return

      requestAnimationFrame(() => {
        play(lang, true)
      })
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return

      const lang = consumeClickedLang() || detectLanguageTarget(event.target)
      if (!lang) return

      requestAnimationFrame(() => {
        play(lang, true)
      })
    }

    window.addEventListener("app:language-change-intent", onIntent)
    window.addEventListener("lemm:language-transition", onIntent)
    window.addEventListener("language-transition", onIntent)

    document.addEventListener("pointerdown", onPointerDown, true)
    document.addEventListener("keydown", onKeyDown, true)
    document.addEventListener("click", onClick)
    document.addEventListener("keyup", onKeyUp)

    return () => {
      window.removeEventListener("app:language-change-intent", onIntent)
      window.removeEventListener("lemm:language-transition", onIntent)
      window.removeEventListener("language-transition", onIntent)

      document.removeEventListener("pointerdown", onPointerDown, true)
      document.removeEventListener("keydown", onKeyDown, true)
      document.removeEventListener("click", onClick)
      document.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  return (
    <>
      {children}

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden bg-black/8"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.26, ease: easeSoft}}
          >
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,224,162,0.34),transparent_42%)]"
              initial={{scale: 0.86, opacity: 0}}
              animate={{scale: 1.08, opacity: 1}}
              exit={{scale: 1.2, opacity: 0}}
              transition={{duration: 1.04, ease: easePremium}}
            />

            <motion.div
              className="absolute left-0 top-0 h-full w-1/2 bg-[linear-gradient(90deg,rgba(215,176,106,0.08),rgba(215,176,106,0.13),transparent)]"
              initial={{x: "-105%", opacity: 0}}
              animate={{x: "0%", opacity: 0.38}}
              exit={{x: "-105%", opacity: 0}}
              transition={{duration: 0.72, ease: easePremium}}
            />

            <motion.div
              className="absolute right-0 top-0 h-full w-1/2 bg-[linear-gradient(270deg,rgba(215,176,106,0.08),rgba(215,176,106,0.13),transparent)]"
              initial={{x: "105%", opacity: 0}}
              animate={{x: "0%", opacity: 0.38}}
              exit={{x: "105%", opacity: 0}}
              transition={{duration: 0.72, ease: easePremium}}
            />

            <motion.div
              className="absolute top-0 h-full w-[165vw] bg-[linear-gradient(90deg,transparent_0%,rgba(215,176,106,0.24)_38%,rgba(255,244,219,0.34)_50%,rgba(215,176,106,0.24)_62%,transparent_100%)] blur-2xl"
              initial={{x: sweepInitial, opacity: 0}}
              animate={{x: sweepAnimate, opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 1.12, ease: easePremium}}
            />

            <motion.div
              className="absolute top-1/2 h-px w-[165vw] -translate-y-1/2 bg-[linear-gradient(90deg,transparent_0%,rgba(215,176,106,0.12)_30%,rgba(255,244,219,0.88)_50%,rgba(215,176,106,0.12)_70%,transparent_100%)]"
              initial={{x: sweepInitial, opacity: 0}}
              animate={{x: sweepAnimate, opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 1.12, ease: easePremium}}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d7b06a]/22"
              initial={{scale: 0.58, opacity: 0, rotate: -16}}
              animate={{scale: 1.12, opacity: 1, rotate: 0}}
              exit={{scale: 1.32, opacity: 0, rotate: 12}}
              transition={{duration: 1.18, ease: easePremium}}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
              initial={{scale: 0.5, opacity: 0, rotate: 18}}
              animate={{scale: 1, opacity: 1, rotate: 0}}
              exit={{scale: 1.24, opacity: 0, rotate: -14}}
              transition={{duration: 1.02, ease: easePremium}}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(215,176,106,0.13),transparent_60%)] blur-2xl"
              initial={{scale: 0.72, opacity: 0}}
              animate={{scale: 1, opacity: 1}}
              exit={{scale: 1.18, opacity: 0}}
              transition={{duration: 1.18, ease: easePremium}}
            />

            <motion.div
              className="absolute left-1/2 top-1/2 flex w-screen -translate-x-1/2 -translate-y-1/2 flex-col will-change-transform items-center justify-center px-6 text-center"
              initial={{opacity: 0, y: 28, scale: 0.94}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: -24, scale: 1.025}}
              transition={{duration: 1.05, ease: easePremium}}
            >
              <span className="mb-4 rounded-full border border-[#d7b06a]/24 bg-white/[0.05] px-5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.42em] text-[#f4d7a0]/80">
                {subtitle}
              </span>

              <span
                dir={isFa ? "rtl" : "ltr"}
                lang={targetLang}
                className="relative block w-full whitespace-nowrap text-center text-[clamp(4.8rem,12vw,12rem)] font-black leading-none text-white"
                style={{
                  transform: titleVisualY,
                  letterSpacing: isFa ? "-0.045em" : "-0.09em",
                  fontFamily: isFa ? "Tahoma, Arial, sans-serif" : "inherit",
                  textShadow:
                    "0 0 24px rgba(255,255,255,0.25), 0 0 62px rgba(215,176,106,0.42)",
                }}
              >
                {title}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default LanguageTransitionFX