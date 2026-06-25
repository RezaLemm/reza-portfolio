"use client"

import type {ReactNode} from "react"
import CanvasCinematicUpgrade from "@/components/work/CanvasCinematicUpgrade"

type CanvasPageShellProps = {
  children: ReactNode
}

export default function CanvasPageShell({children}: CanvasPageShellProps) {
  return (
    <div className="canvas-page-shell">
      <CanvasCinematicUpgrade />

      <div className="canvas-page-content">
        {children}
      </div>
    </div>
  )
}