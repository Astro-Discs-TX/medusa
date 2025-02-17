import { FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createShippingProfilesStep } from "../steps"

export const createShippingProfilesWorkflowId =
  "create-shipping-profiles-workflow"
/**
 * This workflow creates one or more shipping profiles.
 */
export const createShippingProfilesWorkflow = createWorkflow(
  createShippingProfilesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CreateShippingProfilesWorkflowInput>
  ): WorkflowResponse<FulfillmentWorkflow.CreateShippingProfilesWorkflowOutput> => {
    const shippingProfiles = createShippingProfilesStep(input.data)

    const shippingProfilesCreated = createHook("shippingProfilesCreated", {
      shippingProfiles,
    })

    return new WorkflowResponse(shippingProfiles, {
      hooks: [shippingProfilesCreated],
    })
  }
)
