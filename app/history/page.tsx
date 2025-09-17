"use client"

import { useEffect, useState } from "react"
import apiService from "@/lib/api"
import { useToast } from "@/components/ui/toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type ResumeItem = {
  resume_id: string | number
  created_at?: string
  resume_text?: string
}

export default function HistoryPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(false)
  const [selectedResumeId, setSelectedResumeId] = useState<string | number | null>(null)
  const [analysisData, setAnalysisData] = useState<any | null>(null)
  const { show } = useToast()

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiService.getResumes()
        setResumes(Array.isArray(data) ? data : [])
      } catch (e: any) {
        console.error(e)
        setError(e?.message || "Failed to fetch resumes")
        show(e?.message || "Failed to fetch resumes", "destructive")
      } finally {
        setLoading(false)
      }
    }
    fetchResumes()
  }, [])

  const handleViewAnalysis = async (resumeId: string | number) => {
    setSelectedResumeId(resumeId)
    setAnalysisLoading(true)
    setAnalysisData(null)
    setError(null)
    try {
      const data = await apiService.getResumeAnalysis(resumeId)
      if (!data || Object.keys(data || {}).length === 0) {
        setAnalysisData({ __empty: true })
      } else {
        setAnalysisData(data)
      }
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to fetch analysis")
      show(e?.message || "Failed to fetch analysis", "destructive")
    } finally {
      setAnalysisLoading(false)
    }
  }

  const renderAnalysis = () => {
    if (analysisLoading) {
      return (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Analysis</CardTitle>
            <CardDescription>Loading analysis...</CardDescription>
          </CardHeader>
        </Card>
      )
    }
    if (!selectedResumeId) return null
    if (analysisData && analysisData.__empty) {
      return (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Analysis</CardTitle>
            <CardDescription>No analysis found for this resume.</CardDescription>
          </CardHeader>
        </Card>
      )
    }
    if (!analysisData) return null

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Analysis for Resume {String(selectedResumeId)}</CardTitle>
          <CardDescription>Results returned from the analyzer</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap break-words rounded-md bg-muted p-4 text-sm">
            {JSON.stringify(analysisData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">History</h1>
      <p className="mt-1 text-sm text-muted-foreground">Recent resumes for the demo user</p>

      {error && (
        <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-6 text-sm text-muted-foreground">Loading resumes...</div>
      ) : resumes.length === 0 ? (
        <div className="mt-6 text-sm text-muted-foreground">No resumes found.</div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((r) => {
            const preview = (r.resume_text || "").slice(0, 100)
            const created = r.created_at ? new Date(r.created_at).toLocaleString() : "—"
            return (
              <Card key={String(r.resume_id)} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-base">Resume {String(r.resume_id)}</CardTitle>
                  <CardDescription>Created {created}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{preview}{(r.resume_text || '').length > 100 ? '…' : ''}</p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" onClick={() => handleViewAnalysis(r.resume_id)}>View Analysis</Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      {renderAnalysis()}
    </div>
  )
}


