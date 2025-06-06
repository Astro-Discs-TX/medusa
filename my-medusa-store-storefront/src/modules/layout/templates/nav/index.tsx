"use client"

import { Suspense, useState, useEffect } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"

// Dynamically import the client components
const NavClient = dynamic(
  () => import("@modules/layout/components/nav-client"),
  { ssr: true }
)

export default function Nav() {
  const [regions, setRegions] = useState<StoreRegion[]>([])
  const [scrolled, setScrolled] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const fetchRegions = async () => {
      const regionsData = await listRegions()
      setRegions(regionsData)
    }
    fetchRegions()
  }, [])

  // Handle scroll behavior for header visibility with smoother transitions
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      
      // Determine if we're scrolling up or down
      const isScrolledDown = currentScrollPos > prevScrollPos
      
      // Only hide header after scrolling down a bit (80px) for better UX
      if (currentScrollPos > 80) {
        setVisible(!isScrolledDown)
      } else {
        setVisible(true)
      }
      
      // Set scrolled state for styling
      setScrolled(currentScrollPos > 20)
      
      setPrevScrollPos(currentScrollPos)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos])

  return (
    <motion.div 
      className="sticky top-0 inset-x-0 z-50 group"
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        top: visible ? 0 : -100 
      }}
      transition={{ 
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]  // Custom ease curve for elegant motion
      }}
    >
      <header 
        className={`relative mx-auto border-b duration-300 transition-all ${
          scrolled 
            ? "h-16 bg-luxury-ivory/98 backdrop-blur-md shadow-md border-luxury-gold/5" 
            : "h-20 bg-luxury-ivory border-luxury-lightgold/10"
        }`}
      >
        {/* Decorative gold gradient line at the top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-luxury-gold/40 via-luxury-gold/80 to-luxury-gold/40"></div>
        
        {/* Animated highlight that appears when scrolled */}
        {scrolled && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-luxury-gold/20"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          />
        )}
        
        <nav className={`max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 text-luxury-charcoal flex items-center justify-between w-full h-full transition-all duration-300 ${
          scrolled ? "py-0" : "py-1"
        }`}>
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="spinner"></div>
            </div>
          }>
            <NavClient regions={regions} scrolled={scrolled} />
          </Suspense>
        </nav>
      </header>
    </motion.div>
  )
}
