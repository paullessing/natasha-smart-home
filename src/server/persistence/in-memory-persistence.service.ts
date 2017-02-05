import {Persistence} from './persistence-service.interface';
import {Service} from '../../util';

@Service()
export class InMemoryPersistence implements Persistence {
  private data: { [key: string]: any } = {};

  public get<T>(key: string): Promise<T | null> {
    return Promise.resolve(this.data[key] as T || null);
  }

  public put<T>(key: string, value: T): Promise<T> {
    this.data[key] = value;
    return Promise.resolve(value);
  }

  public del(key: string): Promise<void> {
    this.data[key] = null;
    return Promise.resolve();
  }
}

