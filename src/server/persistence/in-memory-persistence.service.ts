import {interfaces} from 'inversify';

import {Persistence, PERSISTENCE} from './persistence-service.interface';
import {Bindings, Service} from '../../util';

@Service()
export class InMemoryPersistence implements Persistence {
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

@Bindings()
export class PersistenceBindings {
  public static $bind(bind: interfaces.Bind): void {
    bind(PERSISTENCE).to(InMemoryPersistence).inSingletonScope();
  }
}
