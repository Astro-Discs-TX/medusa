import {
  configLoader,
  container,
  logger,
  MedusaAppLoader,
} from "@medusajs/framework"
import { MedusaAppOutput, MedusaModule } from "@medusajs/framework/modules-sdk"
import { EventBusTypes, IndexTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/framework/utils"
import { initDb, TestDatabaseUtils } from "@medusajs/test-utils"
import { EntityManager } from "@mikro-orm/postgresql"
import { asValue } from "awilix"
import * as path from "path"
import { EventBusServiceMock } from "../__fixtures__"
import { dbName } from "../__fixtures__/medusa-config"
import { DataSynchronizer } from "../../src/utils/sync/data-synchronizer"

const eventBusMock = new EventBusServiceMock()
const queryMock = {
  graph: jest.fn(),
}

const dbUtils = TestDatabaseUtils.dbTestUtilFactory()

jest.setTimeout(30000)

const testProductId = "test_prod_1"
const testVariantId = "test_var_1"

const mockData = [
  {
    id: testProductId,
    title: "Test Product",
    updated_at: new Date(),
  },
  {
    id: testVariantId,
    title: "Test Variant",
    product_id: testProductId,
    updated_at: new Date(),
  },
]

describe("DataSynchronizer", () => {
  let medusaApp: MedusaAppOutput
  let medusaAppLoader: MedusaAppLoader
  let index: IndexTypes.IIndexService
  let dataSynchronizer: DataSynchronizer
  let manager: EntityManager

  beforeAll(async () => {
    await configLoader(
      path.join(__dirname, "./../__fixtures__"),
      "medusa-config"
    )

    await dbUtils.create(dbName)
    dbUtils.pgConnection_ = await initDb()

    container.register({
      [ContainerRegistrationKeys.LOGGER]: asValue(logger),
      [ContainerRegistrationKeys.QUERY]: asValue(null),
      [ContainerRegistrationKeys.PG_CONNECTION]: asValue(dbUtils.pgConnection_),
    })

    medusaAppLoader = new MedusaAppLoader(container as any)
    await medusaAppLoader.runModulesMigrations()

    MedusaModule.clearInstances()
    medusaApp = await medusaAppLoader.load()

    index = container.resolve(Modules.INDEX)
    ;(index as any).eventBusModuleService_ = eventBusMock
    ;(index as any).storageProvider_.query_ = queryMock

    await medusaApp.onApplicationStart()

    manager = (
      medusaApp.sharedContainer!.resolve(ModuleRegistrationName.INDEX) as any
    ).container_.manager as EntityManager

    // Initialize DataSynchronizer
    const mockStorageProvider = {
      consumeEvent: jest.fn().mockImplementation(() => Promise.resolve()),
    }

    const mockSchemaRepresentation = {
      product: {
        fields: ["id", "title", "updated_at"],
        alias: "product",
        moduleConfig: {
          linkableKeys: {
            id: true,
          },
        },
      },
      product_variant: {
        fields: ["id", "title", "product_id", "updated_at"],
        alias: "product_variant",
        moduleConfig: {
          linkableKeys: {
            id: true,
          },
        },
      },
    }

    dataSynchronizer = new DataSynchronizer({
      storageProvider: mockStorageProvider as any,
      schemaObjectRepresentation: mockSchemaRepresentation as any,
      query: queryMock as any,
    })
  })

  afterAll(async () => {
    await medusaApp.onApplicationPrepareShutdown()
    await medusaApp.onApplicationShutdown()
    await dbUtils.shutdown(dbName)
  })

  beforeEach(async () => {
    jest.clearAllMocks()
  })

  afterEach(async () => {
    await dbUtils.teardown({ schema: "public" })
  })

  describe("sync", () => {
    it("should sync products data correctly", async () => {
      // Mock query response for products
      queryMock.graph.mockResolvedValueOnce({
        data: [mockData[0]],
      })

      const ackMock = jest.fn()

      const result = await dataSynchronizer.sync({
        entityName: "product",
        pagination: {
          cursor: "0",
          limit: 10,
        },
        ack: ackMock,
      })

      expect(queryMock.graph).toHaveBeenCalledWith({
        entity: "product",
        fields: ["id"],
        filters: {
          id: { $gt: "0" },
        },
        pagination: {
          order: {
            id: "asc",
          },
          take: 1000,
        },
      })

      expect(result).toEqual({
        lastCursor: testProductId,
        done: true,
      })

      expect(ackMock).toHaveBeenCalledWith({
        lastCursor: testProductId,
      })
    })

    it("should sync product variants data correctly", async () => {
      // Mock query response for variants
      queryMock.graph.mockResolvedValueOnce({
        data: [mockData[1]],
      })

      const ackMock = jest.fn()

      const result = await dataSynchronizer.sync({
        entityName: "product_variant",
        pagination: {
          cursor: "0",
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        },
        ack: ackMock,
      })

      expect(queryMock.graph).toHaveBeenCalledWith({
        entity: "product_variant",
        fields: ["id"],
        filters: {
          id: { $gt: "0" },
          updated_at: { $gt: expect.any(Date) },
        },
        pagination: {
          order: {
            id: "asc",
          },
          take: 1000,
        },
      })

      expect(result).toEqual({
        lastCursor: testVariantId,
        done: true,
      })

      expect(ackMock).toHaveBeenCalledWith({
        lastCursor: testVariantId,
      })
    })

    it("should handle errors during sync", async () => {
      const error = new Error("Sync failed")
      queryMock.graph.mockRejectedValueOnce(error)

      const ackMock = jest.fn()

      const result = await dataSynchronizer.sync({
        entityName: "product",
        pagination: {
          cursor: "0",
        },
        ack: ackMock,
      })

      expect(ackMock).toHaveBeenCalledWith({
        lastCursor: "0",
        err: error,
      })
    })

    it("should handle empty data response", async () => {
      queryMock.graph.mockResolvedValueOnce({
        data: [],
      })

      const ackMock = jest.fn()

      const result = await dataSynchronizer.sync({
        entityName: "product",
        pagination: {
          cursor: "0",
        },
        ack: ackMock,
      })

      expect(result).toEqual({
        lastCursor: "0",
        done: true,
      })
    })
  })
})
