import SanityWorkClient, {
  type WorkCategory,
  type WorkProject,
} from "@/components/work/SanityWorkClient";
import {client} from "@/sanity/lib/client";
import {categoriesQuery, projectsQuery} from "@/sanity/lib/queries";

export const revalidate = 60;

const FALLBACK_PROJECTS: WorkProject[] = [
  {
    _id: "fallback-khane-irani",
    titleEn: "Khane Irani",
    titleFa: "خانه ایرانی",
    slug: {current: "khane-irani"},
    category: {titleEn: "Brand Identity", titleFa: "هویت بصری", slug: {current: "brand-identity"}},
    shortDescriptionEn: "Iranian restaurant visual identity inspired by heritage, warmth, elegance, and Persian atmosphere.",
    shortDescriptionFa: "هویت بصری رستوران ایرانی با الهام از اصالت، گرما، ظرافت و فضای ایرانی.",
    tools: ["InDesign", "Illustrator", "Photoshop"],
  },
  {
    _id: "fallback-gazak",
    titleEn: "Gazak",
    titleFa: "گزک",
    slug: {current: "gazak"},
    category: {titleEn: "Packaging", titleFa: "بسته‌بندی", slug: {current: "packaging"}},
    shortDescriptionEn: "Food brand identity and packaging system with bold, warm, and appetizing visual language.",
    shortDescriptionFa: "هویت بصری و سیستم بسته‌بندی برند غذایی با زبان تصویری گرم، جسور و اشتهابرانگیز.",
    tools: ["InDesign", "Illustrator", "Photoshop"],
  },
  {
    _id: "fallback-real-roastery",
    titleEn: "RealRoastery",
    titleFa: "RealRoastery",
    slug: {current: "real-roastery"},
    category: {titleEn: "Brand Identity", titleFa: "هویت بصری", slug: {current: "brand-identity"}},
    shortDescriptionEn: "A premium coffee brand identity system focused on warmth, craft, and refined simplicity.",
    shortDescriptionFa: "سیستم هویت بصری برند قهوه با تمرکز بر گرما، سادگی و حس دست‌ساز.",
    tools: ["InDesign", "Illustrator", "Photoshop"],
  },
];

const FALLBACK_CATEGORIES: WorkCategory[] = [
  {titleEn: "Brand Identity", titleFa: "هویت بصری", slug: {current: "brand-identity"}},
  {titleEn: "Packaging", titleFa: "بسته‌بندی", slug: {current: "packaging"}},
];

async function safeFetch<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetcher();
  } catch {
    return fallback;
  }
}

export default async function WorkPage() {
  const [projects, categories] = await Promise.all([
    safeFetch<WorkProject[]>(
      () => client.fetch<WorkProject[]>(projectsQuery, {}, {next: {revalidate: 60}}),
      FALLBACK_PROJECTS,
    ),
    safeFetch<WorkCategory[]>(
      () => client.fetch<WorkCategory[]>(categoriesQuery, {}, {next: {revalidate: 60}}),
      FALLBACK_CATEGORIES,
    ),
  ]);

  return <SanityWorkClient projects={projects} categories={categories} />;
}
