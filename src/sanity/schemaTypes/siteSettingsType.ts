import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "brandName",
      title: "Brand Name",
      type: "string",
      initialValue: "LEMM Studio",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      initialValue: "Rezajobmm@gmail.com",
    }),
    defineField({
      name: "heroEyebrowEn",
      title: "Hero Eyebrow - English",
      type: "string",
    }),
    defineField({
      name: "heroEyebrowFa",
      title: "Hero Eyebrow - Persian",
      type: "string",
    }),
    defineField({
      name: "heroTitleEn",
      title: "Hero Title - English",
      type: "string",
    }),
    defineField({
      name: "heroTitleFa",
      title: "Hero Title - Persian",
      type: "string",
    }),
    defineField({
      name: "heroDescriptionEn",
      title: "Hero Description - English",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "heroDescriptionFa",
      title: "Hero Description - Persian",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "aboutTextEn",
      title: "About Text - English",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "aboutTextFa",
      title: "About Text - Persian",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
    }),
    defineField({
      name: "behance",
      title: "Behance",
      type: "url",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn",
      type: "url",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
        subtitle: "Global website content",
      };
    },
  },
});