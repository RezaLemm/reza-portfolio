import {notFound} from "next/navigation"
import SanityProjectDetailClient from "@/components/SanityProjectDetailClient"
import {client} from "@/sanity/lib/client"
import {projectBySlugQuery} from "@/sanity/lib/queries"
import type {SanityProject} from "@/types/sanity"

export const revalidate = 60

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params

  const project = await client.fetch<SanityProject | null>(
    projectBySlugQuery,
    {slug},
    {next: {revalidate: 60}},
  )

  if (!project) {
    notFound()
  }

  return <SanityProjectDetailClient project={project} />
}
