"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap, Target, TrendingUp, Users, ArrowRight, CheckCircle, Star } from "lucide-react"

interface EnhancedLandingPageProps {
  onGetStarted: () => void
}

export default function EnhancedLandingPage({ onGetStarted }: EnhancedLandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "AI-Powered Resume Analysis",
      description: "Get instant feedback on ATS compatibility and optimization suggestions",
      stat: "95% accuracy rate",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Job Matching",
      description: "Find personalized internship and job opportunities that match your profile",
      stat: "10x faster matching",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Career Path Prediction",
      description: "AI-driven insights to predict and prevent academic dropout risks",
      stat: "87% prediction accuracy",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Personalized Counseling",
      description: "Get tailored career guidance from our AI counselor",
      stat: "24/7 availability",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      content: "CareerLeap AI helped me land my dream internship at Google. The resume optimization was incredible!",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Business Major",
      content: "The career counseling feature gave me clarity on my path. I'm now confident about my future.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Engineering Student",
      content: "Found 3 amazing internship opportunities in just one week. This platform is a game-changer!",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Enhanced Animations */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 animate-gradient-shift opacity-30" />
        <div className="relative max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 animate-bounce-in glass-effect hover-scale">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Career Platform
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in-up neon-text">
            Launch Your
            <span className="text-primary animate-float inline-block ml-4">Dream Career</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-200 text-pretty">
            Leverage cutting-edge AI to optimize your resume, discover perfect opportunities, and get personalized
            career guidance that accelerates your professional journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="text-lg px-8 py-6 hover-lift hover-glow smooth-transition group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 hover-lift hover-border-glow smooth-transition bg-transparent"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fade-in-up animation-delay-600">
            {[
              { label: "Students Helped", value: "10K+" },
              { label: "Success Rate", value: "94%" },
              { label: "Job Matches", value: "50K+" },
              { label: "AI Accuracy", value: "98%" },
            ].map((stat, index) => (
              <div key={index} className={`text-center stagger-${index + 1}`}>
                <div className="text-3xl font-bold text-primary mb-2 animate-bounce-in">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
              Powerful AI Tools for Your Success
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up animation-delay-100">
              Everything you need to accelerate your career journey, powered by advanced artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`hover-lift hover-border-glow smooth-transition cursor-pointer animate-fade-in-up ${
                  hoveredFeature === index ? "glass-effect" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary hover-scale">{feature.icon}</div>
                    <div>
                      <CardTitle className="text-xl text-balance">{feature.title}</CardTitle>
                      <Badge variant="secondary" className="mt-2">
                        {feature.stat}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-pretty">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 animate-fade-in-up">Loved by Students Worldwide</h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up animation-delay-100">
              Join thousands of students who've accelerated their careers with CareerLeap AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover-lift smooth-transition animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <CardDescription className="text-foreground text-pretty">"{testimonial.content}"</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6 animate-fade-in-up">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in-up animation-delay-100 text-pretty">
            Join thousands of students who are already using AI to accelerate their professional journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-200">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="text-lg px-8 py-6 hover-lift hover-glow smooth-transition group"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground animate-fade-in-up animation-delay-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Instant results</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
