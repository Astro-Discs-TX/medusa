"use client"

import React from "react"
import { Button, useSidebarNew } from "../../../.."
import { XMarkMini } from "@medusajs/icons"

export const SidebarTopMobileClose = () => {
  const { setMobileSidebarOpen } = useSidebarNew()

  return (
    <div className="m-docs_0.75 lg:hidden">
      <Button
        variant="transparent-clear"
        onClick={() => setMobileSidebarOpen(false)}
        className="!p-0 hover:!bg-transparent"
      >
        <XMarkMini className="text-medusa-fg-subtle" />
      </Button>
    </div>
  )
}
