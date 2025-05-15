import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import AnalyticsService from "../src/services/analytics-service"

jest.setTimeout(900000)

moduleIntegrationTestRunner<AnalyticsService>({
  moduleName: "analytics",
  injectedDependencies: {},
  resolve: "./src/index.ts",
  moduleOptions: {},
  testSuite: ({ service }) => {
    describe.skip("Analytics", () => {
      it("noop", async () => {
        console.log(service)
      })
    })
  },
})
