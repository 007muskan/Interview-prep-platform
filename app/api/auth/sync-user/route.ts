import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Check if user exists in our database
    let dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    // If not, create them
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          image: user.user_metadata?.avatar_url,
        },
      })

      // Create default preferences
      await prisma.userPreferences.create({
        data: {
          userId: dbUser.id,
        },
      })
    }

    return NextResponse.json({ user: dbUser })
  } catch (error) {
    console.error("Sync user error:", error)
    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    )
  }
}
