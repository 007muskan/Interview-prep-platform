import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Plus, Target } from "lucide-react"

interface SkillGapProps {
  skills?: string[]
  resumeId?: string
  skillRecommendations?: string[]
  targetRole?: string | null
}

export function SkillGap({ skills = [], resumeId, skillRecommendations = [], targetRole }: SkillGapProps) {
  // Default skills if no resume is uploaded
  const defaultSkills = [
    "Python", "JavaScript", "React", "SQL", "Project Management", 
    "Communication", "Problem Solving", "Teamwork", "+2 more"
  ]

  const displaySkills = skills.length > 0 ? skills : defaultSkills
  const hasResume = !!resumeId

  // Calculate skill match percentage based on target role
  const calculateSkillMatch = (skillCount: number, targetRole?: string | null) => {
    if (!targetRole) return 75 // Default match
    
    const roleSkillRequirements: Record<string, number> = {
      "Software Engineer": 8,
      "Product Manager": 6,
      "Data Scientist": 7,
      "DevOps Engineer": 9,
      "UX Designer": 5,
      "Marketing Manager": 6,
    }
    
    const requiredSkills = roleSkillRequirements[targetRole] || 7
    return Math.min(100, Math.round((skillCount / requiredSkills) * 100))
  }

  const skillMatch = calculateSkillMatch(skills.length, targetRole)

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-gray-900 dark:text-white">
          {hasResume ? "Detected Skills" : "Sample Skills"}
        </CardTitle>
        {hasResume && (
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Edit skills
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Skills */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Current Skills</h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {displaySkills.length} skills
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {displaySkills.map((skill, index) => (
              <Badge 
                key={`${skill}-${index}`} 
                variant="secondary" 
                className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-700"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Skill Recommendations */}
        {hasResume && skillRecommendations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Recommended for {targetRole || "Your Role"}
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillRecommendations.map((skill, index) => (
                <Badge 
                  key={`rec-${skill}-${index}`} 
                  variant="outline" 
                  className="bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/50"
                >
                  + {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {!hasResume && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
            Upload your resume to see your actual skills analysis and get personalized recommendations
          </div>
        )}

        {hasResume && (
          <div className="pt-4 space-y-4">
            <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Skill Gap Analysis</h4>
            
            {/* Overall Match */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300">
                  Match for {targetRole || "Target Role"}
                </span>
                <span className={`font-medium ${
                  skillMatch >= 80 ? 'text-green-600 dark:text-green-400' :
                  skillMatch >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {skillMatch}% Match
                </span>
              </div>
              <Progress value={skillMatch} className="h-2" />
            </div>

            {/* Skill Categories */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">Technical Skills</span>
                  <span className="font-medium text-primary">High Match</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">Leadership & Strategy</span>
                  <span className="font-medium text-orange-500">Medium Match</span>
                </div>
                <Progress value={60} className="h-2 [&>div]:bg-orange-500" />
              </div>
              {skillRecommendations.length > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">Recommended Skills</span>
                    <span className="font-medium text-red-500">Missing</span>
                  </div>
                  <Progress value={20} className="h-2 [&>div]:bg-red-500" />
                </div>
              )}
            </div>

            {/* Action Items */}
            {skillRecommendations.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Next Steps:</strong> Consider learning {skillRecommendations.slice(0, 2).join(" and ")} 
                  to improve your match for {targetRole || "your target role"}.
                </p>
                <Button size="sm" variant="outline" className="text-xs">
                  Create Learning Plan
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}