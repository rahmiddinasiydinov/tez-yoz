"use client"

import React, { useMemo } from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RotateCcw, Settings } from "lucide-react"
import {
  calculateWPM,
  calculateAccuracy,
  getRandomText,
  generateAdditionalText,
  type TestResult,
} from "@/lib/typing-engine"
import { saveTestResult } from "@/lib/statistics-engine"
import { useAuth } from "@/lib/auth-context"
import { useI18n } from "@/lib/i18n-context"
import TestResults from "./test-results"
import Link from "next/link"
import TimeProgress from "./progress/time-progress"

interface TypingTestProps {
  testType?: "time" | "words"
  testValue?: number
  language?: string
}

export function TypingTest({ testType = "time", testValue = 30, language = "uzbek" }: TypingTestProps) {
  const { user } = useAuth()
  const { t } = useI18n()
  const [text, setText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(testValue)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [errors, setErrors] = useState(0)
  const [testComplete, setTestComplete] = useState(false)
  const [testResult, setTestResult] = useState<TestResult | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const textCharsRef = useRef<string[]>([])
  const userInputRef = useRef(userInput)
  const textRef = useRef(text)
  const errorsRef = useRef(errors)
  const lastCheckedIndex = useRef(0)
  const testCompleteRef = useRef(false)
  const testValueRef = useRef(15);

  userInputRef.current = userInput
  textRef.current = text
  errorsRef.current = errors
  testCompleteRef.current = testComplete
  testValueRef.current = testValue


  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const newText = getRandomText(language, testType === "words" ? testValue : undefined)
    setText(newText)
    textCharsRef.current = newText.split("")
    resetTest()
  }, [testType, testValue, language])

  const resetTest = useCallback(() => {
    setIsActive(false)
    setTimeLeft(testType === "time" ? testValue : 0)
    setStartTime(null)
    setErrors(0)
    setTestComplete(false)
    setTestResult(null)
    setUserInput('')

    const newText = getRandomText(language, testType === "words" ? testValue : undefined)
    setText(newText)
    textCharsRef.current = newText.split("")

    userInputRef.current = ''
    textRef.current = newText
    errorsRef.current = 0
    lastCheckedIndex.current = 0
    testCompleteRef.current = false

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [testType, testValue, language])

  const startTest = useCallback(() => {
    if (isActive) return

    setIsActive(true)
    setStartTime(Date.now())

    if (testType === "time") {

      intervalRef.current = setInterval(() => {

        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Clear interval before completing test to prevent race conditions
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            // Use setTimeout to ensure state updates are processed

            setTimeout(() => completeTest(), 0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
  }, [isActive, testType])

  const completeTest = useCallback(() => {
    // Prevent multiple completions
    console.log('complete test is rerunning');

    if (testCompleteRef.current) return

    const userInput = userInputRef.current
    const text = textRef.current
    const errors = errorsRef.current

    setIsActive(false)
    setTestComplete(true)
    testCompleteRef.current = true

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    let timeElapsed: number
    if (testType === "time") {
      timeElapsed = testValueRef.current
    } else {
      timeElapsed = startTime ? Math.max((Date.now() - startTime) / 1000, 1) : 1
    }

    const inputChars = userInput.split("")
    let correctChars = 0
    let totalChars = userInput.length

    // Add bounds checking for safety
    for (let i = 0; i < inputChars.length && i < text.length; i++) {
      if (inputChars[i] === text[i]) {
        correctChars++
      }
    }

    if (totalChars === 0) {
      totalChars = 1
    }
    if (timeElapsed === 0) {
      timeElapsed = 1
    }

    const wpm = calculateWPM(correctChars, timeElapsed)
    const accuracy = calculateAccuracy(correctChars, totalChars)

    const result: TestResult = {
      wpm,
      accuracy,
      errors,
      correctChars,
      totalChars,
      timeElapsed,
      testType,
      testValue,
      language,
      completedAt: new Date().toISOString(),
    }

    setTestResult(result)
    saveTestResult(result, user?.id)
  }, [startTime, testType, testValue, language, user])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (!isActive && !testComplete && value.length > 0) {
        startTest()
      }

      if (testComplete) return
      setUserInput(value)

      if (testType === "time" && value.length > text.length - 50) {
        const additionalText = generateAdditionalText(language, text, text.length + 200)
        setText(additionalText)
        textCharsRef.current = additionalText.split("")
      }

      const currentLength = value.length
      const lastLength = lastCheckedIndex.current

      // Improved error calculation with bounds checking
      if (currentLength > lastLength) {
        let newErrors = 0
        for (let i = lastLength; i < currentLength && i < textCharsRef.current.length; i++) {
          if (value[i] !== textCharsRef.current[i]) {
            newErrors++
          }
        }
        if (newErrors > 0) {
          setErrors((prev) => prev + newErrors)
        }
      } else if (currentLength < lastLength) {
        // Recalculate total errors when backspacing
        let totalErrors = 0
        for (let i = 0; i < currentLength && i < textCharsRef.current.length; i++) {
          if (value[i] !== textCharsRef.current[i]) {
            totalErrors++
          }
        }
        setErrors(totalErrors)
      }

      lastCheckedIndex.current = currentLength

      if (testType === "words") {
        const wordsTyped = value.trim().split(" ").length

        if (value.length >= text.length || wordsTyped >= testValue) {
          console.log('the same with word');
          completeTest()
        }
      }
    },
    [isActive, testComplete, startTest, testType, text, language, testValue, completeTest],
  )

  const renderText = () => {
    const chars = []
    const inputLength = userInput.length

    for (let i = 0; i < text.length; i++) {
      let className = "text-muted-foreground"

      if (i < inputLength) {
        className = userInput[i] === text[i] ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"
      } else if (i === inputLength) {
        className = "bg-accent text-accent-foreground animate-pulse"
      }

      chars.push(
        <span key={i} className={className}>
          {text[i]}
        </span>,
      )
    }

    return chars
  }

  if (testResult) {
    return <TestResults result={testResult} onRestart={resetTest} />
  }

  return (
    <div className="max-full mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      {testType === "words" && isActive && (
        <Progress value={(Math.min(userInput.trim().split(" ").length, testValue) / testValue) * 100} className="h-2" />
      )}

      {testType === "time" && isActive && <TimeProgress testValue={testValue} isActive={isActive} onComplete={() => { }} />}

      <Card className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs sm:text-sm">
                {testType === "time" ? `${testValue} ${t("seconds")}` : `${testValue} ${t("words")}`}
              </Badge>
              <Badge variant="outline" className="capitalize text-xs sm:text-sm">
                {t('language')}
              </Badge>
              {isActive && testType === "time" && (
                <Badge variant="outline" className="text-sm sm:text-lg font-mono">
                  {timeLeft}s
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" asChild className="flex-1 sm:flex-none bg-transparent">
                <Link href="/settings">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">{t("settings")}</span>
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={resetTest} className="flex-1 sm:flex-none bg-transparent">
                <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">{t("reset")}</span>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div
              className="text-sm sm:text-base lg:text-lg leading-relaxed font-mono p-3 sm:p-4 lg:p-6 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 min-h-[150px] sm:min-h-[200px] cursor-text overflow-hidden"
              onClick={() => inputRef.current?.focus()}
            >
              {renderText()}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="absolute inset-0 opacity-0 cursor-default"
              disabled={testComplete}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder=""
            />
          </div>

          {!isActive && !testComplete && (
            <div className="text-center space-y-2">
              <p className="text-base sm:text-lg text-muted-foreground">{t("clickToStart")}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{t("startTypingInstruction")}</p>
            </div>
          )}

          {isActive && (
            <div className="text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">{t("typingInstruction")}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}