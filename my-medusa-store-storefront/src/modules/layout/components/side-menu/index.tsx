"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment, useState, useEffect } from "react"
import { motion } from "framer-motion"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"
import { listCategories } from "@lib/data/categories"

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Collections", href: "/collections" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
]

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()
  const [categories, setCategories] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await listCategories()
        setCategories(categoriesData || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    
    fetchData()
  }, [])
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none text-luxury-charcoal hover:text-luxury-gold group"
                >
                  <span className="flex items-center text-sm font-medium tracking-wide">
                    <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                    Menu
                  </span>
                  <span className="absolute -bottom-px left-0 w-0 h-0.5 bg-luxury-gold group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </Popover.Button>
              </div>

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100 backdrop-blur-xl"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 backdrop-blur-xl"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-2/3 lg:w-1/2 2xl:w-1/3 h-[calc(100vh-1rem)] z-30 inset-x-0 text-sm m-2">
                  <motion.div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-luxury-ivory/98 backdrop-blur-lg rounded-md border border-luxury-gold/10 shadow-xl justify-between p-6 sm:p-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex justify-between items-center border-b border-luxury-gold/10 pb-4">
                      <h2 className="font-display text-xl text-luxury-gold">MARBLE LUXE</h2>
                      <button 
                        data-testid="close-menu-button" 
                        onClick={close}
                        className="p-2 text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300"
                      >
                        <XMark />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto py-6">
                      {/* Main navigation */}
                      <motion.ul 
                        className="flex flex-col gap-5 mb-10"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {menuItems.map((item) => (
                          <motion.li key={item.name} variants={itemVariants}>
                            <LocalizedClientLink
                              href={item.href}
                              className="text-lg font-medium text-luxury-charcoal hover:text-luxury-gold transition-colors duration-300 flex items-center justify-between group"
                              onClick={close}
                              data-testid={`${item.name.toLowerCase()}-link`}
                            >
                              <span>{item.name}</span>
                              <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </LocalizedClientLink>
                          </motion.li>
                        ))}
                      </motion.ul>
                      
                      {/* Categories section */}
                      {categories && categories.length > 0 && (
                        <div className="pt-6 border-t border-luxury-gold/10">
                          <h3 className="text-sm font-medium uppercase tracking-wide text-luxury-charcoal/70 mb-4">Categories</h3>
                          <ul className="flex flex-col gap-3">
                            {categories?.filter(c => !c.parent_category).slice(0, 6).map((category) => (
                              <li key={category.id}>
                                <button
                                  className={`text-left w-full text-sm hover:text-luxury-gold transition-colors duration-300 flex items-center justify-between ${
                                    activeCategory === category.id ? 'text-luxury-gold' : 'text-luxury-charcoal/90'
                                  }`}
                                  onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                                >
                                  <span>{category.name}</span>
                                  {category.category_children?.length > 0 && (
                                    <svg 
                                      className={`w-3 h-3 transition-transform duration-300 ${activeCategory === category.id ? 'rotate-90' : ''}`} 
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24" 
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                  )}
                                </button>
                                
                                {/* Subcategories */}
                                {activeCategory === category.id && category.category_children?.length > 0 && (
                                  <motion.ul 
                                    className="ml-4 mt-2 flex flex-col gap-2"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {category.category_children.map((child: any) => (
                                      <motion.li 
                                        key={child.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <LocalizedClientLink
                                          href={`/categories/${child.handle}`}
                                          className="text-xs text-luxury-charcoal/70 hover:text-luxury-gold transition-colors duration-300"
                                          onClick={close}
                                        >
                                          {child.name}
                                        </LocalizedClientLink>
                                      </motion.li>
                                    ))}
                                  </motion.ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-y-6 pt-4 border-t border-luxury-gold/10">
                      <div
                        className="flex justify-between items-center"
                        onMouseEnter={toggleState.open}
                        onMouseLeave={toggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={toggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-300 text-luxury-gold",
                            toggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="flex justify-between text-luxury-charcoal/60 text-xs">
                        © {new Date().getFullYear()} Marble Luxe. All rights reserved.
                      </Text>
                    </div>
                  </motion.div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
