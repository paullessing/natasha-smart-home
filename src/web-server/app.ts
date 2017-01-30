import * as express from 'express';
import {createRouter} from 'express-router-decorators';
import * as morgan from 'morgan';

import {getDependencyContainer} from './util';
import {RootRouter} from './routers';

const app = express();

const container = getDependencyContainer(__dirname);
const router = createRouter(container.get(RootRouter));

app.use(router);
app.use(morgan);

export {
  app
};
