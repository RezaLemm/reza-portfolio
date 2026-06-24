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

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is missing in .env.local")
if (!token) throw new Error("SANITY_API_WRITE_TOKEN is missing in .env.local")

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
})

const projects = [
  {
    id: "project.gazak",
    slug: "gazak",
    folder: "Gazak",
    titleEn: "Gazak",
    titleFa: "گزک",
  },
  {
    id: "project.real-roastery",
    slug: "real-roastery",
    folder: "Real Roastery",
    titleEn: "Real Roastery",
    titleFa: "Real Roastery",
  },
  {
    id: "project.khane-irani",
    slug: "khane-irani",
    folder: "KHANE IRANI",
    titleEn: "Khane Irani",
    titleFa: "خانه ایرانی",
  },
]

const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"])

function getPdfPageImages(project) {
  const folderPath = path.join(root, "Photos", project.folder, "PDF Pages")

  if (!fs.existsSync(folderPath)) {
    console.warn(`PDF Pages folder missing: Photos/${project.folder}/PDF Pages`)
    return []
  }

  return fs
    .readdirSync(folderPath)
    .filter((fileName) => imageExtensions.has(path.extname(fileName).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, {numeric: true, sensitivity: "base"}))
    .map((fileName) => ({
      fileName,
      filePath: path.join(folderPath, fileName),
    }))
}

async function findProject(project) {
  const doc = await client.fetch(
    `*[_type == "project" && (_id == $id || slug.current == $slug)] | order(_updatedAt desc)[0]{
      _id,
      titleEn,
      titleFa,
      slug
    }`,
    {
      id: project.id,
      slug: project.slug,
    },
  )

  if (!doc?._id) {
    throw new Error(`Project not found in Sanity: ${project.titleEn} / ${project.slug}`)
  }

  return doc
}

async function findOrUploadImage(project, image, index) {
  const originalFilename = `${project.slug}__pdf-page__${image.fileName}`

  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $originalFilename][0]{
      _id,
      url,
      originalFilename
    }`,
    {originalFilename},
  )

  if (existing?._id) {
    console.log(`Reusing page ${index + 1}: ${originalFilename}`)
    return existing
  }

  console.log(`Uploading page ${index + 1}: ${originalFilename}`)

  return client.assets.upload("image", fs.createReadStream(image.filePath), {
    filename: originalFilename,
  })
}

async function importProjectPdfPages(project) {
  const doc = await findProject(project)
  const images = getPdfPageImages(project)

  if (images.length === 0) {
    console.warn(`No PDF page images found for ${project.titleEn}`)
    return
  }

  console.log("")
  console.log(`Importing PDF pages for ${project.titleEn}`)
  console.log(`Found ${images.length} page image(s)`)

  const pdfPages = []

  for (let index = 0; index < images.length; index++) {
    const image = images[index]
    const asset = await findOrUploadImage(project, image, index)

    pdfPages.push({
      _type: "image",
      _key: `${project.slug}-pdf-page-${String(index + 1).padStart(3, "0")}`,
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
      altEn: `${project.titleEn} portfolio page ${index + 1}`,
      altFa: `صفحه ${index + 1} پورتفولیوی ${project.titleFa}`,
    })
  }

  await client
    .patch(doc._id)
    .set({
      pdfPages,
    })
    .commit()

  console.log(`Linked ${pdfPages.length} PDF page image(s) to ${project.titleEn}`)
}

async function main() {
  console.log("Starting PDF page image import...")

  for (const project of projects) {
    await importProjectPdfPages(project)
  }

  console.log("")
  console.log("Done. PDF page images imported and linked.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})