"use client";

import { useEffect } from "react";

export default function InteractiveBackground() {
  useEffect(() => {
    const root = document.documentElement;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.28;
    let currentX = targetX;
    let currentY = targetY;
    let frame = 0;

    const setVariables = () => {
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;

      root.style.setProperty("--mouse-x", `${currentX}px`);
      root.style.setProperty("--mouse-y", `${currentY}px`);

      frame = requestAnimationFrame(setVariables);
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    root.style.setProperty("--mouse-x", `${targetX}px`);
    root.style.setProperty("--mouse-y", `${targetY}px`);

    if (!prefersReducedMotion && isFinePointer) {
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      frame = requestAnimationFrame(setVariables);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div className="site-background pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="site-background-base" />
      <div className="site-background-grid" />
      <div className="site-background-orb site-background-orb-one" />
      <div className="site-background-orb site-background-orb-two" />
      <div className="site-background-cursor-glow" />
      <div className="site-background-cursor-core" />
      <div className="site-background-vignette" />
    </div>
  );
}