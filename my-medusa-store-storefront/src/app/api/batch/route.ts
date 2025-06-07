import { sdk } from "@lib/config"
import { deduplicateRequest } from "@lib/util/request-cache"
import { NextRequest, NextResponse } from "next/server"

type BatchRequest = {
  path: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  query?: Record<string, any>
  body?: Record<string, any>
  headers?: Record<string, string>
}

/**
 * Handles batch API requests in a single endpoint
 * This reduces the number of HTTP requests made to the Medusa backend
 */
export async function POST(req: NextRequest) {
  try {
    const { requests } = await req.json()

    if (!Array.isArray(requests) || requests.length === 0) {
      return NextResponse.json(
        { error: "Invalid batch request format" },
        { status: 400 }
      )
    }

    // Group requests by URL to deduplicate identical requests within a batch
    const groupedRequests = requests.reduce((acc, request) => {
      const key = `${request.path}:${request.method || 'GET'}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(request)
      return acc
    }, {} as Record<string, BatchRequest[]>)

    // Process each unique request in parallel
    const uniqueResults = await Promise.all(
      (Object.entries(groupedRequests) as [string, BatchRequest[]][]).map(async ([key, requestsGroup]) => {
        // Use the first request as the representative for this group
        const request = requestsGroup[0]
        const { path, method = "GET", query = {}, body = {}, headers = {} } = request

        if (!path) {
          return {
            key,
            result: {
              error: "Missing path in batch request",
              status: 400,
            }
          }
        }

        try {
          // Use request deduplication to avoid multiple identical requests
          const response = await deduplicateRequest(
            path,
            () => sdk.client.fetch(path, {
              method,
              query,
              body: method !== "GET" ? body : undefined,
              headers,
            }),
            method === "GET" ? query : undefined,
            10 * 1000 // 10 seconds TTL for batch requests
          )

          return {
            key,
            result: {
              data: response,
              path,
              status: 200,
            }
          }
        } catch (error: any) {
          console.error(`Batch request error for path ${path}:`, error)
          
          return {
            key,
            result: {
              error: error.message || "Unknown error",
              path,
              status: error.status || 500,
            }
          }
        }
      })
    )

    // Map results back to original request order
    const results = requests.map(request => {
      const key = `${request.path}:${request.method || 'GET'}`
      const resultEntry = uniqueResults.find(r => r.key === key)
      return resultEntry?.result
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error("Batch API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 