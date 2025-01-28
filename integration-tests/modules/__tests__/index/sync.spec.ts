import { IEventBusModuleService, IndexTypes } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  defaultCurrencies,
  Modules,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { setTimeout } from "timers/promises"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(120000)

process.env.ENABLE_INDEX_MODULE = "true"

medusaIntegrationTestRunner({
  testSuite: ({ getContainer, dbConnection, api, dbConfig }) => {
    let indexEngine: IndexTypes.IIndexService
    let appContainer

    beforeAll(() => {
      appContainer = getContainer()
      indexEngine = appContainer.resolve(Modules.INDEX)
    })

    afterAll(() => {
      process.env.ENABLE_INDEX_MODULE = "false"
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, appContainer)
    })

    describe("Index engine syncing", () => {
      it("should sync the data to the index based on the indexation configuration", async () => {
        const shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "Test", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        for (let i = 0; i < 10; i++) {
          const payload = {
            title: "Test Giftcard " + i,
            shipping_profile_id: shippingProfile.id,
            description: "test-giftcard-description " + i,
            options: [{ title: "Denominations", values: ["100"] }],
            variants: new Array(10).fill(0).map((_, j) => ({
              title: `Test variant ${i} ${j}`,
              sku: `test-variant-${i}-${j}`,
              prices: new Array(10).fill(0).map((_, k) => ({
                currency_code: Object.values(defaultCurrencies)[k].code,
                amount: 10 * k,
              })),
              options: {
                Denominations: "100",
              },
            })),
          }

          await api
            .post("/admin/products", payload, adminHeaders)
            .catch((err) => {
              console.log(err)
            })
        }

        await setTimeout(1000)
        await dbConnection.raw('TRUNCATE TABLE "index_data";')
        await dbConnection.raw('TRUNCATE TABLE "index_relation";')
        await dbConnection.raw('TRUNCATE TABLE "index_metadata";')
        await dbConnection.raw('TRUNCATE TABLE "index_sync";')

        const { data: indexedDataAfterCreation } =
          await indexEngine.query<"product">({
            fields: [
              "product.*",
              "product.variants.*",
              "product.variants.prices.*",
            ],
          })

        expect(indexedDataAfterCreation.length).toBe(0)

        // Prevent storage provider to be triggered though
        ;(indexEngine as any).storageProvider_.onApplicationStart = jest.fn()
        // Trigger a sync
        await (indexEngine as any).onApplicationStart_()

        console.log("--- Querying ---")
        const { data: results } = await indexEngine.query<"product">({
          fields: [
            "product.*",
            "product.variants.*",
            "product.variants.prices.*",
          ],
        })

        expect(results.length).toBe(10)
        for (const result of results) {
          expect(result.variants.length).toBe(10)
          for (const variant of result.variants) {
            expect(variant.prices.length).toBe(10)
          }
        }
      })
    })
  },
})
