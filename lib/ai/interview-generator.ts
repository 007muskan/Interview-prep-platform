import { llm } from "./llm-client"

export async function generateInterviewQuestion(
  category: string,
  resumeContent?: string
): Promise<string> {
  try {
    let prompt = ""
    let systemPrompt = "You are an expert technical interviewer. Generate relevant, challenging interview questions."

    if (category === 'resume-based' && resumeContent) {
      prompt = `Based on this COMPLETE resume, generate a focused interview question that explores ONE specific aspect of the candidate's experience in depth.

COMPLETE RESUME CONTENT:
${resumeContent}

Generate ONE focused question that:

1. **TARGETS ONE SPECIFIC AREA**: Focus on either:
   - A specific project or achievement mentioned in their resume
   - A particular technology or skill they've used
   - A specific challenge or problem they've solved
   - A particular role or responsibility they've had

2. **GOES DEEP**: Ask for detailed explanation of that one area
3. **IS CONVERSATIONAL**: Sound like a real interviewer asking a follow-up question
4. **ENCOURAGES STORYTELLING**: Prompt them to tell a story with context, actions, and results

The question should be:
- **Specific to their actual experience** (reference specific companies, roles, projects, or technologies from their resume)
- **Focused on ONE aspect** (not trying to cover everything at once)
- **Detailed but manageable** (can be answered thoroughly in 2-3 minutes)
- **Natural and conversational** (like a real interviewer would ask)

Examples of good focused questions:
- "I see you worked with PostgreSQL at [Company]. Can you tell me about a specific database challenge you faced and how you solved it?"
- "You mentioned optimizing API performance in your role at [Company]. Walk me through a specific example of how you identified and fixed a performance bottleneck."
- "I notice you led a team project involving [Technology]. How did you approach coordinating the technical work across team members?"

Generate ONE focused, conversational question that digs deep into a specific aspect of their resume.`

      systemPrompt = "You are a senior technical interviewer conducting a detailed interview. Ask ONE focused, conversational question that explores a specific aspect of the candidate's resume in depth. The question should be natural, specific to their background, and encourage a detailed story-based response. Focus on one area at a time rather than trying to cover everything. Return ONLY the focused question."
    } else {
      prompt = `Generate a ${category} interview question.`
      if (resumeContent) {
        prompt += ` Based on this resume:\n${resumeContent.substring(0, 1000)}`
      }
    }
    
    const response = await llm.generateText(prompt, systemPrompt)
    return response.content || getFallbackQuestion(category)
  } catch (error) {
    console.error("Question generation error:", error)
    return getFallbackQuestion(category)
  }
}

export async function evaluateAnswer(
  question: string,
  answer: string
): Promise<{ score: number; feedback: string }> {
  try {
    const systemPrompt = "You are an expert interviewer evaluating a candidate's answer. Provide constructive, specific feedback that helps them improve. Focus on content quality, structure, specificity, and professionalism. Return valid JSON with 'score' (0-100) and 'feedback' fields."
    
    const prompt = `Evaluate this interview answer and provide a score (0-100) and detailed feedback.

Question: ${question}

Answer: ${answer}

Evaluation criteria:
- Content quality and relevance (40%)
- Use of specific examples and details (30%) 
- Structure and clarity (20%)
- Professionalism and confidence (10%)

Provide constructive feedback that:
1. Highlights what they did well
2. Identifies specific areas for improvement
3. Suggests how to make their answer stronger
4. Is encouraging but honest

Return as JSON: {"score": number, "feedback": string}`
    
    const result = await llm.generateJSON(prompt, systemPrompt)
    return {
      score: Math.min(100, Math.max(0, result.score || 70)),
      feedback: result.feedback || "Good effort. Consider providing more specific examples and quantifiable results to strengthen your answer."
    }
  } catch (error) {
    console.error("Answer evaluation error:", error)
    return {
      score: 70,
      feedback: "Your answer shows understanding. To improve, try using the STAR method (Situation, Task, Action, Result) and include specific examples with quantifiable outcomes. Practice speaking more confidently about your achievements."
    }
  }
}

function getFallbackQuestion(category: string): string {
  const questions: Record<string, string[]> = {
    behavioral: [
      "Tell me about a time when you faced a challenging situation at work.",
      "Describe a project where you had to work with a difficult team member.",
      "How do you handle tight deadlines and pressure?"
    ],
    technical: [
      "Explain the difference between var, let, and const in JavaScript.",
      "What is the time complexity of common sorting algorithms?",
      "How would you optimize a slow database query?"
    ],
    "system-design": [
      "Design a URL shortening service like bit.ly",
      "How would you design a notification system?",
      "Design a rate limiter for an API"
    ],
    "resume-based": [
      "Tell me about the most technically challenging problem you've solved in a recent project. What made it difficult and how did you approach it?",

      "I see you've worked with [specific technology from resume]. Can you walk me through a specific example of how you used it to solve a real problem?",

      "Describe a time when you had to learn a new technology quickly for a project. How did you go about mastering it?",

      "Tell me about a project where you had to make an important technical decision. What factors did you consider?",

      "Can you give me an example of how you've optimized performance in one of your applications? What was the impact?",

      "Describe a situation where you had to debug a particularly tricky issue. How did you track down the root cause?",

      "Tell me about a time when you had to collaborate closely with non-technical team members. How did you handle the communication?",

      "Walk me through a feature you built that you're particularly proud of. What made it special?",

      "Describe a time when you had to refactor or improve existing code. What was your approach?",

      "Tell me about a project where you had to work under tight deadlines. How did you manage the pressure and ensure quality?"
    ]
  }

  const categoryQuestions = questions[category.toLowerCase()] || questions["resume-based"]
  return categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)]
}
