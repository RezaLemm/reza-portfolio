import type {ReactNode} from "react"

import CinematicBackground from "@/components/home/CinematicBackground"
import GoldDustLayer from "@/components/home/GoldDustLayer"
import WorkCardMotion from "@/components/work/WorkCardMotion"

type WorkCinematicShellProps = {
  children: ReactNode
}

export default function WorkCinematicShell({children}: WorkCinematicShellProps) {
  return (
    <main className="work-cinematic-shell work-cinema-stable">
      <div className="work-stable-bg" aria-hidden="true">
        <CinematicBackground />
        <GoldDustLayer />

        <div className="work-stable-aurora work-stable-aurora-one" />
        <div className="work-stable-aurora work-stable-aurora-two" />
        <div className="work-stable-grid" />
        <div className="work-stable-gold-sweep" />
        <div className="work-stable-soft-grain" />
      </div>

      <div className="work-stable-vignette" aria-hidden="true" />

      <WorkCardMotion />

      <div className="work-cinematic-content">{children}</div>
    </main>
  )
}