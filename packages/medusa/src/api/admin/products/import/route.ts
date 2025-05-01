import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import type { HttpTypes } from "@medusajs/framework/types"
import { importProductsWorkflow } from "@medusajs/core-flows"
import type { AdminImportProductsType } from "../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminImportProductsType>,
  res: MedusaResponse<HttpTypes.AdminImportProductResponse>
) => {
  const fileProvider = req.scope.resolve("file")
  const file = await fileProvider.getAsBuffer(req.body.filename)

  const { result, transaction } = await importProductsWorkflow(req.scope).run({
    input: {
      filename: req.body.originalname,
      fileContent: file.toString("utf-8"),
    },
  })

  res
    .status(202)
    .json({ transaction_id: transaction.transactionId, summary: result })
}
