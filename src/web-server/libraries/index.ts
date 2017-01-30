import * as bodyParser from 'body-parser';
import * as winston from 'winston';

import {interfaces} from 'inversify';
import {Bindings} from '../../util';

export const LIBRARY_TYPES = {
  jsonBodyParser: Symbol('JSON BodyParser'),
  winston: Symbol('Winston')
};

@Bindings()
export class LibraryBindings {
  public static $bind(bind: interfaces.Bind): void {
    bind(LIBRARY_TYPES.jsonBodyParser).toConstantValue(bodyParser.json());
    bind(LIBRARY_TYPES.winston).toConstantValue(winston);
  }
}
