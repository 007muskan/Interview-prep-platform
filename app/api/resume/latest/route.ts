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
      return NextResponse.json({ resume: null, analysis: null })
    }

    // Return both resume and analysis for backward compatibility
    const analysis = {
      score: resume.score,
      atsScore: resume.atsScore,
      contentScore: resume.contentScore,
      formatScore: resume.formatScore,
      strengths: resume.strengths,
      improvements: resume.improvements,
      suggestions: resume.suggestions,
      skills: resume.skills
    }

    return NextResponse.json({ resume, analysis })
  } catch (error) {
    console.error("Fetch resume error:", error)
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    )
  }
}
