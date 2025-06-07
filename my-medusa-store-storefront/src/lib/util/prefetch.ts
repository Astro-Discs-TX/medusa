"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Resources to prefetch when the app loads
 * Add frequently accessed resources to improve initial page load times
 */
const RESOURCES_TO_PREFETCH = [
  // Common API endpoints
  '/store/regions',
  '/store/collections',
  '/store/products',
  
  // Common static assets
  '/fonts/Inter-Regular.woff2',
  '/fonts/Inter-Medium.woff2',
  '/fonts/Inter-SemiBold.woff2',
]

/**
 * Prefetch critical resources in the background
 * This helps speed up subsequent page loads
 */
function prefetchResources() {
  if (typeof window === 'undefined') return
  
  // Wait until browser is idle to start prefetching
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      RESOURCES_TO_PREFETCH.forEach(resource => {
        const prefetcher = new Image()
        
        // For API endpoints, use fetch with prefetch
        if (resource.startsWith('/store/')) {
          fetch(`http://localhost:9000${resource}`, { 
            method: 'GET',
            // Using no-store to avoid interfering with actual requests
            cache: 'no-store',
          }).catch(() => {
            // Silently fail on prefetch errors
          })
        } 
        // For static assets, use Image prefetcher
        else {
          prefetcher.src = resource
        }
      })
    })
  }
}

/**
 * Hook to prefetch common resources on initial load
 * Use this in layout components to improve performance
 */
export function usePrefetch() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Only run prefetching once
    if (typeof window !== 'undefined') {
      const hasPrefetched = sessionStorage.getItem('hasPrefetched')
      
      if (!hasPrefetched) {
        prefetchResources()
        sessionStorage.setItem('hasPrefetched', 'true')
      }
    }
  }, [pathname])
}

/**
 * Prefetch specific routes
 * @param routes Routes to prefetch
 */
export function prefetchRoutes(routes: string[]) {
  if (typeof window === 'undefined') return
  
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      routes.forEach(route => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = route
        link.as = 'document'
        document.head.appendChild(link)
      })
    })
  }
} 