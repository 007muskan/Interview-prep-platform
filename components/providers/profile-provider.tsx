"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './auth-provider'

interface ProfileContextType {
  profileImage: string | null
  updateProfileImage: (imageUrl: string) => void
  refreshProfile: () => void
}

const ProfileContext = createContext<ProfileContextType>({
  profileImage: null,
  updateProfileImage: () => {},
  refreshProfile: () => {},
})

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const fetchProfileImage = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setProfileImage(data.user?.image || null)
      }
    } catch (error) {
      console.error("Failed to fetch profile image:", error)
    }
  }

  const updateProfileImage = (imageUrl: string) => {
    setProfileImage(imageUrl)
  }

  const refreshProfile = () => {
    fetchProfileImage()
  }

  useEffect(() => {
    fetchProfileImage()
  }, [user])

  return (
    <ProfileContext.Provider value={{ 
      profileImage, 
      updateProfileImage, 
      refreshProfile 
    }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfileContext = () => {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider')
  }
  return context
}