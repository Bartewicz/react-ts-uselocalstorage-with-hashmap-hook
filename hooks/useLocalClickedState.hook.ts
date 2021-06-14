import { useCallback, useEffect, useState } from "react"
import { Type } from "../types"
import { defaultsTo } from "../utils"
import {
  ClickedState,
  Item,
  restoreLocalIdsMap,
  storeMapLocally,
  toItemWithClickedState,
  toValidIdsMap
} from "./useLocalClickedState.utils"

const MINUTE = 60000 // ms

export function useLocalClickedState<T>(
  items: Item<T>[] | null,
  localStorageKey: string,
  refreshInterval: number = MINUTE
): [(Item<T> & ClickedState)[], (id: Type.Id, expirationDate: string) => void] {
  const [storedIdsMap, setStoredIdsMap] = useState<Map<string, Type.Id[]>>(() =>
    toValidIdsMap(restoreLocalIdsMap(localStorageKey))
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const validIdsMap = toValidIdsMap(storedIdsMap)
      if (!Object.is(storedIdsMap, validIdsMap)) {
        storeMapLocally(validIdsMap, localStorageKey)
        setStoredIdsMap(validIdsMap)
      }
    }, refreshInterval)
    return () => clearInterval(interval)
  }, [])

  const storedIds = [...storedIdsMap.values()].flat()
  const onStoreId = useCallback(
    (id: string, expirationDate: string): void => {
      try {
        if (storedIds.some(storedId => storedId === id)) {
          return
        }
        const currentIdsAtSameKey = defaultsTo(
          storedIdsMap.get(expirationDate),
          []
        )
        const newStoredIdsMap = new Map(storedIdsMap).set(expirationDate, [
          ...currentIdsAtSameKey,
          id
        ])
        storeMapLocally(newStoredIdsMap, localStorageKey)
        setStoredIdsMap(newStoredIdsMap)
      } catch {
        return
      }
    },
    [storedIds, localStorageKey]
  )

  const itemsWithClickedState = defaultsTo(items, [] as Item<T>[]).map(
    toItemWithClickedState(storedIds)
  )

  return [itemsWithClickedState, onStoreId]
}
