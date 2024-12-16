import { Modules, promiseAll } from "@medusajs/framework/utils"
import {
  CartDTO,
  IFulfillmentModuleService,
  StockLocationAddressDTO,
} from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"

export interface ValidateShippingMethodsDataInput {
  context: CartDTO & Record<string, unknown>
  options_to_validate: {
    id: string
    provider_id: string
    option_data: Record<string, unknown>
    method_data: Record<string, unknown>
    from_location: StockLocationAddressDTO
  }[]
}

export const validateAndReturnShippingMethodsDataStepId =
  "validate-and-return-shipping-methods-data"
/**
 * This step validates shipping options to ensure they can be applied on a cart.
 */
export const validateAndReturnShippingMethodsDataStep = createStep(
  validateAndReturnShippingMethodsDataStepId,
  async (data: ValidateShippingMethodsDataInput, { container }) => {
    const { options_to_validate = [] } = data

    if (!options_to_validate.length) {
      return new StepResponse(void 0)
    }

    const fulfillmentModule = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
    )

    const validatedData = await promiseAll(
      options_to_validate.map(async (option) => {
        const validated = await fulfillmentModule.validateFulfillmentData(
          option.provider_id,
          option.option_data,
          option.method_data,
          { ...data.context, from_location: option.from_location }
        )

        return {
          [option.id]: validated,
        }
      })
    )

    return new StepResponse(validatedData)
  }
)
