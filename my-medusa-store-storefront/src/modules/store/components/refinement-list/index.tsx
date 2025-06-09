"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useMemo } from "react"
import { Button, Heading, Text } from "@medusajs/ui"
import { XMarkMini } from "@medusajs/icons"

import SortProducts, { SortOptions } from "./sort-products"
import FilterDropdown from "@modules/common/components/filter-dropdown"
import PriceRange from "@modules/common/components/price-range"
import FilterTag from "@modules/common/components/filter-tag"
import { HttpTypes } from "@medusajs/types"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  'data-testid'?: string
  categories?: {
    id: string
    name: string
    handle: string
    products_count?: number
  }[]
  tags?: {
    id: string
    value: string
    products_count?: number
  }[]
  minPrice: number
  maxPrice: number
  currencyCode: string
  productCount?: number
  region: HttpTypes.StoreRegion
}

const RefinementList = ({ 
  sortBy, 
  categories = [],
  tags = [],
  minPrice,
  maxPrice,
  currencyCode,
  productCount,
  region,
  'data-testid': dataTestId 
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Mobile filter toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  // Parse existing filters from URL
  const categoryIds = useMemo(() => {
    const params = searchParams.get("categories")
    return params ? params.split(",") : []
  }, [searchParams])
  
  const tagIds = useMemo(() => {
    const params = searchParams.get("tags")
    return params ? params.split(",") : []
  }, [searchParams])
  
  const priceRange = useMemo(() => {
    const minParam = searchParams.get("price_min")
    const maxParam = searchParams.get("price_max")
    return [
      minParam ? parseInt(minParam) : minPrice,
      maxParam ? parseInt(maxParam) : maxPrice
    ] as [number, number]
  }, [searchParams, minPrice, maxPrice])
  
  // Check if any filters are active
  const hasActiveFilters = categoryIds.length > 0 || tagIds.length > 0 || 
    priceRange[0] > minPrice || priceRange[1] < maxPrice

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }
  
  // Handle category filter change
  const handleCategoryChange = (id: string) => {
    const updatedCategories = categoryIds.includes(id)
      ? categoryIds.filter((catId) => catId !== id)
      : [...categoryIds, id]
    
    const params = new URLSearchParams(searchParams)
    if (updatedCategories.length) {
      params.set("categories", updatedCategories.join(","))
    } else {
      params.delete("categories")
    }
    router.push(`${pathname}?${params.toString()}`)
  }
  
  // Handle tag filter change
  const handleTagChange = (id: string) => {
    const updatedTags = tagIds.includes(id)
      ? tagIds.filter((tagId) => tagId !== id)
      : [...tagIds, id]
    
    const params = new URLSearchParams(searchParams)
    if (updatedTags.length) {
      params.set("tags", updatedTags.join(","))
    } else {
      params.delete("tags")
    }
    router.push(`${pathname}?${params.toString()}`)
  }
  
  // Handle price range change
  const handlePriceChange = (value: [number, number]) => {
    const params = new URLSearchParams(searchParams)
    
    if (value[0] !== minPrice) {
      params.set("price_min", value[0].toString())
    } else {
      params.delete("price_min")
    }
    
    if (value[1] !== maxPrice) {
      params.set("price_max", value[1].toString())
    } else {
      params.delete("price_max")
    }
    
    router.push(`${pathname}?${params.toString()}`)
  }
  
  // Clear all filters
  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("categories")
    params.delete("tags")
    params.delete("price_min")
    params.delete("price_max")
    
    // Keep the sort parameter
    const sort = params.get("sortBy")
    
    router.push(`${pathname}${sort ? `?sortBy=${sort}` : ""}`)
  }
  
  // Determine active category names for tags
  const activeCategoryNames = useMemo(() => {
    return categories
      .filter(cat => categoryIds.includes(cat.id))
      .map(cat => cat.name)
  }, [categories, categoryIds])
  
  // Determine active tag names for tags
  const activeTagNames = useMemo(() => {
    return tags
      .filter(tag => tagIds.includes(tag.id))
      .map(tag => tag.value)
  }, [tags, tagIds])
  
  // Remove a specific category
  const removeCategory = (id: string) => {
    handleCategoryChange(id)
  }
  
  // Remove a specific tag
  const removeTag = (id: string) => {
    handleTagChange(id)
  }
  
  return (
    <div className="py-4 mb-8">
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between mb-6 small:hidden">
        <div className="flex items-center">
          <Button 
            variant="secondary"
            className="flex items-center gap-x-2 px-3 py-1.5 border border-luxury-gold/30 bg-transparent text-luxury-charcoal hover:border-luxury-gold/60 transition-colors"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <span className="text-xs font-medium">Filter</span>
            {hasActiveFilters && (
              <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>
            )}
          </Button>
        </div>
        <div className="flex items-center">
          <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
        </div>
      </div>
      
      {/* Product count & active filters */}
      <div className="flex flex-col gap-y-4 mb-6">
        {productCount !== undefined && (
          <Text className="text-luxury-charcoal font-medium text-base">
            {productCount} {productCount === 1 ? "Product" : "Products"}
          </Text>
        )}
        
        {hasActiveFilters && (
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {activeCategoryNames.map((name, i) => {
                const category = categories.find(c => c.name === name)
                if (!category) return null
                return (
                  <FilterTag 
                    key={`cat-${category.id}`}
                    label={`Category: ${name}`}
                    onClick={() => removeCategory(category.id)}
                  />
                )
              })}
              
              {activeTagNames.map((value, i) => {
                const tag = tags.find(t => t.value === value)
                if (!tag) return null
                return (
                  <FilterTag 
                    key={`tag-${tag.id}`}
                    label={`Tag: ${value}`}
                    onClick={() => removeTag(tag.id)}
                  />
                )
              })}
              
              {(priceRange[0] > minPrice || priceRange[1] < maxPrice) && (
                <FilterTag 
                  label={`Price: ${new Intl.NumberFormat("en-US", { 
                    style: "currency", 
                    currency: currencyCode 
                  }).format(priceRange[0])} - ${new Intl.NumberFormat("en-US", { 
                    style: "currency", 
                    currency: currencyCode 
                  }).format(priceRange[1])}`}
                  onClick={() => handlePriceChange([minPrice, maxPrice])}
                />
              )}
            </div>
            <Button
              variant="secondary"
              className="text-luxury-charcoal/80 text-xs flex items-center gap-x-1"
              onClick={clearAllFilters}
            >
              <XMarkMini className="w-3.5 h-3.5" />
              Clear all filters
            </Button>
          </div>
        )}
      </div>
      
      {/* Filters & sort */}
      <div className={`grid small:grid-cols-[250px_1fr] gap-x-8 ${!showMobileFilters && 'max-small:hidden'}`}>
        {/* Left sidebar filters */}
        <div className="flex flex-col gap-6">
          {categories.length > 0 && (
            <FilterDropdown
              title="Categories"
              items={categories.map(c => ({
                id: c.id,
                name: c.name,
                count: c.products_count
              }))}
              selectedItems={categoryIds}
              handleChange={handleCategoryChange}
              data-testid="category-filter"
            />
          )}
          
          {tags.length > 0 && (
            <FilterDropdown
              title="Tags"
              items={tags.map(t => ({
                id: t.id,
                name: t.value,
                count: t.products_count
              }))}
              selectedItems={tagIds}
              handleChange={handleTagChange}
              data-testid="tag-filter"
            />
          )}
          
          <PriceRange
            min={minPrice}
            max={maxPrice}
            value={priceRange}
            handleChange={handlePriceChange}
            currencyCode={currencyCode}
            data-testid="price-filter"
          />
        </div>
        
        {/* Right side sort (desktop) */}
        <div className="hidden small:flex justify-end">
          <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
        </div>
      </div>
    </div>
  )
}

export default RefinementList
