import { Navigation } from "@/components/navigation"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
  console.log('reloaded');  
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold mb-2">Join the Community</h1>
            <p className="text-muted-foreground">Create an account to save your results</p>
          </div>
          <SignupForm />
        </div>
      </main>
    </div>
  )
}
