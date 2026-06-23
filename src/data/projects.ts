import type { Lang } from "@/lib/i18n";

export type ProjectType = "case-study" | "quick-work";

export type LocalizedText = Record<Lang, string>;

export type Category = {
  id: string;
  label: LocalizedText;
};

export type Project = {
  id: number;
  title: LocalizedText;
  slug: string;
  categoryId: string;
  type: ProjectType;
  description: LocalizedText;
  tools: string[];
  featured: boolean;
};

export const categories: Category[] = [
  {
    id: "all",
    label: {
      en: "All",
      fa: "همه",
    },
  },
  {
    id: "brand-identity",
    label: {
      en: "Brand Identity",
      fa: "هویت بصری",
    },
  },
  {
    id: "packaging",
    label: {
      en: "Packaging",
      fa: "بسته‌بندی",
    },
  },
  {
    id: "thumbnail",
    label: {
      en: "Thumbnail",
      fa: "تامبنیل",
    },
  },
  {
    id: "profile-picture",
    label: {
      en: "Profile Picture",
      fa: "تصویر پروفایل",
    },
  },
  {
    id: "banner",
    label: {
      en: "Banner",
      fa: "بنر",
    },
  },
  {
    id: "advertising",
    label: {
      en: "Advertising",
      fa: "تبلیغات",
    },
  },
  {
    id: "social-media",
    label: {
      en: "Social Media",
      fa: "شبکه اجتماعی",
    },
  },
  {
    id: "poster",
    label: {
      en: "Poster",
      fa: "پوستر",
    },
  },
  {
    id: "ai-visuals",
    label: {
      en: "AI Visuals",
      fa: "تصاویر AI",
    },
  },
  {
    id: "photo-manipulation",
    label: {
      en: "Photo Manipulation",
      fa: "فتومنیپولیشن",
    },
  },
  {
    id: "presentation-design",
    label: {
      en: "Presentation Design",
      fa: "طراحی ارائه",
    },
  },
];

export const projects: Project[] = [
  {
    id: 1,
    title: {
      en: "Real Roastery",
      fa: "Real Roastery",
    },
    slug: "real-roastery",
    categoryId: "brand-identity",
    type: "case-study",
    description: {
      en: "A premium coffee brand identity system focused on warmth, craft, and refined simplicity.",
      fa: "سیستم هویت بصری پریمیوم برای برند قهوه، با تمرکز بر گرما، سادگی و حس دست‌ساز.",
    },
    tools: ["Photoshop", "Illustrator", "InDesign"],
    featured: true,
  },
  {
    id: 2,
    title: {
      en: "Gazak",
      fa: "گزک",
    },
    slug: "gazak",
    categoryId: "packaging",
    type: "case-study",
    description: {
      en: "Food brand identity and packaging system with a bold, warm, and appetizing visual language.",
      fa: "هویت بصری و بسته‌بندی برند غذایی با زبان تصویری گرم، جسور و اشتهابرانگیز.",
    },
    tools: ["Photoshop", "Illustrator", "InDesign"],
    featured: true,
  },
  {
    id: 3,
    title: {
      en: "Khane Irani",
      fa: "خانه ایرانی",
    },
    slug: "khane-irani",
    categoryId: "brand-identity",
    type: "case-study",
    description: {
      en: "Iranian restaurant visual identity inspired by heritage, warmth, elegance, and Persian atmosphere.",
      fa: "هویت بصری رستوران ایرانی با الهام از اصالت، گرما، ظرافت و فضای ایرانی.",
    },
    tools: ["Photoshop", "Illustrator", "InDesign"],
    featured: true,
  },
  {
    id: 4,
    title: {
      en: "Thumbnail Design Series",
      fa: "مجموعه طراحی تامبنیل",
    },
    slug: "thumbnail-design-series",
    categoryId: "thumbnail",
    type: "quick-work",
    description: {
      en: "High-impact thumbnail concepts designed for digital content, contrast, and fast visual attention.",
      fa: "کانسپت‌های تامبنیل با تمرکز بر کنتراست، جذابیت سریع و توجه بصری بالا.",
    },
    tools: ["Photoshop"],
    featured: false,
  },
  {
    id: 5,
    title: {
      en: "AI Visual Experiments",
      fa: "تجربه‌های تصویری AI",
    },
    slug: "ai-visual-experiments",
    categoryId: "ai-visuals",
    type: "quick-work",
    description: {
      en: "A collection of AI-assisted visual studies focused on mood, composition, atmosphere, and concept art.",
      fa: "مجموعه‌ای از مطالعات تصویری مبتنی بر هوش مصنوعی با تمرکز بر فضا، ترکیب‌بندی و کانسپت.",
    },
    tools: ["AI Tools", "Photoshop"],
    featured: false,
  },
  {
    id: 6,
    title: {
      en: "Advertising Banner Concepts",
      fa: "کانسپت‌های بنر تبلیغاتی",
    },
    slug: "advertising-banner-concepts",
    categoryId: "banner",
    type: "quick-work",
    description: {
      en: "Digital banner design concepts for promotional campaigns, social media, and online advertising.",
      fa: "طراحی کانسپت بنرهای دیجیتال برای کمپین‌های تبلیغاتی، شبکه‌های اجتماعی و تبلیغات آنلاین.",
    },
    tools: ["Photoshop", "Illustrator"],
    featured: false,
  },
];

export function getCategoryLabel(categoryId: string, lang: Lang) {
  return (
    categories.find((category) => category.id === categoryId)?.label[lang] ??
    categoryId
  );
}