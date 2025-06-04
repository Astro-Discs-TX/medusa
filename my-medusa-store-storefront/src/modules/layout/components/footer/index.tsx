"use client"

import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@lib/hooks/use-scroll-animation"

const Footer = () => {
  const { ref, isInView } = useScrollAnimation({
    threshold: 0.1,
  })

  const currentYear = new Date().getFullYear()

  return (
    <footer ref={ref} className="bg-gray-50 py-12">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <Heading level="h3" className="text-xl mb-4 font-serif">Marble Luxe</Heading>
            <Text className="text-ui-fg-subtle mb-4">
              Exquisite handcrafted marble artifacts for your luxury home.
            </Text>
            <div className="flex space-x-4">
              <a href="#" className="text-ui-fg-subtle hover:text-ui-fg-base">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-ui-fg-subtle hover:text-ui-fg-base">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Heading level="h3" className="text-xl mb-4 font-serif">Shop</Heading>
            <ul className="space-y-2">
              <li>
                <LocalizedClientLink href="/products" className="text-ui-fg-subtle hover:text-ui-fg-base">
                  All Products
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections" className="text-ui-fg-subtle hover:text-ui-fg-base">
                  Collections
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/about" className="text-ui-fg-subtle hover:text-ui-fg-base">
                  About Us
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/contact" className="text-ui-fg-subtle hover:text-ui-fg-base">
                  Contact
                </LocalizedClientLink>
              </li>
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Heading level="h3" className="text-xl mb-4 font-serif">Customer Service</Heading>
            <ul className="space-y-2">
              <li>
                <LocalizedClientLink href="/shipping" className="text-ui-fg-subtle hover:text-ui-fg-base">
                  Shipping & Returns
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/faq" className="text-ui-fg-subtle hover:text-ui-fg-base">
                  FAQ
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/care" className="text-ui-fg-subtle hover:text-ui-fg-base">
                  Product Care
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/privacy" className="text-ui-fg-subtle hover:text-ui-fg-base">
                  Privacy Policy
                </LocalizedClientLink>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Heading level="h3" className="text-xl mb-4 font-serif">Newsletter</Heading>
            <Text className="text-ui-fg-subtle mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </Text>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 border border-gray-200 rounded-md flex-1"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-amber-100 text-amber-900 border border-amber-300 rounded-md hover:bg-amber-50"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Text className="text-ui-fg-subtle text-sm">
              © {currentYear} Marble Luxe. All rights reserved.
            </Text>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <LocalizedClientLink href="/terms" className="text-ui-fg-subtle hover:text-ui-fg-base text-sm">
                Terms of Service
              </LocalizedClientLink>
              <LocalizedClientLink href="/privacy" className="text-ui-fg-subtle hover:text-ui-fg-base text-sm">
                Privacy Policy
              </LocalizedClientLink>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 