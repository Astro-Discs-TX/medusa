import { AdditionalData, ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateProductTagsStep } from "../steps"

type UpdateProductTagsStepInput = {
  selector: ProductTypes.FilterableProductTypeProps
  update: ProductTypes.UpdateProductTypeDTO
} & AdditionalData

type WorkflowInput = UpdateProductTagsStepInput

export const updateProductTagsWorkflowId = "update-product-tags"
export const updateProductTagsWorkflow = createWorkflow(
  updateProductTagsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const updatedProductTags = updateProductTagsStep(input)
    const productTagsUpdated = createHook("productTagsUpdated", {
      product_tags: updatedProductTags,
      additional_data: input.additional_data,
    })
    return new WorkflowResponse(updatedProductTags, {
      hooks: [productTagsUpdated],
    })
  }
)
