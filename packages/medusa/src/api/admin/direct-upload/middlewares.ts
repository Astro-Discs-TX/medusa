import type { MiddlewareRoute } from "@medusajs/framework/http"
import { validateAndTransformBody } from "@medusajs/framework"
import { AdminDirectUploadRequestPayload } from "./validators"

export const adminDirectUploadSignatureMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/admin/direct-upload",
    middlewares: [validateAndTransformBody(AdminDirectUploadRequestPayload)],
  },
]
