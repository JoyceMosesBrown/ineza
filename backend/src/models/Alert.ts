import mongoose, { Document, Schema } from 'mongoose';

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  chwId: mongoose.Types.ObjectId;
  type: 'sos' | 'high_risk' | 'missed_checkin';
  message: string;
  resolved: boolean;
  resolvedAt?: Date;
  createdAt: Date;
}

const AlertSchema = new Schema<IAlert>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chwId: { type: Schema.Types.ObjectId, ref: 'CHW', required: true },
    type: {
      type: String,
      enum: ['sos', 'high_risk', 'missed_checkin'],
      required: true,
    },
    message: { type: String, required: true },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IAlert>('Alert', AlertSchema);
