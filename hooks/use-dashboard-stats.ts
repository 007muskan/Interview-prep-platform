"use client"

import { useEffect, useState } from "react"

interface DashboardStats {
  user: {
    name: string | null
    targetRole: string | null
    targetCompanies: string[]
    daysSinceJoined: number
    weeklyActivity: number
    completionStreak: number
  } | null
  resume: {
    id: string
    score: number | null
    atsScore: number | null
    contentScore: number | null
    formatScore: number | null
    skills: string[]
    strengths: string[]
    improvements: string[]
    lastUpdated: string
    skillRecommendations: string[]
  } | null
  interviews: {
    total: number
    completed: number
    averageScore: number
    trend: number
    recentPerformance: {
      score: number
      category: string
      date: string
    }[]
    categories: Record<string, number>
  }
  roadmap: {
    total: number
    completed: number
    inProgress: number
    totalProgress: number
    activeRoadmaps: {
      id: string
      title: string
      status: string
      progress: number
      skills: string[]
    }[]
    upcomingMilestones: {
      id: string
      title: string
      progress: number
      nextMilestone: number
    }[]
  }
  activities: {
    id: string
    type: string
    title: string
    description: string
    metadata: any
    createdAt: string
  }[]
  insights: {
    type: string
    title: string
    description: string
    action: string
    priority: 'high' | 'medium' | 'low'
  }[]
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/dashboard/stats")
        if (!response.ok) throw new Error("Failed to fetch stats")
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return { stats, loading, error, refetch: () => {
    setLoading(true)
    setError(null)
    fetchStats()
  }}
}

async function fetchStats() {
  const response = await fetch("/api/dashboard/stats")
  if (!response.ok) throw new Error("Failed to fetch stats")
  return response.json()
}
