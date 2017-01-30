import * as express from 'express';
import {createRouter} from 'express-router-decorators';
import * as morgan from 'morgan';

import {RootRouter} from './routers';
import {Dependencies} from '../util';

const app = express();

const container = Dependencies.createContainer(__dirname);
const router = createRouter(container.get(RootRouter));

app.use(router);
app.use(morgan);

export {
  app
};
