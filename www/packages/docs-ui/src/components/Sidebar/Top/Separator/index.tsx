"use client"

import clsx from "clsx"
import React from "react"

export type SidebarTopSeparatorProps = {
  className?: string
}

export const SidebarTopSeparator = ({
  className,
}: SidebarTopSeparatorProps) => {
  return (
    <span
      className={clsx(
        "block w-full h-px relative",
        "after:content-[''] after:absolute after:w-full after:h-full",
        "after:border-t after:border-dotted after:-bottom-px after:left-0",
        "after:border-medusa-border-strong",
        className
      )}
    ></span>
  )
}
