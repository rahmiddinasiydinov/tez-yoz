'use client'

import { useI18n } from '@/lib/i18n-context'
import React from 'react'

type Props = {}

function ProfilePageContent({ }: Props) {
    const { t } = useI18n()
    return (
        <>
            <h1 className="font-heading text-3xl font-bold mb-2">{t('yourProfile')}</h1>
            <p className="text-muted-foreground">{t('trackYourTyping')}</p></>
    )
}

export default ProfilePageContent