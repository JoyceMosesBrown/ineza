import mongoose, { Document, Schema } from 'mongoose';

export interface ITrackerEntry extends Document {
  userId: mongoose.Types.ObjectId;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5 | null;
  sleep: number;
  ate: 'yes' | 'little' | 'no' | null;
  cried: boolean | null;
  babyBond: number | null;
  anxiety: 'yes' | 'sometimes' | 'no' | null;
  social: boolean | null;
  riskLevel: 'low' | 'medium' | 'high';
  createdAt: Date;
}

const TrackerEntrySchema = new Schema<ITrackerEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    mood: { type: Number, min: 1, max: 5, default: null },
    sleep: { type: Number, min: 0, max: 12, default: 0 },
    ate: { type: String, enum: ['yes', 'little', 'no', null], default: null },
    cried: { type: Boolean, default: null },
    babyBond: { type: Number, min: 1, max: 5, default: null },
    anxiety: { type: String, enum: ['yes', 'sometimes', 'no', null], default: null },
    social: { type: Boolean, default: null },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
  },
  { timestamps: true }
);

TrackerEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

// Auto-calculate risk level before saving
TrackerEntrySchema.pre('save', function () {
  let riskScore = 0;
  if (this.mood !== null && this.mood <= 2) riskScore += 2;
  if (this.sleep < 3) riskScore += 2;
  if (this.ate === 'no') riskScore += 1;
  if (this.cried === true) riskScore += 1;
  if (this.babyBond !== null && this.babyBond <= 2) riskScore += 2;
  if (this.anxiety === 'yes') riskScore += 2;
  if (this.social === false) riskScore += 1;

  if (riskScore >= 7) this.riskLevel = 'high';
  else if (riskScore >= 4) this.riskLevel = 'medium';
  else this.riskLevel = 'low';
});

export default mongoose.model<ITrackerEntry>('TrackerEntry', TrackerEntrySchema);
