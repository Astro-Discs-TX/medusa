"use client"

import type { OpenAPIV3 } from "openapi-types"
import type { Operation, PathsObject } from "@/types/openapi"
import { findSidebarItem, useSidebarNew } from "docs-ui"
import { Fragment, Suspense, useEffect } from "react"
import dynamic from "next/dynamic"
import type { TagOperationProps } from "../Operation"
import clsx from "clsx"
import getTagChildSidebarItems from "@/utils/get-tag-child-sidebar-items"
import { useLoading } from "@/providers/loading"
import DividedLoading from "@/components/DividedLoading"
import { SidebarNew } from "types"

const TagOperation = dynamic<TagOperationProps>(
  async () => import("../Operation")
) as React.FC<TagOperationProps>

export type TagPathsProps = {
  tag: OpenAPIV3.TagObject
  paths: PathsObject
} & React.HTMLAttributes<HTMLDivElement>

const TagPaths = ({ tag, className, paths }: TagPathsProps) => {
  const { shownSidebar, addItems } = useSidebarNew()
  const { loading } = useLoading()

  useEffect(() => {
    if (paths) {
      const parentItem = findSidebarItem({
        sidebarItems: shownSidebar.items,
        item: { title: tag.name, type: "category" },
        checkChildren: false,
      }) as SidebarNew.SidebarItemCategory
      const pathItems: SidebarNew.SidebarItem[] = getTagChildSidebarItems(paths)
      if ((parentItem?.children?.length || 0) < pathItems.length) {
        addItems(pathItems, {
          sidebar_id: shownSidebar.sidebar_id,
          parent: {
            type: "category",
            title: tag.name,
            path: "",
            changeLoaded: true,
          },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths, shownSidebar.sidebar_id])

  return (
    <Suspense>
      <div className={clsx("relative", className)}>
        {loading && <DividedLoading className="mt-7" />}
        {Object.entries(paths).map(([endpointPath, operations], pathIndex) => (
          <Fragment key={pathIndex}>
            {Object.entries(operations).map(
              ([method, operation], operationIndex) => (
                <TagOperation
                  method={method}
                  operation={operation as Operation}
                  tag={tag}
                  key={`${pathIndex}-${operationIndex}`}
                  endpointPath={endpointPath}
                  className={clsx("pt-7")}
                />
              )
            )}
          </Fragment>
        ))}
      </div>
    </Suspense>
  )
}

export default TagPaths
