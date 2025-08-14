import { Navigation } from "@/components/navigation"
import { Leaderboard } from "@/components/leaderboard"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">Top Typists</h1>
          <p className="text-muted-foreground">See how you rank against other users</p>
        </div>
        <Leaderboard />
      </main>
    </div>
  )
}
