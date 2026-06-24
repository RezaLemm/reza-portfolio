import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import {spawnSync} from "node:child_process"
import {createClient} from "@sanity/client"

const root = process.cwd()

function loadEnv(filePath) {
  const fullPath = path.resolve(root, filePath)

  if (!fs.existsSync(fullPath)) return

  const lines = fs.readFileSync(fullPath, "utf8").split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (!match) continue

    const key = match[1].trim()
    let value = match[2].trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

function getArg(name) {
  const exact = `--${name}`
  const withEqual = `${exact}=`

  const equalArg = process.argv.find((item) => item.startsWith(withEqual))
  if (equalArg) return equalArg.slice(withEqual.length)

  const index = process.argv.indexOf(exact)
  if (index >= 0) return process.argv[index + 1]

  return undefined
}

function fileHash(filePath) {
  return crypto
    .createHash("sha1")
    .update(fs.readFileSync(filePath))
    .digest("hex")
}

async function downloadFile(url, outputPath) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())

  fs.mkdirSync(path.dirname(outputPath), {recursive: true})
  fs.writeFileSync(outputPath, buffer)
}

function runConverter({pdfPath, outDir, dpi}) {
  const scriptPath = path.resolve(root, "scripts", "convert-single-pdf-to-images.py")

  const candidates = [
    {
      command: process.env.PYTHON || "python",
      args: [scriptPath, "--pdf", pdfPath, "--out", outDir, "--dpi", String(dpi)],
    },
    {
      command: "py",
      args: ["-3", scriptPath, "--pdf", pdfPath, "--out", outDir, "--dpi", String(dpi)],
    },
  ]

  let lastError = null

  for (const candidate of candidates) {
    const result = spawnSync(candidate.command, candidate.args, {
      cwd: root,
      stdio: "inherit",
      shell: false,
    })

    if (result.error) {
      lastError = result.error
      continue
    }

    if (result.status === 0) return

    throw new Error(`PDF converter failed with exit code ${result.status}`)
  }

  throw lastError || new Error("No Python command worked.")
}

async function findAssetByFilename(client, assetType, filename) {
  const typeName = assetType === "image" ? "sanity.imageAsset" : "sanity.fileAsset"

  return client.fetch(
    `*[_type == $typeName && originalFilename == $filename][0]{_id}`,
    {typeName, filename}
  )
}

async function uploadOrReuseAsset(client, assetType, filePath, filename) {
  const existing = await findAssetByFilename(client, assetType, filename)

  if (existing?._id) {
    console.log(`Reuse ${assetType}: ${filename}`)
    return existing._id
  }

  console.log(`Upload ${assetType}: ${filename}`)

  const asset = await client.assets.upload(
    assetType,
    fs.createReadStream(filePath),
    {filename}
  )

  return asset._id
}

loadEnv(".env.local")

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN
const slugArg = getArg("slug")
const dpi = Number(getArg("dpi") || 180)
const force = process.argv.includes("--force")

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity env values. Check .env.local")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  token,
  useCdn: false,
})

const query = slugArg
  ? `*[_type == "project" && slug.current == $slug] | order(_updatedAt desc)[0...1]{
      _id,
      titleEn,
      titleFa,
      "slug": slug.current,
      "pdfUrl": portfolioPdf.asset->url,
      "pdfAssetId": portfolioPdf.asset->_id,
      "pdfFilename": portfolioPdf.asset->originalFilename,
      "syncedAssetId": pdfPagesSourceAssetId,
      "pageCount": count(pdfPages)
    }`
  : `*[_type == "project" && defined(portfolioPdf.asset)] | order(_updatedAt desc){
      _id,
      titleEn,
      titleFa,
      "slug": slug.current,
      "pdfUrl": portfolioPdf.asset->url,
      "pdfAssetId": portfolioPdf.asset->_id,
      "pdfFilename": portfolioPdf.asset->originalFilename,
      "syncedAssetId": pdfPagesSourceAssetId,
      "pageCount": count(pdfPages)
    }`

const projects = await client.fetch(query, {slug: slugArg})

if (!projects.length) {
  console.log(slugArg ? `No project found for slug: ${slugArg}` : "No project with portfolioPdf found.")
  process.exit(0)
}

for (const project of projects) {
  if (!project.slug) {
    console.log(`Skip project without slug: ${project._id}`)
    continue
  }

  if (!project.pdfUrl || !project.pdfAssetId) {
    console.log(`Skip ${project.slug}: no portfolioPdf asset`)
    continue
  }

  if (!force && project.syncedAssetId === project.pdfAssetId && project.pageCount > 0) {
    console.log(`Skip ${project.slug}: already synced`)
    continue
  }

  console.log("")
  console.log(`Sync PDF pages for project: ${project.slug}`)

  const safeFilename = project.pdfFilename || `${project.slug}.pdf`
  const pdfDir = path.resolve(root, ".tmp", "sanity-pdfs", project.slug)
  const pdfPath = path.resolve(pdfDir, safeFilename)

  await downloadFile(project.pdfUrl, pdfPath)

  const pdfHash = fileHash(pdfPath).slice(0, 12)
  const outDir = path.resolve(root, ".tmp", "pdf-pages", project.slug)

  runConverter({
    pdfPath,
    outDir,
    dpi,
  })

  const pageFiles = fs
    .readdirSync(outDir)
    .filter((file) => /^page-\d{3}\.png$/.test(file))
    .sort()

  if (!pageFiles.length) {
    throw new Error(`No page images created for ${project.slug}`)
  }

  const titleBase = project.titleEn || project.titleFa || project.slug

  const pdfPages = []

  for (let index = 0; index < pageFiles.length; index++) {
    const file = pageFiles[index]
    const pagePath = path.resolve(outDir, file)
    const pageNumber = index + 1
    const pageHash = fileHash(pagePath).slice(0, 12)
    const assetFilename = `${project.slug}-${pdfHash}-${pageHash}-${file}`

    const imageAssetId = await uploadOrReuseAsset(
      client,
      "image",
      pagePath,
      assetFilename
    )

    pdfPages.push({
      _key: `pdf-page-${String(pageNumber).padStart(3, "0")}-${pageHash}`,
      _type: "image",
      asset: {
        _type: "reference",
        _ref: imageAssetId,
      },
      altEn: `${titleBase} PDF page ${pageNumber}`,
      altFa: `${titleBase} PDF page ${pageNumber}`,
    })
  }

  await client
    .patch(project._id)
    .set({
      pdfPages,
      pdfPagesSourceAssetId: project.pdfAssetId,
      pdfPagesSyncedAt: new Date().toISOString(),
    })
    .commit({
      autoGenerateArrayKeys: true,
    })

  console.log(`Done ${project.slug}: linked ${pdfPages.length} page image(s).`)
}

console.log("")
console.log("PDF sync finished.")