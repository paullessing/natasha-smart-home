import * as express from 'express';
import {getDependencyContainer} from './util';
import {RouterCreator} from './util';
import {RootRouter} from './routers';

const app = express();

const container = getDependencyContainer(__dirname);
const router = container.get<RouterCreator>(RouterCreator).createRouter(container.get(RootRouter));

app.use(router);

export {
  app
};
