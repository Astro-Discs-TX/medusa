"use client"

import React, { useState } from "react"
import { StoreRegion } from "@medusajs/types"
import SideMenu from "@modules/layout/components/side-menu"
import CartButton from "@modules/layout/components/cart-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion, AnimatePresence } from "framer-motion"

interface NavClientProps {
  regions: StoreRegion[]
  scrolled?: boolean
}

const NavClient: React.FC<NavClientProps> = ({ regions, scrolled = false }) => {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  
  // Navigation links data
  const navLinks = [
    { href: "/collections", label: "Collections", testId: "nav-collections-link" },
    { href: "/products", label: "Products", testId: "nav-products-link" },
    { href: "/about", label: "Craftsmanship", testId: "nav-about-link" },
  ]
  
  const rightLinks = [
    { href: "/account", label: "Account", testId: "nav-account-link" },
    { href: "/contact", label: "Contact", testId: "nav-contact-link" },
  ]

  // Animation variants for links
  const linkVariants = {
    hover: {
      y: -2,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  }

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex-1 basis-0 h-full flex items-center">
        <div className="h-full">
          <SideMenu regions={regions} />
        </div>
        
        {/* Navigation links - desktop */}
        <div className="hidden small:flex items-center gap-x-8 h-full ml-8">
          {navLinks.map((link) => (
            <motion.div 
              key={link.href} 
              className="relative"
              whileHover="hover"
              variants={linkVariants}
            >
              <LocalizedClientLink
                className="hover:text-luxury-gold transition-colors duration-300 uppercase tracking-wider text-small-semi py-2"
                href={link.href}
                data-testid={link.testId}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.label}
              </LocalizedClientLink>
              <AnimatePresence>
                {hoveredLink === link.href && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-px bg-luxury-gold"
                    layoutId="underline"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Logo */}
      <motion.div 
        className="flex items-center h-full"
        animate={{ 
          scale: scrolled ? 0.9 : 1,
          y: scrolled ? -1 : 0
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <LocalizedClientLink
          href="/"
          className="flex flex-col items-center"
          data-testid="nav-store-link"
        >
          <motion.span 
            className="font-display text-2xl text-luxury-gold hover:opacity-90 transition-all duration-300 relative group"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            MARBLE LUXE
            <motion.span 
              className="absolute -bottom-px left-0 h-px bg-luxury-gold"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
            />
          </motion.span>
          <motion.span 
            className={`text-luxury-charcoal/70 text-[10px] uppercase tracking-[0.2em] mt-0.5 transition-all duration-300 ${scrolled ? 'opacity-0 translate-y-1' : 'opacity-100'}`}
            animate={{ opacity: scrolled ? 0 : 1, y: scrolled ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            Fine Handicrafts
          </motion.span>
        </LocalizedClientLink>
      </motion.div>

      {/* Right side links */}
      <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
        <div className="hidden small:flex items-center gap-x-8 h-full">
          {rightLinks.map((link) => (
            <motion.div 
              key={link.href} 
              className="relative"
              whileHover="hover"
              variants={linkVariants}
            >
              <LocalizedClientLink
                className="hover:text-luxury-gold transition-colors duration-300 uppercase tracking-wider text-small-semi py-2"
                href={link.href}
                data-testid={link.testId}
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {link.label}
              </LocalizedClientLink>
              <AnimatePresence>
                {hoveredLink === link.href && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-px bg-luxury-gold"
                    layoutId="underline-right"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <div className="h-full flex items-center">
          <CartButton />
        </div>
      </div>
    </div>
  )
}

export default NavClient 