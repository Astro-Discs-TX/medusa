import {
  MedusaResponse,
  AuthenticatedMedusaRequest,
} from "@medusajs/framework/http"
import type { HttpTypes } from "@medusajs/framework/types"
import { importProductsV1Workflow } from "@medusajs/core-flows"
import type { AdminImportProductsType } from "../validators"

/**
 * @version 2.8.0
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminImportProductsType>,
  res: MedusaResponse<HttpTypes.AdminImportProductResponse>
) => {
  const { result, transaction } = await importProductsV1Workflow(req.scope).run(
    {
      input: {
        filename: req.validatedBody.originalname,
        fileKey: req.validatedBody.file_key,
      },
    }
  )

  res
    .status(202)
    .json({ transaction_id: transaction.transactionId, summary: result })
}
