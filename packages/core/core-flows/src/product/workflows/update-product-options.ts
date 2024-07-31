import { ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateProductOptionsStep } from "../steps"

type UpdateProductOptionsStepInput = {
  selector: ProductTypes.FilterableProductOptionProps
  update: ProductTypes.UpdateProductOptionDTO
}

type WorkflowInput = UpdateProductOptionsStepInput

export const updateProductOptionsWorkflowId = "update-product-options"
export const updateProductOptionsWorkflow = createWorkflow(
  updateProductOptionsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<ProductTypes.ProductOptionDTO[]> => {
    return new WorkflowResponse(updateProductOptionsStep(input))
  }
)
