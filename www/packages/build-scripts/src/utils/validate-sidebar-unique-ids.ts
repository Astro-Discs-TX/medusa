import { SidebarNew } from "types"

export const validateSidebarUniqueIds = (
  sidebars: (SidebarNew.RawSidebar | SidebarNew.SidebarItemSidebar)[],
  sidebarIds = new Set<string>()
): void => {
  for (const sidebar of sidebars) {
    if (sidebarIds.has(sidebar.sidebar_id)) {
      throw new Error(`Duplicate sidebar item id found: ${sidebar.sidebar_id}`)
    }

    sidebarIds.add(sidebar.sidebar_id)

    const children = (
      "items" in sidebar ? sidebar.items : sidebar.children || []
    ).filter(
      (child) => child.type === "sidebar"
    ) as SidebarNew.SidebarItemSidebar[]

    validateSidebarUniqueIds(children, sidebarIds)
  }
}
