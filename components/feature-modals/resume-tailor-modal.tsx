"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { X, Lightbulb, ArrowRight, Copy, Check } from "lucide-react"

interface ResumeTailorModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResumeTailorModal({ isOpen, onClose }: ResumeTailorModalProps) {
  const [copiedSuggestion, setCopiedSuggestion] = useState<number | null>(null)

  const mockJobDescription = `We are seeking a Software Engineer Intern to join our dynamic development team. The ideal candidate will have experience with React, Node.js, and modern web development practices. You'll work on building scalable web applications, collaborating with cross-functional teams, and contributing to our API development efforts. Knowledge of database systems, Agile methodologies, and version control (Git) is highly valued.`

  const mockCurrentResume = `John Doe
Software Engineering Student

Experience:
• Worked on various programming projects during coursework
• Responsible for completing assignments and group projects
• Used programming languages like JavaScript and Python

Skills:
• JavaScript, Python, HTML, CSS
• Problem-solving
• Team collaboration`

  const mockSuggestions = [
    {
      type: "keyword",
      title: "Add the keyword 'React' to your skills section",
      description: "This keyword appears 3 times in the job description and is crucial for this role.",
      priority: "High",
      before: "JavaScript, Python, HTML, CSS",
      after: "React, JavaScript, Python, HTML, CSS, Node.js",
    },
    {
      type: "action",
      title: "Rephrase 'Responsible for tasks' to 'Developed and maintained'",
      description: "Use stronger action verbs to demonstrate impact and ownership.",
      priority: "High",
      before: "Responsible for completing assignments and group projects",
      after: "Developed and maintained web applications using modern JavaScript frameworks",
    },
    {
      type: "quantify",
      title: "Add quantifiable results to your project experience",
      description: "Include metrics, numbers, or specific outcomes to demonstrate impact.",
      priority: "Medium",
      before: "Worked on various programming projects during coursework",
      after: "Built 5+ web applications using React and Node.js, improving code efficiency by 30%",
    },
    {
      type: "keyword",
      title: "Include 'API development' and 'database systems' experience",
      description: "These are specifically mentioned in the job requirements.",
      priority: "Medium",
      before: "Used programming languages like JavaScript and Python",
      after: "Developed RESTful APIs and integrated database systems using JavaScript and Python",
    },
  ]

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedSuggestion(index)
    setTimeout(() => setCopiedSuggestion(null), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-scale">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-card rounded-lg border border-border animate-fade-in-up">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Resume Tailor & Customization Assistant</h2>
            <p className="text-muted-foreground">
              AI-powered suggestions to optimize your resume for this specific role
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted/50">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Job Description Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Target Job Description</CardTitle>
                <CardDescription>Software Engineer Intern at TechCorp</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea value={mockJobDescription} readOnly className="min-h-[200px] text-sm resize-none" />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      Analyzed
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["React", "Node.js", "API", "Database", "Agile", "Git"].map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Resume Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Current Resume</CardTitle>
                <CardDescription>Key sections that will be optimized</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea value={mockCurrentResume} readOnly className="min-h-[200px] text-sm resize-none" />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      Original
                    </Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-muted-foreground">
                    Match Score: <span className="text-primary font-semibold">65%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                AI Suggestions ({mockSuggestions.length})
              </CardTitle>
              <CardDescription>Personalized recommendations to improve your resume's match score</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockSuggestions.map((suggestion, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={suggestion.priority === "High" ? "destructive" : "default"}>
                          {suggestion.priority} Priority
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {suggestion.type}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Before</div>
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-sm">
                          {suggestion.before}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">After</div>
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-sm relative">
                          {suggestion.after}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => copyToClipboard(suggestion.after, index)}
                          >
                            {copiedSuggestion === index ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button className="flex-1 hover-lift">
              Apply All Suggestions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" className="flex-1 hover-lift bg-transparent">
              Export Optimized Resume
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
