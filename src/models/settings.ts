import mongoose, { Model } from 'mongoose';
import { ISettings, ISettingsSchema } from '../types';
const { Schema } = mongoose;

const settingsSchema = new Schema(
  {
    defaultStrategy: {
      type: String,
      enum: ['ALL', 'IMPORTANT', 'SMALL']
    },
  },
  { timestamps: true }
);

settingsSchema.statics = {
  getSettings: function () {
    const res = this.findOne().sort({ updatedAt: -1 });
    if (!res) {
      throw new Error('Settings not found in the db');
    }
    return res;
  }
}

export default mongoose.model<ISettingsSchema, ISettings>('Settings', settingsSchema);
