"use client"

import {useEffect, useRef} from "react"
import type {CSSProperties} from "react"

const stars = Array.from({length: 48}, (_, index) => {
  const id = index + 1
  const x = 3 + ((index * 19) % 94)
  const y = 7 + ((index * 31) % 86)
  const size = 0.7 + ((index * 7) % 18) / 10
  const delay = ((index * 0.39) % 7).toFixed(2) + "s"
  const duration = (8 + ((index * 0.67) % 8)).toFixed(2) + "s"

  return {id, x, y, size, delay, duration}
})

const streaks = Array.from({length: 14}, (_, index) => {
  const id = index + 1
  const x = 4 + ((index * 23) % 91)
  const y = 10 + ((index * 37) % 76)
  const width = 70 + ((index * 17) % 115)
  const rotate = -27 + ((index * 5) % 18)
  const delay = ((index * 0.81) % 7).toFixed(2) + "s"
  const duration = (8.5 + ((index * 0.76) % 6)).toFixed(2) + "s"

  return {id, x, y, width, rotate, delay, duration}
})

export default function CanvasCinematicUpgrade() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const shouldReduceMotion = reduceMotion.matches

    let raf = 0

    const current = {
      x: window.innerWidth * 0.58,
      y: window.innerHeight * 0.42,
      scroll: window.scrollY,
    }

    const target = {
      x: current.x,
      y: current.y,
      scroll: current.scroll,
    }

    const render = () => {
      target.scroll = window.scrollY

      current.x += (target.x - current.x) * 0.045
      current.y += (target.y - current.y) * 0.045
      current.scroll += (target.scroll - current.scroll) * 0.06

      root.style.setProperty("--canvas-mx", current.x.toFixed(2) + "px")
      root.style.setProperty("--canvas-my", current.y.toFixed(2) + "px")
      root.style.setProperty("--canvas-scroll", current.scroll.toFixed(2) + "px")

      raf = window.requestAnimationFrame(render)
    }

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
    }

    if (!shouldReduceMotion) {
      window.addEventListener("pointermove", onPointerMove as EventListener, {passive: true})
      raf = window.requestAnimationFrame(render)
    }

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onPointerMove as EventListener)
    }
  }, [])

  useEffect(() => {
    const root = document.querySelector(".canvas-page-shell")
    if (!root) return

    let lastCard: HTMLElement | null = null

    const normalize = (value: string) =>
      value
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase()

    const enhance = () => {
      const pageMain = root.querySelector("main") as HTMLElement | null

      if (pageMain) {
        pageMain.classList.add("canvas-unified-main")
      }

      const cardCandidates = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href^="/work/"], article, [class*="card"], [class*="Card"]',
        ),
      )

      cardCandidates.forEach((element) => {
        if (!element.querySelector("img")) return

        element.classList.add("canvas-premium-card")
        element.dataset.canvasCard = "true"
      })

      const chips = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, [role="button"], a:not([href^="/work/"])',
        ),
      ).filter((element) => {
        const text = normalize(element.textContent || "")
        if (!text) return false
        if (text.length > 42) return false
        if (element.closest("header")) return false
        if (element.closest("[data-canvas-card='true']")) return false

        return true
      })

      const seen = new Set<string>()

      chips.forEach((element) => {
        const text = normalize(element.textContent || "")

        element.classList.add("canvas-premium-chip")

        if (seen.has(text)) {
          element.classList.add("canvas-duplicate-chip")
          element.setAttribute("aria-hidden", "true")
        } else {
          seen.add(text)
          element.classList.remove("canvas-duplicate-chip")
          element.removeAttribute("aria-hidden")
        }
      })
    }

    const resetCard = (card: HTMLElement | null) => {
      if (!card) return

      card.style.setProperty("--card-rx", "0deg")
      card.style.setProperty("--card-ry", "0deg")
      card.style.setProperty("--card-lift", "0px")
      card.style.setProperty("--card-glow-x", "50%")
      card.style.setProperty("--card-glow-y", "42%")
    }

    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null
      const card = target?.closest("[data-canvas-card='true']") as HTMLElement | null

      if (!card) {
        if (lastCard) {
          resetCard(lastCard)
          lastCard = null
        }

        return
      }

      lastCard = card

      const rect = card.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height

      const rotateY = (px - 0.5) * 10
      const rotateX = (0.5 - py) * 8

      card.style.setProperty("--card-rx", rotateX.toFixed(3) + "deg")
      card.style.setProperty("--card-ry", rotateY.toFixed(3) + "deg")
      card.style.setProperty("--card-lift", "-8px")
      card.style.setProperty("--card-glow-x", (px * 100).toFixed(2) + "%")
      card.style.setProperty("--card-glow-y", (py * 100).toFixed(2) + "%")
    }

    const onLeave = () => {
      resetCard(lastCard)
      lastCard = null
    }

    enhance()

    const observer = new MutationObserver(enhance)

    observer.observe(root, {
      childList: true,
      subtree: true,
    })

    root.addEventListener("pointermove", onMove as EventListener, {passive: true})
    root.addEventListener("pointerleave", onLeave as EventListener)

    return () => {
      observer.disconnect()
      root.removeEventListener("pointermove", onMove as EventListener)
      root.removeEventListener("pointerleave", onLeave as EventListener)
    }
  }, [])

  return (
    <div ref={rootRef} className="canvas-cinematic-upgrade" aria-hidden="true">
      <div className="canvas-cine-base" />
      <div className="canvas-cine-vignette" />

      <div className="canvas-cine-orbit canvas-cine-orbit-main" />
      <div className="canvas-cine-orbit canvas-cine-orbit-wide" />
      <div className="canvas-cine-orbit canvas-cine-orbit-slice" />

      <div className="canvas-cine-light canvas-cine-light-left" />
      <div className="canvas-cine-light canvas-cine-light-right" />
      <div className="canvas-cine-light canvas-cine-light-cursor" />

      <div className="canvas-cine-film" />
      <div className="canvas-cine-grain" />

      {streaks.map((item) => (
        <span
          key={"canvas-streak-" + item.id}
          className="canvas-cine-streak"
          style={
            {
              left: item.x + "%",
              top: item.y + "%",
              width: item.width + "px",
              "--streak-rotate": item.rotate + "deg",
              "--streak-delay": item.delay,
              "--streak-duration": item.duration,
            } as CSSProperties
          }
        />
      ))}

      {stars.map((item) => (
        <span
          key={"canvas-star-" + item.id}
          className="canvas-cine-star"
          style={
            {
              left: item.x + "%",
              top: item.y + "%",
              width: item.size + "px",
              height: item.size + "px",
              "--star-delay": item.delay,
              "--star-duration": item.duration,
            } as CSSProperties
          }
        />
      ))}

      <style jsx global>{`
        html,
        body {
          background: #020201 !important;
        }

        .canvas-page-shell {
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          overflow: hidden;
          background: transparent;
        }

        .canvas-page-content {
          position: relative;
          z-index: 2;
        }

        .canvas-page-shell main,
        .canvas-page-shell section {
          background: transparent !important;
        }

        .canvas-page-shell main {
          position: relative !important;
          isolation: isolate !important;
          min-height: 100vh !important;
          overflow: visible !important;
          padding-top: clamp(108px, 11vh, 150px) !important;
          padding-bottom: clamp(80px, 10vh, 140px) !important;
          background: transparent !important;
        }

        .canvas-page-shell main > * {
          width: min(100% - 40px, 1120px) !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .canvas-page-shell main,
        .canvas-page-shell main * {
          text-align: center !important;
        }

        .canvas-page-shell main [dir="rtl"],
        .canvas-page-shell main [dir="ltr"] {
          text-align: center !important;
        }

        .canvas-cinematic-upgrade {
          --canvas-mx: 58vw;
          --canvas-my: 42vh;
          --canvas-scroll: 0px;
          --gold: 215, 176, 106;
          --cream: 255, 241, 210;

          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background: #020201;
          transform: translateZ(0);
        }

        .canvas-cine-base {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 24% 37%, rgba(var(--gold), 0.16), transparent 31%),
            radial-gradient(circle at 76% 37%, rgba(var(--gold), 0.14), transparent 31%),
            radial-gradient(circle at 50% 108%, rgba(var(--gold), 0.09), transparent 42%),
            linear-gradient(180deg, #020201 0%, #080604 44%, #020201 100%);
        }

        .canvas-cine-vignette {
          position: absolute;
          inset: -2px;
          background:
            radial-gradient(circle at 50% 38%, transparent 0%, transparent 38%, rgba(0,0,0,0.7) 78%, rgba(0,0,0,0.97) 100%),
            linear-gradient(90deg, rgba(0,0,0,0.94), transparent 25%, transparent 75%, rgba(0,0,0,0.94));
        }

        .canvas-cine-orbit {
          position: absolute;
          left: 50%;
          top: 40%;
          border-radius: 999px;
          border: 1px solid rgba(var(--gold), 0.075);
          transform: translate3d(-50%, calc(-50% + var(--canvas-scroll) * 0.1), 0);
          opacity: 0.45;
          box-shadow:
            inset 0 0 38px rgba(var(--gold), 0.035),
            0 0 80px rgba(var(--gold), 0.03);
        }

        .canvas-cine-orbit-main {
          width: min(62vw, 940px);
          height: min(62vw, 940px);
          background:
            radial-gradient(circle, transparent 0%, transparent 35%, rgba(var(--gold), 0.042) 35.3%, transparent 35.75%),
            radial-gradient(circle, transparent 0%, transparent 49%, rgba(var(--gold), 0.052) 49.25%, transparent 49.72%),
            radial-gradient(circle, transparent 0%, transparent 64%, rgba(var(--gold), 0.038) 64.2%, transparent 64.62%);
          animation: canvasOrbitBreathe 18s ease-in-out infinite;
        }

        .canvas-cine-orbit-wide {
          left: 50%;
          top: 40%;
          width: min(86vw, 1320px);
          height: min(42vw, 640px);
          opacity: 0.22;
          transform: translate3d(-50%, calc(-50% + var(--canvas-scroll) * 0.07), 0) rotate(-14deg);
          box-shadow: none;
        }

        .canvas-cine-orbit-slice {
          left: 50%;
          top: 40%;
          width: min(48vw, 740px);
          height: min(24vw, 370px);
          opacity: 0.16;
          transform: translate3d(-50%, calc(-50% + var(--canvas-scroll) * 0.045), 0) rotate(10deg);
          box-shadow: none;
        }

        .canvas-cine-light {
          position: absolute;
          border-radius: 999px;
          transform: translate3d(-50%, -50%, 0);
          filter: blur(48px);
          mix-blend-mode: screen;
        }

        .canvas-cine-light-left {
          left: 20%;
          top: 37%;
          width: 40rem;
          height: 40rem;
          opacity: 0.26;
          background:
            radial-gradient(circle, rgba(var(--gold), 0.27), rgba(var(--gold), 0.08) 38%, transparent 70%);
          animation: canvasLightLeft 20s ease-in-out infinite;
        }

        .canvas-cine-light-right {
          left: 80%;
          top: 36%;
          width: 38rem;
          height: 38rem;
          opacity: 0.24;
          background:
            radial-gradient(circle, rgba(var(--cream), 0.16), rgba(var(--gold), 0.07) 38%, transparent 72%);
          animation: canvasLightRight 22s ease-in-out infinite;
        }

        .canvas-cine-light-cursor {
          left: var(--canvas-mx);
          top: var(--canvas-my);
          width: 29rem;
          height: 29rem;
          opacity: 0.22;
          background:
            radial-gradient(circle, rgba(var(--cream), 0.15), rgba(var(--gold), 0.055) 36%, transparent 73%);
          filter: blur(40px);
        }

        .canvas-cine-film {
          position: absolute;
          inset: 0;
          opacity: 0.1;
          background:
            linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.032) 50%, transparent 100%),
            linear-gradient(rgba(255,255,255,0.026) 1px, transparent 1px);
          background-size:
            100% 100%,
            100% 86px;
          mix-blend-mode: overlay;
          mask-image: radial-gradient(circle at 50% 38%, black 0%, black 42%, transparent 78%);
        }

        .canvas-cine-grain {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          mix-blend-mode: overlay;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px);
          background-size: 96px 96px;
          mask-image: radial-gradient(circle at 50% 40%, black 0%, black 44%, transparent 78%);
        }

        .canvas-cine-star {
          position: absolute;
          border-radius: 999px;
          background: rgba(var(--cream), 0.9);
          box-shadow:
            0 0 9px rgba(var(--cream), 0.4),
            0 0 24px rgba(var(--gold), 0.24);
          opacity: 0.3;
          animation: canvasStarPulse var(--star-duration) ease-in-out var(--star-delay) infinite;
        }

        .canvas-cine-streak {
          position: absolute;
          height: 1px;
          border-radius: 999px;
          transform: rotate(var(--streak-rotate)) translate3d(-22px, 0, 0) scaleX(0.4);
          transform-origin: center;
          opacity: 0;
          background:
            linear-gradient(90deg, transparent, rgba(var(--cream), 0.7), rgba(var(--gold), 0.35), transparent);
          box-shadow:
            0 0 16px rgba(var(--cream), 0.22),
            0 0 34px rgba(var(--gold), 0.15);
          animation: canvasStreakFly var(--streak-duration) ease-in-out var(--streak-delay) infinite;
        }

        .canvas-page-shell main h1 {
          display: block !important;
          width: 100% !important;
          max-width: 980px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          color: #f8f2e8 !important;
          font-size: clamp(56px, 7vw, 112px) !important;
          line-height: 0.92 !important;
          letter-spacing: -0.075em !important;
          text-align: center !important;
          text-wrap: balance;
          text-shadow:
            0 0 30px rgba(255,255,255,0.04),
            0 18px 70px rgba(215,176,106,0.08);
        }

        .canvas-page-shell main h1::after {
          content: "";
          display: block;
          width: 90px;
          height: 1px;
          margin: 24px auto 0 auto;
          background: linear-gradient(90deg, transparent, rgba(var(--gold), 0.9), transparent);
          opacity: 0.82;
        }

        .canvas-page-shell main p {
          max-width: 680px !important;
          margin-left: auto !important;
          margin-right: auto !important;
          color: rgba(245, 239, 230, 0.62) !important;
          text-align: center !important;
          line-height: 1.85 !important;
        }

        .canvas-page-shell main h1 + p,
        .canvas-page-shell main p:first-of-type {
          margin-top: 22px !important;
        }

        .canvas-page-shell main h1,
        .canvas-page-shell main h1 + p,
        .canvas-page-shell main p:first-of-type {
          transform: translateZ(0);
        }

        .canvas-premium-chip {
          position: relative !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important;
          min-height: 42px !important;
          border-radius: 999px !important;
          border-color: rgba(215, 176, 106, 0.2) !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.032), rgba(255,255,255,0.01)) !important;
          color: rgba(245, 239, 230, 0.72) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.035),
            0 18px 50px rgba(0,0,0,0.18) !important;
          backdrop-filter: blur(18px);
          transform: translateZ(0);
          transition:
            transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 260ms cubic-bezier(0.22, 1, 0.36, 1),
            color 260ms cubic-bezier(0.22, 1, 0.36, 1),
            background 260ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1) !important;
        }

        .canvas-premium-chip::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          transform: translateX(-120%);
          transition: transform 580ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .canvas-premium-chip:hover {
          transform: translate3d(0, -2px, 0) !important;
          border-color: rgba(215, 176, 106, 0.5) !important;
          color: #f7e1ac !important;
          background:
            linear-gradient(180deg, rgba(215,176,106,0.12), rgba(215,176,106,0.035)) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.065),
            0 20px 60px rgba(215,176,106,0.08) !important;
        }

        .canvas-premium-chip:hover::before {
          transform: translateX(120%);
        }

        .canvas-duplicate-chip {
          display: none !important;
        }

        .canvas-premium-card {
          --card-rx: 0deg;
          --card-ry: 0deg;
          --card-lift: 0px;
          --card-glow-x: 50%;
          --card-glow-y: 42%;

          position: relative !important;
          isolation: isolate !important;
          overflow: hidden !important;
          border-radius: 28px !important;
          border-color: rgba(215, 176, 106, 0.16) !important;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.014)) !important;
          box-shadow:
            0 24px 90px rgba(0,0,0,0.38),
            0 0 0 1px rgba(255,255,255,0.025),
            inset 0 1px 0 rgba(255,255,255,0.045) !important;
          transform:
            perspective(1200px)
            rotateX(var(--card-rx))
            rotateY(var(--card-ry))
            translate3d(0, var(--card-lift), 0) !important;
          transform-style: preserve-3d;
          transition:
            transform 520ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 360ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1) !important;
          will-change: transform;
        }

        .canvas-premium-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
          opacity: 0;
          background:
            radial-gradient(circle at var(--card-glow-x) var(--card-glow-y), rgba(255,232,178,0.22), transparent 34%),
            linear-gradient(135deg, rgba(255,255,255,0.08), transparent 28%, transparent 70%, rgba(215,176,106,0.08));
          transition: opacity 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .canvas-premium-card::after {
          content: "";
          position: absolute;
          inset: 1px;
          z-index: 3;
          pointer-events: none;
          border-radius: 27px;
          border: 1px solid rgba(255,255,255,0.035);
        }

        .canvas-premium-card:hover {
          border-color: rgba(215, 176, 106, 0.34) !important;
          box-shadow:
            0 34px 120px rgba(0,0,0,0.48),
            0 0 80px rgba(215,176,106,0.075),
            0 0 0 1px rgba(215,176,106,0.08),
            inset 0 1px 0 rgba(255,255,255,0.06) !important;
        }

        .canvas-premium-card:hover::before {
          opacity: 1;
        }

        .canvas-premium-card img {
          filter: saturate(0.96) brightness(0.76) contrast(1.08) !important;
          transform: scale(1.001) translateZ(0);
          transition:
            transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 520ms cubic-bezier(0.22, 1, 0.36, 1) !important;
          will-change: transform, filter;
        }

        .canvas-premium-card:hover img {
          filter: saturate(1.08) brightness(0.9) contrast(1.12) !important;
          transform: scale(1.055) translateZ(0);
        }

        @keyframes canvasOrbitBreathe {
          0%, 100% {
            opacity: 0.38;
            transform: translate3d(-50%, calc(-50% + var(--canvas-scroll) * 0.1), 0) scale(0.98);
          }
          50% {
            opacity: 0.64;
            transform: translate3d(-50%, calc(-50% + var(--canvas-scroll) * 0.1), 0) scale(1.026);
          }
        }

        @keyframes canvasLightLeft {
          0%, 100% {
            transform: translate3d(-50%, -50%, 0) scale(0.96);
            opacity: 0.2;
          }
          50% {
            transform: translate3d(-46%, -53%, 0) scale(1.12);
            opacity: 0.31;
          }
        }

        @keyframes canvasLightRight {
          0%, 100% {
            transform: translate3d(-50%, -50%, 0) scale(0.94);
            opacity: 0.16;
          }
          50% {
            transform: translate3d(-54%, -47%, 0) scale(1.1);
            opacity: 0.25;
          }
        }

        @keyframes canvasStarPulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(0.72);
          }
          45% {
            opacity: 0.58;
            transform: scale(1.08);
          }
          70% {
            opacity: 0.24;
            transform: scale(0.88);
          }
        }

        @keyframes canvasStreakFly {
          0%, 100% {
            opacity: 0;
            transform: rotate(var(--streak-rotate)) translate3d(-24px, 0, 0) scaleX(0.35);
          }
          18% {
            opacity: 0.48;
          }
          48% {
            opacity: 0.14;
            transform: rotate(var(--streak-rotate)) translate3d(54px, -16px, 0) scaleX(1);
          }
          68% {
            opacity: 0;
            transform: rotate(var(--streak-rotate)) translate3d(98px, -30px, 0) scaleX(0.55);
          }
        }

        @media (max-width: 900px) {
          .canvas-page-shell main {
            padding-top: 100px !important;
          }

          .canvas-page-shell main > * {
            width: min(100% - 28px, 1120px) !important;
          }

          .canvas-page-shell main h1 {
            font-size: clamp(42px, 14vw, 72px) !important;
            line-height: 0.95 !important;
          }

          .canvas-cine-orbit-main {
            width: 92vw;
            height: 92vw;
          }

          .canvas-cine-orbit-wide,
          .canvas-cine-orbit-slice {
            opacity: 0.1;
          }

          .canvas-cine-light-left {
            left: 18%;
            width: 28rem;
            height: 28rem;
          }

          .canvas-cine-light-right {
            left: 86%;
            width: 25rem;
            height: 25rem;
          }

          .canvas-premium-card {
            border-radius: 24px !important;
            transform: none !important;
          }

          .canvas-premium-card::after {
            border-radius: 23px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .canvas-cine-orbit-main,
          .canvas-cine-light-left,
          .canvas-cine-light-right,
          .canvas-cine-star,
          .canvas-cine-streak {
            animation: none !important;
          }

          .canvas-premium-card,
          .canvas-premium-card img,
          .canvas-premium-chip {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  )
}