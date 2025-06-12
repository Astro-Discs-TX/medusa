import {
  ContainerRegistrationKeys,
  ModulesSdkUtils,
  retryExecution,
  stringifyCircular,
} from "@medusajs/utils"
import { asValue } from "awilix"
import { configManager } from "../config"
import { container } from "../container"
import { logger } from "../logger"

/**
 * Initialize a knex connection that can then be shared to any resources if needed
 */
export async function pgConnectionLoader(): Promise<
  ReturnType<typeof ModulesSdkUtils.createPgConnection>
> {
  if (container.hasRegistration(ContainerRegistrationKeys.PG_CONNECTION)) {
    return container.resolve(
      ContainerRegistrationKeys.PG_CONNECTION
    ) as unknown as ReturnType<typeof ModulesSdkUtils.createPgConnection>
  }

  const configModule = configManager.config

  // Share a knex connection to be consumed by the shared modules
  const connectionString = configModule.projectConfig.databaseUrl
  const driverOptions: any = {
    ...(configModule.projectConfig.databaseDriverOptions || {}),
  }
  const schema = configModule.projectConfig.databaseSchema || "public"
  const idleTimeoutMillis = driverOptions.pool?.idleTimeoutMillis ?? undefined // prevent null to be passed
  const poolMin = driverOptions.pool?.min ?? 2
  const poolMax = driverOptions.pool?.max
  const reapIntervalMillis = driverOptions.pool?.reapIntervalMillis ?? undefined
  const createRetryIntervalMillis =
    driverOptions.pool?.createRetryIntervalMillis ?? undefined

  delete driverOptions.pool

  const pgConnection = ModulesSdkUtils.createPgConnection({
    clientUrl: connectionString,
    schema,
    driverOptions,
    pool: {
      min: poolMin,
      max: poolMax,
      idleTimeoutMillis,
      reapIntervalMillis,
      createRetryIntervalMillis,
    },
  })

  await retryExecution(
    async () => {
      await pgConnection.raw("SELECT 1")
    },
    {
      retryDelay: (retries) => {
        return Math.min(500 * 2 ** retries, 5000)
      },
      onRetry: (error) => {
        logger.warn(
          `Pg connection failed to connect to the database. Retrying...\n${stringifyCircular(
            error
          )}`
        )
      },
    }
  )

  container.register(
    ContainerRegistrationKeys.PG_CONNECTION,
    asValue(pgConnection)
  )

  return pgConnection
}
