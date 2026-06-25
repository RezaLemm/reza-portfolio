"use client"

import {useEffect, useRef} from "react"
import type {CSSProperties} from "react"

const particles = Array.from({length: 46}, (_, index) => {
  const id = index + 1
  const type = (index % 4) + 1
  const x = 3 + ((index * 17) % 94)
  const y = 10 + ((index * 29) % 78)
  const size = 0.9 + ((index * 7) % 24) / 10
  const direction = index % 2 === 0 ? 1 : -1
  const dx = direction * (16 + ((index * 5) % 34))
  const dy = -14 - ((index * 11) % 38)
  const delay = ((index * 0.41) % 5).toFixed(2) + "s"
  const duration = (10.5 + ((index * 0.73) % 8)).toFixed(2) + "s"

  return {id, type, x, y, size, dx, dy, delay, duration}
})

const streaks = Array.from({length: 9}, (_, index) => {
  const id = index + 1
  const x = 6 + ((index * 13) % 88)
  const y = 18 + ((index * 19) % 62)
  const width = 82 + ((index * 17) % 82)
  const rotate = -26 + ((index * 3) % 12)
  const delay = ((index * 0.78) % 6).toFixed(2) + "s"
  const duration = (8.5 + ((index * 0.92) % 5)).toFixed(2) + "s"

  return {id, x, y, width, rotate, delay, duration}
})

export default function GoldDustLayer() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduceMotion.matches) return

    let raf = 0

    const current = {
      x: window.innerWidth * 0.55,
      y: window.innerHeight * 0.42,
    }

    const target = {
      x: current.x,
      y: current.y,
    }

    const render = () => {
      current.x += (target.x - current.x) * 0.055
      current.y += (target.y - current.y) * 0.055

      root.style.setProperty("--dust-mx", current.x.toFixed(2) + "px")
      root.style.setProperty("--dust-my", current.y.toFixed(2) + "px")

      raf = window.requestAnimationFrame(render)
    }

    const onPointerMove = (event: PointerEvent) => {
      target.x = event.clientX
      target.y = event.clientY
    }

    window.addEventListener("pointermove", onPointerMove, {passive: true})
    raf = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onPointerMove)
    }
  }, [])

  return (
    <div ref={rootRef} className="gold-dust-layer" aria-hidden="true">
      <div className="gold-dust-veil gold-dust-veil-left" />
      <div className="gold-dust-veil gold-dust-veil-center" />
      <div className="gold-dust-veil gold-dust-veil-right" />
      <div className="gold-dust-cursor-glow" />

      {streaks.map((item) => (
        <span
          key={"streak-" + item.id}
          className="gold-dust-streak"
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

      {particles.map((item) => (
        <span
          key={item.id}
          className={"gold-dust-particle gold-dust-type-" + item.type}
          style={
            {
              left: item.x + "%",
              top: item.y + "%",
              width: item.size + "px",
              height: item.size + "px",
              "--dust-dx": item.dx + "px",
              "--dust-dy": item.dy + "px",
              "--dust-delay": item.delay,
              "--dust-duration": item.duration,
            } as CSSProperties
          }
        />
      ))}

      <style>{`
        /* data-dust-layer-fix */
        main > section:first-of-type {
          isolation: isolate;
        }

        main > section:first-of-type > *:not(.gold-dust-layer) {
          position: relative;
          z-index: 6;
        }

        main > section:first-of-type > *:first-child,
        main > section:first-of-type > *:last-child {
          position: relative;
          z-index: 8;
        }

        .gold-dust-layer {
          --dust-mx: 55vw;
          --dust-my: 42vh;
          --gold: 215, 176, 106;
          --gold-soft: 255, 232, 178;
          --gold-white: 255, 248, 228;
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
          mix-blend-mode: screen;
        }

        .gold-dust-veil {
          position: absolute;
          pointer-events: none;
          border-radius: 999px;
          transform: translate3d(-50%, -50%, 0);
          filter: blur(34px);
        }

        .gold-dust-veil-left {
          left: 18%;
          top: 43%;
          width: 39rem;
          height: 39rem;
          opacity: 0.24;
          background: radial-gradient(circle, rgba(var(--gold), 0.42), transparent 65%);
          animation: goldVeilLeft 14s ease-in-out infinite;
        }

        .gold-dust-veil-center {
          left: 50%;
          top: 42%;
          width: 32rem;
          height: 32rem;
          opacity: 0.18;
          background: radial-gradient(circle, rgba(var(--gold-white), 0.32), transparent 67%);
          animation: goldVeilCenter 16s ease-in-out infinite;
        }

        .gold-dust-veil-right {
          left: 78%;
          top: 42%;
          width: 36rem;
          height: 36rem;
          opacity: 0.22;
          background: radial-gradient(circle, rgba(var(--gold), 0.36), transparent 67%);
          animation: goldVeilRight 17s ease-in-out infinite;
        }

        .gold-dust-cursor-glow {
          position: absolute;
          left: var(--dust-mx);
          top: var(--dust-my);
          width: 25rem;
          height: 25rem;
          border-radius: 999px;
          transform: translate3d(-50%, -50%, 0);
          background:
            radial-gradient(circle, rgba(var(--gold-white), 0.12), rgba(var(--gold), 0.045) 34%, transparent 70%);
          filter: blur(22px);
          opacity: 0.38;
        }

        .gold-dust-particle {
          position: absolute;
          border-radius: 999px;
          background:
            radial-gradient(circle, rgba(var(--gold-white), 1) 0%, rgba(var(--gold-soft), 0.98) 38%, rgba(var(--gold), 0.82) 100%);
          box-shadow:
            0 0 8px rgba(var(--gold-white), 0.86),
            0 0 18px rgba(var(--gold-soft), 0.74),
            0 0 36px rgba(var(--gold), 0.4);
          opacity: 0.58;
          transform: translate3d(0, 0, 0) scale(0.78);
          animation:
            goldFloat var(--dust-duration) ease-in-out var(--dust-delay) infinite,
            goldBlink calc(var(--dust-duration) * 0.58) ease-in-out var(--dust-delay) infinite;
          will-change: transform, opacity;
        }

        .gold-dust-particle::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 16px;
          height: 1px;
          transform: translate3d(-50%, -50%, 0) rotate(26deg) scaleX(0);
          opacity: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.98), transparent);
          animation: goldSpark calc(var(--dust-duration) * 0.48) ease-in-out var(--dust-delay) infinite;
        }

        .gold-dust-type-1 {
          opacity: 0.48;
        }

        .gold-dust-type-2 {
          opacity: 0.68;
          box-shadow:
            0 0 9px rgba(var(--gold-white), 0.9),
            0 0 22px rgba(var(--gold-soft), 0.8),
            0 0 42px rgba(var(--gold), 0.44);
        }

        .gold-dust-type-3 {
          opacity: 0.82;
          box-shadow:
            0 0 12px rgba(var(--gold-white), 0.96),
            0 0 28px rgba(var(--gold-soft), 0.86),
            0 0 54px rgba(var(--gold), 0.5);
        }

        .gold-dust-type-4 {
          opacity: 0.95;
          background:
            radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(var(--gold-white),1) 26%, rgba(var(--gold-soft),0.98) 58%, rgba(var(--gold),0.88) 100%);
          box-shadow:
            0 0 14px rgba(255,255,255,0.98),
            0 0 34px rgba(var(--gold-white), 0.92),
            0 0 70px rgba(var(--gold), 0.58);
        }

        .gold-dust-streak {
          position: absolute;
          height: 1px;
          border-radius: 999px;
          opacity: 0;
          transform: rotate(var(--streak-rotate)) translate3d(-28px, 0, 0) scaleX(0.35);
          transform-origin: center;
          background:
            linear-gradient(90deg, transparent, rgba(var(--gold-white), 0.98), rgba(var(--gold-soft), 0.76), transparent);
          box-shadow:
            0 0 14px rgba(var(--gold-white), 0.58),
            0 0 30px rgba(var(--gold), 0.36);
          filter: blur(0.25px);
          animation: goldStreak var(--streak-duration) ease-in-out var(--streak-delay) infinite;
        }

        @keyframes goldFloat {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(0.72);
          }
          28% {
            transform: translate3d(calc(var(--dust-dx) * 0.45), calc(var(--dust-dy) * 0.5), 0) scale(0.98);
          }
          54% {
            transform: translate3d(var(--dust-dx), var(--dust-dy), 0) scale(1.18);
          }
          78% {
            transform: translate3d(calc(var(--dust-dx) * -0.25), calc(var(--dust-dy) * 0.35), 0) scale(0.92);
          }
        }

        @keyframes goldBlink {
          0%, 100% {
            opacity: 0.24;
          }
          22% {
            opacity: 0.38;
          }
          40% {
            opacity: 0.48;
          }
          62% {
            opacity: 1;
          }
          78% {
            opacity: 0.58;
          }
        }

        @keyframes goldSpark {
          0%, 72%, 100% {
            opacity: 0;
            transform: translate3d(-50%, -50%, 0) rotate(26deg) scaleX(0.3);
          }
          82% {
            opacity: 1;
            transform: translate3d(-50%, -50%, 0) rotate(26deg) scaleX(1.6);
          }
          88% {
            opacity: 0.22;
            transform: translate3d(-50%, -50%, 0) rotate(26deg) scaleX(0.82);
          }
        }

        @keyframes goldStreak {
          0%, 100% {
            opacity: 0;
            transform: rotate(var(--streak-rotate)) translate3d(-28px, 0, 0) scaleX(0.35);
          }
          20% {
            opacity: 0.72;
          }
          46% {
            opacity: 0.24;
            transform: rotate(var(--streak-rotate)) translate3d(42px, -12px, 0) scaleX(1);
          }
          66% {
            opacity: 0;
            transform: rotate(var(--streak-rotate)) translate3d(76px, -24px, 0) scaleX(0.55);
          }
        }

        @keyframes goldVeilLeft {
          0%, 100% {
            transform: translate3d(-50%, -50%, 0) scale(0.94);
            opacity: 0.25;
          }
          50% {
            transform: translate3d(-47%, -54%, 0) scale(1.12);
            opacity: 0.44;
          }
        }

        @keyframes goldVeilCenter {
          0%, 100% {
            transform: translate3d(-50%, -50%, 0) scale(0.96);
            opacity: 0.17;
          }
          50% {
            transform: translate3d(-51%, -48%, 0) scale(1.17);
            opacity: 0.24;
          }
        }

        @keyframes goldVeilRight {
          0%, 100% {
            transform: translate3d(-50%, -50%, 0) scale(0.94);
            opacity: 0.21;
          }
          50% {
            transform: translate3d(-54%, -47%, 0) scale(1.14);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  )
}