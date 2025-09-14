"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import FeaturesSection from "@/components/features-section"
import ContactSection from "@/components/contact-section"

interface DashboardProps {
  user: { name: string; email: string } | null
}

export default function Dashboard({ user }: DashboardProps) {
  const [activeSection, setActiveSection] = useState("features")

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["features", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} onNavigate={scrollToSection} user={user} />

      <main>
        <FeaturesSection />
        <ContactSection />
      </main>
    </div>
  )
}
