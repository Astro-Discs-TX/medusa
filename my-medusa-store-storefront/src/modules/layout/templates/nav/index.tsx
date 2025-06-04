import { Suspense } from "react"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import dynamic from "next/dynamic"

// Dynamically import the client components
const NavClient = dynamic(
  () => import("@modules/layout/components/nav-client"),
  { ssr: true }
)

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-20 mx-auto border-b duration-300 bg-luxury-ivory border-luxury-lightgold shadow-luxury-sm">
        {/* Decorative gold line at the top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 gold-gradient"></div>
        
        <nav className="content-container txt-xsmall-plus text-luxury-charcoal flex items-center justify-between w-full h-full text-small-regular">
          <Suspense fallback={<div className="w-full h-full"></div>}>
            <NavClient regions={regions} />
          </Suspense>
        </nav>
      </header>
    </div>
  )
}
