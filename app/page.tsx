"use client"

import { Navigation } from "@/components/navigation"
import { TypingTest } from "@/components/typing-test"
import { LeaderboardWidget } from "@/components/leaderboard/leaderboard-widget"
import { useSettings } from "@/lib/settings-context"

export default function HomePage() {
  const { settings } = useSettings()

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold mb-4 text-foreground">Type to Unlock Your Speed</h1>
          <p className="text-muted-foreground text-lg">Test your typing speed and climb the leaderboard!</p>
        </div>

        <div>
          <div>
            <TypingTest
              testType={settings.testType}
              testValue={settings.testType === "time" ? settings.selectedTime : settings.selectedWords}
              language={settings.language}
            />
          </div>

        </div>
      </main>
    </div>
  )
}
