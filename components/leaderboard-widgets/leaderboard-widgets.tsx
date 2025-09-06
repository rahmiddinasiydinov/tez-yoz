import React from 'react'
import { LeaderboardWidget } from '../leaderboard/leaderboard-widget'

type Props = {}

function LeaderboardWidgets({ }: Props) {
    return (

        <div className="space-y-6">
            <LeaderboardWidget
                title="Top WPM"
                filters={{
                    category: "wpm",
                    period: "all-time",
                    testType: "all",
                    language: "all",
                }}
                limit={5}
            />

            <LeaderboardWidget
                title="Most Accurate"
                filters={{
                    category: "accuracy",
                    period: "all-time",
                    testType: "all",
                    language: "all",
                }}
                limit={5}
            />
        </div>
    )
}

export default LeaderboardWidgets