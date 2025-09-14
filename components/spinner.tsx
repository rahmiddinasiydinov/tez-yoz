import React from 'react'

type Props = {}

function Spinner({ }: Props) {
    return (
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
    )
}

export default Spinner