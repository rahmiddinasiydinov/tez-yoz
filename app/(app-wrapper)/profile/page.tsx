import { UserProfile } from "@/components/profile/user-profile"
import ProfilePageContent from "./page-content"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <ProfilePageContent />
        </div>
        <UserProfile />
      </main>
    </div>
  )
}
