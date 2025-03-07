import { SidebarNew } from "types"

export const isSidebarItemLink = (
  item: SidebarNew.SidebarItem | undefined,
  options?: {
    checkRef?: boolean
    checkExternal?: boolean
  }
): item is SidebarNew.SidebarItemLink => {
  const { checkRef = true, checkExternal = true } = options || {}

  return (
    item !== undefined &&
    (item.type === "link" ||
      (checkRef && item.type === "ref") ||
      (checkExternal && item.type === "external"))
  )
}

export const areSidebarItemsEqual = ({
  itemA,
  itemB,
  compareTitles = true,
}: {
  itemA: SidebarNew.SidebarItem
  itemB: SidebarNew.SidebarItem
  compareTitles?: boolean
}): boolean => {
  if (itemA.type !== itemB.type) {
    return false
  }
  // after this, we know that itemA and itemB have the same type
  switch (itemA.type) {
    case "separator":
      return true
    case "sidebar":
      return (
        itemA.sidebar_id === (itemB as SidebarNew.SidebarItemSidebar).sidebar_id
      )
    case "category":
    case "sub-category":
      return compareTitles
        ? itemA.title === (itemB as SidebarNew.SidebarItemCategory).title
        : false
    case "link":
    case "ref":
    case "external": {
      const hasSameTitle =
        !compareTitles ||
        itemA.title === (itemB as SidebarNew.SidebarItemLink).title
      const hasSamePath =
        itemA.path === (itemB as SidebarNew.SidebarItemLink).path

      return hasSameTitle && hasSamePath
    }
  }
}

export const findSidebarItem = ({
  sidebarItems,
  item,
  checkChildren = true,
  compareTitles = true,
}: {
  sidebarItems: SidebarNew.SidebarItem[]
  item: SidebarNew.SidebarItem
  checkChildren?: boolean
  compareTitles?: boolean
}): SidebarNew.SidebarItem | undefined => {
  let foundItem: SidebarNew.SidebarItem | undefined
  sidebarItems.some((i) => {
    if (areSidebarItemsEqual({ itemA: i, itemB: item })) {
      foundItem = i
    } else if (checkChildren && "children" in i && i.children) {
      foundItem = findSidebarItem({
        sidebarItems: i.children,
        item,
        checkChildren,
        compareTitles,
      })
    }

    return foundItem !== undefined
  })

  return foundItem
}

export const getSidebarItemWithHistory = ({
  sidebarItems,
  item,
  sidebarHistory = [],
  checkChildren = true,
  compareTitles = true,
}: {
  sidebarItems: SidebarNew.SidebarItem[]
  item: SidebarNew.SidebarItem
  sidebarHistory?: string[]
  checkChildren?: boolean
  compareTitles?: boolean
}): {
  item: SidebarNew.SidebarItem | undefined
  sidebarHistory: string[]
  parentSidebar?: SidebarNew.SidebarItemSidebar
} => {
  let foundItem: SidebarNew.SidebarItem | undefined
  let parentSidebar: SidebarNew.SidebarItemSidebar | undefined
  sidebarItems.some((i) => {
    if (areSidebarItemsEqual({ itemA: i, itemB: item, compareTitles })) {
      foundItem = i
      return true
    }

    if (checkChildren && "children" in i && i.children) {
      const result = getSidebarItemWithHistory({
        sidebarItems: i.children,
        item,
        checkChildren,
        compareTitles,
      })

      if (result.item) {
        foundItem = result.item
        if (i.type === "sidebar") {
          parentSidebar = result.parentSidebar || i
          sidebarHistory.push(i.sidebar_id)
        } else {
          parentSidebar = result.parentSidebar
        }
        sidebarHistory.push(...result.sidebarHistory)
        return true
      }
    }

    return false
  })

  return { item: foundItem, sidebarHistory, parentSidebar }
}
