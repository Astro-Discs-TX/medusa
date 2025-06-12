import execute from "./execute.js"
import ProcessManager from "./process-manager.js"

export default class PackageManager {
  protected packageManager?: "npm" | "yarn"
  protected processManager: ProcessManager
  protected verbose

  constructor(processManager: ProcessManager, verbose = false) {
    this.processManager = processManager
    this.verbose = verbose
  }

  async setPackageManager(execOptions: Record<string, unknown>): Promise<void> {
    if (this.packageManager) {
      return
    }

    // check whether yarn is available
    await this.processManager.runProcess({
      process: async () => {
        try {
          await execute([`yarn -v`, execOptions], { verbose: this.verbose })
          // yarn is available
          this.packageManager = "yarn"
        } catch (e) {
          // yarn isn't available
          // use npm
          this.packageManager = "npm"
        }
      },
      ignoreERESOLVE: true,
    })
  }

  async installDependencies(
    execOptions: Record<string, unknown>,
  ) {
    if (!this.packageManager) {
      await this.setPackageManager(execOptions)
    }

    if (this.packageManager === "yarn") {
      await this.processManager.runProcess({
        process: async () => {
          await execute([`yarn`, execOptions], { verbose: this.verbose })
        },
        ignoreERESOLVE: true,
      })
    } else {
      await this.processManager.runProcess({
        process: async () => {
          await execute([`npm install --legacy-peer-deps`, execOptions], { verbose: this.verbose })
        },
        ignoreERESOLVE: true,
      })
    }
  }

  async runCommand(
    command: string,
    execOptions: Record<string, unknown>,
  ) {
    if (!this.packageManager) {
      await this.setPackageManager(execOptions)
    }

    if (this.packageManager === "yarn") {
      await this.processManager.runProcess({
        process: async () => {
          await execute([`yarn ${command}`, execOptions], { verbose: this.verbose })
        },
        ignoreERESOLVE: true,
      })
    } else {
      await this.processManager.runProcess({
        process: async () => {
          await execute([`npm run ${command}`, execOptions], { verbose: this.verbose })
        },
        ignoreERESOLVE: true,
      })
    }
  }
}