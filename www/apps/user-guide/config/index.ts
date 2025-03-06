import { DocsConfig, SidebarNew } from "types"
import { generatedSidebars } from "@/generated/sidebar.mjs"
import { globalConfig } from "docs-ui"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const config: DocsConfig = {
  ...globalConfig,
  titleSuffix: "Medusa Admin User Guide",
  baseUrl,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  sidebars: generatedSidebars as SidebarNew.Sidebar[],
  project: {
    title: "User Guide",
    key: "user-guide",
  },
  logo: `${process.env.NEXT_PUBLIC_BASE_PATH}/images/logo.png`,
  breadcrumbOptions: {
    startItems: [
      {
        title: "Documentation",
        link: baseUrl,
      },
    ],
  },
}
