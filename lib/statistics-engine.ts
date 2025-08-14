import type { TestResult } from "./typing-engine"

export interface DetailedTestResult extends TestResult {
  id: string
  userId?: string
}

export interface StatisticsData {
  totalTests: number
  totalTimeTyping: number
  bestWpm: number
  averageWpm: number
  averageAccuracy: number
  totalErrors: number
  totalCharacters: number
  recentTests: DetailedTestResult[]
  wpmProgression: { date: string; wpm: number }[]
  accuracyProgression: { date: string; accuracy: number }[]
  testsByLanguage: Record<string, number>
  testsByType: Record<string, number>
  improvementRate: number
  consistencyScore: number
}

export const saveTestResult = (result: TestResult, userId?: string): DetailedTestResult => {
  const detailedResult: DetailedTestResult = {
    ...result,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    userId,
  }

  // Get existing results
  const existingResults = JSON.parse(localStorage.getItem("typeSpeed_testResults") || "[]")

  // Add new result
  existingResults.push(detailedResult)

  // Keep only last 100 results per user to prevent storage bloat
  const userResults = existingResults.filter((r: DetailedTestResult) => r.userId === userId).slice(-100)
  const otherResults = existingResults.filter((r: DetailedTestResult) => r.userId !== userId)

  localStorage.setItem("typeSpeed_testResults", JSON.stringify([...otherResults, ...userResults]))

  return detailedResult
}

export const getUserTestResults = (userId?: string): DetailedTestResult[] => {
  const allResults = JSON.parse(localStorage.getItem("typeSpeed_testResults") || "[]")
  return allResults.filter((result: DetailedTestResult) => result.userId === userId)
}

export const calculateStatistics = (userId?: string): StatisticsData => {
  const results = getUserTestResults(userId)

  if (results.length === 0) {
    return {
      totalTests: 0,
      totalTimeTyping: 0,
      bestWpm: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      totalErrors: 0,
      totalCharacters: 0,
      recentTests: [],
      wpmProgression: [],
      accuracyProgression: [],
      testsByLanguage: {},
      testsByType: {},
      improvementRate: 0,
      consistencyScore: 0,
    }
  }

  // Sort results by date
  const sortedResults = results.sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())

  // Basic statistics
  const totalTests = results.length
  const totalTimeTyping = results.reduce((sum, r) => sum + r.timeElapsed, 0)
  const bestWpm = Math.max(...results.map((r) => r.wpm))
  const averageWpm = Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / totalTests)
  const averageAccuracy = Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / totalTests)
  const totalErrors = results.reduce((sum, r) => sum + r.errors, 0)
  const totalCharacters = results.reduce((sum, r) => sum + r.totalChars, 0)

  // Recent tests (last 10)
  const recentTests = sortedResults.slice(-10).reverse()

  // Progression data (group by day)
  const progressionMap = new Map<string, { wpm: number[]; accuracy: number[] }>()

  sortedResults.forEach((result) => {
    const date = new Date(result.completedAt).toISOString().split("T")[0]
    if (!progressionMap.has(date)) {
      progressionMap.set(date, { wpm: [], accuracy: [] })
    }
    progressionMap.get(date)!.wpm.push(result.wpm)
    progressionMap.get(date)!.accuracy.push(result.accuracy)
  })

  const wpmProgression = Array.from(progressionMap.entries()).map(([date, data]) => ({
    date,
    wpm: Math.round(data.wpm.reduce((sum, wpm) => sum + wpm, 0) / data.wpm.length),
  }))

  const accuracyProgression = Array.from(progressionMap.entries()).map(([date, data]) => ({
    date,
    accuracy: Math.round(data.accuracy.reduce((sum, acc) => sum + acc, 0) / data.accuracy.length),
  }))

  // Tests by language and type
  const testsByLanguage: Record<string, number> = {}
  const testsByType: Record<string, number> = {}

  results.forEach((result) => {
    testsByLanguage[result.language] = (testsByLanguage[result.language] || 0) + 1
    testsByType[result.testType] = (testsByType[result.testType] || 0) + 1
  })

  // Improvement rate (WPM improvement over time)
  let improvementRate = 0
  if (wpmProgression.length >= 2) {
    const firstWpm = wpmProgression[0].wpm
    const lastWpm = wpmProgression[wpmProgression.length - 1].wpm
    const daysDiff = Math.max(1, wpmProgression.length)
    improvementRate = Math.round(((lastWpm - firstWpm) / daysDiff) * 100) / 100
  }

  // Consistency score (based on WPM standard deviation)
  const wpmValues = results.map((r) => r.wpm)
  const wpmMean = wpmValues.reduce((sum, wpm) => sum + wpm, 0) / wpmValues.length
  const wpmVariance = wpmValues.reduce((sum, wpm) => sum + Math.pow(wpm - wpmMean, 2), 0) / wpmValues.length
  const wpmStdDev = Math.sqrt(wpmVariance)
  const consistencyScore = Math.max(0, Math.round(100 - (wpmStdDev / wpmMean) * 100))

  return {
    totalTests,
    totalTimeTyping,
    bestWpm,
    averageWpm,
    averageAccuracy,
    totalErrors,
    totalCharacters,
    recentTests,
    wpmProgression,
    accuracyProgression,
    testsByLanguage,
    testsByType,
    improvementRate,
    consistencyScore,
  }
}

export const getGlobalStatistics = (): StatisticsData => {
  const allResults = JSON.parse(localStorage.getItem("typeSpeed_testResults") || "[]")

  if (allResults.length === 0) {
    return {
      totalTests: 0,
      totalTimeTyping: 0,
      bestWpm: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      totalErrors: 0,
      totalCharacters: 0,
      recentTests: [],
      wpmProgression: [],
      accuracyProgression: [],
      testsByLanguage: {},
      testsByType: {},
      improvementRate: 0,
      consistencyScore: 0,
    }
  }

  // Calculate global statistics from all results
  const totalTests = allResults.length
  const totalTimeTyping = allResults.reduce((sum: number, r: DetailedTestResult) => sum + r.timeElapsed, 0)
  const bestWpm = Math.max(...allResults.map((r: DetailedTestResult) => r.wpm))
  const averageWpm = Math.round(allResults.reduce((sum: number, r: DetailedTestResult) => sum + r.wpm, 0) / totalTests)
  const averageAccuracy = Math.round(
    allResults.reduce((sum: number, r: DetailedTestResult) => sum + r.accuracy, 0) / totalTests,
  )
  const totalErrors = allResults.reduce((sum: number, r: DetailedTestResult) => sum + r.errors, 0)
  const totalCharacters = allResults.reduce((sum: number, r: DetailedTestResult) => sum + r.totalChars, 0)

  const testsByLanguage: Record<string, number> = {}
  const testsByType: Record<string, number> = {}

  allResults.forEach((result: DetailedTestResult) => {
    testsByLanguage[result.language] = (testsByLanguage[result.language] || 0) + 1
    testsByType[result.testType] = (testsByType[result.testType] || 0) + 1
  })

  // Improvement rate (WPM improvement over time)
  let improvementRate = 0
  if (allResults.length >= 2) {
    const firstWpm = allResults[0].wpm
    const lastWpm = allResults[allResults.length - 1].wpm
    const daysDiff = Math.max(1, allResults.length)
    improvementRate = Math.round(((lastWpm - firstWpm) / daysDiff) * 100) / 100
  }

  // Consistency score (based on WPM standard deviation)
  const wpmValues = allResults.map((r) => r.wpm)
  const wpmMean = wpmValues.reduce((sum, wpm) => sum + wpm, 0) / wpmValues.length
  const wpmVariance = wpmValues.reduce((sum, wpm) => sum + Math.pow(wpm - wpmMean, 2), 0) / wpmValues.length
  const wpmStdDev = Math.sqrt(wpmVariance)
  const consistencyScore = Math.max(0, Math.round(100 - (wpmStdDev / wpmMean) * 100))

  return {
    totalTests,
    totalTimeTyping,
    bestWpm,
    averageWpm,
    averageAccuracy,
    totalErrors,
    totalCharacters,
    recentTests: allResults.slice(-10).reverse(),
    wpmProgression: [],
    accuracyProgression: [],
    testsByLanguage,
    testsByType,
    improvementRate,
    consistencyScore,
  }
}
