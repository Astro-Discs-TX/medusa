import {
  CreateOrderChangeActionDTO,
  OrderChangeActionDTO,
} from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createOrderChangeActionsStep } from "../steps"

export const createOrderChangeActionsWorkflowId = "create-order-change-actions"
/**
 * This workflow creates order change actions.
 */
export const createOrderChangeActionsWorkflow = createWorkflow(
  createOrderChangeActionsWorkflowId,
  (
    input: WorkflowData<CreateOrderChangeActionDTO[]>
  ): WorkflowResponse<OrderChangeActionDTO[]> => {
    return new WorkflowResponse(createOrderChangeActionsStep(input))
  }
)
