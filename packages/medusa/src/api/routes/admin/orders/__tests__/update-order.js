import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { OrderServiceMock } from "../../../../../services/__mocks__/order"

describe("POST /admin/orders/:id", () => {
  describe("successfully updates an order", () => {
    let subject

    beforeAll(async () => {
      subject = await request(
        "POST",
        `/admin/orders/${IdMap.getId("test-order")}`,
        {
          payload: {
            status: "completed",
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        }
      )
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls OrderService update", () => {
      expect(OrderServiceMock.update).toHaveBeenCalledTimes(1)
      expect(OrderServiceMock.update).toHaveBeenCalledWith(
        IdMap.getId("test-order"),
        {
          status: "completed",
        }
      )
    })
  })

  describe("handles failed update operation", () => {
    it("throws if metadata is to be updated", async () => {
      try {
        await request("POST", `/admin/orders/${IdMap.getId("test-order")}`, {
          payload: {
            _id: IdMap.getId("test-order"),
            metadata: "Test Description",
          },
          adminSession: {
            jwt: {
              userId: IdMap.getId("admin_user"),
            },
          },
        })
      } catch (error) {
        expect(error.status).toEqual(400)
        expect(error.message).toEqual(
          "Use setMetadata to update metadata fields"
        )
      }
    })
  })
})
