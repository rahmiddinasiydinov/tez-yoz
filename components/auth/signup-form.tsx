"use client"

import type React from "react"

import { memo, useState } from "react"
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

export const SignupForm = memo(function SignupForm() {
  const [step, setStep] = useState<"signup" | "verify">("signup")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const { signup, verify, isLoading } = useAuth()
  const router = useRouter()
  const { t } = useI18n()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (step === "signup") {
      if (!username || !email || !password || !confirmPassword) {
        setError("Please fill in all fields")
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }

      if (username.length < 3) {
        setError("Username must be at least 3 characters long")
        return
      }

      const result = await signup(username, email, password)
      if (result.success) {
        setStep("verify")
      } else {
        setError(result.error || t('signupFailed'))
      }
    } else {
      if (!email || !code) {
        setError("Please enter the verification code")
        return
      }
      const result = await verify(email, code)
      if (result.success) {
        router.push("/")
        toast.success(t('registered'))
      } else {
        setError(result.error || "Verification failed")
        toast.error(t('signupFailed'))
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{step === "signup" ? t('createAccount') : t('verifyYourEmail')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "signup" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="username">{t('username')}</Label>
                <Input
                  id="username"
                  placeholder={t('chooseUsername')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
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
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('createPassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t('confirmYourPassword')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-lg text-muted-foreground">
                {t('weSentCodeToEmail')}: <span className="font-medium">{email}</span>. {t('enterItBelowToVerify')}
              </p>
              <div className="space-y-2 ">
                <Label htmlFor="code" className="text-lg">{t('verificationCode')}</Label>
                <Input
                  id="code"
                  className="text-lg"
                  placeholder={t('enterVerificationCode')}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {step === "signup" ? t('creatingAccount') : t('verifying')}
              </>
            ) : step === "signup" ? (
              t('createAccount')
            ) : (
              t('verify')
            )}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          {t('alreadyHaveAccount')}{" "}
          <Link href="/login" className="text-primary hover:underline">
            {t('signin')}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
)