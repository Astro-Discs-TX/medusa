import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import { read } from "to-vfile"
import { UnistNode, UnistNodeWithData, UnistTree } from "types"
import { Plugin, Transformer, unified } from "unified"
import { SKIP, VisitorResult } from "unist-util-visit"
import type { VFile } from "vfile"
import {
  parseCard,
  parseCardList,
  parseCodeTabs,
  parseDetails,
  parseNote,
  parsePrerequisites,
  parseSourceCodeLink,
  parseTable,
  parseTabs,
  parseTypeList,
  parseWorkflowDiagram,
} from "./utils/parse-elms.js"
import remarkFrontmatter from "remark-frontmatter"

const parsers: Record<
  string,
  (node: UnistNodeWithData, index: number, parent: UnistTree) => VisitorResult
> = {
  Card: parseCard,
  CardList: parseCardList,
  CodeTabs: parseCodeTabs,
  Details: parseDetails,
  Note: parseNote,
  Prerequisites: parsePrerequisites,
  SourceCodeLink: parseSourceCodeLink,
  Table: parseTable,
  Tabs: parseTabs,
  TypeList: parseTypeList,
  WorkflowDiagram: parseWorkflowDiagram,
}

const parseComponentsPlugin = (): Transformer => {
  return async (tree) => {
    const { visit } = await import("unist-util-visit")

    let pageTitle = ""

    visit(
      tree as UnistTree,
      ["mdxJsxFlowElement", "element", "mdxjsEsm", "heading"],
      (node: UnistNode, index, parent) => {
        if (typeof index !== "number" || !parent) {
          return
        }
        if (
          node.type === "mdxjsEsm" &&
          node.value?.startsWith("export const metadata = ") &&
          node.data &&
          "estree" in node.data
        ) {
          const regexMatch = /title: (?<title>.+),?/.exec(node.value)
          if (regexMatch?.groups?.title) {
            pageTitle = regexMatch.groups.title
              .replace(/,$/, "")
              .replaceAll(/\$\{.+\}/g, "")
              .replaceAll(/^['"`]/g, "")
              .replaceAll(/['"`]$/g, "")
              .trim()
          }
        }
        if (node.type === "heading") {
          if (node.depth === 1 && node.children?.length) {
            if (node.children[0].value === "metadata.title") {
              node.children[0] = {
                type: "text",
                value: pageTitle,
              }
            } else {
              node.children = node.children
                .filter((child) => child.type === "text")
                .map((child) => ({
                  ...child,
                  value: child.value?.trim(),
                }))
            }
          }
          return
        }
        if (
          node.type === "mdxjsEsm" ||
          node.name === "Feedback" ||
          node.name === "ChildDocs" ||
          node.name === "DetailsList" ||
          node.name === "CommerceModuleSections"
        ) {
          parent?.children.splice(index, 1)
          return [SKIP, index]
        }

        if (!node.name) {
          return
        }

        const parser = parsers[node.name]
        if (parser) {
          return parser(node as UnistNodeWithData, index, parent)
        }
      }
    )
  }
}

const removeFrontmatterPlugin = (): Transformer => {
  return async (tree) => {
    const { visit } = await import("unist-util-visit")

    visit(
      tree as UnistTree,
      ["yaml", "toml"],
      (node: UnistNode, index, parent) => {
        if (typeof index !== "number" || parent?.type !== "root") {
          return
        }

        parent.children.splice(index, 1)
        return [SKIP, index]
      }
    )
  }
}

const getParsedAsString = (file: VFile): string => {
  return file.toString().replaceAll(/^([\s]*)\* /gm, "$1- ")
}

export const getCleanMd = async (
  filePath: string,
  plugins?: {
    before?: Plugin[]
    after?: Plugin[]
  }
): Promise<string> => {
  if (!filePath.endsWith(".md") && !filePath.endsWith(".mdx")) {
    return ""
  }
  const unifier = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkStringify)
    .use(remarkFrontmatter)

  plugins?.before?.forEach((plugin) => {
    unifier.use(...(Array.isArray(plugin) ? plugin : [plugin]))
  })

  unifier.use(parseComponentsPlugin).use(removeFrontmatterPlugin)

  plugins?.after?.forEach((plugin) => {
    unifier.use(...(Array.isArray(plugin) ? plugin : [plugin]))
  })

  const parsed = await unifier.process(await read(filePath))

  return getParsedAsString(parsed)
}
