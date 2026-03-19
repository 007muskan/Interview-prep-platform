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

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        preferences: true,
      }
    })

    if (!dbUser) {
      // Create user if doesn't exist
      const newUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.user_metadata?.full_name || null,
          image: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          preferences: {
            create: {
              emailNotifications: true,
              weeklyReports: true,
              jobRecommendations: false,
              theme: "light",
            }
          }
        },
        include: {
          preferences: true,
        }
      })
      return NextResponse.json({ user: newUser })
    }

    // Update email if it has changed
    if (dbUser.email !== user.email) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { email: user.email! },
        include: {
          preferences: true,
        }
      })
      return NextResponse.json({ user: updatedUser })
    }

    return NextResponse.json({ user: dbUser })
  } catch (error) {
    console.error("Fetch profile error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = createClient()
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await req.json()
    const { preferences, ...profileData } = data

    // Update user profile
    const user = await prisma.user.update({
      where: { id: authUser.id },
      data: {
        name: profileData.name,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        targetRole: profileData.targetRole,
        targetCompanies: profileData.targetCompanies,
        timeline: profileData.timeline,
      },
      include: {
        preferences: true,
      }
    })

    // Update preferences if provided
    if (preferences) {
      await prisma.userPreferences.upsert({
        where: { userId: authUser.id },
        update: preferences,
        create: {
          userId: authUser.id,
          ...preferences,
        }
      })
    }

    // Fetch updated user with preferences
    const updatedUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      include: {
        preferences: true,
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}
