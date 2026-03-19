"use client"

import { useEffect, useState } from "react"

interface Insight {
  type: 'action' | 'improvement' | 'practice' | 'success' | 'focus' | 'engagement'
  category: 'resume' | 'interview' | 'learning' | 'activity'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  actionText: string
  actionUrl: string
}

interface Recommendation {
  type: 'skill' | 'practice'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  action: string
}

interface Goal {
  type: 'resume' | 'interview' | 'learning'
  title: string
  description: string
  target: number
  current: number
  deadline: string
}

interface Trends {
  weeklyActivity: number
  monthlyActivity: number
  interviewTrend: number
  learningTrend: number
}

interface DashboardInsights {
  insights: Insight[]
  trends: Trends
  recommendations: Recommendation[]
  goals: Goal[]
}

export function useDashboardInsights() {
  const [data, setData] = useState<DashboardInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInsights() {
      try {
        const response = await fetch("/api/dashboard/insights")
        if (!response.ok) throw new Error("Failed to fetch insights")
        const insights = await response.json()
        setData(insights)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
    
    // Refresh insights every 10 minutes
    const interval = setInterval(fetchInsights, 10 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return { 
    data, 
    loading, 
    error, 
    refetch: async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/dashboard/insights")
        if (!response.ok) throw new Error("Failed to fetch insights")
        const insights = await response.json()
        setData(insights)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
  }
}