import inquirer from "inquirer"
import slugifyType from "slugify"
import chalk from "chalk"
import { getDbClientAndCredentials, runCreateDb } from "../utils/create-db.js"
import prepareProject from "../utils/prepare-project.js"
import startMedusa from "../utils/start-medusa.js"
import open from "open"
import waitOn from "wait-on"
import ora, { Ora } from "ora"
import fs from "fs"
import path from "path"
import logMessage from "../utils/log-message.js"
import createAbortController, {
  isAbortError,
} from "../utils/create-abort-controller.js"
import { track } from "@medusajs/telemetry"
import boxen from "boxen"
import { emojify } from "node-emoji"
import ProcessManager from "../utils/process-manager.js"
import { displayFactBox, FactBoxOptions } from "../utils/facts.js"
import { EOL } from "os"
import { runCloneRepo } from "../utils/clone-repo.js"
import {
  askForNextjsStarter,
  installNextjsStarter,
  startNextjsStarter,
} from "../utils/nextjs-utils.js"
import {
  getNodeVersion,
  MIN_SUPPORTED_NODE_VERSION,
} from "../utils/node-version.js"

const slugify = slugifyType.default

interface ProjectOptions {
  repoUrl?: string
  seed?: boolean
  skipDb?: boolean
  dbUrl?: string
  browser?: boolean
  migrations?: boolean
  directoryPath?: string
  withNextjsStarter?: boolean
  verbose?: boolean
}

interface ProjectCreator {
  create(): Promise<void>
}

// Base class for common project functionality
abstract class BaseProjectCreator {
  protected spinner: Ora
  protected processManager: ProcessManager
  protected abortController: AbortController
  protected factBoxOptions: FactBoxOptions
  protected projectName: string
  protected projectPath: string
  protected isProjectCreated: boolean = false
  protected printedMessage: boolean = false

  constructor(
    projectName: string,
    protected options: ProjectOptions,
    protected args: string[]
  ) {
    this.spinner = ora()
    this.processManager = new ProcessManager()
    this.abortController = createAbortController(this.processManager)
    this.projectName = projectName
    const basePath =
      typeof options.directoryPath === "string" ? options.directoryPath : ""
    this.projectPath = path.join(basePath, projectName)

    this.factBoxOptions = {
      interval: null,
      spinner: this.spinner,
      processManager: this.processManager,
      message: "",
      title: "",
      verbose: options.verbose || false,
    }
  }

  protected getProjectPath(projectName: string): string {
    return path.join(this.options.directoryPath ?? "", projectName)
  }

  protected abstract showSuccessMessage(): void

  protected abstract setupProcessManager(): void
}

// Plugin Project Creator
class PluginProjectCreator
  extends BaseProjectCreator
  implements ProjectCreator
{
  constructor(projectName: string, options: ProjectOptions, args: string[]) {
    super(projectName, options, args)
    this.setupProcessManager()
  }

  async create(): Promise<void> {
    track("CREATE_CLI_CMP")

    logMessage({
      message: `${emojify(
        ":rocket:"
      )} Starting plugin setup, this may take a few minutes.`,
    })

    this.spinner.start()
    this.factBoxOptions.interval = displayFactBox({
      ...this.factBoxOptions,
      title: "Setting up plugin...",
    })

    try {
      await this.cloneAndPreparePlugin()
      this.spinner.succeed(chalk.green("Plugin Prepared"))
      this.showSuccessMessage()
    } catch (e: any) {
      this.handleError(e)
    }
  }

  private async cloneAndPreparePlugin(): Promise<void> {
    await runCloneRepo({
      projectName: this.projectPath,
      repoUrl: this.options.repoUrl ?? "",
      abortController: this.abortController,
      spinner: this.spinner,
      verbose: this.options.verbose,
    })

    this.factBoxOptions.interval = displayFactBox({
      ...this.factBoxOptions,
      message: "Created plugin directory",
    })

    await prepareProject({
      isPlugin: true,
      directory: this.projectPath,
      projectName: this.projectName,
      spinner: this.spinner,
      processManager: this.processManager,
      abortController: this.abortController,
      verbose: this.options.verbose,
    })
  }

  private handleError(e: any): void {
    if (isAbortError(e)) {
      process.exit()
    }

    this.spinner.stop()
    logMessage({
      message: `An error occurred while preparing plugin: ${e}`,
      type: "error",
    })
  }

  protected showSuccessMessage(): void {
    logMessage({
      message: boxen(
        chalk.green(
          `Change to the \`${this.projectName}\` directory to explore your Medusa plugin.${EOL}${EOL}Check out the Medusa plugin documentation to start your development:${EOL}${EOL}https://docs.medusajs.com/${EOL}${EOL}Star us on GitHub if you like what we're building:${EOL}${EOL}https://github.com/medusajs/medusa/stargazers`
        ),
        {
          titleAlignment: "center",
          textAlignment: "center",
          padding: 1,
          margin: 1,
          float: "center",
        }
      ),
    })
  }

  protected setupProcessManager(): void {
    this.processManager.onTerminated(async () => {
      this.spinner.stop()

      if (!this.printedMessage && this.isProjectCreated) {
        this.printedMessage = true
        this.showSuccessMessage()
      }
      return
    })
  }
}

// Medusa Project Creator
class MedusaProjectCreator
  extends BaseProjectCreator
  implements ProjectCreator
{
  private client: any = null
  private dbConnectionString: string = ""
  private isDbInitialized: boolean = false
  private nextjsDirectory: string = ""
  private inviteToken?: string

  constructor(projectName: string, options: ProjectOptions, args: string[]) {
    super(projectName, options, args)
    this.setupProcessManager()
  }

  async create(): Promise<void> {
    track("CREATE_CLI_CMA")

    try {
      await this.initializeProject()
      await this.setupProject()
      await this.startServices()
    } catch (e: any) {
      this.handleError(e)
    }
  }

  private async initializeProject(): Promise<void> {
    const installNextjs =
      this.options.withNextjsStarter || (await askForNextjsStarter())

    if (!this.options.skipDb) {
      await this.setupDatabase()
    }

    logMessage({
      message: `${emojify(
        ":rocket:"
      )} Starting project setup, this may take a few minutes.`,
    })

    this.spinner.start()

    this.factBoxOptions.interval = displayFactBox({
      ...this.factBoxOptions,
      title: "Setting up project...",
    })

    try {
      await runCloneRepo({
        projectName: this.projectPath,
        repoUrl: this.options.repoUrl ?? "",
        abortController: this.abortController,
        spinner: this.spinner,
        verbose: this.options.verbose,
      })

      this.factBoxOptions.interval = displayFactBox({
        ...this.factBoxOptions,
        message: "Created project directory",
      })

      if (installNextjs) {
        this.nextjsDirectory = await installNextjsStarter({
          directoryName: this.projectPath,
          abortController: this.abortController,
          factBoxOptions: this.factBoxOptions,
          verbose: this.options.verbose,
          processManager: this.processManager,
        })
      }
    } catch (e) {
      throw e
    }
  }

  private async setupDatabase(): Promise<void> {
    const dbName = `medusa-${slugify(this.projectName)}`
    const { client, dbConnectionString, ...rest } =
      await getDbClientAndCredentials({
        dbName,
        dbUrl: this.options.dbUrl,
        verbose: this.options.verbose,
      })

    this.client = client
    this.dbConnectionString = dbConnectionString
    this.isDbInitialized = true

    if (!this.options.dbUrl) {
      this.factBoxOptions.interval = displayFactBox({
        ...this.factBoxOptions,
        title: "Creating database...",
      })

      this.client = await runCreateDb({
        client: this.client,
        dbName,
        spinner: this.spinner,
      })

      this.factBoxOptions.interval = displayFactBox({
        ...this.factBoxOptions,
        message: `Database ${dbName} created`,
      })
    }
  }

  private async setupProject(): Promise<void> {
    try {
      this.inviteToken = await prepareProject({
        isPlugin: false,
        directory: this.projectPath,
        dbConnectionString: this.dbConnectionString,
        seed: this.options.seed,
        spinner: this.spinner,
        processManager: this.processManager,
        abortController: this.abortController,
        skipDb: this.options.skipDb,
        migrations: this.options.migrations,
        onboardingType: this.nextjsDirectory ? "nextjs" : "default",
        nextjsDirectory: this.nextjsDirectory,
        client: this.client,
        verbose: this.options.verbose,
      })
    } finally {
      await this.client?.end()
    }

    this.spinner.succeed(chalk.green("Project Prepared"))
  }

  private async startServices(): Promise<void> {
    if (this.options.skipDb || !this.options.browser) {
      this.showSuccessMessage()
      process.exit()
    }

    logMessage({
      message: "Starting Medusa...",
    })

    startMedusa({
      directory: this.projectPath,
      abortController: this.abortController,
    })

    if (this.nextjsDirectory) {
      startNextjsStarter({
        directory: this.nextjsDirectory,
        abortController: this.abortController,
        verbose: this.options.verbose,
      })
    }

    this.isProjectCreated = true

    await this.openBrowser()
  }

  private async openBrowser(): Promise<void> {
    await waitOn({
      resources: ["http://localhost:9000/health"],
    }).then(async () => {
      open(
        this.inviteToken
          ? `http://localhost:9000/app/invite?token=${this.inviteToken}&first_run=true`
          : "http://localhost:9000/app"
      )
    })
  }

  private handleError(e: any): void {
    if (isAbortError(e)) {
      process.exit()
    }

    this.spinner.stop()
    logMessage({
      message: `An error occurred: ${e}`,
      type: "error",
    })
  }

  protected showSuccessMessage(): void {
    logMessage({
      message: boxen(
        chalk.green(
          `Change to the \`${
            this.projectName
          }\` directory to explore your Medusa project.${EOL}${EOL}Start your Medusa app again with the following command:${EOL}${EOL}yarn dev${EOL}${EOL}${
            this.inviteToken
              ? `After you start the Medusa app, you can set a password for your admin user with the URL http://localhost:7001/invite?token=${this.inviteToken}&first_run=true${EOL}${EOL}`
              : ""
          }${
            this.nextjsDirectory?.length
              ? `The Next.js Starter storefront was installed in the \`${this.nextjsDirectory}\` directory. Change to that directory and start it with the following command:${EOL}${EOL}npm run dev${EOL}${EOL}`
              : ""
          }Check out the Medusa documentation to start your development:${EOL}${EOL}https://docs.medusajs.com/${EOL}${EOL}Star us on GitHub if you like what we're building:${EOL}${EOL}https://github.com/medusajs/medusa/stargazers`
        ),
        {
          titleAlignment: "center",
          textAlignment: "center",
          padding: 1,
          margin: 1,
          float: "center",
        }
      ),
    })
  }

  protected setupProcessManager(): void {
    this.processManager.onTerminated(async () => {
      this.spinner.stop()

      // prevent an error from occurring if
      // client hasn't been declared yet
      if (this.isDbInitialized && this.client) {
        await this.client.end()
      }

      if (!this.printedMessage && this.isProjectCreated) {
        this.printedMessage = true
        this.showSuccessMessage()
      }
      return
    })
  }
}

// Project Factory
class ProjectCreatorFactory {
  static async create(
    args: string[],
    options: ProjectOptions
  ): Promise<ProjectCreator> {
    const isPlugin = args.indexOf("--plugin") !== -1
    if (isPlugin) {
      args.splice(args.indexOf("--plugin"), 1)
    }

    ProjectCreatorFactory.validateNodeVersion()

    const projectName = await ProjectCreatorFactory.getProjectName(
      args,
      options.directoryPath
    )

    return isPlugin
      ? new PluginProjectCreator(projectName, options, args)
      : new MedusaProjectCreator(projectName, options, args)
  }

  private static validateNodeVersion(): void {
    const nodeVersion = getNodeVersion()
    if (nodeVersion < MIN_SUPPORTED_NODE_VERSION) {
      logMessage({
        message: `Medusa requires at least v20 of Node.js. You're using v${nodeVersion}. Please install at least v20 and try again: https://nodejs.org/en/download`,
        type: "error",
      })
    }
  }

  private static async getProjectName(
    args: string[],
    directoryPath?: string
  ): Promise<string> {
    let askProjectName = args.length === 0
    if (args.length > 0) {
      const projectPath = path.join(directoryPath || "", args[0])
      if (
        fs.existsSync(projectPath) &&
        fs.lstatSync(projectPath).isDirectory()
      ) {
        logMessage({
          message: `A directory already exists with the name ${args[0]}. Please enter a different project name.`,
          type: "warn",
        })
        askProjectName = true
      }
    }

    return askProjectName ? await askForProjectName(directoryPath) : args[0]
  }
}

// User Input Handler
async function askForProjectName(directoryPath?: string): Promise<string> {
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What's the name of your project?",
      default: "my-medusa-store",
      filter: (input) => {
        return slugify(input).toLowerCase()
      },
      validate: (input) => {
        if (!input.length) {
          return "Please enter a project name"
        }
        const projectPath = path.join(directoryPath || "", input)
        return fs.existsSync(projectPath) &&
          fs.lstatSync(projectPath).isDirectory()
          ? "A directory already exists with the same name. Please enter a different project name."
          : true
      },
    },
  ])
  return projectName
}

// Main entry point
export default async (args: string[], options: ProjectOptions) => {
  const projectCreator = await ProjectCreatorFactory.create(args, options)
  await projectCreator.create()
}
