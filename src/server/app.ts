import * as express from 'express';
import {createRouter} from 'express-router-decorators';
import * as morgan from 'morgan';

import {Dependencies} from '../util';
import {ApiRouter} from './routers';
import {CommunicationService} from './communication/communication.service';

const app = express();

const container = Dependencies.createContainer(__dirname);
const router = createRouter(container.get(ApiRouter), { log: console });

container.get(CommunicationService).connect();

app.use(morgan('dev'));

app.use('/api', router);

export {
  app
};
