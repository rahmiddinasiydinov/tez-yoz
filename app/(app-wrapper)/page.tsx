'use client'
import TestWrapper from "@/components/typing/test-wrapper"
import { useI18n } from "@/lib/i18n-context"

export default function HomePage() {
  const { t } = useI18n()

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="min-h-screen bg-background">
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl font-bold mb-4 text-foreground">{t('pageTitle')}</h1>
            <p className="text-muted-foreground text-lg">{t('pageDescription')}</p>
          </div>
          <div>
            <div>
              <TestWrapper />
            </div>

          </div>
        </div>
      </main>
    </>
  )
}
