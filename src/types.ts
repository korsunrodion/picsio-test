import { Model } from "mongoose";

export enum LoggingLevels {
  Critical = 'critical',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug',
}

export interface LoggerMeta {
  source?: string;
  context?: any;
  error?: any;
  data?: any;
  label?: string;
}

type CustomLoggerLevelNamedMethods = {
  [level in LoggingLevels]: (message: string, meta?: LoggerMeta) => void;
};

export type CustomLogger = CustomLoggerLevelNamedMethods & {
  log: (level: LoggingLevels, message: string, meta?: LoggerMeta) => void;
};

export type RoutingIntent = {
  destinationName: string;
  important: boolean;
  bytes: number;
};

export interface ISettingsSchema {
  defaultStrategy: 'ALL' | 'IMPORTANT' | 'SMALL';
}

export interface ISettings extends Model<ISettingsSchema> {
  getSettings: () => Promise<ISettingsSchema>
}

export interface IDestination {
  destinationName: string;
  transport: string;
  url?: string;
}