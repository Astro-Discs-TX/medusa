"use client"

import { Heading, Text } from "@medusajs/ui"
import { motion } from "framer-motion"
import { useRef } from "react"

import ScrollReveal from "@modules/common/components/scroll-reveal"
import AnimatedButton from "@modules/common/components/animated-button"
import { staggerContainer, fadeIn } from "@lib/util/animations"

export default function Home() {
  const heroRef = useRef(null)

  return (
    <div>
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative h-[80vh] flex items-center justify-center overflow-hidden"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Background with marble texture */}
        <div className="absolute inset-0 marble-bg-light opacity-30 z-0" />
        
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
              Explore Collection
            </AnimatedButton>
            <AnimatedButton variant="outline" size="large">
              Our Craftsmanship
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
      
      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <Heading level="h2" className="text-3xl md:text-4xl mb-12 text-center">
              Featured Collections
            </Heading>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Collection 1 */}
            <ScrollReveal delay={0.1} className="aspect-square relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 marble-bg-light opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Heading level="h3" className="text-2xl mb-2">Dining Collection</Heading>
                <Text className="mb-4">Elegant tableware for sophisticated dining</Text>
                <AnimatedButton variant="gold" size="small">View Collection</AnimatedButton>
              </div>
            </ScrollReveal>
            
            {/* Collection 2 */}
            <ScrollReveal delay={0.2} className="aspect-square relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 marble-bg-dark opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Heading level="h3" className="text-2xl mb-2 text-white">Decor Collection</Heading>
                <Text className="mb-4 text-gray-200">Statement pieces for your luxury home</Text>
                <AnimatedButton variant="gold" size="small">View Collection</AnimatedButton>
              </div>
            </ScrollReveal>
            
            {/* Collection 3 */}
            <ScrollReveal delay={0.3} className="aspect-square relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 marble-bg-light opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Heading level="h3" className="text-2xl mb-2">Bath Collection</Heading>
                <Text className="mb-4">Transform your bathroom into a spa retreat</Text>
                <AnimatedButton variant="gold" size="small">View Collection</AnimatedButton>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
      
      {/* Craftsmanship Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <ScrollReveal className="flex-1">
              <div className="aspect-square rounded-lg overflow-hidden">
                <div className="h-full w-full bg-gray-300 marble-bg-dark" />
              </div>
            </ScrollReveal>
            
            <div className="flex-1">
              <ScrollReveal>
                <Heading level="h2" className="text-3xl md:text-4xl mb-6">
                  Artisan Craftsmanship
                </Heading>
              </ScrollReveal>
              
              <ScrollReveal delay={0.1}>
                <Text className="mb-4">
                  Each piece in our collection is handcrafted by master artisans with decades of experience working with the finest marble from around the world.
                </Text>
              </ScrollReveal>
              
              <ScrollReveal delay={0.2}>
                <Text className="mb-6">
                  Our commitment to traditional techniques combined with modern design creates timeless pieces that will be cherished for generations.
                </Text>
              </ScrollReveal>
              
              <ScrollReveal delay={0.3}>
                <AnimatedButton variant="gold">Our Process</AnimatedButton>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <ScrollReveal>
            <Heading level="h2" className="text-3xl md:text-4xl mb-12 text-center">
              Client Testimonials
            </Heading>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal className="p-8 border border-gray-200 rounded-lg">
              <Text className="italic mb-4">
                "The marble centerpiece I purchased is absolutely stunning. The craftsmanship is impeccable and it has become the focal point of my dining room."
              </Text>
              <Text className="font-medium">— Sarah J., Interior Designer</Text>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2} className="p-8 border border-gray-200 rounded-lg">
              <Text className="italic mb-4">
                "I've been collecting marble pieces for years, and the quality of these handicrafts is truly exceptional. Each piece tells a story of artistry and tradition."
              </Text>
              <Text className="font-medium">— Michael T., Art Collector</Text>
            </ScrollReveal>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <Heading level="h2" className="text-3xl md:text-4xl mb-6">
              Join Our Exclusive List
            </Heading>
          </ScrollReveal>
          
          <ScrollReveal delay={0.1}>
            <Text className="mb-8 text-gray-300">
              Subscribe to receive updates on new collections, limited editions, and exclusive events.
            </Text>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white w-full sm:w-auto sm:flex-1 max-w-md"
              />
              <AnimatedButton variant="gold">Subscribe</AnimatedButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
} 