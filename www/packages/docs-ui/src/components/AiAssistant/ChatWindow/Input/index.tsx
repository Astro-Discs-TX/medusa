import React, { useEffect, useRef } from "react"
import clsx from "clsx"
import { useAiAssistantChat } from "../../../../providers/AiAssistant/Chat"
import { ArrowUpCircleSolid } from "@medusajs/icons"

export const AiAssistantChatWindowInput = () => {
  const {
    inputRef,
    question,
    setQuestion,
    handleSubmit: submitQuestion,
    loading,
    getThreadItems,
  } = useAiAssistantChat()
  const formRef = useRef<HTMLFormElement | null>(null)

  const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    submitQuestion()
  }

  const handleKeyboardDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "ArrowUp" && !question) {
      const lastQuestion = getThreadItems()
        .reverse()
        .find((item) => item.type === "question")
      if (lastQuestion) {
        setQuestion(lastQuestion.content)
      }
      return
    }
    if (e.key !== "Enter") {
      return
    }
    if (e.shiftKey) {
      setQuestion((prev) => `${prev}\n`)
    } else {
      onSubmit()
    }
  }

  const adjustTextareaHeight = () => {
    if (!inputRef.current) {
      return
    }
    if (!question.length) {
      inputRef.current.style.height = "auto"
      return
    }
    inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [question])

  const handleTouch = (e: React.TouchEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    inputRef.current?.focus({
      preventScroll: true,
    })
  }

  return (
    <div
      className={clsx(
        "px-docs_1 py-docs_0.75 border-t border-medusa-border-base"
      )}
    >
      <form
        className="flex flex-col gap-docs_0.5"
        onSubmit={onSubmit}
        ref={formRef}
      >
        <textarea
          className={clsx(
            "appearance-none text-base md:text-small placeholder:text-medusa-fg-muted",
            "text-medusa-fg-base max-h-[210px] overflow-auto resize-none bg-transparent",
            "focus:outline-none focus:ring-0 disabled:cursor-not-allowed max-h-[210px]",
            "disabled:!bg-transparent disabled:text-medusa-fg-disabled"
          )}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyboardDown}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
          onTouchEnd={handleTouch}
          ref={inputRef as React.RefObject<HTMLTextAreaElement | null>}
          placeholder="Ask me a question about Medusa..."
          disabled={loading}
        />
        <div className="flex items-center justify-end">
          <button
            className={clsx(
              "appearance-none p-0 text-medusa-fg-base disabled:text-medusa-fg-disabled",
              "transition-colors"
            )}
            disabled={!question || loading}
          >
            <ArrowUpCircleSolid />
          </button>
        </div>
      </form>
    </div>
  )
}
