'use client'
import React from 'react'
import { TypingTest } from '../typing-test'
import { useSettings } from '@/lib/settings-context'
import { Toaster } from 'sonner'

type Props = {}

function TestWrapper({ }: Props) {
    const { settings } = useSettings()

    return (
        <>
            <TypingTest
                testType={settings.testType}
                testValue={settings.testType === "time" ? settings.selectedTime : settings.selectedWords}
                language={settings.language}
            />
            <Toaster richColors position="bottom-right" />

        </>
    )
}

export default TestWrapper