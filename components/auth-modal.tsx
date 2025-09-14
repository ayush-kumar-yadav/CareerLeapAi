"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"

interface AuthModalProps {
  onAuthSuccess: (user: { name: string; email: string }) => void
  onClose: () => void
}

export default function AuthModal({ onAuthSuccess, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSocialAuth = (provider: "google" | "apple") => {
    setIsLoading(true)

    // Simulate authentication delay
    setTimeout(() => {
      const mockUser = {
        name: provider === "google" ? "John Doe" : "Jane Smith",
        email: provider === "google" ? "john.doe@gmail.com" : "jane.smith@icloud.com",
      }
      onAuthSuccess(mockUser)
      setIsLoading(false)
    }, 1000)
  }

  const handleSocialSignup = (provider: "google" | "apple") => {
    setIsLoading(true)

    // Simulate authentication delay
    setTimeout(() => {
      const mockUser = {
        name: provider === "google" ? "New User" : "Apple User",
        email: provider === "google" ? "newuser@gmail.com" : "appleuser@icloud.com",
      }
      onAuthSuccess(mockUser)
      setIsLoading(false)
    }, 1000)
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>, mode: "login" | "signup") => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const name = mode === "signup" ? (formData.get("fullName") as string) : "Demo User"

    // Simulate form processing delay
    setTimeout(() => {
      const mockUser = {
        name: name || "Demo User",
        email: email,
      }
      onAuthSuccess(mockUser)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-scale">
      <Card className="w-full max-w-md bg-card border-border animate-fade-in-up hover-lift">
        <CardHeader className="relative">
          <Button variant="ghost" size="icon" className="absolute right-2 top-2 hover:bg-muted/50" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-center text-foreground">Welcome to CareerLeap AI</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Sign Up
              </TabsTrigger>
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Log In
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signup" className="space-y-4">
              {/* Social Signups */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent hover-lift hover:border-primary/50 flex items-center gap-3"
                  onClick={() => handleSocialSignup("google")}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign Up with Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent hover-lift hover:border-primary/50 flex items-center gap-3"
                  onClick={() => handleSocialSignup("apple")}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Sign Up with Apple ID
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Standard Fields */}
              <form onSubmit={(e) => handleFormSubmit(e, "signup")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    className="focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Create Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    className="focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <Button type="submit" className="w-full hover-lift" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="login" className="space-y-4">
              {/* Social Logins */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent hover-lift hover:border-primary/50 flex items-center gap-3"
                  onClick={() => handleSocialAuth("google")}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Log In with Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent hover-lift hover:border-primary/50 flex items-center gap-3"
                  onClick={() => handleSocialAuth("apple")}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Log In with Apple ID
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* Standard Fields */}
              <form onSubmit={(e) => handleFormSubmit(e, "login")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loginEmail">Email</Label>
                  <Input
                    id="loginEmail"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loginPassword">Password</Label>
                  <Input
                    id="loginPassword"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <Button type="submit" className="w-full hover-lift" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
