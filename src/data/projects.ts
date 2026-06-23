export type ProjectType = "case-study" | "quick-work";

export type Project = {
  id: number;
  title: string;
  slug: string;
  category: string;
  type: ProjectType;
  description: string;
  tools: string[];
  featured: boolean;
};

export const categories = [
  "All",
  "Brand Identity",
  "Packaging",
  "Thumbnail",
  "Profile Picture",
  "Banner",
  "Advertising",
  "Social Media",
  "Poster",
  "AI Visuals",
  "Photo Manipulation",
  "Presentation Design",
];

export const projects: Project[] = [
  {
    id: 1,
    title: "Real Roastery",
    slug: "real-roastery",
    category: "Brand Identity",
    type: "case-study",
    description:
      "A premium coffee brand identity system focused on warmth, craft, and refined simplicity.",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    featured: true,
  },
  {
    id: 2,
    title: "Gazak",
    slug: "gazak",
    category: "Packaging",
    type: "case-study",
    description:
      "Food brand identity and packaging system with a bold, warm, and appetizing visual language.",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    featured: true,
  },
  {
    id: 3,
    title: "Khane Irani",
    slug: "khane-irani",
    category: "Brand Identity",
    type: "case-study",
    description:
      "Iranian restaurant visual identity inspired by heritage, warmth, elegance, and Persian atmosphere.",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    featured: true,
  },
  {
    id: 4,
    title: "Thumbnail Design Series",
    slug: "thumbnail-design-series",
    category: "Thumbnail",
    type: "quick-work",
    description:
      "High-impact thumbnail concepts designed for digital content, contrast, and fast visual attention.",
    tools: ["Photoshop"],
    featured: false,
  },
  {
    id: 5,
    title: "AI Visual Experiments",
    slug: "ai-visual-experiments",
    category: "AI Visuals",
    type: "quick-work",
    description:
      "A collection of AI-assisted visual studies focused on mood, composition, atmosphere, and concept art.",
    tools: ["AI Tools", "Photoshop"],
    featured: false,
  },
  {
    id: 6,
    title: "Advertising Banner Concepts",
    slug: "advertising-banner-concepts",
    category: "Banner",
    type: "quick-work",
    description:
      "Digital banner design concepts for promotional campaigns, social media, and online advertising.",
    tools: ["Photoshop", "Illustrator"],
    featured: false,
  },
];