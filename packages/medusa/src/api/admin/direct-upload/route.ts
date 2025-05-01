import { ulid } from "ulid"
import { MIMEType } from "util"
import type {
  MedusaResponse,
  AuthenticatedMedusaRequest,
} from "@medusajs/framework/http"
import type { HttpTypes } from "@medusajs/framework/types"
import type { AdminDirectUploadRequestPayloadType } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminDirectUploadRequestPayloadType>,
  res: MedusaResponse<HttpTypes.AdminDirectUploadSignatureResponse>
) => {
  const fileProvider = req.scope.resolve("file")
  const { filename: originalname, mimeType, size } = req.body

  const type = new MIMEType(mimeType)
  const extension = type.subtype
  const uniqueFilename = `${ulid()}.${extension}`

  const response = await fileProvider.getUploadFileUrls({
    filename: uniqueFilename,
    mimeType: mimeType,
    access: "private",
  })

  res.json({
    url: response.url,
    filename: response.key,
    mimeType: type.toString(),
    size,
    extension,
    originalname,
  })
}
