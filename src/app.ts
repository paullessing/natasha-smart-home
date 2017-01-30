import * as express from 'express';
import * as morgan from 'morgan';

import {getDependencyContainer} from './util';
import {RouterCreator} from './util';
import {RootRouter} from './routers';

const app = express();

const container = getDependencyContainer(__dirname);
const router = container.get<RouterCreator>(RouterCreator).createRouter(container.get(RootRouter));

app.use(router);
app.use(morgan);

export {
  app
};
