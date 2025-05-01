import { z } from "zod"

export const AdminDirectUploadRequestPayload = z.object({
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
})
export type AdminDirectUploadRequestPayloadType = z.infer<
  typeof AdminDirectUploadRequestPayload
>
