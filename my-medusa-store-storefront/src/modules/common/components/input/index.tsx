import { Label } from "@medusajs/ui"
import React, { useEffect, useImperativeHandle, useState } from "react"
import clsx from "clsx"

import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, touched, required, topLabel, className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    const isLuxury = className?.includes("luxury-input")

    return (
      <div className="flex flex-col w-full">
        {topLabel && (
          <Label className={clsx("mb-2", isLuxury ? "text-[var(--color-luxury-charcoal)]" : "txt-compact-medium-plus")}>{topLabel}</Label>
        )}
        <div className="flex relative z-0 w-full txt-compact-medium">
          <input
            type={inputType}
            name={name}
            placeholder=" "
            required={required}
            className={clsx(
              "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0",
              {
                "border-[var(--color-luxury-lightgold)]/30 hover:border-[var(--color-luxury-lightgold)]/50 focus:border-[var(--color-luxury-gold)] focus:shadow-[0_0_0_2px_rgba(212,175,55,0.1)]": isLuxury,
                "focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover": !isLuxury
              },
              className
            )}
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={name}
            onClick={() => inputRef.current?.focus()}
            className={clsx(
              "flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 top-3 -z-1 origin-0",
              {
                "text-[var(--color-luxury-charcoal)]/70": isLuxury,
                "text-ui-fg-subtle": !isLuxury
              }
            )}
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={clsx(
                "px-4 focus:outline-none transition-all duration-150 outline-none absolute right-0 top-3",
                {
                  "text-[var(--color-luxury-charcoal)]/50 focus:text-[var(--color-luxury-gold)]": isLuxury,
                  "text-ui-fg-subtle focus:text-ui-fg-base": !isLuxury
                }
              )}
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
