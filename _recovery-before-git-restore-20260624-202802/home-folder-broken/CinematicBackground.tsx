"use client"

import {motion, useReducedMotion} from "framer-motion"
import {useEffect, useMemo, useRef, useState} from "react"
import type {CSSProperties} from "react"

type Point = {
  x: number
  y: number
}

export default function CinematicBackground() {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement | null>(null)
  const pointerRef = useRef<Point>({x: 0, y: 0})
  const haloRef = useRef<Point>({x: 0, y: 0})
  const dustRef = useRef<Point>({x: 0, y: 0})
  const rafRef = useRef<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const goldDust = useMemo(
    () =>
      Array.from({length: 230}, (_, index) => {
        const hero = index % 22 === 0
        const medium = index % 7 === 0
        const fine = !hero && !medium

        return {
          id: index,
          left: `${2 + ((index * 37) % 96)}%`,
          top: `${4 + ((index * 59) % 88)}%`,
          size: hero ? "3.7px" : medium ? "2.1px" : "1.05px",
          opacity: hero ? 0.88 : medium ? 0.56 : 0.33,
          delay: (index % 34) * 0.07,
          duration: fine ? 6.8 + (index % 7) * 0.42 : 5.4 + (index % 8) * 0.46,
          drift: hero ? 30 : medium ? 19 : 11,
          glow: hero
            ? "0 0 42px rgba(244,205,132,0.9)"
            : medium
              ? "0 0 32px rgba(215,176,106,0.72)"
              : "0 0 20px rgba(215,176,106,0.54)",
        }
      }),
    []
  )

  const cursorDust = useMemo(
    () =>
      Array.from({length: 30}, (_, index) => ({
        id: index,
        angle: (index / 30) * Math.PI * 2,
        distance: 34 + (index % 8) * 15,
        size: index % 5 === 0 ? "2.6px" : "1.2px",
        delay: index * 0.045,
      })),
    []
  )

  useEffect(() => {
    const element = rootRef.current

    if (!element) return

    const writeVars = () => {
      element.style.setProperty("--mx", `${pointerRef.current.x}px`)
      element.style.setProperty("--my", `${pointerRef.current.y}px`)
      element.style.setProperty("--hx", `${haloRef.current.x}px`)
      element.style.setProperty("--hy", `${haloRef.current.y}px`)
      element.style.setProperty("--dx", `${dustRef.current.x}px`)
      element.style.setProperty("--dy", `${dustRef.current.y}px`)
    }

    const setInitialPosition = () => {
      const initial = {
        x: Math.round(window.innerWidth * 0.52),
        y: Math.round(window.innerHeight * 0.4),
      }

      pointerRef.current = initial
      haloRef.current = initial
      dustRef.current = initial
      writeVars()
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: Math.round(event.clientX),
        y: Math.round(event.clientY),
      }

      element.style.setProperty("--mx", `${pointerRef.current.x}px`)
      element.style.setProperty("--my", `${pointerRef.current.y}px`)
    }

    const frame = () => {
      haloRef.current = {
        x: haloRef.current.x + (pointerRef.current.x - haloRef.current.x) * 0.105,
        y: haloRef.current.y + (pointerRef.current.y - haloRef.current.y) * 0.105,
      }

      dustRef.current = {
        x: dustRef.current.x + (haloRef.current.x - dustRef.current.x) * 0.055,
        y: dustRef.current.y + (haloRef.current.y - dustRef.current.y) * 0.055,
      }

      writeVars()
      rafRef.current = window.requestAnimationFrame(frame)
    }

    setInitialPosition()
    window.addEventListener("pointermove", handlePointerMove, {passive: true})
    window.addEventListener("resize", setInitialPosition)
    rafRef.current = window.requestAnimationFrame(frame)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("resize", setInitialPosition)

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const showMotion = mounted && !reduceMotion

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#010101]"
      style={
        {
          "--mx": "52vw",
          "--my": "40vh",
          "--hx": "52vw",
          "--hy": "40vh",
          "--dx": "52vw",
          "--dy": "40vh",
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(166,98,24,0.3)_0%,rgba(79,49,20,0.2)_25%,rgba(10,10,9,0.6)_55%,rgba(1,1,1,0.98)_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_19%_39%,rgba(255,181,73,0.27),transparent_31%),radial-gradient(circle_at_47%_46%,rgba(255,226,165,0.18),transparent_22%),radial-gradient(circle_at_72%_34%,rgba(255,239,205,0.1),transparent_24%),radial-gradient(circle_at_90%_62%,rgba(70,35,13,0.34),transparent_39%),linear-gradient(180deg,#050505_0%,#080706_43%,#010101_100%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--hx)_var(--hy),rgba(255,224,162,0.2),transparent_21%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_43%,rgba(0,0,0,0.52)_77%,rgba(0,0,0,0.96)_100%)]" />

      <div
        className="absolute left-0 top-0 h-[7rem] w-[7rem] rounded-full bg-[radial-gradient(circle,rgba(255,249,235,0.96)_0%,rgba(255,217,145,0.5)_18%,rgba(215,176,106,0.17)_46%,transparent_72%)] blur-lg mix-blend-screen will-change-transform"
        style={{transform: "translate3d(calc(var(--mx) - 3.5rem), calc(var(--my) - 3.5rem), 0)"}}
      />

      <div
        className="absolute left-0 top-0 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(255,232,185,0.18)_0%,rgba(215,176,106,0.12)_31%,rgba(215,176,106,0.04)_57%,transparent_74%)] blur-2xl will-change-transform"
        style={{transform: "translate3d(calc(var(--hx) - 21rem), calc(var(--hy) - 21rem), 0)"}}
      />

      <div
        className="absolute left-0 top-0 h-[27rem] w-[27rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,rgba(215,176,106,0.12)_34%,transparent_72%)] blur-xl will-change-transform"
        style={{transform: "translate3d(calc(var(--dx) - 13.5rem), calc(var(--dy) - 13.5rem), 0)"}}
      />

      {showMotion &&
        cursorDust.map((item) => (
          <motion.span
            key={item.id}
            className="absolute left-0 top-0 rounded-full bg-[#ffe2a4] shadow-[0_0_28px_rgba(215,176,106,0.8)] will-change-transform"
            style={{
              width: item.size,
              height: item.size,
              transform: `translate3d(calc(var(--dx) + ${Math.cos(item.angle) * item.distance}px), calc(var(--dy) + ${Math.sin(item.angle) * item.distance}px), 0)`,
            }}
            initial={{opacity: 0}}
            animate={{
              opacity: [0.14, 0.82, 0.2],
              scale: [0.7, 1.35, 0.82],
            }}
            transition={{
              duration: 3.1,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      <motion.div
        className="absolute left-[1%] top-[2%] h-[42rem] w-[42rem] rounded-full bg-[#d7a14c]/16 blur-[118px]"
        animate={showMotion ? {x: [0, 36, -18, 0], y: [0, 24, 48, 0], scale: [1, 1.08, 0.98, 1]} : undefined}
        transition={{duration: 20, repeat: Infinity, ease: "easeInOut"}}
      />

      <motion.div
        className="absolute right-[2%] top-[23%] h-[31rem] w-[31rem] rounded-full bg-[#3b1d0a]/34 blur-[120px]"
        animate={showMotion ? {x: [0, -28, 18, 0], y: [0, 34, -14, 0], scale: [1, 0.96, 1.1, 1]} : undefined}
        transition={{duration: 22, repeat: Infinity, ease: "easeInOut"}}
      />

      <motion.div
        className="absolute bottom-[-15%] left-1/2 h-[35rem] w-[72rem] -translate-x-1/2 rounded-[999px] bg-[#d7b06a]/14 blur-[106px]"
        animate={showMotion ? {scaleX: [1, 1.1, 0.98, 1], opacity: [0.44, 0.7, 0.52, 0.44]} : undefined}
        transition={{duration: 16, repeat: Infinity, ease: "easeInOut"}}
      />

      <div
        className="absolute left-1/2 top-[42%] h-[115vmin] w-[115vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.24]"
        style={{
          background:
            "repeating-radial-gradient(ellipse at center, rgba(215,176,106,0.26) 0 1px, transparent 1px 58px)",
          maskImage: "radial-gradient(ellipse at center, black 0%, black 45%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, black 45%, transparent 72%)",
        }}
      />

      <div
        className="absolute left-[50%] top-[42%] h-[92vmin] w-[130vmin] -translate-x-1/2 -translate-y-1/2 rotate-[-13deg] rounded-full border border-[#d7b06a]/12"
        style={{
          maskImage: "linear-gradient(110deg, transparent 0%, black 22%, black 72%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(110deg, transparent 0%, black 22%, black 72%, transparent 100%)",
        }}
      />

      <div
        className="absolute left-[54%] top-[43%] h-[72vmin] w-[112vmin] -translate-x-1/2 -translate-y-1/2 rotate-[18deg] rounded-full border border-white/[0.055]"
        style={{
          maskImage: "linear-gradient(105deg, transparent 0%, black 26%, black 68%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(105deg, transparent 0%, black 26%, black 68%, transparent 100%)",
        }}
      />

      <motion.div
        className="absolute left-[-20%] top-[18%] h-[22rem] w-[140vw] -rotate-[16deg] bg-[linear-gradient(90deg,transparent,rgba(215,176,106,0.18),rgba(255,242,210,0.22),rgba(215,176,106,0.12),transparent)] blur-2xl"
        animate={showMotion ? {x: ["-8%", "10%", "-8%"], opacity: [0.26, 0.68, 0.26]} : undefined}
        transition={{duration: 13, repeat: Infinity, ease: "easeInOut"}}
      />

      <motion.div
        className="absolute right-[-24%] top-[35%] h-[18rem] w-[120vw] rotate-[14deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.04),rgba(215,176,106,0.14),transparent)] blur-2xl"
        animate={showMotion ? {x: ["8%", "-8%", "8%"], opacity: [0.13, 0.42, 0.13]} : undefined}
        transition={{duration: 16, repeat: Infinity, ease: "easeInOut"}}
      />

      <div className="absolute inset-x-0 bottom-[-28vh] h-[64vh] opacity-[0.13]">
        <div
          className="h-full w-full"
          style={{
            background:
              "repeating-radial-gradient(ellipse at 50% 100%, rgba(215,176,106,0.38) 0 1px, transparent 1px 48px)",
            transform: "perspective(720px) rotateX(64deg) scaleX(1.35)",
            transformOrigin: "bottom center",
            maskImage: "linear-gradient(to top, black 0%, black 35%, transparent 80%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, black 35%, transparent 80%)",
          }}
        />
      </div>

      {showMotion &&
        goldDust.map((item) => (
          <motion.span
            key={item.id}
            className="absolute rounded-full bg-[#f8d88d]"
            style={{
              left: item.left,
              top: item.top,
              width: item.size,
              height: item.size,
              boxShadow: item.glow,
            }}
            initial={{opacity: 0, scale: 0.65}}
            animate={{
              opacity: [0, item.opacity, item.opacity * 0.58, 0],
              scale: [0.7, 1.38, 0.92, 0.7],
              y: [-item.drift, item.drift, -item.drift],
              x: [0, item.drift * 0.36, 0],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 30% 40%, rgba(255,255,255,0.62) 0 0.5px, transparent 0.5px 3px)",
        }}
      />

      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black via-black/64 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/74 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-[20vw] bg-gradient-to-r from-black/66 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[20vw] bg-gradient-to-l from-black/95 to-transparent" />
    </div>
  )
}