import { defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "titleEn",
      title: "Title - English",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleFa",
      title: "Title - Persian",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "titleEn",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "type",
      title: "Project Type",
      type: "string",
      options: {
        list: [
          { title: "Case Study", value: "case-study" },
          { title: "Quick Work", value: "quick-work" },
        ],
        layout: "radio",
      },
      initialValue: "case-study",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      initialValue: "2025",
    }),
    defineField({
      name: "roleEn",
      title: "Role - English",
      type: "string",
    }),
    defineField({
      name: "roleFa",
      title: "Role - Persian",
      type: "string",
    }),
    defineField({
      name: "shortDescriptionEn",
      title: "Short Description - English",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "shortDescriptionFa",
      title: "Short Description - Persian",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "overviewEn",
      title: "Overview - English",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "overviewFa",
      title: "Overview - Persian",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "challengeEn",
      title: "Challenge - English",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "challengeFa",
      title: "Challenge - Persian",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "solutionEn",
      title: "Solution - English",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "solutionFa",
      title: "Solution - Persian",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "tools",
      title: "Tools",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "titleEn",
              title: "Title - English",
              type: "string",
            }),
            defineField({
              name: "titleFa",
              title: "Title - Persian",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "titleEn",
              subtitle: "titleFa",
            },
          },
        },
      ],
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "altEn",
          title: "Alt Text - English",
          type: "string",
        }),
        defineField({
          name: "altFa",
          title: "Alt Text - Persian",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "altEn",
              title: "Alt Text - English",
              type: "string",
            }),
            defineField({
              name: "altFa",
              title: "Alt Text - Persian",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured Project",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),

    defineField({
      name: "portfolioPdf",
      title: "Portfolio PDF",
      type: "file",
      options: {
        accept: "application/pdf",
      },
      description: "Upload the project portfolio PDF here. Then run npm run sync:pdfs to generate PDF pages.",
    }),

    defineField({
      name: "pdfPages",
      title: "Generated PDF Pages",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: false,
          },
          fields: [
            defineField({
              name: "altEn",
              title: "Alt - English",
              type: "string",
            }),
            defineField({
              name: "altFa",
              title: "Alt - Persian",
              type: "string",
            }),
          ],
        },
      ],
      description: "Auto-generated images from Portfolio PDF. Usually filled by the sync script.",
    }),

    defineField({
      name: "pdfPagesSourceAssetId",
      title: "PDF Pages Source Asset ID",
      type: "string",
      readOnly: true,
      hidden: true,
    }),

    defineField({
      name: "pdfPagesSyncedAt",
      title: "PDF Pages Synced At",
      type: "datetime",
      readOnly: true,
      hidden: true,
    }),  ],
  preview: {
    select: {
      title: "titleEn",
      subtitle: "titleFa",
      media: "coverImage",
    },
  },
});