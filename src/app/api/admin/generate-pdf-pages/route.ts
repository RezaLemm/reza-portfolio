import {NextResponse} from "next/server"
import {spawnSync} from "node:child_process"
import path from "node:path"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const slug = String(body?.slug || "").trim()

    if (!slug) {
      return NextResponse.json(
        {ok: false, message: "Project slug is required."},
        {status: 400}
      )
    }

    const scriptPath = path.join(
      process.cwd(),
      "scripts",
      "sync-sanity-pdf-pages.mjs"
    )

    const result = spawnSync(
      "node",
      [scriptPath, "--slug", slug, "--force"],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        shell: process.platform === "win32",
      }
    )

    const output = `${result.stdout || ""}${result.stderr || ""}`.trim()

    if (result.error) {
      return NextResponse.json(
        {
          ok: false,
          message: result.error.message,
          output,
        },
        {status: 500}
      )
    }

    if (result.status !== 0) {
      return NextResponse.json(
        {
          ok: false,
          message: `PDF generation failed with exit code ${result.status}`,
          output,
        },
        {status: 500}
      )
    }

    return NextResponse.json({
      ok: true,
      message: "PDF pages generated successfully.",
      output,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {status: 500}
    )
  }
}