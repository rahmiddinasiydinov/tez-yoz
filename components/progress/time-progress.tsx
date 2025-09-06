import { Progress } from "@/components/ui/progress"
import React, { useState, useEffect, useRef } from 'react'

type Props = {
    testValue: number
    isActive: boolean
    onComplete: () => void
}

function TimeProgress({ testValue, isActive, onComplete }: Props) {
    const [startTime, setStartTime] = useState<number | null>(null)
    const [currentTime, setCurrentTime] = useState<number>(0)
    const [timeLeft, setTimeLeft] = useState(testValue)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (isActive && !startTime) {
            const now = Date.now()
            setStartTime(now)
            setCurrentTime(now)

            intervalRef.current = setInterval(() => {
                const elapsed = Date.now() - now
                const remaining = Math.max(0, testValue * 1000 - elapsed)
                
                setCurrentTime(Date.now())
                setTimeLeft(Math.ceil(remaining / 1000))
                
                if (remaining <= 0) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current)
                        intervalRef.current = null
                    }
                    setTimeout(() => onComplete(), 0)
                }
            }, 100) // Update every 100ms for smooth progress
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [isActive, testValue])

    useEffect(() => {
        if (!isActive) {
            setStartTime(null)
            setCurrentTime(0)
            setTimeLeft(testValue)
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [isActive, testValue])

    const progress = startTime && isActive 
        ? Math.min(((currentTime - startTime) / (testValue * 1000)) * 100, 100) 
        : 0

    return (
        <Progress
            value={progress}
            className="h-2"
            max={testValue}
        />
    )
}

export default TimeProgress