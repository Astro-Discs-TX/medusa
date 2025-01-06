import { InjectionZone, isValidInjectionZone } from "@medusajs/admin-shared"
import fs from "fs/promises"
import outdent from "outdent"
import {
  File,
  isArrayExpression,
  isStringLiteral,
  isTemplateLiteral,
  parse,
  ParseResult,
  traverse,
} from "../babel"
import { logger } from "../logger"
import { getParserOptions, hasDefaultExport, normalizePath } from "../utils"
import { getWidgetFilesFromSources } from "./helpers"

type WidgetConfig = {
  Component: string
  zone: InjectionZone[]
}

type ParsedWidgetConfig = {
  import: string
  widget: WidgetConfig
}

export async function generateWidgets(sources: Set<string>) {
  const files = await getWidgetFilesFromSources(sources)
  console.log("Found widget files", files)
  const results = await getWidgetResults(files)

  const imports = results.map((r) => r.import)
  const code = generateCode(results)

  return {
    imports,
    code,
  }
}

async function getWidgetResults(
  files: string[]
): Promise<ParsedWidgetConfig[]> {
  return (await Promise.all(files.map(parseFile))).filter(
    (r) => r !== null
  ) as ParsedWidgetConfig[]
}

function generateCode(results: ParsedWidgetConfig[]): string {
  return outdent`
    widgets: [
      ${results.map((r) => formatWidget(r.widget)).join(",\n")}
    ]
  `
}

function formatWidget(widget: WidgetConfig): string {
  return outdent`
    {
        Component: ${widget.Component},
        zone: [${widget.zone.map((z) => `"${z}"`).join(", ")}]
    }
  `
}

async function parseFile(
  file: string,
  index: number
): Promise<ParsedWidgetConfig | null> {
  const code = await fs.readFile(file, "utf-8")
  let ast: ParseResult<File>

  try {
    ast = parse(code, getParserOptions(file))
  } catch (e) {
    logger.error(`An error occurred while parsing the file.`, {
      file,
      error: e,
    })
    return null
  }

  let fileHasDefaultExport = false

  try {
    fileHasDefaultExport = await hasDefaultExport(ast)
  } catch (e) {
    logger.error(`An error occurred while checking for a default export.`, {
      file,
      error: e,
    })
    return null
  }

  console.log(`file ${file} has default export`, fileHasDefaultExport)

  if (!fileHasDefaultExport) {
    return null
  }

  let zone: InjectionZone[] | null

  try {
    zone = await getWidgetZone(ast, file)
  } catch (e) {
    logger.error(`An error occurred while traversing the file.`, {
      file,
      error: e,
    })
    return null
  }

  if (!zone) {
    logger.warn(`'zone' property is missing from the widget config.`, { file })
    return null
  }

  const import_ = generateImport(file, index)
  const widget = generateWidget(zone, index)

  return {
    widget,
    import: import_,
  }
}

function generateWidgetComponentName(index: number): string {
  return `WidgetComponent${index}`
}

function generateWidgetConfigName(index: number): string {
  return `WidgetConfig${index}`
}

function generateImport(file: string, index: number): string {
  const path = normalizePath(file)
  return `import ${generateWidgetComponentName(
    index
  )}, { config as ${generateWidgetConfigName(index)} } from "${path}"`
}

function generateWidget(zone: InjectionZone[], index: number): WidgetConfig {
  return {
    Component: generateWidgetComponentName(index),
    zone: zone,
  }
}

async function getWidgetZone(
  ast: ParseResult<File>,
  file: string
): Promise<InjectionZone[] | null> {
  const zones: string[] = []

  traverse(ast, {
    // Handle bundled variable declarations
    VariableDeclarator(path) {
      if (
        path.node.id.type === "Identifier" &&
        path.node.id.name === "config" &&
        path.node.init?.type === "CallExpression"
      ) {
        const arg = path.node.init.arguments[0]
        if (arg?.type === "ObjectExpression") {
          const zoneProperty = arg.properties.find(
            (p: any) => p.type === "ObjectProperty" && p.key.name === "zone"
          )
          if (zoneProperty?.type === "ObjectProperty") {
            extractZoneValues(zoneProperty.value, zones, file)
          }
        }
      }
    },
    // Handle unbundled export declarations
    ExportNamedDeclaration(path) {
      const declaration = path.node.declaration
      if (
        declaration?.type === "VariableDeclaration" &&
        declaration.declarations[0]?.type === "VariableDeclarator" &&
        declaration.declarations[0].id.type === "Identifier" &&
        declaration.declarations[0].id.name === "config" &&
        declaration.declarations[0].init?.type === "CallExpression"
      ) {
        const arg = declaration.declarations[0].init.arguments[0]
        if (arg?.type === "ObjectExpression") {
          const zoneProperty = arg.properties.find(
            (p: any) => p.type === "ObjectProperty" && p.key.name === "zone"
          )
          if (zoneProperty?.type === "ObjectProperty") {
            extractZoneValues(zoneProperty.value, zones, file)
          }
        }
      }
    },
  })

  const validatedZones = zones.filter(isValidInjectionZone)
  return validatedZones.length > 0 ? validatedZones : null
}

function extractZoneValues(value: any, zones: string[], file: string) {
  if (isTemplateLiteral(value)) {
    logger.warn(
      `'zone' property cannot be a template literal (e.g. \`product.details.after\`).`,
      { file }
    )
    return
  }

  if (isStringLiteral(value)) {
    zones.push(value.value)
  } else if (isArrayExpression(value)) {
    const values = value.elements
      .filter((e) => isStringLiteral(e))
      .map((e) => e.value)
    zones.push(...values)
  }
}
