"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, HeadphonesIcon } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance animate-fade-in-up">
          Stop Guessing. <span className="text-primary">Start Getting Hired.</span>
        </h1>

        {/* Subtext */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-fade-in-up animation-delay-100">
          Your dream career is just one click away.
        </p>

        {/* Primary CTA */}
        <Button
          onClick={onGetStarted}
          size="lg"
          className="text-lg px-8 py-6 mb-16 animate-fade-in-up animation-delay-200 hover:scale-105 transition-transform duration-200"
        >
          Get Started For Free
        </Button>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center animate-fade-in-up animation-delay-300">
            <CheckCircle className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-1">Free</h3>
            <p className="text-muted-foreground text-sm">No Credit Card</p>
          </div>

          <div className="flex flex-col items-center animate-fade-in-up animation-delay-400">
            <Clock className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-1">5min</h3>
            <p className="text-muted-foreground text-sm">Quick Setup</p>
          </div>

          <div className="flex flex-col items-center animate-fade-in-up animation-delay-500">
            <HeadphonesIcon className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground mb-1">24/7</h3>
            <p className="text-muted-foreground text-sm">AI Support</p>
          </div>
        </div>
      </div>
    </div>
  )
}
