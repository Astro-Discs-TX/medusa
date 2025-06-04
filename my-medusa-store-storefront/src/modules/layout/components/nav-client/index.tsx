"use client"

import React from "react"
import { StoreRegion } from "@medusajs/types"
import SideMenu from "@modules/layout/components/side-menu"
import CartButton from "@modules/layout/components/cart-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface NavClientProps {
  regions: StoreRegion[]
}

const NavClient: React.FC<NavClientProps> = ({ regions }) => {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex-1 basis-0 h-full flex items-center">
        <div className="h-full">
          <SideMenu regions={regions} />
        </div>
        
        {/* Navigation links - desktop */}
        <div className="hidden small:flex items-center gap-x-8 h-full ml-8">
          <LocalizedClientLink
            className="hover:text-luxury-gold transition-colors duration-300 uppercase tracking-wider text-small-semi"
            href="/collections"
            data-testid="nav-collections-link"
          >
            Collections
          </LocalizedClientLink>
          <LocalizedClientLink
            className="hover:text-luxury-gold transition-colors duration-300 uppercase tracking-wider text-small-semi"
            href="/products"
            data-testid="nav-products-link"
          >
            Products
          </LocalizedClientLink>
          <LocalizedClientLink
            className="hover:text-luxury-gold transition-colors duration-300 uppercase tracking-wider text-small-semi"
            href="/about"
            data-testid="nav-about-link"
          >
            Craftsmanship
          </LocalizedClientLink>
        </div>
      </div>

      <div className="flex items-center h-full">
        <LocalizedClientLink
          href="/"
          className="flex flex-col items-center"
          data-testid="nav-store-link"
        >
          <span className="font-display text-2xl text-luxury-gold hover:opacity-80 transition-opacity duration-300">
            MARBLE LUXE
          </span>
          <span className="text-luxury-charcoal/70 text-[10px] uppercase tracking-[0.2em] mt-0.5">
            Fine Handicrafts
          </span>
        </LocalizedClientLink>
      </div>

      <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
        <div className="hidden small:flex items-center gap-x-8 h-full">
          <LocalizedClientLink
            className="hover:text-luxury-gold transition-colors duration-300 uppercase tracking-wider text-small-semi"
            href="/account"
            data-testid="nav-account-link"
          >
            Account
          </LocalizedClientLink>
          <LocalizedClientLink
            className="hover:text-luxury-gold transition-colors duration-300 uppercase tracking-wider text-small-semi"
            href="/contact"
            data-testid="nav-contact-link"
          >
            Contact
          </LocalizedClientLink>
        </div>
        <div className="h-full flex items-center">
          <CartButton />
        </div>
      </div>
    </div>
  )
}

export default NavClient 