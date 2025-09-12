"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import safeStorage from "./safe-storage"
import { registerAction } from "@/lib/actions/register"
import { verifyAction as verifyAction } from "@/lib/actions/verify"
import { loginAction } from "./actions/login"
import useSWR from 'swr'
import { object } from "zod"
import { UserProfileResponse } from "./profile"
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
  user: NonNullable<UserProfileResponse['data']> | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  verify: (email: string, code: string) => Promise<{ success: boolean; error?: string; token?: string }>
  logout: () => void
  isLoading: boolean
  token: string | null
}

const fetcher = async (url: string, token: string | null) => {
  const res = await fetch(url, {
    credentials: 'include'
  })

  return await res.json()
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  let user: NonNullable<UserProfileResponse['data']> | null = null
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const { data, isLoading: isFetching, error } = useSWR<UserProfileResponse>('/api/profile', fetcher)

  if (data?.data) {
    user = data.data
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    try {
      const res = await loginAction(email, password)
      if (res.token) {
        setToken(res.token)
      }
      return { success: res.success }
    } catch (error) {
      let message = "Login failed"
      if (error instanceof Error) {
        message = error.message
      }
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    username: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      await registerAction(username, email, password)
      return { success: true }
    } catch (e: any) {
      const message = e?.message || "Signup failed"
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const verify = async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const res: any = await verifyAction(email, code)
      // Try common token locations
      if (res.token) {
        setToken(res.token)
      }


      return { success: true }
    } catch (e: any) {
      const message = e?.message || "Verification failed"
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    user = null
    safeStorage.removeItem("typeSpeed_user")
    safeStorage.removeItem("typeSpeed_token")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, verify, logout, isLoading, token }}>
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
