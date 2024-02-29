import 'dotenv/config';
import mongoose from 'mongoose';
import logger from '../logger';
import config from '../config';

const mongooseOptions: mongoose.ConnectOptions = {
  connectTimeoutMS: 30000,
  tlsCAFile: config.database.tlsCAFile,
};

export default {
  connect(): void {
    const uri = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO_URI : process.env.MONGO_URI
    mongoose
      .connect(`${uri}`, mongooseOptions)
      .then(() => logger.info('[Server] MongoDB connected'))
      .catch((err: unknown) =>
        logger.error(`[Server] Mongoose connection error ${err}`, {
          error: err,
        }),
      );
  },
};
