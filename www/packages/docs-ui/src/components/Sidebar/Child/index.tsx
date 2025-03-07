"use client"

import React, { useMemo } from "react"
import clsx from "clsx"
import { ArrowUturnLeft } from "@medusajs/icons"
import { useSidebarNew } from "../../../providers"

export const SidebarChild = () => {
  const { goBack, parentSidebar } = useSidebarNew()

  const title = useMemo(() => {
    if (!parentSidebar) {
      return ""
    }

    return (
      "childSidebarTitle" in parentSidebar
        ? parentSidebar.childSidebarTitle || parentSidebar.title
        : parentSidebar.title
    ) as string
  }, [parentSidebar])

  if (!parentSidebar) {
    return <></>
  }

  return (
    <div className="px-docs_0.75">
      <div
        onClick={goBack}
        className={clsx(
          "flex items-center justify-start my-docs_0.75 gap-[10px]",
          "border border-transparent cursor-pointer mx-docs_0.5",
          "!text-medusa-fg-base !text-compact-small-plus"
        )}
        tabIndex={-1}
      >
        <ArrowUturnLeft />
        <span className="truncate flex-1">{title}</span>
      </div>
    </div>
  )
}
