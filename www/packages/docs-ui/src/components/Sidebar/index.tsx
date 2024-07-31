"use client"

import React, { useCallback, useMemo, useRef, useState } from "react"
import { useSidebar } from "@/providers"
import clsx from "clsx"
import { Loading } from "@/components"
import { SidebarItem } from "./Item"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import { SidebarTop, SidebarTopProps } from "./Top"
import useResizeObserver from "@react-hook/resize-observer"
import { useClickOutside } from "../.."

export type SidebarProps = {
  className?: string
  expandItems?: boolean
  sidebarTopProps?: Omit<SidebarTopProps, "parentItem">
}

export const Sidebar = ({
  className = "",
  expandItems = false,
  sidebarTopProps,
}: SidebarProps) => {
  const sidebarTopRef = useRef<HTMLDivElement>(null)
  const [sidebarTopHeight, setSidebarHeight] = useState(0)
  const {
    items,
    currentItems,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    desktopSidebarOpen,
    staticSidebarItems,
    sidebarRef,
  } = useSidebar()
  useClickOutside({
    elmRef: sidebarRef,
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

  const sidebarHasParent = useMemo(
    () => sidebarItems.parentItem !== undefined,
    [sidebarItems]
  )

  useResizeObserver(sidebarTopRef, () => {
    setSidebarHeight(sidebarTopRef.current?.clientHeight || 0)
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
          "fixed -left-full top-0 h-screen transition-[left] lg:relative lg:left-0 lg:h-auto",
          "max-w-sidebar-xs sm:max-w-sidebar-sm md:max-w-sidebar-md lg:max-w-sidebar-lg",
          "xl:max-w-sidebar-xl xxl:max-w-sidebar-xxl xxxl:max-w-sidebar-xxxl",
          mobileSidebarOpen && [
            "!left-docs_0.5 !top-docs_0.5 z-50 shadow-elevation-modal",
            "rounded",
          ],
          !desktopSidebarOpen && "!absolute !-left-full",
          className
        )}
        style={{
          animationFillMode: "forwards",
        }}
      >
        <ul
          className={clsx("h-full w-full", "p-docs_0.75", "flex flex-col")}
          id="sidebar"
        >
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
                className="overflow-y-scroll mt-docs_0.75 clip"
                ref={sidebarRef}
                style={{
                  maxHeight: `calc(100vh - ${sidebarTopHeight}px)`,
                }}
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
                      sidebarHasParent={sidebarHasParent}
                      isMobile={true}
                    />
                  ))}
                </div>
                {/* DESKTOP SIDEBAR */}
                <div>
                  {!sidebarItems.top.length && !staticSidebarItems && (
                    <Loading className="px-0" />
                  )}
                  {sidebarItems.top.map((item, index) => (
                    <SidebarItem
                      item={item}
                      key={index}
                      expandItems={expandItems}
                      sidebarHasParent={sidebarHasParent}
                    />
                  ))}
                </div>
                {/* TODO remove to only have one sidebar items */}
                <div className="mb-docs_1.5">
                  {!sidebarItems.bottom.length && !staticSidebarItems && (
                    <Loading className="px-0" />
                  )}
                  {sidebarItems.bottom.map((item, index) => (
                    <SidebarItem
                      item={item}
                      key={index}
                      expandItems={expandItems}
                      sidebarHasParent={sidebarHasParent}
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
