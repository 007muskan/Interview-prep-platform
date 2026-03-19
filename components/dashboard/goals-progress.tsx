import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Calendar, TrendingUp, CheckCircle2 } from "lucide-react"

interface Goal {
  type: 'resume' | 'interview' | 'learning'
  title: string
  description: string
  target: number
  current: number
  deadline: string
}

interface GoalsProgressProps {
  goals: Goal[]
  trends?: {
    weeklyActivity: number
    monthlyActivity: number
    interviewTrend: number
    learningTrend: number
  }
}

export function GoalsProgress({ goals, trends }: GoalsProgressProps) {
  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'resume': return '📄'
      case 'interview': return '💼'
      case 'learning': return '📚'
      default: return '🎯'
    }
  }

  const getGoalColor = (progress: number) => {
    if (progress >= 100) return 'text-green-600 dark:text-green-400'
    if (progress >= 75) return 'text-blue-600 dark:text-blue-400'
    if (progress >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100))
  }

  if (goals.length === 0 && !trends) {
    return null
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <Target className="h-5 w-5" />
          Goals & Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trends Section */}
        {trends && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {trends.weeklyActivity}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Activities this week
              </div>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {trends.interviewTrend > 0 ? '+' : ''}{trends.interviewTrend}
                </span>
                <TrendingUp className={`h-4 w-4 ${
                  trends.interviewTrend > 0 ? 'text-green-500' : 'text-red-500'
                }`} />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Interview trend
              </div>
            </div>
          </div>
        )}

        {/* Goals Section */}
        {goals.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Current Goals
            </h4>
            {goals.map((goal, index) => {
              const progress = calculateProgress(goal.current, goal.target)
              const isCompleted = progress >= 100
              
              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-lg">{getGoalIcon(goal.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                            {goal.title}
                          </h5>
                          {isCompleted && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {goal.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Target: {goal.deadline}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={isCompleted ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {goal.current}/{goal.target}
                    </Badge>
                  </div>
                  
                  <div className="ml-8">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className={`font-medium ${getGoalColor(progress)}`}>
                        {progress}%
                      </span>
                    </div>
                    <Progress 
                      value={progress} 
                      className="h-2"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <Button variant="outline" size="sm" className="w-full">
            Set New Goal
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}