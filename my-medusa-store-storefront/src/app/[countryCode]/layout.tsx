import React from "react"
import Footer from "@modules/layout/templates/footer"
import AnimatedHeader from "@modules/layout/components/animated-header"
import PrefetchProvider from "@modules/layout/components/prefetch-provider"

export default function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { countryCode: string }
}) {
  // The (checkout) group has its own header and footer
  // We'll render just the children for that group
  return (
    <PrefetchProvider>
      <div className="flex flex-col min-h-screen">
        <div id="store-nav">
          <AnimatedHeader />
        </div>
        <main className="flex-1 relative">{children}</main>
        <div id="store-footer">
          <Footer />
        </div>
      </div>
    </PrefetchProvider>
  )
} 