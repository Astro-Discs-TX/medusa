import {
  CommonEvents,
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  Event,
  ILockingModule,
  IndexTypes,
  ModulesSdkTypes,
  RemoteQueryFunction,
  SchemaObjectEntityRepresentation,
} from "@medusajs/types"
import { IndexMetadataStatus, Orchestrator } from "@utils"
import { IndexMetadataService } from "./index-metadata"

export class DataSynchronizer {
  #schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation
  #storageProvider: IndexTypes.StorageProvider
  #query: RemoteQueryFunction
  #locking: ILockingModule
  #orchestrator!: Orchestrator
  #indexMetadataService: IndexMetadataService
  #indexDataService: ModulesSdkTypes.IMedusaInternalService<any>

  constructor(container: Record<string, any>) {
    this.#query = container[
      ContainerRegistrationKeys.QUERY
    ] as RemoteQueryFunction
    this.#locking = container[Modules.LOCKING] as ILockingModule
    this.#indexMetadataService = container.indexMetadataService
    this.#indexDataService = container.indexDataService
  }

  setSchemaObjectRepresentation(
    schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation
  ) {
    this.#schemaObjectRepresentation = schemaObjectRepresentation
  }

  setStorageProvider(storageProvider: IndexTypes.StorageProvider) {
    this.#storageProvider = storageProvider
  }

  onApplicationStart({
    lockDuration = 1000 * 60 * 5,
  }: {
    lockDuration?: number
  } = {}) {
    this.#orchestrator = new Orchestrator(
      this.#locking,
      Object.keys(this.#schemaObjectRepresentation ?? {}),
      {
        lockDuration,
      }
    )
  }

  async syncData(
    entities: {
      entity: string
      fields: string
      fields_hash: string
    }[]
  ) {
    const updatedStatus = async (
      entity: string,
      status: IndexMetadataStatus
    ) => {
      await this.#indexMetadataService.update({
        data: {
          status,
        },
        selector: {
          entity,
        },
      })
    }

    const task = async (entity: string) => {
      await this.#indexDataService.update({
        data: {
          staled_at: new Date(),
        },
        selector: {
          name: entity,
        },
      })

      const finalAcknoledgement = await this.sync({
        entityName: entity,
        ack: async (acknoledgement: any) => {
          console.log(acknoledgement)
        },
      })

      console.log(finalAcknoledgement)

      // if (finalAcknoledgement.err) {
      // if (finalAcknoledgement.done) {
    }

    for (const entity of entities) {
      await updatedStatus(entity.entity, IndexMetadataStatus.PROCESSING)

      try {
        await this.#orchestrator.process(task)

        await updatedStatus(entity.entity, IndexMetadataStatus.DONE)
      } catch (e) {
        await updatedStatus(entity.entity, IndexMetadataStatus.ERROR)
      }
    }
  }

  async sync({
    entityName,
    pagination = {},
    ack,
  }: {
    entityName: string
    pagination?: {
      cursor?: string
      updated_at?: string | Date
      limit?: number
      batchSize?: number
    }
    ack: (ack: {
      lastCursor: string | null
      done?: boolean
      err?: Error
    }) => Promise<void>
  }) {
    const schemaEntityObjectRepresentation = this.#schemaObjectRepresentation[
      entityName
    ] as SchemaObjectEntityRepresentation

    const { fields, alias, moduleConfig } = schemaEntityObjectRepresentation

    const entityPrimaryKey = fields.find(
      (field) => !!moduleConfig.primaryKeys?.includes(field)
    )

    if (!entityPrimaryKey) {
      const acknoledgement = {
        lastCursor: pagination.cursor ?? null,
        err: new Error(
          `Entity ${entityName} does not have a linkable primary key`
        ),
      }

      void ack(acknoledgement)
      return acknoledgement
    }

    let processed = 0
    let currentCursor = pagination.cursor!
    const batchSize = pagination.batchSize ?? 1000
    const limit = pagination.limit ?? Infinity
    let done = false
    let error = null

    while (processed < limit || !done) {
      const filters: Record<string, any> = {}

      if (currentCursor) {
        filters[entityPrimaryKey] = { $gt: currentCursor }
      }

      if (pagination.updated_at) {
        filters["updated_at"] = { $gt: pagination.updated_at }
      }

      const { data } = await this.#query.graph({
        entity: alias,
        fields: [entityPrimaryKey],
        filters,
        pagination: {
          order: {
            [entityPrimaryKey]: "asc",
          },
          take: batchSize,
        },
      })

      done = !data.length
      if (done) {
        break
      }

      const envelop: Event = {
        data,
        name: `*.${CommonEvents.CREATED}`,
      }

      try {
        await this.#storageProvider.consumeEvent(
          schemaEntityObjectRepresentation
        )(envelop)
        currentCursor = data[data.length - 1][entityPrimaryKey]
        processed += data.length

        void ack({ lastCursor: currentCursor })
      } catch (err) {
        error = err
        break
      }
    }

    let acknoledgement: { lastCursor: string; done?: boolean; err?: Error } = {
      lastCursor: currentCursor,
      done: true,
    }

    if (error) {
      acknoledgement = {
        lastCursor: currentCursor,
        err: error,
      }
      void ack(acknoledgement)
      return acknoledgement
    }

    void ack(acknoledgement)
    return acknoledgement
  }
}
