import { Navigation } from "@/components/navigation"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to track your progress</p>
          </div>
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
