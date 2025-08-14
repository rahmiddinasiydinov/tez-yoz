"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface TestSettings {
  testType: "time" | "words"
  timeOptions: number[]
  wordOptions: number[]
  selectedTime: number
  selectedWords: number
  language: string
  theme: "light" | "dark" | "system"
  soundEnabled: boolean
  showWpmLive: boolean
}

interface SettingsContextType {
  settings: TestSettings
  updateSettings: (newSettings: Partial<TestSettings>) => void
  resetSettings: () => void
}

const defaultSettings: TestSettings = {
  testType: "time",
  timeOptions: [15, 30, 60, 120],
  wordOptions: [15, 30, 50, 100],
  selectedTime: 30,
  selectedWords: 30,
  language: "english",
  theme: "dark",
  soundEnabled: false,
  showWpmLive: true,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<TestSettings>(defaultSettings)

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem("typeSpeed_settings")
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error("Failed to parse saved settings:", error)
      }
    }
  }, [])

  const updateSettings = (newSettings: Partial<TestSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem("typeSpeed_settings", JSON.stringify(updatedSettings))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.setItem("typeSpeed_settings", JSON.stringify(defaultSettings))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>{children}</SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
