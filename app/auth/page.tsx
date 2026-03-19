import Link from "next/link"
import { Layers } from "lucide-react"
import { AuthForm } from "./auth-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Layers className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Career Intelligence Platform</span>
          </div>
          {/* <div className="flex gap-4 justify-center text-sm text-gray-500 dark:text-gray-400">
            <Link href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Support</Link>
          </div> */}
        </div>

        <AuthForm />

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
          © 2024 Career Intelligence Platform. All rights reserved.
        </p>
      </div>
    </div>
  )
}
