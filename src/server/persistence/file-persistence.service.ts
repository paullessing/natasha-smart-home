import * as storage from 'node-persist';
import * as log from 'winston';

import {Service} from '../../util';
import {Persistence} from './persistence-service.interface';

@Service()
export class FilePersistence implements Persistence {

  private init: Promise<void>;

  constructor() {
    this.init = Promise.resolve(storage.init({
      dir: 'persistence'
    })).then(() => {
      log.info('Persistence initialised');
    });
  }

  public get<T>(key: string): Promise<T | null> {
    return this.init.then(
      () => storage.getItem(key)
    );
  }

  public put<T>(key: string, value: T): Promise<T> {
    return this.init
      .then(() => storage.setItem(key, value))
      .then(() => storage.persist())
      .then(() => value);
  }

  public del(key: string): Promise<void> {
    return this.init
      .then(() => storage.removeItem(key))
      .then(() => storage.persist())
      .then(() => {});
  }
}
