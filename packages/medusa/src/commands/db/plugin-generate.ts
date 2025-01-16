import { logger } from "@medusajs/framework/logger"
import {
  defineMikroOrmCliConfig,
  DmlEntity,
  dynamicImport,
} from "@medusajs/framework/utils"
import { join, dirname } from "path"

import { glob } from "glob"
import { MetadataStorage } from "@mikro-orm/core"
import { MikroORM } from "@mikro-orm/postgresql"

const TERMINAL_SIZE = process.stdout.columns

const main = async function ({ directory, modules }) {
  try {
    const modules = [] as {
      serviceName: string
      migrationsPath: string
      entities: any[]
    }[]

    const modulePath = glob.sync(
      join(directory, "src", "modules", "*", "index.ts")
    )

    for (const path of modulePath) {
      const moduleDirname = dirname(path)
      const moduleDescriptor = {
        serviceName: "",
        migrationsPath: join(moduleDirname, "migrations"),
        entities: [] as any[],
      }

      const moduleExport = await dynamicImport(path)
      if (!moduleExport.default) {
        throw new Error("The module should default export the `Module()`")
      }
      moduleDescriptor.serviceName = (
        moduleExport.default.service as any
      ).prototype.__joinerConfig().serviceName

      const entityPaths = glob.sync(join(moduleDirname, "models", "*.ts"))

      for (const entityPath of entityPaths) {
        if (entityPath.includes("index.ts")) {
          continue
        }

        const entityExports = await dynamicImport(entityPath)
        const entities = Object.values(entityExports).filter(
          (potentialEntity) => {
            return (
              DmlEntity.isDmlEntity(potentialEntity) ||
              !!MetadataStorage.getMetadataFromDecorator(potentialEntity as any)
            )
          }
        )
        moduleDescriptor.entities.push(...entities)
      }

      modules.push(moduleDescriptor)
    }

    /**
     * Generating migrations
     */
    logger.info("Generating migrations...")

    for (const moduleDescriptor of modules) {
      logger.info(
        `Generating migrations for module ${moduleDescriptor.serviceName}...`
      )

      const mikroOrmConfig = defineMikroOrmCliConfig(
        moduleDescriptor.serviceName,
        {
          entities: moduleDescriptor.entities,
          migrations: {
            path: moduleDescriptor.migrationsPath,
          },
        }
      )

      const orm = await MikroORM.init(mikroOrmConfig)
      const migrator = orm.getMigrator()
      const result = await migrator.createMigration()

      if (result.fileName) {
        logger.info(`Migration created: ${result.fileName}`)
      } else {
        logger.info(`No migration created`)
      }
    }

    console.log(new Array(TERMINAL_SIZE).join("-"))
    logger.info("Migrations generated")

    process.exit()
  } catch (error) {
    console.log(new Array(TERMINAL_SIZE).join("-"))

    logger.error(error.message, error)
    process.exit(1)
  }
}

export default main
