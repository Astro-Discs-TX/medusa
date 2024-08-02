import { IPaymentModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { adminHeaders } from "../../../../helpers/create-admin-user"
import { seedStorefrontDefaults } from "../../../../helpers/seed-storefront-defaults"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"

import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let paymentModule: IPaymentModuleService
    let paymentCollection
    let payment
    let container

    beforeEach(async () => {
      container = getContainer()
      paymentModule = container.resolve(ModuleRegistrationName.PAYMENT)
      await createAdminUser(dbConnection, adminHeaders, container)

      const collection = (
        await api.post(
          "/store/payment-collections",
          {
            cart_id: "test-cart",
            region_id: "test-region",
            amount: 1000,
            currency_code: "usd",
          },
          adminHeaders
        )
      ).data.payment_collection

      paymentCollection = (
        await api.post(
          `/store/payment-collections/${collection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          adminHeaders
        )
      ).data.payment_collection

      const lastSession = paymentCollection.payment_sessions[0]
      // TODO: Try to replace it with user behavior, like completing a cart.
      await paymentModule.authorizePaymentSession(lastSession.id, {})

      const payments = (
        await api.get(
          `/admin/payments?payment_session_id=${lastSession.id}`,
          adminHeaders
        )
      ).data.payments
      payment = payments[0]
    })

    it("should capture an authorized payment", async () => {
      const response = await api.post(
        `/admin/payments/${payment.id}/capture`,
        undefined,
        adminHeaders
      )

      expect(response.data.payment).toEqual(
        expect.objectContaining({
          id: payment.id,
          captured_at: expect.any(String),
          captures: [
            expect.objectContaining({
              id: expect.any(String),
              amount: 1000,
            }),
          ],
          refunds: [],
          amount: 1000,
        })
      )
      expect(response.status).toEqual(200)
    })

    it("should refund a captured payment", async () => {
      await api.post(
        `/admin/payments/${payment.id}/capture`,
        undefined,
        adminHeaders
      )

      // refund
      const response = await api.post(
        `/admin/payments/${payment.id}/refund`,
        {
          amount: 500,
          // BREAKING: We should probably introduce reason and notes in V2 too
          // reason: "return",
          // note: "Do not like it",
        },
        adminHeaders
      )

      // BREAKING: Response was `data.refund` in V1 with payment ID, reason, and amount
      expect(response.status).toEqual(200)
      expect(response.data.payment).toEqual(
        expect.objectContaining({
          id: payment.id,
          captured_at: expect.any(String),
          captures: [
            expect.objectContaining({
              id: expect.any(String),
              amount: 1000,
            }),
          ],
          refunds: [
            expect.objectContaining({
              id: expect.any(String),
              amount: 500,
            }),
          ],
          amount: 1000,
        })
      )
    })

    it("should not update payment collection of other orders", async () => {
      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
      await seedStorefrontDefaults(container, "dkk")

      let order1 = await createOrderSeeder({ api })

      expect(order1).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          payment_status: "authorized",
        })
      )

      const order1Payment = order1.payment_collections[0].payments[0]

      const result = await api.post(
        `/admin/payments/${order1Payment.id}/capture?fields=*payment_collection`,
        {
          amount: order1Payment.amount,
        },
        adminHeaders
      )

      order1 = (await api.get(`/admin/orders/${order1.id}`, adminHeaders)).data
        .order

      expect(order1).toEqual(
        expect.objectContaining({
          id: order1.id,
          payment_status: "captured",
        })
      )

      let order2 = await createOrderSeeder({ api })

      order2 = (await api.get(`/admin/orders/${order2.id}`, adminHeaders)).data
        .order

      expect(order2).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          payment_status: "authorized",
        })
      )

      order1 = (await api.get(`/admin/orders/${order1.id}`, adminHeaders)).data
        .order

      expect(order1).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          payment_status: "captured",
        })
      )
    })
  },
})
