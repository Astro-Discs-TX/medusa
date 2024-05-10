import {
  Constructor,
  InternalModuleDeclaration,
  Logger,
  MedusaContainer,
  MODULE_RESOURCE_TYPE,
  ModuleExports,
  ModuleResolution,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  MedusaModuleType,
  ModulesSdkUtils,
} from "@medusajs/utils"
import { asFunction, asValue } from "awilix"
import { join, resolve } from "path"
import { statSync } from "fs"
import { readdir } from "fs/promises"

type ModuleResource = {
  services: Function[]
  models: Function[]
  repositories: Function[]
  loaders: Function[]
  moduleService: Constructor<any>
}

export async function loadInternalModule(
  container: MedusaContainer,
  resolution: ModuleResolution,
  logger: Logger,
  migrationOnly?: boolean,
  loaderOnly?: boolean
): Promise<{ error?: Error } | void> {
  const registrationName = !loaderOnly
    ? resolution.definition.registrationName
    : resolution.definition.registrationName + "__loaderOnly"

  const { resources } =
    resolution.moduleDeclaration as InternalModuleDeclaration

  let loadedModule: ModuleExports
  try {
    // When loading manually, we pass the exports to be loaded, meaning that we do not need to import the package to find
    // the exports. This is useful when a package export an initialize function which will bootstrap itself and therefore
    // does not need to import the package that is currently being loaded as it would create a
    // circular reference.
    const modulePath = resolution.resolutionPath as string

    if (resolution.moduleExports) {
      loadedModule = resolution.moduleExports
    } else {
      loadedModule = await import(modulePath)
      loadedModule = (loadedModule as any).default
    }
  } catch (error) {
    if (
      resolution.definition.isRequired &&
      resolution.definition.defaultPackage
    ) {
      return {
        error: new Error(
          `Make sure you have installed the default package: ${resolution.definition.defaultPackage}`
        ),
      }
    }

    return { error }
  }

  if (!loadedModule?.service) {
    container.register({
      [registrationName]: asValue(undefined),
    })

    return {
      error: new Error(
        "No service found in module. Make sure your module exports a service."
      ),
    }
  }

  if (migrationOnly) {
    // Partially loaded module, only register the service __joinerConfig function to be able to resolve it later
    const moduleService = {
      __joinerConfig: loadedModule.service.prototype.__joinerConfig,
    }
    container.register({
      [registrationName]: asValue(moduleService),
    })
    return
  }

  const localContainer = createMedusaContainer()

  const dependencies = resolution?.dependencies ?? []
  if (resources === MODULE_RESOURCE_TYPE.SHARED) {
    dependencies.push(
      ContainerRegistrationKeys.MANAGER,
      ContainerRegistrationKeys.CONFIG_MODULE,
      ContainerRegistrationKeys.LOGGER,
      ContainerRegistrationKeys.PG_CONNECTION
    )
  }

  for (const dependency of dependencies) {
    localContainer.register(
      dependency,
      asFunction(() => {
        return container.resolve(dependency, { allowUnregistered: true })
      })
    )
  }

  let moduleResources = {} as ModuleResource

  if (resolution.resolutionPath) {
    moduleResources = await loadResources(
      resolution.resolutionPath as string,
      resolution
    )
  }

  const loaders = moduleResources.loaders ?? loadedModule?.loaders ?? []
  await runLoaders(loaders, {
    container,
    localContainer,
    logger,
    resolution,
    loaderOnly,
    registrationName,
  })

  const moduleService = moduleResources.moduleService ?? loadedModule.service

  container.register({
    [registrationName]: asFunction((cradle) => {
      ;(moduleService as any).__type = MedusaModuleType
      return new moduleService(
        localContainer.cradle,
        resolution.options,
        resolution.moduleDeclaration
      )
    }).singleton(),
  })

  if (loaderOnly) {
    // The expectation is only to run the loader as standalone, so we do not need to register the service and we need to cleanup all services
    const service = container.resolve(registrationName)
    await service.__hooks?.onApplicationPrepareShutdown()
    await service.__hooks?.onApplicationShutdown()
  }
}

export async function loadModuleMigrations(
  resolution: ModuleResolution,
  moduleExports?: ModuleExports
): Promise<[Function | undefined, Function | undefined]> {
  let loadedModule: ModuleExports
  try {
    loadedModule =
      moduleExports ?? (await import(resolution.resolutionPath as string))

    return [loadedModule.runMigrations, loadedModule.revertMigration]
  } catch {
    return [undefined, undefined]
  }
}

async function importAllFromDir(path: string) {
  let filesToLoad: string[] = []

  await readdir(path).then((files) => {
    files.forEach((file) => {
      if (file !== "index.js" && !file.endsWith(".d.ts")) {
        const filePath = join(path, file)
        const stats = statSync(filePath)

        if (stats.isDirectory()) {
          // TODO: should we handle that? dont think so but I put that here for discussion
        } else if (stats.isFile()) {
          filesToLoad.push(filePath)
        }
      }
    })

    return filesToLoad
  })

  return (
    await Promise.all(filesToLoad.map((filePath) => import(filePath)))
  ).flatMap((value) => {
    return Object.values(value)
  })
}

async function loadResources(
  modulePath: string,
  moduleResolution: ModuleResolution
): Promise<ModuleResource> {
  const normalizerPath = modulePath.replace("dist/", "").replace("index.js", "")
  const [moduleService, services, models, repositories, loaders] =
    await Promise.all([
      import(modulePath).then((moduleExports) => moduleExports.default.service),
      importAllFromDir(resolve(normalizerPath, "dist", "services")),
      importAllFromDir(resolve(normalizerPath, "dist", "models")),
      importAllFromDir(resolve(normalizerPath, "dist", "repositories")),
      importAllFromDir(resolve(normalizerPath, "dist", "loaders")),
    ])

  const predicate = ([, value]: any) =>
    typeof value === "function" ? value : void 0
  const filterPredicate = (s: Function): s is Function => !!s

  const potentialServices = [
    ...new Set(
      Object.entries(services)
        .map(([key, value]) => {
          const service = predicate([key, value])
          if (service) {
            return service.name !== moduleService.name ? service : void 0
          }
        })
        .filter(filterPredicate)
    ),
  ]

  const potentialModels = [
    ...new Set(Object.entries(models).map(predicate).filter(filterPredicate)),
  ]

  const potentialRepositories = [
    ...new Set(
      Object.entries(repositories).map(predicate).filter(filterPredicate)
    ),
  ]

  const toObjectReducer = (acc, curr) => {
    acc[curr.name] = curr
    return acc
  }

  const defaultContainerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
    moduleModels: potentialModels.reduce(toObjectReducer, {}),
    moduleRepositories: potentialRepositories.reduce(toObjectReducer, {}),
    moduleServices: potentialServices.reduce(toObjectReducer, {}),
  })

  let potentialLoaders = [
    defaultContainerLoader,
    ...new Set(Object.entries(loaders).map(predicate).filter(filterPredicate)),
  ]

  /*
   * If no connectionLoader function is provided, create a default connection loader.
   * TODO: Validate naming convention
   */
  const connectionLoaderName = "connectionLoader"

  const hasConnectionLoader = potentialLoaders.some(
    (l) => l.name === connectionLoaderName
  )
  if (!hasConnectionLoader) {
    const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
      moduleName: moduleResolution.definition.key,
      moduleModels: potentialModels,
      migrationsPath: normalizerPath + "/migrations",
    })
    potentialLoaders = [connectionLoader, ...potentialLoaders]
  }

  return {
    services: potentialServices,
    models: potentialModels,
    repositories: potentialRepositories,
    loaders: potentialLoaders,
    moduleService,
  }
}

async function runLoaders(
  loaders: Function[] = [],
  {
    localContainer,
    container,
    logger,
    resolution,
    loaderOnly,
    registrationName,
  }
): Promise<void | { error: Error }> {
  try {
    for (const loader of loaders) {
      await loader(
        {
          container: localContainer,
          logger,
          options: resolution.options,
          dataLoaderOnly: loaderOnly,
        },
        resolution.moduleDeclaration as InternalModuleDeclaration
      )
    }
  } catch (err) {
    container.register({
      [registrationName]: asValue(undefined),
    })

    return {
      error: new Error(
        `Loaders for module ${resolution.definition.label} failed: ${err.message}`
      ),
    }
  }
}
