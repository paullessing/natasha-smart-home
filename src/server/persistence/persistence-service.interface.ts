export interface Persistence {
  get<T>(key: string): Promise<T | null>;
  put<T>(key: string, value: T): Promise<T>; // Returns the entity
  del(key: string): Promise<void>;
}

export const PERSISTENCE = Symbol('Persistence Service');
