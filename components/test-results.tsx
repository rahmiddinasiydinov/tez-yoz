"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Target, Zap, AlertCircle, RotateCcw, Share2, Crown } from "lucide-react"
import type { TestResult } from "@/lib/typing-engine"
import { getUserRank } from "@/lib/leaderboard-engine"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n-context"
import { memo, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { saveTesResult } from "@/lib/actions/save-results"
import { toast } from "sonner"
import { SavingResultsIndicator } from "./saving-results-indicator"

interface TestResultsProps {
  result: TestResult
  onRestart: () => void
}

export default function TestResults({ result, onRestart }: TestResultsProps) {
  const { user } = useAuth()
  const { t } = useI18n()
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (!isSaved) {
      console.log('result is rerunning', isSaved);

      async function saveResult() {
        const response = await saveTesResult(result)
        if (response.success) {
          toast.success(response.message)
        } else {
          if (!response.status || response.status !== 401) {
            toast.error(response.message || 'Unexpected error happened')
          } else{
            toast.warning('Please log in to save your results!')
          }
        }
        setIsSaved(true)
      }
      saveResult()
    }
  }, [])
  const userRank = useMemo(() => {
    if (!user) return null
    return getUserRank(user.id, {
      category: "wpm",
      period: "all-time",
      testType: "all",
      language: "all",
    })
  }, [user, result])

  const getWPMRating = (wpm: number) => {
    if (wpm >= 70) return { label: t("excellent"), color: "text-green-500" }
    if (wpm >= 50) return { label: t("good"), color: "text-blue-500" }
    if (wpm >= 30) return { label: t("average"), color: "text-yellow-500" }
    return { label: t("needsPractice"), color: "text-red-500" }
  }

  const getAccuracyRating = (accuracy: number) => {
    if (accuracy >= 95) return { label: t("perfect"), color: "text-green-500" }
    if (accuracy >= 90) return { label: t("excellent"), color: "text-blue-500" }
    if (accuracy >= 80) return { label: t("good"), color: "text-yellow-500" }
    return { label: t("needsWork"), color: "text-red-500" }
  }

  const wpmRating = getWPMRating(result.wpm)
  const accuracyRating = getAccuracyRating(result.accuracy)

  return (
    <div className="max-full mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header */}
      <SavingResultsIndicator isVisible={!isSaved} />
      <div className="text-center space-y-2">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold">{t("testComplete")}</h2>
        <p className="text-sm sm:text-base text-muted-foreground">{t("hereAreResults")}</p>
      </div>

      {/* Main Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* WPM Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
              {t("wordsPerMinute")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold">{result.wpm}</span>
                <span className="text-base sm:text-lg text-muted-foreground">{t("wpm")}</span>
              </div>
              <Badge variant="outline" className={wpmRating.color}>
                {wpmRating.label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Accuracy Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              {t("accuracy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-bold">{result.accuracy}</span>
                <span className="text-base sm:text-lg text-muted-foreground">%</span>
              </div>
              <Badge variant="outline" className={accuracyRating.color}>
                {accuracyRating.label}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranking Card */}
      {userRank && (
        <Card className="bg-gradient-to-r from-accent/20 to-transparent border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
              {t("globalRanking")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xl sm:text-2xl font-bold">#{userRank.rank}</p>
                <p className="text-sm text-muted-foreground">{t("outOfAllPlayers")}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-base sm:text-lg font-semibold">
                  {userRank.bestWpm} {t("wpm")} {t("best")}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {userRank.testsCompleted} {t("testsCompleted")}
                </p>
              </div>
              <Button variant="outline" asChild className="w-full sm:w-auto bg-transparent">
                <Link href="/leaderboard">{t("viewLeaderboard")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
            {t("detailedStatistics")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <div className="text-center p-2 sm:p-4 bg-muted/30 rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground">{t("correctCharacters")}</p>
              <p className="text-lg sm:text-2xl font-bold text-green-500">{result.correctChars}</p>
            </div>
            <div className="text-center p-2 sm:p-4 bg-muted/30 rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground">{t("totalCharacters")}</p>
              <p className="text-lg sm:text-2xl font-bold">{result.totalChars}</p>
            </div>
            <div className="text-center p-2 sm:p-4 bg-muted/30 rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground">{t("errors")}</p>
              <p className="text-lg sm:text-2xl font-bold text-red-500">{result.errors}</p>
            </div>
            <div className="text-center p-2 sm:p-4 bg-muted/30 rounded-lg">
              <p className="text-xs sm:text-sm text-muted-foreground">{t("time")}</p>
              <p className="text-lg sm:text-2xl font-bold">{Math.round(result.timeElapsed)}s</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Info */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs sm:text-sm">
                {result.testType === "time"
                  ? `${result.testValue} ${t("seconds")}`
                  : `${result.testValue} ${t("words")}`}
              </Badge>
              <Badge variant="outline" className="capitalize text-xs sm:text-sm">
                {t(("language." + result.language) as keyof typeof t)}
              </Badge>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {t("completedAt")} {new Date(result.completedAt).toLocaleTimeString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <Button onClick={onRestart} size="lg" className="w-full sm:w-auto">
          <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          {t("tryAgain")}
        </Button>
        {/* There is not share logic for now */}

        {/* <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
          <Share2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          {t("shareResults")}
        </Button> */}
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            {t("tipsToImprove")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            {result.accuracy < 90 && <p>• {t("focusOnAccuracy")}</p>}
            {result.wpm < 40 && <p>• {t("practiceTouchTyping")}</p>}
            {result.errors > 5 && <p>• {t("takeYourTime")}</p>}
            <p>• {t("regularPractice")}</p>
            <p>• {t("tryDifferentLanguages")}</p>
            <p>• {t("checkLeaderboard")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
