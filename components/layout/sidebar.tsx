"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Map, MessageSquare, User, Sparkles, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Resume Analyzer", href: "/resume-analyzer", icon: FileText },
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Interview Prep", href: "/interview-prep", icon: MessageSquare },
  { name: "Profile", href: "/profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleLogout = async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error("Sign out error:", error)
        toast({
          title: "Error signing out",
          description: "Please try again",
          variant: "destructive",
        })
        return
      }

      // Clear any local storage or session data if needed
      localStorage.removeItem('career-platform-theme')
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out",
      })
      
      // Force a hard redirect to ensure clean state
      window.location.href = "/auth"
      
    } catch (error) {
      console.error("Unexpected error during sign out:", error)
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-6">
        <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
        <span className="text-lg font-bold text-gray-900 dark:text-white truncate">Career AI</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary dark:bg-primary/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <Button
          onClick={handleLogout}
          disabled={isSigningOut}
          variant="outline"
          className="w-full justify-start gap-3 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className={cn("h-4 w-4", isSigningOut && "animate-spin")} />
          {isSigningOut ? "Signing Out..." : "Sign Out"}
        </Button>
      </div>
    </div>
  )
}
