import type { DB } from '../types';

export interface StorageAdapter {
  load(): Promise<DB | null>;
  save(data: DB): Promise<void>;
  clear(): Promise<void>;
}

export interface StorageFactory {
  create(): StorageAdapter;
  name: string;
  description: string;
}
