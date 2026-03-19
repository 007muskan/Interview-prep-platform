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

    let interviews = []
    let stats = {
      total: 0,
      completed: 0,
      averageScore: 0,
      totalDuration: 0,
      byCategory: {},
    }

    try {
      const dbInterviews = await prisma.interview.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 20
      })

      interviews = dbInterviews

      // Calculate stats
      const completed = interviews.filter(i => i.status === "completed")
      const averageScore = completed.length > 0
        ? completed.reduce((sum, i) => sum + (i.score || 0), 0) / completed.length
        : 0

      const totalDuration = completed.reduce((sum, i) => sum + (i.duration || 0), 0)

      const byCategory = interviews.reduce((acc, interview) => {
        acc[interview.category] = (acc[interview.category] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      stats = {
        total: interviews.length,
        completed: completed.length,
        averageScore: Math.round(averageScore),
        totalDuration,
        byCategory,
      }
    } catch (dbError) {
      console.warn("Database query failed, returning empty results:", dbError)
      // Return empty results if database fails
    }

    // Format sessions for frontend
    const sessions = interviews.map(interview => ({
      id: interview.id,
      question: interview.question,
      answer: interview.answer || "",
      score: interview.score || 0,
      feedback: interview.feedback || "",
      date: interview.createdAt.toISOString()
    }))

    return NextResponse.json({
      sessions,
      stats
    })
  } catch (error) {
    console.error("Fetch interview history error:", error)
    return NextResponse.json(
      { sessions: [], stats: { total: 0, completed: 0, averageScore: 0, totalDuration: 0, byCategory: {} } },
      { status: 200 }
    )
  }
}
