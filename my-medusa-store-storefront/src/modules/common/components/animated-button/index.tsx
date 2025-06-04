"use client"

import { motion } from "framer-motion"
import { ButtonHTMLAttributes, ReactNode } from "react"
import { clx } from "@medusajs/ui"
import { luxuryHover } from "@lib/util/animations"

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: "primary" | "secondary" | "gold" | "outline" | "transparent"
  size?: "small" | "medium" | "large"
  isLoading?: boolean
  className?: string
}

const AnimatedButton = ({
  children,
  variant = "primary",
  size = "medium",
  isLoading = false,
  className = "",
  ...props
}: AnimatedButtonProps) => {
  const variantClasses = {
    primary: "bg-ui-bg-base text-ui-fg-base border border-ui-border-base hover:bg-ui-bg-subtle",
    secondary: "bg-ui-bg-subtle text-ui-fg-base border border-ui-border-base hover:bg-ui-bg-base",
    gold: "bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-50",
    outline: "bg-transparent text-ui-fg-base border border-ui-border-base hover:bg-ui-bg-subtle",
    transparent: "bg-transparent text-ui-fg-base hover:bg-ui-bg-subtle",
  }

  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  }

  return (
    <motion.button
      className={clx(
        "rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
      variants={luxuryHover}
      initial="initial"
      whileHover="whileHover"
      whileTap="whileTap"
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border-2 border-ui-fg-base border-t-transparent animate-spin mr-2" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  )
}

export default AnimatedButton 