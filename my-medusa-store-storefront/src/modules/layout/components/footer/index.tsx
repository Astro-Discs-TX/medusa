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
    <footer ref={ref} className="bg-luxury-ivory border-t border-luxury-gold/10 py-16">
      <div className="content-container">
        {/* Craftsmanship Statement */}
        <motion.div 
          className="mb-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0 }}
        >
          <Heading level="h2" className="font-display text-3xl mb-4 text-luxury-charcoal">
            The Art of <span className="text-luxury-gold">Marble Craftsmanship</span>
          </Heading>
          <Text className="text-luxury-charcoal/80 text-base-regular leading-relaxed">
            Each piece in our collection is meticulously handcrafted by master artisans who have perfected their craft over generations. 
            From the initial selection of the finest marble to the final polish, our commitment to excellence and attention to detail 
            ensures that every creation is a timeless masterpiece worthy of your home.
          </Text>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Heading level="h3" className="text-xl mb-4 font-display text-luxury-gold">Marble Luxe</Heading>
            <Text className="text-luxury-charcoal/80 mb-6 leading-relaxed">
              Exquisite handcrafted marble artifacts that transform spaces into expressions of timeless elegance.
            </Text>
            <div className="flex space-x-5">
              <a href="#" className="text-luxury-charcoal/70 hover:text-luxury-gold transition-colors duration-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-luxury-charcoal/70 hover:text-luxury-gold transition-colors duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-luxury-charcoal/70 hover:text-luxury-gold transition-colors duration-300">
                <span className="sr-only">Pinterest</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.804 1.604.804 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.027-4.625 4.235 0 1.027.547 2.305 1.422 2.712.132.062.203.034.234-.094l.193-.793c.017-.071.009-.132-.049-.202-.288-.35-.521-.995-.521-1.597 0-1.544 1.169-3.038 3.161-3.038 1.72 0 2.924 1.172 2.924 2.848 0 1.894-.957 3.205-2.201 3.205-.687 0-1.201-.568-1.036-1.265.197-.833.58-1.73.58-2.331 0-.537-.288-.986-.886-.986-.702 0-1.268.727-1.268 1.7 0 .621.211 1.04.211 1.04s-.694 2.934-.821 3.479c-.142.605-.086 1.454-.025 2.008-2.603-1.02-4.448-3.553-4.448-6.518 0-3.866 3.135-7 7-7s7 3.134 7 7-3.135 7-7 7z"/>
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Heading level="h3" className="text-xl mb-5 font-display text-luxury-gold">Shop</Heading>
            <ul className="space-y-3">
              <li>
                <LocalizedClientLink href="/products" className="text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-300 hover-underline">
                  All Products
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/collections" className="text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-300 hover-underline">
                  Collections
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/about" className="text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-300 hover-underline">
                  Our Craftsmanship
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/contact" className="text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-300 hover-underline">
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
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Heading level="h3" className="text-xl mb-5 font-display text-luxury-gold">Customer Care</Heading>
            <ul className="space-y-3">
              <li>
                <LocalizedClientLink href="/shipping" className="text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-300 hover-underline">
                  Shipping & Returns
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/faq" className="text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-300 hover-underline">
                  FAQ
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/care" className="text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-300 hover-underline">
                  Product Care Guide
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/privacy" className="text-luxury-charcoal/80 hover:text-luxury-gold transition-colors duration-300 hover-underline">
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
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Heading level="h3" className="text-xl mb-5 font-display text-luxury-gold">Join Our Circle</Heading>
            <Text className="text-luxury-charcoal/80 mb-5 leading-relaxed">
              Subscribe to receive updates on new collections, exclusive offers, and the artistry behind our creations.
            </Text>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 border border-luxury-gold/20 bg-luxury-ivory rounded-md focus:outline-none focus:border-luxury-gold/50 transition-colors duration-300 text-luxury-charcoal/90 flex-1"
                required
              />
              <motion.button 
                type="submit" 
                className="px-5 py-2 bg-luxury-ivory text-luxury-gold border border-luxury-gold/50 rounded-md hover:bg-luxury-lightgold/20 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Craftsmanship Signature */}
        <motion.div 
          className="mt-16 pt-8 border-t border-luxury-gold/10 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="gold-gradient h-px w-24 mx-auto mb-6"></div>
          <p className="text-luxury-charcoal/70 text-sm italic font-serif mb-6">
            "The beauty of marble lies not just in its appearance, but in the stories it tells and the legacy it creates."
          </p>
        </motion.div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-luxury-gold/10">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Text className="text-luxury-charcoal/60 text-sm">
              © {currentYear} Marble Luxe. All rights reserved.
            </Text>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <LocalizedClientLink href="/terms" className="text-luxury-charcoal/60 hover:text-luxury-gold transition-colors duration-300 text-sm">
                Terms of Service
              </LocalizedClientLink>
              <LocalizedClientLink href="/privacy" className="text-luxury-charcoal/60 hover:text-luxury-gold transition-colors duration-300 text-sm">
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