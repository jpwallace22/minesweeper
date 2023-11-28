import { useCallback, useEffect, useState } from 'react';
import { Store as Tauri } from 'tauri-plugin-store-api';
import { Difficulty } from '../settings/useSettings';

export interface StoreSchema {
  settings: {
    difficulty: Difficulty;
  };
  scores: {
    easy: number[];
    medium: number[];
    hard: number[];
  };
}

export const initialState = {
  settings: {
    difficulty: 'easy',
  },
  scores: {
    easy: [],
    medium: [],
    hard: [],
  },
};

const stores: Record<string, Tauri> = {};
function getTauriStore(filename: string) {
  if (!(filename in stores)) {
    stores[filename] = new Tauri(filename);
  }
  return stores[filename];
}

/**
 * A hook that allows components to interact with a Tauri store.
 * The hook manages the state of a value stored in the Tauri store and provides functions to update and retrieve the value.
 * This is data that will be written to the disk
 *
 * @param key - The key used to identify the value in the Tauri store.
 * @param defaultValue - The default value to use if the value is not found in the Tauri store.
 * @param storeName - The name of the Tauri store file. Defaults to 'minesweeper_data.dat'.
 * @returns A tuple containing the state variable, setState function, and loading variable.
 */
export function useTauriStore<
  TKey extends keyof StoreSchema & string,
  TValue extends StoreSchema
>(
  key: TKey,
  defaultValue: TValue[TKey] = initialState[key] as TValue[TKey],
  storeName = '.ms_settings.json'
) {
  const [state, setState] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const store = getTauriStore(storeName);

  const updateStore = useCallback(
    async (value: TValue[TKey]) => {
      if (!loading) {
        setLoading(true);
        store.set(key as string, value).then(() => {
          store.save();
        });
      }
      setLoading(false);
    },
    [key, loading, store]
  );

  useEffect(() => {
    (async () => {
      const value: string | object | Array<unknown> | null = await store.get(
        key
      );

      if (isValidValue(value)) {
        setState(value as TValue[TKey]);
      } else {
        updateStore(defaultValue);
      }
    })();
    setLoading(false);
  }, [defaultValue, key, store, updateStore]);

  useEffect(() => {
    updateStore(state as TValue[TKey]);
  }, [state, updateStore]);

  return [state, setState] as const;
}

const isValidValue = (value: unknown) => {
  return (
    value !== null &&
    value !== undefined &&
    (!Array.isArray(value) || value.length > 0) &&
    (typeof value !== 'object' || Object.keys(value).length > 0)
  );
};

export type Store = typeof useTauriStore;
