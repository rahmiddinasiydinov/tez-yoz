'use client'
import type React from "react"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth-context"
import Loader from "@/components/loading"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { isInitialized } = useAuth()
    console.log(isInitialized);

    if (!isInitialized) {
        return <Loader />
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
    )
}
