"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Star, Target, Zap, TrendingUp, Users, Crown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { generateLeaderboard, getUserRank, type LeaderboardFilters } from "@/lib/leaderboard-engine"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n-context"

const categoryOptions = [
  { value: "wpm", label: "Best WPM", icon: Zap },
  { value: "accuracy", label: "Average Accuracy", icon: Target },
  { value: "consistency", label: "Consistency", icon: TrendingUp },
  { value: "tests", label: "Tests Completed", icon: Users },
] as const

const periodOptions = [
  { value: "daily", label: "Last 24 Hours" },
  { value: "weekly", label: "Last 7 Days" },
  { value: "monthly", label: "Last 30 Days" },
  { value: "all-time", label: "All Time" },
] as const

const testTypeOptions = [
  { value: "all", label: "All Types" },
  { value: "time", label: "Time-based" },
  { value: "words", label: "Word-based" },
] as const

const languageOptions = [
  { value: "all", label: "All Languages" },
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
] as const

export function Leaderboard() {
  const { user } = useAuth()
  const { t } = useI18n()
  const [filters, setFilters] = useState<LeaderboardFilters>({
    category: "wpm",
    period: "all-time",
    testType: "all",
    language: "all",
  })

  const leaderboard = useMemo(() => {
    return generateLeaderboard(filters)
  }, [filters])

  const userRank = useMemo(() => {
    return user ? getUserRank(user.id, filters) : null
  }, [user, filters])

  const updateFilter = (key: keyof LeaderboardFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />
    if (rank <= 10) return <Trophy className="h-5 w-5 text-blue-500" />
    return <Star className="h-5 w-5 text-muted-foreground" />
  }

  const formatScore = (score: number, category: string) => {
    switch (category) {
      case "wpm":
        return `${score} ${t("wpm")}`
      case "accuracy":
        return `${score}%`
      case "consistency":
        return `${score}%`
      case "tests":
        return `${score} ${t("tests")}`
      default:
        return score.toString()
    }
  }

  const selectedCategory = categoryOptions.find((opt) => opt.value === filters.category)
  const CategoryIcon = selectedCategory?.icon || Zap

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-heading text-3xl font-bold mb-2">{t("topTypists")}</h1>
        <p className="text-muted-foreground">{t("seeHowYouRank")}</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {t("leaderboardFilters")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("category")}</label>
              <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("timePeriod")}</label>
              <Select value={filters.period} onValueChange={(value) => updateFilter("period", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("testType")}</label>
              <Select value={filters.testType} onValueChange={(value) => updateFilter("testType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {testTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("language")}</label>
              <Select value={filters.language} onValueChange={(value) => updateFilter("language", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            {t("globalLeaderboard")}
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {t("yourRanking")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          {/* Global Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CategoryIcon className="h-5 w-5" />
                {selectedCategory?.label} {t("rankings")}
                <Badge variant="outline" className="ml-auto">
                  {leaderboard.length} {t("competitors")}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{t("noRankingsYet")}</h3>
                  <p className="text-muted-foreground">{t("completeTestsToAppear")}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.slice(0, 50).map((entry, index) => (
                    <div
                      key={entry.userId}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border transition-colors",
                        entry.userId === user?.id && "bg-accent/50 border-accent",
                        entry.rank <= 3 && "bg-gradient-to-r from-yellow-500/10 to-transparent",
                      )}
                    >
                      {/* Rank */}
                      <div className="flex items-center gap-2 min-w-[60px]">
                        {getRankIcon(entry.rank)}
                        <span className="font-bold text-lg">#{entry.rank}</span>
                      </div>

                      {/* User Info */}
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-accent text-accent-foreground">
                            {entry.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{entry.username}</span>
                            {entry.badge && <span className="text-lg">{entry.badge}</span>}
                            {entry.userId === user?.id && (
                              <Badge variant="secondary" className="text-xs">
                                {t("you")}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {entry.testsCompleted} {t("testsCompleted")}
                          </p>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="text-2xl font-bold">{formatScore(entry.score, filters.category)}</div>
                        <div className="text-sm text-muted-foreground">
                          {t("avg")}: {entry.averageWpm} {t("wpm")}, {entry.averageAccuracy}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal">
          {/* Personal Ranking */}
          {!user ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t("loginRequired")}</h3>
                <p className="text-muted-foreground">{t("signInToSeeRanking")}</p>
              </CardContent>
            </Card>
          ) : !userRank ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t("noRankingYet")}</h3>
                <p className="text-muted-foreground">{t("completeTestsToGetRanked")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Current Rank Card */}
              <Card className="bg-gradient-to-r from-accent/20 to-transparent border-accent">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(userRank.rank)}
                      <span className="text-3xl font-bold">#{userRank.rank}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{t("yourCurrentRanking")}</h3>
                      <p className="text-muted-foreground">
                        {formatScore(userRank.score, filters.category)} {t("in")} {selectedCategory?.label}
                      </p>
                    </div>
                    {userRank.badge && <div className="text-4xl">{userRank.badge}</div>}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Zap className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{t("bestWpm")}</p>
                    <p className="text-2xl font-bold">{userRank.bestWpm}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{t("averageAccuracy")}</p>
                    <p className="text-2xl font-bold">{userRank.averageAccuracy}%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{t("consistency")}</p>
                    <p className="text-2xl font-bold">{userRank.consistencyScore}%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{t("testsDone")}</p>
                    <p className="text-2xl font-bold">{userRank.testsCompleted}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Improvement Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    {t("waysToImproveYourRanking")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {userRank.rank > 10 && <p>• {t("practiceRegularlyToImproveConsistency")}</p>}
                    {userRank.averageAccuracy < 95 && <p>• {t("focusOnAccuracy")}</p>}
                    {userRank.testsCompleted < 20 && <p>• {t("completeMoreTestsToEstablishBetterAverage")}</p>}
                    {userRank.consistencyScore < 80 && <p>• {t("workOnConsistency")}</p>}
                    <p>• {t("tryDifferentLanguagesAndTestTypes")}</p>
                    <p>• {t("challengeYourselfWithLongerTests")}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
