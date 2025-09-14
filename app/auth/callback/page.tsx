"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { handleAuthCallback } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Extract session data from URL parameters
        const sessionData = {
          code: searchParams.get("code"),
          state: searchParams.get("state"),
          // Add other parameters as needed based on Emergent's callback format
        }

        if (!sessionData.code) {
          throw new Error("No authorization code received")
        }

        const result = await handleAuthCallback(sessionData)

        if (result.success) {
          setStatus("success")
          // Redirect to dashboard after successful authentication
          setTimeout(() => {
            router.push("/")
          }, 2000)
        } else {
          throw new Error(result.error || "Authentication failed")
        }
      } catch (err) {
        setStatus("error")
        setError(err instanceof Error ? err.message : "Authentication failed")
      }
    }

    processCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            {status === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
            {status === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
            {status === "error" && <XCircle className="w-5 h-5 text-red-500" />}
            <span>
              {status === "loading" && "Authenticating..."}
              {status === "success" && "Success!"}
              {status === "error" && "Authentication Failed"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === "loading" && (
            <p className="text-muted-foreground">Please wait while we complete your authentication...</p>
          )}
          {status === "success" && (
            <p className="text-muted-foreground">Welcome to CareerLeap AI! Redirecting you to the dashboard...</p>
          )}
          {status === "error" && (
            <div>
              <p className="text-muted-foreground mb-2">Something went wrong:</p>
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
