"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Linkedin, Instagram, Twitter } from "lucide-react"

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      // Reset form or show success message
    }, 2000)
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
            <p className="text-muted-foreground mb-8 text-pretty">
              Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as
              possible.
            </p>

            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      className="focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      className="focus:ring-primary focus:border-primary resize-none"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full hover-lift" disabled={isSubmitting}>
                    {isSubmitting ? "Sending Message..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links & Social */}
          <div className="animate-fade-in-up animation-delay-200">
            <h3 className="text-2xl font-bold text-foreground mb-6">Quick Links</h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="space-y-3">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors hover-lift">
                  About
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors hover-lift">
                  Projects
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors hover-lift">
                  Blog
                </a>
              </div>
              <div className="space-y-3">
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors hover-lift">
                  Privacy Policy
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors hover-lift">
                  Terms of Service
                </a>
                <a href="#" className="block text-muted-foreground hover:text-primary transition-colors hover-lift">
                  Support
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-3 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-lift hover-glow"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-lift hover-glow"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="p-3 bg-muted rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover-lift hover-glow"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Branding */}
            <div className="mt-12 pt-8 border-t border-border">
              <h1 className="text-2xl font-bold text-primary animate-pulse">CareerLeap AI</h1>
              <p className="text-muted-foreground mt-2 text-pretty">
                Empowering the next generation of professionals with AI-powered career tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
