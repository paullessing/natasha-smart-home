export interface Persistence {
  get<T>(key: string): T;
  put<T>(key: string, value: T): T; // Returns the entity
  del(key: string): void;
}

export const PERSISTENCE = Symbol('Persistence Service');
