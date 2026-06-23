export type Lang = "en" | "fa";

export const dictionary = {
  en: {
    brand: {
      mark: "LS",
      name: "LEMM Studio",
    },
    nav: {
      home: "Home",
      canvas: "Canvas",
      about: "About",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Graphic Design & Visual Portfolio",
      titleTop: "LEMM Studio",
      titleBottom: "Visual Portfolio",
      description:
        "A visual design portfolio by Reza Mousazadeh, focused on brand identity, thumbnails, banners, advertising visuals, AI-assisted artworks, and premium presentation design.",
      primaryButton: "View Canvas",
      secondaryButton: "Contact",
      visualEyebrow: "LEMM Studio",
      visualTitle: "Selected Visual Works",
      visualDescription:
        "Brand identity, banners, thumbnails, AI visuals, and creative design studies.",
    },
  },

  fa: {
    brand: {
      mark: "LS",
      name: "LEMM Studio",
    },
    nav: {
      home: "خانه",
      canvas: "کانواس",
      about: "درباره",
      contact: "تماس",
    },
    hero: {
      eyebrow: "پورتفولیوی طراحی گرافیک و آثار بصری",
      titleTop: "LEMM Studio",
      titleBottom: "پورتفولیوی بصری",
      description:
        "پورتفولیوی طراحی بصری رضا موسی زاده مقدم، با تمرکز بر هویت بصری، تامبنیل، بنر، تصاویر تبلیغاتی، آثار مبتنی بر هوش مصنوعی و طراحی ارائه‌های حرفه‌ای.",
      primaryButton: "مشاهده کانواس",
      secondaryButton: "تماس",
      visualEyebrow: "LEMM Studio",
      visualTitle: "آثار منتخب بصری",
      visualDescription:
        "هویت بصری، بنر، تامبنیل، تصاویر هوش مصنوعی و تجربه‌های خلاقانه طراحی.",
    },
  },
};

export type Dictionary = typeof dictionary.en;