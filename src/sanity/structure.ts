import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('LEMM Studio Admin')
    .items([
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('siteSettings').title('Site Settings'),
    ])
