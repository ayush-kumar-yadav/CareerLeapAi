"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Send, Bot, User, TrendingUp, AlertCircle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface CareerCounselingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: number
  type: "bot" | "user"
  content: string
  timestamp: Date
}

export default function CareerCounselingModal({ isOpen, onClose }: CareerCounselingModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content:
        "Hello! I see you have skills in Design and Programming. Would you like to explore careers in UI/UX or Software Development?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const mockEngagementData = [
    { month: "Jan", score: 75 },
    { month: "Feb", score: 78 },
    { month: "Mar", score: 82 },
    { month: "Apr", score: 79 },
    { month: "May", score: 85 },
    { month: "Jun", score: 88 },
  ]

  const mockResponses = [
    "That's a great choice! UI/UX design is a rapidly growing field. Based on your profile, I'd recommend focusing on user research and prototyping skills.",
    "Software development offers many exciting paths. Have you considered specializing in frontend, backend, or full-stack development?",
    "I'd suggest building a portfolio with 3-5 projects that showcase your skills. Would you like specific project ideas?",
    "Networking is crucial in tech. Consider joining local meetups, online communities, and contributing to open source projects.",
    "Based on current market trends, React and Python are highly sought-after skills. Your current experience aligns well with these technologies.",
    "Internships are a great way to gain experience. I can help you identify companies that match your interests and skill level.",
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-scale">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-card rounded-lg border border-border animate-fade-in-up">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Dropout Predictor & Career Counselling</h2>
            <p className="text-muted-foreground">AI-powered career guidance and academic success insights</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted/50">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Analytics */}
          <div className="w-1/2 border-r border-border p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Academic Engagement Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Academic Engagement Score
                  </CardTitle>
                  <CardDescription>Your trajectory over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockEngagementData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="font-semibold text-green-700 dark:text-green-400">Strong Trajectory</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your engagement score has improved by 17% over the past 6 months, indicating strong academic
                      momentum.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-green-500" />
                    Dropout Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Risk Level</span>
                      <Badge variant="default" className="bg-green-500/10 text-green-700 border-green-500/20">
                        Low Risk
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Academic Performance</span>
                        <span className="text-green-500">Excellent</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Engagement Level</span>
                        <span className="text-green-500">High</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Career Clarity</span>
                        <span className="text-yellow-500">Moderate</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Support Network</span>
                        <span className="text-green-500">Strong</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div>
                        <p className="font-medium text-sm">Focus on networking</p>
                        <p className="text-xs text-muted-foreground">Join professional communities in your field</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div>
                        <p className="font-medium text-sm">Build portfolio projects</p>
                        <p className="text-xs text-muted-foreground">
                          Showcase your skills with real-world applications
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div>
                        <p className="font-medium text-sm">Consider internships</p>
                        <p className="text-xs text-muted-foreground">
                          Gain practical experience in your target industry
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="w-1/2 flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">AI Career Counselor</h3>
              <p className="text-sm text-muted-foreground">Ask me anything about your career path</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "bot" && (
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.type === "user" && (
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce animation-delay-100" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce animation-delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about career paths, skills, or academic guidance..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping} className="hover-lift">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
