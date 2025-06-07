"use server"

import { Heading, Text } from "@medusajs/ui"
import Image from "next/image"
import ScrollReveal from "@modules/common/components/scroll-reveal"
import AnimatedButton from "@modules/common/components/animated-button"
import { listCollections } from "@lib/data/collections"
import Link from "next/link"

export default async function Collections() {
  // Fetch collections from the API
  const { collections } = await listCollections({
    limit: "3",
    fields: "id,title,handle"
  }).catch(() => {
    // Return empty collections array if there's an error
    return { collections: [] }
  })
  
  // If no collections are found, use placeholder data
  const displayCollections = collections.length > 0 
    ? collections 
    : [
        { id: '1', title: 'Dining Collection', handle: 'dining' },
        { id: '2', title: 'Decor Collection', handle: 'decor' },
        { id: '3', title: 'Bath Collection', handle: 'bath' }
      ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal>
          <Heading level="h2" className="text-3xl md:text-4xl mb-12 text-center">
            Our Collections
          </Heading>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayCollections.map((collection, index) => {
            // Get image path based on collection handle or fallback to default images
            const imagePath = `/collections/${collection.handle || ['dining', 'decor', 'bath'][index]}.jpg`
            const descriptions = [
              "Elegant tableware for sophisticated dining",
              "Statement pieces for your luxury home",
              "Transform your bathroom into a spa retreat"
            ]
            
            return (
              <ScrollReveal key={collection.id} delay={0.1 * (index + 1)} className="aspect-square relative overflow-hidden rounded-lg">
                <div className="absolute inset-0 z-0">
                  <Image
                    src={imagePath}
                    alt={collection.title}
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
                  <Heading level="h3" className="text-2xl mb-2 text-white">{collection.title}</Heading>
                  <Text className="mb-4 text-gray-200">{descriptions[index % 3]}</Text>
                  <Link href={`/collections/${collection.handle}`}>
                    <AnimatedButton variant="gold" size="small">View Collection</AnimatedButton>
                  </Link>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
} 