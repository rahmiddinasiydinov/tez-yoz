"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import safeStorage from "./safe-storage"
import { registerAction } from "@/lib/actions/register"
import { verifyAction as verifyAction } from "@/lib/actions/verify"
import { loginAction } from "./actions/login"
import useSWR from 'swr'
import { UserProfileResponse } from "./profile"
import { toast } from "sonner"
import { mutate } from "swr"
import { useI18n } from "./i18n-context"

export type User = NonNullable<UserProfileResponse['data']>

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string, statusCode?: number }>
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string, statusCode?: number }>
  verify: (email: string, code: string) => Promise<{ success: boolean; error?: string; token?: string, statusCode?: number }>
  logout: () => void
  isLoading: boolean
  token: string | null
  isInitialized: boolean
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include'
  })

  return await res.json()
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false);
  const { t } = useI18n()

  let user: User | null = null
  const [token, setToken] = useState<string | null>(null)

  const { data, isLoading: isFetching, error: swrError, isValidating } = useSWR<UserProfileResponse>('/api/profile', fetcher)

  useEffect(() => {
    if (!isInitialized && !isFetching && !isValidating) {
      setIsInitialized(true);
    }
  }, [isFetching, isValidating])


  if (data?.data) {
    user = data.data;
    safeStorage.setJSON('user', data.data);
    // setIsLoading(false)

  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string, statusCode?: number }> => {
    setIsLoading(true)

    try {
      const res = await loginAction(email, password)
      if (res?.token) {
        setToken(res.token)
        mutate('/api/profile')
        return { success: true }
      }
      
      return {success: false, error: res?.error, statusCode: res?.statucCode}
    } catch (error) {
      let message = t('loginFailed')
      if (error instanceof Error) {
        message = error.message
      }
      return { success: false, error: Number(message)===401 ? t('invalidEmailOrPassword') : message }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = useCallback(async (
    username: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string, statusCode?: number }> => {
    setIsLoading(true)
    try {
      const res =  await registerAction(username, email, password)
      if (res?.success) {
      return { success: true, statusCode: 201 }
      }
      return {success: false, error: res?.message, statusCode: res?.statusCode}
    } catch (e: any) {
      const message = e?.message || t('signupFailed')
      return { success: false, error: Number(message)===409 ? t('userAlreadyExists') : message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verify = useCallback(async (email: string, code: string): Promise<{ success: boolean; error?: string, statusCode?: number }> => {
    setIsLoading(true)
    try {
      const res: any = await verifyAction(email, code)
      // Try common token locations
      if (res.token) {
        setToken(res.token)
      } else {
        return { success: false, error: res?.message, statusCode: res?.statusCode }
      }
      mutate('/api/profile')
      return { success: true }
    } catch (e: any) {
      const message = e?.message || t('verificationFailed')
      return { success: false, error: Number(message)===400 ? t('verificationFailed') : message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    const response = await fetch('/api/logout');
    const data = await response.json()
    safeStorage.removeItem('user');


    if (data.success) {
      toast.success(t('loggedOut'))
      mutate('/api/profile')
    } else {
      toast.error(t('errorHappenedWhileLoggingOut'))
    }

  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signup, verify, logout, isLoading, token, isInitialized }}>
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
