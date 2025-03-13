import { useLoaderData, useParams } from "react-router-dom"

import { useStockLocation } from "../../../hooks/api/stock-locations"
import { LocationGeneralSection } from "./components/location-general-section"
import LocationsSalesChannelsSection from "./components/location-sales-channels-section/locations-sales-channels-section"
import { locationLoader } from "./loader"

import { TwoColumnPageSkeleton } from "../../../components/common/skeleton"
import { TwoColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"
import LocationsFulfillmentProvidersSection from "./components/location-fulfillment-providers-section/location-fulfillment-providers-section"
import { LOCATION_DETAILS_FIELD } from "./constants"

export const LocationDetail = () => {
  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof locationLoader>
  >

  const { location_id } = useParams()
  const {
    stock_location: location,
    isPending: isLoading,
    isError,
    error,
  } = useStockLocation(
    location_id!,
    { fields: LOCATION_DETAILS_FIELD },
    { initialData }
  )

  const { getWidgets } = useExtension()

  if (isLoading || !location) {
    return (
      <TwoColumnPageSkeleton mainSections={3} sidebarSections={2} showJSON />
    )
  }

  if (isError) {
    throw error
  }

  return (
    <TwoColumnPage
      widgets={{
        after: getWidgets("location.list.after"),
        before: getWidgets("location.list.before"),
        sideAfter: getWidgets("location.list.side.after"),
        sideBefore: getWidgets("location.list.side.before"),
      }}
      data={location}
      showJSON
      hasOutlet
    >
      <TwoColumnPage.Main>
        <LocationGeneralSection location={location} />
      </TwoColumnPage.Main>
      <TwoColumnPage.Sidebar>
        <LocationsSalesChannelsSection location={location} />
        <LocationsFulfillmentProvidersSection location={location} />
      </TwoColumnPage.Sidebar>
    </TwoColumnPage>
  )
}
