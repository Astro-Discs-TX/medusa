import { matter } from "vfile-matter"
import { readSync } from "to-vfile"

type FrontMatter = {
  slug?: string
  sidebar_label?: string
  sidebar_group?: string
  sidebar_group_main?: boolean
  sidebar_position?: number
  sidebar_autogenerate_exclude?: boolean
  tags?: string[]
}

export function getFileSlugSync(filePath: string): string | undefined {
  const content = readSync(filePath)

  matter(content)

  return ((content.data.matter as FrontMatter).slug as string) || undefined
}
