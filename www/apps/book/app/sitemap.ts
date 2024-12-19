import { retrieveMdxPages } from "build-scripts"
import type { MetadataRoute } from "next"
import path from "path"
import { config } from "../config"
import { basePathUrl } from "../utils/base-path-url"

export default function sitemap(): MetadataRoute.Sitemap {
  // eslint-disable-next-line no-console
  console.log(path.resolve("app"))
  return retrieveMdxPages({
    basePath: path.resolve("app"),
  }).map((filePath) => ({
    url: `${config.baseUrl}${basePathUrl(filePath)}`,
  }))
}
