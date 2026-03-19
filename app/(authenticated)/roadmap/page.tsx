"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Clock, 
  BookOpen, 
  Code, 
  Target, 
  Lightbulb, 
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Award
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RoadmapMilestone {
  title: string
  description: string
  duration: string
  skills: string[]
  resources: {
    courses: string[]
    books: string[]
    projects: string[]
    documentation: string[]
  }
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  prerequisites: string[]
}

interface SkillRoadmap {
  skill: string
  description: string
  totalDuration: string
  priority?: "High" | "Medium" | "Low"
  category?: "Technical" | "Soft Skills" | "Tools" | "Frameworks"
  milestones: RoadmapMilestone[]
}

export default function RoadmapPage() {
  const [skillRoadmaps, setSkillRoadmaps] = useState<SkillRoadmap[]>([])
  const [loading, setLoading] = useState(false)
  const [hasResumeAnalysis, setHasResumeAnalysis] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkResumeAnalysis()
  }, [])

  const checkResumeAnalysis = async () => {
    try {
      const response = await fetch('/api/resume/latest')
      if (response.ok) {
        const data = await response.json()
        setHasResumeAnalysis(!!data.resume && !!data.analysis)
      }
    } catch (error) {
      console.error('Error checking resume analysis:', error)
    }
  }

  const generateSkillRoadmaps = async () => {
    setLoading(true)
    try {
      const resumeResponse = await fetch('/api/resume/latest')
      if (!resumeResponse.ok) {
        throw new Error('No resume analysis found')
      }

      const resumeData = await resumeResponse.json()
      const analysis = resumeData.analysis

      if (!analysis) {
        throw new Error('No analysis data found')
      }

      let skillGaps = []
      if (analysis.suggestions?.skillGaps && Array.isArray(analysis.suggestions.skillGaps)) {
        skillGaps = analysis.suggestions.skillGaps
      } else if (analysis.suggestions?.skills && Array.isArray(analysis.suggestions.skills)) {
        skillGaps = analysis.suggestions.skills.map((skill: string) => ({
          skill,
          priority: "Medium",
          reason: "Recommended for career advancement",
          category: "Technical"
        }))
      }

      if (skillGaps.length === 0) {
        toast({
          title: "No skill gaps found",
          description: "Your resume analysis didn't identify specific skill gaps to address.",
          variant: "destructive",
        })
        return
      }

      const roadmapResponse = await fetch('/api/roadmap/skill-based', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skillGaps: skillGaps,
          currentSkills: analysis.skills || [],
          targetRole: "Full Stack Developer"
        }),
      })

      if (!roadmapResponse.ok) {
        throw new Error('Failed to generate roadmaps')
      }

      const roadmapData = await roadmapResponse.json()
      setSkillRoadmaps(roadmapData.roadmaps)

      toast({
        title: "Success!",
        description: `Generated ${roadmapData.roadmaps.length} personalized learning roadmaps.`,
      })
    } catch (error) {
      console.error('Error generating roadmaps:', error)
      toast({
        title: "Error",
        description: "Failed to generate roadmaps. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500"
      case "Medium": return "bg-yellow-500"
      case "Low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return <Star className="h-4 w-4 text-green-500" />
      case "Intermediate": return <TrendingUp className="h-4 w-4 text-yellow-500" />
      case "Advanced": return <Award className="h-4 w-4 text-red-500" />
      default: return <Star className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Target className="h-4 w-4" />
            AI-Powered Learning Paths
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Personalized Roadmaps
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your career with AI-generated learning paths based on your resume analysis
          </p>
        </div>

        {/* No Resume Analysis State */}
        {!hasResumeAnalysis && skillRoadmaps.length === 0 && (
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Ready to Accelerate Your Career?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Upload your resume to get AI-powered learning roadmaps tailored to your skill gaps. 
                  Our intelligent system identifies exactly what you need to learn to reach the next level.
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => window.location.href = '/resume-analyzer'}
                >
                  <Target className="h-5 w-5 mr-2" />
                  Analyze My Resume
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Generate Roadmaps Button */}
        {hasResumeAnalysis && skillRoadmaps.length === 0 && (
          <div className="text-center mb-12">
            <Button 
              size="lg" 
              onClick={generateSkillRoadmaps} 
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 text-lg"
            >
              {loading ? (
                <>
                  <Clock className="h-5 w-5 mr-2 animate-spin" />
                  Generating Your Roadmaps...
                </>
              ) : (
                <>
                  <Target className="h-5 w-5 mr-2" />
                  Generate Learning Roadmaps
                </>
              )}
            </Button>
          </div>
        )}

        {/* Roadmaps Grid */}
        {skillRoadmaps.length > 0 && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{skillRoadmaps.length}</div>
                  <div className="text-gray-600 dark:text-gray-300">Learning Paths</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {skillRoadmaps.reduce((total, roadmap) => total + roadmap.milestones.length, 0)}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">Total Milestones</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {skillRoadmaps.reduce((total, roadmap) => 
                      total + parseInt(roadmap.totalDuration.split('-')[0] || '0'), 0
                    )}+
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">Weeks to Master</div>
                </CardContent>
              </Card>
            </div>

            {/* Roadmaps */}
            <div className="grid lg:grid-cols-2 gap-8">
              {skillRoadmaps.map((roadmap, index) => (
                <Card key={index} className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-8">
                    {/* Roadmap Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(roadmap.priority || 'Medium')}`}></div>
                          <Badge variant="outline" className="text-xs">
                            {roadmap.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {roadmap.totalDuration}
                          </Badge>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {roadmap.skill}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {roadmap.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Overview */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-300">Learning Progress</span>
                        <span className="text-blue-600 font-medium">0% Complete</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>

                    {/* Milestones Preview */}
                    <div className="space-y-4 mb-6">
                      {roadmap.milestones.slice(0, 3).map((milestone, milestoneIndex) => (
                        <div key={milestoneIndex} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                {milestoneIndex + 1}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                              {milestone.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {getDifficultyIcon(milestone.difficulty)}
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {milestone.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {roadmap.milestones.length > 3 && (
                        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                          +{roadmap.milestones.length - 3} more milestones
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Play className="h-4 w-4 mr-2" />
                        Start Learning
                      </Button>
                      <Button variant="outline" size="icon">
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Bar */}
            <div className="text-center pt-8">
              <Button 
                variant="outline" 
                size="lg"
                onClick={generateSkillRoadmaps}
                disabled={loading}
              >
                <Target className="h-5 w-5 mr-2" />
                Regenerate Roadmaps
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}