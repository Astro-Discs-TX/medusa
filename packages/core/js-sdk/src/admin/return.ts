import { HttpTypes, SelectParams } from "@medusajs/types"

import { Client } from "../client"
import { ClientHeaders } from "../types"

export class Return {
  private client: Client
  constructor(client: Client) {
    this.client = client
  }

  async list(query?: HttpTypes.AdminReturnFilters, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminReturnsResponse>(
      `/admin/returns`,
      {
        query,
        headers,
      }
    )
  }

  async retrieve(id: string, query?: SelectParams, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}`,
      {
        query,
        headers,
      }
    )
  }

  async initiateRequest(
    body: HttpTypes.AdminInitiateReturnRequest,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async cancelRequest(
    id: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/request`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async addReturnItem(
    id: string,
    body: HttpTypes.AdminAddReturnItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/request-items`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async updateReturnItem(
    id: string,
    actionId: string,
    body: HttpTypes.AdminUpdateReturnItems,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/request-items/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async removeReturnItem(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/request-items/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async addReturnShipping(
    id: string,
    body: HttpTypes.AdminAddReturnShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/shipping-method`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async updateReturnShipping(
    id: string,
    actionId: string,
    body: HttpTypes.AdminAddReturnShipping,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/shipping-method/${actionId}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async deleteReturnShipping(
    id: string,
    actionId: string,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/shipping-method/${actionId}`,
      {
        method: "DELETE",
        headers,
        query,
      }
    )
  }

  async confirmRequest(
    id: string,
    body: HttpTypes.AdminConfirmReturnRequest,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}/request`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async updateRequest(
    id: string,
    body: HttpTypes.AdminUpdateReturnRequest,
    query?: HttpTypes.SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminReturnResponse>(
      `/admin/returns/${id}`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
