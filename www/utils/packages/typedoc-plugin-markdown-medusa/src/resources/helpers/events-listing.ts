import Handlebars from "handlebars"
import pkg from "slugify"
import { DeclarationReflection, ReflectionKind } from "typedoc"
import { pascalToWords } from "utils"

const slugify = pkg.default

export default function () {
  Handlebars.registerHelper(
    "eventsListing",
    function (this: DeclarationReflection) {
      const content: string[] = []

      const subtitleLevel = (this.children?.length ?? 0) > 1 ? 3 : 2
      const showHeader = (this.children?.length ?? 0) > 1

      function parseChildren(children: DeclarationReflection[]) {
        children?.forEach((child, index) => {
          content.push(
            formatEventsType(child as DeclarationReflection, {
              subtitleLevel,
              showHeader,
            })
          )
          if (index < children!.length - 1) {
            content.push("")
            content.push("---")
            content.push("")
          }
        })
      }

      if (this.kind === ReflectionKind.Module) {
        this.children?.forEach((child, index) => {
          parseChildren(child.children || [])
          if (index < this.children!.length - 1) {
            content.push("")
            content.push("---")
            content.push("")
          }
        })
      } else {
        parseChildren(this.children || [])
      }

      return content.join("\n")
    }
  )
}

function formatEventsType(
  eventVariable: DeclarationReflection,
  {
    subtitleLevel = 3,
    showHeader = true,
  }: {
    subtitleLevel?: number
    showHeader?: boolean
  }
) {
  if (eventVariable.type?.type !== "reflection") {
    return ""
  }
  const content: string[] = []
  const subHeaderPrefix = "#".repeat(subtitleLevel)
  const header = pascalToWords(
    eventVariable.name.replaceAll("WorkflowEvents", "")
  )
  if (showHeader) {
    content.push(`${"#".repeat(subtitleLevel - 1)} ${header} Events`)
  }
  content.push("")

  const eventProperties = eventVariable.type.declaration.children || []

  content.push(`${subHeaderPrefix} Summary`)
  content.push("")
  // table start
  content.push(`<Table>`)
  // table header start
  content.push(`  <Table.Header>`)
  content.push(`    <Table.Row>`)
  content.push(`      <Table.HeaderCell>\nEvent\n</Table.HeaderCell>`)
  content.push(`      <Table.HeaderCell>\nDescription\n</Table.HeaderCell>`)
  // table header end
  content.push(`    </Table.Row>`)
  content.push(`  </Table.Header>`)
  // table body start
  content.push(`  <Table.Body>`)
  eventProperties.forEach((event) => {
    let eventName =
      event.comment?.blockTags
        .find((tag) => tag.tag === "@eventName")
        ?.content.map((content) => content.text)
        .join("") || ""
    eventName = `[${eventName}](#${getEventNameSlug(eventName)})`
    const eventDescription = event.comment?.summary
      .map((content) => content.text)
      .join("")
    const deprecationTag = event.comment?.blockTags.find(
      (tag) => tag.tag === "@deprecated"
    )

    if (deprecationTag) {
      eventName += `\n`
      const deprecationText = deprecationTag.content
        .map((content) => content.text)
        .join("")
        .trim()
      if (deprecationText.length) {
        eventName += `<Tooltip text="${deprecationText}">`
      }
      eventName += `<Badge variant="orange">Deprecated</Badge>`
      if (deprecationText.length) {
        eventName += `</Tooltip>`
      }
    }

    content.push(`    <Table.Row>`)
    content.push(`      <Table.Cell>\n${eventName}\n</Table.Cell>`)
    content.push(`      <Table.Cell>\n${eventDescription}\n</Table.Cell>`)
    content.push(`    </Table.Row>`)
  })
  // table body end
  content.push(`  </Table.Body>`)
  // table end
  content.push(`</Table>`)
  content.push("")

  eventProperties.forEach((event, index) => {
    const eventName = event.comment?.blockTags
      .find((tag) => tag.tag === "@eventName")
      ?.content.map((content) => content.text)
      .join("")
    const eventDescription = event.comment?.summary
      .map((content) => content.text)
      .join("")
    const eventPayload = event.comment?.blockTags
      .find((tag) => tag.tag === "@eventPayload")
      ?.content.map((content) => content.text)
      .join("")
    const workflows = event.comment?.blockTags
      .find((tag) => tag.tag === "@workflows")
      ?.content.map((content) => content.text)
      .join("")
      .split(", ")
    const deprecatedTag = event.comment?.blockTags.find(
      (tag) => tag.tag === "@deprecated"
    )
    const deprecatedMessage = deprecatedTag?.content
      .map((content) => content.text)
      .join("")
      .trim()

    content.push(
      getEventHeading({
        titleLevel: subtitleLevel,
        eventName: eventName || "",
        payload: eventPayload || "",
        deprecated: !!deprecatedTag,
        deprecatedMessage,
      })
    )
    content.push("")
    content.push(eventDescription || "")
    content.push("")
    content.push(`${subHeaderPrefix}# Payload`)
    content.push("")
    content.push(eventPayload || "")
    content.push("")
    content.push(
      `${subHeaderPrefix}# Workflows Emitting this Event\n\nThe following workflows emit this event when they're executed. These workflows are executed by Medusa's API routes. You can also view the events emitted by API routes in the [Store](https://docs.medusajs.com/api/store) and [Admin](https://docs.medusajs.com/api/admin) API references.`
    )
    content.push("")
    workflows?.forEach((workflow) => {
      content.push(`- [${workflow}](/references/medusa-workflows/${workflow})`)
    })
    content.push("")
    if (index < eventProperties.length - 1) {
      content.push("---")
      content.push("")
    }
  })

  return content.join("\n")
}

function getEventHeading({
  titleLevel,
  eventName,
  payload,
  deprecated = false,
  deprecatedMessage,
}: {
  titleLevel: number
  eventName: string
  payload: string
  deprecated?: boolean
  deprecatedMessage?: string
}) {
  const heading = [eventName]
  if (deprecated) {
    if (deprecatedMessage?.length) {
      heading.push(`<Tooltip text="${deprecatedMessage}">`)
    }

    heading.push(`<Badge variant="orange">Deprecated</Badge>`)

    if (deprecatedMessage?.length) {
      heading.push(`</Tooltip>`)
    }
  }
  return `<EventHeader headerLvl="${titleLevel}" headerProps={{ id: "${getEventNameSlug(
    eventName
  )}", children: (<>${heading.join(
    "\n"
  )}</>), className: "flex flex-wrap justify-center gap-docs_0.25" }} eventName="${eventName}" payload={\`${payload.replaceAll(
    "`",
    "\\`"
  )}\`} />`
}

function getEventNameSlug(eventName: string) {
  return slugify(eventName.replace(".", ""), { lower: true })
}
