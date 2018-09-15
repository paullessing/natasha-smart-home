import "reflect-metadata"; // Required for inversify
import * as winston from 'winston';

import {app} from './app';
import {configureVendors} from './vendors';
import * as minimist from 'minimist';

configureVendors(minimist(process.argv.slice(2)));

const port = 8080;

app.listen(port, () => {
  winston.info(`Server started on port ${port}`);
});
