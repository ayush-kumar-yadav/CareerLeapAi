"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Target, TrendingUp, MessageSquare, ExternalLink, AlertCircle, CheckCircle } from "lucide-react"
import ATSAnalyzerModal from "@/components/feature-modals/ats-analyzer-modal"
import ResumeTailorModal from "@/components/feature-modals/resume-tailor-modal"
import OpportunityFinderModal from "@/components/feature-modals/opportunity-finder-modal"
import { useResumeUpload } from "@/lib/hooks/useResumeUpload"
import CareerCounselingModal from "@/components/feature-modals/career-counseling-modal"

export default function FeaturesSection() {
  const [cardsVisible, setCardsVisible] = useState(false)
  const [activeModal, setActiveModal] = useState<string | null>(null)
  
  // Use the resume upload hook
  const {
    isUploading,
    uploadError,
    uploadProgress,
    uploadedResume,
    uploadResume,
    clearUpload,
    resetError
  } = useResumeUpload()
  
  const hasUploadedResume = !!uploadedResume

  useEffect(() => {
    // Trigger staggered card animations on mount
    const timer = setTimeout(() => {
      setCardsVisible(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const handleResumeUpload = async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf,.docx"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        try {
          await uploadResume(file)
          // Trigger card animations after successful upload
          const cards = document.querySelectorAll(".feature-card")
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("animate-glow-pulse")
              setTimeout(() => {
                card.classList.remove("animate-glow-pulse")
              }, 1000)
            }, index * 200)
          })
        } catch (error) {
          console.error('Upload failed:', error)
        }
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
              disabled={isUploading}
            >
              <Upload className="w-5 h-5 mr-2" />
              {isUploading ? "Processing Your Resume..." : "Upload Your Resume"}
            </Button>
            
            {/* Upload Status */}
            {isUploading && (
              <div className="mt-6 animate-fade-in-scale">
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span>Extracting text from your resume... {uploadProgress}%</span>
                </div>
                <div className="w-64 mx-auto mt-2 bg-muted/20 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Upload Error */}
            {uploadError && (
              <div className="mt-6 animate-fade-in-scale">
                <div className="flex items-center justify-center space-x-2 text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg max-w-md mx-auto">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">{uploadError}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetError}
                    className="text-red-500 hover:text-red-600 p-1 h-auto"
                  >
                    ×
                  </Button>
                </div>
              </div>
            )}
            
            {/* Upload Success */}
            {uploadedResume && (
              <div className="mt-6 animate-fade-in-scale">
                <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 dark:bg-green-950/20 p-4 rounded-lg max-w-2xl mx-auto">
                  <CheckCircle className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Resume uploaded successfully!</div>
                    <div className="text-sm text-muted-foreground">
                      {uploadedResume.word_count} words extracted from {uploadedResume.file_name}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearUpload}
                    className="text-green-600 hover:text-green-700 p-1 h-auto"
                  >
                    ×
                  </Button>
                </div>
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

      <ATSAnalyzerModal 
        isOpen={activeModal === "ats"} 
        onClose={closeModal} 
        uploadedResumeText={uploadedResume?.extracted_text}
      />
      <ResumeTailorModal 
        isOpen={activeModal === "tailor"} 
        onClose={closeModal} 
        uploadedResumeText={uploadedResume?.extracted_text}
      />
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
