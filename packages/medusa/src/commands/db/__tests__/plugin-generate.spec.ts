import { logger } from "@medusajs/framework/logger"
import { DmlEntity, dynamicImport } from "@medusajs/framework/utils"
import { MikroORM } from "@mikro-orm/postgresql"
import { glob } from "glob"
import { join } from "path"
import main from "../plugin-generate"

jest.mock("@medusajs/framework/logger")

describe("plugin-generate", () => {
  const mockModules = []

  beforeEach(() => {
    jest.clearAllMocks()
    jest
      .spyOn(process, "exit")
      .mockImplementation((code?: string | number | null) => {
        return code as never
      })
  })

  describe("main function", () => {
    it.only("should successfully generate migrations when valid modules are found", async () => {
      await main({
        directory: join(__dirname, "..", "__fixtures__", "module-1"),
        modules: mockModules,
      })

      expect(logger.info).toHaveBeenCalledWith("Generating migrations...")
      console.log((logger.info as any).mock.calls)
      expect(logger.info).toHaveBeenCalledWith(
        "Migration created: test-migration.ts"
      )
      expect(logger.info).toHaveBeenCalledWith("Migrations generated")
      expect(process.exit).toHaveBeenCalledWith()
    })

    it("should handle case when no migrations are needed", async () => {
      // Mock glob.sync for module path
      ;(glob.sync as unknown as jest.Mock).mockReturnValueOnce([
        "/test/dir/src/modules/test-module/index.ts",
      ])
      // Mock glob.sync for entity paths
      ;(glob.sync as unknown as jest.Mock).mockReturnValueOnce([
        "/test/dir/src/modules/test-module/models/test.ts",
      ])

      // Mock dynamicImport for module
      const mockService = class {
        static __joinerConfig = () => ({ serviceName: "test-service" })
      }
      ;(dynamicImport as jest.Mock).mockResolvedValueOnce({
        default: {
          service: mockService,
        },
      })

      // Mock dynamicImport for entities
      ;(dynamicImport as jest.Mock).mockResolvedValueOnce({
        TestEntity: class {},
      })

      // Mock DmlEntity.isDmlEntity
      ;(DmlEntity.isDmlEntity as unknown as jest.Mock).mockReturnValue(true)

      // Mock MikroORM.init
      const mockMigrator = {
        createMigration: jest.fn().mockResolvedValue({ fileName: null }),
      }
      const mockOrm = {
        getMigrator: jest.fn().mockReturnValue(mockMigrator),
      }
      ;(MikroORM.init as jest.Mock).mockResolvedValue(mockOrm)

      await main({ directory: mockDirectory, modules: mockModules })

      expect(logger.info).toHaveBeenCalledWith("No migration created")
      expect(process.exit).toHaveBeenCalledWith()
    })

    it("should handle error when module has no default export", async () => {
      // Mock glob.sync for module path
      ;(glob.sync as unknown as jest.Mock).mockReturnValueOnce([
        "/test/dir/src/modules/test-module/index.ts",
      ])

      // Mock dynamicImport for module without default export
      ;(dynamicImport as jest.Mock).mockResolvedValueOnce({})

      await main({ directory: mockDirectory, modules: mockModules })

      expect(logger.error).toHaveBeenCalledWith(
        "The module should default export the `Module()`",
        expect.any(Error)
      )
      expect(process.exit).toHaveBeenCalledWith(1)
    })

    it("should handle general errors gracefully", async () => {
      const testError = new Error("Test error")
      ;(glob.sync as unknown as jest.Mock).mockImplementation(() => {
        throw testError
      })

      await main({ directory: mockDirectory, modules: mockModules })

      expect(logger.error).toHaveBeenCalledWith("Test error", testError)
      expect(process.exit).toHaveBeenCalledWith(1)
    })
  })
})
