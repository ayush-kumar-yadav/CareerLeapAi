// Authentication utilities for CareerLeap AI
// Refactored to use FastAPI JWT endpoints; removed Emergent SSO

export interface CurrentUser {
  id: number
  email: string
  created_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

// API base URL - adjust based on your backend deployment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const register = async (email: string, password: string): Promise<CurrentUser> => {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Registration failed")
  }
  return res.json()
}

export const login = async (email: string, password: string): Promise<TokenResponse> => {
  const form = new URLSearchParams()
  // FastAPI OAuth2PasswordRequestForm expects 'username' and 'password'
  form.append("username", email)
  form.append("password", password)
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Login failed")
  }
  return res.json()
}

export const getCurrentUser = async (token: string): Promise<CurrentUser> => {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
  if (res.status === 401) {
    throw new Error("Not authenticated")
  }
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to fetch user")
  }
  return res.json()
}

export const logout = (): void => {
  try {
    localStorage.removeItem("token")
  } catch (_) {
    // no-op
  }
}
