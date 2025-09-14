// Authentication utilities for CareerLeap AI
// Integrates with FastAPI backend and Emergent authentication service

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

// API base URL - adjust based on your backend deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

/**
 * Redirect user to Emergent authentication page
 */
export const redirectToAuth = (mode: "login" | "signup" = "signup") => {
  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`)
  const emergentAuthUrl = `${API_BASE_URL}/api/auth/emergent?redirect_uri=${redirectUri}&mode=${mode}`
  window.location.href = emergentAuthUrl
}

/**
 * Handle authentication callback from Emergent
 */
export const handleAuthCallback = async (sessionData: any): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/session-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for HTTPOnly cookies
      body: JSON.stringify(sessionData),
    })

    if (!response.ok) {
      throw new Error("Authentication failed")
    }

    const data = await response.json()
    return {
      success: true,
      user: data.user,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    }
  }
}

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      credentials: "include", // Important for HTTPOnly cookies
    })

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, error: "Not authenticated" }
      }
      throw new Error("Failed to get user data")
    }

    const data = await response.json()
    return {
      success: true,
      user: data.user,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get user data",
    }
  }
}

/**
 * Logout user
 */
export const logout = async (): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    })

    return { success: response.ok }
  } catch (error) {
    return { success: false }
  }
}

/**
 * Check if user is authenticated (client-side check)
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const result = await getCurrentUser()
  return result.success
}
