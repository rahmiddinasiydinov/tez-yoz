'use client'

import { useI18n } from '@/lib/i18n-context'
import React from 'react'

type Props = {}

function LeaderBoardPageContent({ }: Props) {
    const { t } = useI18n()
    return (
        <div className="text-center">
            <h1 className="font-heading text-3xl font-bold mb-2">{t("topTypists")}</h1>
            <p className="text-muted-foreground">{t("seeHowYouRank")}</p>
        </div>
    )
}

export default LeaderBoardPageContent