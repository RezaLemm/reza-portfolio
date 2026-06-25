import {NextResponse} from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message:
        "PDF generation is disabled in production build. Run the local sync script manually from the project scripts folder when needed.",
    },
    {status: 501},
  )
}

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      message:
        "PDF generation is disabled in production build. Use POST locally only after restoring the local route.",
    },
    {status: 501},
  )
}