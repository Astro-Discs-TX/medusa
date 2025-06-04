"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { clx } from "@medusajs/ui"
import Nav from "@modules/layout/templates/nav"
import MobileMenu from "@modules/layout/components/mobile-menu"

const AnimatedHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  
  // Transform values based on scroll position
  const headerOpacity = useTransform(scrollY, [0, 50], [1, 0.98])
  const headerScale = useTransform(scrollY, [0, 50], [1, 0.98])
  const headerShadow = useTransform(
    scrollY,
    [0, 50],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 5px 15px rgba(0,0,0,0.05)"]
  )
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255,255,255,0.8)", "rgba(255,255,255,0.95)"]
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
        "sticky top-0 inset-x-0 z-50 group transition-all duration-300 backdrop-blur-sm",
        {
          "border-b border-gray-100": isScrolled,
        }
      )}
      style={{
        opacity: headerOpacity,
        scale: headerScale,
        boxShadow: headerShadow,
        backgroundColor: headerBg,
      }}
    >
      <Nav />
      <MobileMenu />
    </motion.header>
  )
}

export default AnimatedHeader 