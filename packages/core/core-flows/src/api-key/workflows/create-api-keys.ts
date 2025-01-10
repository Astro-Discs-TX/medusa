import { ApiKeyDTO, CreateApiKeyDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createApiKeysStep } from "../steps"

export type CreateApiKeysWorkflowInput = { api_keys: CreateApiKeyDTO[] }

export const createApiKeysWorkflowId = "create-api-keys"
/**
 * This workflow creates one or more API keys.
 */
export const createApiKeysWorkflow = createWorkflow(
  createApiKeysWorkflowId,
  (
    input: WorkflowData<CreateApiKeysWorkflowInput>
  ): WorkflowResponse<ApiKeyDTO[]> => {
    const apiKeys = createApiKeysStep(input)

    const apiKeysCreated = createHook("apiKeysCreated", {
      apiKeys,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(apiKeys, {
      hooks: [apiKeysCreated],
    })
  }
)