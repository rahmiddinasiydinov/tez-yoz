import { Navigation } from "@/components/navigation"
import { SettingsPanel } from "@/components/settings/settings-panel"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your typing experience</p>
        </div>
        <SettingsPanel />
      </main>
    </div>
  )
}
