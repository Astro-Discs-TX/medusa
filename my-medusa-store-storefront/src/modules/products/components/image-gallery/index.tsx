"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height
    
    setZoomPosition({ x, y })
  }
  
  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed)
  }

  if (!images.length) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-md aspect-square">
        <p className="text-ui-fg-subtle">No images available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div 
        className="relative aspect-square rounded-md overflow-hidden cursor-zoom-in"
        onClick={handleZoomToggle}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full relative"
          >
            <Image
              src={images[selectedImage].url}
              alt={`Product image ${selectedImage + 1}`}
              fill
              sizes="(max-width: 576px) 100vw, (max-width: 768px) 50vw, 33vw"
              className={`object-cover ${isZoomed ? 'scale-150' : ''} transition-transform duration-300`}
              style={
                isZoomed 
                  ? { 
                      transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%` 
                    } 
                  : undefined
              }
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Zoom indicator */}
        {!isZoomed && (
          <div className="absolute bottom-4 right-4 bg-white/80 rounded-full p-2 shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 7V13M7 10H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <motion.button
            key={image.id}
            className={`relative aspect-square rounded-md overflow-hidden border-2 ${
              selectedImage === index 
                ? "border-amber-500" 
                : "border-transparent hover:border-gray-200"
            }`}
            onClick={() => setSelectedImage(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={image.url}
              alt={`Product thumbnail ${index + 1}`}
              fill
              sizes="(max-width: 768px) 25vw, 10vw"
              className="object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery
