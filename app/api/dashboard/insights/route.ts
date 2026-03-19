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
      // Get comprehensive user data for insights
      const [dbUser, resumes, interviews, roadmaps, activities] = await Promise.all([
        prisma.user.findUnique({
          where: { id: user.id },
          select: {
            name: true,
            targetRole: true,
            targetCompanies: true,
            createdAt: true,
          }
        }),
        prisma.resume.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
        prisma.interview.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        prisma.roadmap.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
        }),
        prisma.activity.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 20,
        })
      ])

      // Generate advanced insights
      const insights = generateAdvancedInsights({
        user: dbUser,
        resumes,
        interviews,
        roadmaps,
        activities,
      })

      return NextResponse.json({
        insights,
        trends: calculateTrends(activities, interviews, roadmaps),
        recommendations: generateSmartRecommendations({
          user: dbUser,
          resumes,
          interviews,
          roadmaps,
        }),
        goals: generateGoalSuggestions(dbUser, resumes, interviews, roadmaps),
      })
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return NextResponse.json({
        insights: [],
        trends: {},
        recommendations: [],
        goals: [],
      })
    }
  } catch (error) {
    console.error("Dashboard insights error:", error)
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 }
    )
  }
}

function generateAdvancedInsights(data: any) {
  const insights = []
  const { user, resumes, interviews, roadmaps, activities } = data

  // Resume insights
  if (resumes.length > 0) {
    const latestResume = resumes[0]
    const resumeAge = Math.floor((Date.now() - new Date(latestResume.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    
    if (resumeAge > 90) {
      insights.push({
        type: 'action',
        category: 'resume',
        title: 'Resume Refresh Needed',
        description: `Your resume was last updated ${resumeAge} days ago. Consider updating it with recent achievements.`,
        priority: 'medium',
        actionText: 'Update Resume',
        actionUrl: '/resume-analyzer',
      })
    }

    if (latestResume.score && latestResume.score < 80) {
      insights.push({
        type: 'improvement',
        category: 'resume',
        title: 'Resume Score Below Target',
        description: `Your resume score is ${latestResume.score}%. Aim for 80+ to pass most ATS systems.`,
        priority: 'high',
        actionText: 'Improve Resume',
        actionUrl: '/resume-analyzer',
      })
    }
  }

  // Interview performance insights
  if (interviews.length >= 3) {
    const recentInterviews = interviews.slice(0, 5)
    const avgScore = recentInterviews.reduce((sum: number, i: any) => sum + (i.score || 0), 0) / recentInterviews.length
    
    if (avgScore < 70) {
      insights.push({
        type: 'practice',
        category: 'interview',
        title: 'Interview Skills Need Work',
        description: `Your average interview score is ${Math.round(avgScore)}%. Focus on common question types.`,
        priority: 'high',
        actionText: 'Practice More',
        actionUrl: '/interview-prep',
      })
    }

    // Check for improvement trend
    const oldAvg = interviews.slice(5, 10).reduce((sum: number, i: any) => sum + (i.score || 0), 0) / Math.min(5, interviews.slice(5, 10).length)
    if (avgScore > oldAvg + 10) {
      insights.push({
        type: 'success',
        category: 'interview',
        title: 'Interview Performance Improving',
        description: `Great progress! Your recent interview scores have improved by ${Math.round(avgScore - oldAvg)} points.`,
        priority: 'low',
        actionText: 'Keep Practicing',
        actionUrl: '/interview-prep',
      })
    }
  }

  // Learning progress insights
  const inProgressRoadmaps = roadmaps.filter((r: any) => r.status === 'in-progress')
  if (inProgressRoadmaps.length > 3) {
    insights.push({
      type: 'focus',
      category: 'learning',
      title: 'Too Many Active Learning Paths',
      description: `You have ${inProgressRoadmaps.length} active roadmaps. Consider focusing on 2-3 for better results.`,
      priority: 'medium',
      actionText: 'Review Roadmaps',
      actionUrl: '/roadmap',
    })
  }

  // Activity insights
  const recentActivity = activities.filter((a: any) => 
    Date.now() - new Date(a.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
  )
  
  if (recentActivity.length === 0 && activities.length > 0) {
    insights.push({
      type: 'engagement',
      category: 'activity',
      title: 'Stay Consistent',
      description: 'You haven\'t been active this week. Regular practice leads to better career outcomes.',
      priority: 'low',
      actionText: 'Get Back on Track',
      actionUrl: '/dashboard',
    })
  }

  return insights.slice(0, 5) // Return top 5 insights
}

function calculateTrends(activities: any[], interviews: any[], roadmaps: any[]) {
  const now = new Date()
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  return {
    weeklyActivity: activities.filter(a => new Date(a.createdAt) > lastWeek).length,
    monthlyActivity: activities.filter(a => new Date(a.createdAt) > lastMonth).length,
    interviewTrend: calculateInterviewTrend(interviews),
    learningTrend: calculateLearningTrend(roadmaps),
  }
}

function calculateInterviewTrend(interviews: any[]) {
  if (interviews.length < 4) return 0
  
  const recent = interviews.slice(0, 2).reduce((sum, i) => sum + (i.score || 0), 0) / 2
  const older = interviews.slice(2, 4).reduce((sum, i) => sum + (i.score || 0), 0) / 2
  
  return Math.round(recent - older)
}

function calculateLearningTrend(roadmaps: any[]) {
  const inProgress = roadmaps.filter(r => r.status === 'in-progress')
  const avgProgress = inProgress.length > 0 
    ? inProgress.reduce((sum, r) => sum + r.progress, 0) / inProgress.length
    : 0
  
  return Math.round(avgProgress)
}

function generateSmartRecommendations(data: any) {
  const recommendations = []
  const { user, resumes, interviews, roadmaps } = data

  // Role-based recommendations
  if (user?.targetRole) {
    const roleSkills = getRoleSkills(user.targetRole)
    const userSkills = resumes[0]?.skills || []
    const missingSkills = roleSkills.filter(skill => !userSkills.includes(skill))
    
    if (missingSkills.length > 0) {
      recommendations.push({
        type: 'skill',
        title: `Learn ${missingSkills[0]} for ${user.targetRole}`,
        description: `${missingSkills[0]} is a key skill for ${user.targetRole} roles. Consider adding it to your skillset.`,
        priority: 'high',
        action: 'Create Learning Plan',
      })
    }
  }

  // Interview category recommendations
  const interviewCategories = interviews.reduce((acc: any, i: any) => {
    acc[i.category] = (acc[i.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const leastPracticedCategory = Object.entries(interviewCategories)
    .sort(([,a], [,b]) => (a as number) - (b as number))[0]

  if (leastPracticedCategory && interviews.length > 5) {
    recommendations.push({
      type: 'practice',
      title: `Practice ${leastPracticedCategory[0]} Interviews`,
      description: `You've only practiced ${leastPracticedCategory[1]} ${leastPracticedCategory[0]} interviews. More practice could help.`,
      priority: 'medium',
      action: 'Start Practice Session',
    })
  }

  return recommendations.slice(0, 3)
}

function generateGoalSuggestions(user: any, resumes: any[], interviews: any[], roadmaps: any[]) {
  const goals = []

  // Resume goal
  if (!resumes.length) {
    goals.push({
      type: 'resume',
      title: 'Upload Your First Resume',
      description: 'Get AI-powered analysis and optimization suggestions',
      target: 1,
      current: 0,
      deadline: '1 week',
    })
  } else if (resumes[0].score < 80) {
    goals.push({
      type: 'resume',
      title: 'Achieve 80+ Resume Score',
      description: 'Optimize your resume for better ATS compatibility',
      target: 80,
      current: resumes[0].score || 0,
      deadline: '2 weeks',
    })
  }

  // Interview goal
  const completedInterviews = interviews.filter(i => i.status === 'completed').length
  if (completedInterviews < 10) {
    goals.push({
      type: 'interview',
      title: 'Complete 10 Mock Interviews',
      description: 'Build confidence through consistent practice',
      target: 10,
      current: completedInterviews,
      deadline: '1 month',
    })
  }

  // Learning goal
  const completedRoadmaps = roadmaps.filter(r => r.status === 'completed').length
  if (completedRoadmaps === 0) {
    goals.push({
      type: 'learning',
      title: 'Complete Your First Learning Path',
      description: 'Finish a roadmap to advance your skills',
      target: 1,
      current: 0,
      deadline: '6 weeks',
    })
  }

  return goals.slice(0, 3)
}

function getRoleSkills(role: string): string[] {
  const roleSkillMap: Record<string, string[]> = {
    "Software Engineer": ["JavaScript", "Python", "React", "Node.js", "SQL", "Git", "Docker", "AWS"],
    "Product Manager": ["Analytics", "Strategy", "Communication", "Leadership", "SQL", "A/B Testing"],
    "Data Scientist": ["Python", "R", "Machine Learning", "Statistics", "SQL", "TensorFlow", "Pandas"],
    "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform", "Jenkins"],
    "UX Designer": ["Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing"],
  }
  
  return roleSkillMap[role] || []
}