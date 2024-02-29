import mongoose from 'mongoose';
import { IDestination } from '../types';
const { Schema } = mongoose;

const destinationSchema = new Schema(
  {
    destinationName: {
      type: String,
      required: true,
    },
    transport: {
      type: String,
      required: true,
    },
    url: String
  },
  { timestamps: true }
);

export default mongoose.model<IDestination>('Destination', destinationSchema);
