import { useCallback, useState } from "react"
import { Type } from "../types"
import { defaultsTo } from "../utils"
import {
  restoreLocalIdsMap,
  storeMapLocally,
  toValidIdsMap,
} from "./usePersistentClickedState.utils"

export function usePersistentClickedState<T>(
  localStorageKey: string
): [string[], (id: Type.Id, expirationDate: string) => void] {
  const [storedIdsMap, setStoredIdsMap] = useState<Map<string, Type.Id[]>>(() =>
    toValidIdsMap(restoreLocalIdsMap(localStorageKey))
  )

  const storedIds = Array.from(storedIdsMap.values()).flat()
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
          id,
        ])
        storeMapLocally(newStoredIdsMap, localStorageKey)
        setStoredIdsMap(newStoredIdsMap)
      } catch {
        return
      }
    },
    [storedIds, storedIdsMap, localStorageKey]
  )

  return [storedIds, onStoreId]
}
