/**
 * Transforms a value to number or returns the default value
 * when original value cannot be casted to number
 */
export function toNumber(value: unknown): number | undefined
export function toNumber<T>(value: unknown, defaultValue: T): number | T
export function toNumber<T>(
  value: unknown,
  defaultValue?: T
): number | undefined | T {
  const transformedValue = Number(value)
  return Number.isNaN(transformedValue)
    ? defaultValue ?? undefined
    : transformedValue
}
