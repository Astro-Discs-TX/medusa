import { Suspense } from "react"
import { Metadata } from "next"

import AnimatedHeader from "@modules/layout/components/animated-header"
import Footer from "@modules/layout/components/footer"
import PageTransition from "@modules/common/components/page-transition"
import LoadingSpinner from "@modules/common/components/loading-spinner"

export const metadata: Metadata = {
  title: "Marble Craft Luxury Store",
  description: "Exquisite handcrafted marble products for your home",
}

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AnimatedHeader />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <LoadingSpinner size="large" />
        </div>
      }>
        <PageTransition className="min-h-[calc(100vh-200px)]">
          {children}
        </PageTransition>
      </Suspense>
      <Footer />
    </>
  )
}
