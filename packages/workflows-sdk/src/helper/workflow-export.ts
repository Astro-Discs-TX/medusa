import {
  DistributedTransaction,
  LocalWorkflow,
  TransactionHandlerType,
  TransactionState,
  TransactionStepError,
} from "@medusajs/orchestration"
import { Context, LoadedModule, MedusaContainer } from "@medusajs/types"

import { MedusaModule } from "@medusajs/modules-sdk"
import { EOL } from "os"
import { ulid } from "ulid"
import { MedusaWorkflow } from "../medusa-workflow"
import {
  SymbolWorkflowStep,
  SymbolWorkflowWorkflowData,
  resolveValue,
} from "../utils/composer"

export type FlowRunOptions<TData = unknown> = {
  input?: TData
  context?: Context
  resultFrom?: string | string[] | Symbol
  throwOnError?: boolean
}

export type FlowRegisterStepSuccessOptions<TData = unknown> = {
  idempotencyKey: string
  response?: TData
  context?: Context
  resultFrom?: string | string[] | Symbol
  throwOnError?: boolean
}

export type FlowRegisterStepFailureOptions<TData = unknown> = {
  idempotencyKey: string
  response?: TData
  context?: Context
  resultFrom?: string | string[] | Symbol
  throwOnError?: boolean
}

export type WorkflowResult<TResult = unknown> = {
  errors: TransactionStepError[]
  transaction: DistributedTransaction
  result: TResult
}

export type ExportedWorkflow<
  TData = unknown,
  TResult = unknown,
  TDataOverride = undefined,
  TResultOverride = undefined
> = {
  run: (
    args?: FlowRunOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    >
  ) => Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  >
  registerStepSuccess: (
    args?: FlowRegisterStepSuccessOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    >
  ) => Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  >
  registerStepFailure: (
    args?: FlowRegisterStepFailureOptions<
      TDataOverride extends undefined ? TData : TDataOverride
    >
  ) => Promise<
    WorkflowResult<
      TResultOverride extends undefined ? TResult : TResultOverride
    >
  >
}

export const exportWorkflow = <TData = unknown, TResult = unknown>(
  workflowId: string,
  defaultResult?: string | Symbol,
  dataPreparation?: (data: TData) => Promise<unknown>
) => {
  function exportedWorkflow<
    TDataOverride = undefined,
    TResultOverride = undefined
  >(
    container?: LoadedModule[] | MedusaContainer
  ): Omit<
    LocalWorkflow,
    "run" | "registerStepSuccess" | "registerStepFailure"
  > &
    ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride> {
    if (!container) {
      container = MedusaModule.getLoadedModules().map(
        (mod) => Object.values(mod)[0]
      )
    }

    const flow = new LocalWorkflow(workflowId, container)

    const originalRun = flow.run.bind(flow)
    const originalRegisterStepSuccess = flow.registerStepSuccess.bind(flow)
    const originalRegisterStepFailure = flow.registerStepFailure.bind(flow)

    const originalExecution = async (
      method,
      { throwOnError, resultFrom },
      ...args
    ) => {
      const transaction = await method.apply(method, args)

      const errors = transaction.getErrors(TransactionHandlerType.INVOKE)

      const failedStatus = [TransactionState.FAILED, TransactionState.REVERTED]
      if (failedStatus.includes(transaction.getState()) && throwOnError) {
        const errorMessage = errors
          ?.map((err) => `${err.error?.message}${EOL}${err.error?.stack}`)
          ?.join(`${EOL}`)
        throw new Error(errorMessage)
      }

      let result: any = undefined

      const resFrom =
        resultFrom?.__type === SymbolWorkflowStep
          ? resultFrom.__step__
          : resultFrom

      if (resFrom) {
        if (Array.isArray(resFrom)) {
          result = resFrom.map((from) => {
            const res = transaction.getContext().invoke?.[from]
            return res?.__type === SymbolWorkflowWorkflowData ? res.output : res
          })
        } else {
          const res = transaction.getContext().invoke?.[resFrom]
          result = res?.__type === SymbolWorkflowWorkflowData ? res.output : res
        }

        result = await resolveValue(result || resFrom, transaction.getContext())
      }

      return {
        errors,
        transaction,
        result,
      }
    }

    const newRun = async (
      { input, context, throwOnError, resultFrom }: FlowRunOptions = {
        throwOnError: true,
        resultFrom: defaultResult,
      }
    ) => {
      resultFrom ??= defaultResult
      throwOnError ??= true

      if (typeof dataPreparation === "function") {
        try {
          const copyInput = input ? JSON.parse(JSON.stringify(input)) : input
          input = await dataPreparation(copyInput as TData)
        } catch (err) {
          if (throwOnError) {
            throw new Error(
              `Data preparation failed: ${err.message}${EOL}${err.stack}`
            )
          }
          return {
            errors: [err],
          }
        }
      }

      return await originalExecution(
        originalRun,
        { throwOnError, resultFrom },
        context?.transactionId ?? ulid(),
        input,
        context
      )
    }
    flow.run = newRun as any

    const newRegisterStepSuccess = async (
      {
        response,
        idempotencyKey,
        context,
        throwOnError,
        resultFrom,
      }: FlowRegisterStepSuccessOptions = {
        idempotencyKey: "",
        throwOnError: true,
        resultFrom: defaultResult,
      }
    ) => {
      resultFrom ??= defaultResult
      throwOnError ??= true

      return await originalExecution(
        originalRegisterStepSuccess,
        { throwOnError, resultFrom },
        idempotencyKey,
        response,
        context
      )
    }
    flow.registerStepSuccess = newRegisterStepSuccess as any

    const newRegisterStepFailure = async (
      {
        response,
        idempotencyKey,
        context,
        throwOnError,
        resultFrom,
      }: FlowRegisterStepFailureOptions = {
        idempotencyKey: "",
        throwOnError: true,
        resultFrom: defaultResult,
      }
    ) => {
      resultFrom ??= defaultResult
      throwOnError ??= true

      return await originalExecution(
        originalRegisterStepFailure,
        { throwOnError, resultFrom },
        idempotencyKey,
        response,
        context
      )
    }
    flow.registerStepFailure = newRegisterStepFailure as any

    return flow as unknown as LocalWorkflow &
      ExportedWorkflow<TData, TResult, TDataOverride, TResultOverride>
  }

  MedusaWorkflow.registerWorkflow(workflowId, exportedWorkflow)
  return exportedWorkflow
}
