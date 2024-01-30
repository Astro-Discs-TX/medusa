import { isString } from "@medusajs/utils"

export default async function (moduleKeyName, baseUrl, serverOptions, logger) {
  let grpc
  let protoLoader
  try {
    grpc = await import("@grpc/grpc-js")
    protoLoader = await import("@grpc/proto-loader")
  } catch (err) {
    throw new Error(
      "@grpc/grpc-js and @grpc/proto-loader are not installed. Please install them to serve MedusaApp as a web gRPC server."
    )
  }

  const PROTO_PATH = __dirname + "/../../../utils/servers/medusa-app.proto"
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  })
  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition)
  const medusaAppService = protoDescriptor.medusaAppService as any

  const client = new medusaAppService.MedusaAppService(
    baseUrl,
    grpc.credentials.createInsecure()
  )

  return new Proxy(
    {},
    {
      get(target, methodName) {
        if (["then", "catch", "finally"].includes(methodName as string)) {
          return target
        } else if (methodName in target) {
          return target[methodName]
        }

        return async (...args) => {
          const request = {
            module: moduleKeyName,
            method: methodName,
            args: JSON.stringify(args),
          }

          return new Promise((resolve, reject) => {
            client.Call(request, (error, response) => {
              if (error) {
                reject(error)
                return
              }

              try {
                const resp = response.result
                const result = isString(resp) ? JSON.parse(resp) : resp
                resolve(result)
              } catch (parseError) {
                reject(parseError)
              }
            })
          })
        }
      },
    }
  )
}
