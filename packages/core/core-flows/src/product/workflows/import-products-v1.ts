import { WorkflowTypes } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { notifyOnFailureStep, sendNotificationsStep } from "../../notification"
import {
  normalizeCsvV1Step,
  processImportChunksStep,
  waitConfirmationProductImportStep,
} from "../steps"

export const importProductsV1WorkflowId = "import-products-v1"
/**
 * This workflow starts a product import from a CSV file in the background. It's used by the
 * [Import Products Admin API Route](https://docs.medusajs.com/api/admin#products_postproductsimport).
 *
 * You can use this workflow within your custom workflows, allowing you to wrap custom logic around product import.
 * For example, you can import products from another system.
 *
 * The workflow only starts the import, but you'll have to confirm it using the [Workflow Engine](https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine).
 * The below example shows how to confirm the import.
 *
 * @example
 * To start the import of a CSV file:
 *
 * ```ts
 * const { result, transaction: { transactionId } } = await importProductsWorkflow(container)
 * .run({
 *   input: {
 *     // example CSV content
 *     fileContent: "title,description\nShirt,This is a shirt",
 *     filename: "products.csv",
 *   }
 * })
 * ```
 *
 * Notice that the workflow returns a `transaction.transactionId`. You'll use this ID to confirm the import afterwards.
 *
 * You confirm the import using the [Workflow Engine](https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine).
 * For example, in an API route:
 *
 * ```ts workflow={false}
 * import {
 *   AuthenticatedMedusaRequest,
 *   MedusaResponse,
 * } from "@medusajs/framework/http"
 * import {
 *   importProductsWorkflowId,
 *   waitConfirmationProductImportStepId,
 * } from "@medusajs/core-flows"
 * import { IWorkflowEngineService } from "@medusajs/framework/types"
 * import { Modules, TransactionHandlerType } from "@medusajs/framework/utils"
 * import { StepResponse } from "@medusajs/framework/workflows-sdk"
 *
 * export const POST = async (
 *   req: AuthenticatedMedusaRequest,
 *   res: MedusaResponse
 * ) => {
 *   const workflowEngineService: IWorkflowEngineService = req.scope.resolve(
 *     Modules.WORKFLOW_ENGINE
 *   )
 *   const transactionId = req.params.transaction_id
 *
 *   await workflowEngineService.setStepSuccess({
 *     idempotencyKey: {
 *       action: TransactionHandlerType.INVOKE,
 *       transactionId,
 *       stepId: waitConfirmationProductImportStepId,
 *       workflowId: importProductsWorkflowId,
 *     },
 *     stepResponse: new StepResponse(true),
 *   })
 *
 *   res.status(202).json({})
 * }
 * ```
 *
 * :::tip
 *
 * This example API route uses the same implementation as the [Confirm Product Import Admin API Route](https://docs.medusajs.com/api/admin#products_postproductsimporttransaction_idconfirm).
 *
 * :::
 *
 * @summary
 *
 * Import products from a CSV file.
 */
export const importProductsV1Workflow = createWorkflow(
  importProductsV1WorkflowId,
  (
    input: WorkflowData<{ fileKey: string; filename: string }>
  ): WorkflowResponse<WorkflowTypes.ProductWorkflow.ImportProductsSummary> => {
    const batchRequest = normalizeCsvV1Step(input.fileKey)

    waitConfirmationProductImportStep()

    // Q: Can we somehow access the error from the step that threw here? Or in a compensate step at least?
    const failureNotification = transform({ input }, (data) => {
      return [
        {
          // We don't need the recipient here for now, but if we want to push feed notifications to a specific user we could add it.
          to: "",
          channel: "feed",
          template: "admin-ui",
          data: {
            title: "Product import",
            description: `Failed to import products from file ${data.input.filename}`,
          },
        },
      ]
    })

    notifyOnFailureStep(failureNotification)
    processImportChunksStep(batchRequest)

    const notifications = transform({ input }, (data) => {
      return [
        {
          // We don't need the recipient here for now, but if we want to push feed notifications to a specific user we could add it.
          to: "",
          channel: "feed",
          template: "admin-ui",
          data: {
            title: "Product import",
            description: `Product import of file ${data.input.filename} completed successfully!`,
          },
        },
      ]
    })

    sendNotificationsStep(notifications)
    return new WorkflowResponse(batchRequest.summary)
  }
)
