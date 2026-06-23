export type Lang = "en" | "fa";

export const dictionary = {
  en: {
    brand: {
      mark: "LS",
      name: "LEMM Studio",
    },

    language: {
      switchTo: "FA",
      menu: "Menu",
      close: "Close",
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
      visualEyebrow: "Curated Canvas",
      visualTitle: "Selected Visual Works",
      visualDescription:
        "Brand identity, banners, thumbnails, AI visuals, and creative design studies.",
      statOne: "Branding",
      statTwo: "Digital Visuals",
      statThree: "AI Artworks",
    },

    featured: {
      eyebrow: "Featured Works",
      title: "Selected visual projects",
      description:
        "A compact selection of identity systems, packaging, and visual design studies.",
      link: "View Canvas",
    },

    canvas: {
      eyebrow: "Canvas",
      title: "Visual archive",
      description:
        "A curated archive of visual experiments, AI artworks, thumbnails, banners, and creative studies.",
    },

    about: {
      eyebrow: "About LEMM Studio",
      title: "Visual design by Reza Mousazadeh.",
      description:
        "LEMM Studio is the personal visual portfolio of Reza Mousazadeh, a graphic designer and computer engineering student based in Mashhad, Iran. The portfolio focuses on graphic design, brand identity, thumbnails, banners, advertising visuals, AI-assisted artworks, and premium presentation design.",
      cardTitle: "Design approach",
      cardDescription:
        "The work is shaped around atmosphere, clarity, contrast, and refined visual presentation.",
      itemOne: "Visual identity",
      itemTwo: "Advertising visuals",
      itemThree: "Creative direction",
    },

    contact: {
      eyebrow: "Contact",
      title: "Let’s create something visual.",
      description:
        "For design projects, collaborations, portfolio inquiries, or visual content requests, contact LEMM Studio by email.",
      button: "Rezajobmm@gmail.com",
      note: "Available for selected visual design projects.",
    },

    projectType: {
      caseStudy: "Case Study",
      quickWork: "Quick Work",
    },

    common: {
      tools: "Tools",
      all: "All",
    },
  },

  fa: {
    brand: {
      mark: "LS",
      name: "LEMM Studio",
    },

    language: {
      switchTo: "EN",
      menu: "منو",
      close: "بستن",
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
      titleBottom: "استودیو طراحی بصری",
      description:
        "پورتفولیوی طراحی بصری رضا موسی زاده، با تمرکز بر هویت بصری، تامبنیل، بنر، تصاویر تبلیغاتی، آثار مبتنی بر هوش مصنوعی و طراحی ارائه‌های حرفه‌ای.",
      primaryButton: "مشاهده کانواس",
      secondaryButton: "تماس",
      visualEyebrow: "کانواس منتخب",
      visualTitle: "آثار منتخب بصری",
      visualDescription:
        "هویت بصری، بنر، تامبنیل، تصاویر هوش مصنوعی و تجربه‌های خلاقانه طراحی.",
      statOne: "برندینگ",
      statTwo: "آثار دیجیتال",
      statThree: "تصاویر AI",
    },

    featured: {
      eyebrow: "آثار منتخب",
      title: "پروژه‌های بصری منتخب",
      description:
        "گزیده‌ای از هویت‌های بصری، بسته‌بندی‌ها و مطالعات طراحی گرافیک.",
      link: "مشاهده کانواس",
    },

    canvas: {
      eyebrow: "کانواس",
      title: "آرشیو بصری",
      description:
        "آرشیوی منتخب از تجربه‌های بصری، آثار هوش مصنوعی، تامبنیل‌ها، بنرها و مطالعات خلاقانه طراحی.",
    },

    about: {
      eyebrow: "درباره LEMM Studio",
      title: "طراحی بصری توسط رضا موسی زاده.",
      description:
        "LEMM Studio پورتفولیوی بصری شخصی رضا موسی زاده است؛ طراح گرافیک و دانشجوی مهندسی کامپیوتر ساکن مشهد. این پورتفولیو بر طراحی گرافیک، هویت بصری، تامبنیل، بنر، تصاویر تبلیغاتی، آثار مبتنی بر هوش مصنوعی و طراحی ارائه‌های حرفه‌ای تمرکز دارد.",
      cardTitle: "رویکرد طراحی",
      cardDescription:
        "تمرکز کارها بر فضا، وضوح، کنتراست و ارائه‌ی بصری پالایش‌شده است.",
      itemOne: "هویت بصری",
      itemTwo: "تصاویر تبلیغاتی",
      itemThree: "جهت‌دهی خلاقانه",
    },

    contact: {
      eyebrow: "تماس",
      title: "بیایید یک تصویر حرفه‌ای خلق کنیم.",
      description:
        "برای پروژه‌های طراحی، همکاری، بررسی پورتفولیو یا سفارش محتوای بصری، می‌توانید با LEMM Studio از طریق ایمیل در ارتباط باشید.",
      button: "Rezajobmm@gmail.com",
      note: "آماده همکاری برای پروژه‌های منتخب طراحی بصری.",
    },

    projectType: {
      caseStudy: "مطالعه پروژه",
      quickWork: "اثر سریع",
    },

    common: {
      tools: "ابزارها",
      all: "همه",
    },
  },
};

export type Dictionary = typeof dictionary.en;