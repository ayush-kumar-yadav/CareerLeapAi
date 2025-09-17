"use client"

import { useEffect, useState } from "react"
import Dashboard from "@/components/dashboard"
import AuthModal from "@/components/auth-modal"
import EnhancedLandingPage from "@/components/enhanced-landing-page"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  // 🔹 Backend message state
  const [message, setMessage] = useState<string>("Loading...")

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")   // FastAPI root route
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error: " + err))
  }, [])

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
          <EnhancedLandingPage onGetStarted={handleGetStarted} />
          {showAuthModal && <AuthModal onAuthSuccess={handleAuthSuccess} onClose={handleCloseModal} />}
          {/* 🔹 Show backend message on landing page */}
          <p className="mt-6 text-center text-lg">{message}</p>
        </>
      ) : (
        <Dashboard user={user} />
      )}
    </div>
  )
}
