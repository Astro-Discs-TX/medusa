import * as ts from "typescript"
import { SyntaxKind } from "typescript"
import DefaultKindGenerator, { GetDocBlockOptions } from "./default.js"

const EXAMPLE_CODEBLOCK_REGEX = /```(ts|typescript)\s*([.\s\S]*?)\s*```/

// eslint-disable-next-line max-len
class RouteExamplesKindGenerator extends DefaultKindGenerator<ts.MethodDeclaration> {
  public name = "route-examples"
  protected allowedKinds: SyntaxKind[] = [SyntaxKind.MethodDeclaration]

  async getDocBlock(
    node: ts.MethodDeclaration,
    options?: GetDocBlockOptions
  ): Promise<string> {
    if (!this.isAllowed(node)) {
      return await super.getDocBlock(node, options)
    }

    // extract the route path from the node
    let routePath = ""
    node.body?.forEachChild((child) => {
      if (child.kind === ts.SyntaxKind.StringLiteral) {
        routePath = child.getText()
      }
    })

    if (!routePath) {
      return ""
    }

    // get examples from the comments
    const example = ts
      .getJSDocTags(node)
      .find((tag) => tag.tagName.escapedText === "example")

    if (!example || !example.comment) {
      return ""
    }

    const exampleText = this.getExampleText(
      typeof example.comment === "string"
        ? example.comment
        : example.comment[example.comment.length - 1].text
    )

    return JSON.stringify({
      [routePath]: exampleText,
    })
  }

  getExampleText(comment: string): string {
    // try to match the example codeblock first
    const match = comment.match(EXAMPLE_CODEBLOCK_REGEX)
    if (match) {
      // return the last match
      return match[match.length - 1]
    }

    // consider the comment as the example text
    return comment
  }

  /**
   * Use this method later to support different example types.
   *
   * @param node - The node to get the example type for.
   * @returns The example type.
   */
  getExampleType(node: ts.MethodDeclaration): string {
    return "js-sdk"
  }
}

export default RouteExamplesKindGenerator
