import { useConfig } from './useConfig';
import { useLocalStorage } from './useLocalStorage';
import { StoreSchema, Store, useTauriStore } from './useTauriStore';

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

export const useStorage: Store = <
  TKey extends keyof StoreSchema & string,
  TValue extends StoreSchema
>(
  key: TKey,
  defaultValue: TValue[TKey] = initialState[key] as TValue[TKey],
  storeName = '.ms_settings.json'
) => {
  const { isWeb } = useConfig();
  if (isWeb) {
    return useLocalStorage(key, JSON.stringify(defaultValue));
  } else {
    return useTauriStore(key, defaultValue, storeName);
  }
};
