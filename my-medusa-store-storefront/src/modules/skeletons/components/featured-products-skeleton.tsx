"use client"

import { Skeleton } from "@medusajs/ui"

const FeaturedProductsSkeleton = () => {
  return (
    <div className="content-container py-12">
      <div className="flex flex-col items-center text-center mb-16">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>

      <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-100 aspect-square w-full rounded-md"></div>
            <div className="mt-4">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturedProductsSkeleton 