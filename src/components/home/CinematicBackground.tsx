"use client"

import {useEffect, useRef} from "react"
import type {CSSProperties} from "react"

const stars = Array.from({length: 34}, (_, index) => {
  const id = index + 1
  const x = 4 + ((index * 23) % 92)
  const y = 8 + ((index * 37) % 84)
  const size = 1 + ((index * 5) % 18) / 10
  const delay = ((index * 0.37) % 6).toFixed(2) + "s"
  const duration = (7 + ((index * 0.71) % 7)).toFixed(2) + "s"

  return {id, x, y, size, delay, duration}
})

const streaks = Array.from({length: 10}, (_, index) => {
  const id = index + 1
  const x = 5 + ((index * 17) % 90)
  const y = 12 + ((index * 29) % 72)
  const width = 70 + ((index * 19) % 105)
  const rotate = -28 + ((index * 7) % 18)
  const delay = ((index * 0.83) % 7).toFixed(2) + "s"
  const duration = (8 + ((index * 0.91) % 5)).toFixed(2) + "s"

  return {id, x, y, width, rotate, delay, duration}
})

export default function CinematicBackground() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduceMotion.matches) return

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

      root.style.setProperty("--mx", current.x.toFixed(2) + "px")
      root.style.setProperty("--my", current.y.toFixed(2) + "px")
      root.style.setProperty("--scroll", current.scroll.toFixed(2) + "px")

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
    <div ref={rootRef} className="cinematic-bg" aria-hidden="true">
      <div className="cinematic-base" />
      <div className="cinematic-vignette" />

      <div className="cinematic-orbit cinematic-orbit-scroll" />
      <div className="cinematic-orbit cinematic-orbit-ghost cinematic-orbit-ghost-one" />
      <div className="cinematic-orbit cinematic-orbit-ghost cinematic-orbit-ghost-two" />

      <div className="cinematic-light cinematic-light-left" />
      <div className="cinematic-light cinematic-light-right" />
      <div className="cinematic-light cinematic-light-cursor" />

      <div className="cinematic-grain" />

      {streaks.map((item) => (
        <span
          key={"streak-" + item.id}
          className="cinematic-streak"
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
          key={item.id}
          className="cinematic-star"
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

      <style>{`
        .cinematic-bg {
          --mx: 58vw;
          --my: 42vh;
          --scroll: 0px;
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

        .cinematic-base {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 24% 42%, rgba(var(--gold), 0.16), transparent 31%),
            radial-gradient(circle at 74% 39%, rgba(var(--gold), 0.11), transparent 30%),
            radial-gradient(circle at 50% 106%, rgba(var(--gold), 0.08), transparent 38%),
            linear-gradient(180deg, #020201 0%, #080604 44%, #020201 100%);
        }

        .cinematic-vignette {
          position: absolute;
          inset: -2px;
          background:
            radial-gradient(circle at 50% 43%, transparent 0%, transparent 38%, rgba(0,0,0,0.72) 78%, rgba(0,0,0,0.96) 100%),
            linear-gradient(90deg, rgba(0,0,0,0.9), transparent 24%, transparent 74%, rgba(0,0,0,0.9));
        }

        .cinematic-orbit {
          position: absolute;
          left: 50%;
          top: 43%;
          border-radius: 999px;
          transform: translate3d(-50%, calc(-50% + var(--scroll) * 0.12), 0);
          border: 1px solid rgba(var(--gold), 0.095);
          box-shadow:
            inset 0 0 38px rgba(var(--gold), 0.04),
            0 0 70px rgba(var(--gold), 0.035);
          opacity: 0.62;
          filter: blur(0.12px);
        }

        .cinematic-orbit-scroll {
          width: min(62vw, 920px);
          height: min(62vw, 920px);
          background:
            radial-gradient(circle, transparent 0%, transparent 37%, rgba(var(--gold), 0.045) 37.35%, transparent 37.8%),
            radial-gradient(circle, transparent 0%, transparent 49%, rgba(var(--gold), 0.052) 49.25%, transparent 49.65%),
            radial-gradient(circle, transparent 0%, transparent 63%, rgba(var(--gold), 0.04) 63.25%, transparent 63.7%);
          animation: orbitBreathe 16s ease-in-out infinite;
        }

        .cinematic-orbit-ghost {
          border-color: rgba(var(--gold), 0.045);
          box-shadow: none;
          opacity: 0.28;
          transform: translate3d(-50%, calc(-50% + var(--scroll) * 0.08), 0) rotate(-16deg);
        }

        .cinematic-orbit-ghost-one {
          width: min(78vw, 1160px);
          height: min(42vw, 620px);
          left: 49%;
          top: 44%;
        }

        .cinematic-orbit-ghost-two {
          width: min(46vw, 700px);
          height: min(24vw, 370px);
          left: 61%;
          top: 44%;
          transform: translate3d(-50%, calc(-50% + var(--scroll) * 0.05), 0) rotate(11deg);
          opacity: 0.18;
        }

        .cinematic-light {
          position: absolute;
          border-radius: 999px;
          transform: translate3d(-50%, -50%, 0);
          filter: blur(46px);
          mix-blend-mode: screen;
        }

        .cinematic-light-left {
          left: 20%;
          top: 48%;
          width: 38rem;
          height: 38rem;
          opacity: 0.28;
          background: radial-gradient(circle, rgba(var(--gold), 0.28), rgba(var(--gold), 0.08) 36%, transparent 68%);
          animation: lightDriftLeft 18s ease-in-out infinite;
        }

        .cinematic-light-right {
          left: 83%;
          top: 40%;
          width: 34rem;
          height: 34rem;
          opacity: 0.22;
          background: radial-gradient(circle, rgba(var(--cream), 0.18), rgba(var(--gold), 0.07) 36%, transparent 70%);
          animation: lightDriftRight 20s ease-in-out infinite;
        }

        .cinematic-light-cursor {
          left: var(--mx);
          top: var(--my);
          width: 28rem;
          height: 28rem;
          opacity: 0.22;
          background: radial-gradient(circle, rgba(var(--cream), 0.16), rgba(var(--gold), 0.06) 35%, transparent 72%);
          filter: blur(38px);
        }

        .cinematic-grain {
          position: absolute;
          inset: 0;
          opacity: 0.13;
          mix-blend-mode: overlay;
          background-image:
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
          background-size: 92px 92px;
          mask-image: radial-gradient(circle at 50% 45%, black 0%, black 42%, transparent 78%);
        }

        .cinematic-star {
          position: absolute;
          border-radius: 999px;
          background: rgba(var(--cream), 0.88);
          box-shadow:
            0 0 8px rgba(var(--cream), 0.42),
            0 0 22px rgba(var(--gold), 0.24);
          opacity: 0.32;
          animation: starPulse var(--star-duration) ease-in-out var(--star-delay) infinite;
        }

        .cinematic-streak {
          position: absolute;
          height: 1px;
          border-radius: 999px;
          transform: rotate(var(--streak-rotate)) translate3d(-20px, 0, 0) scaleX(0.45);
          transform-origin: center;
          opacity: 0;
          background: linear-gradient(90deg, transparent, rgba(var(--cream), 0.72), rgba(var(--gold), 0.34), transparent);
          box-shadow:
            0 0 16px rgba(var(--cream), 0.2),
            0 0 32px rgba(var(--gold), 0.16);
          animation: streakFly var(--streak-duration) ease-in-out var(--streak-delay) infinite;
        }

        @keyframes orbitBreathe {
          0%, 100% {
            opacity: 0.45;
            transform: translate3d(-50%, calc(-50% + var(--scroll) * 0.12), 0) scale(0.98);
          }
          50% {
            opacity: 0.72;
            transform: translate3d(-50%, calc(-50% + var(--scroll) * 0.12), 0) scale(1.025);
          }
        }

        @keyframes lightDriftLeft {
          0%, 100% {
            transform: translate3d(-50%, -50%, 0) scale(0.96);
            opacity: 0.22;
          }
          50% {
            transform: translate3d(-46%, -53%, 0) scale(1.12);
            opacity: 0.32;
          }
        }

        @keyframes lightDriftRight {
          0%, 100% {
            transform: translate3d(-50%, -50%, 0) scale(0.94);
            opacity: 0.16;
          }
          50% {
            transform: translate3d(-54%, -47%, 0) scale(1.1);
            opacity: 0.26;
          }
        }

        @keyframes starPulse {
          0%, 100% {
            opacity: 0.12;
            transform: scale(0.72);
          }
          45% {
            opacity: 0.62;
            transform: scale(1.08);
          }
          70% {
            opacity: 0.28;
            transform: scale(0.88);
          }
        }

        @keyframes streakFly {
          0%, 100% {
            opacity: 0;
            transform: rotate(var(--streak-rotate)) translate3d(-24px, 0, 0) scaleX(0.35);
          }
          18% {
            opacity: 0.5;
          }
          48% {
            opacity: 0.16;
            transform: rotate(var(--streak-rotate)) translate3d(54px, -16px, 0) scaleX(1);
          }
          68% {
            opacity: 0;
            transform: rotate(var(--streak-rotate)) translate3d(98px, -30px, 0) scaleX(0.55);
          }
        }

        @media (max-width: 900px) {
          .cinematic-orbit-scroll {
            width: 92vw;
            height: 92vw;
          }

          .cinematic-orbit-ghost-one,
          .cinematic-orbit-ghost-two {
            opacity: 0.12;
          }

          .cinematic-light-left {
            left: 18%;
            width: 28rem;
            height: 28rem;
          }

          .cinematic-light-right {
            left: 86%;
            width: 25rem;
            height: 25rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cinematic-orbit-scroll,
          .cinematic-light-left,
          .cinematic-light-right,
          .cinematic-star,
          .cinematic-streak {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}