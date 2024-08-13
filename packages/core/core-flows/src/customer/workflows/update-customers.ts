import {
  AdditionalData,
  CustomerUpdatableFields,
  FilterableCustomerProps,
} from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateCustomersStep } from "../steps"

export type UpdateCustomersWorkflowInput = {
  selector: FilterableCustomerProps
  update: CustomerUpdatableFields
} & AdditionalData

export const updateCustomersWorkflowId = "update-customers"
/**
 * This workflow updates one or more customers.
 */
export const updateCustomersWorkflow = createWorkflow(
  updateCustomersWorkflowId,
  (input: WorkflowData<UpdateCustomersWorkflowInput>) => {
    const updatedCustomers = updateCustomersStep(input)
    const customersUpdated = createHook("customersUpdated", {
      customers: updatedCustomers,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(updatedCustomers, {
      hooks: [customersUpdated],
    })
  }
)
