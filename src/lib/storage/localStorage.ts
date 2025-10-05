import { dbSchema } from '../types';
import type { DB } from '../types';
import type { StorageAdapter, StorageFactory } from './index';

const STORAGE_KEY = 'hireflow.db.v1';

class LocalStorageAdapter implements StorageAdapter {
  async load(): Promise<DB | null> {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const result = dbSchema.safeParse(parsed);
    if (!result.success) {
      console.error('Failed to parse local storage DB', result.error);
      return null;
    }
    return result.data;
  }

  async save(data: DB): Promise<void> {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async clear(): Promise<void> {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export const localStorageFactory: StorageFactory = {
  name: 'LocalStorage',
  description: 'Stores data in this browser using localStorage.',
  create: () => new LocalStorageAdapter()
};
