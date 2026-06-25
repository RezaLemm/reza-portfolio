"use client"

import {useEffect} from "react"

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function lerp(current: number, target: number, speed: number) {
  return current + (target - current) * speed
}

function easeOut(value: number) {
  const v = clamp(value, 0, 1)
  return 1 - Math.pow(1 - v, 3)
}

function rectArea(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return rect.width * rect.height
}

function hasHeroCopy(element: HTMLElement) {
  const text = element.textContent || ""

  return (
    text.includes("Visual Worlds") ||
    text.includes("Built to Last") ||
    text.includes("جهان") ||
    text.includes("ماندگار") ||
    text.includes("بصری")
  )
}

export default function HeroBoxMagneticTilt() {
  useEffect(() => {
    const hero = document.querySelector("main > section:first-of-type") as HTMLElement | null
    if (!hero) return

    const heroChildren = Array.from(hero.children).filter(
      (item): item is HTMLElement => item instanceof HTMLElement
    )

    const visualColumn = heroChildren[heroChildren.length - 1]
    if (!visualColumn) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduceMotion.matches) return

    let panel: HTMLElement | null = null
    let surface: HTMLElement | null = null
    let raf = 0
    let retryTimer = 0
    let active = false

    const current = {
      rx: 0,
      ry: 0,
      tx: 0,
      ty: 0,
      scale: 1,
      glowX: 50,
      glowY: 45,
      edge: 0,
    }

    const target = {
      rx: 0,
      ry: 0,
      tx: 0,
      ty: 0,
      scale: 1,
      glowX: 50,
      glowY: 45,
      edge: 0,
    }

    const clearOld = () => {
      visualColumn.querySelectorAll<HTMLElement>("[data-hero-panel-tilt]").forEach((item) => {
        delete item.dataset.heroPanelTilt
        delete item.dataset.heroPanelTiltState
        item.style.transform = ""
        item.style.transformOrigin = ""
      })

      visualColumn.querySelectorAll<HTMLElement>("[data-hero-panel-hit-area]").forEach((item) => {
        item.remove()
      })
    }

    const findPanel = () => {
      clearOld()

      const visualRect = visualColumn.getBoundingClientRect()
      const all = Array.from(visualColumn.querySelectorAll<HTMLElement>("*"))

      const candidates = all
        .filter((element) => {
          const rect = element.getBoundingClientRect()
          const style = window.getComputedStyle(element)
          const radius =
            parseFloat(style.borderTopLeftRadius || "0") +
            parseFloat(style.borderTopRightRadius || "0") +
            parseFloat(style.borderBottomLeftRadius || "0") +
            parseFloat(style.borderBottomRightRadius || "0")

          const containsHero = hasHeroCopy(element)

          const isLarge =
            rect.width >= visualRect.width * 0.48 &&
            rect.height >= visualRect.height * 0.48

          const isNotWholeColumn =
            rect.width <= visualRect.width * 0.98 &&
            rect.height <= visualRect.height * 0.98

          const shape =
            rect.width / Math.max(rect.height, 1) > 0.72 &&
            rect.width / Math.max(rect.height, 1) < 1.55

          const visible =
            rect.width > 320 &&
            rect.height > 280 &&
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number(style.opacity || "1") > 0.1

          return containsHero && isLarge && isNotWholeColumn && shape && visible && radius > 20
        })
        .sort((a, b) => rectArea(b) - rectArea(a))

      if (candidates[0]) return candidates[0]

      const fallback = all
        .filter((element) => {
          const rect = element.getBoundingClientRect()
          const style = window.getComputedStyle(element)

          return (
            rect.width >= visualRect.width * 0.52 &&
            rect.height >= visualRect.height * 0.5 &&
            rect.width <= visualRect.width * 0.98 &&
            rect.height <= visualRect.height * 0.98 &&
            style.display !== "none" &&
            style.visibility !== "hidden"
          )
        })
        .sort((a, b) => rectArea(b) - rectArea(a))

      return fallback[0] || null
    }

    const createSurface = () => {
      if (!panel) return null

      const hitArea = document.createElement("div")
      hitArea.dataset.heroPanelHitArea = "true"

      Object.assign(hitArea.style, {
        position: "absolute",
        inset: "0",
        zIndex: "30",
        pointerEvents: "auto",
        background: "transparent",
        borderRadius: "inherit",
      })

      panel.appendChild(hitArea)

      return hitArea
    }

    const render = () => {
      if (!panel) return

      const speed = active ? 0.19 : 0.11

      current.rx = lerp(current.rx, target.rx, speed)
      current.ry = lerp(current.ry, target.ry, speed)
      current.tx = lerp(current.tx, target.tx, speed)
      current.ty = lerp(current.ty, target.ty, speed)
      current.scale = lerp(current.scale, target.scale, 0.13)
      current.glowX = lerp(current.glowX, target.glowX, 0.16)
      current.glowY = lerp(current.glowY, target.glowY, 0.16)
      current.edge = lerp(current.edge, target.edge, 0.14)

      panel.style.transform = [
        "perspective(1700px)",
        `translate3d(${current.tx.toFixed(3)}px, ${current.ty.toFixed(3)}px, 0)`,
        `rotateX(${current.rx.toFixed(3)}deg)`,
        `rotateY(${current.ry.toFixed(3)}deg)`,
        `scale(${current.scale.toFixed(4)})`,
      ].join(" ")

      panel.style.setProperty("--hero-panel-glow-x", `${current.glowX.toFixed(2)}%`)
      panel.style.setProperty("--hero-panel-glow-y", `${current.glowY.toFixed(2)}%`)
      panel.style.setProperty("--hero-panel-edge", current.edge.toFixed(4))

      raf = window.requestAnimationFrame(render)
    }

    const reset = () => {
      if (!panel) return

      active = false

      target.rx = 0
      target.ry = 0
      target.tx = 0
      target.ty = 0
      target.scale = 1
      target.glowX = 50
      target.glowY = 45
      target.edge = 0

      panel.style.transformOrigin = "50% 50%"
      panel.dataset.heroPanelTiltState = "idle"
    }

    const update = (event: PointerEvent) => {
      if (!panel) return

      const rect = panel.getBoundingClientRect()

      const px = clamp((event.clientX - rect.left) / rect.width, 0, 1)
      const py = clamp((event.clientY - rect.top) / rect.height, 0, 1)

      const nx = px * 2 - 1
      const ny = py * 2 - 1

      const absX = Math.abs(nx)
      const absY = Math.abs(ny)

      const calmCenter = 0.12
      const edgeX = easeOut((absX - calmCenter) / (1 - calmCenter))
      const edgeY = easeOut((absY - calmCenter) / (1 - calmCenter))

      const signedX = Math.sign(nx) * edgeX
      const signedY = Math.sign(ny) * edgeY
      const edgeStrength = Math.max(edgeX, edgeY)

      active = true

      target.ry = clamp(signedX * 13, -13, 13)
      target.rx = clamp(-signedY * 10, -10, 10)
      target.tx = signedX * 7
      target.ty = signedY * 5.2
      target.scale = 1 + edgeStrength * 0.015
      target.glowX = px * 100
      target.glowY = py * 100
      target.edge = edgeStrength

      panel.style.transformOrigin = `${px * 100}% ${py * 100}%`
      panel.dataset.heroPanelTiltState = "active"
    }

    const boot = () => {
      panel = findPanel()
      if (!panel) return

      panel.dataset.heroPanelTilt = "true"
      panel.dataset.heroPanelTiltState = "idle"

      panel.style.setProperty("--hero-panel-glow-x", "50%")
      panel.style.setProperty("--hero-panel-glow-y", "45%")
      panel.style.setProperty("--hero-panel-edge", "0")
      panel.style.transformOrigin = "50% 50%"
      panel.style.transform =
        "perspective(1700px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale(1)"

      surface = createSurface()
      if (!surface) return

      surface.addEventListener("pointerenter", update)
      surface.addEventListener("pointermove", update)
      surface.addEventListener("pointerleave", reset)

      raf = window.requestAnimationFrame(render)
    }

    retryTimer = window.setTimeout(boot, 180)

    return () => {
      window.clearTimeout(retryTimer)
      window.cancelAnimationFrame(raf)

      if (surface) {
        surface.removeEventListener("pointerenter", update)
        surface.removeEventListener("pointermove", update)
        surface.removeEventListener("pointerleave", reset)
        surface.remove()
      }

      if (panel) {
        delete panel.dataset.heroPanelTilt
        delete panel.dataset.heroPanelTiltState
        panel.style.transform = ""
        panel.style.transformOrigin = ""
      }
    }
  }, [])

  return (
    <style>{`
      [data-hero-panel-tilt="true"] {
        position: relative !important;
        isolation: isolate;
        transform-style: preserve-3d;
        backface-visibility: hidden;
        will-change: transform, filter, box-shadow;
        transition:
          filter 220ms cubic-bezier(0.18, 1, 0.24, 1),
          box-shadow 220ms cubic-bezier(0.18, 1, 0.24, 1);
        filter:
          brightness(calc(1 + (var(--hero-panel-edge, 0) * 0.04)))
          contrast(calc(1 + (var(--hero-panel-edge, 0) * 0.025)));
        box-shadow:
          0 24px 70px rgba(0, 0, 0, 0.28),
          0 0 calc(30px + (var(--hero-panel-edge, 0) * 42px))
          rgba(215, 176, 106, calc(0.08 + (var(--hero-panel-edge, 0) * 0.16)));
      }

      [data-hero-panel-tilt="true"]::before {
        content: "";
        position: absolute;
        inset: -20px;
        z-index: -1;
        pointer-events: none;
        border-radius: inherit;
        opacity: calc(0.18 + (var(--hero-panel-edge, 0) * 0.36));
        filter: blur(26px);
        background:
          radial-gradient(
            circle at var(--hero-panel-glow-x, 50%) var(--hero-panel-glow-y, 45%),
            rgba(255, 236, 196, 0.34),
            transparent 24%
          ),
          radial-gradient(circle at 50% 50%, rgba(215, 176, 106, 0.13), transparent 62%);
      }

      [data-hero-panel-tilt="true"]::after {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        opacity: calc(0.34 + (var(--hero-panel-edge, 0) * 0.42));
        background:
          radial-gradient(
            circle at var(--hero-panel-glow-x, 50%) var(--hero-panel-glow-y, 45%),
            rgba(255, 255, 255, 0.22),
            transparent 18%
          ),
          linear-gradient(
            115deg,
            transparent 0%,
            rgba(255, 230, 180, 0.08) 30%,
            rgba(255, 240, 210, 0.16) 50%,
            rgba(255, 220, 160, 0.07) 70%,
            transparent 100%
          );
        mix-blend-mode: screen;
      }

      [data-hero-panel-tilt="true"][data-hero-panel-tilt-state="active"] {
        z-index: 20;
      }
    `}</style>
  )
}