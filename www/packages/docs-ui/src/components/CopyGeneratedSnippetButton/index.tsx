"use client"

import React from "react"
import { CopyButton, useGenerateSnippet, UseGenerateSnippet } from "../.."
import { SquareTwoStack } from "@medusajs/icons"

export type CopyGeneratedSnippetButtonProps = UseGenerateSnippet & {
  tooltipText?: string
}

export const CopyGeneratedSnippetButton = ({
  tooltipText,
  ...props
}: CopyGeneratedSnippetButtonProps) => {
  const { snippet } = useGenerateSnippet(props)

  return (
    <CopyButton
      text={snippet}
      tooltipText={tooltipText}
      className="inline-block w-fit"
    >
      <SquareTwoStack />
    </CopyButton>
  )
}
