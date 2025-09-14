"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface NavigationProps {
  activeSection: string
  onNavigate: (section: string) => void
  user: { name: string; email: string } | null
}

export default function Navigation({ activeSection, onNavigate, user }: NavigationProps) {
  const handleLogout = () => {
    window.location.reload()
  }

  return (
    <nav className="sticky top-0 z-40 bg-secondary/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-primary">CareerLeap AI</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Button
                variant="ghost"
                onClick={() => onNavigate("features")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === "features" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                onClick={() => onNavigate("contact")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === "contact" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Contact
              </Button>
            </div>
          </div>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground hover-lift"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
