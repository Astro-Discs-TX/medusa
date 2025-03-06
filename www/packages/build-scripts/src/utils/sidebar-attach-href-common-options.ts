import { SidebarNew } from "types"

const commonOptions: Partial<SidebarNew.RawSidebarItem> = {
  loaded: true,
  isPathHref: true,
}

export function sidebarAttachCommonOptions(
  sidebar: SidebarNew.RawSidebarItem[]
): SidebarNew.RawSidebarItem[] {
  return sidebar.map((item) => {
    if (item.type === "separator") {
      return item
    }

    return {
      ...commonOptions,
      ...item,
      children: sidebarAttachCommonOptions(item.children || []),
    }
  })
}
