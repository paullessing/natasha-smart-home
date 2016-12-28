import * as express from 'express';

import {Service} from '../../util';

@Service()
export class ExpressRouterFactory {
  public create(): express.Router {
    return express.Router();
  }
}
