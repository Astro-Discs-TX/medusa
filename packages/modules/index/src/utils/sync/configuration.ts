import { IndexTypes, InferEntityType } from "@medusajs/types"
import { IndexMetadataService } from "../../services/index-metadata"
import { IndexMetadataStatus } from "../index-metadata-status"
import { schemaObjectRepresentationPropertiesToOmit } from "@types"
import { simpleHash } from "@medusajs/framework/utils"
import { IndexMetadata } from "@models"

export class Configuration {
  #schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation
  #indexMetadataService: IndexMetadataService

  constructor({
    schemaObjectRepresentation,
    indexMetadataService,
  }: {
    schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation
    indexMetadataService: IndexMetadataService
  }) {
    this.#schemaObjectRepresentation = schemaObjectRepresentation ?? {}
    this.#indexMetadataService = indexMetadataService
  }

  async checkChanges(): Promise<InferEntityType<typeof IndexMetadata>[]> {
    const schemaObjectRepresentation = this.#schemaObjectRepresentation

    const currentConfig = await this.#indexMetadataService.list()
    const currentConfigMap = new Map(
      currentConfig.map((c) => [c.entity, c] as const)
    )

    type modifiedConfig = {
      id?: string
      entity: string
      fields: string[]
      fields_hash: string
      status?: IndexMetadataStatus
    }[]

    const entityPresent = new Set<string>()
    const newConfig: modifiedConfig = []
    const updatedConfig: modifiedConfig = []
    const deletedConfig: { entity: string }[] = []

    for (const [entityName, schemaEntityObjectRepresentation] of Object.entries(
      schemaObjectRepresentation
    )) {
      if (schemaObjectRepresentationPropertiesToOmit.includes(entityName)) {
        continue
      }

      const entity = schemaEntityObjectRepresentation.entity
      const fields = schemaEntityObjectRepresentation.fields.sort().join(",")
      const fields_hash = simpleHash(fields)

      const existingEntityConfig = currentConfigMap.get(entity)

      entityPresent.add(entity)
      if (
        !existingEntityConfig ||
        existingEntityConfig.fields_hash !== fields_hash
      ) {
        const meta = {
          id: existingEntityConfig?.id,
          entity,
          fields,
          fields_hash,
        }

        if (!existingEntityConfig) {
          newConfig.push(meta)
        } else {
          updatedConfig.push({
            ...meta,
            status: IndexMetadataStatus.PENDING,
          })
        }
      }
    }

    for (const [entity] of currentConfigMap) {
      if (!entityPresent.has(entity)) {
        deletedConfig.push({ entity })
      }
    }

    if (newConfig.length > 0) {
      await this.#indexMetadataService.create(newConfig)
    }
    if (updatedConfig.length > 0) {
      await this.#indexMetadataService.update(updatedConfig)
    }
    if (deletedConfig.length > 0) {
      await this.#indexMetadataService.delete(deletedConfig)
    }

    return await this.#indexMetadataService.list({
      status: [IndexMetadataStatus.PENDING, IndexMetadataStatus.PROCESSING],
    })
  }
}
