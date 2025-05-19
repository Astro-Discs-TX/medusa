import { Modules } from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"
import { batchProductsWorkflow } from "../workflows/batch-products"

export const processImportChunksStepId = "process-import-chunks"

/**
 * This step parses a CSV file holding products to import, returning the products as
 * objects that can be imported.
 *
 * @example
 * const data = parseProductCsvStep("products.csv")
 */
export const processImportChunksStep = createStep(
  processImportChunksStepId,
  async (input: { chunks: string[] }, { container }) => {
    const file = container.resolve(Modules.FILE)

    await Promise.all(
      input.chunks.map(async (chunk) => {
        const contents = await file.getAsBuffer(chunk)
        console.log(`processing chunk ${chunk}`)

        batchProductsWorkflow
          .runAsStep({ input: JSON.parse(contents.toString("utf-8")) })
          .config({ async: true, backgroundExecution: true })
      })
    )
  }
)
