"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Search, MapPin, Clock, DollarSign, Building, ExternalLink } from "lucide-react"

interface OpportunityFinderModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OpportunityFinderModal({ isOpen, onClose }: OpportunityFinderModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const mockOpportunities = [
    {
      id: 1,
      title: "Software Engineer Intern",
      company: "TechCorp",
      location: "San Francisco, CA",
      type: "Paid",
      duration: "3 months",
      salary: "$25/hour",
      match: "95%",
      description: "Join our dynamic engineering team to build scalable web applications using React and Node.js.",
      skills: ["React", "JavaScript", "Node.js", "Git"],
      logo: "/abstract-tech-logo.png",
      posted: "2 days ago",
      applicants: "23 applicants",
    },
    {
      id: 2,
      title: "Product Manager Intern",
      company: "StartupXYZ",
      location: "Remote",
      type: "Paid",
      duration: "4 months",
      salary: "$22/hour",
      match: "87%",
      description: "Work closely with engineering and design teams to define product roadmaps and user experiences.",
      skills: ["Product Strategy", "Analytics", "User Research", "Agile"],
      logo: "/abstract-startup-logo.png",
      posted: "1 week ago",
      applicants: "45 applicants",
    },
    {
      id: 3,
      title: "Data Science Intern",
      company: "DataFlow Inc",
      location: "New York, NY",
      type: "Paid",
      duration: "6 months",
      salary: "$28/hour",
      match: "82%",
      description: "Analyze large datasets and build machine learning models to drive business insights.",
      skills: ["Python", "SQL", "Machine Learning", "Statistics"],
      logo: "/data-company-logo.png",
      posted: "3 days ago",
      applicants: "67 applicants",
    },
    {
      id: 4,
      title: "UX Design Intern",
      company: "DesignStudio",
      location: "Austin, TX",
      type: "Paid",
      duration: "3 months",
      salary: "$20/hour",
      match: "78%",
      description: "Create user-centered designs and prototypes for mobile and web applications.",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      logo: "/design-studio-logo.png",
      posted: "5 days ago",
      applicants: "34 applicants",
    },
    {
      id: 5,
      title: "Marketing Intern",
      company: "GrowthCo",
      location: "Chicago, IL",
      type: "Unpaid",
      duration: "4 months",
      salary: "Unpaid",
      match: "75%",
      description: "Support digital marketing campaigns and content creation for B2B SaaS products.",
      skills: ["Content Marketing", "Social Media", "Analytics", "SEO"],
      logo: "/marketing-company-logo.png",
      posted: "1 week ago",
      applicants: "89 applicants",
    },
  ]

  const handleApply = (opportunityId: number) => {
    alert(`Application feature would redirect to external application for opportunity ${opportunityId}`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-scale">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-card rounded-lg border border-border animate-fade-in-up">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Opportunity Finder & Internship Recommendations</h2>
            <p className="text-muted-foreground">Personalized internship opportunities based on your profile</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted/50">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Find Your Perfect Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by title, company, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="sf">San Francisco</SelectItem>
                    <SelectItem value="ny">New York</SelectItem>
                    <SelectItem value="austin">Austin</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="paid">Paid Only</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Opportunities List */}
          <div className="space-y-4">
            {mockOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:bg-muted/20 transition-colors hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={opportunity.logo || "/placeholder.svg"}
                        alt={`${opportunity.company} logo`}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">{opportunity.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Building className="w-4 h-4" />
                          <span>{opportunity.company}</span>
                        </div>
                        <p className="text-sm text-muted-foreground text-pretty">{opportunity.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="mb-2 bg-primary/10 text-primary border-primary/20">
                        {opportunity.match} Match
                      </Badge>
                      <div className="text-sm text-muted-foreground">{opportunity.posted}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{opportunity.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{opportunity.salary}</span>
                    </div>
                    <div className="text-muted-foreground">{opportunity.applicants}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="hover-lift bg-transparent">
                        Save
                      </Button>
                      <Button size="sm" className="hover-lift" onClick={() => handleApply(opportunity.id)}>
                        Apply Now
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center pt-6">
            <Button variant="outline" className="hover-lift bg-transparent">
              Load More Opportunities
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
