import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Briefcase, MapPin, TrendingUp } from "lucide-react"

interface RecommendedRolesProps {
  targetRole?: string
  targetCompanies?: string[]
  userSkills?: string[]
  interviewCategories?: Record<string, number>
}

export function RecommendedRoles({ 
  targetRole, 
  targetCompanies = [], 
  userSkills = [],
  interviewCategories = {}
}: RecommendedRolesProps) {
  
  // Calculate skill match for role recommendations
  const calculateSkillMatch = (roleSkills: string[], userSkills: string[]) => {
    if (userSkills.length === 0) return Math.floor(Math.random() * 20) + 70 // Random for demo
    
    const matchingSkills = roleSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    )
    
    return Math.min(95, Math.max(60, Math.round((matchingSkills.length / roleSkills.length) * 100)))
  }

  // Generate roles based on user's target role, skills, and interview history
  const generateRoles = () => {
    const roleDatabase = {
      "Software Engineer": {
        skills: ["JavaScript", "Python", "React", "Node.js", "SQL"],
        related: ["Frontend Developer", "Backend Developer", "Full Stack Developer"]
      },
      "Product Manager": {
        skills: ["Analytics", "Strategy", "Communication", "Leadership", "SQL"],
        related: ["Senior Product Manager", "Product Owner", "Strategy Manager"]
      },
      "Data Scientist": {
        skills: ["Python", "Machine Learning", "Statistics", "SQL", "Analytics"],
        related: ["ML Engineer", "Data Analyst", "Research Scientist"]
      },
      "DevOps Engineer": {
        skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
        related: ["Site Reliability Engineer", "Cloud Engineer", "Infrastructure Engineer"]
      },
      "UX Designer": {
        skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Usability"],
        related: ["UI Designer", "Product Designer", "Design Lead"]
      }
    }

    if (targetRole && roleDatabase[targetRole as keyof typeof roleDatabase]) {
      const roleData = roleDatabase[targetRole as keyof typeof roleDatabase]
      const baseMatch = calculateSkillMatch(roleData.skills, userSkills)
      
      return [
        {
          title: `Senior ${targetRole}`,
          match: `${Math.min(95, baseMatch + 5)}%`,
          location: targetCompanies.length > 0 ? 
            `Remote • ${targetCompanies.slice(0, 2).join(", ")}` : 
            "Remote • Top Companies",
          color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
          skills: roleData.skills.slice(0, 3),
          trending: baseMatch > 85,
        },
        {
          title: roleData.related[0],
          match: `${baseMatch}%`,
          location: targetCompanies.length > 0 ? 
            `Hybrid • ${targetCompanies.slice(1, 3).join(", ")}` : 
            "Hybrid • Growing Companies",
          color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
          skills: roleData.skills.slice(1, 4),
          trending: false,
        },
        {
          title: roleData.related[1] || `Lead ${targetRole}`,
          match: `${Math.max(60, baseMatch - 10)}%`,
          location: targetCompanies.length > 0 ? 
            `Onsite • ${targetCompanies.slice(0, 2).join(", ")}` : 
            "Onsite • Enterprise Companies",
          color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
          skills: roleData.skills.slice(2, 5),
          trending: false,
        },
      ]
    }

    // Default roles when no target role is set, enhanced with skill matching
    const defaultRoles = [
      {
        title: "Software Engineer",
        skills: ["JavaScript", "React", "Node.js"],
        companies: ["Google", "Microsoft", "Meta"],
      },
      {
        title: "Product Manager", 
        skills: ["Analytics", "Strategy", "Communication"],
        companies: ["Apple", "Amazon", "Netflix"],
      },
      {
        title: "Data Analyst",
        skills: ["SQL", "Python", "Analytics"],
        companies: ["Spotify", "Uber", "Airbnb"],
      },
    ]

    return defaultRoles.map((role, index) => ({
      title: role.title,
      match: `${calculateSkillMatch(role.skills, userSkills)}%`,
      location: `${["Remote", "Hybrid", "Onsite"][index]} • ${role.companies.join(", ")}`,
      color: [
        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300", 
        "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
      ][index],
      skills: role.skills,
      trending: index === 0,
    }))
  }

  const roles = generateRoles()

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          {targetRole ? "Recommended Roles" : "Explore Roles"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!targetRole && (
          <div className="text-center py-2 text-gray-500 dark:text-gray-400 text-sm mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            Complete your profile to get personalized role recommendations based on your skills and goals
          </div>
        )}
        
        {roles.map((role, index) => (
          <div
            key={`${role.title}-${index}`}
            className="group flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-all hover:shadow-sm"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`rounded-lg p-2 ${role.color} relative`}>
                <Briefcase className="h-5 w-5" />
                {role.trending && (
                  <div className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1">
                    <TrendingUp className="h-2 w-2 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm text-gray-900 dark:text-white">{role.title}</h4>
                  {role.trending && (
                    <Badge variant="secondary" className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      Trending
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <MapPin className="h-3 w-3" />
                  <span>{role.location}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {role.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right flex items-center gap-2">
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">{role.match}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">match</div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </div>
          </div>
        ))}

        {/* Interview Performance Insight */}
        {Object.keys(interviewCategories).length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Based on Your Interview Practice
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              You've practiced {Object.values(interviewCategories).reduce((a, b) => a + b, 0)} interviews 
              across {Object.keys(interviewCategories).length} categories. 
              Focus on {Object.entries(interviewCategories).sort(([,a], [,b]) => a - b)[0]?.[0]} for better preparation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}