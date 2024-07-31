import React from "react"
import clsx from "clsx"
import { Sidebar, SidebarProps } from "@/components"

export type RootLayoutProps = {
  children: React.ReactNode
  ProvidersComponent: React.FC<{ children: React.ReactNode }>
  NavbarComponent?: React.FC
  sidebarProps?: SidebarProps
  htmlClassName?: string
  bodyClassName?: string
  mainWrapperClasses?: string
  showPagination?: boolean
}

export const RootLayout = ({
  ProvidersComponent,
  NavbarComponent,
  children,
  sidebarProps,
  htmlClassName,
  bodyClassName,
  mainWrapperClasses,
}: RootLayoutProps) => {
  return (
    <html lang="en" className={clsx("h-full w-full", htmlClassName)}>
      <head />
      <body
        className={clsx(
          "bg-medusa-bg-subtle font-base text-medium w-full",
          "text-medusa-fg-subtle",
          "h-screen overflow-hidden",
          "grid grid-cols-1 lg:mx-auto lg:grid-cols-[197px_1fr]",
          bodyClassName
        )}
      >
        <ProvidersComponent>
          {NavbarComponent && <NavbarComponent />}
          <Sidebar {...sidebarProps} />
          <div
            className={clsx(
              "lg:mt-docs_0.5 lg:mr-docs_0.5",
              "bg-medusa-bg-base rounded",
              "shadow-elevation-card-rest",
              "pt-docs_4 lg:pt-docs_6",
              "flex justify-center items-center",
              "h-full w-full max-h-screen",
              "overflow-y-scroll overflow-x-hidden",
              mainWrapperClasses
            )}
            id="main"
          >
            {children}
          </div>
        </ProvidersComponent>
      </body>
    </html>
  )
}
