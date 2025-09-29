'use client'
import type React from "react"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth-context"
import Loader from "@/components/loading"
import { Toaster } from "sonner"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const { isInitialized } = useAuth()

    if (!isInitialized) {
        return <Loader />
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <Toaster richColors position="bottom-right" />

            <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
    )
}
