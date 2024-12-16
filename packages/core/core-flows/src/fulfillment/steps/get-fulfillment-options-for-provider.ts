import { Modules, promiseAll } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const getFulfillmentOptionsForProviderStepId =
  "get-fulfillment-options-for-provider"

/**
 * This step retrieves fulfillment options for a given provider.
 */
export const getFulfillmentOptionsForProviderStep = createStep(
  getFulfillmentOptionsForProviderStepId,
  async (providerIds: string[], { container }) => {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

    const fulfillementOptionsPerProvider = await promiseAll(
      providerIds.map(async (providerId) => {
        return {
          provider_id: providerId,
          options: await fulfillmentModuleService.retrieveFulfillmentOptions(
            providerId
          ),
        }
      })
    )

    return new StepResponse(fulfillementOptionsPerProvider)
  }
)
