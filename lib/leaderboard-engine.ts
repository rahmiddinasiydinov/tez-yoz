'use client'

import type { User } from "./auth-context"
import { getUserTestResults, type DetailedTestResult } from "./statistics-engine"

export interface LeaderboardEntry {
  userId: string
  username: string
  score: number
  rank: number
  testsCompleted: number
  bestWpm: number
  averageWpm: number
  averageAccuracy: number
  consistencyScore: number
  lastActive: string
  badge?: string
}

export interface LeaderboardFilters {
  category: "wpm" | "accuracy" | "consistency" | "tests"
  period: "daily" | "weekly" | "monthly" | "all-time"
  testType: "all" | "time" | "words"
  language: "all" | string
}

export const calculateUserScore = (results: DetailedTestResult[], category: LeaderboardFilters["category"]): number => {
  if (results.length === 0) return 0

  switch (category) {
    case "wpm":
      return Math.max(...results.map((r) => r.wpm))
    case "accuracy":
      return Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length)
    case "consistency": {
      const wpmValues = results.map((r) => r.wpm)
      const mean = wpmValues.reduce((sum, wpm) => sum + wpm, 0) / wpmValues.length
      const variance = wpmValues.reduce((sum, wpm) => sum + Math.pow(wpm - mean, 2), 0) / wpmValues.length
      const stdDev = Math.sqrt(variance)
      return Math.max(0, Math.round(100 - (stdDev / mean) * 100))
    }
    case "tests":
      return results.length
    default:
      return 0
  }
}

export const filterResultsByPeriod = (
  results: DetailedTestResult[],
  period: LeaderboardFilters["period"],
): DetailedTestResult[] => {
  if (period === "all-time") return results

  const now = new Date()
  const cutoffDate = new Date()

  switch (period) {
    case "daily":
      cutoffDate.setDate(now.getDate() - 1)
      break
    case "weekly":
      cutoffDate.setDate(now.getDate() - 7)
      break
    case "monthly":
      cutoffDate.setMonth(now.getMonth() - 1)
      break
  }

  return results.filter((result) => new Date(result.completedAt) >= cutoffDate)
}

export const filterResultsByTest = (
  results: DetailedTestResult[],
  testType: LeaderboardFilters["testType"],
  language: LeaderboardFilters["language"],
): DetailedTestResult[] => {
  let filtered = results

  if (testType !== "all") {
    filtered = filtered.filter((result) => result.testType === testType)
  }

  if (language !== "all") {
    filtered = filtered.filter((result) => result.language === language)
  }

  return filtered
}

export const getBadge = (rank: number, category: string): string | undefined => {
  if (rank === 1) return "🥇"
  if (rank === 2) return "🥈"
  if (rank === 3) return "🥉"
  if (rank <= 10) return "🏆"
  if (rank <= 25) return "⭐"
  return undefined
}

export const generateLeaderboard = (filters: LeaderboardFilters): LeaderboardEntry[] => {
  // Get all users
  const allUsers = JSON.parse(localStorage.getItem("typeSpeed_users") || "[]") as User[]

  if (allUsers.length === 0) return []

  // Calculate scores for each user
  const entries: LeaderboardEntry[] = allUsers.map((user) => {
    const userResults = getUserTestResults(user.id)

    // Apply filters
    const periodFiltered = filterResultsByPeriod(userResults, filters.period)
    const testFiltered = filterResultsByTest(periodFiltered, filters.testType, filters.language)

    const score = calculateUserScore(testFiltered, filters.category)

    // Calculate additional stats
    const bestWpm = testFiltered.length > 0 ? Math.max(...testFiltered.map((r) => r.wpm)) : 0
    const averageWpm =
      testFiltered.length > 0 ? Math.round(testFiltered.reduce((sum, r) => sum + r.wpm, 0) / testFiltered.length) : 0
    const averageAccuracy =
      testFiltered.length > 0
        ? Math.round(testFiltered.reduce((sum, r) => sum + r.accuracy, 0) / testFiltered.length)
        : 0

    // Consistency score
    const wmpValues = testFiltered.map((r) => r.wpm)
    const wmpMean = wmpValues.length > 0 ? wmpValues.reduce((sum, wpm) => sum + wpm, 0) / wmpValues.length : 0
    const wmpVariance =
      wmpValues.length > 0 ? wmpValues.reduce((sum, wpm) => sum + Math.pow(wpm - wmpMean, 2), 0) / wmpValues.length : 0
    const wmpStdDev = Math.sqrt(wmpVariance)
    const consistencyScore = wmpMean > 0 ? Math.max(0, Math.round(100 - (wmpStdDev / wmpMean) * 100)) : 0

    const lastActive = testFiltered.length > 0 ? testFiltered[testFiltered.length - 1].completedAt : user.createdAt

    return {
      userId: user.id,
      username: user.username,
      score,
      rank: 0, // Will be set after sorting
      testsCompleted: testFiltered.length,
      bestWpm,
      averageWpm,
      averageAccuracy,
      consistencyScore,
      lastActive,
    }
  })

  // Sort by score (descending) and assign ranks
  const sortedEntries = entries
    .filter((entry) => entry.testsCompleted > 0) // Only include users with tests
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      badge: getBadge(index + 1, filters.category),
    }))

  return sortedEntries
}

export const getUserRank = (userId: string, filters: LeaderboardFilters): LeaderboardEntry | null => {
  const leaderboard = generateLeaderboard(filters)
  return leaderboard.find((entry) => entry.userId === userId) || null
}

export const getTopPerformers = (filters: LeaderboardFilters, limit = 10): LeaderboardEntry[] => {
  return generateLeaderboard(filters).slice(0, limit)
}
