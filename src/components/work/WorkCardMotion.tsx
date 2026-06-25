"use client"

import {useEffect, useRef} from "react"

type TiltState = {
  card: HTMLElement | null
  rx: number
  ry: number
  trx: number
  try: number
  lift: number
  targetLift: number
  scale: number
  targetScale: number
  glow: number
  targetGlow: number
  x: number
  y: number
  tx: number
  ty: number
  raf: number | null
  lastTime: number
  settling: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function damp(current: number, target: number, speed: number, delta: number) {
  return current + (target - current) * (1 - Math.exp(-speed * delta))
}

function close(a: number, b: number, threshold: number) {
  return Math.abs(a - b) < threshold
}

export default function WorkCardMotion() {
  const stateRef = useRef<TiltState>({
    card: null,
    rx: 0,
    ry: 0,
    trx: 0,
    try: 0,
    lift: 0,
    targetLift: 0,
    scale: 1,
    targetScale: 1,
    glow: 0,
    targetGlow: 0,
    x: 50,
    y: 38,
    tx: 50,
    ty: 38,
    raf: null,
    lastTime: 0,
    settling: false,
  })

  useEffect(() => {
    const root =
      document.querySelector(".work-cinematic-shell") ||
      document.querySelector(".work-page") ||
      document.body

    if (!root) return

    const state = stateRef.current
    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches

    const getCards = () => {
      return Array.from(
        root.querySelectorAll<HTMLElement>(
          ".work-card, .work-home-card, [data-work-home-card='true'], a[href^='/work/']",
        ),
      ).filter((element) => {
        if (element.closest("header")) return false
        if (element.closest(".work-filter-cloud")) return false
        if (element.closest(".work-home-filter-cloud")) return false
        if (!element.querySelector("img")) return false

        return true
      })
    }

    const writeTransform = (card: HTMLElement) => {
      const transformValue =
        "perspective(1200px) " +
        "translate3d(0, " + state.lift.toFixed(3) + "px, 0) " +
        "rotateX(" + state.rx.toFixed(3) + "deg) " +
        "rotateY(" + state.ry.toFixed(3) + "deg) " +
        "scale(" + state.scale.toFixed(5) + ")"

      card.style.setProperty("transform", transformValue, "important")
      card.style.setProperty("--real-edge-x", state.x.toFixed(2) + "%")
      card.style.setProperty("--real-edge-y", state.y.toFixed(2) + "%")
      card.style.setProperty("--real-edge-glow", state.glow.toFixed(4))
    }

    const frame = (time: number) => {
      const delta = state.lastTime ? Math.min(40, time - state.lastTime) : 16.67
      state.lastTime = time

      state.rx = damp(state.rx, state.trx, 0.016, delta)
      state.ry = damp(state.ry, state.try, 0.016, delta)
      state.lift = damp(state.lift, state.targetLift, 0.015, delta)
      state.scale = damp(state.scale, state.targetScale, 0.014, delta)
      state.glow = damp(state.glow, state.targetGlow, 0.015, delta)
      state.x = damp(state.x, state.tx, 0.016, delta)
      state.y = damp(state.y, state.ty, 0.016, delta)

      if (state.card) {
        writeTransform(state.card)
      }

      const stillMoving =
        !close(state.rx, state.trx, 0.012) ||
        !close(state.ry, state.try, 0.012) ||
        !close(state.lift, state.targetLift, 0.02) ||
        !close(state.scale, state.targetScale, 0.0002) ||
        !close(state.glow, state.targetGlow, 0.0025) ||
        !close(state.x, state.tx, 0.03) ||
        !close(state.y, state.ty, 0.03)

      if (stillMoving) {
        state.raf = window.requestAnimationFrame(frame)
        return
      }

      if (state.settling && state.card) {
        state.card.classList.remove("is-real-edge-tilted")
        state.card.classList.remove("is-real-edge-pressed")

        state.card.style.removeProperty("transform")
        state.card.style.setProperty("--real-edge-glow", "0")
        state.card.style.setProperty("--real-edge-x", "50%")
        state.card.style.setProperty("--real-edge-y", "38%")

        state.card = null
        state.settling = false
      }

      state.raf = null
      state.lastTime = 0
    }

    const start = () => {
      if (state.raf) return
      state.raf = window.requestAnimationFrame(frame)
    }

    const resetOldCard = (card: HTMLElement | null) => {
      if (!card) return

      card.classList.remove("is-real-edge-tilted")
      card.classList.remove("is-real-edge-pressed")
      card.classList.remove("is-card-edge-active")
      card.classList.remove("is-card-edge-pressed")
      card.classList.remove("is-work-card-entering")
      card.classList.remove("is-work-card-entered")

      card.style.removeProperty("transform")
      card.style.setProperty("--real-edge-glow", "0")
      card.style.setProperty("--real-edge-x", "50%")
      card.style.setProperty("--real-edge-y", "38%")
    }

    const enhanceCards = () => {
      getCards().forEach((card, index) => {
        if (card.dataset.realEdgeTiltReady === "true") return

        card.dataset.realEdgeTiltReady = "true"
        card.dataset.workMotionCard = "true"

        card.classList.add("work-real-edge-card")

        card.style.setProperty("--real-edge-index", String(index))
        card.style.setProperty("--real-edge-x", "50%")
        card.style.setProperty("--real-edge-y", "38%")
        card.style.setProperty("--real-edge-glow", "0")
      })
    }

    const activate = (card: HTMLElement, event: PointerEvent) => {
      if (!supportsHover) return

      if (state.card && state.card !== card) {
        resetOldCard(state.card)
      }

      state.card = card
      state.settling = false

      card.classList.add("is-real-edge-tilted")

      const rect = card.getBoundingClientRect()
      const px = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100)
      const py = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100)

      const dx = (px - 50) / 50
      const dy = (py - 50) / 50
      const edgeStrength = clamp(Math.max(Math.abs(dx), Math.abs(dy)), 0.08, 0.82)

      state.tx = px
      state.ty = py

      state.trx = clamp(dy * 4.4 * edgeStrength, -3.9, 3.9)
      state.try = clamp(-dx * 5.2 * edgeStrength, -4.6, 4.6)

      state.targetLift = -3.2
      state.targetScale = 1.0045
      state.targetGlow = 0.52

      start()
    }

    const deactivate = () => {
      if (!state.card) return

      state.trx = 0
      state.try = 0
      state.targetLift = 0
      state.targetScale = 1
      state.targetGlow = 0
      state.tx = 50
      state.ty = 38
      state.settling = true

      state.card.classList.remove("is-real-edge-pressed")

      start()
    }

    const onPointerMove = (event: PointerEvent) => {
      const target = event.target as Element | null
      const card = target?.closest("[data-real-edge-tilt-ready='true']") as HTMLElement | null

      if (!card) {
        deactivate()
        return
      }

      activate(card, event)
    }

    const onPointerLeave = () => {
      deactivate()
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null
      const card = target?.closest("[data-real-edge-tilt-ready='true']") as HTMLElement | null

      if (!card) return

      card.classList.add("is-real-edge-pressed")

      state.targetLift = -1.4
      state.targetScale = 1.0015
      state.targetGlow = 0.38

      start()
    }

    const onPointerUp = () => {
      root.querySelectorAll(".is-real-edge-pressed").forEach((element) => {
        element.classList.remove("is-real-edge-pressed")
      })

      if (!state.card) return

      state.targetLift = -3.2
      state.targetScale = 1.0045
      state.targetGlow = 0.52

      start()
    }

    enhanceCards()

    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(enhanceCards)
    })

    observer.observe(root, {
      childList: true,
      subtree: true,
    })

    root.addEventListener("pointermove", onPointerMove as EventListener, {passive: true})
    root.addEventListener("pointerleave", onPointerLeave)
    root.addEventListener("pointerdown", onPointerDown as EventListener, {passive: true})
    window.addEventListener("pointerup", onPointerUp)

    return () => {
      if (state.raf) {
        window.cancelAnimationFrame(state.raf)
      }

      observer.disconnect()

      root.removeEventListener("pointermove", onPointerMove as EventListener)
      root.removeEventListener("pointerleave", onPointerLeave)
      root.removeEventListener("pointerdown", onPointerDown as EventListener)
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [])

  return (
    <style jsx global>{`
      /*
        Real Edge Tilt V8 — Softer Cinematic
        واکنش کمتر، حرکت نرم‌تر، حس سینمایی‌تر.
      */

      .work-grid,
      .work-home-grid {
        perspective: 1250px !important;
        transform-style: preserve-3d !important;
      }

      .work-real-edge-card {
        --real-edge-x: 50%;
        --real-edge-y: 38%;
        --real-edge-glow: 0;
        --real-edge-index: 0;

        transform-style: preserve-3d !important;
        transform-origin: center center !important;
        backface-visibility: hidden !important;
        will-change: transform !important;

        transition:
          border-color 360ms cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1),
          background 420ms cubic-bezier(0.22, 1, 0.36, 1),
          opacity 260ms cubic-bezier(0.22, 1, 0.36, 1) !important;
      }

      .work-real-edge-card.is-real-edge-tilted {
        border-color: rgba(215, 176, 106, 0.32) !important;

        box-shadow:
          0 30px 78px rgba(0, 0, 0, 0.46),
          0 0 30px rgba(215, 176, 106, 0.052),
          0 0 0 1px rgba(215, 176, 106, 0.075),
          inset 0 1px 0 rgba(255, 255, 255, 0.065) !important;
      }

      .work-real-edge-card::before {
        opacity: var(--real-edge-glow) !important;

        background:
          radial-gradient(
            circle at var(--real-edge-x) var(--real-edge-y),
            rgba(255, 238, 204, 0.13),
            rgba(215, 176, 106, 0.045) 18%,
            transparent 46%
          ),
          linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.02),
            transparent 36%,
            rgba(0, 0, 0, 0.035) 100%
          ) !important;

        transition: opacity 360ms cubic-bezier(0.22, 1, 0.36, 1) !important;
      }

      .work-real-edge-card img {
        transform: translate3d(0, 0, 16px) scale(1.012) !important;
        transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1) !important;
        backface-visibility: hidden !important;
      }

      .work-real-edge-card.is-real-edge-tilted img {
        transform: translate3d(0, 0, 20px) scale(1.022) !important;
      }

      @media (hover: none) {
        .work-real-edge-card,
        .work-real-edge-card:hover {
          transform:
            perspective(1200px)
            translate3d(0, 0, 0)
            rotateX(0deg)
            rotateY(0deg)
            scale(1) !important;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .work-real-edge-card,
        .work-real-edge-card * {
          transition: none !important;
          animation: none !important;
        }
      }
    `}</style>
  )
}