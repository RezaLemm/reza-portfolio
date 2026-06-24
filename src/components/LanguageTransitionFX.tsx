"use client"

import {AnimatePresence, motion, useReducedMotion} from "framer-motion"
import {Crown, Languages} from "lucide-react"
import {useEffect, useMemo, useRef, useState} from "react"

type TargetLang = "fa" | "en"

type LanguageEvent = Event & {
  detail?: {
    lang?: TargetLang
    language?: TargetLang
    locale?: TargetLang
  }
}

declare global {
  interface Window {
    lemmLanguageTransition?: (lang: TargetLang) => void
  }
}

const easeSoft = [0.22, 1, 0.36, 1] as const
const easePremium = [0.16, 1, 0.3, 1] as const

function fa(value: string) {
  return decodeURIComponent(value)
}

function normalize(value: string | null | undefined) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ")
}

function getCurrentLang(): TargetLang {
  if (typeof document === "undefined") return "en"

  const htmlLang = normalize(document.documentElement.getAttribute("lang"))
  const htmlDir = normalize(document.documentElement.getAttribute("dir"))
  const bodyLang = normalize(document.body?.getAttribute("lang"))
  const bodyDir = normalize(document.body?.getAttribute("dir"))

  if (htmlDir === "rtl" || bodyDir === "rtl" || htmlLang.startsWith("fa") || bodyLang.startsWith("fa")) {
    return "fa"
  }

  return "en"
}

function isFaValue(value: string | null | undefined) {
  const text = normalize(value)

  return (
    text === "fa" ||
    text === "ط¸ظ¾ط·آ§ط·آ±ط·آ³ط؛إ’" ||
    text === "ط¸آ¾ط·آ§ط·آ±ط·آ³ط؛إ’" ||
    text === "farsi" ||
    text === "persian" ||
    text === "switch to persian" ||
    text === "change to persian" ||
    text === "ط·ع¾ط·ط›ط؛إ’ط؛إ’ط·آ± ط·آ¨ط¸â€، ط¸ظ¾ط·آ§ط·آ±ط·آ³ط؛إ’" ||
    text.includes("/fa")
  )
}

function isEnValue(value: string | null | undefined) {
  const text = normalize(value)

  return (
    text === "en" ||
    text === "eng" ||
    text === "english" ||
    text === "ط·آ§ط¸â€ ط¹آ¯ط¸â€‍ط؛إ’ط·آ³ط؛إ’" ||
    text === "switch to english" ||
    text === "change to english" ||
    text === "ط·ع¾ط·ط›ط؛إ’ط؛إ’ط·آ± ط·آ¨ط¸â€، ط·آ§ط¸â€ ط¹آ¯ط¸â€‍ط؛إ’ط·آ³ط؛إ’" ||
    text.includes("/en")
  )
}

function hasFaSignal(value: string | null | undefined) {
  const text = normalize(value)
  return text.includes("ط¸ظ¾ط·آ§ط·آ±ط·آ³ط؛إ’") || text.includes("ط¸آ¾ط·آ§ط·آ±ط·آ³ط؛إ’") || text.includes("farsi") || text.includes("persian") || text === "fa" || text.includes("/fa")
}

function hasEnSignal(value: string | null | undefined) {
  const text = normalize(value)
  return text.includes("english") || text.includes("ط·آ§ط¸â€ ط¹آ¯ط¸â€‍ط؛إ’ط·آ³ط؛إ’") || text === "en" || text === "eng" || text.includes("/en")
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
    if (text === "fa" || text === "ظپط§ط±ط³غŒ" || text === "ظ¾ط§ط±ط³غŒ" || text === "farsi" || text === "persian") return "fa"
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
    if (isEnValue(value)) return "en"
    if (isFaValue(value)) return "fa"
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

export default function LanguageTransitionFX() {
  const shouldReduceMotion = useReducedMotion()

  const mountedRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentLangRef = useRef<TargetLang>("en")
  const clickedLangRef = useRef<TargetLang | null>(null)
  const clickedLangTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPlayRef = useRef(0)

  const [active, setActive] = useState(false)
  const [targetLang, setTargetLang] = useState<TargetLang>("en")
  const [token, setToken] = useState(0)

  const isFa = targetLang === "fa"
  const title = isFa ? fa("%D9%81%D8%A7%D8%B1%D8%B3%DB%8C") : "ENGLISH"
  const eyebrow = isFa ? fa("%D8%AA%D8%BA%DB%8C%DB%8C%D8%B1%20%D8%B2%D8%A8%D8%A7%D9%86") : "Language Shift"

  const titleFontSize = isFa
    ? "clamp(5.05rem, 9.65vw, 10.05rem)"
    : "clamp(5.05rem, 9.65vw, 10.05rem)"

  const titleVisualY = isFa
    ? "translateY(-0.285em)"
    : "translateY(-0.18em)"

  const titleLetterSpacing = isFa ? "0" : "-0.085em"

  const particles = useMemo(
    () =>
      Array.from({length: 46}, (_, index) => {
        const bright = index % 6 === 0
        const medium = index % 3 === 0

        return {
          id: index,
          left: `${4 + ((index * 29) % 92)}%`,
          top: `${5 + ((index * 41) % 88)}%`,
          size: bright ? 2.55 : medium ? 1.85 : 1.25 + (index % 3) * 0.28,
          delay: 0.04 + (index % 12) * 0.022,
          duration: 0.58 + (index % 4) * 0.06,
          opacity: bright ? 0.78 : medium ? 0.56 : 0.42 + (index % 3) * 0.055,
          color: bright ? "#ffe9bf" : index % 2 === 0 ? "#f4dfbd" : "#c9a46a",
          glow: bright ? 18 : medium ? 14 : 10,
          x: (index % 2 === 0 ? 1 : -1) * (6 + (index % 6) * 4),
          y: (index % 3 === 0 ? -1 : 1) * (6 + (index % 5) * 4),
        }
      }),
    []
  )

  const rings = useMemo(
    () =>
      Array.from({length: 4}, (_, index) => ({
        id: index,
        size: 42 + index * 18,
        delay: 0.045 + index * 0.07,
        opacity: 0.1 + index * 0.055,
      })),
    []
  )

  const play = (lang: TargetLang, force = false) => {
    if (!mountedRef.current) return

    const now = Date.now()
    if (!force && now - lastPlayRef.current < 450) return

    lastPlayRef.current = now
    currentLangRef.current = lang

    setTargetLang(lang)
    setToken((value) => value + 1)
    setActive(true)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      setActive(false)
    }, shouldReduceMotion ? 240 : 1180)
  }

  const rememberClickedLang = (lang: TargetLang | null) => {
    if (!lang) return

    clickedLangRef.current = lang

    if (clickedLangTimerRef.current) clearTimeout(clickedLangTimerRef.current)

    clickedLangTimerRef.current = setTimeout(() => {
      clickedLangRef.current = null
    }, 900)
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

  useEffect(() => {
    currentLangRef.current = getCurrentLang()

    const timer = setTimeout(() => {
      mountedRef.current = true
    }, 900)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    window.lemmLanguageTransition = (lang: TargetLang) => {
      const clickedLang = consumeClickedLang()
      play(clickedLang || lang, true)
    }

    return () => {
      delete window.lemmLanguageTransition
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

    document.addEventListener("pointerdown", onPointerDown, {capture: true})
    document.addEventListener("keydown", onKeyDown, {capture: true})
    document.addEventListener("click", onClick)
    document.addEventListener("keyup", onKeyUp)

    return () => {
      window.removeEventListener("app:language-change-intent", onIntent)
      window.removeEventListener("lemm:language-transition", onIntent)
      window.removeEventListener("language-transition", onIntent)

      document.removeEventListener("pointerdown", onPointerDown, {capture: true})
      document.removeEventListener("keydown", onKeyDown, {capture: true})
      document.removeEventListener("click", onClick)
      document.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (clickedLangTimerRef.current) clearTimeout(clickedLangTimerRef.current)
    }
  }, [])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key={token}
          aria-hidden="true"
          dir={isFa ? "rtl" : "ltr"}
          className="pointer-events-none fixed inset-0 z-[99999] isolate overflow-hidden bg-[#030201] transform-gpu"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{
            duration: shouldReduceMotion ? 0.08 : 0.22,
            ease: easeSoft,
          }}
          style={{
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
          }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{opacity: 0, scale: shouldReduceMotion ? 1 : 1.004}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 1.002}}
            transition={{
              duration: shouldReduceMotion ? 0.08 : 0.5,
              ease: easeSoft,
            }}
            style={{
              background:
                "radial-gradient(circle at 50% 47%, rgba(255,238,210,0.22), transparent 17%), radial-gradient(circle at 18% 28%, rgba(202,139,65,0.20), transparent 28%), radial-gradient(circle at 84% 72%, rgba(112,64,30,0.17), transparent 30%), linear-gradient(135deg, #030201 0%, #090604 52%, #020202 100%)",
            }}
          />

          {!shouldReduceMotion && (
            <motion.div
              className="absolute inset-0"
              initial={{opacity: 0}}
              animate={{opacity: 0.58}}
              exit={{opacity: 0}}
              transition={{
                duration: 0.34,
                ease: easeSoft,
              }}
              style={{
                background:
                  "radial-gradient(circle at 12% 18%, rgba(255,232,190,0.25) 0px, transparent 1.9px), radial-gradient(circle at 35% 68%, rgba(201,164,106,0.22) 0px, transparent 1.8px), radial-gradient(circle at 72% 26%, rgba(255,232,190,0.20) 0px, transparent 1.9px), radial-gradient(circle at 86% 82%, rgba(201,164,106,0.20) 0px, transparent 1.8px), radial-gradient(circle at 54% 38%, rgba(255,232,190,0.18) 0px, transparent 1.7px), radial-gradient(circle at 22% 84%, rgba(201,164,106,0.18) 0px, transparent 1.7px), radial-gradient(circle at 62% 88%, rgba(255,232,190,0.14) 0px, transparent 1.6px)",
                backgroundSize: "108px 108px, 132px 132px, 164px 164px, 122px 122px, 184px 184px, 148px 148px, 210px 210px",
                backgroundPosition: "0 0, 34px 26px, 18px 58px, 72px 14px, 44px 88px, 96px 48px, 130px 64px",
                mixBlendMode: "screen",
                maskImage: "radial-gradient(circle at center, black 0%, transparent 86%)",
              }}
            />
          )}

          <motion.div
            className="absolute inset-0"
            initial={{opacity: 0}}
            animate={{opacity: shouldReduceMotion ? 0.02 : 0.055}}
            exit={{opacity: 0}}
            transition={{
              duration: 0.3,
              ease: easeSoft,
            }}
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 136px), repeating-linear-gradient(180deg, rgba(255,255,255,0.008) 0px, rgba(255,255,255,0.008) 1px, transparent 1px, transparent 136px)",
              maskImage: "radial-gradient(circle at center, black 0%, transparent 82%)",
            }}
          />

          {!shouldReduceMotion && (
            <>
              <motion.div
                className="absolute -left-[18vw] top-[-18vh] h-[70vh] w-[78vw] rounded-full"
                initial={{opacity: 0, scale: 0.995}}
                animate={{opacity: 0.25, scale: 1}}
                exit={{opacity: 0, scale: 1.003}}
                transition={{
                  duration: 0.48,
                  ease: easeSoft,
                }}
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(196,133,61,0.40), rgba(102,61,24,0.10) 48%, transparent 74%)",
                  filter: "blur(68px)",
                }}
              />

              <motion.div
                className="absolute -right-[20vw] bottom-[-22vh] h-[74vh] w-[74vw] rounded-full"
                initial={{opacity: 0, scale: 0.995}}
                animate={{opacity: 0.22, scale: 1}}
                exit={{opacity: 0, scale: 1.003}}
                transition={{
                  duration: 0.5,
                  delay: 0.01,
                  ease: easeSoft,
                }}
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(222,176,103,0.26), rgba(68,40,17,0.10) 48%, transparent 74%)",
                  filter: "blur(72px)",
                }}
              />
            </>
          )}

          {rings.map((ring) => (
            <motion.div
              key={ring.id}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9a46a]/20"
              style={{
                width: `${ring.size}vmin`,
                height: `${ring.size}vmin`,
              }}
              initial={{scale: shouldReduceMotion ? 1 : 0.96, opacity: 0}}
              animate={{scale: 1, opacity: ring.opacity}}
              exit={{scale: 1.003, opacity: 0}}
              transition={{
                duration: shouldReduceMotion ? 0.08 : 0.48,
                delay: shouldReduceMotion ? 0 : ring.delay,
                ease: easeSoft,
              }}
            />
          ))}

          <motion.div
            className="absolute inset-x-0 top-1/2 h-px"
            initial={{scaleX: 0, opacity: 0}}
            animate={{scaleX: 1, opacity: 0.66}}
            exit={{scaleX: 0, opacity: 0}}
            transition={{
              duration: shouldReduceMotion ? 0.08 : 0.38,
              delay: shouldReduceMotion ? 0 : 0.04,
              ease: easeSoft,
            }}
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.035) 14%, rgba(244,223,189,0.40) 50%, rgba(255,255,255,0.035) 86%, transparent 100%)",
              transformOrigin: "50% 50%",
            }}
          />

          {!shouldReduceMotion &&
            particles.map((spark) => (
              <motion.span
                key={spark.id}
                className="absolute rounded-full transform-gpu"
                style={{
                  left: spark.left,
                  top: spark.top,
                  width: spark.size,
                  height: spark.size,
                  background: spark.color,
                  boxShadow: `0 0 ${spark.glow}px rgba(201,164,106,0.58), 0 0 ${spark.glow * 1.65}px rgba(255,232,190,0.22)`,
                  mixBlendMode: "screen",
                }}
                initial={{opacity: 0, scale: 0.65, x: 0, y: 0}}
                animate={{
                  opacity: [0, spark.opacity, spark.opacity * 0.58, 0],
                  scale: [0.65, 0.98, 0.82, 0.65],
                  x: spark.x,
                  y: spark.y,
                }}
                exit={{opacity: 0}}
                transition={{
                  duration: spark.duration,
                  delay: spark.delay,
                  ease: easeSoft,
                }}
              />
            ))}

          <motion.div
            className="absolute left-1/2 top-1/2 z-10 flex w-[min(92vw,1040px)] -translate-x-1/2 -translate-y-1/2 flex-col items-center px-6 text-center transform-gpu"
            initial={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : 8,
              filter: shouldReduceMotion ? "blur(0px)" : "blur(2px)",
            }}
            animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
            exit={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : -4,
              filter: shouldReduceMotion ? "blur(0px)" : "blur(1px)",
            }}
            transition={{
              duration: shouldReduceMotion ? 0.08 : 0.48,
              delay: shouldReduceMotion ? 0 : 0.08,
              ease: easePremium,
            }}
          >
            <motion.div
              className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-xs font-medium text-white/90 shadow-[0_18px_70px_rgba(0,0,0,0.36)] backdrop-blur-2xl"
              initial={{opacity: 0, y: shouldReduceMotion ? 0 : 3, scale: shouldReduceMotion ? 1 : 0.994}}
              animate={{opacity: 1, y: 0, scale: 1}}
              exit={{opacity: 0, y: shouldReduceMotion ? 0 : -2, scale: 0.994}}
              transition={{
                duration: shouldReduceMotion ? 0.08 : 0.26,
                delay: shouldReduceMotion ? 0 : 0.13,
                ease: easeSoft,
              }}
            >
              <Languages size={14} />
              <span>{eyebrow}</span>
              <Crown size={14} />
            </motion.div>

            <div className="relative flex h-[clamp(7.2rem,12vw,12.8rem)] w-[min(92vw,860px)] items-center justify-center overflow-visible">
              <motion.div
                className="absolute -inset-x-24 -inset-y-16 rounded-[60px]"
                initial={{opacity: 0, scale: 0.99}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 1.002}}
                transition={{
                  duration: shouldReduceMotion ? 0.08 : 0.32,
                  delay: shouldReduceMotion ? 0 : 0.1,
                  ease: easeSoft,
                }}
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(255,255,255,0.085), rgba(201,164,106,0.085) 34%, transparent 72%)",
                  filter: shouldReduceMotion ? "none" : "blur(30px)",
                }}
              />

              <motion.div
                className="relative z-10 flex h-full w-full items-center justify-center transform-gpu"
                initial={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : 9,
                  scale: shouldReduceMotion ? 1 : 0.998,
                  filter: shouldReduceMotion ? "blur(0px)" : "blur(1.8px)",
                }}
                animate={{opacity: 1, y: 0, scale: 1, filter: "blur(0px)"}}
                exit={{
                  opacity: 0,
                  y: shouldReduceMotion ? 0 : -3,
                  scale: shouldReduceMotion ? 1 : 1.001,
                  filter: shouldReduceMotion ? "blur(0px)" : "blur(0.8px)",
                }}
                transition={{
                  duration: shouldReduceMotion ? 0.08 : 0.46,
                  delay: shouldReduceMotion ? 0 : 0.17,
                  ease: easePremium,
                }}
              >
                <span
                  lang={isFa ? "fa" : "en"}
                  dir={isFa ? "rtl" : "ltr"}
                  className="block whitespace-nowrap font-semibold text-white"
                  style={{
                    fontSize: titleFontSize,
                    lineHeight: 1,
                    letterSpacing: titleLetterSpacing,
                    textTransform: isFa ? "none" : "uppercase",
                    transform: titleVisualY,
                    textShadow:
                      "0 0 34px rgba(255,255,255,0.08), 0 0 140px rgba(201,164,106,0.28), 0 34px 90px rgba(0,0,0,0.76)",
                  }}
                >
                  {title}
                </span>
              </motion.div>

              <motion.div
                className="absolute bottom-[10%] left-1/2 h-[3px] w-[68%] -translate-x-1/2"
                initial={{scaleX: 0, opacity: 0}}
                animate={{scaleX: 1, opacity: 0.86}}
                exit={{scaleX: 0, opacity: 0}}
                transition={{
                  duration: shouldReduceMotion ? 0.08 : 0.32,
                  delay: shouldReduceMotion ? 0 : 0.36,
                  ease: easeSoft,
                }}
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(244,223,189,0.78), rgba(201,164,106,0.78), rgba(244,223,189,0.78), transparent)",
                  boxShadow: "0 0 22px rgba(201,164,106,0.32)",
                  transformOrigin: "50% 50%",
                }}
              />
            </div>
          </motion.div>

          {!shouldReduceMotion && (
            <motion.div
              className="absolute inset-0"
              initial={{x: "-104%", opacity: 0}}
              animate={{x: "104%", opacity: 0.32}}
              exit={{opacity: 0}}
              transition={{
                duration: 0.56,
                delay: 0.09,
                ease: easeSoft,
              }}
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.025) 42%, rgba(244,223,189,0.085) 50%, rgba(255,255,255,0.025) 58%, transparent 100%)",
                transform: "skewX(-16deg)",
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}