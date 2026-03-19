"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/auth-provider"

export interface UserProfile {
  id: string
  name: string | null
  email: string
  phone: string | null
  location: string | null
  bio: string | null
  targetRole: string | null
  targetCompanies: string[]
  timeline: string | null
  image: string | null
  preferences?: {
    emailNotifications: boolean
    weeklyReports: boolean
    jobRecommendations: boolean
    theme: string
  }
}

export function useProfile() {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (!authUser) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/profile")
      
      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setProfile(data.user)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile")
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authUser) return

    try {
      setSaving(true)
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const data = await response.json()
      setProfile(data.user)
      setError(null)
      return data.user
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
      throw err
    } finally {
      setSaving(false)
    }
  }

  const uploadImage = async (file: File) => {
    if (!authUser) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/profile/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      const data = await response.json()
      setProfile(data.user)
      setError(null)
      return data.imageUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
      throw err
    } finally {
      setUploadingImage(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [authUser])

  return {
    profile,
    loading,
    saving,
    uploadingImage,
    error,
    updateProfile,
    uploadImage,
    refetch: fetchProfile,
  }
}