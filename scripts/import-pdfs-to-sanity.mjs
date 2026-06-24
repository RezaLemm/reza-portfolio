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

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is missing")
if (!token) throw new Error("SANITY_API_WRITE_TOKEN is missing")

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
})

const projects = [
  {
    id: "project.real-roastery",
    slug: "real-roastery",
    folder: "Real Roastery",
    titleEn: "Real Roastery",
    titleFa: "Real Roastery",
  },
  {
    id: "project.gazak",
    slug: "gazak",
    folder: "Gazak",
    titleEn: "Gazak",
    titleFa: "گزک",
  },
  {
    id: "project.khane-irani",
    slug: "khane-irani",
    folder: "KHANE IRANI",
    titleEn: "Khane Irani",
    titleFa: "خانه ایرانی",
  },
]

function findPdf(project) {
  const folderPath = path.join(root, "Photos", project.folder)

  if (!fs.existsSync(folderPath)) {
    console.warn(`Folder missing: Photos/${project.folder}`)
    return null
  }

  const pdf = fs
    .readdirSync(folderPath)
    .find((fileName) => path.extname(fileName).toLowerCase() === ".pdf")

  if (!pdf) {
    console.warn(`No PDF found for ${project.titleEn}`)
    return null
  }

  return {
    fileName: pdf,
    filePath: path.join(folderPath, pdf),
  }
}

async function findOrUploadPdf(project, pdf) {
  const sanityFileName = `${project.slug}__${pdf.fileName}`

  const existing = await client.fetch(
    `*[_type == "sanity.fileAsset" && originalFilename == $filename][0]{
      _id,
      url,
      originalFilename
    }`,
    {filename: sanityFileName},
  )

  if (existing?._id) {
    console.log(`Reusing PDF: ${sanityFileName}`)
    return existing
  }

  console.log(`Uploading PDF: ${sanityFileName}`)

  return client.assets.upload("file", fs.createReadStream(pdf.filePath), {
    filename: sanityFileName,
    contentType: "application/pdf",
  })
}

async function main() {
  console.log("Starting PDF import...")

  for (const project of projects) {
    const pdf = findPdf(project)
    if (!pdf) continue

    const asset = await findOrUploadPdf(project, pdf)

    await client
      .patch(project.id)
      .set({
        portfolioPdf: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
          titleEn: "View full portfolio PDF",
          titleFa: "مشاهده فایل کامل پورتفولیو",
        },
      })
      .commit()

    console.log(`PDF linked: ${project.titleEn}`)
  }

  console.log("Done. PDFs imported and linked.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
