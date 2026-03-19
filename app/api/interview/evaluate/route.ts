import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { evaluateAnswer } from "@/lib/ai/interview-generator"

export async function POST(req: Request) {
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

    const { question, answer } = await req.json()

    // Evaluate answer with AI
    const evaluation = await evaluateAnswer(question, answer)

    // Save interview to database
    try {
      const interview = await prisma.interview.create({
        data: {
          userId: user.id,
          category: "resume-based",
          question,
          answer,
          feedback: evaluation.feedback,
          score: evaluation.score,
          status: "completed",
        }
      })

      // Create activity
      await prisma.activity.create({
        data: {
          userId: user.id,
          type: "interview",
          title: "Resume-Based Interview",
          description: `Completed resume-based interview. Score: ${evaluation.score}/100`,
        }
      })
    } catch (dbError) {
      console.warn("Database save failed, but evaluation succeeded:", dbError)
      // Continue with evaluation even if DB save fails
    }

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error("Evaluate answer error:", error)
    return NextResponse.json(
      { error: "Failed to evaluate answer" },
      { status: 500 }
    )
  }
}
