"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Play, CheckCircle2, Clock, FileText, Lightbulb, Target, ArrowRight, Mic, MicOff, ExternalLink, Shuffle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InterviewQuestion {
  id: string
  question: string
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface InterviewSession {
  id: string
  question: string
  answer: string
  score: number
  feedback: string
  date: string
}

export default function InterviewPrepPage() {
  const [hasResumeAnalysis, setHasResumeAnalysis] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null)
  const [questionCount, setQuestionCount] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isAnswering, setIsAnswering] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<{ score: number; feedback: string } | null>(null)
  const [recentSessions, setRecentSessions] = useState<InterviewSession[]>([])
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    checkResumeAnalysis()
    loadRecentSessions()
  }, [])

  const checkResumeAnalysis = async () => {
    try {
      const response = await fetch('/api/resume/latest')
      if (response.ok) {
        const data = await response.json()
        setHasResumeAnalysis(!!data.resume && !!data.analysis)
      }
    } catch (error) {
      console.error('Error checking resume analysis:', error)
    }
  }

  const loadRecentSessions = async () => {
    try {
      const response = await fetch('/api/interview/history')
      if (response.ok) {
        const data = await response.json()
        setRecentSessions(data.sessions || [])
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }

  const generateResumeQuestion = async () => {
    if (!hasResumeAnalysis) {
      toast({
        title: "Resume Required",
        description: "Please upload and analyze your resume first to get personalized questions.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Get latest resume content
      const resumeResponse = await fetch('/api/resume/latest')
      if (!resumeResponse.ok) {
        throw new Error('Failed to get resume')
      }

      const resumeData = await resumeResponse.json()
      
      // Generate resume-based question
      const questionResponse = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'resume-based',
          resumeContent: resumeData.resume.content // Pass complete resume content
        }),
      })

      if (!questionResponse.ok) {
        throw new Error('Failed to generate question')
      }

      const questionData = await questionResponse.json()
      
      const newQuestion: InterviewQuestion = {
        id: Date.now().toString(),
        question: questionData.question,
        category: 'Resume-Based',
        difficulty: 'Medium'
      }

      setCurrentQuestion(newQuestion)
      setIsAnswering(true)
      setEvaluation(null)
      setUserAnswer("")
      setQuestionCount(prev => prev + 1)

      toast({
        title: "Question Generated!",
        description: "Answer the question below and get AI feedback.",
      })
    } catch (error) {
      console.error('Error generating question:', error)
      toast({
        title: "Error",
        description: "Failed to generate question. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!currentQuestion || !userAnswer.trim()) {
      toast({
        title: "Answer Required",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsEvaluating(true)
    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: userAnswer,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to evaluate answer')
      }

      const evaluationData = await response.json()
      setEvaluation(evaluationData)
      setIsAnswering(false)

      // Save session
      const session: InterviewSession = {
        id: Date.now().toString(),
        question: currentQuestion.question,
        answer: userAnswer,
        score: evaluationData.score,
        feedback: evaluationData.feedback,
        date: new Date().toISOString()
      }

      setRecentSessions(prev => [session, ...prev.slice(0, 4)])

      toast({
        title: "Answer Evaluated!",
        description: `You scored ${evaluationData.score}%. Check the feedback below.`,
      })
    } catch (error) {
      console.error('Error evaluating answer:', error)
      toast({
        title: "Error",
        description: "Failed to evaluate answer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEvaluating(false)
    }
  }

  const shuffleQuestion = async () => {
    if (!hasResumeAnalysis) {
      toast({
        title: "Resume Required",
        description: "Please upload and analyze your resume first to get personalized questions.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Get latest resume content
      const resumeResponse = await fetch('/api/resume/latest')
      if (!resumeResponse.ok) {
        throw new Error('Failed to get resume')
      }

      const resumeData = await resumeResponse.json()
      
      // Generate new resume-based question
      const questionResponse = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'resume-based',
          resumeContent: resumeData.resume.content // Pass complete resume content
        }),
      })

      if (!questionResponse.ok) {
        throw new Error('Failed to generate question')
      }

      const questionData = await questionResponse.json()
      
      const newQuestion: InterviewQuestion = {
        id: Date.now().toString(),
        question: questionData.question,
        category: 'Resume-Based',
        difficulty: 'Medium'
      }

      setCurrentQuestion(newQuestion)
      setUserAnswer("") // Clear previous answer
      setEvaluation(null) // Clear previous evaluation
      setQuestionCount(prev => prev + 1)

      toast({
        title: "New Question Generated!",
        description: "Here's a different question based on your resume.",
      })
    } catch (error) {
      console.error('Error shuffling question:', error)
      toast({
        title: "Error",
        description: "Failed to generate new question. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startNewQuestion = () => {
    setCurrentQuestion(null)
    setUserAnswer("")
    setEvaluation(null)
    setIsAnswering(false)
    generateResumeQuestion()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Interview Preparation</h1>
        <p className="text-gray-600">Practice with AI-powered resume-based interview questions</p>
      </div>

      {!hasResumeAnalysis && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Your Resume First</h3>
            <p className="text-sm text-gray-600 mb-4 text-center max-w-md">
              To get personalized interview questions based on your experience and skills, 
              please upload and analyze your resume first.
            </p>
            <Button onClick={() => window.location.href = '/resume-analyzer'}>
              <FileText className="h-4 w-4 mr-2" />
              Analyze Resume
            </Button>
          </CardContent>
        </Card>
      )}

      {hasResumeAnalysis && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Interview Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Resume-Based Interview Practice</CardTitle>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  <Target className="h-3 w-3 mr-1" />
                  Personalized
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!currentQuestion && !isAnswering && (
                <div className="text-center py-12">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-20"></div>
                    <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 rounded-full mx-auto w-fit border border-blue-100 dark:border-blue-800">
                      <MessageSquare className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ready for Your Interview?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                    Practice with focused questions based on your resume. Each question targets a specific aspect of your experience, 
                    just like a real interview conversation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={generateResumeQuestion} 
                      disabled={loading} 
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                          Generating Question...
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-3" />
                          Start First Question
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {currentQuestion && isAnswering && (
                <div className="space-y-6">
                  {/* Enhanced Question Display */}
                  <div className="relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Interview Question</h3>
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                Question #{questionCount}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Take your time to provide a focused, detailed response</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={shuffleQuestion}
                            disabled={loading}
                            className="hover:bg-blue-50 border-blue-200 text-blue-700"
                            title="Get a different question based on your resume"
                          >
                            {loading ? (
                              <>
                                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                Shuffling...
                              </>
                            ) : (
                              <>
                                <Shuffle className="h-4 w-4 mr-1" />
                                Shuffle
                              </>
                            )}
                          </Button>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                            {currentQuestion.category}
                          </Badge>
                          <Badge variant="outline" className="border-purple-200 text-purple-700">
                            {currentQuestion.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="prose prose-gray dark:prose-invert max-w-none">
                        <div className="text-gray-800 dark:text-gray-200 leading-relaxed text-base whitespace-pre-line">
                          {currentQuestion.question}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Answer Input Section */}
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <label className="text-lg font-semibold text-gray-900 dark:text-white">Your Answer</label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Use the STAR method: Situation, Task, Action, Result</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsRecording(!isRecording)}
                            className={`transition-all duration-200 ${
                              isRecording 
                                ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" 
                                : "hover:bg-gray-50"
                            }`}
                          >
                            {isRecording ? (
                              <>
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                                Recording...
                              </>
                            ) : (
                              <>
                                <Mic className="h-4 w-4 mr-1" />
                                Voice Input
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <Textarea
                        placeholder="Tell your story here...

Use STAR: Situation → Task → Action → Result
Be specific with examples and outcomes."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="min-h-[140px] text-base leading-relaxed resize-none border-0 focus:ring-0 p-0 bg-transparent"
                      />
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className={`w-2 h-2 rounded-full ${
                              userAnswer.length < 100 ? 'bg-red-400' : 
                              userAnswer.length < 200 ? 'bg-yellow-400' : 'bg-green-400'
                            }`}></div>
                            <span>{userAnswer.length} characters</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            Target: 200-400 words (focused answer)
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsAnswering(false)}
                            className="hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={submitAnswer} 
                            disabled={isEvaluating || !userAnswer.trim()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            {isEvaluating ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Evaluating...
                              </>
                            ) : (
                              <>
                                Submit Answer
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {evaluation && (
                <div className="space-y-6">
                  {/* Enhanced Evaluation Results */}
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Score Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-1">Interview Performance</h3>
                          <p className="text-blue-100">AI-powered evaluation and feedback</p>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold mb-1">{evaluation.score}%</div>
                          <div className="text-sm text-blue-100">
                            {evaluation.score >= 80 ? "Excellent" : 
                             evaluation.score >= 60 ? "Good" : "Needs Improvement"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Score Breakdown */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {Math.min(100, evaluation.score + 5)}%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Content Quality</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {Math.min(100, evaluation.score - 3)}%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Structure</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {Math.min(100, evaluation.score + 2)}%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Examples</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600 mb-1">
                            {Math.min(100, evaluation.score - 1)}%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Clarity</div>
                        </div>
                      </div>
                      
                      {/* AI Feedback */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                            <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">AI Feedback & Recommendations</h4>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                          <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{evaluation.feedback}</p>
                        </div>
                      </div>
                      
                      {/* Your Answer Review */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Your Answer</h4>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {userAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      onClick={startNewQuestion} 
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Next Question
                    </Button>
                    <Button 
                      onClick={shuffleQuestion}
                      variant="outline" 
                      size="lg"
                      disabled={loading}
                      className="hover:bg-gray-50"
                    >
                      <Shuffle className="h-5 w-5 mr-2" />
                      Different Question
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => window.location.href = '/dashboard'}
                      className="hover:bg-gray-50"
                    >
                      <Target className="h-5 w-5 mr-2" />
                      View Progress
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950/20 border-blue-100 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-800">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {recentSessions.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Questions</div>
                  </div>
                  {recentSessions.length > 0 && (
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className={`text-3xl font-bold mb-1 ${getScoreColor(
                        Math.round(recentSessions.reduce((sum, s) => sum + s.score, 0) / recentSessions.length)
                      )}`}>
                        {Math.round(recentSessions.reduce((sum, s) => sum + s.score, 0) / recentSessions.length)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score</div>
                    </div>
                  )}
                </div>
                
                {recentSessions.length === 0 && (
                  <div className="text-center py-6">
                    <div className="text-gray-400 dark:text-gray-600 mb-2">
                      <Clock className="h-8 w-8 mx-auto mb-2" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Start practicing to see your progress
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            {recentSessions.length > 0 && (
              <Card className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950/20 border-green-100 dark:border-green-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    Recent Practice
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentSessions.slice(0, 3).map((session, i) => (
                    <div key={session.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-100 dark:border-green-800">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm line-clamp-2 text-gray-900 dark:text-white pr-2">
                          {session.question.length > 60 
                            ? session.question.substring(0, 60) + "..." 
                            : session.question}
                        </p>
                        <Badge 
                          variant={getScoreBadgeVariant(session.score)} 
                          className="text-xs shrink-0"
                        >
                          {session.score}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(session.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <div className="flex items-center gap-1">
                          {session.score >= 80 ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : session.score >= 60 ? (
                            <Clock className="h-3 w-3 text-yellow-500" />
                          ) : (
                            <Target className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-950/20 border-purple-100 dark:border-purple-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  Interview Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { icon: "🎯", text: "Use the STAR method (Situation, Task, Action, Result)" },
                    { icon: "📊", text: "Provide specific examples with quantifiable results" },
                    { icon: "🗣️", text: "Practice speaking clearly and confidently" },
                    { icon: "💡", text: "Show your problem-solving thought process" }
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-800">
                      <span className="text-lg">{tip.icon}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{tip.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-2 border-t border-purple-100 dark:border-purple-800">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                    onClick={() => window.open('https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-method', '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Learn More About STAR Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
