import moment, { Moment } from "moment"
import { Type } from "../types"
import {
  isAfter,
  isNotNull,
  isSameOrBefore,
  isValidRecord,
  toMomentISODate
} from "../utils"

export type Item<T> = T & { id: string }

export type ClickedState = {
  isClicked: boolean
}

export type IdsMap = Map<string, Type.Id[]>

export function restoreLocalIdsMap(localStorageKey: string): IdsMap {
  try {
    const stored = localStorage.getItem(localStorageKey)
    const parsed = isNotNull(stored) ? JSON.parse(stored) : null
    return isValidRecord<Type.Id[]>(parsed)
      ? new Map(Object.entries(parsed))
      : new Map()
  } catch {
    return new Map()
  }
}

export function toNewIdsMap(
  oldIdsMap: IdsMap
): (newIdsMap: IdsMap, date: Moment) => IdsMap {
  return (newIdsMap: IdsMap, date: Moment) => {
    const key = date.utc().toISOString()
    return newIdsMap.set(key, oldIdsMap.get(key))
  }
}

export function toValidIdsMap(oldIdsMap: IdsMap): IdsMap {
  const expirationDates = [...oldIdsMap.keys()].map(toMomentISODate)
  const now = moment().utc()
  if (expirationDates.some(isSameOrBefore(now))) {
    const validDates = expirationDates.filter(isAfter(now))
    const validIdsMap = validDates.reduce(toNewIdsMap(oldIdsMap), new Map())
    return validIdsMap
  }
  return oldIdsMap
}

export function storeMapLocally(map: IdsMap, key: string): void {
  localStorage.setItem(key, JSON.stringify(Object.fromEntries(map)))
}

export function toItemWithClickedState<T>(
  storedIds: Type.Id[]
): (item: Item<T>) => Item<T> & ClickedState {
  return item => ({
    ...item,
    isClicked: storedIds.includes(item.id)
  })
}
