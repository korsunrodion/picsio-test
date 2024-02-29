import 'dotenv/config';
import express from 'express';
import db from './services/databaseService';
import logger from './logger';
import { createServer } from 'http';
import eventsRouter from './routes/events';

const app = express();

db.connect();

app.use(express.json());

app.use('/api/events', eventsRouter);

const PORT = process.env.PORT;

const server = createServer(app);

server.listen(PORT, () => {
  logger.info(`[Server] Server is listening on port ${PORT}`);
});

process.on('uncaughtException', (error) => {
  logger.error(`[Server] Error uncaughtException at: ${error.name}. Message: ${error.message}`);
});

process.on('unhandledRejection', (reason: unknown, promise) => {
  logger.error(`[Server] Error unhandledRejection at: ${promise}, reason: ${reason}`);
});

export default app;
