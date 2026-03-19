"use client"

import { FileText, Briefcase, GraduationCap, TrendingUp, Calendar, Target, Lightbulb } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ResumeScore } from "@/components/dashboard/resume-score"
import { SkillGap } from "@/components/dashboard/skill-gap"
import { RecommendedRoles } from "@/components/dashboard/recommended-roles"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { GoalsProgress } from "@/components/dashboard/goals-progress"
import { LiveUpdates } from "@/components/dashboard/live-updates"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { useDashboardInsights } from "@/hooks/use-dashboard-insights"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const { stats, loading, error, refetch } = useDashboardStats()
  const { data: insights, loading: insightsLoading } = useDashboardInsights()

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full transition-colors duration-300">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-full">
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400">Error loading dashboard: {error}</p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const userName = stats?.user?.name || "User"
  const resumeScore = stats?.resume?.score || 0
  const hasResume = !!stats?.resume
  const interviewsCompleted = stats?.interviews?.completed || 0
  const roadmapProgress = stats?.roadmap?.totalProgress || 0
  const weeklyActivity = stats?.user?.weeklyActivity || 0
  const completionStreak = stats?.user?.completionStreak || 0

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full transition-colors duration-300">
      {/* Header with dynamic greeting */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {weeklyActivity > 0 
              ? `You've been active ${weeklyActivity} times this week. Keep it up!`
              : "Here's what's happening with your career journey today."
            }
          </p>
          {completionStreak > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                🔥 {completionStreak} day streak
              </Badge>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LiveUpdates userId={stats?.user?.id} />
          <Button variant="outline" size="sm" onClick={refetch}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title={hasResume ? "Update Resume" : "Upload Resume"}
          subtitle={hasResume ? `Score: ${resumeScore}%` : "Get AI analysis"}
          icon={FileText}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          trend={hasResume && stats?.resume?.lastUpdated ? 
            `Updated ${new Date(stats.resume.lastUpdated).toLocaleDateString()}` : undefined
          }
        />
        <StatsCard
          title={`Mock Interview${interviewsCompleted > 0 ? ` (${interviewsCompleted})` : ""}`}
          subtitle={stats?.interviews?.averageScore ? `Avg: ${stats.interviews.averageScore}%` : "Start practicing"}
          icon={Briefcase}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          trend={stats?.interviews?.trend ? 
            `${stats.interviews.trend > 0 ? '+' : ''}${stats.interviews.trend}% trend` : undefined
          }
        />
        <StatsCard
          title={`Learning Progress`}
          subtitle={roadmapProgress > 0 ? `${roadmapProgress}% complete` : "Create roadmap"}
          icon={GraduationCap}
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-900/30"
          trend={stats?.roadmap?.inProgress ? 
            `${stats.roadmap.inProgress} in progress` : undefined
          }
        />
      </div>

      {/* Insights Section */}
      {stats?.insights && stats.insights.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              Personalized Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                insight.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                insight.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{insight.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {insight.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ResumeScore 
          score={resumeScore} 
          hasResume={hasResume}
          atsScore={stats?.resume?.atsScore}
          contentScore={stats?.resume?.contentScore}
          formatScore={stats?.resume?.formatScore}
          strengths={stats?.resume?.strengths}
          improvements={stats?.resume?.improvements}
        />
        <SkillGap 
          skills={stats?.resume?.skills || []}
          resumeId={stats?.resume?.id}
          skillRecommendations={stats?.resume?.skillRecommendations || []}
          targetRole={stats?.user?.targetRole}
        />
      </div>

      {/* Active Roadmaps */}
      {stats?.roadmap?.activeRoadmaps && stats.roadmap.activeRoadmaps.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Active Learning Paths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.roadmap.activeRoadmaps.map((roadmap) => (
              <div key={roadmap.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{roadmap.title}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={roadmap.progress} className="flex-1 h-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{roadmap.progress}%</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {roadmap.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {roadmap.skills.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{roadmap.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecommendedRoles 
          targetRole={stats?.user?.targetRole || undefined}
          targetCompanies={stats?.user?.targetCompanies || []}
          userSkills={stats?.resume?.skills || []}
          interviewCategories={stats?.interviews?.categories}
        />
        <RecentActivity 
          activities={stats?.activities || []}
          showInsights={true}
        />
      </div>

      {/* Upcoming Milestones */}
      {stats?.roadmap?.upcomingMilestones && stats.roadmap.upcomingMilestones.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.roadmap.upcomingMilestones.map((milestone) => (
              <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{milestone.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Next milestone: {milestone.nextMilestone}%
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {milestone.progress}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {milestone.nextMilestone - milestone.progress}% to go
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
