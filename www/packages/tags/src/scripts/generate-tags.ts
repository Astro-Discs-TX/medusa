import { statSync } from "fs"
import { readdir } from "fs/promises"
import path from "path"
import type { Tags } from "types"
import { findPageTitle, getFrontMatterSync } from "utils"

type ConfigItem = {
  path: string
  contentPaths: string[]
}

const config: ConfigItem[] = [
  {
    path: path.resolve("..", "..", "apps", "book"),
    contentPaths: ["app"],
  },
  {
    path: path.resolve("..", "..", "apps", "resources"),
    contentPaths: ["app", "references"],
  },
  {
    path: path.resolve("..", "..", "apps", "ui"),
    contentPaths: [path.join("src", "content", "docs")],
  },
  {
    path: path.resolve("..", "..", "apps", "user-guide"),
    contentPaths: ["app"],
  },
]

async function getTags(item: ConfigItem): Promise<Tags> {
  const tags: Tags = {}

  async function scanDirectory(dirPath: string) {
    const files = await readdir(dirPath)

    for (const file of files) {
      const fullPath = path.join(dirPath, file)
      if (!file.endsWith(".mdx")) {
        if (statSync(fullPath).isDirectory()) {
          // TODO get tags of its files
          await scanDirectory(fullPath)
        }
        return
      }

      const frontmatter = getFrontMatterSync(fullPath)
      const fileBasename = path.basename(file)

      frontmatter.tags?.forEach((tag) => {
        if (!Object.hasOwn(tags, tag)) {
          tags[tag] = []
        }

        tags[tag].push({
          title: frontmatter.sidebar_label || findPageTitle(fullPath) || "",
          path:
            frontmatter.slug ||
            fullPath.replace(dirPath, "").replace(`/${fileBasename}`, ""),
        })
      })
    }
  }

  for (const contentPath of item.contentPaths) {
    const basePath = path.join(item.path, contentPath)

    await scanDirectory(basePath)
  }

  return tags
}

async function main() {
  config.forEach((item) => {
    // TODO
  })
}

void main()
