"use client"

import { H2, Hr, useChildDocs } from "docs-ui"
import React from "react"

type CommerceModuleSectionsProps = {
  name: string
  hideWorkflowsSection?: boolean
}

export const CommerceModuleSections = ({
  name,
  hideWorkflowsSection = false,
}: CommerceModuleSectionsProps) => {
  const components: (JSX.Element | JSX.Element[])[] = []
  const { component: workflowsComponent } = useChildDocs({
    showItems: ["Workflows"],
    titleLevel: 3,
    itemsPerRow: 2,
  })
  const { component: stepsComponent } = useChildDocs({
    showItems: ["Steps"],
    titleLevel: 3,
    itemsPerRow: 2,
  })
  const { items: serverGuideItems, component: serverGuidesComponent } =
    useChildDocs({
      showItems: ["Server Guides"],
      itemsPerRow: 2,
    })
  if (serverGuideItems?.default.length) {
    components.push(serverGuidesComponent)
  }
  const { items: storefrontGuideItems, component: storefrontGuidesComponent } =
    useChildDocs({
      showItems: ["Storefront Guides"],
      itemsPerRow: 2,
    })
  if (storefrontGuideItems?.default.length) {
    components.push(storefrontGuidesComponent)
  }
  const { items: adminGuideItems, component: adminGuidesComponent } =
    useChildDocs({
      showItems: ["Admin Guides"],
      itemsPerRow: 2,
    })
  if (adminGuideItems?.default.length) {
    components.push(adminGuidesComponent)
  }
  const { items: userGuideItems, component: userGuidesComponent } =
    useChildDocs({
      showItems: ["User Guides"],
      itemsPerRow: 2,
    })
  if (userGuideItems?.default.length) {
    components.push(userGuidesComponent)
  }
  const { items: referenceItems, component: referencesComponent } =
    useChildDocs({
      showItems: ["References"],
      itemsPerRow: 2,
    })
  if (referenceItems?.default.length) {
    components.push(referencesComponent)
  }

  return (
    <>
      {!hideWorkflowsSection && (
        <>
          <H2 id="medusa-workflows-and-steps">Medusa Workflows and Steps</H2>
          <p>
            Medusa provides the following workflows and steps that use the{" "}
            {name} Module. You can use these workflows and steps in your
            customizations:
          </p>
          {workflowsComponent}
          {stepsComponent}
        </>
      )}

      {components.map((component, i) => (
        <React.Fragment key={i}>
          <>
            {i !== 0 || !hideWorkflowsSection ? <Hr /> : null}
            {component}
          </>
        </React.Fragment>
      ))}
    </>
  )
}
