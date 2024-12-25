"use client"

import { H2, Hr, useChildDocs } from "docs-ui"
import React from "react"

type CommerceModuleSectionsProps = {
  name: string
}

export const CommerceModuleSections = ({
  name,
}: CommerceModuleSectionsProps) => {
  const components: (JSX.Element | JSX.Element[])[] = []
  const { component: workflowsComponent } = useChildDocs({
    showItems: ["Workflows"],
    titleLevel: 3,
  })
  const { component: stepsComponent } = useChildDocs({
    showItems: ["Steps"],
    titleLevel: 3,
  })
  const { items: serverGuideItems, component: serverGuidesComponent } =
    useChildDocs({
      showItems: ["Server Guides"],
    })
  if (serverGuideItems?.default.length) {
    components.push(serverGuidesComponent)
  }
  const { items: storefrontGuideItems, component: storefrontGuidesComponent } =
    useChildDocs({
      showItems: ["Storefront Guides"],
    })
  if (storefrontGuideItems?.default.length) {
    components.push(storefrontGuidesComponent)
  }
  const { items: adminGuideItems, component: adminGuidesComponent } =
    useChildDocs({
      showItems: ["Admin Guides"],
    })
  if (adminGuideItems?.default.length) {
    components.push(adminGuidesComponent)
  }
  const { items: userGuideItems, component: userGuidesComponent } =
    useChildDocs({
      showItems: ["User Guides"],
    })
  if (userGuideItems?.default.length) {
    components.push(userGuidesComponent)
  }
  const { items: referenceItems, component: referencesComponent } =
    useChildDocs({
      showItems: ["References"],
    })
  if (referenceItems?.default.length) {
    components.push(referencesComponent)
  }

  return (
    <>
      <H2 id="medusa-workflows-and-steps">Medusa Workflows and Steps</H2>
      <p>
        Medusa provides the following workflows and steps that use the {name}{" "}
        Module. You can use these workflows and steps in your customizations:
      </p>
      {workflowsComponent}
      {stepsComponent}

      {components.map((component, i) => (
        <React.Fragment key={i}>
          <>
            <Hr />
            {component}
          </>
        </React.Fragment>
      ))}
    </>
  )
}
