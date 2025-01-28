import { Modules } from "@medusajs/framework/utils"
import { MedusaContainer } from "@medusajs/types"

export default async function handler(container: MedusaContainer) {
  const engine = container.resolve(Modules.WORKFLOW_ENGINE, {
    allowUnregistered: true,
  })

  if (engine) {
    await engine.clearExpiredExecutions()
  }
}

export const config = {
  name: "clear-workflow-execution",
  schedule: "0 */2 * * *", // Every 2 hours
}
