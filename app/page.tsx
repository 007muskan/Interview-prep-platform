'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, Target, MessageSquare, TrendingUp, Layers, Upload, CheckCircle2, ArrowRight, Zap, Brain } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import "./animations.css"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-300">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="flex items-center gap-2 animate-slide-down">
          <Layers className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">Career Intelligence Platform</span>
        </div>
        <nav className="flex items-center gap-8">
          <Link href="#features" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
            How It Works
          </Link>
          <ThemeToggle />
          <Link href="/auth">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link href="/auth">
            <Button size="sm">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main>
        {/* Hero Section with Animated Background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-float" />
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-float delay-200" />
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-float delay-300" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="animate-slide-up">
                <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-full border border-blue-200/50 dark:border-blue-600/30 backdrop-blur-sm">
                  <span className="flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    <Layers className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    New: Advanced AI Resume Analysis
                  </span>
                </div>
                
                <h1 className="text-7xl font-black leading-tight mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Transform Your Career with AI
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed max-w-lg">
                  Get instant resume feedback, identify skill gaps, master interviews, and build your personalized career roadmap—all powered by advanced AI analysis.
                </p>
                
                <div className="flex gap-4 mb-12">
                  <Link href="/auth">
                    <Button size="lg" className="gap-2 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Upload className="h-5 w-5" />
                      Analyze Your Resume
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button size="lg" variant="outline" className="gap-2 px-8 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300">
                      Explore Features
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                
              </div>

              {/* Right Side - Amazing Animated Design */}
              <div className="relative h-full min-h-[600px] flex items-center justify-center">
                {/* Central Morphing Background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-96 h-96 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 dark:from-blue-600/30 dark:via-purple-600/30 dark:to-pink-600/30 animate-morph filter blur-xl" />
                </div>

                {/* Orbiting Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-80 h-80">
                    {/* Orbit 1 */}
                    <div className="absolute inset-0 animate-orbit">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-2xl shadow-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    {/* Orbit 2 */}
                    <div className="absolute inset-0 animate-orbit delay-500" style={{ animationDuration: '12s' }}>
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 rounded-xl shadow-lg flex items-center justify-center">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    {/* Orbit 3 */}
                    <div className="absolute inset-0 animate-orbit delay-1000" style={{ animationDuration: '18s' }}>
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 dark:from-pink-400 dark:to-pink-500 rounded-lg shadow-lg flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Cards Stack */}
                <div className="relative z-10">
                  {/* Main Card */}
                  <div className="relative animate-float">
                    <div className="w-80 h-48 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Layers className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">AI Analysis</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Resume Score: 94%</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full w-full" />
                        <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full w-4/5" />
                        <div className="h-2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full w-3/4" />
                      </div>
                    </div>
                  </div>

                  {/* Secondary Card */}
                  <div className="absolute -top-6 -right-6 animate-float-reverse delay-300">
                    <div className="w-64 h-36 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-2xl shadow-xl p-4 text-white transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5" />
                        <span className="font-semibold">Skill Gaps</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>React</span>
                          <span>Advanced</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>TypeScript</span>
                          <span>Intermediate</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Docker</span>
                          <span className="text-yellow-200">Learn</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Third Card */}
                  <div className="absolute -bottom-4 -left-8 animate-float delay-700">
                    <div className="w-56 h-32 bg-gradient-to-br from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 rounded-2xl shadow-xl p-4 text-white transform rotate-12 hover:rotate-0 transition-transform duration-500">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5" />
                        <span className="font-semibold">Career Growth</span>
                      </div>
                      <div className="text-2xl font-bold">+47%</div>
                      <div className="text-sm opacity-90">Selection Increase</div>
                    </div>
                  </div>
                </div>

                {/* Floating Sparkles */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-sparkle"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                    }}
                  >
                    <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-300 dark:to-orange-300 rounded-full" />
                  </div>
                ))}

                {/* Pulse Rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-96 h-96 border-2 border-blue-300/30 dark:border-blue-500/30 rounded-full animate-pulse-ring" />
                  <div className="absolute w-96 h-96 border-2 border-purple-300/30 dark:border-purple-500/30 rounded-full animate-pulse-ring delay-500" />
                </div>

                {/* Code Animation */}
                <div className="absolute top-8 right-8 animate-slide-right delay-1000">
                  <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 text-green-400 font-mono text-sm shadow-xl border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <div>{'> analyzing_resume...'}</div>
                    <div className="text-blue-400">{'✓ ATS_score: 94%'}</div>
                    <div className="text-purple-400">{'✓ skills_detected: 12'}</div>
                  </div>
                </div>

                {/* Stats Bubbles */}
                {/* <div className="absolute bottom-8 left-8 animate-slide-up delay-700">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 dark:from-green-500 dark:to-green-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-float">
                      94%
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-float delay-200">
                      A+
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 dark:from-purple-500 dark:to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-float delay-300">
                      ✓
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Scroll to explore</span>
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 py-24 transition-colors duration-300">
          <div className="container mx-auto px-8">
            <div className="text-center mb-20 animate-slide-up">
              <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">Comprehensive Career Tools</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Everything you need to accelerate your tech career journey with AI-powered insights
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: FileText,
                  title: "Resume Analysis",
                  description: "AI-powered analysis with ATS compatibility scores",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: Target,
                  title: "Skill Gap Detection",
                  description: "Identify missing skills for your target roles",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  icon: TrendingUp,
                  title: "Career Roadmaps",
                  description: "Custom learning paths with curated resources",
                  color: "from-orange-500 to-orange-600",
                },
                {
                  icon: MessageSquare,
                  title: "Interview Prep",
                  description: "Practice with AI feedback and analytics",
                  color: "from-green-500 to-green-600",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 group-hover:border-transparent transition-all duration-300 transform group-hover:scale-105 group-hover:shadow-2xl">
                    <div className={`inline-flex rounded-xl p-3 bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-8">
            <div className="text-center mb-20 animate-slide-up">
              <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">How It Works</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">Get started in three simple steps</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Upload Your Resume",
                  description: "Share your resume in PDF or DOC format",
                },
                {
                  step: "2",
                  title: "Get AI Insights",
                  description: "Receive detailed analysis and recommendations",
                },
                {
                  step: "3",
                  title: "Build Your Path",
                  description: "Follow your personalized career roadmap",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative animate-slide-up"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center text-3xl font-bold mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 -right-4 text-primary text-3xl font-bold opacity-30">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 py-24 text-white">
          <div className="container mx-auto px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-5xl font-bold mb-16 text-center animate-slide-up">Why Choose Us?</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "AI-powered analysis that understands tech",
                  "Real-time feedback on your performance",
                  "Personalized learning paths",
                  "Comprehensive skill gap analysis",
                  "Mock interviews with metrics",
                  "Track progress and celebrate wins",
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 animate-slide-up p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-0.5" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-8 text-center animate-slide-up">
            <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white">Ready to Transform Your Career?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Start your journey to landing your dream tech job today
            </p>
            <Link href="/auth">
              <Button size="lg" className="gap-2 px-10 py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110">
                <Zap className="h-6 w-6" />
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 py-8 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-8 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2024 Career Intelligence Platform. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
