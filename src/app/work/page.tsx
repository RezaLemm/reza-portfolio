import SanityWorkClient from "@/components/work/SanityWorkClient"
import {client} from "@/sanity/lib/client"
import {categoriesQuery, projectsQuery} from "@/sanity/lib/queries"

export const revalidate = 60

type WorkCanvasItem = Record<string, unknown>

const fallbackCategories: WorkCanvasItem[] = [
  {_id: "cat-brand-identity", titleEn: "Brand Identity", slug: {current: "brand-identity"}, order: 1},
  {_id: "cat-packaging", titleEn: "Packaging", slug: {current: "packaging"}, order: 2},
  {_id: "cat-thumbnail", titleEn: "Thumbnail", slug: {current: "thumbnail"}, order: 3},
  {_id: "cat-profile-picture", titleEn: "Profile Picture", slug: {current: "profile-picture"}, order: 4},
  {_id: "cat-banner", titleEn: "Banner", slug: {current: "banner"}, order: 5},
  {_id: "cat-advertising", titleEn: "Advertising", slug: {current: "advertising"}, order: 6},
  {_id: "cat-social-media", titleEn: "Social Media", slug: {current: "social-media"}, order: 7},
  {_id: "cat-poster", titleEn: "Poster", slug: {current: "poster"}, order: 8},
  {_id: "cat-ai-visuals", titleEn: "AI Visuals", slug: {current: "ai-visuals"}, order: 9},
  {_id: "cat-photo-manipulation", titleEn: "Photo Manipulation", slug: {current: "photo-manipulation"}, order: 10},
  {_id: "cat-presentation-design", titleEn: "Presentation Design", slug: {current: "presentation-design"}, order: 11},
]

const fallbackProjects: WorkCanvasItem[] = [
  {
    _id: "fallback-real-roastery",
    titleEn: "Real Roastery",
    slug: {current: "real-roastery"},
    type: "Brand Identity",
    shortDescriptionEn: "A premium coffee brand identity system focused on warmth, craft, and refined simplicity.",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    category: {_id: "cat-brand-identity", titleEn: "Brand Identity", slug: {current: "brand-identity"}},
  },
  {
    _id: "fallback-gazak",
    titleEn: "Gazak",
    slug: {current: "gazak"},
    type: "Packaging",
    shortDescriptionEn: "Food brand identity and packaging system with a bold, warm, and appetizing visual language.",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    category: {_id: "cat-packaging", titleEn: "Packaging", slug: {current: "packaging"}},
  },
  {
    _id: "fallback-khane-irani",
    titleEn: "Khane Irani",
    slug: {current: "khane-irani"},
    type: "Brand Identity",
    shortDescriptionEn: "Iranian restaurant visual identity inspired by heritage, warmth, elegance, and Persian atmosphere.",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    category: {_id: "cat-brand-identity", titleEn: "Brand Identity", slug: {current: "brand-identity"}},
  },
]

function safeMessage(error: unknown) {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`
  }

  return String(error)
}

async function safeSanityFetch<T>(
  label: string,
  fetcher: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    const result = await fetcher()

    if (Array.isArray(result) && result.length === 0) {
      return fallback
    }

    return result
  } catch (error) {
    console.warn(`[work-page] Sanity ${label} fetch failed. Using fallback data. ${safeMessage(error)}`)
    return fallback
  }
}

export default async function WorkPage() {
  const [projects, categories] = await Promise.all([
    safeSanityFetch<WorkCanvasItem[]>(
      "projects",
      () => client.fetch<WorkCanvasItem[]>(projectsQuery, {}, {next: {revalidate: 60}}),
      fallbackProjects,
    ),
    safeSanityFetch<WorkCanvasItem[]>(
      "categories",
      () => client.fetch<WorkCanvasItem[]>(categoriesQuery, {}, {next: {revalidate: 60}}),
      fallbackCategories,
    ),
  ])

  return <SanityWorkClient projects={projects} categories={categories} />
}