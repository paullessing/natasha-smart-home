import * as express from 'express';
import {inject} from 'inversify';
import * as winston from 'winston';

import {Response} from './response';
import {Service} from '../../util';
import {LIBRARY_TYPES} from '../../libraries';

/**
 * This factory wraps a request handler. Instead of the request handler having to call properties on the Response,
 * it can return a Promise<Response> and this wrapper will return the values.
 */
@Service()
export class PromiseResponseMiddlewareFactory {
  constructor(
    @inject(LIBRARY_TYPES.winston) private log: winston.LoggerInstance
  ) {}

  public wrapRequestHandler(handler: express.RequestHandler): express.RequestHandler {
    return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
      let result = handler(req, res, next); // Because this is a middleware, not a handler, we pass `next()` in. We will never call it ourselves.
      if (!this.isPromise(result)) {
        // If the handler does not return a promise, we assume that it has handled the request successfully.
        return;
      }
      result
        .then((value: Response) => {
          if (value instanceof Response) {
            this.sendResponse(res, value);
          } else {
            this.log.warn('Response not valid:', value);
            res.status(500).end();
          }
        })
        .catch((err: any) => {
          if (err instanceof Response) {
            this.sendResponse(res, err);
          } else {
            this.log.warn('Uncaught error:', err);
            res.status(500).end();
          }
        });
    };
  }

  private sendResponse(res: express.Response, response: Response): void {
    res.status(response.responseCode);
    if (response.body) {
      if (typeof response.body === 'object') {
        res.json(response.body);
      } else {
        res.send(response.body as string);
      }
    }
    res.end();
  }

  /**
   * Simple test to see if something is a promise.
   * We could do `instanceof Promise`, but the simpler solution to ensure cross-compatibility is to see if it's thenable.
   */
  private isPromise(obj: any): boolean {
    if (!obj) {
      return false;
    }
    if (typeof obj !== 'object') {
      return false;
    }
    return typeof obj.then === 'function';
  }
}
