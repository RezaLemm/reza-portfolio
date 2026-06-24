import SanityWorkClient from "@/components/SanityWorkClient"
import {client} from "@/sanity/lib/client"
import {categoriesQuery, projectsQuery} from "@/sanity/lib/queries"
import type {SanityCategory, SanityProject} from "@/types/sanity"

export const revalidate = 60

export default async function WorkPage() {
  const [projects, categories] = await Promise.all([
    client.fetch<SanityProject[]>(projectsQuery, {}, {next: {revalidate: 60}}),
    client.fetch<SanityCategory[]>(categoriesQuery, {}, {next: {revalidate: 60}}),
  ])

  return <SanityWorkClient projects={projects} categories={categories} />
}
