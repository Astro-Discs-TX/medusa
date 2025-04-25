import { moduleProviderLoader } from "@medusajs/framework/modules-sdk"

import {
  LoaderOptions,
  ModuleProvider,
  ModulesSdkTypes,
  CreateTaxProviderDTO,
} from "@medusajs/framework/types"
import { asFunction, Lifetime } from "awilix"

import * as providers from "../providers"
import TaxProviderService from "../services/tax-provider"

const PROVIDER_REGISTRATION_KEY = "tax_providers" as const

const registrationFn = async (klass, container, pluginOptions) => {
  container.register({
    [`tp_${klass.identifier}`]: asFunction(
      (cradle) => new klass(cradle, pluginOptions),
      { lifetime: klass.LIFE_TIME || Lifetime.SINGLETON }
    ),
  })

  container.registerAdd(
    PROVIDER_REGISTRATION_KEY,
    asFunction((cradle) => new klass(cradle, pluginOptions), {
      lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
    })
  )
}

export default async ({
  container,
  options,
}: LoaderOptions<
  (
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  ) & { providers: ModuleProvider[] }
>): Promise<void> => {
  // Local providers
  for (const provider of Object.values(providers)) {
    await registrationFn(provider, container, {})
  }

  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })

  await registerProvidersInDb({ container })
}

const registerProvidersInDb = async ({
  container,
}: LoaderOptions): Promise<void> => {
  const providersToLoad = container.resolve<string[]>(PROVIDER_REGISTRATION_KEY)
  const taxProviderService =
    container.resolve<TaxProviderService>("taxProviderService")

  const existingProviders = await taxProviderService.list(
    { id: providersToLoad },
    {}
  )

  const upsertData: CreateTaxProviderDTO[] = []

  for (const { id } of existingProviders) {
    if (!providersToLoad.includes(id)) {
      upsertData.push({ id, is_enabled: false })
    }
  }

  for (const id of providersToLoad) {
    upsertData.push({ id, is_enabled: true })
  }

  await taxProviderService.upsert(upsertData)
}
