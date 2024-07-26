import { useTranslation } from "react-i18next"
import { AdminOrder, AdminOrderLineItem, AdminReturn } from "@medusajs/types"
import {
  Alert,
  Button,
  IconButton,
  Input,
  Switch,
  Text,
  toast,
} from "@medusajs/ui"
import React, { useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrrowRight, Heart } from "@medusajs/icons"
import * as zod from "zod"

import { Thumbnail } from "../../../../../components/common/thumbnail"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { useStockLocation } from "../../../../../hooks/api"
import { ReceiveReturnSchema } from "./constants"
import { Form } from "../../../../../components/common/form"
import { getStylizedAmount } from "../../../../../lib/money-amount-helpers"
import { useUpdateReceiveItem } from "../../../../../hooks/api/returns.tsx"

type OrderAllocateItemsFormProps = {
  order: AdminOrder
  preview: AdminOrder
  orderReturn: AdminReturn
}

export function OrderReceiveReturnForm({
  order,
  preview,
  orderReturn,
}: OrderAllocateItemsFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const { mutateAsync: updateReceiveItem } = useUpdateReceiveItem(
    orderReturn.id,
    order.id
  )

  const { stock_location } = useStockLocation(
    orderReturn.location_id,
    undefined,
    {
      enabled: !!orderReturn.location_id,
    }
  )

  const itemsMap = useMemo(() => {
    const ret = {}
    order.items.forEach((i) => (ret[i.id] = i))
    return ret
  }, [order.items])

  const form = useForm<zod.infer<typeof ReceiveReturnSchema>>({
    defaultValues: {
      items: preview.items?.map((i) => ({
        item_id: i.id,
        quantity: i.detail.return_received_quantity,
      })),
      send_notification: false,
    },
    resolver: zodResolver(ReceiveReturnSchema),
  })

  /**
   * HANDLERS
   */

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      handleSuccess(`/orders/${order.id}`)

      toast.success(t("general.success"), {
        description: t("orders.returns.receive.toast.success"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  })

  const handleQuantityChange = async (itemId: string, value: number | null) => {
    const action = preview.items
      ?.find((i) => i.id === itemId)
      ?.actions.find((a) => a.action === "RECEIVE_RETURN_ITEM")

    if (action) {
      try {
        await updateReceiveItem({ actionId: action.id, quantity: value })
      } catch (e) {
        toast.error(e.message)
      }
    }
  }

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-hidden px-6 py-4"
      >
        <div className="flex justify-between">
          <div>
            {stock_location && (
              <div className="flex items-center gap-2">
                <ArrrowRight className="text-ui-fg-subtle" />{" "}
                <span className="text-ui-fg-base txt-small font-medium">
                  {stock_location.name}
                </span>
              </div>
            )}
          </div>
          <span className="text-ui-fg-muted txt-small text-right">
            {t("orders.returns.receive.itemsLabel")}
          </span>
        </div>
        {preview.items.map((item, ind) => {
          const originalItem = itemsMap[item.id]
          return (
            <div
              key={item.id}
              className="bg-ui-bg-subtle shadow-elevation-card-rest mt-2 rounded-xl"
            >
              <div className="flex flex-col items-center gap-x-2 gap-y-2 p-3 text-sm md:flex-row">
                <div className="flex flex-1 items-center gap-x-3">
                  <Text size="small" className="text-ui-fg-subtle">
                    {item.quantity}x
                  </Text>

                  <Thumbnail src={item.thumbnail} />
                  <div className="flex flex-col">
                    <div>
                      <Text className="txt-small" as="span" weight="plus">
                        {item.title}{" "}
                      </Text>
                      {originalItem.variant.sku && (
                        <span>({originalItem.variant.sku})</span>
                      )}
                    </div>
                    <Text as="div" className="text-ui-fg-subtle txt-small">
                      {originalItem.variant.product.title}
                    </Text>
                  </div>
                </div>

                <div className="flex flex-1 flex-row items-center gap-2">
                  <IconButton disabled type="button">
                    <Heart />
                  </IconButton>
                  <Form.Field
                    control={form.control}
                    name={`items.${ind}.quantity`}
                    render={({ field: { onChange, value, ...field } }) => {
                      return (
                        <Form.Item className="w-full">
                          <Form.Control>
                            <Input
                              min={0}
                              max={item.quantity}
                              type="number"
                              value={value}
                              className="bg-ui-bg-field-component text-right"
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? null
                                    : parseFloat(e.target.value)

                                onChange(value)

                                handleQuantityChange(item.id, value)
                              }}
                              {...field}
                            />
                          </Form.Control>
                        </Form.Item>
                      )
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}

        {/*TOTALS*/}

        <div className="my-6 border-b border-t border-dashed py-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="txt-small text-ui-fg-subtle">
              {t("fields.total")}
            </span>
            <span className="txt-small text-ui-fg-subtle">
              {getStylizedAmount(preview.total, order.currency_code)}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-dotted pt-4">
            <span className="txt-small font-medium">
              {t("orders.returns.outstandingAmount")}
            </span>
            <span className="txt-small font-medium">
              {getStylizedAmount(
                preview.summary.difference_sum || 0,
                order.currency_code
              )}
            </span>
          </div>
        </div>

        <Alert className="rounded-xl" variant="warning">
          {t("orders.returns.receive.inventoryWarning")}
        </Alert>

        <div className="bg-ui-bg-subtle shadow-elevation-card-rest my-2 rounded-xl p-3">
          <Form.Field
            control={form.control}
            name="send_notification"
            render={({ field: { onChange, value, ...field } }) => {
              return (
                <Form.Item>
                  <div className="flex items-center gap-3">
                    <Form.Control>
                      <Switch
                        className="mt-1 self-start"
                        checked={!!value}
                        onCheckedChange={onChange}
                        {...field}
                      />
                    </Form.Control>
                    <div className="flex flex-col">
                      <Form.Label>
                        {t("orders.returns.sendNotification")}
                      </Form.Label>
                      <Form.Hint className="!mt-1">
                        {t("orders.returns.receive.sendNotificationHint")}
                      </Form.Hint>
                    </div>
                  </div>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </div>
      </form>
      <RouteDrawer.Footer className="overflow-hidden">
        <div className="flex items-center gap-x-2">
          <RouteDrawer.Close asChild>
            <Button size="small" variant="secondary">
              {t("actions.cancel")}
            </Button>
          </RouteDrawer.Close>
          <Button size="small" type="submit" isLoading={false}>
            {t("actions.save")}
          </Button>
        </div>
      </RouteDrawer.Footer>
    </RouteDrawer.Form>
  )
}
