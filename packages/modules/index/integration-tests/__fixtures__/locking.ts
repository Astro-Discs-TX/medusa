import { Context, ILockingModule } from "@medusajs/types"

export class LockingModuleMock implements ILockingModule {
  #lockEntities: Set<string> = new Set()
  async execute<T>(
    keys: string | string[],
    job: () => Promise<T>,
    args?: {
      timeout?: number
      provider?: string
    },
    sharedContext?: Context
  ): Promise<T> {
    return job()
  }

  async acquire(
    key: string,
    args?: {
      ownerId?: string | null
      expire?: number
      provider?: string
    },
    sharedContext?: Context
  ): Promise<void> {
    if (this.#lockEntities.has(key)) {
      throw new Error("Lock already exists")
    }
    this.#lockEntities.add(key)
  }

  async release(
    key: string,
    args?: {
      ownerId?: string | null
      provider?: string
    },
    sharedContext?: Context
  ): Promise<boolean> {
    this.#lockEntities.delete(key)
    return true
  }

  async releaseAll(
    args?: {
      ownerId?: string | null
      provider?: string
    },
    sharedContext?: Context
  ): Promise<void> {
    return Promise.resolve()
  }
}
