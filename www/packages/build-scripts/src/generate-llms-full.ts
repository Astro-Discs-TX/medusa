import { getCleanMd, GetCleanMdOptions } from "docs-utils"
import { fdir } from "fdir"
import { writeFile } from "fs/promises"
import path from "path"

type Options = {
  outputPath: string
  scanDirs: {
    dir: string
    options?: Omit<GetCleanMdOptions, "filePath">
    disallowedFilesPatterns?: string[]
    allowedFilesPatterns?: string[]
  }[]
  introText?: string
}

const crawler = new fdir().withFullPaths()

const getContentFromDir = async ({
  dir,
  options = {},
  disallowedFilesPatterns,
  allowedFilesPatterns,
}: Options["scanDirs"][0]): Promise<string> => {
  const files = await crawler
    .filter((file) => {
      const baseName = path.basename(file)

      return (
        (baseName.endsWith(".md") || baseName.endsWith(".mdx")) &&
        !baseName.startsWith("_")
      )
    })
    .filter((file) => {
      const isAllowed =
        !allowedFilesPatterns?.length ||
        allowedFilesPatterns.some((pattern) => file.match(pattern))
      const isDisallowed =
        disallowedFilesPatterns?.length &&
        disallowedFilesPatterns.some((pattern) => file.match(pattern))

      return isAllowed || !isDisallowed
    })
    .crawl(dir)
    .withPromise()

  let content = ""

  for (const file of files) {
    content += await getCleanMd({
      filePath: file,
      ...options,
    })
  }

  return content
}

export const generateLlmsFull = async ({
  outputPath,
  scanDirs,
  introText = "",
}: Options) => {
  let text = introText

  for (const scanDir of scanDirs) {
    text += await getContentFromDir(scanDir)
  }

  await writeFile(outputPath, text)
}
