import { Leaderboard } from "@/components/leaderboard"
import LeaderBoardPageContent from "@/components/leaderboard/page-contet"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <LeaderBoardPageContent />
        </div>
        <Leaderboard />
      </main>
    </div>
  )
}
