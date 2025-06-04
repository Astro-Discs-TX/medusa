"use client"

import React from "react"
import { StoreRegion } from "@medusajs/types"
import SideMenu from "@modules/layout/components/side-menu"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface NavClientWrapperProps {
  regions: StoreRegion[]
}

const NavClientWrapper: React.FC<NavClientWrapperProps> = ({ regions }) => {
  return (
    <>
      <div className="h-full">
        <SideMenu regions={regions} />
      </div>
    </>
  )
}

export default NavClientWrapper 