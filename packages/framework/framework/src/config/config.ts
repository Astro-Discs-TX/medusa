import { ConfigModule } from "./types"
import { deepCopy, isDefined } from "@medusajs/utils"
import { Logger } from "@medusajs/types"

export class ConfigManager {
  /**
   * The input config object from which to prepare the full configuration to use
   * @private
   */
  readonly #inputConfig: Partial<ConfigModule>

  /**
   * A flag to secify if we are in product or not, determine weither an error would be critical and thrown or just logged as a warning in developement
   * @private
   */
  readonly #isProduction: boolean = ["production", "prod"].includes(
    process.env.NODE_ENV || ""
  )

  /**
   * The worker mode
   * @private
   */
  readonly #envWorkMode?: ConfigModule["projectConfig"]["workerMode"] = process
    .env.MEDUSA_WORKER_MODE as ConfigModule["projectConfig"]["workerMode"]

  /**
   * The logger instance to use
   * @private
   */
  readonly #logger: Logger

  /**
   * The config object after loading it
   * @private
   */
  #config!: ConfigModule

  constructor(
    rawConfig: Partial<ConfigModule> = {},
    {
      logger,
    }: {
      logger: Logger
    }
  ) {
    this.#inputConfig = rawConfig
    this.#logger = logger
  }

  /**
   * Rejects an error either by throwing when in production or by logging the error as a warning
   * @param error
   * @protected
   */
  protected rejectErrors(error: string): never | void {
    if (this.#isProduction) {
      throw new Error(error)
    }

    this.#logger.warn(error)
  }

  /**
   * Builds the http config object and assign the defaults if needed
   * @param projectConfig
   * @protected
   */
  protected buildHttpConfig(
    projectConfig: Partial<ConfigModule["projectConfig"]>
  ): ConfigModule["projectConfig"]["http"] {
    const http = (projectConfig.http ??
      {}) as ConfigModule["projectConfig"]["http"]

    http.jwtExpiresIn = http?.jwtExpiresIn ?? "1d"
    http.authCors = http.authCors ?? ""
    http.storeCors = http.storeCors ?? ""
    http.adminCors = http.adminCors ?? ""

    http.jwtSecret = http?.jwtSecret ?? process.env.JWT_SECRET

    if (!http.jwtSecret) {
      this.rejectErrors(
        `[config] ⚠️ http.jwtSecret not found.${
          this.#isProduction ? "" : "Using default 'supersecret'."
        }`
      )

      http.jwtSecret = "supersecret"
    }

    http.cookieSecret = (projectConfig.http?.cookieSecret ??
      process.env.COOKIE_SECRET)!

    if (!http.cookieSecret) {
      this.rejectErrors(
        `[config] ⚠️ http.cookieSecret not found.${
          this.#isProduction ? "" : " Using default 'supersecret'."
        }`
      )

      http.cookieSecret = "supersecret"
    }

    return http
  }

  /**
   * Normalizes the project config object and assign the defaults if needed
   * @param projectConfig
   * @protected
   */
  protected normalizeProjectConfig(
    projectConfig: Partial<ConfigModule["projectConfig"]>
  ): ConfigModule["projectConfig"] {
    const outputConfig: ConfigModule["projectConfig"] = deepCopy(projectConfig)

    if (!outputConfig?.redisUrl) {
      console.log(
        `[config] ⚠️ redisUrl not found. A fake redis instance will be used.`
      )
    }

    outputConfig.http = this.buildHttpConfig(projectConfig)

    let workedMode = outputConfig?.workerMode!

    if (!isDefined(workedMode)) {
      const env = this.#envWorkMode
      if (isDefined(env)) {
        const workerModes = ["shared", "worker", "server"]
        if (workerModes.includes(env)) {
          workedMode = env
        }
      } else {
        workedMode = "shared"
      }
    }

    return {
      ...outputConfig,
      workerMode: workedMode,
    }
  }

  /**
   * Prepare the full configuration after validation and normalization
   * @protected
   */
  protected loadConfig(): ConfigModule {
    const projectConfig = this.normalizeProjectConfig(
      this.#inputConfig.projectConfig ?? {}
    )

    return {
      projectConfig,
      admin: this.#inputConfig.admin ?? {},
      modules: this.#inputConfig.modules ?? {},
      featureFlags: this.#inputConfig.featureFlags ?? {},
      plugins: this.#inputConfig.plugins ?? [],
    }
  }

  /**
   * Returns the config object after loading it
   */
  getConfig(): ConfigModule {
    return this.#config ?? (this.#config = this.loadConfig())
  }
}
