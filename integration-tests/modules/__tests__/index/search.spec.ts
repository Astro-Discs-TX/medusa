import { IndexTypes } from "@medusajs/types"
import { defaultCurrencies, Modules } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
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

    describe("Index engine", () => {
      it("should search through the indexed data and return the correct results ordered and filtered [1]", async () => {
        const payload = {
          title: "Test Giftcard",
          is_giftcard: true,
          description: "test-giftcard-description",
          options: [{ title: "Denominations", values: ["100"] }],
          variants: new Array(10).fill(0).map((_, i) => ({
            title: `Test variant ${i}`,
            sku: `test-variant-${i}`,
            prices: new Array(10).fill(0).map((_, j) => ({
              currency_code: Object.values(defaultCurrencies)[j].code,
              amount: 10 * j,
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

        // Timeout to allow indexing to finish
        await setTimeout(2000)

        const [results, count] = await indexEngine.queryAndCount(
          {
            select: {
              product: {
                variants: {
                  prices: true,
                },
              },
            },
            where: {
              "product.variants.prices.amount": { $gt: 50 },
            },
          },
          {
            orderBy: [{ "product.variants.prices.amount": "DESC" }],
          }
        )

        expect(count).toBe(1)

        const variants = results[0].variants

        expect(variants.length).toBe(10)

        for (const variant of variants) {
          expect(variant.prices.length).toBe(4)
          for (const price of variant.prices) {
            expect(price.amount).toBeGreaterThan(50)
          }
        }
      })

      it("should search through the indexed data and return the correct results ordered and filtered [2]", async () => {
        const payload = {
          title: "Test Giftcard",
          is_giftcard: true,
          description: "test-giftcard-description",
          options: [{ title: "Denominations", values: ["100"] }],
          variants: new Array(10).fill(0).map((_, i) => ({
            title: `Test variant ${i}`,
            sku: `test-variant-${i}`,
            prices: new Array(10).fill(0).map((_, j) => ({
              currency_code: Object.values(defaultCurrencies)[j].code,
              amount: 10 * j,
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

        // Timeout to allow indexing to finish
        await setTimeout(2000)

        const [results, count] = await indexEngine.queryAndCount(
          {
            select: {
              product: {
                variants: {
                  prices: true,
                },
              },
            },
            where: {
              "product.variants.prices.amount": { $gt: 50 },
              "product.variants.prices.currency_code": { $eq: "AUD" },
            },
          },
          {
            orderBy: [{ "product.variants.prices.amount": "DESC" }],
          }
        )

        expect(count).toBe(1)

        const variants = results[0].variants

        expect(variants.length).toBe(10)

        for (const variant of variants) {
          expect(variant.prices.length).toBe(1)
          expect(variant.prices[0].amount).toBeGreaterThan(50)
          expect(variant.prices[0].currency_code).toBe("AUD")
        }
      })

      it.skip("should search through the indexed data and return the correct results ordered and filtered [3]", async () => {
        const payloads = new Array(50).fill(0).map((_, a) => ({
          title: "Test Giftcard-" + a,
          is_giftcard: true,
          description: "test-giftcard-description" + a,
          options: [{ title: "Denominations", values: ["100"] }],
          variants: new Array(10).fill(0).map((_, i) => ({
            title: `Test variant ${i}`,
            sku: `test-variant-${i}${a}`,
            prices: new Array(10).fill(0).map((_, j) => ({
              currency_code: Object.values(defaultCurrencies)[j].code,
              amount: 10 * j,
            })),
            options: {
              Denominations: "100",
            },
          })),
        }))

        let i = 0
        for (const payload of payloads) {
          ++i
          await api.post("/admin/products", payload, adminHeaders).then(() => {
            console.log(`Created ${i} products in ${payloads.length} payloads`)
          })
        }

        await setTimeout(5000)

        const queryArgs = [
          {
            select: {
              product: {
                variants: {
                  prices: true,
                },
              },
            },
            where: {
              "product.variants.prices.amount": { $gt: 50 },
              "product.variants.prices.currency_code": { $eq: "AUD" },
            },
          },
          {
            orderBy: [{ "product.variants.prices.amount": "DESC" }],
          },
        ]

        await indexEngine.queryAndCount(...queryArgs)

        const [results, count, perf] = await indexEngine.queryAndCount(
          ...queryArgs
        )

        console.log(perf)
      })
    })
  },
})
