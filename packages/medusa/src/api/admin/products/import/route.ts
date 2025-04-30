import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import { importProductsWorkflow } from "@medusajs/core-flows"

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminImportProductRequest>,
  res: MedusaResponse<HttpTypes.AdminImportProductResponse>
) => {
  // const input = req.file as Express.Multer.File

  // if (!input) {
  //   throw new MedusaError(
  //     MedusaError.Types.INVALID_DATA,
  //     "No file was uploaded for importing"
  //   )
  // }

  const fileProvider = req.scope.resolve("file")
  const file = await fileProvider.getAsBuffer(req.body["key"])
  console.log(req.body)

  const { result, transaction } = await importProductsWorkflow(req.scope).run({
    input: {
      filename: req.body!["originalname"],
      fileContent: file.toString("utf-8"),
    },
  })

  res
    .status(202)
    .json({ transaction_id: transaction.transactionId, summary: result })
}
