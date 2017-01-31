import {Bindings, Service} from '../../util/inject';
import {interfaces} from 'inversify';
export interface PersistenceService {
  get<T>(key: string): T;
  put<T>(key: string, value: T): T; // Returns the entity
  del(key: string): void;
}

@Service()
export class InMemoryPersistence implements PersistenceService{
  private data: { [key: string]: any } = {};

  public get<T>(key: string): T {
    return this.data[key] as T;
  }

  public put<T>(key: string, value: T): T {
    this.data[key] = value;
    return value;
  }

  public del(key: string): void {
    this.data[key] = null;
  }
}

export const PERSISTENCE = Symbol('Persistence Service');

@Bindings()
export class PersistenceBindings {
  public static $bind(bind: interfaces.Bind): void {
    bind(PERSISTENCE).to(InMemoryPersistence).inSingletonScope();
  }
}
