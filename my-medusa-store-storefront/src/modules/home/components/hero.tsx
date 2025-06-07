"use client"

import { Heading, Text } from "@medusajs/ui"
import { motion } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import AnimatedButton from "@modules/common/components/animated-button"
import { staggerContainer, fadeIn } from "@lib/util/animations"

export default function Hero() {
  const heroRef = useRef(null)

  return (
    <motion.section
      ref={heroRef}
      className="relative h-[80vh] flex items-center justify-center overflow-hidden"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* Background with marble texture */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/marble-bg-light.jpg"
          alt="Marble background"
          fill
          priority={true}
          sizes="100vw"
          className="object-cover opacity-30"
          quality={85}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.div variants={fadeIn} className="mb-6">
          <Heading level="h1" className="text-4xl md:text-6xl mb-4 font-serif">
            <span className="luxury-gold">Exquisite Marble</span> Handicrafts
          </Heading>
        </motion.div>
        
        <motion.div variants={fadeIn} className="mb-8">
          <Text className="text-lg md:text-xl max-w-2xl mx-auto">
            Discover our collection of handcrafted marble pieces, meticulously created by master artisans for your luxury home.
          </Text>
        </motion.div>
        
        <motion.div variants={fadeIn}>
          <AnimatedButton variant="gold" size="large" className="mr-4">
            Browse Products
          </AnimatedButton>
          <AnimatedButton variant="outline" size="large">
            About Us
          </AnimatedButton>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5L12 19M12 19L6 13M12 19L18 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.section>
  )
} 