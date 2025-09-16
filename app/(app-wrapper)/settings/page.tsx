import SettingsPageContent from "@/components/settings/page-content"
import { SettingsPanel } from "@/components/settings/settings-panel"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <SettingsPageContent />
        </div>
        <SettingsPanel />
      </main>
    </div>
  )
}
