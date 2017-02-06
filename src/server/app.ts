import * as express from 'express';
import {createRouter} from 'express-router-decorators';
import * as morgan from 'morgan';
import * as winston from 'winston';

import {Dependencies} from '../util';
import {ApiRouter} from './routers';
import {CommunicationService} from './communication/communication.service';

const app = express();

const container = Dependencies.createContainer(__dirname);
const router = createRouter(container.get(ApiRouter), { log: winston });

container.get(CommunicationService).connect();

app.use(morgan('dev'));

app.use('/api', router);
app.get('/', (req, res) => { res.send('Online').end(); });
app.get('*', (req, res) => { res.status(404).end(); });

export {
  app
};
