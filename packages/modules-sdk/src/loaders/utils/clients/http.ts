import { ExternalModuleDeclaration, Logger } from "@medusajs/types"

const openedClients = new Map<string, any>()

async function getHttpClient(baseUrl, serverOptions?: Record<string, unknown>) {
  if (openedClients.has(baseUrl)) {
    return openedClients.get(baseUrl)
  }

  const { Client } = await import("undici")

  let keepAliveAgent
  if (serverOptions?.keepAlive) {
    keepAliveAgent = {
      keepAliveTimeout: serverOptions.keepAliveTimeout ?? 1000 * 60 * 3, // 3 minutes
    }
  }

  const client = new Client(baseUrl, keepAliveAgent)

  openedClients.set(baseUrl, client)

  return client
}

export default async function (
  moduleKeyName: string,
  baseUrl: string,
  server: ExternalModuleDeclaration["server"],
  logger: Logger
) {
  const client = await getHttpClient(baseUrl, server?.options)

  return new Proxy(
    {},
    {
      get(target, methodName: string) {
        if (["then", "catch", "finally"].includes(methodName)) {
          return target
        } else if (methodName in target) {
          return target[methodName]
        }

        return async (...args) => {
          const path = `/modules/${moduleKeyName}/${methodName}`

          try {
            const { statusCode, body } = await client.request({
              path,
              method: "POST",
              headers: {
                "content-type": "application/json",
                connection: "keep-alive",
              },
              body: JSON.stringify(args), // arguments as an array
            })

            let responseData = ""
            for await (const data of body) {
              responseData += data.toString()
            }

            if (statusCode < 200 || statusCode >= 300) {
              throw new Error(responseData)
            }

            return JSON.parse(responseData)
          } catch (error) {
            throw error
          }
        }
      },
    }
  )
}
