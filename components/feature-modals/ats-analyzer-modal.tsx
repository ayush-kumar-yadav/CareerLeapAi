"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, CheckCircle, AlertTriangle, XCircle, TrendingUp } from "lucide-react"

interface ATSAnalyzerModalProps {
  isOpen: boolean
  onClose: () => void
  uploadedResumeText?: string
}

export default function ATSAnalyzerModal({ isOpen, onClose, uploadedResumeText }: ATSAnalyzerModalProps) {
  const [currentScore] = useState(88)

  const mockInsights = [
    { type: "success", icon: CheckCircle, text: "Strong use of action verbs", color: "text-green-500" },
    {
      type: "warning",
      icon: AlertTriangle,
      text: "Add quantifiable results to your intern role",
      color: "text-yellow-500",
    },
    {
      type: "error",
      icon: XCircle,
      text: "Missing keywords like 'API' and 'Database' for a developer role",
      color: "text-red-500",
    },
    { type: "success", icon: CheckCircle, text: "Good formatting and structure", color: "text-green-500" },
    { type: "warning", icon: AlertTriangle, text: "Consider adding more technical skills", color: "text-yellow-500" },
  ]

  const mockKeywords = [
    { keyword: "React", present: true, importance: "High" },
    { keyword: "JavaScript", present: true, importance: "High" },
    { keyword: "API", present: false, importance: "High" },
    { keyword: "Database", present: false, importance: "Medium" },
    { keyword: "Git", present: true, importance: "Medium" },
    { keyword: "Agile", present: false, importance: "Low" },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-scale">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-lg border border-border animate-fade-in-up">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">ATS Health Check & Score Analyzer</h2>
            <p className="text-muted-foreground">Comprehensive analysis of your resume's ATS compatibility</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted/50">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Overall Score */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="text-center">
              <div className="mx-auto w-32 h-32 relative">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - currentScore / 100)}`}
                    className="text-primary transition-all duration-2000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{currentScore}%</div>
                    <div className="text-sm text-muted-foreground">ATS Ready</div>
                  </div>
                </div>
              </div>
              <CardTitle className="text-xl">Excellent ATS Compatibility</CardTitle>
              <CardDescription>Your resume is well-optimized for Applicant Tracking Systems</CardDescription>
            </CardHeader>
          </Card>

          {/* Actionable Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Actionable Insights
              </CardTitle>
              <CardDescription>Key areas to improve your resume's performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors">
                  <insight.icon className={`w-5 h-5 mt-0.5 ${insight.color}`} />
                  <span className="text-sm flex-1">{insight.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Keyword Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Keyword Analysis</CardTitle>
              <CardDescription>Important keywords for your target role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockKeywords.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.present ? "bg-green-500" : "bg-red-500"}`} />
                      <span className="font-medium">{item.keyword}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          item.importance === "High"
                            ? "destructive"
                            : item.importance === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {item.importance}
                      </Badge>
                      <Badge variant={item.present ? "default" : "outline"}>
                        {item.present ? "Present" : "Missing"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button className="flex-1 hover-lift">Download Detailed Report</Button>
            <Button variant="outline" className="flex-1 hover-lift bg-transparent">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
