import { ProductCategoryWorkflow } from "@medusajs/framework/types"
import { ProductCategoryWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  createHook,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { createProductCategoriesStep } from "../steps"

export const createProductCategoriesWorkflowId = "create-product-categories"
/**
 * This workflow creates one or more product categories.
 */
export const createProductCategoriesWorkflow = createWorkflow(
  createProductCategoriesWorkflowId,
  (
    input: WorkflowData<ProductCategoryWorkflow.CreateProductCategoriesWorkflowInput>
  ) => {
    const createdProductCategories = createProductCategoriesStep(input)

    const response = transform({ createdProductCategories, input }, (data) => {
      return data.createdProductCategories
    })

    const productCategoriesCreated = createHook("productCategoriesCreated", {
      products: response,
      additional_data: input.additional_data,
    })

    const productCategoryIdEvents = transform(
      { productCategoriesCreated },
      ({ createdProducts }) => {
        return createdProducts.map((v) => {
          return { id: v.id }
        })
      }
    )

    emitEventStep({
      eventName: ProductCategoryWorkflowEvents.CREATED,
      data: productCategoryIdEvents,
    })

    return new WorkflowResponse(response, {
      hooks: [productCategoriesCreated],
    })
  }
)
