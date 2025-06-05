"use client"

import { notFound } from "next/navigation"
import { Suspense } from "react"
import { motion } from "framer-motion"

import InteractiveLink from "@modules/common/components/interactive-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1],
      }
    },
  }

  return (
    <motion.div
      className="flex flex-col small:flex-row small:items-start py-10 content-container"
      data-testid="category-container"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <RefinementList sortBy={sort} data-testid="sort-by-container" />
      <div className="w-full">
        {/* Breadcrumb navigation with elegant styling */}
        <motion.div 
          className="flex flex-row mb-8 items-center gap-2 flex-wrap"
          variants={itemVariants}
        >
          {parents.length > 0 && (
            <div className="flex items-center text-luxury-charcoal/70 text-base-regular">
              <LocalizedClientLink
                className="hover:text-luxury-gold transition-colors duration-300"
                href="/categories"
              >
                Categories
              </LocalizedClientLink>
              <span className="mx-2">/</span>
            </div>
          )}
          
          {parents &&
            parents.map((parent) => (
              <div key={parent.id} className="flex items-center text-luxury-charcoal/70">
                <LocalizedClientLink
                  className="hover:text-luxury-gold transition-colors duration-300"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  {parent.name}
                </LocalizedClientLink>
                <span className="mx-2">/</span>
              </div>
            ))}
          
          <h1 
            className="font-display text-2xl text-luxury-charcoal"
            data-testid="category-page-title"
          >
            {category.name}
          </h1>
        </motion.div>
        
        {/* Category description with elegant styling */}
        {category.description && (
          <motion.div 
            className="mb-8 text-base-regular text-luxury-charcoal/80 max-w-2xl"
            variants={itemVariants}
          >
            <p>{category.description}</p>
          </motion.div>
        )}
        
        {/* Child categories with luxury styling */}
        {category.category_children && category.category_children.length > 0 && (
          <motion.div 
            className="mb-12 text-base-large"
            variants={itemVariants}
          >
            <h2 className="font-display text-xl mb-4 text-luxury-charcoal">Browse Subcategories</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {category.category_children?.map((c) => (
                <motion.li 
                  key={c.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                >
                  <LocalizedClientLink 
                    href={`/categories/${c.handle}`}
                    className="block p-4 border border-luxury-gold/10 rounded-md bg-luxury-ivory hover:border-luxury-gold/30 hover:shadow-luxury-sm transition-all duration-300"
                  >
                    <span className="text-luxury-gold font-display">{c.name}</span>
                    {c.description && (
                      <p className="mt-1 text-sm text-luxury-charcoal/70">{c.description}</p>
                    )}
                  </LocalizedClientLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
        
        {/* Products grid */}
        <motion.div variants={itemVariants}>
          <Suspense
            fallback={
              <SkeletonProductGrid
                numberOfProducts={category.products?.length ?? 8}
              />
            }
          >
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              categoryId={category.id}
              countryCode={countryCode}
            />
          </Suspense>
        </motion.div>
      </div>
    </motion.div>
  )
}
