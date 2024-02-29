import { LoggingLevels } from "./types"

export default {
	logging: {
    defaultLevel: LoggingLevels.Info,
    dbName: 'picsio-logs',
    dbCollection: 'logs',
  },
  database: {
    tlsCAFile: process.env.MONGO_URI?.includes('127.0.0.1') ? undefined : 'resources/ca-certificate.crt',
  },
}