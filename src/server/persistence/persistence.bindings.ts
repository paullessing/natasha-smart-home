import {interfaces} from 'inversify';

import {Bindings} from '../../util';
import {PERSISTENCE} from './persistence-service.interface';
import {FilePersistence} from './file-persistence.service';

@Bindings()
export class PersistenceBindings {
  public static $bind(bind: interfaces.Bind): void {
    bind(PERSISTENCE).to(FilePersistence).inSingletonScope();
  }
}
