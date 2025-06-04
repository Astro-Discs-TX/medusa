"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"

// Default Sales Channel ID from the API key data
const DEFAULT_SALES_CHANNEL_ID = "sc_01JWV2CEJQ2EYP763VBP70A1DB";

interface DebugPanelProps {
  region: any
  products: HttpTypes.StoreProduct[]
}

const DebugPanel = ({ region, products }: DebugPanelProps) => {
  const [expanded, setExpanded] = useState(false)
  const [apiStatus, setApiStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Function to test direct API access
  const testDirectApiAccess = async () => {
    setIsLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
      const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 'pk_8547eb5cff3db09e726c53c0760fd671d872cdc5733814ea48e1295ae6455a53'
      
      // Test region endpoint
      const regionResponse = await fetch(`${backendUrl}/store/regions`, {
        headers: {
          'x-publishable-api-key': publishableKey,
        }
      })
      
      const regionData = await regionResponse.json()
      
      // Test products endpoint with default sales channel
      const productsResponse = await fetch(`${backendUrl}/store/products?limit=10&sales_channel_id[]=${DEFAULT_SALES_CHANNEL_ID}`, {
        headers: {
          'x-publishable-api-key': publishableKey,
        }
      })
      
      const productsData = await productsResponse.json()
      
      // Test sales channels endpoint
      const salesChannelsResponse = await fetch(`${backendUrl}/store/sales-channels`, {
        headers: {
          'x-publishable-api-key': publishableKey,
        }
      }).catch(error => ({ status: 'error', error }))
      
      let salesChannelsData = { sales_channels: [] }
      if (salesChannelsResponse.status !== 'error') {
        try {
          salesChannelsData = await salesChannelsResponse.json()
        } catch (e) {
          salesChannelsData = { 
            error: 'Failed to parse sales channels response',
            status: salesChannelsResponse.status
          }
        }
      }
      
      setApiStatus({
        regions: {
          status: regionResponse.status,
          data: regionData,
        },
        products: {
          status: productsResponse.status,
          count: productsData.products?.length || 0,
          data: productsData.products?.map((p: any) => ({
            id: p.id,
            title: p.title,
            handle: p.handle,
            sales_channels: p.sales_channels?.map((sc: any) => sc.id) || []
          }))
        },
        sales_channels: {
          status: salesChannelsResponse.status !== 'error' ? salesChannelsResponse.status : 'error',
          data: salesChannelsData
        },
        config: {
          default_sales_channel_id: DEFAULT_SALES_CHANNEL_ID,
          backend_url: backendUrl,
          publishable_key: publishableKey
        }
      })
    } catch (error) {
      setApiStatus({
        error: error instanceof Error ? error.message : "Unknown error occurred"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-md max-h-[80vh] overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">Debug Panel</h3>
        <div className="flex gap-2">
          <button 
            onClick={testDirectApiAccess} 
            className="text-sm px-2 py-1 bg-green-500 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? "Testing..." : "Test API"}
          </button>
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-sm px-2 py-1 bg-blue-500 text-white rounded"
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Region:</h4>
        {region ? (
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify({
              id: region.id,
              name: region.name,
              currency: region.currency_code
            }, null, 2)}
          </pre>
        ) : (
          <p className="text-red-500">No region found</p>
        )}
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Sales Channel:</h4>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify({
            default_sales_channel_id: DEFAULT_SALES_CHANNEL_ID
          }, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold">Products Status:</h4>
        <div className="text-sm">
          <p>Count: <span className={products?.length ? "text-green-600 font-bold" : "text-red-500 font-bold"}>{products?.length || 0}</span></p>
        </div>
      </div>

      {apiStatus && (
        <div className="mb-4 border-t pt-2">
          <h4 className="font-semibold">API Test Results:</h4>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(apiStatus, null, 2)}
          </pre>
        </div>
      )}

      {expanded && (
        <div>
          <h4 className="font-semibold">Products ({products?.length || 0}):</h4>
          {products && products.length > 0 ? (
            <div className="space-y-2">
              {products.map(product => (
                <div key={product.id} className="border border-gray-200 p-2 rounded">
                  <p className="font-medium">{product.title}</p>
                  <p className="text-xs text-gray-500">ID: {product.id}</p>
                  {product.sales_channels && (
                    <p className="text-xs text-blue-500">
                      Sales Channels: {product.sales_channels.map((sc: any) => sc.id).join(', ')}
                    </p>
                  )}
                  {product.variants && (
                    <div className="mt-1">
                      <p className="text-xs font-medium">Variants: {product.variants.length}</p>
                      <ul className="text-xs pl-2">
                        {product.variants.map(variant => (
                          <li key={variant.id}>
                            {variant.title} 
                            {variant.prices && variant.prices.length > 0 && (
                              <span className="text-green-600">
                                {" - "}
                                {variant.prices[0].currency_code.toUpperCase()}{" "}
                                {(variant.prices[0].amount / 100).toFixed(2)}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-500">No products found</p>
          )}
        </div>
      )}
    </div>
  )
}

export default DebugPanel 