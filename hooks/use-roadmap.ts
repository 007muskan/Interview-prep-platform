"use client"

import { useEffect, useState } from "react"

interface RoadmapItem {
  id: string
  title: string
  description: string | null
  status: string
  duration: string
  skills: string[]
  progress: number
  order: number
  resources: any
}

export function useRoadmap() {
  const [roadmaps, setRoadmaps] = useState<RoadmapItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRoadmap()
  }, [])

  async function fetchRoadmap() {
    try {
      const response = await fetch("/api/roadmap")
      if (!response.ok) throw new Error("Failed to fetch roadmap")
      const data = await response.json()
      setRoadmaps(data.roadmaps)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  async function updateProgress(id: string, progress: number, status: string) {
    try {
      const response = await fetch("/api/roadmap", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, progress, status }),
      })
      if (!response.ok) throw new Error("Failed to update progress")
      await fetchRoadmap()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  async function generateRoadmap(targetRole: string, currentSkills: string[], timeline: string) {
    try {
      setLoading(true)
      const response = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, currentSkills, timeline }),
      })
      if (!response.ok) throw new Error("Failed to generate roadmap")
      await fetchRoadmap()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return { roadmaps, loading, error, updateProgress, generateRoadmap, refetch: fetchRoadmap }
}
