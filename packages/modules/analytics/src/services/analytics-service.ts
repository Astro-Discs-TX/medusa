import {
  TrackAnalyticsEventDTO,
  IdentifyAnalyticsEventDTO,
} from "@medusajs/types"
import AnalyticsProviderService from "./provider-service"

type InjectedDependencies = {
  analyticsProviderService: AnalyticsProviderService
}

export default class AnalyticsService {
  protected readonly analyticsProviderService_: AnalyticsProviderService

  constructor({ analyticsProviderService }: InjectedDependencies) {
    this.analyticsProviderService_ = analyticsProviderService
  }

  __hooks = {
    onApplicationShutdown: async () => {
      this.analyticsProviderService_.shutdown()
    },
  }

  getProvider() {
    return this.analyticsProviderService_
  }

  async track(data: TrackAnalyticsEventDTO): Promise<void> {
    this.analyticsProviderService_.track(data)
  }

  async identify(data: IdentifyAnalyticsEventDTO): Promise<void> {
    this.analyticsProviderService_.identify(data)
  }
}
