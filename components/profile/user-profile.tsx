"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, BarChart3, History } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { StatisticsDashboard } from "@/components/statistics/statistics-dashboard"
import { TestHistory } from "@/components/statistics/test-history"
import { useI18n } from "@/lib/i18n-context"

export function UserProfile() {
  const { user } = useAuth()
  const { t } = useI18n()

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">{t('pleaseLogin')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
              <span className="font-bold text-accent-foreground text-lg">{user.username.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-2xl">{user.username}</h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{t('joined')}: {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('statisticsOverview')}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            {t('testHistory')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <StatisticsDashboard />
        </TabsContent>

        <TabsContent value="history">
          <TestHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
