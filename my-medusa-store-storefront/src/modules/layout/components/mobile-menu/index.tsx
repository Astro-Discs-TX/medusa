"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { usePathname } from "next/navigation"

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: "Treasures", href: "/products" },
    { label: "Craftsmanship", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  // Animation variants for staggered menu items
  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  }

  return (
    <div className="lg:hidden">
      {/* Luxury hamburger button */}
      <button 
        className="p-2 focus:outline-none" 
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <div className="w-6 flex flex-col gap-1">
          <motion.span 
            className="w-full h-0.5 bg-luxury-charcoal block rounded-full"
            animate={isOpen ? { rotate: 45, y: 6, backgroundColor: "#D4AF37" } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span 
            className="w-3/4 h-0.5 bg-luxury-charcoal block ml-auto rounded-full"
            animate={isOpen ? { opacity: 0, width: 0 } : { opacity: 1, width: "75%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span 
            className="w-full h-0.5 bg-luxury-charcoal block rounded-full"
            animate={isOpen ? { rotate: -45, y: -6, backgroundColor: "#D4AF37" } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </button>

      {/* Luxury mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 bg-luxury-ivory z-50 flex flex-col"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top section with close button */}
            <div className="flex justify-between items-center p-5 border-b border-luxury-gold/10">
              <motion.h3 
                className="font-display text-2xl text-luxury-gold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                MARBLE LUXE
              </motion.h3>
              <button 
                className="p-2 focus:outline-none text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300" 
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Menu items with staggered animation */}
            <div className="flex flex-col items-center justify-center flex-1 gap-6 p-8">
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  custom={i}
                  variants={menuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="w-full text-center"
                >
                  <LocalizedClientLink 
                    href={item.href}
                    onClick={closeMenu}
                    className={`block py-3 text-xl relative overflow-hidden group ${
                      pathname === item.href 
                        ? "text-luxury-gold font-medium" 
                        : "text-luxury-charcoal hover:text-luxury-gold"
                    } transition-colors duration-300`}
                  >
                    <div className="relative z-10">
                      <Text className="font-display tracking-wider">{item.label}</Text>
                    </div>
                    {/* Animated underline effect */}
                    <motion.div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-px bg-luxury-gold"
                      initial={{ width: pathname === item.href ? "100%" : "0%" }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </LocalizedClientLink>
                </motion.div>
              ))}
            </div>

            {/* Social links at the bottom */}
            <div className="border-t border-luxury-gold/10 py-6 flex justify-center space-x-6">
              <motion.a 
                href="#" 
                className="text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MobileMenu 