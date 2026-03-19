import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react"
import Link from "next/link"

interface ResumeScoreProps {
  score: number
  hasResume: boolean
  atsScore?: number | null
  contentScore?: number | null
  formatScore?: number | null
  strengths?: string[]
  improvements?: string[]
}

export function ResumeScore({ 
  score, 
  hasResume, 
  atsScore, 
  contentScore, 
  formatScore, 
  strengths = [], 
  improvements = [] 
}: ResumeScoreProps) {
  const circumference = 2 * Math.PI * 70
  const offset = circumference - (score / 100) * circumference

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Needs Work"
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  if (!hasResume) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-white">Resume Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-6 mb-4">
            <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Resume Uploaded</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
            Upload your resume to get AI-powered analysis and optimization suggestions.
          </p>
          <Link href="/resume-analyzer">
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Resume
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-gray-900 dark:text-white">Resume Score</CardTitle>
        <Link href="/resume-analyzer">
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Score Circle */}
        <div className="flex flex-col items-center">
          <div className="relative h-40 w-40">
            <svg className="h-full w-full -rotate-90 transform">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-200 dark:text-gray-600"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="text-primary transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">{score}</span>
              <span className={`text-xs uppercase font-medium ${getScoreColor(score)}`}>
                {getScoreLabel(score)}
              </span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Your resume is optimized for {score}% of Applicant Tracking Systems (ATS)
          </p>
        </div>

        {/* Detailed Scores */}
        {(atsScore || contentScore || formatScore) && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Detailed Breakdown</h4>
            {atsScore && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">ATS Compatibility</span>
                <span className={`text-sm font-medium ${getScoreColor(atsScore)}`}>{atsScore}%</span>
              </div>
            )}
            {contentScore && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Content Quality</span>
                <span className={`text-sm font-medium ${getScoreColor(contentScore)}`}>{contentScore}%</span>
              </div>
            )}
            {formatScore && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Format & Structure</span>
                <span className={`text-sm font-medium ${getScoreColor(formatScore)}`}>{formatScore}%</span>
              </div>
            )}
          </div>
        )}

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 gap-4">
          {strengths.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Strengths</span>
              </div>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {strengths.slice(0, 2).map((strength, index) => (
                  <li key={index}>• {strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {improvements.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Improvements</span>
              </div>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {improvements.slice(0, 2).map((improvement, index) => (
                  <li key={index}>• {improvement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {score < 70 && (
          <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span>Consider improving your resume for better results</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
