import { NextRequest, NextResponse } from 'next/server'
import { generateSkillBasedRoadmap } from '@/lib/ai/roadmap-generator'

export async function POST(request: NextRequest) {
  try {
    const { skillGaps, currentSkills, targetRole } = await request.json()

    console.log('=== SKILL-BASED ROADMAP API DEBUG ===')
    console.log('Received skillGaps:', skillGaps)
    console.log('Received currentSkills:', currentSkills)
    console.log('Received targetRole:', targetRole)

    if (!skillGaps || !Array.isArray(skillGaps) || skillGaps.length === 0) {
      console.log('❌ Invalid skillGaps:', skillGaps)
      return NextResponse.json(
        { error: 'Skill gaps are required' },
        { status: 400 }
      )
    }

    console.log('✅ Calling generateSkillBasedRoadmap...')
    const roadmaps = await generateSkillBasedRoadmap(
      skillGaps,
      currentSkills || [],
      targetRole
    )

    console.log('✅ Generated roadmaps:', roadmaps)
    console.log('Roadmaps count:', roadmaps.length)
    console.log('=== SKILL-BASED ROADMAP API DEBUG END ===')

    return NextResponse.json({ roadmaps })
  } catch (error) {
    console.error('Skill roadmap generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate skill roadmaps' },
      { status: 500 }
    )
  }
}