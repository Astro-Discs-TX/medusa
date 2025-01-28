"use client"

import React, { useMemo, useState } from "react"
import { Button } from "../../Button"
import { AiAssistantLuminosityIcon } from "../../Icons"
import { AiAssistent } from "@medusajs/icons"
import { Tooltip } from "../../Tooltip"
import { Kbd } from "../../Kbd"
import { getOsShortcut } from "../../../utils"
import { useAiAssistant } from "../../../providers"
import { useKeyboardShortcut } from "../../../hooks"

export const AiAssistantTriggerButton = () => {
  const [hovered, setHovered] = useState(false)
  const { chatOpened, setChatOpened } = useAiAssistant()
  const isActive = useMemo(() => {
    return hovered || chatOpened
  }, [hovered, chatOpened])
  const osShortcut = getOsShortcut()

  useKeyboardShortcut({
    metakey: true,
    shortcutKeys: ["m"],
    action: () => {
      setChatOpened((prev) => !prev)
    },
    checkEditing: false,
  })

  return (
    <Tooltip
      render={() => (
        <span className="flex gap-[6px] items-center">
          <span className="text-compact-x-small-plus text-medusa-fg-base">
            Ask AI
          </span>
          <span className="flex gap-[5px] items-center">
            <Kbd className="bg-medusa-bg-field-component border-medusa-border-strong w-[18px] h-[18px] inline-block">
              {osShortcut}
            </Kbd>
            <Kbd className="bg-medusa-bg-field-component border-medusa-border-strong w-[18px] h-[18px] inline-block">
              M
            </Kbd>
          </span>
        </span>
      )}
    >
      <Button
        variant="transparent-clear"
        className="!p-[6.5px]"
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        onClick={() => setChatOpened((prev) => !prev)}
      >
        {isActive ? (
          <AiAssistent width={20} height={20} />
        ) : (
          <AiAssistantLuminosityIcon />
        )}
      </Button>
    </Tooltip>
  )
}
