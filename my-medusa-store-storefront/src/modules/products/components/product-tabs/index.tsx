"use client"

import { HttpTypes } from "@medusajs/types"
import { motion, AnimatePresence } from "framer-motion"
import { Text, Heading } from "@medusajs/ui"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
  activeTab: string
  setActiveTab: (tab: string) => void
}

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
    }
  }
}

const ProductTabs = ({ product, activeTab, setActiveTab }: ProductTabsProps) => {
  const tabs = [
    { id: "description", label: "Description" },
    { id: "details", label: "Details" },
    { id: "dimensions", label: "Dimensions" },
    { id: "shipping", label: "Shipping" },
  ]

  return (
    <div>
      <div className="flex border-b border-ui-border-base mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`relative px-6 py-3 text-sm font-medium ${
              activeTab === tab.id
                ? "text-ui-fg-base"
                : "text-ui-fg-subtle hover:text-ui-fg-base"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                layoutId="activeTab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[200px]">
        <AnimatePresence mode="wait">
          {activeTab === "description" && (
            <motion.div
              key="description"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Text className="text-ui-fg-base">
                {product.description}
              </Text>
            </motion.div>
          )}

          {activeTab === "details" && (
            <motion.div
              key="details"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Heading level="h3" className="text-lg mb-3">Materials</Heading>
                  <ul className="list-disc pl-5 space-y-2 text-ui-fg-subtle">
                    <li>Premium quality marble</li>
                    <li>Natural stone with unique veining</li>
                    <li>Non-toxic sealant finish</li>
                    {product.type?.value && <li>{product.type.value}</li>}
                  </ul>
                </div>
                <div>
                  <Heading level="h3" className="text-lg mb-3">Features</Heading>
                  <ul className="list-disc pl-5 space-y-2 text-ui-fg-subtle">
                    <li>Handcrafted by master artisans</li>
                    <li>One-of-a-kind piece</li>
                    <li>Durable and long-lasting</li>
                    <li>Easy to clean and maintain</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "dimensions" && (
            <motion.div
              key="dimensions"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Heading level="h3" className="text-lg mb-3">Product Dimensions</Heading>
                  <div className="space-y-2 text-ui-fg-subtle">
                    <p><strong>Height:</strong> {product.height || "Variable"} cm</p>
                    <p><strong>Width:</strong> {product.width || "Variable"} cm</p>
                    <p><strong>Length:</strong> {product.length || "Variable"} cm</p>
                    <p><strong>Weight:</strong> {product.weight || "Variable"} kg</p>
                  </div>
                </div>
                <div>
                  <Heading level="h3" className="text-lg mb-3">Packaging</Heading>
                  <div className="space-y-2 text-ui-fg-subtle">
                    <p>Each piece is carefully packaged in custom protective materials to ensure safe delivery.</p>
                    <p>Includes certificate of authenticity and care instructions.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "shipping" && (
            <motion.div
              key="shipping"
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="space-y-4 text-ui-fg-subtle">
                <p>All our marble pieces are carefully packaged and shipped with insurance.</p>
                <p>Standard shipping: 5-7 business days</p>
                <p>Express shipping: 2-3 business days</p>
                <p>International shipping available to select countries.</p>
                <p>For custom shipping arrangements or questions, please contact our customer service team.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProductTabs
