import {
  FrontMatter,
  ToCItem,
  UnistFunctionDeclarationNode,
  UnistProgram,
  UnistReturnStatementNode,
} from "types"
import type { Transformer } from "unified"

type DataToc = Record<string, unknown>[]

export function recmaInjectMdxDataPlugin(): Transformer {
  return async (tree, file) => {
    const frontmatter: FrontMatter = file.data.matter || {}
    const tocMaxDepth = frontmatter.toc_max_depth || 4
    let dataToc = (file.data.toc || []) as DataToc
    if (dataToc.length > 0 && dataToc[0].depth === 1) {
      dataToc = (dataToc[0].children || []) as DataToc
    }
    const toc: ToCItem[] = getToc(dataToc, tocMaxDepth)

    const program = tree as UnistProgram
    for (const node of program.body) {
      if (node.type === "FunctionDeclaration") {
        const fnNode = node as UnistFunctionDeclarationNode
        const returnStatement = fnNode.body.body.find(
          (n) => n.type === "ReturnStatement"
        )

        if (!returnStatement) {
          continue
        }

        const rootJSX = (returnStatement as UnistReturnStatementNode).argument

        program.body.unshift({
          type: "ImportDeclaration",
          source: { type: "Literal", value: "docs-ui" },
          specifiers: [
            {
              type: "ImportSpecifier",
              imported: { type: "Identifier", name: "InjectedMDXData" },
              local: { type: "Identifier", name: "InjectedMDXData" },
            },
          ],
        })

        rootJSX.children.push({
          type: "JSXElement",
          openingElement: {
            type: "JSXOpeningElement",
            name: {
              type: "JSXIdentifier",
              name: "InjectedMDXData",
            },
            attributes: [
              {
                type: "JSXAttribute",
                name: {
                  type: "JSXIdentifier",
                  name: "frontmatter",
                },
                value: {
                  type: "JSXExpressionContainer",
                  expression: {
                    type: "ObjectExpression",
                    properties: Object.entries(frontmatter).map(
                      ([key, value]) => ({
                        type: "Property",
                        key: {
                          type: "Identifier",
                          name: key,
                        },
                        value: {
                          type: "Literal",
                          value: value,
                          raw: JSON.stringify(value),
                        },
                        kind: "init",
                        computed: false,
                        method: false,
                        shorthand: false,
                      })
                    ),
                  },
                },
              },
              {
                type: "JSXAttribute",
                name: {
                  type: "JSXIdentifier",
                  name: "toc",
                },
                value: {
                  type: "JSXExpressionContainer",
                  expression: {
                    type: "ArrayExpression",
                    elements: getTocJSX(toc),
                  },
                },
              },
            ],
            selfClosing: true,
          },
        } as any)

        return
      }
    }
  }
}

function getToc(items: Record<string, unknown>[], maxDepth: number): ToCItem[] {
  const toc: ToCItem[] = []

  items.forEach((i) => {
    const depth = i.depth as number
    if (depth > maxDepth) {
      return
    }

    const tocItem: ToCItem = {
      title: i.value as string,
      level: depth,
      id: i.id as string,
      children: [],
    }

    if (i.children && Array.isArray(i.children) && i.children.length > 0) {
      tocItem.children = getToc(i.children, maxDepth)
    }

    toc.push(tocItem)
  })

  return toc
}

function getTocJSX(toc: ToCItem[]): any[] {
  return toc.map((item) => {
    const itemData = {
      type: "ObjectExpression",
      properties: [
        {
          type: "Property",
          key: { type: "Identifier", name: "title" },
          value: { type: "Literal", value: item.title },
          kind: "init",
          computed: false,
          method: false,
          shorthand: false,
        },
        {
          type: "Property",
          key: { type: "Identifier", name: "level" },
          value: { type: "Literal", value: item.level },
          kind: "init",
          computed: false,
          method: false,
          shorthand: false,
        },
        {
          type: "Property",
          key: { type: "Identifier", name: "id" },
          value: { type: "Literal", value: item.id },
          kind: "init",
          computed: false,
          method: false,
          shorthand: false,
        },
      ],
    }

    if (item.children && item.children.length > 0) {
      itemData.properties.push({
        type: "Property",
        key: { type: "Identifier", name: "children" },
        value: {
          type: "ArrayExpression",
          elements: getTocJSX(item.children),
        },
        kind: "init",
        computed: false,
        method: false,
        shorthand: false,
      } as any)
    }

    return itemData
  })
}
