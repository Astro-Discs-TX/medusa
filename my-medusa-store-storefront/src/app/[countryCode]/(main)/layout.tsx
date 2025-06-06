"use client"

import { Suspense } from "react"
import AnimatedHeader from "@modules/layout/components/animated-header"
import Footer from "@modules/layout/components/footer"
import PageTransition from "@modules/common/components/page-transition"
import LoadingSpinner from "@modules/common/components/loading-spinner"

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Hide the parent layout's header and footer */}
      <style jsx global>{`
        #store-nav, #store-footer {
          display: none !important;
        }
      `}</style>
      
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
