import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const roadmaps = await prisma.roadmap.findMany({
      where: { userId: user.id },
      orderBy: { order: "asc" }
    })

    return NextResponse.json({ roadmaps })
  } catch (error) {
    console.error("Fetch roadmap error:", error)
    return NextResponse.json(
      { error: "Failed to fetch roadmap" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id, progress, status } = await req.json()

    const roadmap = await prisma.roadmap.update({
      where: { id },
      data: {
        progress,
        status,
      }
    })

    return NextResponse.json({ roadmap })
  } catch (error) {
    console.error("Update roadmap error:", error)
    return NextResponse.json(
      { error: "Failed to update roadmap" },
      { status: 500 }
    )
  }
}
