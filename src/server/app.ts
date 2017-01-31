import * as express from 'express';
import {createRouter} from 'express-router-decorators';
import * as morgan from 'morgan';

import {Dependencies} from '../util';
import {RootRouter} from './routers';

const app = express();

const container = Dependencies.createContainer(__dirname);
const router = createRouter(container.get(RootRouter));

app.use(morgan('dev'));

app.use(router);

export {
  app
};
