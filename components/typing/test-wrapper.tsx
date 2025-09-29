'use client'
import React from 'react'
import { TypingTest } from '../typing-test'
import { useSettings } from '@/lib/settings-context'

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

        </>
    )
}

export default TestWrapper