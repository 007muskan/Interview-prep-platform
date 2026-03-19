import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

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

    const resume = await prisma.resume.findFirst({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    if (!resume) {
      return NextResponse.json({ error: "No resume found" }, { status: 404 })
    }

    // Debug the actual data structure
    console.log("=== RESUME DEBUG ===")
    console.log("Resume ID:", resume.id)
    console.log("Suggestions type:", typeof resume.suggestions)
    console.log("Suggestions content:", JSON.stringify(resume.suggestions, null, 2))
    console.log("Skills:", resume.skills)
    console.log("===================")

    return NextResponse.json({
      resumeId: resume.id,
      suggestions: resume.suggestions,
      skills: resume.skills,
      suggestionsType: typeof resume.suggestions,
      hasSkillGaps: !!(resume.suggestions as any)?.skillGaps,
      skillGapsLength: Array.isArray((resume.suggestions as any)?.skillGaps) ? (resume.suggestions as any).skillGaps.length : 0
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      { error: "Debug failed" },
      { status: 500 }
    )
  }
}