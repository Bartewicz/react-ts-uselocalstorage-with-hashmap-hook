import { useCallback, useEffect, useState } from 'react';
import { Type } from '../types';
import { defaultsTo } from '../utils';
import {
  ClickedState,
  Item,
  restoreLocalIdsMap,
  storeMapLocally,
  toItemWithClickedState,
  toValidIdsMap
} from './usePersistentClickedState.utils';

const MINUTE = 60000; // ms

export function usePersistentClickedState<T>(
  items: Item<T>[] | null,
  localStorageKey: string,
  refreshInterval: number = MINUTE
): [(Item<T> & ClickedState)[], (id: Type.Id, expirationDate: string) => void] {
  const [storedIdsMap, setStoredIdsMap] = useState<Map<string, Type.Id[]>>(() =>
    toValidIdsMap(restoreLocalIdsMap(localStorageKey))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('interval');
      const validIdsMap = toValidIdsMap(storedIdsMap);
      if (!Object.is(storedIdsMap, validIdsMap)) {
        storeMapLocally(validIdsMap, localStorageKey);
        setStoredIdsMap(validIdsMap);
      }
    }, refreshInterval);
    return () => clearInterval(interval);
  });

  const storedIds = [...storedIdsMap.values()].flat();
  const onStoreId = useCallback(
    (id: string, expirationDate: string): void => {
      try {
        if (storedIds.some(storedId => storedId === id)) {
          return;
        }
        const currentIdsAtSameKey = defaultsTo(
          storedIdsMap.get(expirationDate),
          []
        );
        const newStoredIdsMap = new Map(storedIdsMap).set(expirationDate, [
          ...currentIdsAtSameKey,
          id
        ]);
        storeMapLocally(newStoredIdsMap, localStorageKey);
        setStoredIdsMap(newStoredIdsMap);
      } catch {
        return;
      }
    },
    [storedIds, storedIdsMap, localStorageKey]
  );

  const itemsWithClickedState = defaultsTo(items, [] as Item<T>[]).map(
    toItemWithClickedState(storedIds)
  );

  return [itemsWithClickedState, onStoreId];
}
