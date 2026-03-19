import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { generateRoadmap } from "@/lib/ai/roadmap-generator"

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

    const { targetRole, currentSkills, timeline } = await req.json()

    // Generate roadmap with AI
    const roadmapItems = await generateRoadmap(targetRole, currentSkills, timeline)

    // Delete existing roadmap
    await prisma.roadmap.deleteMany({
      where: { userId: user.id }
    })

    // Create new roadmap items
    const createdItems = await Promise.all(
      roadmapItems.map((item, index) =>
        prisma.roadmap.create({
          data: {
            userId: user.id,
            title: item.title,
            description: item.description,
            duration: item.duration,
            skills: item.skills,
            status: index === 0 ? "in-progress" : "upcoming",
            order: index,
            resources: item.resources,
          }
        })
      )
    )

    return NextResponse.json({ roadmap: createdItems })
  } catch (error) {
    console.error("Generate roadmap error:", error)
    return NextResponse.json(
      { error: "Failed to generate roadmap" },
      { status: 500 }
    )
  }
}
