"use client"

import React from "react"
import { SidebarNew } from "types"
import { SidebarItemLink } from "./Link"
import { SidebarItemSubCategory } from "./SubCategory"
import { DottedSeparator } from "../.."
import { SidebarItemCategory } from "./Category"

export type SidebarItemProps = {
  item: SidebarNew.SidebarItem
  nested?: boolean
  expandItems?: boolean
  hasNextItems?: boolean
} & React.AllHTMLAttributes<HTMLElement>

export const SidebarItem = ({
  item,
  hasNextItems = false,
  ...props
}: SidebarItemProps) => {
  switch (item.type) {
    case "category":
      return (
        <>
          <SidebarItemCategory item={item} {...props} />
          {hasNextItems && <DottedSeparator />}
        </>
      )
    case "sub-category":
      return <SidebarItemSubCategory item={item} {...props} />
    case "link":
    case "ref":
    case "external":
      return <SidebarItemLink item={item} {...props} />
    case "separator":
      return <DottedSeparator />
  }
}
