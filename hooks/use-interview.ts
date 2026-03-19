"use client"

import { useState } from "react"

export function useInterview() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generateQuestion(category: string, resumeContent?: string) {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, resumeContent }),
      })
      if (!response.ok) throw new Error("Failed to generate question")
      const data = await response.json()
      return data.question
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function evaluateAnswer(question: string, answer: string, category: string) {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, category }),
      })
      if (!response.ok) throw new Error("Failed to evaluate answer")
      const data = await response.json()
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { generateQuestion, evaluateAnswer, loading, error }
}
