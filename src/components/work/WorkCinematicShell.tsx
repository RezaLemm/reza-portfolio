import type {ReactNode} from "react"

import CinematicBackground from "@/components/home/CinematicBackground"
import GoldDustLayer from "@/components/home/GoldDustLayer"
import WorkCardMotion from "@/components/work/WorkCardMotion"
type WorkCinematicShellProps = {
  children: ReactNode
}

export default function WorkCinematicShell({children}: WorkCinematicShellProps) {
  return (
    <main className="work-cinematic-shell">
      <div className="work-cinematic-bg" aria-hidden="true">
        <CinematicBackground />
        <GoldDustLayer />
      </div>

      <div className="work-cinematic-vignette" aria-hidden="true" />
<WorkCardMotion />

      <div className="work-cinematic-content">{children}</div>
    </main>
  )
}