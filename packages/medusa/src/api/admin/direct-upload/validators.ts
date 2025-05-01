import { z } from "zod"

export const AdminDirectUploadRequestPayload = z.object({
  originalname: z.string(),
  mime_type: z.string(),
  size: z.number(),
})
export type AdminDirectUploadRequestPayloadType = z.infer<
  typeof AdminDirectUploadRequestPayload
>
