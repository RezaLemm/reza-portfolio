import type {ReactNode} from "react"

import WorkCinematicShell from "@/components/work/WorkCinematicShell"

export default function WorkLayout({children}: {children: ReactNode}) {
  return <WorkCinematicShell>{children}</WorkCinematicShell>
}