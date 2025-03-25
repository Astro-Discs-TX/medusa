import type { MetadataRoute } from "next"
import path from "path"
import { JSDOM } from "jsdom"
import getUrl from "../utils/get-url"
import { getSectionId } from "docs-utils"
import OpenAPIParser from "@readme/openapi-parser"
import { OpenAPI } from "types"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items: MetadataRoute.Sitemap = []

  for (const area of ["store", "admin"]) {
    // find and parse static headers from pages
    const dom = await JSDOM.fromURL(getUrl(area))
    const headers = dom.window.document.querySelectorAll("h2")
    headers.forEach((header) => {
      if (!header.textContent || !header.nextSibling?.textContent) {
        return
      }
      const normalizedHeaderContent = header.textContent.replaceAll("#", "")

      const objectID = getSectionId([normalizedHeaderContent])
      const url = getUrl(area, objectID)
      items.push({
        url,
        lastModified: new Date(),
        changeFrequency: "weekly",
      })
    })

    // find and index tag and operations
    const baseSpecs = (await OpenAPIParser.parse(
      path.join(process.cwd(), `specs/${area}/openapi.full.yaml`)
    )) as OpenAPI.ExpandedDocument

    baseSpecs.tags?.map((tag) => {
      const tagName = getSectionId([tag.name])
      const url = getUrl(area, tagName)
      items.push({
        url,
        lastModified: new Date(),
        changeFrequency: "weekly",
      })
    })

    const paths = baseSpecs.paths

    Object.values(paths).forEach((path) => {
      Object.values(path).forEach((op) => {
        const operation = op as OpenAPI.Operation
        const tag = operation.tags?.[0]
        const operationName = getSectionId([tag || "", operation.operationId])
        const url = getUrl(area, operationName)
        items.push({
          url,
          lastModified: new Date(),
          changeFrequency: "weekly",
        })
      })
    })
  }

  return items
}
