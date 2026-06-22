export type ProjectType = "case-study" | "quick-work";

export type Project = {
  id: number;
  title: string;
  slug: string;
  category: string;
  type: ProjectType;
  description: string;
  cover: string;
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
    description: "Premium coffee brand identity and visual presentation system.",
    cover: "/works/real-roastery-cover.jpg",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    featured: true,
  },
  {
    id: 2,
    title: "Gazak",
    slug: "gazak",
    category: "Packaging",
    type: "case-study",
    description: "Food brand identity and packaging design system.",
    cover: "/works/gazak-cover.jpg",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    featured: true,
  },
  {
    id: 3,
    title: "Khane Irani",
    slug: "khane-irani",
    category: "Brand Identity",
    type: "case-study",
    description: "Iranian restaurant visual identity and menu design.",
    cover: "/works/khane-irani-cover.jpg",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    featured: true,
  },
  {
    id: 4,
    title: "YouTube Thumbnail Design",
    slug: "youtube-thumbnail-design",
    category: "Thumbnail",
    type: "quick-work",
    description: "High-impact thumbnail design for digital content.",
    cover: "/works/thumbnail-01.jpg",
    tools: ["Photoshop"],
    featured: false,
  },
];