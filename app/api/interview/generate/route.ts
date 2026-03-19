import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateInterviewQuestion } from "@/lib/ai/interview-generator"

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

    const { category, resumeContent } = await req.json()

    const question = await generateInterviewQuestion(category, resumeContent)

    return NextResponse.json({ question })
  } catch (error) {
    console.error("Generate question error:", error)
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    )
  }
}
