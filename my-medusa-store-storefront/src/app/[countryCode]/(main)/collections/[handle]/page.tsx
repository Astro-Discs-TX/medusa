import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { parallelFetch } from "@lib/util/parallel-fetch"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { Suspense } from "react"

type Props = {
  params: { handle: string; countryCode: string }
  searchParams: {
    page?: string
    sortBy?: SortOptions
  }
}

// Set dynamic rendering options for this page
export const dynamic = "force-static" // Force static generation
export const revalidate = 60 * 10 // Revalidate every 10 minutes

export async function generateStaticParams() {
  // Fetch collections and regions in parallel
  const [collectionsData, regions] = await parallelFetch([
    async () => {
      const result = await listCollections({
        fields: "*products",
      })
      return result.collections || []
    },
    async () => {
      return await listRegions()
    },
  ])

  if (!collectionsData.length) {
    return []
  }

  const countryCodes = regions
    ?.map((r) => r.countries?.map((c) => c.iso_2))
    .flat()
    .filter(Boolean) as string[]

  const collectionHandles = collectionsData.map(
    (collection: StoreCollection) => collection.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string) =>
      collectionHandles.map((handle: string | undefined) => ({
        countryCode,
        handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  const metadata = {
    title: `${collection.title} | Medusa Store`,
    description: `${collection.title} collection`,
  } as Metadata

  return metadata
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { sortBy, page } = searchParams

  const collection = await getCollectionByHandle(params.handle).then(
    (collection: StoreCollection) => collection
  )

  if (!collection) {
    notFound()
  }

  return (
    <Suspense fallback={
      <div className="flex flex-col small:flex-row small:items-start py-12 content-container">
        <div className="w-full">
          <div className="flex flex-col mb-16">
            <div className="h-8 w-64 bg-gray-100 animate-pulse rounded mb-2"></div>
            <div className="h-px w-20 bg-gray-100 animate-pulse mb-8"></div>
            <div className="h-4 w-full max-w-xl bg-gray-100 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8">
            {Array.from({length: 8}).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-100 aspect-square w-full rounded"></div>
                <div className="h-4 w-2/3 bg-gray-100 mt-4 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-100 mt-2 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <CollectionTemplate
        collection={collection}
        page={page}
        sortBy={sortBy}
        countryCode={params.countryCode}
      />
    </Suspense>
  )
}
