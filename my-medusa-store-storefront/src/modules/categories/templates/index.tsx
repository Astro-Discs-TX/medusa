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

  // Animation variants for staggered children with elegant transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
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
        {/* Enhanced breadcrumb navigation with elegant styling */}
        <motion.div 
          className="flex flex-row mb-8 items-center gap-2 flex-wrap"
          variants={itemVariants}
        >
          {parents.length > 0 && (
            <div className="flex items-center text-luxury-charcoal/70 text-base-regular">
              <LocalizedClientLink
                className="hover:text-luxury-gold transition-colors duration-300 inline-flex items-center"
                href="/categories"
              >
                <motion.span 
                  whileHover={{ x: -2 }} 
                  transition={{ duration: 0.2 }}
                >
                  Categories
                </motion.span>
              </LocalizedClientLink>
              <span className="mx-2 text-luxury-gold/40">/</span>
            </div>
          )}
          
          {parents &&
            parents.map((parent) => (
              <div key={parent.id} className="flex items-center text-luxury-charcoal/70">
                <LocalizedClientLink
                  className="hover:text-luxury-gold transition-colors duration-300 inline-flex items-center"
                  href={`/categories/${parent.handle}`}
                  data-testid="sort-by-link"
                >
                  <motion.span 
                    whileHover={{ x: -2 }} 
                    transition={{ duration: 0.2 }}
                  >
                    {parent.name}
                  </motion.span>
                </LocalizedClientLink>
                <span className="mx-2 text-luxury-gold/40">/</span>
              </div>
            ))}
          
          <motion.h1 
            className="font-display text-2xl text-luxury-charcoal relative inline-flex"
            data-testid="category-page-title"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {category.name}
            <motion.span 
              className="absolute -bottom-1 left-0 right-0 h-[1px] bg-luxury-gold/30"
              initial={{ scaleX: 0, transformOrigin: "left" }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.h1>
        </motion.div>
        
        {/* Category description with refined styling */}
        {category.description && (
          <motion.div 
            className="mb-10 text-base-regular text-luxury-charcoal/80 max-w-2xl"
            variants={itemVariants}
          >
            <p className="leading-relaxed">{category.description}</p>
          </motion.div>
        )}
        
        {/* Child categories with luxury hover effects and transitions */}
        {category.category_children && category.category_children.length > 0 && (
          <motion.div 
            className="mb-14 text-base-large"
            variants={itemVariants}
          >
            <h2 className="font-display text-xl mb-5 text-luxury-charcoal flex items-center">
              <span>Browse Subcategories</span>
              <span className="ml-3 h-px flex-grow bg-luxury-gold/20"></span>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {category.category_children?.map((c, index) => (
                <motion.li 
                  key={c.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.2 + (index * 0.1), 
                    ease: [0.22, 1, 0.36, 1]
                  }}
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.02, 
                      y: -3, 
                      boxShadow: "0 4px 20px rgba(0,0,0,0.06), 0 2px 8px rgba(212,175,55,0.08)" 
                    }}
                    transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <LocalizedClientLink 
                      href={`/categories/${c.handle}`}
                      className="block p-5 border border-luxury-gold/10 rounded-md bg-luxury-ivory hover:border-luxury-gold/30 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-luxury-gold font-display">{c.name}</span>
                        <motion.span 
                          className="text-luxury-gold/60"
                          initial={{ x: 0, opacity: 0.6 }}
                          whileHover={{ x: 3, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          →
                        </motion.span>
                      </div>
                      {c.description && (
                        <p className="mt-2 text-sm text-luxury-charcoal/70 leading-relaxed">{c.description}</p>
                      )}
                    </LocalizedClientLink>
                  </motion.div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
        
        {/* Products grid with refined animation */}
        <motion.div 
          variants={itemVariants}
          className="relative"
        >
          <motion.div 
            className="absolute -top-3 left-0 right-0 h-px bg-luxury-gold/10"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
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
