import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ToastProvider } from "@/components/ui/toast"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CareerLeap AI - Stop Guessing. Start Getting Hired.",
  description: "Your dream career is just one click away. AI-powered career tools for students and professionals.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <ToastProvider>
          <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
              <a href="/" className="text-base font-semibold text-primary">CareerLeap AI</a>
              <nav className="flex items-center gap-4">
                <a href="/" className="text-sm text-muted-foreground hover:text-foreground">Home</a>
                <a href="/history" className="text-sm text-muted-foreground hover:text-foreground">History</a>
              </nav>
            </div>
          </header>
          <Suspense fallback={null}>
            {children}
            <Analytics />
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  )
}
