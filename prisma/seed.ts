import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Note: With Supabase Auth, users are created through the auth system
  // This seed creates a demo user profile that you can link to a Supabase auth user
  // First, sign up through the app, then this data will be associated
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      targetRole: 'Full Stack Developer',
      targetCompanies: ['Google', 'Meta', 'Amazon'],
      timeline: '6 months',
      bio: 'Passionate software engineer with 3+ years of experience',
      location: 'San Francisco, CA',
    },
  })

  console.log('Created user profile:', user.email)
  console.log('Note: Sign up with demo@example.com through the app to use this profile')

  // Create user preferences
  await prisma.userPreferences.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      emailNotifications: true,
      weeklyReports: true,
      jobRecommendations: false,
    },
  })

  // Create sample resume
  await prisma.resume.create({
    data: {
      userId: user.id,
      fileName: 'sample_resume.pdf',
      fileUrl: '/uploads/sample_resume.pdf',
      fileSize: 102400,
      content: 'Sample resume content...',
      score: 85,
      atsScore: 92,
      contentScore: 78,
      formatScore: 88,
      strengths: [
        'Clear and concise professional summary',
        'Quantified achievements with metrics',
        'Relevant technical skills highlighted',
        'Clean, ATS-friendly formatting',
      ],
      improvements: [
        'Add more action verbs to job descriptions',
        'Include relevant certifications section',
        'Optimize keywords for target roles',
        'Add links to portfolio or GitHub',
      ],
      suggestions: {
        summary: 'Consider adding more quantifiable achievements',
        skills: ['Docker', 'Kubernetes', 'AWS'],
      },
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL'],
    },
  })

  // Create sample roadmap
  const roadmapItems = [
    {
      title: 'Master React Fundamentals',
      description: 'Build a strong foundation in React and modern JavaScript',
      duration: '2 weeks',
      skills: ['React', 'JSX', 'Components', 'Props', 'State'],
      status: 'completed',
      progress: 100,
      order: 0,
    },
    {
      title: 'Learn State Management',
      description: 'Master Redux, Context API, and modern state management',
      duration: '3 weeks',
      skills: ['Redux', 'Context API', 'Zustand', 'React Query'],
      status: 'in-progress',
      progress: 60,
      order: 1,
    },
    {
      title: 'Backend Development with Node.js',
      description: 'Build RESTful APIs and work with databases',
      duration: '4 weeks',
      skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs'],
      status: 'upcoming',
      progress: 0,
      order: 2,
    },
    {
      title: 'System Design Basics',
      description: 'Learn to design scalable systems',
      duration: '3 weeks',
      skills: ['Scalability', 'Load Balancing', 'Caching', 'Microservices'],
      status: 'upcoming',
      progress: 0,
      order: 3,
    },
  ]

  for (const item of roadmapItems) {
    await prisma.roadmap.create({
      data: {
        ...item,
        userId: user.id,
        resources: {
          courses: ['React Documentation', 'Udemy Course'],
          books: ['Learning React'],
          projects: ['Build a Todo App'],
        },
      },
    })
  }

  // Create sample interviews
  await prisma.interview.createMany({
    data: [
      {
        userId: user.id,
        category: 'Behavioral',
        question: 'Tell me about yourself',
        answer: 'I am a passionate software engineer...',
        feedback: 'Good structure, consider adding more specific examples',
        score: 85,
        status: 'completed',
      },
      {
        userId: user.id,
        category: 'Technical',
        question: 'Explain closures in JavaScript',
        answer: 'A closure is a function that has access to variables...',
        feedback: 'Excellent explanation with good examples',
        score: 92,
        status: 'completed',
      },
      {
        userId: user.id,
        category: 'System Design',
        question: 'Design a URL shortener',
        answer: 'I would use a hash function to generate short codes...',
        feedback: 'Good approach, consider discussing scalability',
        score: 78,
        status: 'completed',
      },
    ],
  })

  // Create sample activities
  await prisma.activity.createMany({
    data: [
      {
        userId: user.id,
        type: 'resume_upload',
        title: 'Analyzed Resume',
        description: 'Updated resume with new project details.',
      },
      {
        userId: user.id,
        type: 'interview',
        title: 'Mock Interview',
        description: 'Completed "Behavioral Basics" session.',
      },
      {
        userId: user.id,
        type: 'roadmap',
        title: 'Updated Roadmap',
        description: 'Completed React Fundamentals milestone.',
      },
    ],
  })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
