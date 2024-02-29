import mongoose from "mongoose";
import Destination from "../models/destination";
import Settings from "../models/settings";
import { IDestination, ISettingsSchema } from "../types";
import logger from "../logger";

export const clearDb = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('[Tests utils] Can\'t clear db in envs other than "test"');
  }

  try {
    await mongoose.connection.db.dropDatabase();
  } catch (error) {
    throw new Error('Error removing test database');
  }
}

export const seedDb = async (destinations: IDestination[], settings: ISettingsSchema) => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('[Tests utils] Can\'t clear db in envs other than "test"');
  }

  try {
    await Promise.all([
      Destination.insertMany(destinations),
      Settings.create(settings),
    ]);
  } catch (e) {
    logger.error('[Test router] /seed - Error seeding the db');
  }
}