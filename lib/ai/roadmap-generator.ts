import { llm } from "./llm-client"

interface RoadmapItem {
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
  milestones: RoadmapItem[]
}

export async function generateSkillBasedRoadmap(
  skillGaps: Array<{
    skill: string
    priority: "High" | "Medium" | "Low"
    reason: string
    category: "Technical" | "Soft Skills" | "Tools" | "Frameworks"
  }> | string[],
  currentSkills: string[],
  targetRole?: string
): Promise<SkillRoadmap[]> {
  try {
    console.log('=== ROADMAP GENERATOR DEBUG ===')
    console.log('Input skillGaps:', skillGaps)
    console.log('Input currentSkills:', currentSkills)
    console.log('Input targetRole:', targetRole)

    // Handle both old format (string[]) and new format (object[])
    const formattedSkillGaps = Array.isArray(skillGaps) && skillGaps.length > 0
      ? (typeof skillGaps[0] === 'string' 
          ? (skillGaps as string[]).map(skill => ({ skill, priority: 'Medium' as const, reason: 'Important for career growth', category: 'Technical' as const }))
          : skillGaps as Array<{ skill: string; priority: "High" | "Medium" | "Low"; reason: string; category: "Technical" | "Soft Skills" | "Tools" | "Frameworks" }>)
      : []

    console.log('Formatted skillGaps:', formattedSkillGaps)

    const prompt = `Create personalized learning roadmaps for these prioritized skill gaps:

${formattedSkillGaps.map(gap => 
  `- ${gap.skill} (${gap.priority} Priority - ${gap.category}): ${gap.reason}`
).join('\n')}

Current skills: ${currentSkills.join(", ")}
${targetRole ? `Target role: ${targetRole}` : ''}

For each skill gap, create a detailed learning roadmap with 3-4 progressive milestones.
Focus on practical, hands-on learning with real projects and industry-relevant resources.

Each milestone should include:
- Title (specific learning goal)
- Description (what they'll learn and achieve)
- Duration (in weeks, be realistic)
- Skills covered (specific sub-skills)
- Resources (actual course names, book titles, project ideas, official docs)
- Difficulty level (Beginner/Intermediate/Advanced)
- Prerequisites (what knowledge is needed)

Prioritize High priority skills first, then Medium, then Low.
Make the learning path progressive and practical.

Return as JSON array with structure:
[{
  "skill": "skill name",
  "description": "why this skill is crucial for career growth",
  "totalDuration": "X-Y weeks",
  "priority": "High|Medium|Low",
  "category": "Technical|Soft Skills|Tools|Frameworks",
  "milestones": [{
    "title": "milestone title",
    "description": "detailed description of what you'll learn and build",
    "duration": "X weeks",
    "skills": ["specific sub-skills"],
    "resources": {
      "courses": ["specific course names with platforms"],
      "books": ["actual book titles"],
      "projects": ["hands-on project ideas"],
      "documentation": ["official documentation links"]
    },
    "difficulty": "Beginner|Intermediate|Advanced",
    "prerequisites": ["required knowledge"]
  }]
}]`

    const systemPrompt = "You are an expert technical mentor and career coach. Create detailed, actionable learning roadmaps that are practical and industry-relevant. Focus on hands-on learning with real projects and current industry tools. Provide specific, real resource names when possible. Return only valid JSON."
    
    console.log('Calling LLM with prompt length:', prompt.length)
    const result = await llm.generateJSON(prompt, systemPrompt)
    console.log('LLM result:', result)
    
    const roadmaps = Array.isArray(result) ? result : result.roadmaps || []
    console.log('Extracted roadmaps:', roadmaps)
    console.log('Roadmaps count:', roadmaps.length)
    
    // Sort by priority (High -> Medium -> Low)
    const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 }
    const sortedRoadmaps = roadmaps.sort((a, b) => {
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 1
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 1
      return aPriority - bPriority
    })
    
    console.log('Final sorted roadmaps:', sortedRoadmaps)
    console.log('=== ROADMAP GENERATOR DEBUG END ===')
    
    return sortedRoadmaps
  } catch (error) {
    console.error("Skill roadmap generation error:", error)
    console.log('Falling back to default roadmaps')
    return getFallbackSkillRoadmaps(
      Array.isArray(skillGaps) && skillGaps.length > 0 && typeof skillGaps[0] === 'string'
        ? skillGaps as string[]
        : (skillGaps as Array<{ skill: string }>).map(gap => gap.skill)
    )
  }
}

export async function generateRoadmap(
  targetRole: string,
  currentSkills: string[],
  timeline: string
): Promise<RoadmapItem[]> {
  try {
    const prompt = `Create a personalized learning roadmap for someone who wants to become a ${targetRole}.

Current skills: ${currentSkills.join(", ")}
Timeline: ${timeline}

Generate 4-6 learning milestones with:
1. Title
2. Description
3. Duration (in weeks)
4. Skills to learn
5. Recommended resources

Return as JSON array with structure:
[{
  "title": string,
  "description": string,
  "duration": string,
  "skills": string[],
  "resources": {
    "courses": string[],
    "books": string[],
    "projects": string[]
  }
}]`

    const systemPrompt = "You are an expert career coach and technical mentor. Create detailed, actionable learning roadmaps. Return your response as valid JSON with a 'roadmap' array."
    
    const result = await llm.generateJSON(prompt, systemPrompt)
    return result.roadmap || getFallbackRoadmap(targetRole)
  } catch (error) {
    console.error("Roadmap generation error:", error)
    return getFallbackRoadmap(targetRole)
  }
}

function getFallbackSkillRoadmaps(skillGaps: string[]): SkillRoadmap[] {
  return skillGaps.slice(0, 3).map(skill => ({
    skill,
    description: `Master ${skill} to enhance your technical capabilities and career prospects`,
    totalDuration: "8-12 weeks",
    milestones: [
      {
        title: `${skill} Fundamentals`,
        description: `Learn the core concepts and basics of ${skill}`,
        duration: "3 weeks",
        skills: [`${skill} Basics`, "Core Concepts"],
        resources: {
          courses: [`${skill} Crash Course`, "Official Tutorial"],
          books: [`Learning ${skill}`, `${skill} in Action`],
          projects: [`Simple ${skill} Project`, "Hello World App"],
          documentation: [`Official ${skill} Docs`]
        },
        difficulty: "Beginner" as const,
        prerequisites: ["Basic programming knowledge"]
      },
      {
        title: `Intermediate ${skill}`,
        description: `Build practical applications and understand advanced concepts`,
        duration: "4 weeks",
        skills: [`Advanced ${skill}`, "Best Practices", "Testing"],
        resources: {
          courses: [`Advanced ${skill} Course`],
          books: [`${skill} Design Patterns`],
          projects: [`Real-world ${skill} Application`],
          documentation: [`${skill} Best Practices Guide`]
        },
        difficulty: "Intermediate" as const,
        prerequisites: [`${skill} Fundamentals`]
      },
      {
        title: `${skill} in Production`,
        description: `Deploy and optimize ${skill} applications for production use`,
        duration: "3 weeks",
        skills: ["Deployment", "Performance", "Monitoring"],
        resources: {
          courses: [`${skill} DevOps`],
          books: [`Production ${skill}`],
          projects: [`Deploy ${skill} App`],
          documentation: ["Deployment Guides"]
        },
        difficulty: "Advanced" as const,
        prerequisites: [`Intermediate ${skill}`]
      }
    ]
  }))
}

function getFallbackRoadmap(targetRole: string): RoadmapItem[] {
  return [
    {
      title: "Master Core Fundamentals",
      description: "Build a strong foundation in programming and computer science basics",
      duration: "4 weeks",
      skills: ["Data Structures", "Algorithms", "Problem Solving"],
      resources: {
        courses: ["LeetCode", "HackerRank"],
        books: ["Cracking the Coding Interview"],
        projects: ["Build a personal portfolio"],
        documentation: []
      },
      difficulty: "Beginner",
      prerequisites: []
    },
    {
      title: "Learn Modern Frameworks",
      description: "Get hands-on with industry-standard frameworks and tools",
      duration: "6 weeks",
      skills: ["React", "Node.js", "TypeScript"],
      resources: {
        courses: ["React Documentation", "Node.js Guides"],
        books: ["You Don't Know JS"],
        projects: ["Full-stack web application"],
        documentation: []
      },
      difficulty: "Intermediate",
      prerequisites: ["JavaScript Fundamentals"]
    },
    {
      title: "System Design & Architecture",
      description: "Understand how to design scalable systems",
      duration: "4 weeks",
      skills: ["System Design", "Microservices", "Databases"],
      resources: {
        courses: ["System Design Primer"],
        books: ["Designing Data-Intensive Applications"],
        projects: ["Design a scalable API"],
        documentation: []
      },
      difficulty: "Advanced",
      prerequisites: ["Backend Development"]
    },
    {
      title: "Interview Preparation",
      description: "Practice coding interviews and behavioral questions",
      duration: "3 weeks",
      skills: ["Coding Interviews", "Behavioral Skills", "Communication"],
      resources: {
        courses: ["Mock Interviews"],
        books: ["Behavioral Interview Guide"],
        projects: ["Complete 100 LeetCode problems"],
        documentation: []
      },
      difficulty: "Intermediate",
      prerequisites: ["Core Programming Skills"]
    }
  ]
}
