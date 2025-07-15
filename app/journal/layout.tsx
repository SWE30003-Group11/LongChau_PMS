import type React from "react"
import Navbar from "@/components/navbar"

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
