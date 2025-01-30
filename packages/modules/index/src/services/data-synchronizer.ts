import {
  CommonEvents,
  ContainerRegistrationKeys,
  Modules,
  promiseAll,
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

export class DataSynchronizer {
  #container: Record<string, any>
  #isReady: boolean = false
  #schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation
  #storageProvider: IndexTypes.StorageProvider
  #orchestrator!: Orchestrator

  get #query() {
    return this.#container[
      ContainerRegistrationKeys.QUERY
    ] as RemoteQueryFunction
  }

  get #locking() {
    return this.#container[Modules.LOCKING] as ILockingModule
  }

  get #indexMetadataService() {
    return this.#container.indexMetadataService
  }

  get #indexSyncService(): ModulesSdkTypes.IMedusaInternalService<any> {
    return this.#container.indexSyncService
  }

  get #indexDataService(): ModulesSdkTypes.IMedusaInternalService<any> {
    return this.#container.indexDataService
  }

  get #indexRelationService(): ModulesSdkTypes.IMedusaInternalService<any> {
    return this.#container.indexRelationService
  }

  constructor(container: Record<string, any>) {
    this.#container = container
  }

  #isReadyOrThrow() {
    if (!this.#isReady) {
      throw new Error(
        "DataSynchronizer is not ready. Call onApplicationStart first."
      )
    }
  }

  onApplicationStart({
    schemaObjectRepresentation,
    storageProvider,
  }: {
    lockDuration?: number
    schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation
    storageProvider: IndexTypes.StorageProvider
  }) {
    this.#storageProvider = storageProvider
    this.#schemaObjectRepresentation = schemaObjectRepresentation

    this.#isReady = true
  }

  async syncEntities(
    entities: {
      entity: string
      fields: string
      fields_hash: string
    }[],
    lockDuration: number = 1000 * 60 * 5
  ) {
    this.#isReadyOrThrow()
    const entitiesToSync = entities.map((entity) => entity.entity)
    this.#orchestrator = new Orchestrator(this.#locking, entitiesToSync, {
      lockDuration,
    })
    await this.#orchestrator.process(this.#taskRunner.bind(this))
  }

  async removeEntities(entities: string[], staleOnly: boolean = false) {
    this.#isReadyOrThrow()

    const staleCondition = staleOnly ? { staled_at: { $ne: null } } : {}

    // Clean up staled data
    await this.#indexRelationService.delete({
      ...staleCondition,
      $or: entities.flatMap((entity) => [
        { parent_name: entity },
        { child_name: entity },
      ]),
    })

    await this.#indexDataService.delete({
      ...staleCondition,
      name: entities,
    })
  }

  async #updatedStatus(entity: string, status: IndexMetadataStatus) {
    await this.#indexMetadataService.update({
      data: {
        status,
      },
      selector: {
        entity,
      },
    })
  }

  async #taskRunner(entity: string) {
    const [, , [lastCursor]] = await promiseAll([
      this.#updatedStatus(entity, IndexMetadataStatus.PROCESSING),
      this.#indexDataService.update({
        data: {
          staled_at: new Date(),
        },
        selector: {
          name: entity,
        },
      }),
      this.#indexSyncService.list(
        {
          entity,
        },
        {
          select: ["last_key"],
        }
      ),
    ])

    const finalAcknoledgement = await this.syncEntity({
      entityName: entity,
      pagination: {
        cursor: lastCursor?.last_key,
      },
      ack: async (ack) => {
        const promises: Promise<any>[] = []

        if (ack.lastCursor) {
          promises.push(
            this.#indexSyncService.update({
              data: {
                last_key: ack.lastCursor,
              },
              selector: {
                entity: entity,
              },
            })
          )

          if (!ack.done && !ack.err) {
            promises.push(this.#orchestrator.renewLock(entity))
          }
        }

        await promiseAll(promises)
      },
    })

    if (finalAcknoledgement.done) {
      await promiseAll([
        this.#updatedStatus(entity, IndexMetadataStatus.DONE),
        this.#indexSyncService.update({
          data: {
            last_key: finalAcknoledgement.lastCursor,
          },
          selector: {
            entity: entity,
          },
        }),
        this.removeEntities([entity], true),
      ])
    }

    if (finalAcknoledgement.err) {
      await this.#updatedStatus(entity, IndexMetadataStatus.ERROR)
    }
  }

  async syncEntity({
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
  }): Promise<{
    lastCursor: string | null
    done?: boolean
    err?: Error
  }> {
    this.#isReadyOrThrow()

    const schemaEntityObjectRepresentation = this.#schemaObjectRepresentation[
      entityName
    ] as SchemaObjectEntityRepresentation

    const { fields, alias, moduleConfig } = schemaEntityObjectRepresentation
    const isLink = !!moduleConfig?.isLink

    const entityPrimaryKey = fields.find(
      (field) => !!moduleConfig?.primaryKeys?.includes(field)
    )

    if (!entityPrimaryKey) {
      // TODO: for now these are skiped
      const acknoledgement = {
        lastCursor: pagination.cursor ?? null,
        done: true,
      }

      await ack(acknoledgement)
      return acknoledgement
    }

    let processed = 0
    let currentCursor = pagination.cursor!
    const batchSize = Math.min(pagination.batchSize ?? 100, 100)
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
        name: !isLink
          ? `*.${CommonEvents.CREATED}`
          : `*.${CommonEvents.ATTACHED}`,
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
