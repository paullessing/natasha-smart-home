declare module 'express-history-api-fallback' {
  import * as express from 'express';

  namespace expressHistoryApiFallback {
    interface FallbackFunction {
      (path: string, options?: any): express.RequestHandler;
    }
  }

  var fallback: expressHistoryApiFallback.FallbackFunction;

  export = fallback;
}
