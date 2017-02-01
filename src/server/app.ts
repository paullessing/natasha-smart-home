import * as express from 'express';
import {createRouter} from 'express-router-decorators';
import * as morgan from 'morgan';

import {Dependencies} from '../util';
import {ApiRouter} from './routers';

const app = express();

const container = Dependencies.createContainer(__dirname);
const router = createRouter(container.get(ApiRouter), { log: console });

app.use(morgan('dev'));

app.use('/api', router);

export {
  app
};
