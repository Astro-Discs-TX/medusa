"use client"

import React, { useMemo } from "react"
import { useSiteConfig } from "../../../providers"
import { products } from "../../../constants"
import { Product } from "types"
import { BorderedIcon } from "../../BorderedIcon"
import clsx from "clsx"

export const ContentMenuProducts = () => {
  const { frontmatter, config } = useSiteConfig()

  const loadedProducts = useMemo(() => {
    return frontmatter.products
      ?.sort()
      .map((product) => {
        return products.find(
          (p) => p.name.toLowerCase() === product.toLowerCase()
        )
      })
      .filter(Boolean) as Product[]
  }, [frontmatter.products])

  if (!loadedProducts?.length) {
    return null
  }

  const getProductUrl = (product: Product) => {
    return `${config.baseUrl}${config.basePath}${product.path}`
  }

  return (
    <div className="flex flex-col gap-docs_0.5">
      <span className="text-x-small-plus text-medusa-fg-muted">
        Modules used
      </span>
      {loadedProducts.map((product, index) => (
        <a
          key={index}
          href={getProductUrl(product)}
          className="flex gap-docs_0.5 items-center"
        >
          <BorderedIcon
            wrapperClassName={clsx("bg-medusa-bg-base")}
            icon={product.image}
          />
          <span className="text-medusa-fg-subtle text-x-small-plus">
            {product.title}
          </span>
        </a>
      ))}
    </div>
  )
}
