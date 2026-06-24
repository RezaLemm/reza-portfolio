import {createClient} from "@sanity/client"
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const envPath = path.join(root, ".env.local")

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/)
  const env = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const index = trimmed.indexOf("=")
    if (index === -1) continue

    const key = trimmed.slice(0, index).trim()
    const value = trimmed
      .slice(index + 1)
      .trim()
      .replace(/^"/, "")
      .replace(/"$/, "")

    env[key] = value
  }

  return env
}

const env = readEnvFile(envPath)

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production"
const token = env.SANITY_API_WRITE_TOKEN

if (!projectId) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is missing in .env.local")
}

if (!token) {
  throw new Error("SANITY_API_WRITE_TOKEN is missing in .env.local")
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
})

const categories = [
  ["category.brand-identity", "Brand Identity", "هویت بصری", "brand-identity", 10],
  ["category.packaging", "Packaging", "بسته‌بندی", "packaging", 20],
  ["category.thumbnail", "Thumbnail", "تامبنیل", "thumbnail", 30],
  ["category.profile-picture", "Profile Picture", "تصویر پروفایل", "profile-picture", 40],
  ["category.banner", "Banner", "بنر", "banner", 50],
  ["category.advertising", "Advertising", "تبلیغات", "advertising", 60],
  ["category.social-media", "Social Media", "شبکه اجتماعی", "social-media", 70],
  ["category.poster", "Poster", "پوستر", "poster", 80],
  ["category.ai-visuals", "AI Visuals", "تصاویر AI", "ai-visuals", 90],
  ["category.photo-manipulation", "Photo Manipulation", "فتومنیپولیشن", "photo-manipulation", 100],
  ["category.presentation-design", "Presentation Design", "طراحی ارائه", "presentation-design", 110],
]

const projects = [
  {
    id: "project.real-roastery",
    slug: "real-roastery",
    folder: "Real Roastery",
    categoryId: "category.brand-identity",
    titleEn: "Real Roastery",
    titleFa: "Real Roastery",
    type: "case-study",
    year: "2025",
    roleEn: "Brand Identity Designer",
    roleFa: "طراح هویت بصری",
    shortDescriptionEn:
      "A premium coffee brand identity system focused on warmth, craft, and refined simplicity.",
    shortDescriptionFa:
      "سیستم هویت بصری پریمیوم برای برند قهوه، با تمرکز بر گرما، سادگی و حس دست‌ساز.",
    overviewEn:
      "Real Roastery is a premium coffee identity project built around warmth, craft, refined simplicity, and a calm visual language. The system includes logo direction, color palette, typography, packaging, menu design, and brand applications.",
    overviewFa:
      "Real Roastery یک پروژه هویت بصری برای برند قهوه است که بر گرما، حس دست‌ساز، سادگی پالایش‌شده و زبان تصویری آرام تمرکز دارد. این سیستم شامل لوگو، پالت رنگ، تایپوگرافی، بسته‌بندی، منو و کاربردهای برند است.",
    challengeEn:
      "The challenge was to create a coffee identity that feels premium without becoming cold, minimal without losing warmth, and elegant while still feeling approachable.",
    challengeFa:
      "چالش اصلی این بود که هویتی برای برند قهوه ساخته شود که پریمیوم باشد اما سرد و خشک نشود؛ مینیمال باشد اما گرما و حس انسانی خود را از دست ندهد.",
    solutionEn:
      "The design uses a deep, warm palette, restrained typography, refined layouts, and subtle brand elements to create a visual system that feels crafted, calm, and memorable.",
    solutionFa:
      "راه‌حل طراحی بر پایه پالت رنگی گرم و عمیق، تایپوگرافی کنترل‌شده، چیدمان‌های تمیز و عناصر بصری ظریف شکل گرفت تا برند حس حرفه‌ای، آرام و ماندگار داشته باشد.",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    deliverables: [
      ["Logo system", "سیستم لوگو"],
      ["Color palette", "پالت رنگی"],
      ["Menu design", "طراحی منو"],
      ["Packaging direction", "مسیر طراحی بسته‌بندی"],
      ["Brand applications", "کاربردهای برند"],
    ],
    cover: "Real Roastery Print Design MockUp.png",
    gallery: [
      "Real Roastery 2.jpg",
      "Real Roastery 2.png",
      "Real Roastery back Visit card.jpg",
      "Real Roastery Front Vist card.jpg",
      "Real Roastery Menu.png",
      "Real Roastery Menu Mockup.png",
      "Real Roastery Menu Mockup 2.png",
      "Real Roastery Print Design.jpg",
      "Real Roastery Print Design 2.jpg",
      "Real Roastery Print Design MockUp.png",
    ],
    order: 10,
    featured: true,
  },
  {
    id: "project.gazak",
    slug: "gazak",
    folder: "Gazak",
    categoryId: "category.packaging",
    titleEn: "Gazak",
    titleFa: "گزک",
    type: "case-study",
    year: "2025",
    roleEn: "Brand & Packaging Designer",
    roleFa: "طراح برند و بسته‌بندی",
    shortDescriptionEn:
      "Food brand identity and packaging system with a bold, warm, and appetizing visual language.",
    shortDescriptionFa:
      "هویت بصری و بسته‌بندی برند غذایی با زبان تصویری گرم، جسور و اشتهابرانگیز.",
    overviewEn:
      "Gazak is a food brand identity and packaging project with a bold, warm, and energetic personality. The visual system was designed to feel appetizing, memorable, and highly usable across packaging and promotional touchpoints.",
    overviewFa:
      "گزک یک پروژه هویت بصری و بسته‌بندی برای برند غذایی است؛ با شخصیتی گرم، جسور و پرانرژی. سیستم بصری طوری طراحی شده که اشتهابرانگیز، به‌یادماندنی و قابل استفاده در بسته‌بندی و تبلیغات باشد.",
    challengeEn:
      "The challenge was to create a visual identity that could stand out in food packaging while still feeling premium, consistent, and commercially usable.",
    challengeFa:
      "چالش این بود که هویتی طراحی شود که در بسته‌بندی مواد غذایی دیده شود، اما همچنان منسجم، حرفه‌ای و قابل استفاده تجاری باقی بماند.",
    solutionEn:
      "The solution combines strong contrast, warm colors, bold logo usage, and flexible packaging patterns to build a brand that feels energetic and instantly recognizable.",
    solutionFa:
      "راه‌حل با ترکیب کنتراست بالا، رنگ‌های گرم، استفاده قوی از لوگو و الگوهای انعطاف‌پذیر بسته‌بندی شکل گرفت تا برند پرانرژی و سریعاً قابل تشخیص باشد.",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    deliverables: [
      ["Brand identity", "هویت بصری"],
      ["Packaging system", "سیستم بسته‌بندی"],
      ["Menu design", "طراحی منو"],
      ["Signage direction", "مسیر طراحی تابلو"],
      ["Food wrappers", "طراحی بسته‌بندی غذایی"],
    ],
    cover: "Gazak Visit Card Mockup.png",
    gallery: [
      "Gazak Logo 1.png",
      "Gazak Logo 3.png",
      "Gazak Cover Menu.png",
      "Menu Cover Mockup.png",
      "Menu 1 Mockup.png",
      "Menu 2 Mockup.png",
      "Gazak Visit Card Mockup.png",
      "Burger Mockup.png",
      "Pizza Mockup 1.png",
      "Pizza Mockup 2.png",
      "Headboard Mockup.png",
      "Paper Watermark Mockup.png",
    ],
    order: 20,
    featured: true,
  },
  {
    id: "project.khane-irani",
    slug: "khane-irani",
    folder: "KHANE IRANI",
    categoryId: "category.brand-identity",
    titleEn: "Khane Irani",
    titleFa: "خانه ایرانی",
    type: "case-study",
    year: "2025",
    roleEn: "Visual Identity Designer",
    roleFa: "طراح هویت بصری",
    shortDescriptionEn:
      "Iranian restaurant visual identity inspired by heritage, warmth, elegance, and Persian atmosphere.",
    shortDescriptionFa:
      "هویت بصری رستوران ایرانی با الهام از اصالت، گرما، ظرافت و فضای ایرانی.",
    overviewEn:
      "Khane Irani is a restaurant visual identity inspired by Iranian heritage, warmth, elegance, and Persian atmosphere. The project uses cultural references such as arches, traditional ornaments, and warm hospitality to build a refined brand world.",
    overviewFa:
      "خانه ایرانی یک پروژه هویت بصری برای رستوران ایرانی است که از اصالت، گرما، ظرافت و فضای ایرانی الهام گرفته. در این پروژه از نشانه‌هایی مثل قوس‌های معماری، تزئینات سنتی و حس مهمان‌نوازی ایرانی برای ساخت یک دنیای بصری پالایش‌شده استفاده شده است.",
    challengeEn:
      "The challenge was to represent Iranian culture in a way that feels authentic and elegant, without becoming overly traditional or visually crowded.",
    challengeFa:
      "چالش این بود که فرهنگ ایرانی به شکلی اصیل و شیک نمایش داده شود، بدون اینکه بیش از حد سنتی، شلوغ یا کلیشه‌ای شود.",
    solutionEn:
      "The design balances deep black, warm gold, soft cream, and Persian-inspired forms to create an identity that feels cultural, premium, and contemporary.",
    solutionFa:
      "طراحی با ترکیب مشکی عمیق، طلایی گرم، کرم ملایم و فرم‌های الهام‌گرفته از معماری ایرانی، هویتی فرهنگی، پریمیوم و معاصر ساخته است.",
    tools: ["Photoshop", "Illustrator", "InDesign"],
    deliverables: [
      ["Restaurant identity", "هویت بصری رستوران"],
      ["Menu design", "طراحی منو"],
      ["Business card", "کارت ویزیت"],
      ["Graphic elements", "عناصر گرافیکی"],
      ["Brand atmosphere", "فضاسازی برند"],
    ],
    cover: "KHANE IRANI Menu cover.png",
    gallery: [
      "KHANE IRANI.png",
      "KHANE IRANI 2.png",
      "KHANE IRANI Menu cover.png",
      "KHANE IRANI Menu 1.png",
      "KHANE IRANI Menu 2.png",
      "KHANE IRANI Menu 3.png",
      "KHANE IRANI Menu cover Mockup.png",
      "Menu Mockup.png",
      "KHANE IRANI Visit Card.png",
      "KHANE IRANI Visit Card 2.png",
      "vist card mockup.webp",
    ],
    order: 30,
    featured: true,
  },
]

function makeKey(value) {
  return Buffer.from(value)
    .toString("hex")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 12)
}

function imageObject(asset, fileName, project) {
  return {
    _type: "image",
    _key: makeKey(project.slug + fileName),
    asset: {
      _type: "reference",
      _ref: asset._id,
    },
    altEn: `${project.titleEn} portfolio image`,
    altFa: `تصویر پورتفولیوی ${project.titleFa}`,
  }
}

async function findOrUploadImage(project, fileName) {
  const filePath = path.join(root, "Photos", project.folder, fileName)

  if (!fs.existsSync(filePath)) {
    console.warn(`Missing file: Photos/${project.folder}/${fileName}`)
    return null
  }

  const sanityFileName = `${project.slug}__${fileName}`

  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{
      _id,
      url,
      originalFilename
    }`,
    {filename: sanityFileName},
  )

  if (existing?._id) {
    console.log(`Reusing: ${sanityFileName}`)
    return existing
  }

  console.log(`Uploading: ${sanityFileName}`)

  const stream = fs.createReadStream(filePath)

  return client.assets.upload("image", stream, {
    filename: sanityFileName,
  })
}

async function ensureCategories() {
  for (const [id, titleEn, titleFa, slug, order] of categories) {
    await client.createIfNotExists({
      _id: id,
      _type: "category",
      titleEn,
      titleFa,
      slug: {
        _type: "slug",
        current: slug,
      },
      order,
    })

    await client.patch(id).set({titleEn, titleFa, order}).commit()

    console.log(`Category ready: ${titleEn}`)
  }
}

async function ensureProject(project) {
  await client.createIfNotExists({
    _id: project.id,
    _type: "project",
    titleEn: project.titleEn,
    titleFa: project.titleFa,
    slug: {
      _type: "slug",
      current: project.slug,
    },
  })

  const coverAsset = await findOrUploadImage(project, project.cover)

  const galleryImages = []

  for (const fileName of project.gallery) {
    const asset = await findOrUploadImage(project, fileName)
    if (!asset) continue

    galleryImages.push(imageObject(asset, fileName, project))
  }

  const coverImage = coverAsset ? imageObject(coverAsset, project.cover, project) : undefined

  await client
    .patch(project.id)
    .set({
      titleEn: project.titleEn,
      titleFa: project.titleFa,
      slug: {
        _type: "slug",
        current: project.slug,
      },
      category: {
        _type: "reference",
        _ref: project.categoryId,
      },
      type: project.type,
      year: project.year,
      roleEn: project.roleEn,
      roleFa: project.roleFa,
      shortDescriptionEn: project.shortDescriptionEn,
      shortDescriptionFa: project.shortDescriptionFa,
      overviewEn: project.overviewEn,
      overviewFa: project.overviewFa,
      challengeEn: project.challengeEn,
      challengeFa: project.challengeFa,
      solutionEn: project.solutionEn,
      solutionFa: project.solutionFa,
      tools: project.tools,
      deliverables: project.deliverables.map(([titleEn, titleFa]) => ({
        _key: makeKey(project.slug + titleEn),
        _type: "object",
        titleEn,
        titleFa,
      })),
      featured: project.featured,
      order: project.order,
      ...(coverImage ? {coverImage} : {}),
      gallery: galleryImages,
    })
    .commit()

  console.log(`Project ready: ${project.titleEn}`)
}

async function main() {
  console.log("Starting LEMM Studio Sanity import...")

  await ensureCategories()

  for (const project of projects) {
    await ensureProject(project)
  }

  console.log("Done. Portfolio projects imported to Sanity.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
