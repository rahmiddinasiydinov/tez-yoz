"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n-context"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const { t } = useI18n()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    const result = await login(email, password)

    if (result.success) {
      router.push("/")
      toast.success(t('loggedIn'))
    } else {
      setError(result.error || "Login failed")
      toast.error(t('loginFailed'))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{t('signin')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email capitalize">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('enterYourEmail')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password capitalize">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t('enterYourPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               {t('signingIn')}
              </>
            ) : (
              t('signin')
            )}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          {t('dontHaveAnAccount')}{" "}
          <Link href="/signup" className="text-primary hover:underline">
            {t('signup')}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
