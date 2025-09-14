"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Target, TrendingUp, MessageSquare, ExternalLink } from "lucide-react"
import ATSAnalyzerModal from "@/components/feature-modals/ats-analyzer-modal"
import ResumeTailorModal from "@/components/feature-modals/resume-tailor-modal"
import OpportunityFinderModal from "@/components/feature-modals/opportunity-finder-modal"
import CareerCounselingModal from "@/components/feature-modals/career-counseling-modal"

export default function FeaturesSection() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasUploadedResume, setHasUploadedResume] = useState(false)
  const [cardsVisible, setCardsVisible] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  useEffect(() => {
    // Trigger staggered card animations on mount
    const timer = setTimeout(() => {
      setCardsVisible(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleResumeUpload = () => {
    // Simulate file upload
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf,.docx"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setIsAnalyzing(true)
        // Simulate analysis with progress
        setTimeout(() => {
          setIsAnalyzing(false)
          setHasUploadedResume(true)
          // Trigger card animations
          const cards = document.querySelectorAll(".feature-card")
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("animate-glow-pulse")
              setTimeout(() => {
                card.classList.remove("animate-glow-pulse")
              }, 1000)
            }, index * 200)
          })
        }, 3000)
      }
    }
    input.click()
  }

  const openModal = (modalType: string) => {
    if (hasUploadedResume) {
      setActiveModal(modalType)
    }
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <>
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 animate-fade-in-up">Our Smart Tools & Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-100">
              Leverage AI-powered tools to accelerate your career journey and land your dream job.
            </p>
          </div>

          {/* Resume Upload */}
          <div className="text-center mb-16">
            <Button
              onClick={handleResumeUpload}
              size="lg"
              className="text-lg px-8 py-6 hover-lift hover-glow animate-fade-in-up animation-delay-200"
              disabled={isAnalyzing}
            >
              <Upload className="w-5 h-5 mr-2" />
              {isAnalyzing ? "Analyzing Your Resume..." : "Upload Your Resume"}
            </Button>
            {isAnalyzing && (
              <div className="mt-6 animate-fade-in-scale">
                <div className="w-64 mx-auto bg-secondary rounded-full h-3 overflow-hidden">
                  <div className="bg-primary h-3 rounded-full animate-shimmer" style={{ width: "60%" }} />
                </div>
                <p className="text-sm text-muted-foreground mt-3">AI is analyzing your resume...</p>
              </div>
            )}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="ATS Health Check & Score Analyzer"
              description="Get instant feedback on your resume's ATS compatibility and overall score."
              isActive={hasUploadedResume}
              isVisible={cardsVisible}
              delay="animation-delay-300"
              onOpenModal={() => openModal("ats")}
              mockData={{
                score: 87,
                improvements: ["Add more keywords", "Improve formatting", "Include metrics"],
              }}
            />

            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Resume Tailor & Customization Assistant"
              description="AI-powered suggestions to customize your resume for specific job descriptions."
              isActive={hasUploadedResume}
              isVisible={cardsVisible}
              delay="animation-delay-400"
              onOpenModal={() => openModal("tailor")}
              mockData={{
                suggestions: ["Add React experience", "Highlight leadership skills", "Include certifications"],
              }}
            />

            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Opportunity Finder & Internship Recommendations"
              description="Discover personalized internship and job opportunities based on your profile."
              isActive={hasUploadedResume}
              isVisible={cardsVisible}
              delay="animation-delay-500"
              onOpenModal={() => openModal("opportunities")}
              mockData={{
                opportunities: [
                  { title: "Software Engineer Intern", company: "TechCorp", match: "95%" },
                  { title: "Product Manager Intern", company: "StartupXYZ", match: "87%" },
                ],
              }}
            />

            <FeatureCard
              icon={<MessageSquare className="w-8 h-8" />}
              title="Dropout Predictor & Career Counselling"
              description="Get personalized career guidance and academic success predictions."
              isActive={hasUploadedResume}
              isVisible={cardsVisible}
              delay="animation-delay-600"
              onOpenModal={() => openModal("counseling")}
              mockData={{
                prediction: "Low risk",
                recommendations: ["Focus on networking", "Build portfolio projects", "Consider internships"],
              }}
            />
          </div>
        </div>
      </section>

      <ATSAnalyzerModal isOpen={activeModal === "ats"} onClose={closeModal} />
      <ResumeTailorModal isOpen={activeModal === "tailor"} onClose={closeModal} />
      <OpportunityFinderModal isOpen={activeModal === "opportunities"} onClose={closeModal} />
      <CareerCounselingModal isOpen={activeModal === "counseling"} onClose={closeModal} />
    </>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  isActive: boolean
  isVisible: boolean
  delay: string
  onOpenModal: () => void // Add modal handler prop
  mockData: any
}

function FeatureCard({
  icon,
  title,
  description,
  isActive,
  isVisible,
  delay,
  onOpenModal,
  mockData,
}: FeatureCardProps) {
  return (
    <Card
      className={`feature-card transition-all duration-500 hover-lift ${
        isActive ? "border-primary/50 bg-card/80 backdrop-blur-sm cursor-pointer" : "border-border"
      } ${isVisible ? `animate-fade-in-up ${delay}` : "opacity-0"}`}
      onClick={isActive ? onOpenModal : undefined} // Add click handler when active
    >
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div
            className={`p-3 rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-primary/20 text-primary animate-pulse"
                : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            {icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg text-balance">{title}</CardTitle>
            {isActive && (
              <div className="flex items-center gap-1 text-xs text-primary mt-1">
                <span>Click to open tool</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
        <CardDescription className="text-muted-foreground text-pretty">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isActive ? (
          <div className="space-y-4 animate-fade-in-scale">
            {title.includes("Score Analyzer") && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">ATS Score</span>
                  <span className="text-3xl font-bold text-primary">{mockData.score}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-3 rounded-full transition-all duration-2000 ease-out"
                    style={{ width: `${mockData.score}%` }}
                  />
                </div>
                <div className="mt-3 space-y-1">
                  {mockData.improvements.map((item: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {title.includes("Opportunity Finder") && (
              <div className="space-y-3">
                {mockData.opportunities.map((opp: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{opp.title}</p>
                      <p className="text-xs text-muted-foreground">{opp.company}</p>
                    </div>
                    <span className="text-primary font-bold text-sm bg-primary/10 px-2 py-1 rounded">{opp.match}</span>
                  </div>
                ))}
              </div>
            )}
            {(title.includes("Tailor") || title.includes("Counselling")) && (
              <div className="space-y-2">
                {(mockData.suggestions || mockData.recommendations).map((item: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 hover:bg-muted/20 rounded transition-colors"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm">Upload your resume to unlock this feature</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
