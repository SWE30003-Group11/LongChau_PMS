"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/components/theme-provider"
import { NotificationProvider } from "@/contexts/NotificationContext"
import NotificationBar from "@/components/notification-bar"

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <NotificationProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <NotificationBar />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}