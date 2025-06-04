import React from "react"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      <main className="flex-1 relative">{children}</main>
      <Footer />
    </div>
  )
} 