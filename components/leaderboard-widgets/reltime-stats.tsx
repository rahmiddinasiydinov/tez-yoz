import React from 'react'
import { Card } from '../ui/card'
import { useI18n } from '@/lib/i18n-context'

type Props = {
    testType: string
    testValue: number
}

function RealtimeStats({ testType, testValue }: Props) {
      const { t } = useI18n()
    
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <Card className="p-2 sm:p-4">
                <div className="text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">{t("wpm")}</p>
                    <p className="text-lg sm:text-2xl font-bold">{ }</p>
                </div>
            </Card>
            <Card className="p-2 sm:p-4">
                <div className="text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">{t("accuracy")}</p>
                    <p className="text-lg sm:text-2xl font-bold">---%</p>
                </div>
            </Card>
            <Card className="p-2 sm:p-4">
                <div className="text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">{t("errors")}</p>
                    <p className="text-lg sm:text-2xl font-bold text-red-500">---</p>
                </div>
            </Card>
            <Card className="p-2 sm:p-4">
                <div className="text-center">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        {testType === "time" ? t("time") : t("progress")}
                    </p>
                    <p className="text-lg sm:text-2xl font-bold">
                        {testType === "time" ? `${testValue}s` : `0/${testValue}`}
                    </p>
                </div>
            </Card>
        </div>
    )
}

export default RealtimeStats