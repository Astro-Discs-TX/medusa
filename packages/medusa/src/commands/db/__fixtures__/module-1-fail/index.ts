import { MedusaService, Module } from "@medusajs/framework/utils"

export const module1Export = Module("module1", {
  service: class Module1Service extends MedusaService({}) {},
})
