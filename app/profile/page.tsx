import { Navigation } from "@/components/navigation"
import { UserProfile } from "@/components/profile/user-profile"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground">Track your typing progress and achievements</p>
        </div>
        <UserProfile />
      </main>
    </div>
  )
}
