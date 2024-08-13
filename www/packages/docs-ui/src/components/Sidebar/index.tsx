"use client"

import React, { useMemo, useRef } from "react"
import { useSidebar } from "@/providers"
import clsx from "clsx"
import { Loading } from "@/components"
import { SidebarItem } from "./Item"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import { SidebarTop, SidebarTopProps } from "./Top"
import useResizeObserver from "@react-hook/resize-observer"
import { useClickOutside } from "../.."
import { SidebarSeparator } from "./Separator"

export type SidebarProps = {
  className?: string
  expandItems?: boolean
  sidebarTopProps?: Omit<SidebarTopProps, "parentItem">
}

export const Sidebar = ({
  className = "",
  expandItems = true,
  sidebarTopProps,
}: SidebarProps) => {
  const sidebarWrapperRef = useRef(null)
  const sidebarTopRef = useRef<HTMLDivElement>(null)
  const {
    items,
    currentItems,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    staticSidebarItems,
    sidebarRef,
    sidebarTopHeight,
    setSidebarTopHeight,
  } = useSidebar()
  useClickOutside({
    elmRef: sidebarWrapperRef,
    onClickOutside: () => {
      if (mobileSidebarOpen) {
        setMobileSidebarOpen(false)
      }
    },
  })

  const sidebarItems = useMemo(
    () => currentItems || items,
    [items, currentItems]
  )

  useResizeObserver(sidebarTopRef, () => {
    setSidebarTopHeight(sidebarTopRef.current?.clientHeight || 0)
  })

  return (
    <>
      {mobileSidebarOpen && (
        <div
          className={clsx(
            "lg:hidden bg-medusa-bg-overlay opacity-70",
            "fixed top-0 left-0 w-full h-full z-10"
          )}
        ></div>
      )}
      <aside
        className={clsx(
          "bg-medusa-bg-base lg:bg-transparent block",
          "fixed -left-full top-0 h-[calc(100%-16px)] transition-[left] lg:relative lg:left-0 lg:h-auto",
          "max-w-sidebar-xs sm:max-w-sidebar-sm md:max-w-sidebar-md lg:max-w-sidebar-lg",
          "xl:max-w-sidebar-xl xxl:max-w-sidebar-xxl xxxl:max-w-sidebar-xxxl",
          mobileSidebarOpen && [
            "!left-docs_0.5 !top-docs_0.5 z-50 shadow-elevation-modal dark:shadow-elevation-modal-dark",
            "rounded",
            "lg:!left-0 lg:!top-0 lg:shadow-none",
          ],
          className
        )}
        style={{
          animationFillMode: "forwards",
        }}
        ref={sidebarWrapperRef}
      >
        <ul className={clsx("h-full w-full", "flex flex-col")}>
          <SidebarTop
            {...sidebarTopProps}
            parentItem={sidebarItems.parentItem}
            ref={sidebarTopRef}
          />
          <SwitchTransition>
            <CSSTransition
              key={sidebarItems.parentItem?.title || "home"}
              nodeRef={sidebarRef}
              classNames={{
                enter: "animate-fadeInLeft animate-fast",
                exit: "animate-fadeOutLeft animate-fast",
              }}
              timeout={200}
            >
              <div
                className={clsx(
                  "overflow-y-scroll clip",
                  "py-docs_0.75 flex-1"
                )}
                ref={sidebarRef}
                style={{
                  maxHeight: `calc(100vh - ${sidebarTopHeight + 12}px)`,
                }}
                id="sidebar"
              >
                {/* MOBILE SIDEBAR */}
                <div className={clsx("lg:hidden")}>
                  {!sidebarItems.mobile.length && !staticSidebarItems && (
                    <Loading className="px-0" />
                  )}
                  {sidebarItems.mobile.map((item, index) => (
                    <SidebarItem
                      item={item}
                      key={index}
                      expandItems={expandItems}
                      hasNextItems={index !== sidebarItems.default.length - 1}
                    />
                  ))}
                  <SidebarSeparator />
                </div>
                {/* DESKTOP SIDEBAR */}
                <div className="mt-docs_0.75 lg:mt-0">
                  {!sidebarItems.default.length && !staticSidebarItems && (
                    <Loading className="px-0" />
                  )}
                  {sidebarItems.default.map((item, index) => (
                    <SidebarItem
                      item={item}
                      key={index}
                      expandItems={expandItems}
                      hasNextItems={index !== sidebarItems.default.length - 1}
                    />
                  ))}
                </div>
              </div>
            </CSSTransition>
          </SwitchTransition>
        </ul>
      </aside>
    </>
  )
}
