import winston from 'winston';
import os from 'node:os';
import 'winston-mongodb';
import config from './config';
import { CustomLogger, LoggerMeta, LoggingLevels } from './types';

const { combine, timestamp, errors, metadata, printf } = winston.format;

const myFormat = printf((info) => {
  return `${info.timestamp} ${info.service ? `${info.service}:` : ''} [${info.label ? `${info.label}` : ''}] ${
    info.level
  }: ${info.message} ${info.metadata?.data ? JSON.stringify(info.metadata.data) : ''}`;
});

const defaultMeta = {
  source: 'picsio',
  context: {
    process: {
      pid: process.pid,
      cwd: process.cwd(),
      execPath: process.execPath,
      version: process.version,
      argv: process.argv,
    },
    os: {
      arch: os.arch(),
      cpus: os.cpus(),
      freemem: os.freemem(),
      homedir: os.homedir(),
      loadavg: os.loadavg(),
      uptime: os.uptime(),
      version: os.version(),
    },
  },
};

const customLevels = {
  levels: {
    [LoggingLevels.Critical]: 0,
    [LoggingLevels.Error]: 1,
    [LoggingLevels.Warning]: 2,
    [LoggingLevels.Info]: 3,
    [LoggingLevels.Debug]: 4,
  },
};

const mongoDBConnectionOptions = {
  db: process.env.MONGO_URI || '',
  dbName: config.logging.dbName,
  collection: config.logging.dbCollection,
  options: {
    connectTimeoutMS: 30000,
    tlsCAFile: config.database.tlsCAFile,
    useUnifiedTopology: true,
  },
  level: config.logging.defaultLevel,
  storeHost: true,
};

const transports =
  process.env.NODE_ENV === 'test'
    ? [
      new winston.transports.Console({
        level: config.logging.defaultLevel
      })
    ]
    : [
      new winston.transports.Console({
        level: config.logging.defaultLevel,
      }),
      new winston.transports.MongoDB(mongoDBConnectionOptions),
    ]

const exceptionHandlers =
  process.env.NODE_ENV === 'test'
    ? [
      new winston.transports.Console({
        level: config.logging.defaultLevel,
      }),
    ]
    : [
      new winston.transports.Console({
        level: config.logging.defaultLevel,
      }),
      new winston.transports.MongoDB(mongoDBConnectionOptions),
    ]

const winstonLogger = winston.createLogger({
  levels: customLevels.levels,
  defaultMeta,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YY-MM-DD hh:mm:ss' }),
    metadata({ fillWith: ['source', 'context', 'data', 'error'] }),
    myFormat
  ),
  transports,
  exceptionHandlers,
});

const logger: CustomLogger = {
  log: () => {},
  error: () => {},
  critical: () => {},
  warning: () => {},
  debug: () => {},
  info: () => {},
};
const logLevels = Object.values(LoggingLevels);

logLevels.forEach((level) => {
  logger[level] = (message: string, meta?: LoggerMeta) => {
    winstonLogger.log(level as string, message, meta);
  };
});

logger.log = (level: LoggingLevels, message: string, meta?: LoggerMeta) => {
  winstonLogger.log(level, message, meta);
};

export default logger;
