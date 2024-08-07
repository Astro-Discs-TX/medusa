import { AdminPaymentCollection } from "../payment/admin"
import {
  BaseOrder,
  BaseOrderAddress,
  BaseOrderChange,
  BaseOrderChangeAction,
  BaseOrderFilters,
  BaseOrderLineItem,
  BaseOrderShippingMethod,
} from "./common"

export interface AdminOrder extends BaseOrder {
  payment_collections: AdminPaymentCollection[]
}

export interface AdminOrderLineItem extends BaseOrderLineItem {}
export interface AdminOrderFilters extends BaseOrderFilters {}
export interface AdminOrderAddress extends BaseOrderAddress {}
export interface AdminOrderShippingMethod extends BaseOrderShippingMethod {}

export interface AdminOrderResponse {
  order: AdminOrder
}

export interface AdminOrdersResponse {
  orders: AdminOrder[]
}

export interface AdminCreateOrderFulfillment {
  items: { id: string; quantity: number }[]
  location_id?: string
  no_notification?: boolean
  metadata?: Record<string, any>
}

export interface AdminCreateOrderShipment {
  items: { id: string; quantity: number }[]
  labels?: {
    tracking_number: string
    tracking_url: string
    label_url: string
  }[]
  no_notification?: boolean
  metadata?: Record<string, any>
}

export interface AdminCancelOrderFulfillment {
  no_notification?: boolean
}

// Order Preview

export interface AdminOrderPreview
  extends Omit<AdminOrder, "items" | "shipping_methods"> {
  return_requested_total: number
  order_change: BaseOrderChange
  items: (BaseOrderLineItem & { actions?: BaseOrderChangeAction[] })[]
  shipping_methods: (BaseOrderShippingMethod & {
    actions?: BaseOrderChangeAction[]
  })[]
}

export interface AdminOrderPreviewResponse {
  order: AdminOrderPreview
}
