export interface Persistence {
  get<T>(key: string): T | null;
  put<T>(key: string, value: T): T; // Returns the entity
  del(key: string): void;
}

export const PERSISTENCE = Symbol('Persistence Service');
