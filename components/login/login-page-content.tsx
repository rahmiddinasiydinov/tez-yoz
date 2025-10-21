'use client'
import { useI18n } from '@/lib/i18n-context'
import React from 'react'

type Props = {}

function LoginPageContent({ }: Props) {
    const { t } = useI18n();
    return (
        <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold mb-2">{t('welcomeBack')}</h1>
            <p className="text-muted-foreground">{t('trackYourTyping')}</p>
        </div>
    )
}

export default LoginPageContent