"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import safeStorage from "./safe-storage"
import { register } from "@/lib/actions/register"
import { verify as verifyAction } from "@/lib/actions/verify"

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  stats: {
    testsCompleted: number
    bestWpm: number
    averageWpm: number
    averageAccuracy: number
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  verify: (email: string, code: string) => Promise<{ success: boolean; error?: string; token?: string }>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = safeStorage.getJSON<User | null>("typeSpeed_user", null)
    if (savedUser) {
      setUser(savedUser)
    } else {
      // nothing
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get stored users
    const storedUsers = safeStorage.getJSON<any[]>("typeSpeed_users", [])
    const existingUser = storedUsers.find((u: any) => u.email === email)

    if (!existingUser) {
      setIsLoading(false)
      return { success: false, error: "User not found" }
    }

    if (existingUser.password !== password) {
      setIsLoading(false)
      return { success: false, error: "Invalid password" }
    }

    const { password: _, ...userWithoutPassword } = existingUser
    setUser(userWithoutPassword)
    safeStorage.setJSON("typeSpeed_user", userWithoutPassword)
    setIsLoading(false)

    return { success: true }
  }

  const signup = async (
    username: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      await register(username, email, password)
      return { success: true }
    } catch (e: any) {
      const message = e?.message || "Signup failed"
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const verify = async (email: string, code: string): Promise<{ success: boolean; error?: string; token?: string }> => {
    setIsLoading(true)
    try {
      const res: any = await verifyAction(email, code)
      // Try common token locations
      const token: string | undefined =
        res?.data?.token || res?.token || res?.data?.accessToken || res?.accessToken

      if (token) {
        safeStorage.setItem("typeSpeed_token", token)
      }
      return { success: true, token }
    } catch (e: any) {
      const message = e?.message || "Verification failed"
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    safeStorage.removeItem("typeSpeed_user")
    safeStorage.removeItem("typeSpeed_token")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, verify, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
