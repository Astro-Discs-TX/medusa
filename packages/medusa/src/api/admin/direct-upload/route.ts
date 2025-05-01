import { ulid } from "ulid"
import { MIMEType } from "util"
import type {
  MedusaResponse,
  AuthenticatedMedusaRequest,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import type { HttpTypes } from "@medusajs/framework/types"
import type { AdminDirectUploadRequestPayloadType } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminDirectUploadRequestPayloadType>,
  res: MedusaResponse<HttpTypes.AdminDirectUploadSignatureResponse>
) => {
  const fileProvider = req.scope.resolve(Modules.FILE)
  const type = new MIMEType(req.validatedBody.mime_type)
  const extension = type.subtype
  const uniqueFilename = `${ulid()}.${extension}`

  const response = await fileProvider.getUploadFileUrls({
    filename: uniqueFilename,
    mimeType: req.validatedBody.mime_type,
    access: "private",
  })

  res.json({
    url: response.url,
    filename: response.key,
    mimeType: type.toString(),
    size: req.validatedBody.size,
    extension,
    originalname: req.validatedBody.originalname,
  })
}
