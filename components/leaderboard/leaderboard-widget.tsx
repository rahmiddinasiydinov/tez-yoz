"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Crown } from "lucide-react"
import { getTopPerformers, type LeaderboardFilters } from "@/lib/leaderboard-engine"
import Link from "next/link"

interface LeaderboardWidgetProps {
  title: string
  filters: LeaderboardFilters
  limit?: number
}

export function LeaderboardWidget({ title, filters, limit = 5 }: LeaderboardWidgetProps) {
  const topPerformers = useMemo(() => {
    return getTopPerformers(filters, limit)
  }, [filters, limit])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-500" />
    if (rank === 2) return <Medal className="h-4 w-4 text-gray-400" />
    if (rank === 3) return <Medal className="h-4 w-4 text-amber-600" />
    return <Trophy className="h-4 w-4 text-blue-500" />
  }

  const formatScore = (score: number, category: string) => {
    switch (category) {
      case "wpm":
        return `${score} WPM`
      case "accuracy":
        return `${score}%`
      case "consistency":
        return `${score}%`
      case "tests":
        return `${score} tests`
      default:
        return score.toString()
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {title}
          </span>
          <Link href="/leaderboard">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent">
              View All
            </Badge>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topPerformers.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No data available</p>
        ) : (
          <div className="space-y-3">
            {topPerformers.map((performer) => (
              <div key={performer.userId} className="flex items-center gap-3">
                <div className="flex items-center gap-2 min-w-[40px]">
                  {getRankIcon(performer.rank)}
                  <span className="font-semibold text-sm">#{performer.rank}</span>
                </div>

                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                    {performer.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{performer.username}</p>
                  <p className="text-xs text-muted-foreground">{performer.testsCompleted} tests</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-sm">{formatScore(performer.score, filters.category)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
