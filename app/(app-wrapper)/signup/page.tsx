import { SignupForm } from "@/components/auth/signup-form"
import SignupPageContent from "@/components/signup/signup-page-content"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <SignupPageContent />
          <SignupForm />
        </div>
      </main>
    </div>
  )
}
