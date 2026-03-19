"use client"

import { Search, Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/providers/auth-provider"
import { useProfileContext } from "@/components/providers/profile-provider"

export function Header() {
  const { user, loading } = useAuth()
  const { profileImage } = useProfileContext()

  const displayName = user?.user_metadata?.name || user?.user_metadata?.full_name || ""
  const displayImage = profileImage || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || ""

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 transition-colors duration-300">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <button className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
        
        <Avatar>
          <AvatarImage src={displayImage} alt="User" />
          <AvatarFallback className="bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-200">
            {loading ? '...' : (displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U')}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
