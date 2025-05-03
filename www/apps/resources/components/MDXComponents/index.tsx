import type { MDXComponents as MDXComponentsType } from "mdx/types"
import {
  Link,
  MDXComponents as UiMdxComponents,
  TypeList,
  WorkflowDiagram,
  SourceCodeLink,
  CodeTabs,
  CodeTab,
  Table,
} from "docs-ui"
import { CommerceModuleSections } from "../CommerceModuleSections"

const MDXComponents: MDXComponentsType = {
  ...UiMdxComponents,
  a: Link,
  TypeList,
  WorkflowDiagram,
  CommerceModuleSections,
  SourceCodeLink,
  CodeTabs,
  CodeTab,
  Table,
}

export default MDXComponents
