"use client"

import {useEffect, useRef} from "react"

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function lerp(current: number, target: number, speed: number) {
  return current + (target - current) * speed
}

export default function SiteCinematicEffects() {
  const lightRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const main = document.querySelector("main") as HTMLElement | null
    if (!main) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduceMotion.matches) return

    main.dataset.siteCinematic = "true"

    let raf = 0

    const pointer = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.42,
      tx: window.innerWidth * 0.5,
      ty: window.innerHeight * 0.42,
    }

    const renderPointer = () => {
      pointer.x = lerp(pointer.x, pointer.tx, 0.08)
      pointer.y = lerp(pointer.y, pointer.ty, 0.08)

      if (lightRef.current) {
        lightRef.current.style.setProperty("--site-mx", pointer.x.toFixed(2) + "px")
        lightRef.current.style.setProperty("--site-my", pointer.y.toFixed(2) + "px")
      }

      raf = window.requestAnimationFrame(renderPointer)
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = event.clientX
      pointer.ty = event.clientY
    }

    window.addEventListener("pointermove", onPointerMove, {passive: true})
    raf = window.requestAnimationFrame(renderPointer)

    const revealTargets: HTMLElement[] = []

    const sections = Array.from(main.querySelectorAll<HTMLElement>(":scope > section"))

    sections.forEach((section, sectionIndex) => {
      section.dataset.cinemaSection = "true"
      section.style.setProperty("--cinema-section-index", String(sectionIndex))
      revealTargets.push(section)

      if (sectionIndex === 0) return

      const cards = Array.from(
        section.querySelectorAll<HTMLElement>("article, li, a, button, [class*='rounded-'][class*='border']")
      ).filter((item) => {
        const rect = item.getBoundingClientRect()
        return rect.width > 140 && rect.height > 80
      })

      cards.forEach((card, cardIndex) => {
        card.dataset.cinemaCard = "true"
        card.style.setProperty("--cinema-card-index", String(clamp(cardIndex, 0, 8)))
        revealTargets.push(card)
      })
    })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement

          if (entry.isIntersecting) {
            element.dataset.cinemaVisible = "true"
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -10% 0px",
      }
    )

    revealTargets.forEach((target) => observer.observe(target))

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onPointerMove)
      observer.disconnect()

      delete main.dataset.siteCinematic

      revealTargets.forEach((target) => {
        delete target.dataset.cinemaSection
        delete target.dataset.cinemaCard
        delete target.dataset.cinemaVisible
        target.style.removeProperty("--cinema-section-index")
        target.style.removeProperty("--cinema-card-index")
      })
    }
  }, [])

  return (
    <>
      <div ref={lightRef} className="site-cinematic-pointer-light" aria-hidden="true" />

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .site-cinematic-pointer-light,
          main[data-site-cinematic="true"] *,
          main[data-site-cinematic="true"] *::before,
          main[data-site-cinematic="true"] *::after {
            animation: none !important;
            transition: none !important;
          }
        }

        .site-cinematic-pointer-light {
          --site-mx: 50vw;
          --site-my: 42vh;
          position: fixed;
          left: var(--site-mx);
          top: var(--site-my);
          z-index: 2;
          width: 34rem;
          height: 34rem;
          pointer-events: none;
          border-radius: 999px;
          transform: translate3d(-50%, -50%, 0);
          background:
            radial-gradient(circle, rgba(255, 236, 190, 0.18), rgba(215, 176, 106, 0.075) 32%, transparent 68%);
          filter: blur(28px);
          opacity: 0.74;
          mix-blend-mode: screen;
        }

        main[data-site-cinematic="true"] {
          --cinema-ease: cubic-bezier(0.18, 1, 0.24, 1);
          --cinema-soft: cubic-bezier(0.22, 1, 0.36, 1);
          --cinema-gold: 215, 176, 106;
        }

        main[data-site-cinematic="true"] > section:first-of-type {
          position: relative;
          isolation: isolate;
          animation: cinemaHeroStageIn 980ms var(--cinema-soft) both;
        }

        main[data-site-cinematic="true"] > section:first-of-type::before {
          content: "";
          position: absolute;
          left: 53%;
          top: 43%;
          z-index: -1;
          width: min(70rem, 80vw);
          height: min(70rem, 80vw);
          pointer-events: none;
          border-radius: 999px;
          opacity: 0;
          transform: translate3d(-50%, -50%, 0) scale(0.82);
          background:
            radial-gradient(circle, rgba(var(--cinema-gold), 0.13), transparent 58%),
            repeating-radial-gradient(circle, rgba(var(--cinema-gold), 0.14) 0 1px, transparent 1px 62px);
          mask-image: radial-gradient(circle, black 0%, black 42%, transparent 76%);
          -webkit-mask-image: radial-gradient(circle, black 0%, black 42%, transparent 76%);
          animation: cinemaApertureIn 1800ms var(--cinema-ease) 180ms both;
        }

        main[data-site-cinematic="true"] > section:first-of-type::after {
          content: "";
          position: absolute;
          left: 52%;
          top: 43%;
          z-index: 3;
          width: min(74rem, 86vw);
          height: 1px;
          pointer-events: none;
          opacity: 0;
          transform: translate3d(-50%, 0, 0) scaleX(0);
          transform-origin: center;
          background:
            linear-gradient(90deg, transparent, rgba(255, 235, 190, 0.62), transparent);
          animation: cinemaIntroSweep 1300ms var(--cinema-ease) 560ms both;
        }

        main[data-site-cinematic="true"] > section:first-of-type h1 {
          animation: cinemaHeroTitleIn 1150ms var(--cinema-ease) 120ms both;
          transform-origin: center bottom;
        }

        main[data-site-cinematic="true"] > section:first-of-type h1 > * {
          display: block;
          animation: cinemaHeroLineIn 980ms var(--cinema-ease) both;
        }

        main[data-site-cinematic="true"] > section:first-of-type h1 > *:nth-child(1) {
          animation-delay: 220ms;
        }

        main[data-site-cinematic="true"] > section:first-of-type h1 > *:nth-child(2) {
          animation-delay: 320ms;
        }

        main[data-site-cinematic="true"] > section:first-of-type h1 > *:nth-child(3) {
          animation-delay: 420ms;
        }

        main[data-site-cinematic="true"] > section:first-of-type h1 > *:nth-child(4) {
          animation-delay: 520ms;
        }

        main[data-site-cinematic="true"] > section:first-of-type > *:first-child > *:not(h1) {
          animation: cinemaHeroCopyIn 780ms var(--cinema-ease) both;
        }

        main[data-site-cinematic="true"] > section:first-of-type > *:first-child > *:nth-child(1) {
          animation-delay: 80ms;
        }

        main[data-site-cinematic="true"] > section:first-of-type > *:first-child > *:nth-child(2) {
          animation-delay: 150ms;
        }

        main[data-site-cinematic="true"] > section:first-of-type > *:first-child > *:nth-child(4) {
          animation-delay: 600ms;
        }

        main[data-site-cinematic="true"] > section:first-of-type > *:first-child > *:nth-child(5) {
          animation-delay: 710ms;
        }

        main[data-site-cinematic="true"] > section:first-of-type > *:first-child > *:nth-child(6) {
          animation-delay: 820ms;
        }

        main[data-site-cinematic="true"] > section:first-of-type > *:last-child {
          animation: cinemaHeroVisualIn 1180ms var(--cinema-ease) 280ms both;
        }

        main[data-site-cinematic="true"] [data-cinema-section="true"]:not(:first-of-type) {
          opacity: 0;
          transform: translate3d(0, 34px, 0) scale(0.985);
          transition:
            opacity 900ms var(--cinema-ease),
            transform 900ms var(--cinema-ease);
        }

        main[data-site-cinematic="true"] [data-cinema-section="true"][data-cinema-visible="true"]:not(:first-of-type) {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }

        main[data-site-cinematic="true"] [data-cinema-card="true"] {
          opacity: 0;
          transform: translate3d(0, 28px, 0) scale(0.982);
          transition:
            opacity 760ms var(--cinema-ease),
            transform 760ms var(--cinema-ease),
            box-shadow 260ms var(--cinema-ease),
            border-color 260ms var(--cinema-ease),
            filter 260ms var(--cinema-ease);
          transition-delay: calc(var(--cinema-card-index, 0) * 55ms);
          will-change: transform, opacity;
        }

        main[data-site-cinematic="true"] [data-cinema-card="true"][data-cinema-visible="true"] {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
        }

        main[data-site-cinematic="true"] [data-cinema-card="true"]:hover {
          transform: translate3d(0, -6px, 0) scale(1.008);
          filter: brightness(1.035);
          box-shadow:
            0 22px 60px rgba(0, 0, 0, 0.24),
            0 0 42px rgba(var(--cinema-gold), 0.11);
        }

        main[data-site-cinematic="true"] a,
        main[data-site-cinematic="true"] button,
        main[data-site-cinematic="true"] [role="button"] {
          transition:
            transform 240ms var(--cinema-ease),
            box-shadow 240ms var(--cinema-ease),
            border-color 240ms var(--cinema-ease);
        }

        main[data-site-cinematic="true"] a:hover,
        main[data-site-cinematic="true"] button:hover,
        main[data-site-cinematic="true"] [role="button"]:hover {
          transform: translate3d(0, -2px, 0);
        }

        @keyframes cinemaHeroStageIn {
          from {
            opacity: 0;
            transform: translate3d(0, 18px, 0) scale(0.994);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes cinemaApertureIn {
          from {
            opacity: 0;
            transform: translate3d(-50%, -50%, 0) scale(0.72) rotate(-7deg);
          }
          52% {
            opacity: 0.74;
          }
          to {
            opacity: 0.4;
            transform: translate3d(-50%, -50%, 0) scale(1.04) rotate(0deg);
          }
        }

        @keyframes cinemaIntroSweep {
          from {
            opacity: 0;
            transform: translate3d(-50%, 0, 0) scaleX(0);
          }
          45% {
            opacity: 0.72;
          }
          to {
            opacity: 0;
            transform: translate3d(-50%, 0, 0) scaleX(1.04);
          }
        }

        @keyframes cinemaHeroTitleIn {
          from {
            opacity: 0;
            transform: translate3d(0, 34px, 0) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes cinemaHeroLineIn {
          from {
            opacity: 0;
            transform: translate3d(0, 42px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes cinemaHeroCopyIn {
          from {
            opacity: 0;
            transform: translate3d(0, 18px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes cinemaHeroVisualIn {
          from {
            opacity: 0;
            transform: translate3d(-34px, 28px, 0) scale(0.965);
          }
          70% {
            opacity: 1;
            transform: translate3d(3px, -2px, 0) scale(1.006);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }
      `}</style>
    </>
  )
}