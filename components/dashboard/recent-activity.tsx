import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, MessageSquare, Search, Upload, BookOpen, Target, Clock } from "lucide-react"

interface Activity {
  id: string
  type: string
  title: string
  description: string
  metadata?: any
  createdAt: string
}

interface RecentActivityProps {
  activities?: Activity[]
  showInsights?: boolean
}

export function RecentActivity({ activities = [], showInsights = false }: RecentActivityProps) {
  // Default activities when no real activities exist
  const defaultActivities = [
    {
      icon: CheckCircle2,
      title: "Welcome to Career AI",
      description: "Get started by uploading your resume for AI analysis.",
      time: "Just now",
      iconColor: "text-green-500 dark:text-green-400",
      iconBg: "bg-green-50 dark:bg-green-900/30",
      type: "welcome",
      details: [] as string[],
    },
    {
      icon: MessageSquare,
      title: "Try Mock Interview",
      description: "Practice with AI-powered interview sessions tailored to your role.",
      time: "Available now",
      iconColor: "text-blue-500 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-900/30",
      type: "suggestion",
    },
    {
      icon: Search,
      title: "Explore Learning Roadmaps",
      description: "Discover personalized learning paths for your career goals.",
      time: "Ready to start",
      iconColor: "text-purple-500 dark:text-purple-400",
      iconBg: "bg-purple-50 dark:bg-purple-900/30",
      type: "suggestion",
    },
  ]

  // Convert real activities to display format with enhanced data
  const displayActivities = activities.length > 0 
    ? activities.slice(0, 5).map((activity) => {
        const getActivityIcon = (type: string) => {
          switch (type) {
            case 'resume_upload': return Upload
            case 'resume_analyzed': return CheckCircle2
            case 'interview_completed': return MessageSquare
            case 'interview_started': return MessageSquare
            case 'roadmap_viewed': return Search
            case 'roadmap_created': return BookOpen
            case 'skill_added': return Target
            default: return CheckCircle2
          }
        }

        const getActivityColor = (type: string) => {
          switch (type) {
            case 'resume_upload':
            case 'resume_analyzed':
              return {
                iconColor: "text-green-500 dark:text-green-400",
                iconBg: "bg-green-50 dark:bg-green-900/30"
              }
            case 'interview_completed':
            case 'interview_started':
              return {
                iconColor: "text-blue-500 dark:text-blue-400",
                iconBg: "bg-blue-50 dark:bg-blue-900/30"
              }
            case 'roadmap_viewed':
            case 'roadmap_created':
              return {
                iconColor: "text-purple-500 dark:text-purple-400",
                iconBg: "bg-purple-50 dark:bg-purple-900/30"
              }
            case 'skill_added':
              return {
                iconColor: "text-orange-500 dark:text-orange-400",
                iconBg: "bg-orange-50 dark:bg-orange-900/30"
              }
            default: return {
              iconColor: "text-gray-500 dark:text-gray-400",
              iconBg: "bg-gray-50 dark:bg-gray-900/30"
            }
          }
        }

        const colors = getActivityColor(activity.type)
        const timeAgo = getTimeAgo(activity.createdAt)
        
        // Extract additional info from metadata
        const getActivityDetails = (activity: Activity) => {
          const details = []
          if (activity.metadata?.score) {
            details.push(`Score: ${activity.metadata.score}%`)
          }
          if (activity.metadata?.duration) {
            details.push(`${Math.round(activity.metadata.duration / 60)}min`)
          }
          if (activity.metadata?.category) {
            details.push(activity.metadata.category)
          }
          return details
        }

        const details = getActivityDetails(activity)

        return {
          icon: getActivityIcon(activity.type),
          title: activity.title,
          description: activity.description,
          time: timeAgo,
          details,
          type: activity.type,
          ...colors
        }
      })
    : defaultActivities

  // Calculate activity insights
  const getActivityInsights = () => {
    if (activities.length === 0) return null

    const recentActivities = activities.filter(a => 
      Date.now() - new Date(a.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
    )

    const activityTypes = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mostActiveType = Object.entries(activityTypes)
      .sort(([,a], [,b]) => b - a)[0]

    return {
      weeklyCount: recentActivities.length,
      totalCount: activities.length,
      mostActiveType: mostActiveType?.[0],
      mostActiveCount: mostActiveType?.[1] || 0,
    }
  }

  const insights = showInsights ? getActivityInsights() : null

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {activities.length > 0 ? "Recent Activity" : "Getting Started"}
        </CardTitle>
        {insights && (
          <Badge variant="secondary" className="text-xs">
            {insights.weeklyCount} this week
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Activity Insights */}
        {insights && insights.totalCount > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {insights.totalCount} total activities
              </span>
              <span className="text-gray-900 dark:text-white font-medium">
                Most active: {insights.mostActiveType?.replace('_', ' ')} ({insights.mostActiveCount})
              </span>
            </div>
          </div>
        )}

        {/* Activity List */}
        <div className="space-y-4">
          {displayActivities.map((activity, index) => (
            <div key={index} className="flex gap-3 group">
              <div className={`rounded-lg p-2 ${activity.iconBg} h-fit`}>
                <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.description}
                    </p>
                    
                    {/* Activity Details */}
                    {activity.details && activity.details.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {activity.details.map((detail: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {detail}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State Enhancement */}
        {activities.length === 0 && (
          <div className="text-center py-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Start your career journey by taking any of the actions above
            </div>
            <div className="flex justify-center gap-2">
              <Badge variant="outline" className="text-xs">Upload Resume</Badge>
              <Badge variant="outline" className="text-xs">Take Interview</Badge>
              <Badge variant="outline" className="text-xs">Create Roadmap</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Helper function to calculate time ago
function getTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString()
}