import { CSVNormalizer, productValidators } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { convertCsvToJson } from "../utlils"
import { GroupProductsForBatchStepOutput } from "./group-products-for-batch"

/**
 * The CSV file content to parse.
 */
export type NormalizeProductCsvStepInput = string

export const normalizeCsvStepId = "normalize-product-csv"
/**
 * This step parses a CSV file holding products to import, returning the products as
 * objects that can be imported.
 *
 * @example
 * const data = parseProductCsvStep("products.csv")
 */
export const normalizeCsvStep = createStep(
  normalizeCsvStepId,
  async (fileContent: NormalizeProductCsvStepInput, { container }) => {
    const csvProducts =
      convertCsvToJson<ConstructorParameters<typeof CSVNormalizer>[0][0]>(
        fileContent
      )
    const normalizer = new CSVNormalizer(csvProducts)
    const products = normalizer.proccess()

    try {
      const create = Object.keys(products.toCreate).reduce<
        (typeof products)["toCreate"][keyof (typeof products)["toCreate"]][]
      >((result, toCreateHandle) => {
        result.push(
          productValidators.CreateProduct.parse(
            products.toCreate[toCreateHandle]
          )
        )
        return result
      }, [])

      const update = Object.keys(products.toUpdate).reduce<
        (typeof products)["toUpdate"][keyof (typeof products)["toUpdate"]][]
      >((result, toCreateId) => {
        result.push(
          productValidators.UpdateProduct.parse(products.toUpdate[toCreateId])
        )
        return result
      }, [])

      return new StepResponse({
        create,
        update,
      } as GroupProductsForBatchStepOutput)
    } catch (error) {
      console.log("step error", error)
      throw error
    }
  }
)
