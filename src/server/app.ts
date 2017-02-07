import * as cors from 'cors';
import * as express from 'express';
import {createRouter} from 'express-router-decorators';
import * as morgan from 'morgan';
import * as path from 'path';
import * as winston from 'winston';
import * as fallback from 'express-history-api-fallback';

import {Dependencies} from '../util';
import {ApiRouter} from './routers';
import {CommunicationService} from './communication/communication.service';

const app = express();

const container = Dependencies.createContainer(__dirname);
const router = createRouter(container.get(ApiRouter), { log: winston });

container.get(CommunicationService).connect();

app.use(morgan('dev'));

app.use('/api', cors({
  origin: ['http://localhost:4200', 'home.paullessing.com']
}), router);
app.use('/api/*', (req, res) => res.send(404).end());

const angularAppPath = path.join(__dirname, '../web');
app.use('/', express.static(angularAppPath));
app.use(fallback('index.html', { root: angularAppPath }));

export {
  app
};
