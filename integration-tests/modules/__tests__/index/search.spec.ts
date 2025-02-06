import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IndexTypes, RemoteQueryFunction } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  defaultCurrencies,
  Modules,
} from "@medusajs/utils"
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
        const shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "Test", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        const payload = {
          title: "Test Giftcard",
          is_giftcard: true,
          shipping_profile_id: shippingProfile.id,
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
        await setTimeout(4000)

        const { data: results } = await indexEngine.query<"product">({
          fields: [
            "product.*",
            "product.variants.*",
            "product.variants.prices.*",
          ],
          filters: {
            product: {
              variants: {
                prices: {
                  amount: { $gt: 50 },
                },
              },
            },
          },
          pagination: {
            order: {
              product: {
                variants: {
                  prices: {
                    amount: "DESC",
                  },
                },
              },
            },
          },
        })

        expect(results.length).toBe(1)

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
        const shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "Test", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        const payload = {
          title: "Test Giftcard",
          is_giftcard: true,
          description: "test-giftcard-description",
          shipping_profile_id: shippingProfile.id,
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
        await setTimeout(4000)

        const { data: results } = await indexEngine.query<"product">({
          fields: [
            "product.*",
            "product.variants.*",
            "product.variants.prices.*",
          ],
          filters: {
            product: {
              variants: {
                prices: {
                  amount: { $gt: 50 },
                  currency_code: { $eq: "AUD" },
                },
              },
            },
          },
          pagination: {
            order: {
              product: {
                variants: {
                  prices: {
                    amount: "DESC",
                  },
                },
              },
            },
          },
        })

        expect(results.length).toBe(1)

        const variants = results[0].variants

        expect(variants.length).toBe(10)

        for (const variant of variants) {
          expect(variant.prices.length).toBe(1)
          expect(variant.prices[0].amount).toBeGreaterThan(50)
          expect(variant.prices[0].currency_code).toBe("AUD")
        }
      })

      it("should use query.index to query the index module and hydrate the data", async () => {
        const shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "Test", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        const payload = [
          {
            title: "Test Product",
            description: "test-product-description",
            shipping_profile_id: shippingProfile.id,
            options: [{ title: "Denominations", values: ["100"] }],
            variants: new Array(1).fill(0).map((_, i) => ({
              title: `Test variant ${i + 1}`,
              sku: `test-variant-${i + 1}`,
              prices: [
                {
                  currency_code: Object.values(defaultCurrencies)[0].code,
                  amount: 30,
                },
                {
                  currency_code: Object.values(defaultCurrencies)[2].code,
                  amount: 50,
                },
              ],
              options: {
                Denominations: "100",
              },
            })),
          },
          {
            title: "Extra product",
            description: "extra description",
            shipping_profile_id: shippingProfile.id,
            options: [{ title: "Colors", values: ["Red"] }],
            variants: new Array(2).fill(0).map((_, i) => ({
              title: `extra variant ${i}`,
              sku: `extra-variant-${i}`,
              prices: [
                {
                  currency_code: Object.values(defaultCurrencies)[1].code,
                  amount: 20,
                },
                {
                  currency_code: Object.values(defaultCurrencies)[0].code,
                  amount: 80,
                },
              ],
              options: {
                Colors: "Red",
              },
            })),
          },
        ]

        await api
          .post("/admin/products/batch", { create: payload }, adminHeaders)
          .catch((err) => {
            console.log(err)
          })

        // Timeout to allow indexing to finish
        await setTimeout(5000)

        const query = appContainer.resolve(
          ContainerRegistrationKeys.QUERY
        ) as RemoteQueryFunction

        const resultset = await query.index({
          entity: "product",
          fields: [
            "id",
            "ttitle",
            "description",
            "status",
            "variants.sku",
            "variants.barcode",
            "variants.material",
            "variants.options.value",
            "variants.prices.amount",
            "variants.prices.currency_code",
            "variants.inventory_items.inventory.sku",
            "variants.inventory_items.inventory.description",
          ],
          filters: {
            "variants.sku": { $like: "%-1" },
            "variants.prices.amount": { $gt: 30 },
          },
          pagination: {
            order: {
              "variants.prices.amount": "DESC",
            },
          },
        })
        expect(resultset.data).toEqual([
          {
            id: expect.any(String),
            description: "extra description",
            status: "draft",
            variants: [
              {
                sku: "extra-variant-0",
                barcode: null,
                material: null,
                id: expect.any(String),
                options: [
                  {
                    value: "Red",
                  },
                ],
                inventory_items: [
                  {
                    variant_id: expect.any(String),
                    inventory_item_id: expect.any(String),
                    inventory: {
                      sku: "extra-variant-0",
                      description: "extra variant 0",
                      id: expect.any(String),
                    },
                  },
                ],
                prices: [
                  {
                    amount: 20,
                    currency_code: "CAD",
                    id: expect.any(String),
                  },
                  {
                    amount: 80,
                    currency_code: "USD",
                    id: expect.any(String),
                  },
                ],
              },
              {
                sku: "extra-variant-1",
                barcode: null,
                material: null,
                id: expect.any(String),
                options: [
                  {
                    value: "Red",
                  },
                ],
                prices: [
                  {
                    amount: 20,
                    currency_code: "CAD",
                    id: expect.any(String),
                  },
                  {
                    amount: 80,
                    currency_code: "USD",
                    id: expect.any(String),
                  },
                ],
                inventory_items: [
                  {
                    variant_id: expect.any(String),
                    inventory_item_id: expect.any(String),
                    inventory: {
                      sku: "extra-variant-1",
                      description: "extra variant 1",
                      id: expect.any(String),
                    },
                  },
                ],
              },
            ],
          },
          {
            id: expect.any(String),
            description: "test-product-description",
            status: "draft",
            variants: [
              {
                sku: "test-variant-1",
                barcode: null,
                material: null,
                id: expect.any(String),
                options: [
                  {
                    value: "100",
                  },
                ],
                prices: [
                  {
                    amount: 30,
                    currency_code: "USD",
                    id: expect.any(String),
                  },
                  {
                    amount: 50,
                    currency_code: "EUR",
                    id: expect.any(String),
                  },
                ],
                inventory_items: [
                  {
                    variant_id: expect.any(String),
                    inventory_item_id: expect.any(String),
                    inventory: {
                      sku: "test-variant-1",
                      description: "Test variant 1",
                      id: expect.any(String),
                    },
                  },
                ],
              },
            ],
          },
        ])
      })

      it.skip("should search through the indexed data and return the correct results ordered and filtered [3]", async () => {
        const shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "Test", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        const payloads = new Array(50).fill(0).map((_, a) => ({
          title: "Test Giftcard-" + a,
          is_giftcard: true,
          shipping_profile_id: shippingProfile.id,
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

        const queryArgs = {
          fields: [
            "product.*",
            "product.variants.*",
            "product.variants.prices.*",
          ],
          filters: {
            product: {
              variants: {
                prices: {
                  amount: { $gt: 50 },
                  currency_code: { $eq: "AUD" },
                },
              },
            },
          },
          pagination: {
            order: {
              product: {
                variants: {
                  prices: {
                    amount: "DESC",
                  },
                },
              },
            },
          },
        }

        await indexEngine.query<"product">(queryArgs)

        const { data: results, metadata } = await indexEngine.query<"product">(
          queryArgs
        )
      })
    })
  },
})
