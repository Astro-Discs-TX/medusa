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
  if (
    itemA.type === "separator" ||
    itemB.type === "separator" ||
    itemA.type !== itemB.type
  ) {
    return false
  }
  const hasSameTitle = !compareTitles || itemA.title === itemB.title
  const hasSamePath =
    !isSidebarItemLink(itemA) ||
    !isSidebarItemLink(itemB) ||
    itemA.path === itemB.path

  return hasSameTitle && hasSamePath
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
  return sidebarItems.find((i) => {
    if (areSidebarItemsEqual({ itemA: i, itemB: item })) {
      return true
    }

    if (checkChildren && "children" in i && i.children) {
      return findSidebarItem({
        sidebarItems: i.children,
        item,
        checkChildren,
        compareTitles,
      })
    }
  })
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
    if (areSidebarItemsEqual({ itemA: i, itemB: item })) {
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
          parentSidebar = i
          sidebarHistory.push(i.sidebar_id, ...result.sidebarHistory)
        }
        return true
      }
    }

    return false
  })

  return { item: foundItem, sidebarHistory, parentSidebar }
}
