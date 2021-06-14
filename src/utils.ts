import moment, { Moment } from "moment"

export function defaultsTo<T, S>(
  value: T | null | undefined,
  defaultValue: S
): T | S {
  return value === null || value === undefined ? defaultValue : value
}

export function isAfter(borderDate: Moment): (date: Moment) => boolean {
  return (comparedDate: Moment) => comparedDate.isAfter(borderDate)
}

export function isSameOrBefore(borderDate: Moment): (date: Moment) => boolean {
  return (comparedDate: Moment) => comparedDate.isSameOrBefore(borderDate)
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null
}

function isNotUndefined<T>(value?: T): value is T {
  return value !== undefined
}

export function isValidRecord<T>(unknown: any): unknown is Record<string, T> {
  return (
    isNotNull(unknown) &&
    isNotUndefined(unknown) &&
    Object.getPrototypeOf(unknown) === Object.prototype
  )
}

export function toMomentISODate(date: string): Moment {
  return moment(date, moment.ISO_8601, true)
}
