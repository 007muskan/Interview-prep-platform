"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface ResumeAnalysis {
  fileName: string
  score: number
  atsScore: number
  contentScore: number
  formatScore: number
  strengths: string[]
  improvements: string[]
  suggestions: {
    summary?: string
    skills?: string[]
    skillGaps?: {
      skill: string
      priority: "High" | "Medium" | "Low"
      reason: string
      category: "Technical" | "Soft Skills" | "Tools" | "Frameworks"
    }[]
  }
  skills: string[]
}

export default function ResumeAnalyzerPage() {
  const [uploading, setUploading] = useState(false)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const { toast } = useToast()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOC file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      
      setAnalysis({
        fileName: file.name,
        score: data.analysis.score,
        atsScore: data.analysis.atsScore,
        contentScore: data.analysis.contentScore,
        formatScore: data.analysis.formatScore,
        strengths: data.analysis.strengths,
        improvements: data.analysis.improvements,
        suggestions: data.analysis.suggestions,
        skills: data.analysis.skills,
      })

      toast({
        title: "Success!",
        description: "Your resume has been analyzed",
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const triggerFileInput = () => {
    document.getElementById('resume-upload')?.click()
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Resume Analyzer</h1>
        <p className="text-gray-600">Upload your resume to get instant AI-powered feedback and optimization suggestions.</p>
      </div>

      {!analysis ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              {uploading ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              ) : (
                <Upload className="h-8 w-8 text-primary" />
              )}
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {uploading ? "Analyzing your resume..." : "Upload Your Resume"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {uploading ? "This may take a few seconds" : "Drag and drop or click to browse"}
            </p>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <Button onClick={triggerFileInput} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-4">Supports PDF, DOC, DOCX (Max 5MB)</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {analysis.fileName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className="text-sm font-bold text-primary">{analysis.score}/100</span>
                </div>
                <Progress value={analysis.score} className="h-3" />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">{analysis.atsScore}%</div>
                  <div className="text-sm text-gray-600">ATS Compatibility</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{analysis.contentScore}%</div>
                  <div className="text-sm text-gray-600">Content Quality</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{analysis.formatScore}%</div>
                  <div className="text-sm text-gray-600">Formatting</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.strengths.map((strength, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.improvements.map((improvement, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{improvement}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {analysis.skills && analysis.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  Skills Detected
                </CardTitle>
                <p className="text-sm text-gray-600">Technical skills found in your resume</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysis.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {analysis.suggestions && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.suggestions.summary && (
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium mb-1">Professional Summary</h4>
                      <p className="text-sm text-green-700">{analysis.suggestions.summary}</p>
                    </div>
                  )}
                  {analysis.suggestions.skills && analysis.suggestions.skills.length > 0 && (
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium mb-1">Recommended Skills</h4>
                      <p className="text-sm text-gray-600 mb-2">Add these in-demand skills:</p>
                      <p className="text-sm text-green-700">{analysis.suggestions.skills.join(', ')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {analysis.suggestions.skillGaps && analysis.suggestions.skillGaps.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      Skill Gaps Analysis
                    </CardTitle>
                    <p className="text-sm text-gray-600">Skills to focus on for career advancement</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.suggestions.skillGaps.map((gap, i) => (
                      <div key={i} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg">{gap.skill}</h4>
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              gap.priority === 'High' ? 'bg-red-100 text-red-700' :
                              gap.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {gap.priority} Priority
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                              {gap.category}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{gap.reason}</p>
                      </div>
                    ))}
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium mb-2">💡 Ready to learn these skills?</p>
                      <p className="text-sm text-blue-600 mb-3">
                        Get personalized learning roadmaps for each skill gap in the Roadmap section.
                      </p>
                      <Button 
                        size="sm" 
                        onClick={() => window.location.href = '/roadmap'}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Create Learning Roadmaps
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={() => setAnalysis(null)}>
              <Upload className="h-4 w-4 mr-2" />
              Analyze Another Resume
            </Button>
            <Button variant="outline">View Detailed Report</Button>
          </div>
        </div>
      )}
    </div>
  )
}
