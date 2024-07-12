import {
  IOrderModuleService,
  OrderChangeDTO,
  OrderDTO,
  ReturnDTO,
} from "@medusajs/types"
import {
  ChangeActionType,
  ModuleRegistrationName
} from "@medusajs/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { createOrderChangeActionsStep } from "../steps/create-order-change-actions"
import {
  throwIfOrderChangeIsNotActive,
  throwIfOrderIsCancelled,
  throwIfReturnIsCancelled,
} from "../utils/order-validation"

const validationStep = createStep(
  "creatae-return-shipping-method",
  async function ({
    order,
    orderChange,
    orderReturn,
  }: {
    order: OrderDTO
    orderReturn: ReturnDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfOrderIsCancelled({ order })
    throwIfReturnIsCancelled({ orderReturn })
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

const createOrderReturnShipping = createStep(
  "create-order-return-shipping",
  async (input: { shippingMethods: any[] }, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const created = await service.createShippingMethods(input.shippingMethods)

    return new StepResponse(
      created,
      created.map((c) => c.id)
    )
  },
  async (createdMethodIds, { container }) => {
    if (!createdMethodIds) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.deleteShippingMethods(createdMethodIds)
  }
)

export const createReturnShippingMethodWorkflowId =
  "create-return-shipping-method"
export const createReturnShippingMethodWorkflow = createWorkflow(
  createReturnShippingMethodWorkflowId,
  function (input: {
    returnId: string
    shippingOptionId: string
  }): WorkflowData {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id"],
      variables: { id: input.returnId },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "currency_code"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const shippingOptions = useRemoteQueryStep({
      entry_point: "shipping_option",
      fields: [
        "id",
        "name",
        "calculated_price.calculated_amount",
        "calculated_price.is_calculated_price_tax_inclusive",
      ],
      variables: {
        id: input.shippingOptionId,
        calculated_price: {
          context: { currency_code: order.currency_code },
        },
      },
    }).config({ name: "fetch-shipping-option" })

    const shippingMethodInput = transform(
      { orderReturn, shippingOptions },
      (data) => {
        const option = data.shippingOptions[0]

        return {
          shipping_option_id: option.id,
          amount: option.calculated_price.calculated_amount,
          is_tax_inclusive:
            !!option.calculated_price.is_calculated_price_tax_inclusive,
          data: option.data ?? {},
          name: option.name,
          order_id: data.orderReturn.order_id,
          return_id: data.orderReturn.id,
        }
      }
    )

    const createdMethods = createOrderReturnShipping({
      shippingMethods: [shippingMethodInput],
    })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status"],
      variables: { order_id: orderReturn.order_id },
      list: false,
    }).config({ name: "order-change-query" })

    validationStep({ order, orderReturn, orderChange })

    const orderChangeActionInput = transform(
      {
        orderId: order.id,
        returnId: orderReturn.id,
        shippingOption: shippingOptions[0],
        methodId: createdMethods[0].id,
      },
      ({ shippingOption, returnId, orderId, methodId }) => {
        const methodPrice = shippingOption.calculated_price.calculated_amount
        
        return {
          action: ChangeActionType.SHIPPING_ADD,
          reference: "order_shipping_method",
          reference_id: methodId,
          amount: methodPrice.bigNumber,
          details: {
            order_id: orderId,
            return_id: returnId,
          },
        }
      }
    )

    return createOrderChangeActionsStep([orderChangeActionInput])
  }
)
