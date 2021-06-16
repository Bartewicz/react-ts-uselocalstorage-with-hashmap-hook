import { useCallback, useEffect, useState } from "react"
import { Type } from "../types"
import { defaultsTo } from "../utils"
import {
  restoreLocalIdsMap,
  storeMapLocally,
  toValidIdsMap,
} from "./usePersistentClickedState.utils"

export function usePersistentClickedState(
  localStorageKey: string
): [string[], (id: Type.Id, expirationDate: string) => void] {
  const [storedIdsMap, setStoredIdsMap] = useState<Map<string, Type.Id[]>>(() =>
    toValidIdsMap(restoreLocalIdsMap(localStorageKey))
  )

  useEffect(() => {
    function onStorageUpdate() {
      const updatedIdsMap = restoreLocalIdsMap(localStorageKey)
      setStoredIdsMap(updatedIdsMap)
    }

    window.addEventListener("storage", onStorageUpdate)
    return () => window.removeEventListener("storage", onStorageUpdate)
  }, [])

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
