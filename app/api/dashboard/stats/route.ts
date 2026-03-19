import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    try {
      // Get user info first
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          name: true,
          targetRole: true,
          targetCompanies: true,
          createdAt: true,
        }
      })

      // Get latest resume with enhanced data
      const latestResume = await prisma.resume.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          score: true,
          atsScore: true,
          contentScore: true,
          formatScore: true,
          skills: true,
          strengths: true,
          improvements: true,
          createdAt: true,
          updatedAt: true,
        }
      })

      // Get interview stats with more details
      const interviews = await prisma.interview.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          category: true,
          score: true,
          status: true,
          createdAt: true,
          duration: true,
        }
      })

      const completedInterviews = interviews.filter(i => i.status === "completed")
      const averageScore = completedInterviews.length > 0
        ? completedInterviews.reduce((sum, i) => sum + (i.score || 0), 0) / completedInterviews.length
        : 0

      // Calculate interview performance trends
      const recentInterviews = completedInterviews
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)

      const interviewTrend = recentInterviews.length >= 2 
        ? recentInterviews[0].score! - recentInterviews[recentInterviews.length - 1].score!
        : 0

      // Get roadmap progress with enhanced metrics
      const roadmaps = await prisma.roadmap.findMany({
        where: { userId: user.id },
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          status: true,
          progress: true,
          skills: true,
          duration: true,
          createdAt: true,
          updatedAt: true,
        }
      })

      const completedRoadmaps = roadmaps.filter(r => r.status === "completed")
      const inProgressRoadmaps = roadmaps.filter(r => r.status === "in-progress")
      const totalProgress = roadmaps.length > 0 
        ? roadmaps.reduce((sum, r) => sum + r.progress, 0) / roadmaps.length
        : 0

      // Get recent activities with enhanced data
      const activities = await prisma.activity.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          type: true,
          title: true,
          description: true,
          metadata: true,
          createdAt: true,
        }
      })

      // Calculate user engagement metrics
      const daysSinceJoined = Math.floor(
        (Date.now() - new Date(dbUser?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)
      )

      const weeklyActivity = activities.filter(
        a => Date.now() - new Date(a.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
      ).length

      // Generate skill recommendations based on target role and current skills
      const skillRecommendations = generateSkillRecommendations(
        latestResume?.skills || [],
        dbUser?.targetRole
      )

      // Calculate completion streaks
      const completionStreak = calculateCompletionStreak(activities)

      return NextResponse.json({
        user: {
          ...dbUser,
          daysSinceJoined,
          weeklyActivity,
          completionStreak,
        },
        resume: latestResume ? {
          ...latestResume,
          lastUpdated: latestResume.updatedAt,
          skillRecommendations,
        } : null,
        interviews: {
          total: interviews.length,
          completed: completedInterviews.length,
          averageScore: Math.round(averageScore),
          trend: interviewTrend,
          recentPerformance: recentInterviews.map(i => ({
            score: i.score,
            category: i.category,
            date: i.createdAt,
          })),
          categories: getInterviewCategories(interviews),
        },
        roadmap: {
          total: roadmaps.length,
          completed: completedRoadmaps.length,
          inProgress: inProgressRoadmaps.length,
          totalProgress: Math.round(totalProgress),
          activeRoadmaps: inProgressRoadmaps.slice(0, 3),
          upcomingMilestones: getUpcomingMilestones(roadmaps),
        },
        activities: activities.slice(0, 5),
        insights: generatePersonalizedInsights({
          user: dbUser,
          resume: latestResume,
          interviews: completedInterviews,
          roadmaps,
          activities,
        }),
      })
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      
      // Return fallback data when database is unavailable
      return NextResponse.json({
        user: {
          name: user.user_metadata?.name || "User",
          targetRole: null,
          targetCompanies: [],
          daysSinceJoined: 0,
          weeklyActivity: 0,
          completionStreak: 0,
        },
        resume: null,
        interviews: {
          total: 0,
          completed: 0,
          averageScore: 0,
          trend: 0,
          recentPerformance: [],
          categories: {},
        },
        roadmap: {
          total: 0,
          completed: 0,
          inProgress: 0,
          totalProgress: 0,
          activeRoadmaps: [],
          upcomingMilestones: [],
        },
        activities: [],
        insights: [],
      })
    }
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    )
  }
}

// Helper functions for enhanced dashboard analytics
function generateSkillRecommendations(currentSkills: string[], targetRole?: string | null): string[] {
  const roleSkillMap: Record<string, string[]> = {
    "Software Engineer": ["TypeScript", "Docker", "Kubernetes", "AWS", "GraphQL"],
    "Product Manager": ["Analytics", "A/B Testing", "Roadmapping", "Stakeholder Management", "Market Research"],
    "Data Scientist": ["Machine Learning", "Python", "R", "TensorFlow", "Statistical Analysis"],
    "DevOps Engineer": ["Terraform", "Jenkins", "Monitoring", "CI/CD", "Infrastructure as Code"],
    "UX Designer": ["Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing"],
    "Marketing Manager": ["SEO", "Content Strategy", "Social Media", "Campaign Management", "Analytics"],
  }

  if (!targetRole) return []

  const recommendedSkills = roleSkillMap[targetRole] || []
  return recommendedSkills.filter(skill => !currentSkills.includes(skill)).slice(0, 5)
}

function calculateCompletionStreak(activities: any[]): number {
  const completionActivities = activities
    .filter(a => a.type.includes('completed') || a.type.includes('finished'))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  let streak = 0
  let currentDate = new Date()
  
  for (const activity of completionActivities) {
    const activityDate = new Date(activity.createdAt)
    const daysDiff = Math.floor((currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff <= streak + 1) {
      streak++
      currentDate = activityDate
    } else {
      break
    }
  }
  
  return streak
}

function getInterviewCategories(interviews: any[]): Record<string, number> {
  const categories: Record<string, number> = {}
  
  interviews.forEach(interview => {
    if (interview.category) {
      categories[interview.category] = (categories[interview.category] || 0) + 1
    }
  })
  
  return categories
}

function getUpcomingMilestones(roadmaps: any[]): any[] {
  return roadmaps
    .filter(r => r.status === 'in-progress' && r.progress < 100)
    .map(r => ({
      id: r.id,
      title: r.title,
      progress: r.progress,
      nextMilestone: Math.ceil(r.progress / 25) * 25, // Next 25% milestone
    }))
    .slice(0, 3)
}

function generatePersonalizedInsights(data: any): any[] {
  const insights = []
  const { user, resume, interviews, roadmaps, activities } = data

  // Resume insights
  if (resume) {
    if (resume.score < 70) {
      insights.push({
        type: 'improvement',
        title: 'Resume Optimization Opportunity',
        description: `Your resume score is ${resume.score}%. Focus on ${resume.improvements?.[0] || 'formatting and keywords'} to improve ATS compatibility.`,
        action: 'Optimize Resume',
        priority: 'high',
      })
    }

    if (resume.skills.length < 5) {
      insights.push({
        type: 'skill',
        title: 'Expand Your Skill Set',
        description: 'Consider adding more relevant skills to your resume to match job requirements better.',
        action: 'Add Skills',
        priority: 'medium',
      })
    }
  }

  // Interview insights
  if (interviews.length > 0) {
    const avgScore = interviews.reduce((sum: number, i: any) => sum + (i.score || 0), 0) / interviews.length
    if (avgScore < 70) {
      insights.push({
        type: 'practice',
        title: 'Interview Performance',
        description: `Your average interview score is ${Math.round(avgScore)}%. Practice more to improve your performance.`,
        action: 'Practice Interviews',
        priority: 'high',
      })
    }
  }

  // Roadmap insights
  const inProgressRoadmaps = roadmaps.filter((r: any) => r.status === 'in-progress')
  if (inProgressRoadmaps.length === 0 && roadmaps.length === 0) {
    insights.push({
      type: 'learning',
      title: 'Start Your Learning Journey',
      description: 'Create a personalized learning roadmap to advance your career goals.',
      action: 'Create Roadmap',
      priority: 'medium',
    })
  }

  // Activity insights
  const recentActivity = activities.filter((a: any) => 
    Date.now() - new Date(a.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
  )
  
  if (recentActivity.length === 0) {
    insights.push({
      type: 'engagement',
      title: 'Stay Active',
      description: 'You haven\'t been active recently. Regular practice leads to better career outcomes.',
      action: 'Take Action',
      priority: 'low',
    })
  }

  return insights.slice(0, 3) // Return top 3 insights
}
