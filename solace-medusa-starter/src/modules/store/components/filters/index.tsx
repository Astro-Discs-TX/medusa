'use client'

import React from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { Box } from '@modules/common/components/box'
import Divider from '@modules/common/components/divider'
import {
  Select,
  SelectContent,
  SelectTrigger,
} from '@modules/common/components/select'
import { PRICING_OPTIONS } from '@modules/search/const'
import { ProductFilters as ProductFiltersType } from 'types/global'

import FilterWrapper from './filter-wrapper'
import { FilterItems } from './filter-wrapper/filter-item'

export default function ProductFilters({
  filters,
}: {
  filters: ProductFiltersType
}) {
  const pathname = usePathname()
  const isCollection = pathname.includes('collections')
  const searchParams = useSearchParams()
  const currentPrice = searchParams.get('price')

  // Add default empty arrays for undefined filter properties
  const safeFilters = {
    collection: filters?.collection || [],
    type: filters?.type || [],
    material: filters?.material || [],
  }

  const collectionOptions = safeFilters.collection.map((collection) => ({
    id: collection.id,
    value: collection.value,
  }))

  const typeOptions = safeFilters.type.map((type) => ({
    id: type.id,
    value: type.value,
  }))

  const materialOptions = safeFilters.material.map((material) => ({
    id: material.id,
    value: material.value,
  }))

  const priceOptions = PRICING_OPTIONS.map((po) => ({
    ...po,
    disabled: currentPrice !== null && currentPrice !== po.id,
  }))

  return (
    <>
      <Box className="flex flex-col gap-4 small:hidden">
        {!isCollection && collectionOptions.length > 0 && (
          <>
            <FilterWrapper
              title="Collections"
              content={
                <FilterItems items={collectionOptions} param="collection" />
              }
            />
            <Divider />
          </>
        )}
        {typeOptions.length > 0 && (
          <>
            <FilterWrapper
              title="Product type"
              content={<FilterItems items={typeOptions} param="type" />}
            />
            <Divider />
          </>
        )}
        {materialOptions.length > 0 && (
          <>
            <FilterWrapper
              title="Material"
              content={<FilterItems items={materialOptions} param="material" />}
            />
            <Divider />
          </>
        )}
        <FilterWrapper
          title="Price"
          content={<FilterItems items={priceOptions} param="price" />}
        />
      </Box>
      <Box className="hidden items-center gap-2 small:flex">
        {!isCollection && collectionOptions.length > 0 && (
          <Select value={null} onValueChange={() => {}}>
            <SelectTrigger
              aria-label="Choose collection/s"
              data-testid="collection-filter"
            >
              Collections
            </SelectTrigger>
            <SelectContent className="w-full">
              <FilterItems items={collectionOptions} param="collection" />
            </SelectContent>
          </Select>
        )}
        {typeOptions.length > 0 && (
          <Select value={null} onValueChange={() => {}}>
            <SelectTrigger
              aria-label="Choose product type/s"
              data-testid="product-type-filter"
            >
              Product type
            </SelectTrigger>
            <SelectContent className="w-full">
              <FilterItems items={typeOptions} param="type" />
            </SelectContent>
          </Select>
        )}
        {materialOptions.length > 0 && (
          <Select value={null} onValueChange={() => {}}>
            <SelectTrigger
              aria-label="Choose material/s"
              data-testid="material-filter"
            >
              Material
            </SelectTrigger>
            <SelectContent className="w-full">
              <FilterItems items={materialOptions} param="material" />
            </SelectContent>
          </Select>
        )}
        <Select value={null} onValueChange={() => {}}>
          <SelectTrigger aria-label="Choose price" data-testid="price-filter">
            Price
          </SelectTrigger>
          <SelectContent>
            <FilterItems items={priceOptions} param="price" />
          </SelectContent>
        </Select>
      </Box>
    </>
  )
}
