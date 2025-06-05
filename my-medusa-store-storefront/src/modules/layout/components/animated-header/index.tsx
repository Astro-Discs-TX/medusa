"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { clx } from "@medusajs/ui"
import Nav from "@modules/layout/templates/nav"
import MobileMenu from "@modules/layout/components/mobile-menu"

const AnimatedHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  
  // Transform values based on scroll position with more subtle animations
  const headerOpacity = useTransform(scrollY, [0, 50], [1, 0.98])
  const headerScale = useTransform(scrollY, [0, 50], [1, 0.99])
  const headerShadow = useTransform(
    scrollY,
    [0, 50],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 20px rgba(0,0,0,0.03), 0px 2px 6px rgba(212,175,55,0.08)"]
  )
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255,255,240,0.85)", "rgba(255,255,240,0.97)"]
  )
  
  // Update isScrolled state based on scroll position
  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener("scroll", updateScrollState)
    return () => window.removeEventListener("scroll", updateScrollState)
  }, [])

  return (
    <motion.header
      className={clx(
        "sticky top-0 inset-x-0 z-50 group transition-all duration-500 backdrop-blur-sm",
        {
          "border-b border-luxury-gold/10": isScrolled,
        }
      )}
      style={{
        opacity: headerOpacity,
        scale: headerScale,
        boxShadow: headerShadow,
        backgroundColor: headerBg,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.1
      }}
    >
      {/* Decorative gold line that appears when scrolled */}
      {isScrolled && (
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[1px] gold-gradient"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
      
      <Nav />
      <MobileMenu />
    </motion.header>
  )
}

export default AnimatedHeader 