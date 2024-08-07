import {
  ClaimReason,
  ClaimType,
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  RuleOperator,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseClaim
    let order, order2
    let returnShippingOption
    let shippingProfile
    let fulfillmentSet
    let returnReason
    let inventoryItem
    let inventoryItemExtra
    let location
    let productExtra
    let item
    const shippingProviderId = "manual_test-provider"

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const region = (
        await api.post(
          "/admin/regions",
          {
            name: "test-region",
            currency_code: "usd",
          },
          adminHeaders
        )
      ).data.region

      const customer = (
        await api.post(
          "/admin/customers",
          {
            first_name: "joe",
            email: "joe@admin.com",
          },
          adminHeaders
        )
      ).data.customer

      const salesChannel = (
        await api.post(
          "/admin/sales-channels",
          {
            name: "Test channel",
          },
          adminHeaders
        )
      ).data.sales_channel

      const product = (
        await api.post(
          "/admin/products",
          {
            title: "Test product",
            variants: [
              {
                title: "Test variant",
                sku: "test-variant",
                prices: [
                  {
                    currency_code: "usd",
                    amount: 10,
                  },
                ],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      productExtra = (
        await api.post(
          "/admin/products",
          {
            title: "Extra product",
            variants: [
              {
                title: "my variant",
                sku: "variant-sku",
                prices: [
                  {
                    currency_code: "usd",
                    amount: 123456.1234657890123456789,
                  },
                ],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      returnReason = (
        await api.post(
          "/admin/return-reasons",
          {
            value: "return-reason-test",
            label: "Test return reason",
          },
          adminHeaders
        )
      ).data.return_reason

      const orderModule = container.resolve(ModuleRegistrationName.ORDER)

      order = await orderModule.createOrders({
        region_id: region.id,
        email: "foo@bar.com",
        items: [
          {
            title: "Custom Item 2",
            variant_id: product.variants[0].id,
            quantity: 2,
            unit_price: 25,
          },
        ],
        sales_channel_id: salesChannel.id,
        shipping_address: {
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "US",
          postal_code: "12345",
          phone: "12345",
        },
        billing_address: {
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "US",
          postal_code: "12345",
        },
        shipping_methods: [
          {
            name: "Test shipping method",
            amount: 10,
            data: {},
            tax_lines: [
              {
                description: "shipping Tax 1",
                tax_rate_id: "tax_usa_shipping",
                code: "code",
                rate: 10,
              },
            ],
          },
        ],
        currency_code: "usd",
        customer_id: customer.id,
      })

      order2 = await orderModule.createOrders({
        region_id: region.id,
        email: "foo@bar2.com",
        items: [
          {
            title: "Custom Iasdasd2",
            quantity: 1,
            unit_price: 20,
          },
        ],
        sales_channel_id: salesChannel.id,
        shipping_address: {
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "US",
          postal_code: "12345",
          phone: "12345",
        },
        billing_address: {
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "US",
          postal_code: "12345",
        },
        currency_code: "usd",
        customer_id: customer.id,
      })

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          {
            name: "Test",
            type: "default",
          },
          adminHeaders
        )
      ).data.shipping_profile

      location = (
        await api.post(
          `/admin/stock-locations`,
          {
            name: "Test location",
          },
          adminHeaders
        )
      ).data.stock_location

      location = (
        await api.post(
          `/admin/stock-locations/${location.id}/fulfillment-sets?fields=*fulfillment_sets`,
          {
            name: "Test",
            type: "test-type",
          },
          adminHeaders
        )
      ).data.stock_location

      fulfillmentSet = (
        await api.post(
          `/admin/fulfillment-sets/${location.fulfillment_sets[0].id}/service-zones`,
          {
            name: "Test",
            geo_zones: [{ type: "country", country_code: "us" }],
          },
          adminHeaders
        )
      ).data.fulfillment_set

      inventoryItem = (
        await api.post(
          `/admin/inventory-items`,
          { sku: "inv-1234" },
          adminHeaders
        )
      ).data.inventory_item

      await api.post(
        `/admin/inventory-items/${inventoryItem.id}/location-levels`,
        {
          location_id: location.id,
          stocked_quantity: 2,
        },
        adminHeaders
      )

      inventoryItemExtra = (
        await api.get(`/admin/inventory-items?sku=variant-sku`, adminHeaders)
      ).data.inventory_items[0]

      await api.post(
        `/admin/inventory-items/${inventoryItemExtra.id}/location-levels`,
        {
          location_id: location.id,
          stocked_quantity: 4,
        },
        adminHeaders
      )

      const remoteLink = container.resolve(
        ContainerRegistrationKeys.REMOTE_LINK
      )

      await remoteLink.create([
        {
          [Modules.STOCK_LOCATION]: {
            stock_location_id: location.id,
          },
          [Modules.FULFILLMENT]: {
            fulfillment_provider_id: shippingProviderId,
          },
        },
        {
          [Modules.STOCK_LOCATION]: {
            stock_location_id: location.id,
          },
          [Modules.FULFILLMENT]: {
            fulfillment_set_id: fulfillmentSet.id,
          },
        },
        {
          [Modules.SALES_CHANNEL]: {
            sales_channel_id: salesChannel.id,
          },
          [Modules.STOCK_LOCATION]: {
            stock_location_id: location.id,
          },
        },
        {
          [Modules.PRODUCT]: {
            variant_id: product.variants[0].id,
          },
          [Modules.INVENTORY]: {
            inventory_item_id: inventoryItem.id,
          },
        },
        {
          [Modules.PRODUCT]: {
            variant_id: productExtra.variants[0].id,
          },
          [Modules.INVENTORY]: {
            inventory_item_id: inventoryItemExtra.id,
          },
        },
      ])

      const shippingOptionPayload = {
        name: "Return shipping",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        provider_id: shippingProviderId,
        price_type: "flat",
        type: {
          label: "Test type",
          description: "Test description",
          code: "test-code",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 1000,
          },
        ],
        rules: [
          {
            operator: RuleOperator.EQ,
            attribute: "is_return",
            value: "true",
          },
        ],
      }

      returnShippingOption = (
        await api.post(
          "/admin/shipping-options",
          shippingOptionPayload,
          adminHeaders
        )
      ).data.shipping_option

      item = order.items[0]

      await api.post(
        `/admin/orders/${order.id}/fulfillments`,
        {
          items: [
            {
              id: item.id,
              quantity: 2,
            },
          ],
        },
        adminHeaders
      )

      await api.post(
        `/admin/orders/${order2.id}/fulfillments`,
        {
          items: [
            {
              id: order2.items[0].id,
              quantity: 1,
            },
          ],
        },
        adminHeaders
      )

      baseClaim = (
        await api.post(
          "/admin/claims",
          {
            order_id: order.id,
            type: ClaimType.REPLACE,
            description: "Base claim",
          },
          adminHeaders
        )
      ).data.claim
    })

    describe("Claims lifecycle", () => {
      it("Full flow with 2 orders", async () => {
        let r2 = await api.post(
          "/admin/claims",
          {
            order_id: order2.id,
            type: ClaimType.REFUND,
          },
          adminHeaders
        )

        const claimId2 = r2.data.claim.id
        const item2 = order2.items[0]

        await api.post(
          `/admin/claims/${claimId2}/inbound/items`,
          {
            items: [
              {
                id: item2.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/claims/${claimId2}/inbound/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )
        await api.post(`/admin/claims/${claimId2}/request`, {}, adminHeaders)

        const claimId = baseClaim.id

        const item = order.items[0]

        let result = await api.post(
          `/admin/claims/${claimId}/inbound/items`,
          {
            items: [
              {
                id: item.id,
                reason_id: returnReason.id,
                quantity: 2,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/claims/${claimId}/inbound/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        // updated the requested quantity
        const updateReturnItemActionId =
          result.data.order_preview.items[0].actions[0].id

        result = await api.post(
          `/admin/claims/${claimId}/inbound/items/${updateReturnItemActionId}`,
          {
            quantity: 1,
          },
          adminHeaders
        )

        // New Items
        await api.post(
          `/admin/claims/${claimId}/outbound/items`,
          {
            items: [
              {
                variant_id: productExtra.variants[0].id,
                quantity: 2,
              },
            ],
          },
          adminHeaders
        )

        // Claim Items
        await api.post(
          `/admin/claims/${claimId}/claim-items`,
          {
            items: [
              {
                id: item.id,
                reason: ClaimReason.PRODUCTION_FAILURE,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        result = await api.post(
          `/admin/claims/${claimId}/request`,
          {},
          adminHeaders
        )

        result = (
          await api.get(
            `/admin/claims?fields=*claim_items,*additional_items`,
            adminHeaders
          )
        ).data.claims

        expect(result).toHaveLength(2)
        expect(result[0].additional_items).toHaveLength(1)
        expect(result[0].claim_items).toHaveLength(1)
        expect(result[0].canceled_at).toBeNull()

        const reservationsResponse = (
          await api.get(
            `/admin/reservations?location_id[]=${location.id}`,
            adminHeaders
          )
        ).data

        expect(reservationsResponse.reservations).toHaveLength(1)

        await api.post(`/admin/claims/${claimId}/cancel`, {}, adminHeaders)

        result = (
          await api.get(
            `/admin/claims?fields=*claim_items,*additional_items`,
            adminHeaders
          )
        ).data.claims
        expect(result[0].canceled_at).toBeDefined()

        const reservationsResponseAfterCanceling = (
          await api.get(
            `/admin/reservations?location_id[]=${location.id}`,
            adminHeaders
          )
        ).data

        expect(reservationsResponseAfterCanceling.reservations).toHaveLength(0)
      })
    })

    describe("GET /admin/claims/:id", () => {
      beforeEach(async () => {
        await api.post(
          `/admin/claims/${baseClaim.id}/inbound/items`,
          {
            items: [
              {
                id: item.id,
                reason_id: returnReason.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )
        await api.post(
          `/admin/claims/${baseClaim.id}/inbound/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )
        // Claim Items
        await api.post(
          `/admin/claims/${baseClaim.id}/claim-items`,
          {
            items: [
              {
                id: item.id,
                reason: ClaimReason.PRODUCTION_FAILURE,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )
        await api.post(
          `/admin/claims/${baseClaim.id}/request`,
          {},
          adminHeaders
        )
      })

      it("should get an existing claim for given id", async () => {
        let res = await api.get(`/admin/claims/${baseClaim.id}`, adminHeaders)
        expect(res.status).toEqual(200)
        expect(res.data.claim.id).toEqual(baseClaim.id)

        let errorRes = await api
          .get(`/admin/claims/invalid-claim-id`, adminHeaders)
          .catch((e) => e)
        expect(errorRes.response.status).toEqual(404)
        expect(errorRes.response.data.message).toEqual(
          "Claim with id: invalid-claim-id was not found"
        )
      })

      it("should get an existing claim for given id", async () => {
        let res = await api.get(`/admin/claims/${baseClaim.id}`, adminHeaders)
        const keysInResponse = Object.keys(res.data.claim)

        expect(res.status).toEqual(200)
        expect(keysInResponse).toEqual(
          expect.arrayContaining([
            "id",
            "created_at",
            "updated_at",
            "canceled_at",
            "type",
            "order_id",
            "return_id",
            "display_id",
            "order_version",
            "refund_amount",
            "additional_items",
            "claim_items",
          ])
        )
      })

      it("should get claim with claim items", async () => {
        let res = await api.get(
          `/admin/claims/${baseClaim.id}?fields=id,*claim_items`,
          adminHeaders
        )
        expect(res.status).toEqual(200)
        expect(res.data.claim.id).toEqual(baseClaim.id)
        expect(res.data.claim.claim_items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              item_id: item.id,
              reason: ClaimReason.PRODUCTION_FAILURE,
            }),
          ])
        )
        // additional items is one of the props that should be undefined
        expect(res.data.claim.additional_items).toBeUndefined()
      })
    })
  },
})
