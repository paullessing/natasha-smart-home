import * as winston from 'winston';
import {ParsedArgs} from 'minimist';

function configureWinston(argv: ParsedArgs): void {
  const logLevel = argv['log'] || process.env.LOG_LEVEL || 'warn';

  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {
    level: logLevel,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    colorize: true
  });
  // winston.add(winston.transports.File, {
  //   name: 'info-log',
  //   level: 'info',
  //   json: false,
  //   filename: '/var/log/natasha.log'
  // });
  // winston.add(winston.transports.File, {
  //   name: 'error-log',
  //   level: 'warn',
  //   json: false,
  //   filename: '/var/log/natasha.error.log',
  //   handleExceptions: true,
  //   humanReadableUnhandledException: true
  // });
  Object.assign(winston, { exitOnError: false });
}

export function configureVendors(argv: ParsedArgs): void {
  configureWinston(argv);
}
