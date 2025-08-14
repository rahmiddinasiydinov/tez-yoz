"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Clock, Hash, Globe, Eye, RotateCcw } from "lucide-react"
import { useSettings } from "@/lib/settings-context"
import { useI18n } from "@/lib/i18n-context"
import { cn } from "@/lib/utils"

const languageOptions = [
  { value: "uzbek", label: "O'zbek", flag: "🇺🇿" },
  { value: "english", label: "English", flag: "🇺🇸" },
  { value: "russian", label: "Русский", flag: "🇷🇺" },
  { value: "spanish", label: "Español", flag: "🇪🇸" },
  { value: "french", label: "Français", flag: "🇫🇷" },
  { value: "german", label: "Deutsch", flag: "🇩🇪" },
]

export function SettingsPanel() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const { t } = useI18n()

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Test Configuration */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="font-heading flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            {t.testType}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Type Selection */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                variant={settings.testType === "time" ? "default" : "outline"}
                onClick={() => updateSettings({ testType: "time" })}
                className="flex items-center gap-2 h-9"
                size="sm"
              >
                <Clock className="h-4 w-4" />
                {t.timeMode}
              </Button>
              <Button
                variant={settings.testType === "words" ? "default" : "outline"}
                onClick={() => updateSettings({ testType: "words" })}
                className="flex items-center gap-2 h-9"
                size="sm"
              >
                <Hash className="h-4 w-4" />
                {t.wordMode}
              </Button>
            </div>
          </div>

          {/* Time Options */}
          {settings.testType === "time" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.timeMode}</Label>
              <div className="flex flex-wrap gap-2">
                {settings.timeOptions.map((time) => (
                  <Badge
                    key={time}
                    variant={settings.selectedTime === time ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-2 py-1 text-xs hover:bg-accent",
                      settings.selectedTime === time && "bg-primary text-primary-foreground",
                    )}
                    onClick={() => updateSettings({ selectedTime: time })}
                  >
                    {time}s
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Word Options */}
          {settings.testType === "words" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t.words}</Label>
              <div className="flex flex-wrap gap-2">
                {settings.wordOptions.map((words) => (
                  <Badge
                    key={words}
                    variant={settings.selectedWords === words ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-2 py-1 text-xs hover:bg-accent",
                      settings.selectedWords === words && "bg-primary text-primary-foreground",
                    )}
                    onClick={() => updateSettings({ selectedWords: words })}
                  >
                    {words}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language Selection */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="font-heading flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-primary" />
            {t.language}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {languageOptions.map((lang) => (
              <Button
                key={lang.value}
                variant={settings.language === lang.value ? "default" : "outline"}
                onClick={() => updateSettings({ language: lang.value })}
                className="flex items-center gap-2 h-10 text-sm"
                size="sm"
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Display Preferences */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="font-heading flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-primary" />
            Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Live {t.wpm}</Label>
              <p className="text-xs text-muted-foreground">Show real-time typing speed</p>
            </div>
            <Switch
              checked={settings.showWpmLive}
              onCheckedChange={(checked) => updateSettings({ showWpmLive: checked })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Sound Effects</Label>
              <p className="text-xs text-muted-foreground">Keystroke and completion sounds</p>
            </div>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reset Settings */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Reset Settings</h3>
              <p className="text-xs text-muted-foreground">Restore defaults</p>
            </div>
            <Button
              variant="outline"
              onClick={resetSettings}
              size="sm"
              className="flex items-center gap-2 bg-transparent"
            >
              <RotateCcw className="h-4 w-4" />
              {t.restart}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
