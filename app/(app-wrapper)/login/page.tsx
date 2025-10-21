import { LoginForm } from "@/components/auth/login-form"
import LoginPageContent from "@/components/login/login-page-content"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <LoginPageContent />
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
