"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import safeStorage from "./safe-storage"

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
    // Load settings from storage on mount
    try {
      const saved = safeStorage.getJSON<TestSettings>("typeSpeed_settings", defaultSettings)
      setSettings({ ...defaultSettings, ...saved })
    } catch (error) {
      // ignore and keep defaults
    }
  }, [])

  const updateSettings = (newSettings: Partial<TestSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    safeStorage.setJSON("typeSpeed_settings", updatedSettings)
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    safeStorage.setJSON("typeSpeed_settings", defaultSettings)
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
