"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {useEffect, useMemo, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"

type Lang = "en" | "fa"

type StudioHeaderProps = {
  language?: Lang
  onLanguageChange?: (language: Lang) => void
}

const navItems = [
  {
    href: "/",
    en: "Home",
    fa: "خانه",
  },
  {
    href: "/work",
    en: "Works",
    fa: "آثار",
  },
  {
    href: "/about",
    en: "About",
    fa: "درباره",
  },
  {
    href: "/contact",
    en: "Contact",
    fa: "تماس",
  },
]

function getInitialLanguage(): Lang {
  if (typeof window === "undefined") return "en"

  const saved = window.localStorage.getItem("lemm-language")
  if (saved === "fa" || saved === "en") return saved

  const htmlLang = document.documentElement.lang
  const htmlDir = document.documentElement.dir

  if (htmlLang === "fa" || htmlDir === "rtl") return "fa"

  return "en"
}

export default function StudioHeader({
  language,
  onLanguageChange,
}: StudioHeaderProps) {
  const pathname = usePathname()
  const [internalLanguage, setInternalLanguage] = useState<Lang>("en")
  const [isMounted, setIsMounted] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    if (!language) {
      setInternalLanguage(getInitialLanguage())
    }
  }, [language])

  useEffect(() => {
    const onLanguageEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{language?: Lang}>
      const next = customEvent.detail?.language

      if (next === "fa" || next === "en") {
        setInternalLanguage(next)
      }
    }

    window.addEventListener("lemm-language-change", onLanguageEvent)
    window.addEventListener("language-change", onLanguageEvent)

    return () => {
      window.removeEventListener("lemm-language-change", onLanguageEvent)
      window.removeEventListener("language-change", onLanguageEvent)
    }
  }, [])

  const currentLanguage = language ?? internalLanguage
  const isFa = currentLanguage === "fa"
  const nextLanguage: Lang = isFa ? "en" : "fa"

  const nav = useMemo(() => {
    return navItems.map((item) => ({
      ...item,
      label: isFa ? item.fa : item.en,
      isActive:
        item.href === "/"
          ? pathname === "/"
          : pathname === item.href || pathname?.startsWith(item.href + "/"),
    }))
  }, [isFa, pathname])

  const changeLanguage = () => {
    setIsMobileOpen(false)

    if (!language) {
      setInternalLanguage(nextLanguage)
    }

    onLanguageChange?.(nextLanguage)

    if (typeof window !== "undefined") {
      window.localStorage.setItem("lemm-language", nextLanguage)

      document.documentElement.lang = nextLanguage
      document.documentElement.dir = nextLanguage === "fa" ? "rtl" : "ltr"

      window.dispatchEvent(
        new CustomEvent("lemm-language-change", {
          detail: {
            language: nextLanguage,
          },
        }),
      )

      window.dispatchEvent(
        new CustomEvent("language-change", {
          detail: {
            language: nextLanguage,
          },
        }),
      )
    }
  }

  return (
    <header
      dir="ltr"
      className="fixed inset-x-0 top-0 z-[80] border-b border-[#d7b06a]/10 bg-[#030302]/78 backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d7b06a]/35 to-transparent" />

      <div className="relative mx-auto grid h-[70px] w-full max-w-[1320px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-7 lg:px-10">
        <div className="flex min-w-0 items-center justify-start">
          <AnimatePresence mode="wait" initial={false}>
            {isFa ? (
              <motion.nav
                key="fa-nav-left"
                dir="rtl"
                initial={isMounted ? {opacity: 0, y: -6, filter: "blur(6px)"} : false}
                animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
                exit={{opacity: 0, y: 6, filter: "blur(6px)"}}
                transition={{duration: 0.32, ease: [0.22, 1, 0.36, 1]}}
                className="hidden items-center gap-7 md:flex"
              >
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "group relative text-[13px] font-semibold leading-none tracking-[-0.01em] transition duration-300",
                      item.isActive ? "text-[#f7efe1]" : "text-[#bdb5a8] hover:text-[#f7efe1]",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>
                    <span
                      className={[
                        "absolute -bottom-3 right-0 h-px rounded-full bg-[#d7b06a] transition-all duration-300",
                        item.isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100",
                      ].join(" ")}
                    />
                  </Link>
                ))}
              </motion.nav>
            ) : (
              <motion.button
                key="en-language-left"
                type="button"
                data-language-switch
                onClick={changeLanguage}
                initial={isMounted ? {opacity: 0, y: -6, filter: "blur(6px)"} : false}
                animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
                exit={{opacity: 0, y: 6, filter: "blur(6px)"}}
                transition={{duration: 0.32, ease: [0.22, 1, 0.36, 1]}}
                className="hidden h-10 min-w-12 items-center justify-center rounded-full border border-[#d7b06a]/18 bg-[#0b0906]/65 px-5 text-[12px] font-bold tracking-[0.24em] text-[#d7b06a] shadow-[0_0_30px_rgba(215,176,106,0.04)] transition duration-300 hover:border-[#d7b06a]/45 hover:bg-[#d7b06a]/8 hover:text-[#f7dfaa] md:inline-flex"
                aria-label="Switch to Persian"
              >
                FA
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <Link
          href="/"
          aria-label="LEMM Studio home"
          className="group relative col-start-2 flex items-center justify-center gap-3 justify-self-center"
        >
          <span className="absolute -inset-x-8 -inset-y-4 rounded-full bg-[#d7b06a]/0 blur-xl transition duration-500 group-hover:bg-[#d7b06a]/8" />

          <span className="relative flex items-baseline gap-3">
            <span className="bg-gradient-to-b from-[#ffe7ad] via-[#d7b06a] to-[#8d6930] bg-clip-text text-[22px] font-black leading-none tracking-[-0.08em] text-transparent">
              LS
            </span>

            <span className="text-[13px] font-black uppercase leading-none tracking-[0.36em] text-[#f4eee4]">
              LEMM STUDIO
            </span>
          </span>
        </Link>

        <div className="flex min-w-0 items-center justify-end">
          <AnimatePresence mode="wait" initial={false}>
            {isFa ? (
              <motion.button
                key="fa-language-right"
                type="button"
                data-language-switch
                onClick={changeLanguage}
                initial={isMounted ? {opacity: 0, y: -6, filter: "blur(6px)"} : false}
                animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
                exit={{opacity: 0, y: 6, filter: "blur(6px)"}}
                transition={{duration: 0.32, ease: [0.22, 1, 0.36, 1]}}
                className="hidden h-10 min-w-12 items-center justify-center rounded-full border border-[#d7b06a]/18 bg-[#0b0906]/65 px-5 text-[12px] font-bold tracking-[0.24em] text-[#d7b06a] shadow-[0_0_30px_rgba(215,176,106,0.04)] transition duration-300 hover:border-[#d7b06a]/45 hover:bg-[#d7b06a]/8 hover:text-[#f7dfaa] md:inline-flex"
                aria-label="Switch to English"
              >
                EN
              </motion.button>
            ) : (
              <motion.nav
                key="en-nav-right"
                dir="ltr"
                initial={isMounted ? {opacity: 0, y: -6, filter: "blur(6px)"} : false}
                animate={{opacity: 1, y: 0, filter: "blur(0px)"}}
                exit={{opacity: 0, y: 6, filter: "blur(6px)"}}
                transition={{duration: 0.32, ease: [0.22, 1, 0.36, 1]}}
                className="hidden items-center gap-7 md:flex"
              >
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "group relative text-[13px] font-semibold leading-none tracking-[-0.01em] transition duration-300",
                      item.isActive ? "text-[#f7efe1]" : "text-[#bdb5a8] hover:text-[#f7efe1]",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>
                    <span
                      className={[
                        "absolute -bottom-3 left-0 h-px rounded-full bg-[#d7b06a] transition-all duration-300",
                        item.isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100",
                      ].join(" ")}
                    />
                  </Link>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setIsMobileOpen((value) => !value)}
            className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d7b06a]/18 bg-[#0b0906]/70 text-[#f7efe1] transition hover:border-[#d7b06a]/45 hover:bg-[#d7b06a]/8 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
          >
            <span className="relative h-3.5 w-4">
              <span
                className={[
                  "absolute left-0 top-0 h-px w-4 bg-current transition duration-300",
                  isMobileOpen ? "translate-y-[7px] rotate-45" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-[7px] h-px w-4 bg-current transition duration-300",
                  isMobileOpen ? "opacity-0" : "opacity-100",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-[14px] h-px w-4 bg-current transition duration-300",
                  isMobileOpen ? "-translate-y-[7px] -rotate-45" : "",
                ].join(" ")}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{height: 0, opacity: 0}}
            animate={{height: "auto", opacity: 1}}
            exit={{height: 0, opacity: 0}}
            transition={{duration: 0.32, ease: [0.22, 1, 0.36, 1]}}
            className="overflow-hidden border-t border-[#d7b06a]/10 bg-[#050403]/95 backdrop-blur-2xl md:hidden"
          >
            <div
              dir={isFa ? "rtl" : "ltr"}
              className="mx-auto flex max-w-[1320px] flex-col gap-2 px-5 py-5"
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={[
                    "rounded-2xl border px-4 py-3 text-sm font-bold transition",
                    item.isActive
                      ? "border-[#d7b06a]/35 bg-[#d7b06a]/10 text-[#f7efe1]"
                      : "border-transparent text-[#bdb5a8] hover:border-[#d7b06a]/20 hover:bg-[#d7b06a]/6 hover:text-[#f7efe1]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}

              <button
                type="button"
                data-language-switch
                onClick={changeLanguage}
                className="mt-2 rounded-2xl border border-[#d7b06a]/25 bg-[#0b0906] px-4 py-3 text-sm font-black tracking-[0.24em] text-[#d7b06a]"
              >
                {nextLanguage.toUpperCase()}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}