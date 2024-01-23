import { createLogger, format, transports, addColors } from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  test: 5,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'voilet',
  debug: 'white',
};

addColors(colors);
const { combine, timestamp, json, errors, align, printf, colorize } = format;
const errorsFormat = errors({ stack: true });

const logger = createLogger({
    levels,
    level: 'info',
    exitOnError: false,
    format: json(),
    transports: [
        new transports.Console({
          format: combine(
            timestamp({
              format: 'YYYY-MM-DD hh:mm:ss.SSS A',
            }), 
            json(), 
            align(), 
            colorize({ all: true }), 
            errorsFormat, 
            printf((info) => `[${info.timestamp}] ${info.level}: ${info.message} \n ${ info.metadata ? info.metadata : ''}`)),
        }),
        new transports.File({
          filename: 'logs/combined.log',
        }),
        new transports.File({
          filename: 'logs/errors.log',
          level: 'error',
        }),
    ],
});

export { logger };