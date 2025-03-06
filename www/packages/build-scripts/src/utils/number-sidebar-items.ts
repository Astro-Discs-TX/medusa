import { SidebarNew } from "types"

export default function numberSidebarItems(
  sidebarItems: SidebarNew.SidebarItem[],
  numbering = [1]
): SidebarNew.SidebarItem[] {
  if (!numbering.length) {
    numbering.push(1)
  }
  const isTopItems = numbering.length === 1
  const numberedItems: SidebarNew.SidebarItem[] = []
  let parentItem: SidebarNew.InteractiveSidebarItem | undefined
  sidebarItems.forEach((item) => {
    if (item.type === "separator") {
      ;(parentItem?.children || numberedItems).push(item)
      return
    }

    // append current number to the item's title
    const currentNumbering = `${numbering.join(".")}.`
    item.chapterTitle = `${currentNumbering} ${
      item.chapterTitle?.trim() || item.title?.trim()
    }`
    item.title = item.title.trim()
    item.number = currentNumbering

    if (isTopItems) {
      // Add chapter category
      numberedItems.push(
        item.type === "category"
          ? {
              ...item,
              title: item.chapterTitle,
            }
          : {
              type: "category",
              title: item.chapterTitle,
              children: [],
              loaded: true,
              initialOpen: false,
            }
      )

      parentItem = numberedItems[
        numberedItems.length - 1
      ] as SidebarNew.SidebarItemCategory
    }

    if (item.children) {
      item.children = numberSidebarItems(item.children, [...numbering, 1])
    }

    if (item.type !== "category" || !isTopItems) {
      ;(parentItem?.children || numberedItems).push(item)
    }

    numbering[numbering.length - 1]++
  })

  return numberedItems
}
