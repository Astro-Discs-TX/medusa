import {
  CartDTO,
  FindConfig,
  ICartModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the cart to retrieve.
 */
export interface RetrieveCartStepInput {
  /**
   * The ID of the cart to retrieve.
   */
  id: string
  config?: FindConfig<CartDTO>
}

export const retrieveCartStepId = "retrieve-cart"
/**
 * This step retrieves a cart's details.
 */
export const retrieveCartStep = createStep(
  retrieveCartStepId,
  async (data: RetrieveCartStepInput, { container }) => {
    const cartModuleService = container.resolve<ICartModuleService>(
      Modules.CART
    )

    const cart = await cartModuleService.retrieveCart(data.id, data.config)

    return new StepResponse(cart)
  }
)
