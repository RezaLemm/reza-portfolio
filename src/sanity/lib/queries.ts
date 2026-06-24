import {groq} from "next-sanity"

const projectFields = groq`
  _id,
  titleEn,
  titleFa,
  slug,
  type,
  year,
  roleEn,
  roleFa,
  shortDescriptionEn,
  shortDescriptionFa,
  overviewEn,
  overviewFa,
  challengeEn,
  challengeFa,
  solutionEn,
  solutionFa,
  tools,
  deliverables,
  featured,
  order,
  category->{
    _id,
    titleEn,
    titleFa,
    slug,
    order
  },
  coverImage {
    altEn,
    altFa,
    asset->{
      url
    }
  },
  gallery[] {
    altEn,
    altFa,
    asset->{
      url
    }
  },
  pdfPages[] {
    altEn,
    altFa,
    asset->{
      url
    }
  },
  portfolioPdf {
    titleEn,
    titleFa,
    asset->{
      url,
      originalFilename
    }
  }
`

export const categoriesQuery = groq`
  *[_type == "category"] | order(order asc, titleEn asc) {
    _id,
    titleEn,
    titleFa,
    slug,
    order
  }
`

export const projectsQuery = groq`
  *[_type == "project"] | order(order asc, _updatedAt desc) {
    ${projectFields}
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug] | order(_updatedAt desc) [0] {
    ${projectFields}
  }
`