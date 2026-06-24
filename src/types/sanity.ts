export type SanitySlug = {
  current: string
}

export type SanityImage = {
  asset?: {
    url?: string
  }
  altEn?: string
  altFa?: string
}

export type SanityFile = {
  titleEn?: string
  titleFa?: string
  asset?: {
    url?: string
    originalFilename?: string
  }
}

export type SanityCategory = {
  _id: string
  titleEn: string
  titleFa: string
  slug: SanitySlug
  order?: number
}

export type SanityDeliverable = {
  _key?: string
  titleEn?: string
  titleFa?: string
}

export type SanityProject = {
  _id: string
  titleEn: string
  titleFa: string
  slug: SanitySlug
  category?: SanityCategory | null
  type?: "case-study" | "quick-work"
  year?: string
  roleEn?: string
  roleFa?: string
  shortDescriptionEn?: string
  shortDescriptionFa?: string
  overviewEn?: string
  overviewFa?: string
  challengeEn?: string
  challengeFa?: string
  solutionEn?: string
  solutionFa?: string
  tools?: string[]
  deliverables?: SanityDeliverable[]
  coverImage?: SanityImage
  gallery?: SanityImage[]
  pdfPages?: SanityImage[]
  portfolioPdf?: SanityFile
  featured?: boolean
  order?: number
}