import { Modules } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { CartCreditLineDTO } from "@medusajs/types"
import { createEntitiesStep } from "../../common/steps/create-entities"

export const createCartCreditLinesWorkflowId = "create-cart-credit-lines"
export const createCartCreditLinesWorkflow = createWorkflow(
  createCartCreditLinesWorkflowId,
  (
    input: WorkflowData<CartCreditLineDTO[]>
  ): WorkflowResponse<CartCreditLineDTO[]> => {
    const creditLines = createEntitiesStep({
      moduleRegistrationName: Modules.CART,
      invokeMethod: "createCreditLines",
      compensateMethod: "deleteCreditLines",
      data: input,
    })

    return new WorkflowResponse(creditLines)
  }
)
