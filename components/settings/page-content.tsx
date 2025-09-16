'use client'

import { useI18n } from '@/lib/i18n-context'
import React from 'react'

type Props = {}

function SettingsPageContent({ }: Props) {
    const { t } = useI18n()
    return (
        <>
            <h1 className="font-heading text-3xl font-bold mb-2">{t('settings')}</h1>
            <p className="text-muted-foreground">{t('customizeTyping')}</p>
        </>
    )
}

export default SettingsPageContent;