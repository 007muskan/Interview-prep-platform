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
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      )
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 2MB" },
        { status: 400 }
      )
    }

    // Convert file to base64 for simple storage (fallback if Supabase storage not configured)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    try {
      // Try to use Supabase Storage first
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (!uploadError && uploadData) {
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("profile-images")
          .getPublicUrl(filePath)

        // Update user profile with new image URL
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { image: publicUrl },
          include: {
            preferences: true,
          }
        })

        return NextResponse.json({ 
          user: updatedUser,
          imageUrl: publicUrl 
        })
      }
    } catch (storageError) {
      console.log("Supabase storage not available, using base64 fallback")
    }

    // Fallback: Store as base64 data URL
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { image: dataUrl },
      include: {
        preferences: true,
      }
    })

    return NextResponse.json({ 
      user: updatedUser,
      imageUrl: dataUrl 
    })
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}