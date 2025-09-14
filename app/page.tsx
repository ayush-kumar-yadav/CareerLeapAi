"use client"

import { useState } from "react"
import Dashboard from "@/components/dashboard"
import AuthModal from "@/components/auth-modal"
import EnhancedLandingPage from "@/components/enhanced-landing-page"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  const handleGetStarted = () => {
    setShowAuthModal(true)
  }

  const handleAuthSuccess = (userData: { name: string; email: string }) => {
    setUser(userData)
    setIsAuthenticated(true)
    setShowAuthModal(false)
  }

  const handleCloseModal = () => {
    setShowAuthModal(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {!user ? (
        <>
          <EnhancedLandingPage onGetStarted={() => setShowAuthModal(true)} />
          {showAuthModal && <AuthModal onAuthSuccess={handleAuthSuccess} onClose={handleCloseModal} />}
        </>
      ) : (
        <Dashboard user={user} />
      )}
    </div>
  )
}
