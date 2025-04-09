import { setTimeout } from "timers/promises"

export async function fetchAndRetry(
  func: () => Promise<any>,
  retries = 3,
  waitSeconds = 1
) {
  while (retries >= 0) {
    try {
      return await func()
    } catch (err) {
      if (retries > 0) {
        retries--
        await setTimeout(waitSeconds * 1000)
        continue
      }
      throw err
    }
  }
}
