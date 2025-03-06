import { SidebarNew } from "types"

type Options = {
  items: SidebarNew.RawSidebarItem[]
  type?: SidebarNew.SidebarSortType
}

export const sortSidebarItems = ({
  items,
  type = "none",
}: Options): SidebarNew.RawSidebarItem[] => {
  switch (type) {
    case "alphabetize":
      return alphabetizeSidebarItems(items)
    default:
      return items
  }
}

const alphabetizeSidebarItems = (
  items: SidebarNew.RawSidebarItem[]
): SidebarNew.RawSidebarItem[] => {
  const segments: SidebarNew.RawSidebarItem[][] = []
  let currentSegment: SidebarNew.RawSidebarItem[] = []

  items.forEach((item) => {
    if (item.type === "separator") {
      if (currentSegment.length > 0) {
        segments.push(currentSegment)
        currentSegment = []
      }
      segments.push([item])
    } else {
      currentSegment.push(item)
    }
  })

  if (currentSegment.length > 0) {
    segments.push(currentSegment)
  }

  return segments
    .map((segment) => {
      return segment[0].type === "separator"
        ? segment
        : (segment as SidebarNew.InteractiveSidebarItem[]).sort((a, b) =>
            a.title.localeCompare(b.title)
          )
    })
    .flat()
}
