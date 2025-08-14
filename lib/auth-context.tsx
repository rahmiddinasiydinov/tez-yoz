"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import safeStorage from "./safe-storage"

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
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get stored users
    const storedUsers = safeStorage.getJSON<any[]>("typeSpeed_users", [])

    // Check if user already exists
    if (storedUsers.some((u: any) => u.email === email)) {
      setIsLoading(false)
      return { success: false, error: "User with this email already exists" }
    }

    if (storedUsers.some((u: any) => u.username === username)) {
      setIsLoading(false)
      return { success: false, error: "Username already taken" }
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // In real app, this would be hashed
      createdAt: new Date().toISOString(),
      stats: {
        testsCompleted: 0,
        bestWpm: 0,
        averageWpm: 0,
        averageAccuracy: 0,
      },
    }

    // Save to storage
    storedUsers.push(newUser)
    safeStorage.setJSON("typeSpeed_users", storedUsers)

    // Set current user (without password)
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    safeStorage.setJSON("typeSpeed_user", userWithoutPassword)
    setIsLoading(false)

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    safeStorage.removeItem("typeSpeed_user")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
