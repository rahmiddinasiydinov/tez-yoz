'use client'
import TestWrapper from "@/components/typing/test-wrapper"
import { Navigation } from "@/components/navigation"

export default function HomePage() {

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="min-h-screen bg-background">
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl font-bold mb-4 text-foreground">Type to Unlock Your Speed</h1>
            <p className="text-muted-foreground text-lg">Test your typing speed and climb the leaderboard!</p>
          </div>
          <div>
            <div>
              <TestWrapper />
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
