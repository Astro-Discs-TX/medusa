"use client"

import { Heading, Text } from "@medusajs/ui"
import Image from "next/image"
import ScrollReveal from "@modules/common/components/scroll-reveal"
import AnimatedButton from "@modules/common/components/animated-button"

export default function Collections() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <Heading level="h2" className="text-3xl md:text-4xl mb-12 text-center">
            Our Collections
          </Heading>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Collection 1 */}
          <ScrollReveal delay={0.1} className="aspect-square relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 z-0">
              <Image
                src="/collections/dining.jpg"
                alt="Dining Collection"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                loading="eager"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
              />
            </div>
            <div className="absolute inset-0 bg-luxury-charcoal/40 z-10"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
              <Heading level="h3" className="text-2xl mb-2 text-white">Dining Collection</Heading>
              <Text className="mb-4 text-gray-200">Elegant tableware for sophisticated dining</Text>
              <AnimatedButton variant="gold" size="small">View Collection</AnimatedButton>
            </div>
          </ScrollReveal>
          
          {/* Collection 2 */}
          <ScrollReveal delay={0.2} className="aspect-square relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 z-0">
              <Image
                src="/collections/decor.jpg"
                alt="Decor Collection"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                loading="eager"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
              />
            </div>
            <div className="absolute inset-0 bg-luxury-charcoal/50 z-10"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
              <Heading level="h3" className="text-2xl mb-2 text-white">Decor Collection</Heading>
              <Text className="mb-4 text-gray-200">Statement pieces for your luxury home</Text>
              <AnimatedButton variant="gold" size="small">View Collection</AnimatedButton>
            </div>
          </ScrollReveal>
          
          {/* Collection 3 */}
          <ScrollReveal delay={0.3} className="aspect-square relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 z-0">
              <Image
                src="/collections/bath.jpg"
                alt="Bath Collection"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
                loading="eager"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
              />
            </div>
            <div className="absolute inset-0 bg-luxury-charcoal/40 z-10"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
              <Heading level="h3" className="text-2xl mb-2 text-white">Bath Collection</Heading>
              <Text className="mb-4 text-gray-200">Transform your bathroom into a spa retreat</Text>
              <AnimatedButton variant="gold" size="small">View Collection</AnimatedButton>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
} 