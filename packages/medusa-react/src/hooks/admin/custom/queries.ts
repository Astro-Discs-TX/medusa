import { Response } from "@medusajs/medusa-js"
import { QueryKey, useQuery } from "@tanstack/react-query"
import { useMedusa } from "../../../contexts"
import { UseQueryOptionsWrapper } from "../../../types"

export const useAdminCustomEntity = <TRes>(
  path: string,
  id: string,
  queryKey: QueryKey,
  options?: UseQueryOptionsWrapper<Response<TRes>, Error, QueryKey>
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery(
    queryKey,
    () => client.admin.custom.retrieve<TRes>(path, id),
    options
  )

  return { data, ...rest } as const
}

export const useAdminCustomEntities = <
  TQuery extends Record<string, any>,
  TRes
>(
  path: string,
  queryKey: QueryKey,
  query?: TQuery,
  options?: UseQueryOptionsWrapper<Response<TRes>, Error, QueryKey>
) => {
  const { client } = useMedusa()

  const { data, ...rest } = useQuery(
    queryKey,
    () => client.admin.custom.list<TQuery, TRes>(path, query),
    options
  )

  return { data, ...rest } as const
}
