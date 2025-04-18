import { Event, MedusaContainer, EventBusTypes } from "@medusajs/framework/types"

export type SubscriberConfig = {
  event: string | string[]
  context?: EventBusTypes.SubscriberContext
}

export type SubscriberArgs<T = unknown> = {
  event: Event<T>
  container: MedusaContainer
  pluginOptions: Record<string, unknown>
}
